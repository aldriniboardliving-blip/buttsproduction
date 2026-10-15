# Butts Productions — API Contracts

**Version**: 1.0  
**Phase**: 2 Deliverable  
**Status**: For Approval

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
├─────────────────────────────────────────────────────────────┤
│  Public Pages (RSC)          │  Admin Pages (RSC + Client)  │
│  - Server Components         │  - Server Components         │
│  - Static/ISR where possible │  - Client Components         │
└──────────────┬────────────────┴──────────────┬───────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server Actions                            │
│  - Form submissions (public)                                 │
│  - Admin mutations (CRUD)                                    │
│  - Auth actions (login, logout, setup)                      │
└──────────────┬────────────────┬──────────────────────────────┘
               │                │
               ▼                ▼
┌──────────────────┐  ┌──────────────────┐
│  Route Handlers  │  │  Direct DB Access│
│  (API Routes)    │  │  (Server-only)   │
│  - Webhooks      │  │  - Repositories  │
│  - OAuth         │  │  - Services      │
│  - Media proxy   │  │                  │
└──────────────────┘  └──────────────────┘
```

---

## Public Server Actions (Form Submissions)

All public forms use **Server Actions** with Zod validation, reCAPTCHA, and rate limiting.

### Base Response Type
```typescript
// src/lib/action-result.ts
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

export interface ActionError {
  code: string;
  message: string;
  fields?: Record<string, string[]>; // field-level errors
  statusCode?: number;
}
```

### 1. Car Rental Quote
```typescript
// src/app/quote/car-rental/actions.ts
'use server';

