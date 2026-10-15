'use client';

import { FormShell, FormSection, Field } from '@/components/admin/FormShell';
import type { FormActionResult } from '@/components/admin/FormShell';

export type SettingsFormValues = Record<string, string>;

export function SettingsForm({
  action,
  values,
}: {
  action: (formData: FormData) => Promise<FormActionResult>;
  values: SettingsFormValues;
}) {
  const v = (key: string) => values[key] ?? '';

  return (
    <FormShell action={action} submitLabel="Save settings" backHref="/admin/dashboard">
      {({ errors }) => (
        <>
          <FormSection
            title="Site identity"
            description="Used for the default page title and description."
          >
            <div className="space-y-4">
              <Field
                name="siteName"
                label="Site name"
                required
                defaultValue={v('siteName')}
                errors={errors}
              />
              <Field
                name="siteDescription"
                label="Site description"
                required
                defaultValue={v('siteDescription')}
                errors={errors}
              />
              <Field
                name="tagline"
                label="Tagline"
                defaultValue={v('tagline')}
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection
            title="Contact details"
            description="Shown in the footer and on the contact page. Credentials are never stored here."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="phone" label="Main phone" defaultValue={v('phone')} errors={errors} />
              <Field
                name="emergencyPhone"
                label="Secondary phone"
                defaultValue={v('emergencyPhone')}
                errors={errors}
              />
              <Field name="fax" label="Fax" defaultValue={v('fax')} errors={errors} />
              <Field
                name="email"
                label="Email"
                type="email"
                defaultValue={v('email')}
                errors={errors}
              />
              <Field
                name="street"
                label="Street address"
                defaultValue={v('street')}
                className="sm:col-span-2"
                errors={errors}
              />
              <Field name="city" label="City" defaultValue={v('city')} errors={errors} />
              <Field name="state" label="State" defaultValue={v('state')} errors={errors} />
              <Field name="zip" label="ZIP" defaultValue={v('zip')} errors={errors} />
              <Field name="hours" label="Opening hours" defaultValue={v('hours')} errors={errors} />
            </div>
          </FormSection>

          <FormSection title="Social profiles">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="facebook" label="Facebook URL" defaultValue={v('facebook')} errors={errors} />
              <Field name="instagram" label="Instagram URL" defaultValue={v('instagram')} errors={errors} />
              <Field name="twitter" label="X / Twitter URL" defaultValue={v('twitter')} errors={errors} />
              <Field name="linkedin" label="LinkedIn URL" defaultValue={v('linkedin')} errors={errors} />
              <Field name="youtube" label="YouTube URL" defaultValue={v('youtube')} errors={errors} />
            </div>
          </FormSection>

          <FormSection title="Default SEO">
            <div className="space-y-4">
              <Field
                name="defaultMetaTitle"
                label="Default meta title"
                maxLength={70}
                defaultValue={v('defaultMetaTitle')}
                errors={errors}
              />
              <Field
                name="defaultMetaDescription"
                label="Default meta description"
                maxLength={170}
                defaultValue={v('defaultMetaDescription')}
                errors={errors}
              />
            </div>
          </FormSection>
        </>
      )}
    </FormShell>
  );
}