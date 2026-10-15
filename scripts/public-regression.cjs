const { chromium } = require('playwright');
const ROUTES = ['/', '/services', '/services/car-rentals', '/businesses', '/about', '/contact', '/faq', '/events', '/products', '/quote', '/careers', '/privacy-policy', '/terms-conditions', '/refund-policy', '/accessibility-statement', '/quote/car-rental', '/sitemap.xml', '/robots.txt'];
(async () => {
  const b = await chromium.launch();
  const bad = [];
  for (const vp of [{width:1440,height:900},{width:390,height:844}]) {
    const c = await b.newContext({ viewport: vp });
    const p = await c.newPage();
    for (const r of ROUTES) {
      const errs = [];
      p.removeAllListeners('pageerror');
      p.on('pageerror', e => errs.push(e.message));
      const res = await p.goto('http://localhost:3300'+r, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => null);
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth).catch(() => 0);
      const body = await p.locator('body').innerText().catch(()=> '');
      const broken = /couldn.t load|Internal Server Error|Application error/i.test(body);
      if (!res || res.status() >= 400 || overflow > 0 || broken || errs.length) {
        bad.push(`${vp.width}${r} status=${res?res.status():'ERR'} overflow=${overflow} broken=${broken} errs=${errs.length}`);
      }
    }
    await c.close();
  }
  await b.close();
  console.log(bad.length ? bad.join('\n') : 'PUBLIC_REGRESSION_OK — ' + ROUTES.length + ' routes x 2 viewports clean');
})();