export async function submitCarRentalQuote(
  formData: FormData
): Promise<ActionResult<{ bookingId: string }>>;
```

**Validation Schema** (Zod):
```typescript
const CarRentalQuoteSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^[\d\s\-+()]{10,}$/),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  address: z.string().min(5).max(200),
  cityState: z.string().min(2).max(100),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/),
  pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickupTime: z.string().regex(/^\d{2}:\d{2}$/),
  dropoffDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dropoffTime: z.string().regex(/^\d{2}:\d{2}$/),
  insuranceType: z.enum(['own', 'none']),
  additionalDriver: z.enum(['yes', 'no']),
  inTown: z.enum(['yes', 'no']),
  unlimitedMiles: z.enum(['yes', 'no']),
  vehicleSelection: z.enum(['rosie', 'princess', 'scarlet', 'pepper']),
  termsAccepted: z.literal(true),
  signature: z.string().min(100), // base64 canvas
  // Files handled separately
  driversLicenseFile: z.instanceof(File).optional(),
  insuranceCardFile: z.instanceof(File).optional(),
}).refine(data => new Date(data.dropoffDate) >= new Date(data.pickupDate), {
  message: 'Drop-off must be after pick-up',
  path: ['dropoffDate'],
});
```

**Flow**:
1. Validate reCAPTCHA token (hidden field)
2. Check rate limit (5/hr/IP)
3. Validate schema
4. Upload files to Cloudinary (signed upload)
5. Create `Booking` record with status `new`
6. Send confirmation email to customer
7. Send notification email to admin
8. Return `{ success: true, data: { bookingId } }`

---

### 2. Dispatch Sign-up
```typescript
// src/app/quote/dispatch/actions.ts
export async function submitDispatchSignUp(
  formData: FormData
): Promise<ActionResult<{ bookingId: string }>>;
```

**Key Fields**: carrier info, MC/DOT, truck type, payment method, load details, dual signatures

---

### 3. Coaching Booking
```typescript
// src/app/quote/coaching/actions.ts
export async function submitCoachingBooking(
  formData: FormData
): Promise<ActionResult<{ bookingId: string }>>;
```

**Key Fields**: session tier, datetime, terms, signature canvas

---

### 4. Custom Print Order
```typescript
// src/app/quote/custom-print/actions.ts
export async function submitCustomPrintOrder(
  formData: FormData
): Promise<ActionResult<{ bookingId: string }>>;
```

**Key Fields**: product, customization, artwork upload, shipping

---

### 5. Entertainment Contact
```typescript
// src/app/quote/entertainment/actions.ts
export async function submitEntertainmentContact(
  formData: FormData
): Promise<ActionResult<{ bookingId: string }>>;
```

---

### 6. Careers Application
```typescript
// src/app/careers/apply/actions.ts
export async function submitJobApplication(
  formData: FormData
): Promise<ActionResult<{ applicationId: string }>>;
```

**Special**: SSN encrypted at rest (AES-256-GCM)

---

### 7. Notify Me (Coming Soon)
```typescript
// src/app/actions/notify.ts
export async function submitNotifyMe(
  email: string,
  source: string
): Promise<ActionResult<{ subscriberId: string }>>;
```

---

### 8. Newsletter Signup
```typescript
// src/app/actions/newsletter.ts
export async function subscribeNewsletter(
  email: string,
  source: string
): Promise<ActionResult<{ subscriberId: string }>>;
```

**Double opt-in**: Creates unconfirmed subscriber, sends confirmation email with token.

---

## Admin Server Actions (CRUD)

All admin actions require authentication + authorization.

### Authentication Actions
```typescript
// src/app/admin/login/actions.ts
export async function adminLogin(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<ActionResult<{ redirectTo: string }>>;

export async function adminLogout(): Promise<ActionResult<void>>;

export async function adminSetup(
  token: string,
  email: string,
  password: string,
  name: string
): Promise<ActionResult<void>>; // One-time use
```

### Business CRUD
```typescript
// src/app/admin/businesses/actions.ts
export async function createBusiness(
  data: BusinessInput
): Promise<ActionResult<{ business: Business }>>;

export async function updateBusiness(
  id: string,
  data: Partial<BusinessInput>
): Promise<ActionResult<{ business: Business }>>;

export async function deleteBusiness(
  id: string,
  force?: boolean
): Promise<ActionResult<void>>; // soft delete unless force=true

export async function publishBusiness(
  id: string,
  published: boolean
): Promise<ActionResult<{ business: Business }>>;

export async function reorderBusinesses(
  ids: string[] // ordered array
): Promise<ActionResult<void>>;

export async function duplicateBusiness(
  id: string
): Promise<ActionResult<{ business: Business }>>;
```

**BusinessInput** (Zod):
```typescript
const BusinessInputSchema = z.object({
  name: z.string().min(1).max(100),
  shortDescription: z.string().max(300).optional(),
  description: z.string().optional(), // markdown
  logoId: z.string().optional(), // MediaAsset ID
  coverImageId: z.string().optional(),
  galleryIds: z.array(z.string()).optional(),
  contact: BusinessContactSchema.optional(),
  social: BusinessSocialSchema.optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
  settings: z.object({
    bookingEnabled: z.boolean().default(true),
    defaultBookingForm: z.string().optional(),
  }).optional(),
  seo: SEOFieldsSchema.optional(),
});
```

### Service CRUD
```typescript
// src/app/admin/services/actions.ts
export async function createService(
  data: ServiceInput
): Promise<ActionResult<{ service: Service }>>;

export async function updateService(
  id: string,
  data: Partial<ServiceInput>
): Promise<ActionResult<{ service: Service }>>;

export async function deleteService(
  id: string,
  force?: boolean
): Promise<ActionResult<void>>;

export async function publishService(
  id: string,
  published: boolean
): Promise<ActionResult<{ service: Service }>>;

export async function assignServiceToBusinesses(
  serviceId: string,
  businessIds: string[]
): Promise<ActionResult<void>>;

export async function reorderServices(
  ids: string[]
): Promise<ActionResult<void>>;
```

**ServiceInput** (Zod):
```typescript
const ServiceInputSchema = z.object({
  name: z.string().min(1).max(100),
  shortDescription: z.string().max(300).optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  businessIds: z.array(z.string()).min(1),
  pricing: ServicePricingSchema,
  duration: z.string().optional(),
  locationType: z.enum(['onsite', 'customer_location', 'online', 'granby_street']),
  locationDetails: z.string().optional(),
  galleryIds: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
  bookingConfig: ServiceBookingConfigSchema,
  faqIds: z.array(z.string()).optional(),
  seo: SEOFieldsSchema.optional(),
});
```

### Category CRUD
```typescript
// src/app/admin/categories/actions.ts
export async function createCategory(data: CategoryInput): Promise<ActionResult<{ category: Category }>>;
export async function updateCategory(id: string, data: Partial<CategoryInput>): Promise<ActionResult<{ category: Category }>>;
export async function deleteCategory(id: string): Promise<ActionResult<void>>;
export async function reorderCategories(ids: string[]): Promise<ActionResult<void>>;
```

### Page & Block Management
```typescript
// src/app/admin/pages/actions.ts
export async function createPage(data: PageInput): Promise<ActionResult<{ page: Page }>>;
export async function updatePage(id: string, data: Partial<PageInput>): Promise<ActionResult<{ page: Page }>>;
export async function deletePage(id: string): Promise<ActionResult<void>>;
export async function publishPage(id: string, published: boolean): Promise<ActionResult<{ page: Page }>>;

// Blocks (embedded in Page)
export async function addBlock(pageId: string, block: BlockInput): Promise<ActionResult<{ page: Page }>>;
export async function updateBlock(pageId: string, blockId: string, config: BlockConfig): Promise<ActionResult<{ page: Page }>>;
export async function deleteBlock(pageId: string, blockId: string): Promise<ActionResult<{ page: Page }>>;
export async function reorderBlocks(pageId: string, blockIds: string[]): Promise<ActionResult<{ page: Page }>>;
export async function toggleBlock(pageId: string, blockId: string, enabled: boolean): Promise<ActionResult<{ page: Page }>>;
```

### Navigation Management
```typescript
// src/app/admin/navigation/actions.ts
export async function createNavigationItem(data: NavItemInput): Promise<ActionResult<{ item: NavigationItem }>>;
export async function updateNavigationItem(id: string, data: Partial<NavItemInput>): Promise<ActionResult<{ item: NavigationItem }>>;
export async function deleteNavigationItem(id: string): Promise<ActionResult<void>>;
export async function reorderNavigation(parentId: string | null, ids: string[]): Promise<ActionResult<void>>;
export async function moveNavigationItem(id: string, newParentId: string | null, index: number): Promise<ActionResult<void>>;
```

### Media Management
```typescript
// src/app/admin/media/actions.ts
export async function getSignedUploadParams(
  folder: string,
  fileName: string,
  contentType: string
): Promise<ActionResult<{ uploadUrl: string; fields: Record<string, string> }>>;

export async function confirmMediaUpload(
  publicId: string,
  width: number,
  height: number,
  format: string,
  bytes: number,
  alt: string,
  folder: string,
  tags?: string[]
): Promise<ActionResult<{ asset: MediaAsset }>>;

export async function deleteMediaAsset(
  id: string,
  force?: boolean
): Promise<ActionResult<void>>; // checks usageCount

export async function updateMediaAsset(
  id: string,
  data: { alt?: string; caption?: string; tags?: string[]; folder?: string }
): Promise<ActionResult<{ asset: MediaAsset }>>;

export async function searchMediaAssets(
  query: { folder?: string; tags?: string[]; q?: string; page?: number; limit?: number }
): Promise<ActionResult<{ assets: MediaAsset[]; total: number }>>;
```

### Booking Management
```typescript
// src/app/admin/bookings/actions.ts
export async function getBookings(
  filter: BookingFilter
): Promise<ActionResult<{ bookings: Booking[]; total: number }>>;

export async function getBookingDetail(
  id: string
): Promise<ActionResult<{ booking: Booking }>>;

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  note?: string,
  notifyCustomer?: boolean
): Promise<ActionResult<{ booking: Booking }>>;

