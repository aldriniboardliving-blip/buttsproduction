# Butts Productions — Functional & Non-Functional Requirements

**Version**: 1.0  
**Phase**: 1 Deliverable  
**Status**: For Approval

---

## 1. Functional Requirements

### 1.1 Public Website

#### 1.1.1 Global Layout & Navigation
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-GL-01 | Responsive header with logo, primary navigation (mega-menu), and CTA button | Must |
| FR-GL-02 | Mega-menu: Services (11 businesses), Quote (3 forms), About, Contact | Must |
| FR-GL-03 | Mobile hamburger menu with collapsible sections | Must |
| FR-GL-04 | Sticky header on scroll (configurable) | Should |
| FR-GL-05 | Footer: company info, contact, newsletter signup, social links, legal links | Must |
| FR-GL-06 | Navigation managed via CMS (NavigationItem tree) | Must |
| FR-GL-07 | Breadcrumb navigation on all non-home pages | Must |
| FR-GL-08 | Skip-to-main-content link for accessibility | Must |

#### 1.1.2 Homepage
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-HP-01 | Hero section: headline, subheadline, primary CTA, background image/video | Must |
| FR-HP-02 | Company introduction / mission statement | Must |
| FR-HP-03 | Business divisions grid (cards → business pages) | Must |
| FR-HP-04 | Featured services grid (cards → service pages) | Must |
| FR-HP-05 | Statistics/numbers section (CMS-managed, verified only) | Should |
| FR-HP-06 | Upcoming events preview (next 3) | Should |
| FR-HP-07 | Testimonials carousel (CMS-managed) | Should |
| FR-HP-08 | FAQ preview (top 3-5) | Could |
| FR-HP-09 | Newsletter signup section | Must |
| FR-HP-10 | All sections built from reusable Content Blocks (CMS) | Must |

#### 1.1.3 Business Directory & Pages
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-BZ-01 | `/businesses` — filterable, paginated grid of published businesses | Must |
| FR-BZ-02 | `/businesses/[slug]` — dynamic detail page per business | Must |
| FR-BZ-03 | Business page: logo, cover image, description, contact info, social links, associated services, team members | Must |
| FR-BZ-04 | Automatic slug generation from name + collision handling | Must |
| FR-BZ-05 | Publish/Unpublish/Archive workflow | Must |
| FR-BZ-06 | Display order configurable in admin | Must |
| FR-BZ-07 | Featured flag for homepage placement | Must |
| FR-BZ-08 | SEO metadata per business (title, description, OG, canonical) | Must |
| FR-BZ-09 | Structured data: LocalBusiness/Organization + Service catalog | Must |

#### 1.1.4 Service Directory & Pages
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SV-01 | `/services` — filterable by category, business, price range; paginated | Must |
| FR-SV-02 | `/services/[slug]` — dynamic detail page per service | Must |
| FR-SV-03 | Service page: name, description, price, duration, location, gallery, booking CTA | Must |
| FR-SV-04 | Service-to-Business many-to-many relationship | Must |
| FR-SV-05 | Category taxonomy for filtering | Must |
| FR-SV-06 | Booking form configuration per service (which form, required fields) | Must |
| FR-SV-07 | Publish/Unpublish/Archive workflow | Must |
| FR-SV-08 | Automatic appearance in navigation dropdown when published | Must |
| FR-SV-09 | SEO metadata + structured data (Service, Offer, Place) | Must |

