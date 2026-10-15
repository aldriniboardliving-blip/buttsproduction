'use client';

import {
  FormShell,
  FormSection,
  Field,
  TextArea,
  SelectField,
  CheckboxField,
  CheckboxGroup,
} from '@/components/admin/FormShell';
import type { FormActionResult } from '@/components/admin/FormShell';

export interface ServiceFormValues {
  id?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  businessIds?: string[];
  amount?: number;
  unit?: string;
  customUnitLabel?: string;
  duration?: string;
  locationType?: string;
  locationDetails?: string;
  featured?: boolean;
  displayOrder?: number;
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

const UNITS = [
  { value: 'per_hour', label: 'Per hour' },
  { value: 'per_day', label: 'Per day' },
  { value: 'per_session', label: 'Per session' },
  { value: 'per_load', label: 'Per load' },
  { value: 'custom', label: 'Custom' },
];

const LOCATIONS = [
  { value: 'onsite', label: 'On site' },
  { value: 'customer_location', label: 'Customer location' },
  { value: 'online', label: 'Online' },
  { value: 'granby_street', label: 'Granby Street' },
];

export function ServiceForm({
  action,
  service,
  categories,
  businesses,
}: {
  action: (formData: FormData) => Promise<FormActionResult>;
  service?: ServiceFormValues;
  categories: { value: string; label: string }[];
  businesses: { value: string; label: string }[];
}) {
  return (
    <FormShell
      action={action}
      id={service?.id}
      submitLabel={service ? 'Save changes' : 'Create service'}
      backHref="/admin/services"
    >
      {({ errors }) => (
        <>
          <FormSection title="Basics">
            <div className="space-y-4">
              <Field
                name="name"
                label="Name"
                required
                defaultValue={service?.name ?? ''}
                errors={errors}
              />
              <Field
                name="shortDescription"
                label="Short description"
                maxLength={300}
                defaultValue={service?.shortDescription ?? ''}
                errors={errors}
              />
              <TextArea
                name="description"
                label="Full description"
                defaultValue={service?.description ?? ''}
                rows={6}
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="Pricing & logistics">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                name="categoryId"
                label="Category"
                required
                defaultValue={service?.categoryId ?? categories[0]?.value ?? ''}
                options={categories.length > 0 ? categories : [{ value: '', label: 'No categories yet' }]}
                errors={errors}
              />
              <Field
                name="pricing.amount"
                label="Price"
                type="number"
                min={0}
                required
                defaultValue={service?.amount ?? 0}
                hint="Whole US dollars."
                errors={errors}
              />
              <SelectField
                name="pricing.unit"
                label="Billing unit"
                defaultValue={service?.unit ?? 'per_session'}
                options={UNITS}
                errors={errors}
              />
              <Field
                name="duration"
                label="Duration"
                defaultValue={service?.duration ?? ''}
                hint='e.g. "2 hr", "1 day".'
                errors={errors}
              />
              <SelectField
                name="locationType"
                label="Location type"
                required
                defaultValue={service?.locationType ?? 'onsite'}
                options={LOCATIONS}
                errors={errors}
              />
              <Field
                name="locationDetails"
                label="Location details"
                defaultValue={service?.locationDetails ?? ''}
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="Businesses">
            {businesses.length === 0 ? (
              <p className="text-sm text-neutral-600">
                No businesses exist yet. A service can be created without one and
                assigned later.
              </p>
            ) : (
              <CheckboxGroup
                name="businessIds"
                legend="Attach this service to"
                options={businesses}
                defaultValues={service?.businessIds}
              />
            )}
          </FormSection>

          <FormSection title="Visibility">
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckboxField
                name="published"
                label="Published"
                hint="Visible on the public website."
                defaultChecked={service?.published}
              />
              <CheckboxField
                name="featured"
                label="Featured"
                defaultChecked={service?.featured}
              />
              <Field
                name="displayOrder"
                label="Display order"
                type="number"
                min={0}
                defaultValue={service?.displayOrder ?? 0}
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="SEO">
            <div className="space-y-4">
              <Field
                name="metaTitle"
                label="Meta title"
                maxLength={70}
                defaultValue={service?.metaTitle ?? ''}
                errors={errors}
              />
              <Field
                name="metaDescription"
                label="Meta description"
                maxLength={170}
                defaultValue={service?.metaDescription ?? ''}
                errors={errors}
              />
            </div>
          </FormSection>
        </>
      )}
    </FormShell>
  );
}