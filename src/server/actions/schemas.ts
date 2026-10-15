import { z } from 'zod';

const trimmed = z.string().trim();
const optionalText = (max = 300) => trimmed.max(max).optional().or(trimmed.max(max).default(''));
const boolish = z
  .union([z.boolean(), z.literal('on'), z.literal('true'), z.literal('false'), z.literal('')])
  .transform((value) => value === true || value === 'on' || value === 'true');

const numeric = z
  .union([z.number(), z.literal(''), z.string()])
  .transform((value) => (typeof value === 'number' ? value : parseInt(value || '0', 10) || 0));

const nonNegativeInt = numeric.pipe(z.number().int().min(0));
const objectIdish = z.string().trim().refine((v) => /^[a-f\d]{24}$/i.test(v), {
  message: 'Invalid identifier',
});
const objectIdList = z
  .array(z.string().trim())
  .transform((values) => values.filter((value) => /^[a-f\d]{24}$/i.test(value)));

/** SEO block shared by Business, Service, Product and Event. */
const seoShape = {
  metaTitle: optionalText(70),
  metaDescription: optionalText(170),
  ogTitle: optionalText(95),
  ogDescription: optionalText(240),
  canonicalUrl: optionalText(300),
  noindex: boolish.optional().default(false),
  nofollow: boolish.optional().default(false),
};

export const businessInputSchema = z.object({
  name: trimmed.min(1, 'Name is required').max(100),
  shortDescription: optionalText(300),
  description: z.string().trim().optional().default(''),
  logoId: objectIdish.optional().default(''),
  coverImageId: objectIdish.optional().default(''),
  galleryIds: objectIdList.optional().default([]),
  phone: optionalText(40),
  email: z.union([z.literal(''), z.email('Enter a valid email')]).optional().default(''),
  street: optionalText(160),
  city: optionalText(80),
  state: optionalText(80),
  zip: optionalText(20),
  country: optionalText(80).default('US'),
  hours: optionalText(400),
  facebook: optionalText(200),
  instagram: optionalText(200),
  twitter: optionalText(200),
  linkedin: optionalText(200),
  youtube: optionalText(200),
  tiktok: optionalText(200),
  featured: boolish.optional().default(false),
  displayOrder: nonNegativeInt.optional().default(0),
  published: boolish.optional().default(false),
  bookingEnabled: boolish.optional().default(true),
  defaultBookingForm: optionalText(80),
  ogImageId: objectIdish.optional().default(''),
  ...seoShape,
});

export type BusinessInput = z.input<typeof businessInputSchema>;
export type ParsedBusinessInput = z.output<typeof businessInputSchema>;

const pricingSchema = z.object({
  amount: z.number().int().min(0, 'Price cannot be negative'),
  currency: z.literal('USD').default('USD'),
  unit: z.enum(['per_hour', 'per_day', 'per_session', 'per_load', 'custom']),
  customUnitLabel: trimmed.optional().default(''),
});

const bookingConfigSchema = z.object({
  formKey: trimmed.min(1).max(80),
  requiresApproval: z.boolean().default(true),
  collectsPayment: z.boolean().default(false),
  depositAmount: z.number().int().min(0).optional(),
  cancellationPolicy: trimmed.optional().default(''),
});

export const serviceInputSchema = z.object({
  name: trimmed.min(1, 'Name is required').max(100),
  shortDescription: optionalText(300),
  description: z.string().trim().optional().default(''),
  categoryId: objectIdish,
  businessIds: objectIdList,
  pricing: pricingSchema,
  duration: optionalText(60),
  locationType: z.enum(['onsite', 'customer_location', 'online', 'granby_street'], {
    message: 'Choose a location type',
  }),
  locationDetails: optionalText(200),
  galleryIds: objectIdList.optional().default([]),
  featured: boolish.optional().default(false),
  displayOrder: nonNegativeInt.optional().default(0),
  published: boolish.optional().default(false),
  bookingConfig: bookingConfigSchema.optional(),
  faqIds: objectIdList.optional().default([]),
  ogImageId: objectIdish.optional().default(''),
  ...seoShape,
});

export type ServiceInput = z.input<typeof serviceInputSchema>;
export type ParsedServiceInput = z.output<typeof serviceInputSchema>;