#### 1.1.5 Booking & Inquiry Forms
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-BK-01 | **Car Rental Quote** (`/quote/car-rental`): 25+ fields, file uploads (license, insurance), vehicle selection, terms acceptance, signature canvas | Must |
| FR-BK-02 | **Dispatch Sign-up** (`/quote/dispatch`): carrier agreement form with load details, rate, payment method, dual signatures | Must |
| FR-BK-03 | **Coaching Booking** (`/quote/coaching`): session tier selection, datetime picker, terms, signature | Must |
| FR-BK-04 | **Custom Print Order** (`/quote/custom-print`): product selection, customization options, artwork upload, shipping | Must |
| FR-BK-05 | **Entertainment Contact** (`/quote/entertainment`): simple 4-field form | Must |
| FR-BK-06 | **Careers Application** (`/careers/apply`): employment form with sensitive fields (SSN, background) | Must |
| FR-BK-07 | **Notify Me** (coming soon pages): email capture | Should |
| FR-BK-08 | Server-side validation with Zod schemas for all forms | Must |
| FR-BK-09 | Client-side validation with React Hook Form | Must |
| FR-BK-10 | reCAPTCHA v3 / hCaptcha on all public forms | Must |
| FR-BK-11 | Rate limiting: 5 submissions/hour/IP per form | Must |
| FR-BK-12 | File upload: max 15MB, allowed types (jpg, png, pdf, doc), virus scan | Must |
| FR-BK-13 | Submission → create Booking record with status `New` | Must |
| FR-BK-14 | Email confirmation to customer (template per form type) | Must |
| FR-BK-15 | Email notification to admin (with submission summary) | Must |
| FR-BK-16 | Spanish variant of Car Rental Quote (i18n) | Should |

#### 1.1.6 Booking Lifecycle (Admin)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-BL-01 | Statuses: `New` → `Pending Review` → `Contacted` → `Confirmed` → `In Progress` → `Completed` / `Cancelled` / `Rejected` | Must |
| FR-BL-02 | Admin dashboard: paginated, filterable (status, service, business, date range), searchable | Must |
| FR-BL-03 | Booking detail view: all form data, status history, internal notes, timestamps | Must |
| FR-BL-04 | Status transition: dropdown with validation (no invalid jumps) | Must |
| FR-BL-05 | Internal notes (admin-only, timestamped, author tracked) | Must |
| FR-BL-06 | Email customer on status change (configurable templates) | Should |
| FR-BL-07 | Export filtered bookings to CSV | Could |
| FR-BL-08 | Audit log: every status change, note, assignment recorded | Must |

#### 1.1.7 Events
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EV-01 | `/events` — listing with past/upcoming filters | Must |
| FR-EV-02 | `/events/[slug]` — detail page with date, location, description, images, registration status | Must |
| FR-EV-03 | Registration form (when open) → Booking record with service=Event | Should |
| FR-EV-04 | Social sharing buttons | Could |

#### 1.1.8 FAQs
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-FQ-01 | `/faq` — categorized, searchable, accordion UI | Must |
| FR-FQ-02 | FAQ schema markup (FAQPage) | Must |
| FR-FQ-03 | Admin: CRUD, categories, publish toggle, order | Must |

#### 1.1.9 Testimonials
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TS-01 | Homepage carousel + service/business page integration | Should |
| FR-TS-02 | Admin: author, role, content, rating, associated entity, publish toggle | Should |

#### 1.1.10 Careers
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CR-01 | `/careers` — job listings (if multiple) or single apply page | Should |
| FR-CR-02 | Application form with file upload (resume) | Should |
| FR-CR-03 | Admin: view applications, status workflow | Should |

#### 1.1.11 Legal Pages
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-LG-01 | Privacy Policy, Terms, Refund Policy, Accessibility — CMS-managed content | Must |
| FR-LG-02 | Cookie consent banner (GA4, necessary/analytics categories) | Must |
| FR-LG-03 | Last updated timestamp displayed | Should |

#### 1.1.12 Newsletter
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NL-01 | Footer + homepage signup → `NewsletterSubscriber` record | Should |
| FR-NL-02 | Double opt-in (confirmation email) | Should |
| FR-NL-03 | Admin: view subscribers, export CSV | Could |

### 1.2 Admin Dashboard

