'use client';

import {
  FormShell,
  FormSection,
  Field,
  TextArea,
  CheckboxField,
} from '@/components/admin/FormShell';
import type { FormActionResult } from '@/components/admin/FormShell';

export interface BusinessFormValues {
  name?: string;
  shortDescription?: string;
  description?: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  hours?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  featured?: boolean;
  displayOrder?: number;
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export function BusinessForm({
  action,
  business,
}: {
  action: (formData: FormData) => Promise<FormActionResult>;
  business?: BusinessFormValues & { id: string };
}) {
  return (
    <FormShell
      action={action}
      id={business?.id}
      submitLabel={business ? 'Save changes' : 'Create business'}
      backHref="/admin/businesses"
    >
      {({ errors }) => (
        <>
          <FormSection
            title="Basics"
            description="The name and summary shown on the public businesses page."
          >
            <div className="space-y-4">
              <Field
                name="name"
                label="Name"
                required
                defaultValue={business?.name ?? ''}
                errors={errors}
              />
              <Field
                name="shortDescription"
                label="Short description"
                defaultValue={business?.shortDescription ?? ''}
                maxLength={300}
                errors={errors}
              />
              <TextArea
                name="description"
                label="Full description"
                defaultValue={business?.description ?? ''}
                rows={6}
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="phone" label="Phone" defaultValue={business?.phone ?? ''} errors={errors} />
              <Field
                name="email"
                label="Email"
                type="email"
                defaultValue={business?.email ?? ''}
                errors={errors}
              />
              <Field
                name="street"
                label="Street address"
                defaultValue={business?.street ?? ''}
                className="sm:col-span-2"
                errors={errors}
              />
              <Field name="city" label="City" defaultValue={business?.city ?? ''} errors={errors} />
              <Field name="state" label="State" defaultValue={business?.state ?? ''} errors={errors} />
              <Field name="zip" label="ZIP" defaultValue={business?.zip ?? ''} errors={errors} />
              <Field
                name="hours"
                label="Opening hours"
                defaultValue={business?.hours ?? ''}
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="Social profiles">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="facebook" label="Facebook URL" defaultValue={business?.facebook ?? ''} errors={errors} />
              <Field name="instagram" label="Instagram URL" defaultValue={business?.instagram ?? ''} errors={errors} />
              <Field name="twitter" label="X / Twitter URL" defaultValue={business?.twitter ?? ''} errors={errors} />
              <Field name="linkedin" label="LinkedIn URL" defaultValue={business?.linkedin ?? ''} errors={errors} />
              <Field name="youtube" label="YouTube URL" defaultValue={business?.youtube ?? ''} errors={errors} />
              <Field name="tiktok" label="TikTok URL" defaultValue={business?.tiktok ?? ''} errors={errors} />
            </div>
          </FormSection>

          <FormSection title="Visibility" description="New records are drafts until you publish them.">
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckboxField
                name="published"
                label="Published"
                hint="Visible on the public website."
                defaultChecked={business?.published}
              />
              <CheckboxField
                name="featured"
                label="Featured"
                hint="Highlights this division on the homepage."
                defaultChecked={business?.featured}
              />
              <Field
                name="displayOrder"
                label="Display order"
                type="number"
                min={0}
                defaultValue={business?.displayOrder ?? 0}
                hint="Lower numbers appear first."
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection
            title="SEO"
            description="Leave blank to fall back to the page title and description."
          >
            <div className="space-y-4">
              <Field
                name="metaTitle"
                label="Meta title"
                maxLength={70}
                defaultValue={business?.metaTitle ?? ''}
                errors={errors}
              />
              <Field
                name="metaDescription"
                label="Meta description"
                maxLength={170}
                defaultValue={business?.metaDescription ?? ''}
                errors={errors}
              />
            </div>
          </FormSection>
        </>
      )}
    </FormShell>
  );
}