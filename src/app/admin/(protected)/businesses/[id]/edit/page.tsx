import { dbConnect } from '@/lib/db';
import { Business } from '@/server/models/Business';
import { BusinessForm } from '../../../businesses/ClientComponents';
import { notFound } from 'next/navigation';

export const instant = false;

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await dbConnect();
  const business = await Business.findById(id).lean();

  if (!business) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Edit Business</h2>
        <p className="text-sm text-neutral-600 mt-1">Update business information</p>
      </div>
      <BusinessForm business={{
        _id: business._id.toString(),
        name: business.name,
        shortDescription: business.shortDescription,
        description: business.description,
        phone: business.contact?.phone,
        email: business.contact?.email,
        published: business.published,
        featured: business.featured,
        displayOrder: business.displayOrder,
      }} />
    </div>
  );
}