#### 1.2.1 Authentication & Security
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AD-01 | `/admin/login` — dedicated route, branded, no public link | Must |
| FR-AD-02 | Email/password login with server-side verification | Must |
| FR-AD-03 | Secure session cookie: HttpOnly, Secure, SameSite=Lax, 24h/30d expiry | Must |
| FR-AD-04 | Remember-me checkbox (extends to 30 days) | Must |
| FR-AD-05 | Login throttling: 5 attempts/15min/IP, then lockout | Must |
| FR-AD-06 | Generic error messages (no account enumeration) | Must |
| FR-AD-07 | Logout → session destruction + cookie clearance | Must |
| FR-AD-08 | Initial admin setup: one-time secure page (token via env) | Must |
| FR-AD-09 | Password hashing: Argon2id (via `bcrypt` or `@node-rs/argon2`) | Must |
| FR-AD-10 | CSRF protection on all mutating actions | Must |
| FR-AD-11 | Role-based access control (SuperAdmin only for v1) | Must |
| FR-AD-12 | Admin routes: middleware protection (redirect to login) | Must |
| FR-AD-13 | `robots.txt` disallow `/admin/*`, `noindex` on admin pages | Must |

#### 1.2.2 Dashboard Overview
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DB-01 | Metrics cards: Total Bookings, New (24h), Pending, Confirmed, Completed, Cancelled | Must |
| FR-DB-02 | Recent bookings table (last 10) with quick status actions | Must |
| FR-DB-03 | Published businesses count, Published services count | Must |
| FR-DB-04 | Upcoming events count | Should |
| FR-DB-05 | All metrics from real DB queries (no hardcoding) | Must |

#### 1.2.3 Content Management
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CM-01 | Businesses: list, create, edit, delete, publish/unpublish, reorder | Must |
| FR-CM-02 | Services: list, create, edit, delete, publish/unpublish, reorder, assign to businesses | Must |
| FR-CM-03 | Pages/Sections: block-based page builder for homepage + custom pages | Must |
| FR-CM-04 | Navigation: drag-drop tree editor for mega-menu | Must |
| FR-CM-05 | Media Library: Cloudinary browser, upload, search, delete, alt text | Must |
| FR-CM-06 | Events: CRUD, registration management | Should |
| FR-CM-07 | FAQs: CRUD, categories | Must |
| FR-CM-08 | Testimonials: CRUD | Should |
| FR-CM-09 | Site Settings: contact info, social, SEO defaults, analytics IDs | Must |
| FR-CM-10 | Legal Pages: CRUD | Must |

#### 1.2.4 Media Management (Cloudinary)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-MM-01 | Signed upload endpoint (server-only credentials) | Must |
| FR-MM-02 | Direct upload from browser to Cloudinary (unsigned preset for admin) | Must |
| FR-MM-03 | Allowed formats: jpg, png, webp, avif, pdf; max 20MB | Must |
| FR-MM-04 | Auto-generate responsive variants (Cloudinary `f_auto,q_auto`) | Must |
| FR-MM-05 | Store `public_id`, `secure_url`, `width`, `height`, `format`, `folder` in MongoDB | Must |
| FR-MM-06 | Alt text required on upload | Must |
| FR-MM-07 | Usage tracking: prevent deletion if referenced | Should |
| FR-MM-08 | Image optimization: Next.js `Image` component with Cloudinary loader | Must |

#### 1.2.5 Page Builder (Block-Based)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PB-01 | Predefined block types: Hero, RichText, ImageText, Gallery, ServiceGrid, BusinessGrid, Statistics, Testimonials, FAQ, CTA, Events, Contact | Must |
| FR-PB-02 | Blocks: add, edit, reorder (drag-drop), enable/disable, delete | Must |
| FR-PB-03 | Server-side validation of block config (Zod) | Must |
| FR-PB-04 | Render only allowlisted block components (no arbitrary HTML/JS) | Must |
| FR-PB-05 | Homepage = page with slug `home` managed via blocks | Must |
| FR-PB-06 | Custom pages: create via blocks, assign slug | Should |

