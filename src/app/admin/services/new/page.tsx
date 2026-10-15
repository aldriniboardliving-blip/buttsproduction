import { listBusinesses } from '@/app/admin/businesses/actions';
import { ServiceForm } from '@/app/admin/services/ClientComponents';

export const instant = false;

export default async function NewServicePage() {
  const bizResult = await listBusinesses({ published: false, limit: 100 });
  const businesses = bizResult.success ? bizResult.data.businesses as Array<{ _id: string; name: string }> : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">New Service</h2>
        <p className="text-sm text-neutral-600 mt-1">Create a new service offering</p>
      </div>
      <ServiceForm businesses={businesses} />
    </div>
  );
}