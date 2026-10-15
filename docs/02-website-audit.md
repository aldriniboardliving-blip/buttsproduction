# Butts Productions — Complete Website Audit (Wix Current State)

**Audit Date**: 2026-10-14  
**Auditor**: AI Assistant (Phase 1 Discovery)  
**Source**: https://www.buttsproductions.com/ (full crawl)

---

## Executive Summary

The current Wix site contains **32 unique accessible pages** across 11 business divisions, 6 service detail pages, 4 booking/inquiry forms, 1 event page, 4 legal pages, and supporting pages. All pages share a consistent header/footer with mega-navigation. The site uses Wix's built-in booking calendar for some services and custom forms for others. Several divisions link to external domains that must be migrated.

---

## Page Inventory

### Core Pages

| # | Current URL | Title | Purpose | Key Sections | Interactions | Media | Proposed New URL | SEO Notes |
|---|-------------|-------|---------|--------------|--------------|-------|------------------|-----------|
| 1 | `/` | Butts Productions Inc | Homepage | Hero, Services grid, About preview, Team highlights, Janitorial/Consulting/Car Rental features, Events, FAQ, Newsletter, Footer | Newsletter signup, Service cards → detail pages, CTA buttons | Hero bg, 6+ service images, team photos, event images | `/` (preserve) | High priority: Organization schema, LocalBusiness, Service catalog |
| 2 | `/about` | About Us | Company story, team, clients | Hero, Our Story (long-form), Meet The Team (6 members), Our Clients | Team member social links (FB/IG placeholders) | 6 team photos, office bg | `/about` (preserve) | AboutPage schema, TeamMember markup |
| 3 | `/faq` | Frequently Asked Questions | Car rental FAQ (10 Q&As) | Hero, 10 accordion FAQs | None | Hero bg | `/faq` (preserve) | FAQPage schema with all 10 Q&As |
| 4 | `/privacy-policy` | Privacy Policy | Legal — car rental focused | Standard privacy policy template | None | None | `/privacy-policy` (preserve) | Legal page, noindex optional |
| 5 | `/accessibility-statement` | Accessibility Statement | WCAG 2.1 AA claim, physical access info | Policy, physical location access, contact coordinator | None | None | `/accessibility-statement` (preserve) | Accessibility metadata |
| 6 | `/terms-conditions` | Terms & Conditions | Car rental T&Cs (detailed) | Rental agreement, fees, usage, battery policy, cancellation, liability, governing law (NC) | None | None | `/terms-conditions` (preserve) | Legal page |
| 7 | `/refund-policy` | Refund Policy | Car rental refund policy | Eligibility, process, exceptions | None | None | `/refund-policy` (preserve) | Legal page |

### Business Division Pages (11)