---

### 1.3 Technical / System Requirements

#### 1.3.1 Data Layer
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DL-01 | MongoDB collections: AdminUsers, Sessions, Businesses, Services, Categories, Pages, NavigationItems, ContentBlocks, MediaAssets, Bookings, BookingStatusHistory, Events, FAQs, Testimonials, NewsletterSubscribers, SiteSettings, LegalPages, AuditLogs | Must |
| FR-DL-02 | Mongoose models with TypeScript interfaces | Must |
| FR-DL-03 | Indexes: unique slugs (business, service, page), compound indexes for queries | Must |
| FR-DL-04 | Timestamps (`createdAt`, `updatedAt`) on all collections | Must |
| FR-DL-05 | Soft delete (archived flag) for content entities | Must |
| FR-DL-06 | Referential integrity: cascade/archive on delete | Must |
| FR-DL-07 | Pagination default: 20/page, max 100 | Must |

#### 1.3.2 API & Server Actions
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AP-01 | Route Handlers for: auth, media upload, webhook endpoints | Must |
| FR-AP-02 | Server Actions for: form submissions, admin mutations | Must |
| FR-AP-03 | Zod validation at every boundary | Must |
| FR-AP-04 | Consistent error response format: `{ success: false, error: { code, message, fields? } }` | Must |
| FR-AP-05 | Rate limiting middleware (login, forms, API) | Must |

#### 1.3.3 Email (Resend)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EM-01 | Transactional templates: booking confirmation, admin notification, status change, newsletter confirm | Must |
| FR-EM-02 | Server-side only (no client-side email sending) | Must |
| FR-EM-03 | Retry logic + dead letter logging | Should |

#### 1.3.4 SEO & Metadata
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SE-01 | Dynamic metadata per page (title, description, OG, Twitter, canonical) | Must |
| FR-SE-02 | XML sitemap generation (`/sitemap.xml`) — all public pages | Must |
| FR-SE-03 | `robots.txt` with admin disallow, sitemap reference | Must |
| FR-SE-04 | Structured data (JSON-LD) per page type | Must |
| FR-SE-05 | 301 redirect map for Wix → Next.js URLs (middleware or route handlers) | Must |
| FR-SE-06 | Clean URLs: no trailing slashes, lowercase, hyphenated slugs | Must |

#### 1.3.5 Internationalization (i18n)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-IL-01 | Spanish variant for Car Rental Quote only (Phase 1) | Should |
| FR-IL-02 | `?lang=es` query param or `/es/` prefix | Should |
| FR-IL-03 | Content translation via CMS (future) | Could |

---

## 2. Non-Functional Requirements

### 2.1 Performance
| ID | Requirement | Target |
|----|-------------|--------|
| NF-PF-01 | Lighthouse Performance Score | ≥ 90 |
| NF-PF-02 | First Contentful Paint (FCP) | < 1.8s |
| NF-PF-03 | Largest Contentful Paint (LCP) | < 2.5s |
| NF-PF-04 | Time to Interactive (TTI) | < 3.5s |
| NF-PF-05 | Cumulative Layout Shift (CLS) | < 0.1 |
| NF-PF-06 | First Input Delay (FID) / INP | < 200ms |
| NF-PF-07 | Page weight (homepage) | < 500KB gzipped |
| NF-PF-08 | Image optimization: WebP/AVIF, responsive srcset, lazy loading | Required |
| NF-PF-09 | Font optimization: self-hosted, `font-display: swap`, preload | Required |
| NF-PF-10 | Server Response Time (p95) | < 500ms |
| NF-PF-11 | Database query latency (p95) | < 100ms |
| NF-PF-12 | Caching: `Cache-Control` for static assets (1yr), HTML (stale-while-revalidate) | Required |

