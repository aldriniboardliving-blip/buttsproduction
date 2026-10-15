import Link from 'next/link';
import { dbConnect } from '@/lib/db';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Business } from '@/server/models/Business';
import { Service } from '@/server/models/Service';
import { Product } from '@/server/models/Product';
import { Event } from '@/server/models/Event';
import { FAQ } from '@/server/models/FAQ';
import { TeamMember } from '@/server/models/TeamMember';
import { AuditLog } from '@/server/models/AuditLog';
import { getSession } from '@/lib/auth/service';
import { AdminAlert } from '@/components/admin/AdminPrimitives';

export const instant = false;

const LIVE = { published: true, archivedAt: { $exists: false } } as const;

interface Metrics {
  businesses: { total: number; published: number };
  services: { total: number; published: number };
  products: { total: number; published: number };
  events: { upcoming: number; total: number };
  faqs: { total: number; published: number };
  team: { total: number; published: number };
}

async function loadMetrics(): Promise<{ metrics: Metrics | null; error?: string }> {
  try {
    await dbConnect();

    const [
      businessTotal,
      businessPublished,
      serviceTotal,
      servicePublished,
      productTotal,
      productPublished,
      eventTotal,
      eventUpcoming,
      faqTotal,
      faqPublished,
      teamTotal,
      teamPublished,
    ] = await Promise.all([
      Business.countDocuments({ archivedAt: { $exists: false } }),
      Business.countDocuments(LIVE),
      Service.countDocuments({ archivedAt: { $exists: false } }),
      Service.countDocuments(LIVE),
      Product.countDocuments({ archivedAt: { $exists: false } }),
      Product.countDocuments(LIVE),
      Event.countDocuments({ archivedAt: { $exists: false } }),
      Event.countDocuments({ ...LIVE, startDate: { $gte: new Date() } }),
      FAQ.countDocuments({ archivedAt: { $exists: false } }),
      FAQ.countDocuments(LIVE),
      TeamMember.countDocuments({ archivedAt: { $exists: false } }),
      TeamMember.countDocuments(LIVE),
    ]);

    return {
      metrics: {
        businesses: { total: businessTotal, published: businessPublished },
        services: { total: serviceTotal, published: servicePublished },
        products: { total: productTotal, published: productPublished },
        events: { total: eventTotal, upcoming: eventUpcoming },
        faqs: { total: faqTotal, published: faqPublished },
        team: { total: teamTotal, published: teamPublished },
      },
    };
  } catch (error) {
    console.error('[dashboard] failed to load metrics', error);
    return { metrics: null, error: 'Could not reach the database.' };
  }
}

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) return null;

  const { metrics, error } = await loadMetrics();

  const activity = await (async () => {
    try {
      await dbConnect();
      return await AuditLog.find()
        .select('action actorEmail targetType targetSlug severity createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    } catch (err) {
      console.error('[dashboard] failed to load activity', err);
      return [];
    }
  })();

  const cards = metrics
    ? [
        { label: 'Businesses', total: metrics.businesses.total, published: metrics.businesses.published, href: '/admin/businesses' },
        { label: 'Services', total: metrics.services.total, published: metrics.services.published, href: '/admin/services' },
        { label: 'Products', total: metrics.products.total, published: metrics.products.published, href: '/admin/products' },
        { label: 'FAQs', total: metrics.faqs.total, published: metrics.faqs.published, href: '/admin/faqs' },
        { label: 'Team', total: metrics.team.total, published: metrics.team.published, href: '/admin/team' },
        { label: 'Upcoming events', total: metrics.events.upcoming, published: metrics.events.total, href: '/admin/events', publishedLabel: 'total' },
      ]
    : [];

  return (
    <Container size="full">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900">
          Welcome back, {session.name}
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Content statistics come straight from the database.
        </p>
      </header>

      {error && (
        <AdminAlert tone="error">
          {error} Metrics below are hidden rather than faked — check that MongoDB is
          running and <code className="font-mono">MONGODB_URI</code> is correct.
        </AdminAlert>
      )}

      {metrics && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Link key={card.label} href={card.href} className="group">
                <Card bordered className="transition-colors group-hover:border-primary-300">
                  <p className="text-sm text-neutral-600">{card.label}</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900 tabular-nums">
                    {card.total}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {card.publishedLabel === 'total'
                      ? `${card.total} total`
                      : `${card.published} published`}
                  </p>
                </Card>
              </Link>
            ))}
          </div>

          {cards.some((card) => card.total === 0) && (
            <p className="mt-4 text-sm text-neutral-600">
              Nothing published yet? Create a record, then use{' '}
              <strong>Publish</strong> to make it appear on the public site.
            </p>
          )}
        </>
      )}

      <section className="mt-10">
        <h3 className="mb-4 text-base font-semibold text-neutral-900">Recent activity</h3>

        {activity.length === 0 ? (
          <Card bordered>
            <p className="text-sm text-neutral-500">
              No administrative activity recorded yet.
            </p>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  {['Action', 'Item', 'By', 'When'].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-600"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {activity.map((entry) => {
                  const doc = entry as unknown as {
                    _id: string;
                    action: string;
                    actorEmail: string;
                    targetType: string;
                    targetSlug?: string;
                    createdAt: string;
                  };
                  return (
                    <tr key={doc._id}>
                      <td className="px-4 py-3 font-mono text-xs text-neutral-700">
                        {doc.action}
                      </td>
                      <td className="px-4 py-3 text-neutral-700">
                        {doc.targetType}
                        {doc.targetSlug ? ` · /${doc.targetSlug}` : ''}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{doc.actorEmail}</td>
                      <td className="px-4 py-3 text-xs text-neutral-500">
                        {new Date(doc.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Container>
  );
}