export const eventInputSchema = z.object({
  name: trimmed.min(1, 'Event name is required').max(160),
  shortDescription: optionalText(300),
  description: z.string().trim().optional().default(''),
  bannerImageId: objectIdish.optional().default(''),
  galleryIds: objectIdList.optional().default([]),
  startDate: z.coerce.date({ message: 'A start date is required' }),
  endDate: z
    .union([z.coerce.date(), z.literal('')])
    .optional()
    .transform((value) => (value === '' || value instanceof Date ? value : undefined)),
  venue: optionalText(200),
  address: optionalText(300),
  registrationUrl: z
    .union([z.literal(''), z.url('Enter a valid URL')])
    .optional()
    .default(''),
  featured: boolish.optional().default(false),
  published: boolish.optional().default(false),
  displayOrder: nonNegativeInt.optional().default(0),
  businessIds: objectIdList.optional().default([]),
  ogImageId: objectIdish.optional().default(''),
  ...seoShape,
})
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: 'The end date must be on or after the start date',
    path: ['endDate'],
  });

export type EventInput = z.input<typeof eventInputSchema>;
export type ParsedEventInput = z.output<typeof eventInputSchema>;

export const faqInputSchema = z.object({
  question: trimmed.min(1, 'A question is required').max(300),
  answer: trimmed.min(1, 'An answer is required'),
  category: optionalText(80),
  businessIds: objectIdList.optional().default([]),
  serviceIds: objectIdList.optional().default([]),
  displayOrder: nonNegativeInt.optional().default(0),
  published: boolish.optional().default(false),
});

export type FaqInput = z.input<typeof faqInputSchema>;
export type ParsedFaqInput = z.output<typeof faqInputSchema>;

export const teamMemberInputSchema = z.object({
  name: trimmed.min(1, 'A name is required').max(120),
  role: trimmed.min(1, 'A role is required').max(200),
  bio: z.string().trim().optional().default(''),
  photoId: objectIdish.optional().default(''),
  email: z.union([z.literal(''), z.email('Enter a valid email')]).optional().default(''),
  phone: optionalText(40),
  facebook: optionalText(200),
  instagram: optionalText(200),
  linkedin: optionalText(200),
  twitter: optionalText(200),
  displayOrder: nonNegativeInt.optional().default(0),
  published: boolish.optional().default(false),
});

export type TeamMemberInput = z.input<typeof teamMemberInputSchema>;
export type ParsedTeamMemberInput = z.output<typeof teamMemberInputSchema>;

export const productInputSchema = z.object({
  name: trimmed.min(1, 'A name is required').max(160),
  shortDescription: optionalText(300),
  description: z.string().trim().optional().default(''),
  price: z
    .union([z.number(), z.literal(''), z.string()])
    .optional()
    .transform((value) => {
      if (value === '' || value === undefined || value === null) return undefined;
      const parsed = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    })
    .pipe(z.number().min(0, 'Price cannot be negative').optional()),
  inStock: boolish.optional().default(true),
  featuredImageId: objectIdish.optional().default(''),
  galleryIds: objectIdList.optional().default([]),
  categoryId: objectIdish.optional().default(''),
  businessIds: objectIdList.optional().default([]),
  featured: boolish.optional().default(false),
  published: boolish.optional().default(false),
  displayOrder: nonNegativeInt.optional().default(0),
  ogImageId: objectIdish.optional().default(''),
  ...seoShape,
});

export type ProductInput = z.input<typeof productInputSchema>;
export type ParsedProductInput = z.output<typeof productInputSchema>;

export const settingsInputSchema = z.object({
  siteName: trimmed.min(1, 'A site name is required').max(120),
  siteDescription: trimmed.min(1, 'A site description is required').max(300),
  tagline: optionalText(160),
  phone: optionalText(40),
  emergencyPhone: optionalText(40),
  fax: optionalText(40),
  email: z.union([z.literal(''), z.email('Enter a valid email')]).optional().default(''),
  street: optionalText(160),
  city: optionalText(80),
  state: optionalText(80),
  zip: optionalText(20),
  hours: optionalText(200),
  facebook: optionalText(200),
  instagram: optionalText(200),
  twitter: optionalText(200),
  linkedin: optionalText(200),
  youtube: optionalText(200),
  defaultMetaTitle: optionalText(70),
  defaultMetaDescription: optionalText(170),
});

export type SettingsInput = z.input<typeof settingsInputSchema>;
export type ParsedSettingsInput = z.output<typeof settingsInputSchema>;

export const listQuerySchema = z.object({
  search: trimmed.optional().default(''),
  published: z.union([z.literal('all'), z.literal('true'), z.literal('false')]).optional().default('all'),
  page: numeric.pipe(z.number().int().min(1)).optional().default(1),
  limit: numeric.pipe(z.number().int().min(1).max(100)).optional().default(20),
});

export type ListQuery = z.output<typeof listQuerySchema>;

/** Flattens Zod issues into the `fields` shape `ActionError` expects. */
export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    (fields[key] ??= []).push(issue.message);
  }
  return fields;
}