export async function addBookingNote(
  id: string,
  content: string,
  internal: boolean
): Promise<ActionResult<{ note: BookingNote }>>;

export async function exportBookings(
  filter: BookingFilter
): Promise<ActionResult<{ csv: string }>>;
```

**BookingFilter**:
```typescript
const BookingFilterSchema = z.object({
  status: z.array(z.nativeEnum(BookingStatus)).optional(),
  serviceId: z.string().optional(),
  businessId: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  search: z.string().optional(), // customer name/email
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['submittedAt', 'status', 'customerName']).default('submittedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
```

### Events, FAQs, Testimonials, Legal, Team, Statistics
Similar CRUD patterns for each.

### Site Settings
```typescript
// src/app/admin/settings/actions.ts
export async function getSiteSettings(): Promise<ActionResult<{ settings: SiteSettings }>>;
export async function updateSiteSettings(
  data: Partial<SiteSettingsInput>
): Promise<ActionResult<{ settings: SiteSettings }>>;
```

---

## Route Handlers (API Routes)

Used for webhooks, OAuth, media proxy, and non-mutation endpoints.

### Auth
```
POST   /api/auth/login           # Alternative to server action (for non-JS)
POST   /api/auth/logout
GET    /api/auth/session         # Check session (for client components)
POST   /api/auth/refresh         # Extend session
```

### Media
```
POST   /api/media/upload-signature    # Get Cloudinary signed upload params
DELETE /api/media/:publicId           # Delete from Cloudinary + DB
GET    /api/media/search              # Search assets (admin)
GET    /api/media/:publicId           # Proxy/redirect to Cloudinary (with auth check)
```

### Webhooks
```
POST   /api/webhooks/resend        # Resend email events (bounce, complaint, delivery)
POST   /api/webhooks/cloudinary    # Cloudinary upload notifications (if async)
```

### Health & Monitoring
```
GET    /api/health                 # Liveness/readiness probe
GET    /api/health/db              # Database connectivity
GET    /api/health/storage         # Cloudinary connectivity
```

### Public Data (for client components)
```
GET    /api/businesses             # Paginated, filtered (public)
GET    /api/businesses/:slug       # Single business
GET    /api/services               # Paginated, filtered (public)
GET    /api/services/:slug         # Single service
GET    /api/categories             # All categories
GET    /api/events                 # Paginated (public)
GET    /api/events/:slug           # Single event
GET    /api/faqs                   # Public FAQs
GET    /api/testimonials           # Public testimonials
GET    /api/navigation             # Full nav tree
GET    /api/pages/:slug            # Page with blocks
```

**Response Format**:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ActionError;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Zod validation failed |
| `UNAUTHORIZED` | 401 | No valid session |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Unique constraint (slug, email) |
| `RATE_LIMITED` | 429 | Too many requests |
| `RECAPTCHA_FAILED` | 400 | reCAPTCHA verification failed |
| `FILE_TOO_LARGE` | 413 | Upload exceeds limit |
| `FILE_TYPE_INVALID` | 415 | Disallowed file type |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Dependency down (DB, Cloudinary, Email) |

---

## Rate Limiting

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| Public forms | 5 | 1 hour | IP |
| Admin login | 5 | 15 min | IP + email |
| Admin mutations | 100 | 1 min | User ID |
| Media upload | 20 | 1 hour | User ID |
| API search | 60 | 1 min | IP |
| Newsletter subscribe | 3 | 1 hour | IP + email |

---

## Validation Middleware

```typescript
// src/lib/validate.ts
export function validateAction<T>(schema: z.ZodSchema<T>) {
  return async (formData: FormData): Promise<ActionResult<T>> => {
    const data = Object.fromEntries(formData.entries());
    const result = schema.safeParse(data);
    if (!result.success) {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', fields: result.error.flatten().fieldErrors } };
    }
    return { success: true, data: result.data };
  };
}
```

---

## Approval

**Phase 2 API Contracts Deliverable** — Reply "Approved" to proceed to Auth flows & env spec, or request revisions.