### 2.2 Accessibility (WCAG 2.2 AA)
| ID | Requirement | Target |
|----|-------------|--------|
| NF-AC-01 | Semantic HTML5 landmarks (header, nav, main, aside, footer) | Required |
| NF-AC-02 | Heading hierarchy (h1-h6) correct on all pages | Required |
| NF-AC-03 | Color contrast ratio ≥ 4.5:1 (text), ≥ 3:1 (UI) | Required |
| NF-AC-04 | Keyboard focus visible on all interactive elements | Required |
| NF-AC-05 | Skip links, ARIA labels, roles where needed | Required |
| NF-AC-06 | Form labels, error messages announced (aria-live) | Required |
| NF-AC-07 | Alt text on all images (decorative: `alt=""`) | Required |
| NF-AC-08 | Reduced motion preference respected | Required |
| NF-AC-09 | Focus trap in modals/drawers | Required |
| NF-AC-10 | Language attribute (`lang="en"`) | Required |

### 2.3 Security
| ID | Requirement | Target |
|----|-------------|--------|
| NF-SC-01 | HTTPS only (HSTS header) | Required |
| NF-SC-02 | Content Security Policy (strict, nonce-based for scripts) | Required |
| NF-SC-03 | X-Frame-Options: DENY | Required |
| NF-SC-04 | X-Content-Type-Options: nosniff | Required |
| NF-SC-05 | Referrer-Policy: strict-origin-when-cross-origin | Required |
| NF-SC-06 | Permissions-Policy: restrict camera, microphone, geolocation | Required |
| NF-SC-07 | No secrets in client bundle (verify with `next build` analysis) | Required |
| NF-SC-08 | Environment validation at startup (Zod schema for `process.env`) | Required |
| NF-SC-09 | MongoDB: least-privilege user, TLS, IP allowlist (Atlas) | Required |
| NF-SC-10 | Cloudinary: signed uploads, no secret in browser | Required |
| NF-SC-11 | Input sanitization: DOMPurify for any rich text | Required |
| NF-SC-12 | NoSQL injection prevention: Mongoose schema validation + allowlists | Required |
| NF-SC-13 | Audit logging: admin actions, auth events, sensitive data access | Required |
| NF-SC-14 | Dependency scanning: `npm audit` in CI, Dependabot alerts | Required |
| NF-SC-15 | Penetration testing checklist before launch | Required |

### 2.4 Reliability & Operations
| ID | Requirement | Target |
|----|-------------|--------|
| NF-RL-01 | Uptime SLA (Vercel) | 99.9% |
| NF-RL-02 | Error monitoring: Sentry (server + client) | Required |
| NF-RL-03 | Structured logging (Pino/Winston) with request IDs | Required |
| NF-RL-04 | Health check endpoint (`/api/health`) | Required |
| NF-RL-05 | Database backup: daily automated (Atlas) + point-in-time recovery | Required |
| NF-RL-06 | Deployment: preview on every PR, production on main merge | Required |
| NF-RL-07 | Rollback: Vercel instant rollback capability | Required |
| NF-RL-08 | Environment parity: dev, staging, production configs | Required |

### 2.5 Maintainability & Developer Experience
| ID | Requirement | Target |
|----|-------------|--------|
| NF-MT-01 | TypeScript strict mode, no `any` | Required |
| NF-MT-02 | ESLint + Prettier (configured, CI gate) | Required |
| NF-MT-03 | Unit tests: Vitest, ≥ 80% coverage on business logic | Required |
| NF-MT-04 | Integration tests: MongoDB operations, auth, forms | Required |
| NF-MT-05 | E2E tests: Playwright, critical user journeys | Required |
| NF-MT-06 | Component library: Storybook (optional) | Could |
| NF-MT-07 | Documentation: JSDoc for public APIs, README per package | Required |
| NF-MT-08 | Git hooks: Husky (pre-commit lint, test) | Should |

---

## 3. Data Model (Preliminary — Phase 2 Will Finalize)

