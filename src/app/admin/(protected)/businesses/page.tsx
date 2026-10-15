import { listBusinesses } from './actions';
import { BusinessList } from './ClientComponents';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const instant = false;

export default async function BusinessesPage() {
  const result = await listBusinesses({ limit: 50 });

  if (!result.success) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
        {result.error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Businesses</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Manage your business divisions ({result.data.total} total)
          </p>
        </div>
        <Link href="/admin/businesses/new">
          <Button>+ New Business</Button>
        </Link>
      </div>

      <BusinessList businesses={result.data.businesses as Array<{
        _id: string;
        name: string;
        slug: string;
        published: boolean;
        featured: boolean;
        displayOrder: number;
      }>} />
    </div>
  );
}
