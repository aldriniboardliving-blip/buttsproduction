import { BusinessForm } from '../ClientComponents';

export const instant = false;

export default function NewBusinessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">New Business</h2>
        <p className="text-sm text-neutral-600 mt-1">Create a new business division</p>
      </div>
      <BusinessForm />
    </div>
  );
}
