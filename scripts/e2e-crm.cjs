const { chromium } = require('playwright');

const BASE = 'http://localhost:3300';
const EMAIL = 'admin@buttsproductions.com';
const PASSWORD = 'ChangeMe123!';

const RUN = String(Date.now()).slice(-6);
const TEST_NAME = `Granby Street Cleaning Co ${RUN}`;
const TEST_SLUG = `granby-street-cleaning-co-${RUN}`;

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`[e2e] ${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ' :: ' + detail : ''}`);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  // ---- 1. Public site renders from fallback content -------------------
  const baseRes = await page.goto(`${BASE}/businesses`, { waitUntil: 'networkidle' });
  check('public businesses page renders', baseRes.status() === 200, `status ${baseRes.status()}`);
  const baseline = await page.locator('body').innerText();
  check('fallback content present', baseline.includes('Keeping it Kleen'), 'Keeping it Kleen listed');

  // ---- 2. Admin is protected ------------------------------------------
  await page.goto(`${BASE}/admin/businesses`, { waitUntil: 'networkidle' });
  check('unauthenticated admin redirected to login', page.url().includes('/admin/login'), page.url());

  // ---- 3. Log in --------------------------------------------------------
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL((u) => !u.pathname.includes('/admin/login'), { timeout: 25000 });
  await page.waitForLoadState('networkidle');
  check('login succeeds', !page.url().includes('/admin/login'), page.url());

  // ---- 4. Dashboard metrics are real ------------------------------------
  await page.goto(`${BASE}/admin/dashboard`, { waitUntil: 'networkidle' });
  const dash = await page.locator('body').innerText();
  check('dashboard renders metric cards', /Businesses/.test(dash) && /Team/.test(dash));
  check('dashboard renders recent activity table', /Recent activity/i.test(dash));

  // ---- 5. Every admin nav destination resolves --------------------------
  const navTargets = ['businesses', 'services', 'products', 'events', 'faqs', 'team', 'media', 'settings'];
  const navResults = [];
  for (const target of navTargets) {
    const res = await page.goto(`${BASE}/admin/${target}`, { waitUntil: 'networkidle' });
    const body = await page.locator('body').innerText();
    const broken = /couldn.t load|Internal Server Error/i.test(body);
    navResults.push(`${target}=${res.status()}${broken ? ' (error page)' : ''}`);
  }
  check(
    'all admin sections load without error',
    navResults.every((entry) => entry.endsWith('200')),
    navResults.join(' ')
  );

  // ---- 6. Create a business through the UI ------------------------------
  await page.goto(`${BASE}/admin/businesses/new`, { waitUntil: 'networkidle' });
  await page.fill('input[name="name"]', TEST_NAME);
  await page.fill('input[name="shortDescription"]', 'Commercial cleaning across Granby Street.');
  await page.fill(
    'textarea[name="description"]',
    'A division created through the admin UI to prove the database drives the public site.',
  );
  await page.fill('input[name="phone"]', '757-555-0100');
  await page.getByRole('button', { name: /create business/i }).click();
  await page.waitForURL(/\/admin\/businesses(\?|$)/, { timeout: 25000 });
  await page.waitForLoadState('networkidle');

  const created = await page.locator(`text=${TEST_NAME}`).count();
  check('created business appears in admin table', created > 0, `${created} match`);

  const row = () => page.locator('tr', { hasText: TEST_NAME }).first();
  check('new record defaults to Draft', /Draft/i.test(await row().innerText()));

  // ---- 7. Draft must not be public ---------------------------------------
  // NOTE: with `cacheComponents` the prerendered shell is committed with 200
  // before notFound() throws, so we assert on the rendered 404 UI, not status.
  const draftBody = await page
    .goto(`${BASE}/businesses/${TEST_SLUG}`, { waitUntil: 'networkidle' })
    .then(() => page.locator('body').innerText());
  check(
    'draft not rendered publicly',
    /took a different route|Error 404|couldn.t be found|could not be found/i.test(draftBody),
    '404 page shown'
  );
  check('draft name absent from public 404', !draftBody.includes(TEST_NAME));

  const draftList = await page.goto(`${BASE}/businesses`, { waitUntil: 'networkidle' }).then(() =>
    page.locator('body').innerText(),
  );
  check('draft absent from public listing', !draftList.includes(TEST_NAME));

  // ---- 8. Publish --------------------------------------------------------
  await page.goto(`${BASE}/admin/businesses`, { waitUntil: 'networkidle' });
  await row().getByRole('button', { name: /^Publish$/ }).click();
  await page.waitForTimeout(4000);
  await page.waitForLoadState('networkidle');
  check('row now shows Published', /Published/i.test(await row().innerText()));

  // ---- 9. Published content is live, no redeploy -------------------------
  const liveRes = await page.goto(`${BASE}/businesses/${TEST_SLUG}`, { waitUntil: 'networkidle' });
  const liveBody = await page.locator('body').innerText();
  check('published detail page returns 200', liveRes.status() === 200, `status ${liveRes.status()}`);
  check('published name rendered publicly', liveBody.includes(TEST_NAME));

  const svcRes = await page.goto(`${BASE}/services/${TEST_SLUG}`, { waitUntil: 'networkidle' });
  check('slug also resolves under /services', svcRes.status() === 200, `status ${svcRes.status()}`);

  const liveList = await page.goto(`${BASE}/businesses`, { waitUntil: 'networkidle' }).then(() =>
    page.locator('body').innerText(),
  );
  check('appears in public listing', liveList.includes(TEST_NAME));

  const sitemap = await page
    .goto(`${BASE}/sitemap.xml`, { waitUntil: 'domcontentloaded' })
    .then(() => page.content());
  check('present in sitemap', sitemap.includes(TEST_SLUG));

  // ---- 10. Unpublish removes it immediately ------------------------------
  await page.goto(`${BASE}/admin/businesses`, { waitUntil: 'networkidle' });
  await row().getByRole('button', { name: /Unpublish/i }).click();
  await page.waitForTimeout(4000);

  const goneBody = await page
    .goto(`${BASE}/businesses/${TEST_SLUG}`, { waitUntil: 'networkidle' })
    .then(() => page.locator('body').innerText());
  check(
    'unpublished removed from public site',
    !goneBody.includes(TEST_NAME) &&
      /took a different route|Error 404|couldn.t be found/i.test(goneBody),
    '404 page shown again'
  );

  // ---- 11. Audit trail recorded the operations --------------------------
  const audit = await page.goto(`${BASE}/admin/dashboard`, { waitUntil: 'networkidle' }).then(() =>
    page.locator('body').innerText(),
  );
  check('audit log recorded publish/unpublish', /business\.publish/.test(audit) && /business\.unpublish/.test(audit));

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n[e2e] ${results.length - failed.length}/${results.length} checks passed`);
  if (pageErrors.length) console.log('[e2e] page errors:', pageErrors.slice(0, 3));
  if (failed.length) {
    console.log('[e2e] FAILURES:', JSON.stringify(failed, null, 2));
    process.exit(1);
  }
  console.log('[e2e] E2E_OK');
})();