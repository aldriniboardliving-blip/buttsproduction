'use client';

import {
  FormShell,
  FormSection,
  Field,
  TextArea,
  CheckboxField,
  SelectField,
  CheckboxGroup,
} from '@/components/admin/FormShell';
import type { FormActionResult } from '@/components/admin/FormShell';

export interface EventFormValues {
  id?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  address?: string;
  registrationUrl?: string;
  featured?: boolean;
  published?: boolean;
  displayOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
}

function toDateInput(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

export function EventForm({
  action,
  event,
  businesses,
}: {
  action: (formData: FormData) => Promise<FormActionResult>;
  event?: EventFormValues;
  businesses: { value: string; label: string }[];
}) {
  return (
    <FormShell
      action={action}
      id={event?.id}
      submitLabel={event ? 'Save changes' : 'Create event'}
      backHref="/admin/events"
    >
      {({ errors }) => (
        <>
          <FormSection title="Event details">
            <div className="space-y-4">
              <Field
                name="name"
                label="Event name"
                required
                defaultValue={event?.name ?? ''}
                errors={errors}
              />
              <Field
                name="shortDescription"
                label="Short description"
                maxLength={300}
                defaultValue={event?.shortDescription ?? ''}
                errors={errors}
              />
              <TextArea
                name="description"
                label="Full description"
                defaultValue={event?.description ?? ''}
                rows={6}
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection
            title="Schedule"
            description="The end date must be on or after the start date."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                name="startDate"
                label="Start date"
                type="date"
                required
                defaultValue={toDateInput(event?.startDate)}
                errors={errors}
              />
              <Field
                name="endDate"
                label="End date"
                type="date"
                defaultValue={toDateInput(event?.endDate)}
                hint="Optional — leave blank for a single-day event."
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="Location & registration">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="venue" label="Venue" defaultValue={event?.venue ?? ''} errors={errors} />
              <Field
                name="address"
                label="Address"
                defaultValue={event?.address ?? ''}
                errors={errors}
              />
              <Field
                name="registrationUrl"
                label="External registration URL"
                defaultValue={event?.registrationUrl ?? ''}
                hint="Link out to a ticketing page, if there is one."
                errors={errors}
              />
            </div>
          </FormSection>

          {businesses.length > 0 && (
            <FormSection title="Businesses">
              <CheckboxGroup
                name="businessIds"
                legend="Associated with"
                options={businesses}
              />
            </FormSection>
          )}

          <FormSection title="Visibility">
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckboxField
                name="published"
                label="Published"
                hint="Visible on the public events page."
                defaultChecked={event?.published}
              />
              <CheckboxField name="featured" label="Featured" defaultChecked={event?.featured} />
              <Field
                name="displayOrder"
                label="Display order"
                type="number"
                min={0}
                defaultValue={event?.displayOrder ?? 0}
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
                defaultValue={event?.metaTitle ?? ''}
                errors={errors}
              />
              <Field
                name="metaDescription"
                label="Meta description"
                maxLength={170}
                defaultValue={event?.metaDescription ?? ''}
                errors={errors}
              />
            </div>
          </FormSection>
        </>
      )}
    </FormShell>
  );
}

export interface FaqFormValues {
  id?: string;
  question?: string;
  answer?: string;
  category?: string;
  displayOrder?: number;
  published?: boolean;
}

export function FaqForm({
  action,
  faq,
}: {
  action: (formData: FormData) => Promise<FormActionResult>;
  faq?: FaqFormValues;
}) {
  return (
    <FormShell
      action={action}
      id={faq?.id}
      submitLabel={faq ? 'Save changes' : 'Create FAQ'}
      backHref="/admin/faqs"
    >
      {({ errors }) => (
        <>
          <FormSection title="Question and answer">
            <div className="space-y-4">
              <Field
                name="question"
                label="Question"
                required
                defaultValue={faq?.question ?? ''}
                errors={errors}
              />
              <TextArea
                name="answer"
                label="Answer"
                required
                defaultValue={faq?.answer ?? ''}
                rows={6}
                errors={errors}
              />
              <Field
                name="category"
                label="Category"
                defaultValue={faq?.category ?? ''}
                hint="Optional grouping, e.g. “Car rental”."
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="Visibility">
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckboxField
                name="published"
                label="Published"
                hint="Visible on the public FAQ page."
                defaultChecked={faq?.published}
              />
              <Field
                name="displayOrder"
                label="Display order"
                type="number"
                min={0}
                defaultValue={faq?.displayOrder ?? 0}
                errors={errors}
              />
            </div>
          </FormSection>
        </>
      )}
    </FormShell>
  );
}

export interface TeamFormValues {
  id?: string;
  name?: string;
  role?: string;
  bio?: string;
  email?: string;
  phone?: string;
  displayOrder?: number;
  published?: boolean;
}

export function TeamForm({
  action,
  member,
}: {
  action: (formData: FormData) => Promise<FormActionResult>;
  member?: TeamFormValues;
}) {
  return (
    <FormShell
      action={action}
      id={member?.id}
      submitLabel={member ? 'Save changes' : 'Add team member'}
      backHref="/admin/team"
    >
      {({ errors }) => (
        <>
          <FormSection title="Who they are">
            <div className="space-y-4">
              <Field
                name="name"
                label="Name"
                required
                defaultValue={member?.name ?? ''}
                errors={errors}
              />
              <Field
                name="role"
                label="Role or position"
                required
                defaultValue={member?.role ?? ''}
                errors={errors}
              />
              <TextArea
                name="bio"
                label="Biography"
                defaultValue={member?.bio ?? ''}
                rows={5}
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                name="email"
                label="Email"
                type="email"
                defaultValue={member?.email ?? ''}
                errors={errors}
              />
              <Field
                name="phone"
                label="Phone"
                defaultValue={member?.phone ?? ''}
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="Visibility">
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckboxField
                name="published"
                label="Published"
                hint="Visible on the public About page."
                defaultChecked={member?.published}
              />
              <Field
                name="displayOrder"
                label="Display order"
                type="number"
                min={0}
                defaultValue={member?.displayOrder ?? 0}
                errors={errors}
              />
            </div>
          </FormSection>
        </>
      )}
    </FormShell>
  );
}

export interface ProductFormValues {
  id?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  inStock?: boolean;
  featured?: boolean;
  published?: boolean;
  displayOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export function ProductForm({
  action,
  product,
  categories,
}: {
  action: (formData: FormData) => Promise<FormActionResult>;
  product?: ProductFormValues;
  categories: { value: string; label: string }[];
}) {
  return (
    <FormShell
      action={action}
      id={product?.id}
      submitLabel={product ? 'Save changes' : 'Create product'}
      backHref="/admin/products"
    >
      {({ errors }) => (
        <>
          <FormSection title="Product details">
            <div className="space-y-4">
              <Field
                name="name"
                label="Name"
                required
                defaultValue={product?.name ?? ''}
                errors={errors}
              />
              <Field
                name="shortDescription"
                label="Short description"
                maxLength={300}
                defaultValue={product?.shortDescription ?? ''}
                errors={errors}
              />
              <TextArea
                name="description"
                label="Full description"
                defaultValue={product?.description ?? ''}
                rows={6}
                errors={errors}
              />
              <SelectField
                name="categoryId"
                label="Category"
                defaultValue={product?.categoryId ?? ''}
                options={[
                  { value: '', label: 'No category' },
                  ...categories,
                ]}
                errors={errors}
              />
              <Field
                name="price"
                label="Price"
                type="number"
                min={0}
                step="0.01"
                defaultValue={product?.price ?? ''}
                hint="Optional — leave blank for “price on request”."
                errors={errors}
              />
            </div>
          </FormSection>

          <FormSection title="Visibility">
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckboxField
                name="published"
                label="Published"
                hint="Visible on the public products page."
                defaultChecked={product?.published}
              />
              <CheckboxField name="inStock" label="In stock" defaultChecked={product?.inStock ?? true} />
              <CheckboxField name="featured" label="Featured" defaultChecked={product?.featured} />
              <Field
                name="displayOrder"
                label="Display order"
                type="number"
                min={0}
                defaultValue={product?.displayOrder ?? 0}
                errors={errors}
              />
            </div>
          </FormSection>
        </>
      )}
    </FormShell>
  );
}