import { getSession } from '@/lib/auth/service';
import { Container } from '@/components/ui/Container';

export const instant = false;

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return (
    <Container size="full">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-neutral-900">
          Welcome back, {session.name}
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Total Bookings" value="—" subtitle="All time" />
        <DashboardCard title="New Today" value="—" subtitle="Last 24 hours" />
        <DashboardCard title="Pending Review" value="—" subtitle="Awaiting action" />
        <DashboardCard title="Completed (7d)" value="—" subtitle="This week" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Active Businesses" value="—" subtitle="Published" />
        <DashboardCard title="Active Services" value="—" subtitle="Published" />
        <DashboardCard title="Upcoming Events" value="—" subtitle="Scheduled" />
        <DashboardCard title="Subscribers" value="—" subtitle="Newsletter" />
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Recent Bookings</h3>
        <div className="text-center py-12 text-neutral-500">
          <p className="text-sm">No bookings yet.</p>
          <p className="text-xs mt-1">Booking data will appear here once forms are submitted.</p>
        </div>
      </div>
    </Container>
  );
}

function DashboardCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4">
      <p className="text-sm text-neutral-600">{title}</p>
      <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
      <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
    </div>
  );
}