### Core Collections
```
AdminUsers: { email, passwordHash, name, role, lastLogin, createdAt }
Sessions: { userId, token, expiresAt, userAgent, ip, createdAt }
Businesses: { name, slug, logo, coverImage, description, contact, social, featured, order, published, archived, seo, createdAt, updatedAt }
Services: { name, slug, businessIds[], categoryId, price, duration, location, description, gallery[], bookingFormConfig, featured, order, published, archived, seo, createdAt, updatedAt }
Categories: { name, slug, description, order }
Pages: { slug, title, blocks[], seo, published, createdAt, updatedAt }
NavigationItems: { label, href, children[], order, published, parentId }
ContentBlocks: { type, config, enabled, order } // embedded in Pages
MediaAssets: { publicId, url, width, height, format, folder, alt, usageCount, createdAt }
Bookings: { serviceId, businessId, formData, status, statusHistory[], notes[], customerEmail, customerPhone, submittedAt, updatedAt }
BookingStatusHistory: { bookingId, fromStatus, toStatus, changedBy, note, timestamp }
Events: { title, slug, date, location, description, images[], registrationOpen, maxAttendees, seo, createdAt, updatedAt }
FAQs: { question, answer, category, published, order }
Testimonials: { author, role, content, rating, entityType, entityId, published }
NewsletterSubscribers: { email, source, confirmed, confirmedAt, createdAt }
JobApplications: { formData, status, resumeFileId, createdAt }
SiteSettings: { singleton: contact, social, seoDefaults, analytics, email }
LegalPages: { slug, title, content, updatedAt }
AuditLogs: { actorId, action, targetType, targetId, metadata, ip, timestamp }
```

### Key Indexes
- `Businesses.slug` (unique, partial: published+archived)
- `Services.slug` (unique, partial: published+archived)
- `Pages.slug` (unique)
- `Bookings.serviceId + status + submittedAt`
- `Bookings.customerEmail` (for lookup)
- `MediaAssets.publicId` (unique)
- `NavigationItems.parentId + order`

---

## 4. Acceptance Criteria (Phase 1 Complete)

- [ ] All 47 audited pages documented with proposed URLs
- [ ] All 11 business divisions cataloged with content requirements
- [ ] All 7 booking/inquiry forms specified with field-level detail
- [ ] Dynamic content matrix complete (16 content types)
- [ ] Redirect map complete (30+ entries)
- [ ] Functional requirements numbered and prioritized (Must/Should/Could)
- [ ] Non-functional requirements with measurable targets
- [ ] Preliminary data model with collections and indexes
- [ ] Open questions log for Phase 2 resolution

---

## 5. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| External site migration complexity (3 domains) | High | High | Phase 1A: crawl all 3; decide per-site strategy |
| Wix image CDN migration at scale | Medium | Medium | Automated script: download → Cloudinary upload → DB reference |
| Complex car rental form validation | High | High | Zod schema + integration tests; staged rollout |
| Booking calendar replacement (Wix widget) | Medium | High | Custom availability engine in Phase 1B |
| SEO traffic loss on migration | Medium | High | 301 redirect map, preserve content, monitor GSC |
| Admin CMS scope creep | High | Medium | Strict block allowlist; defer advanced blocks to Phase 9 |
| Spanish i18n maintenance burden | Low | Medium | Single-form i18n only; full i18n in future phase |
| Sensitive data in Get Hired (SSN) | Medium | High | Encrypt at rest; minimal retention; audit access |

---

## 6. Approval

**Phase 1 Deliverables:**
- `docs/00-project-overview.md` — Project context, stack, roadmap
- `docs/01-requirements.md` — This document
- `docs/02-website-audit.md` — Complete page inventory

**Next Phase (2)**: Architecture & Data Model — Finalize MongoDB schemas, API contracts, auth flows, environment config.

**Approval Required**: Reply "Approved" to proceed to Phase 2, or request revisions.