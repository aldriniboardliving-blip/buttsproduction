import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().min(1),

  MONGODB_URI: z.string().startsWith('mongodb'),
  MONGODB_DB_NAME: z.string().min(1),

  ADMIN_SETUP_TOKEN: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  COOKIE_DOMAIN: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
  CLOUDINARY_FOLDER_PREFIX: z.string().min(1),

  RESEND_API_KEY: z.string().startsWith('re_'),
  EMAIL_FROM_NAME: z.string().min(1),
  EMAIL_FROM_EMAIL: z.string().email(),
  EMAIL_REPLY_TO: z.string().email(),

  RECAPTCHA_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),

  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().startsWith('G-').optional(),
  NEXT_PUBLIC_GTM_CONTAINER_ID: z.string().startsWith('GTM-').optional(),
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  NEXT_PUBLIC_ENABLE_SPANISH_FORM: z.coerce.boolean().default(true),
  NEXT_PUBLIC_MAINTENANCE_MODE: z.coerce.boolean().default(false),

  RATE_LIMIT_ENABLED: z.coerce.boolean().default(true),
  REDIS_URL: z.string().url().optional(),

  MAX_FILE_SIZE_MB: z.coerce.number().int().min(1).max(100).default(20),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,image/avif,application/pdf'),
});

export type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const msg = Object.entries(errors)
      .map(([k, v]) => `  ${k}: ${v.join(', ')}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${msg}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getClientEnv() {
  const env = getEnv();
  return {
    APP_URL: env.NEXT_PUBLIC_APP_URL,
    APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    APP_DESCRIPTION: env.NEXT_PUBLIC_APP_DESCRIPTION,
    RECAPTCHA_SITE_KEY: env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    GA4_MEASUREMENT_ID: env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    GTM_CONTAINER_ID: env.NEXT_PUBLIC_GTM_CONTAINER_ID,
    SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
    ENABLE_SPANISH_FORM: env.NEXT_PUBLIC_ENABLE_SPANISH_FORM,
    MAINTENANCE_MODE: env.NEXT_PUBLIC_MAINTENANCE_MODE,
  };
}

export const config = {
  app: {
    get name() { return getEnv().NEXT_PUBLIC_APP_NAME },
    get url() { return getEnv().NEXT_PUBLIC_APP_URL },
    get description() { return getEnv().NEXT_PUBLIC_APP_DESCRIPTION },
    get nodeEnv() { return getEnv().NODE_ENV },
    get isProd() { return getEnv().NODE_ENV === 'production' },
  },
  db: {
    get uri() { return getEnv().MONGODB_URI },
    get name() { return getEnv().MONGODB_DB_NAME },
  },
  auth: {
    get setupToken() { return getEnv().ADMIN_SETUP_TOKEN },
    get sessionSecret() { return getEnv().SESSION_SECRET },
    get cookieDomain() { return getEnv().COOKIE_DOMAIN },
    defaultTtlMs: 24 * 60 * 60 * 1000,
    rememberMeTtlMs: 30 * 24 * 60 * 60 * 1000,
  },
  cloudinary: {
    get cloudName() { return getEnv().CLOUDINARY_CLOUD_NAME },
    get apiKey() { return getEnv().CLOUDINARY_API_KEY },
    get apiSecret() { return getEnv().CLOUDINARY_API_SECRET },
    get uploadPreset() { return getEnv().CLOUDINARY_UPLOAD_PRESET },
    get folderPrefix() { return getEnv().CLOUDINARY_FOLDER_PREFIX },
  },
  email: {
    get apiKey() { return getEnv().RESEND_API_KEY },
    get fromName() { return getEnv().EMAIL_FROM_NAME },
    get fromEmail() { return getEnv().EMAIL_FROM_EMAIL },
    get replyTo() { return getEnv().EMAIL_REPLY_TO },
  },
  recaptcha: {
    get secretKey() { return getEnv().RECAPTCHA_SECRET_KEY },
    get siteKey() { return getEnv().NEXT_PUBLIC_RECAPTCHA_SITE_KEY },
  },
  analytics: {
    get ga4() { return getEnv().NEXT_PUBLIC_GA4_MEASUREMENT_ID },
    get gtm() { return getEnv().NEXT_PUBLIC_GTM_CONTAINER_ID },
    get sentryDsn() { return getEnv().SENTRY_DSN },
    get sentryPublicDsn() { return getEnv().NEXT_PUBLIC_SENTRY_DSN },
  },
  features: {
    get spanishForm() { return getEnv().NEXT_PUBLIC_ENABLE_SPANISH_FORM },
    get maintenanceMode() { return getEnv().NEXT_PUBLIC_MAINTENANCE_MODE },
  },
  upload: {
    get maxSizeBytes() { return getEnv().MAX_FILE_SIZE_MB * 1024 * 1024 },
    get allowedTypes() { return getEnv().ALLOWED_FILE_TYPES.split(',').map(s => s.trim()) },
  },
  rateLimit: {
    get enabled() { return getEnv().RATE_LIMIT_ENABLED },
    get redisUrl() { return getEnv().REDIS_URL },
  },
} as const;