| # | Current URL | Title | Business | Status | Key Content | Proposed New URL | Migration Notes |
|---|-------------|-------|----------|--------|-------------|------------------|-----------------|
| 8 | `/kleenprintsink` | Kleen Prints Ink | Kleen Prints Ink | Active | Story, product grid (6 products with prices), dual brand (KPI + STLC), CTA buttons to design form | `/businesses/kleen-prints-ink` | Product grid → Service listings; design form → booking |
| 9 | `/consulting` | Butts Consulting | Butts Consulting | Active | Coaching packages (4 tiers), Plans & Packages (7 categories with price ranges), 3 Business Consulting Packages | `/businesses/butts-consulting` | Complex pricing → structured service packages |
| 10 | `/dispatching` | Dispatching | 757 Dispatching | Active | Value prop, contact info (Jay, USDOT#), CTA to sign-up, "Why Trust Us" | `/businesses/757-dispatching` | Sign-up form separate page |
| 11 | `/sweettenderlovingcare` | Sweet Tender Loving Care | Sweet Tender Loving Care | Active | Faith-based stationery catalog, Holiday Sale (tote bag), Email club signup | `/businesses/sweet-tender-loving-care` | Products → services; email club → newsletter |
| 12 | `/carrentals` | Car Rentals | Butts Car Rentals | Active | Fleet gallery (4 vehicles), CTA to quote, FAQ link, Español link, Reviews link, Pickup location map | `/businesses/butts-car-rentals` | Fleet → service assets; quote form separate |
| 13 | `/kleenteam` | Kleen Team Entertainment | Kleen Team Entertainment | Active | DJ PHARFETCHED bio, service types (weddings, parties, reunions), Tent rental, Contact form, YouTube links | `/businesses/kleen-team-entertainment` | DJ + tent = 2 services; contact form → booking |
| 14 | `/keepingitreal` | Keeping It Real Psych | Keeping It Real Psych | **Coming Soon** | Placeholder, "Notify Me" form | `/businesses/keeping-it-real-psych` | Mark as unpublished until ready |
| 15 | `/refurbishedgoods` | Refurbished Goods | Refurbished Goods | **Coming Soon** | Placeholder, "Notify Me" form | `/businesses/refurbished-goods` | Mark as unpublished until ready |
| 16 | `keepingitkleenservices.com` | Keeping it Kleen Janitorial | Keeping it Kleen | **External** | Full separate Wix site (not crawled) | `/businesses/keeping-it-kleen` | **Migrate entire site** — crawl separately if needed |
| 17 | `givingbackpack.com` | The Giving BackPack Foundation | Giving BackPack Foundation | **External** | Nonprofit site (not crawled) | `/businesses/giving-backpack-foundation` | **Migrate entire site** |
| 18 | `whynotbuyitshop.com` | Why Not Buy It Shop | Why Not Buy It Shop | **External** | E-commerce? (not crawled) | `/businesses/why-not-buy-it-shop` | **Migrate or integrate** — clarify scope |

### Service Detail Pages (6 — under `/service-page/`)

| # | Current URL | Service | Business | Price | Duration | Location | Booking CTA | Proposed New URL |
|---|-------------|---------|----------|-------|----------|----------|-------------|------------------|
| 19 | `/service-page/car-rental` | Car Rental | Car Rentals | $70 | 1 day | Granby Street | → `/booking-calendar/car-rental` | `/services/car-rental` |
| 20 | `/service-page/consulting` | Consulting | Butts Consulting | $145 | 2 hr | Granby Street | → `/booking-calendar/consulting` | `/services/consulting` |
| 21 | `/service-page/kleen-prints-ink-virtual-consultation` | Kleen Prints Ink Virtual Consultation | KPI + STLC | $50 | 1 hr | Online | → `/booking-calendar/kleen-prints-ink-virtual-consultation` | `/services/kleen-prints-virtual-consultation` |
| 22 | `/service-page/kleen-team-entertainment` | Kleen Team Entertainment | Kleen Team | $300 | 2 hr | Customer's Place | → `/booking-calendar/kleen-team-entertainment` | `/services/kleen-team-entertainment` |
| 23 | `/service-page/keeping-it-kleen-janitorial-service` | Keeping it Kleen Janitorial | Keeping it Kleen | $100 | 1 hr | Customer's Place | → `/booking-calendar/keeping-it-kleen-janitorial-service` | `/services/keeping-it-kleen-janitorial` |
| 24 | `/service-page/dispatching` | Dispatching | Dispatching | $100 | N/A | Granby Street | → `/service-page/dispatching` (self) | `/services/dispatching` |

**Common Structure**: Hero → Service Description (with gallery) → Cancellation Policy (identical boilerplate) → Contact Details → Footer

### Booking / Inquiry Forms

| # | Current URL | Form Type | Fields | Submission Target | Proposed New URL |
|---|-------------|-----------|--------|-------------------|------------------|
| 25 | `/quote` | Car Rental Quote | 25+ fields (personal, license, insurance, dates, vehicle, mileage, terms, signature, file uploads) | Wix form backend | `/quote/car-rental` |
| 26 | `/quote-espanol` | Car Rental Quote (Spanish) | Identical to `/quote` translated | Wix form backend | `/quote/car-rental?lang=es` (i18n) |
| 27 | `/dispatch-sign-up` | Dispatch Carrier Agreement | 15 fields (carrier info, MC/DOT, truck type, payment method, load details, rate, signatures) | Wix form backend | `/quote/dispatch` |
| 28 | `/the-dispatch-sign-up` | Dispatch Agreement (Legal) | Full contract text + same form as above | Wix form backend | `/agreements/dispatch-carrier` (merge with 27) |
| 29 | `/kleenteam` (section) | Entertainment Contact | 4 fields (name, email, message) | Wix form backend | `/quote/entertainment` |
| 30 | `/kleenprintsdesign` | Custom Print Order | 12 fields (product, customization, artwork upload, shipping, size, colors) | Wix form backend | `/quote/custom-print` |
| 31 | `/coaching-services` | Coaching Session Booking | 5 fields + session tier radio + terms + signature canvas | Wix form backend | `/quote/coaching` |
| 32 | `/get-hired` | Employment Application | 12 fields (personal, SSN, background, education, citizenship, signature) | Wix form backend | `/careers/apply` |

### Event Pages

| # | Current URL | Event | Status | Details |
|---|-------------|-------|--------|---------|
| 33 | `/event-details-registration/make-the-change-community-change-drive` | Make the Change – Community Change Drive | Registration closed | Mar 21, 2026, 7506 Ave J, Norfolk VA; Laundry Day for Homeless fundraiser |

### Booking Calendar Pages (Wix Built-in)

| # | Current URL | Service | Notes |
|---|-------------|---------|-------|
| 34 | `/booking-calendar/car-rental` | Car Rental | Wix booking widget |
| 35 | `/booking-calendar/consulting` | Consulting | Wix booking widget |
| 36 | `/booking-calendar/kleen-prints-ink-virtual-consultation` | KPI Virtual | Wix booking widget |
| 37 | `/booking-calendar/kleen-team-entertainment` | Kleen Team | Wix booking widget |
| 38 | `/booking-calendar/keeping-it-kleen-janitorial-service` | Janitorial | Wix booking widget |

### Service Listing Page

| # | Current URL | Purpose | Links To |
|---|-------------|---------|----------|
| 39 | `/book-online` | Service directory (6 cards) | 5 → booking-calendar, 1 → service-page/dispatching |

### Additional Pages (Referenced/Linked)

| # | Current URL | Title | Notes |
|---|-------------|-------|-------|
| 40 | `/coming-soon-01` | Sweet Tender Loving Care — Tote Bag | Product page, "Shop Now" from STLC page |
| 41 | `/coming-soon-03` | Award Page | Image only, linked from Homepage "Learn More" |
| 42 | `/copy-of-coaching-services` | Duplicate coaching page | Linked from Consulting page |
| 43 | `/ongoing-entrepreneurial-services` | Consulting package | Linked from Consulting page |
| 44 | `/copy-of-ongoing-entrepreneurial` | Duplicate | Linked from Consulting page |
| 45 | `/general-5` | Reviews/Testimonials | Linked from Car Rentals page as "Reviews" |
| 46 | `/portfolio-collections/carrental/chevy` | Car rental portfolio | Linked from Car Rentals page |
| 47 | `/portfolio-collections/carrental/project-title-6` | Car rental portfolio | Linked from Car Rentals page |

---

## Navigation Structure (Current)

### Header Mega-Menu
```
Home → /
About → /about
Services ▼
  ├─ Keeping it Kleen Janitorial Services → http://keepingitkleenservices.com (EXT)
  ├─ Kleen Prints Ink → /kleenprintsink
  ├─ Butts Consulting → /consulting
  ├─ Dispatching → /dispatching
  ├─ Sweet Tender Loving Care → /sweettenderlovingcare
  ├─ Car Rentals → /carrentals
  ├─ The Giving BackPack Foundation → http://givingbackpack.com (EXT)
  ├─ Kleen Team Entertainment → /kleenteam
  ├─ Why Not Buy It Shop → https://whynotbuyitshop.com/ (EXT)
  ├─ Keeping It Real Psych → /keepingitreal
  └─ Refurbished Goods → /refurbishedgoods
Quote ▼
  ├─ Car Quote → /quote
  ├─ Dispatch Sign up → /dispatch-sign-up
  └─ Get Hired → /get-hired
More ▼ (empty/dropdown placeholder)
```

### Footer
- Company info + contact details
- Newsletter signup
- Social: Facebook, Instagram, Turo
- Legal links: Privacy, Accessibility, Terms, Refund

---

## Content & Media Inventory

### Images (Wix CDN - static.wixstatic.com)
- **Hero/Background**: ~15 unique hero images across pages
- **Team Photos**: 6 professional headshots
- **Service Images**: 6 service card thumbnails + 20+ gallery images across service pages
- **Product Images**: 6 product shots (Kleen Prints), 4 vehicle photos (Car Rentals), tote bag (STLC)
- **Event Images**: 3 for "Make the Change" event
- **Logos**: KPI logo, KTE logo, 757 Dispatching logo, BPCR logo
- **Misc**: Office, business meeting, blue skies decorative

### Documents/Uploads Required (from forms)
- Driver's license (car rental)
- Insurance card (car rental)
- Artwork/design files (custom prints)
- Signature (multiple forms)

### Videos
- YouTube: `@thegbpfoundation` (Giving BackPack), `@camplifeliving4us` (Kleen Team)

---

## Dynamic Content Opportunities (CMS-Managed)

| Content Type | Current State | CMS Strategy |
|--------------|---------------|--------------|
| **Business Divisions** | 11 hardcoded pages | `Business` collection: name, slug, logo, cover, description, contact, social, featured, order, published, SEO |
| **Services** | 6 hardcoded service pages | `Service` collection: name, slug, business ref(s), category, price, duration, location, description, gallery, booking form config, featured, order, published, SEO |
| **Service Categories** | Implicit (janitorial, consulting, rental, etc.) | `Category` taxonomy for filtering |
| **Team Members** | 6 hardcoded on About | `TeamMember` collection: name, role, bio, photo, social, business ref, order |
| **Events** | 1 hardcoded event page | `Event` collection: title, slug, date, location, description, images, registration status, SEO |
| **FAQs** | 10 hardcoded on /faq | `FAQ` collection: question, answer, category, published, order |
| **Testimonials/Reviews** | 1 page (general-5) + implicit | `Testimonial` collection: author, role, content, rating, business/service ref, published |
| **Statistics** | Homepage "highlights" (unverified) | `Statistic` collection: label, value, icon, published |
| **Homepage Sections** | Hardcoded | `PageSection` blocks: Hero, Grid, RichText, Gallery, Stats, Testimonials, FAQ, CTA, Events, Contact |
| **Navigation** | Hardcoded mega-menu | `NavigationItem` tree: label, href, children, order, published |
| **Site Settings** | Scattered | `SiteSettings` singleton: contact, social, SEO defaults, analytics IDs |
| **Media Assets** | Wix CDN URLs | `MediaAsset` collection: Cloudinary public_id, alt, width, height, folder, usage refs |
| **Bookings/Inquiries** | Wix form submissions | `Booking` collection: service ref, form data, status, history, notes, timestamps |
| **Newsletter Subscribers** | Wix form | `NewsletterSubscriber`: email, source, confirmed, timestamps |
| **Career Applications** | Wix form | `JobApplication`: form data, status, timestamps |
| **Legal Pages** | 4 hardcoded | `LegalPage` collection: slug, title, content, updatedAt |

---

## Form Field Specifications (for Zod Schemas)

### Car Rental Quote (`/quote` + `/quote-espanol`)
```
firstName, lastName, email, phone, birthday (21+), address, cityState, zip,
pickupDate, pickupTime, driversLicense (file), dropoffDate, dropoffTime,
insuranceCard (file), insuranceType (own/none), additionalDriver (yes/no),
inTown (yes/no → 150mi/day), unlimitedMiles (no/yes+$80),
termsAccepted (boolean), signature (canvas), vehicleSelection (enum: 4 vehicles)
```

### Dispatch Sign-up (`/dispatch-sign-up` + `/the-dispatch-sign-up`)
```
firstName, lastName, email, phone, company, mcNumber, dotNumber, truckType,
paymentMethod (zelle/credit+3.6%/cashapp+1.6%/ach),
pickupLocation, pickupDate, deliveryLocation, deliveryDate, weight, commodity, equipment,
totalRate, detentionRate, termsAccepted, carrierSignature, dispatcherSignature
```

### Coaching Services (`/coaching-services`)
```
firstName, lastName, email, phone, sessionDateTime,
sessionTier (45min$150 / 120min$250 / 360min$400),
termsAccepted, signature (canvas)
```

### Kleen Prints Design (`/kleenprintsdesign`)
```
firstName, lastName, email, deliveryAddress, phone,
product (tshirt$25 / decal$15 / hat$30 / mug$20 / candle$30),
shirtColor, fontColor, shirtSize, customText, inspirationImage (file), dueDate
```

### Entertainment Contact (`/kleenteam` section)
```
firstName, lastName, email, message
```

### Get Hired (`/get-hired`)
```
firstName, lastName, address, phone, email, ssn, birthday, position,
desiredSalary, shirtSize, felonyConviction (y/n), highSchoolGrad (n/yes/ged),
usCitizen (y/n), everFired (y/n), acknowledgmentSignature
```

### Notify Me Forms (Coming Soon pages)
```
email
```

---

## SEO & Structured Data Requirements

### Current Meta Patterns
- All pages share similar title format: `"Page Title | Butts Productions"`
- Meta descriptions generic or missing
- Open Graph tags present but minimal
- No JSON-LD structured data detected

### Required Structured Data (New Site)
| Page Type | Schema.org Types |
|-----------|------------------|
| Homepage | `Organization`, `WebSite`, `Service` (catalog) |
| Business Page | `LocalBusiness` (or `Organization`), `Service` (offered) |
| Service Page | `Service`, `Offer` (price), `Place` (location) |
| Event Page | `Event`, `Place`, `Organization` |
| FAQ Page | `FAQPage` with `Question`/`Answer` |
| Booking Form | No schema (private) |
| About Page | `AboutPage`, `Organization`, `Person` (team) |
| Legal Pages | `WebPage` (no special schema) |

### URL Redirect Map (Wix → Next.js)
| Wix URL | Next.js URL | Redirect Type |
|---------|-------------|---------------|
| `/` | `/` | — (same) |
| `/about` | `/about` | — |
| `/faq` | `/faq` | — |
| `/privacy-policy` | `/privacy-policy` | — |
| `/accessibility-statement` | `/accessibility-statement` | — |
| `/terms-conditions` | `/terms-conditions` | — |
| `/refund-policy` | `/refund-policy` | — |
| `/kleenprintsink` | `/businesses/kleen-prints-ink` | 301 |
| `/consulting` | `/businesses/butts-consulting` | 301 |
| `/dispatching` | `/businesses/757-dispatching` | 301 |
| `/sweettenderlovingcare` | `/businesses/sweet-tender-loving-care` | 301 |
| `/carrentals` | `/businesses/butts-car-rentals` | 301 |
| `/kleenteam` | `/businesses/kleen-team-entertainment` | 301 |
| `/keepingitreal` | `/businesses/keeping-it-real-psych` | 301 |
| `/refurbishedgoods` | `/businesses/refurbished-goods` | 301 |
| `/service-page/car-rental` | `/services/car-rental` | 301 |
| `/service-page/consulting` | `/services/consulting` | 301 |
| `/service-page/kleen-prints-ink-virtual-consultation` | `/services/kleen-prints-virtual-consultation` | 301 |
| `/service-page/kleen-team-entertainment` | `/services/kleen-team-entertainment` | 301 |
| `/service-page/keeping-it-kleen-janitorial-service` | `/services/keeping-it-kleen-janitorial` | 301 |
| `/service-page/dispatching` | `/services/dispatching` | 301 |
| `/quote` | `/quote/car-rental` | 301 |
| `/quote-espanol` | `/quote/car-rental?lang=es` | 301 |
| `/dispatch-sign-up` | `/quote/dispatch` | 301 |
| `/the-dispatch-sign-up` | `/agreements/dispatch-carrier` | 301 |
| `/kleenprintsdesign` | `/quote/custom-print` | 301 |
| `/coaching-services` | `/quote/coaching` | 301 |
| `/get-hired` | `/careers/apply` | 301 |
| `/book-online` | `/services` | 301 |
| `/booking-calendar/*` | `/services/*/book` | 301 (each) |
| `/event-details-registration/*` | `/events/*` | 301 |

---

## Technical Debt & Issues Noted

1. **Duplicate Pages**: `/coaching-services` + `/copy-of-coaching-services`; `/ongoing-entrepreneurial-services` + `/copy-of-ongoing-entrepreneurial`
2. **External Dependencies**: 3 divisions on separate domains; Turo integration for car rentals
3. **Inconsistent Booking**: Mix of Wix booking calendar + custom forms
4. **Boilerplate Content**: Cancellation policy duplicated verbatim across 6 service pages
5. **Placeholder Pages**: 2 "Coming Soon" divisions with no content
6. **Spanish Form**: Separate page rather than i18n
7. **No Sitemap/XML**: Wix auto-generates but not accessible for audit
8. **Analytics**: No GA4/GTM detected in source
9. **Accessibility**: Claims WCAG 2.1 AA but physical location has "NO wheelchair-accessible entrance"
10. **Legal Templates**: Privacy/Refund policies are Wix templates with placeholders

---

## Migration Priority Order (Phased Rollout)

### Phase 1A — Core Foundation (Launch Blockers)
1. Homepage (`/`)
2. About (`/about`)
3. Business Directory (`/businesses`) + 9 active business pages
4. Service Directory (`/services`) + 6 service detail pages
5. Car Rental Quote (`/quote/car-rental`) + Spanish variant
6. Contact/Footer (global)

### Phase 1B — Booking & Inquiry Forms
7. Dispatch Sign-up (`/quote/dispatch`)
8. Coaching Booking (`/quote/coaching`)
9. Custom Print Order (`/quote/custom-print`)
10. Entertainment Contact (`/quote/entertainment`)
11. Careers Application (`/careers/apply`)

### Phase 1C — Content & Legal
12. FAQ (`/faq`) — CMS-managed
13. Events (`/events`) — CMS-managed
14. Legal pages (4) — CMS-managed
15. Newsletter signup (global)

### Phase 1D — Admin CMS
16. Admin dashboard + all CRUD interfaces
17. Media library (Cloudinary)
18. Navigation builder
19. Page builder (block-based)

---

## Open Questions for Phase 2

1. **Keeping it Kleen external site**: Full crawl needed? Or treat as separate brand with cross-link?
2. **Giving BackPack Foundation**: Nonprofit compliance (donations, 501c3)? Separate donation flow?
3. **Why Not Buy It Shop**: E-commerce scope? Products, cart, checkout, payments?
4. **Vehicle Fleet Management**: Real-time availability? Turo API integration?
5. **Booking Calendar**: Replace Wix widget with custom availability engine?
6. **Multi-language**: Full i18n (EN/ES) or just car rental quote?
7. **Payment Processing**: Stripe for deposits/payments? Or invoice-only?
8. **Email Templates**: Design system for transactional emails?
9. **SMS Notifications**: Twilio for booking confirmations/reminders?
10. **Team Member Detail Pages**: Individual bios or just About page cards?

---

## Appendix: All Unique Wix Image URLs (for Cloudinary Migration)

*Extracted from audit — 80+ unique asset URLs on static.wixstatic.com. Full list in migration script.*
- Key prefixes: `4953e3_`, `11062b_`, `0114db003c2f4b84a5e41a0ff707e34a`, `5b13b6aa00be47bda86920ec41ea6a41`, `8a99d705eabb4737a60c232a89e01904`, `d4367b20ae2e4036b18c34262d5ed031`, `0fdef751204647a3bbd7eaa2827ed4f9`, `c7d035ba85f6486680c2facedecdcf4d`, `6ea5b4a88f0b4f91945b40499aa0af00`, `01c3aff52f2a4dffa526d7a9843d46ea`, `64a918_`