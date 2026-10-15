# Butts Productions — Project Overview

## Project Summary
Complete redesign and rebuild of the Butts Productions website (buttsproductions.com), replacing the existing Wix implementation with a modern, responsive, SEO-friendly Next.js application backed by MongoDB and Cloudinary, including a secure administrative dashboard for content management.

## Stack Decisions (Confirmed)

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | Next.js 16 (App Router) + React 19 + TypeScript | Existing scaffold in `buttsproduction/` |
| **Styling** | Tailwind CSS v4 | Configured with Turbopack |
| **Database** | MongoDB Atlas (new cluster) + Mongoose | Server-side only |
| **Media** | Cloudinary (new account) | Signed uploads, asset references in MongoDB |
| **Auth** | Session-based (cookies), HttpOnly, Secure, SameSite=Lax | Single super-admin, remember-me, MFA-ready |
| **Email** | Resend (server-side, free tier) | Transactional: booking confirmations, admin alerts |
| **Analytics** | Google Analytics 4 + Cookie Consent Banner | GDPR/CCPA compliant |
| **Error Monitoring** | Sentry (free tier) | Server + client error tracking |
| **Hosting** | Vercel (production + preview deployments) | Custom domain, staging subdomain |
| **DNS** | Managed via Vercel | Cutover after staging approval |

## Project Roles
- **Senior Full-Stack Engineer / Architect / UI/UX / SEO / Security** — AI Assistant (this session)
- **Product Owner / Decision Maker** — User
- **Content Authors** — Admin users (post-launch)

## Phase Roadmap (Approval-Gated)

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Discovery & Questions | ✅ Complete |
| 1 | Complete Audit & Requirements | 🔄 In Progress |
| 2 | Architecture & Data Model | ⏳ Pending |
| 3 | Design System & Wireframes | ⏳ Pending |
| 4 | Project Foundation | ⏳ Pending |
| 5 | Auth & Admin Security | ⏳ Pending |
| 6 | Content & Media Management | ⏳ Pending |
| 7 | Public Website | ⏳ Pending |
| 8 | Booking Management | ⏳ Pending |
| 9 | Additional CMS Modules | ⏳ Pending |
| 10 | SEO & Migration | ⏳ Pending |
| 11 | Testing & Hardening | ⏳ Pending |
| 12 | Staging & Production Readiness | ⏳ Pending |

## Key Business Context
- **Company**: Butts Productions Inc. — family-owned, founded by Jared Butts, 15+ years operating
- **Mission**: "Building Up The Legacy for my Three Sons" — Christian community center offering diverse services
- **Headquarters**: 848 Granby St. Suite 203, Norfolk, VA 23510
- **Contact**: 1-866-454-7033 (24/7), 757-900-9914 (Local), Buttsproductions@gmail.com

## Active Business Divisions (11 — All Priority)
1. **Keeping it Kleen Janitorial Services** — Commercial/residential cleaning (15+ years)
2. **Kleen Prints Ink** — Custom printing: shirts, masks, mugs, hats, candles, plates, decals, flyers, web design
3. **Butts Consulting** — Business coaching, brand strategy, creative direction, marketing, project management
4. **757 Dispatching** — Freight dispatch for owner-operators/small fleets (10% of gross per load)
5. **Sweet Tender Loving Care** — Faith-based stationery: journals, devotionals, greeting cards, tote bags
6. **Butts Car Rentals** — Turo-partnered fleet: 4 vehicles (Rosie, Princess, Scarlet, Pepper), $70/day
7. **The Giving BackPack Foundation** — Community nonprofit: "Make the Change" campaigns, laundry days for homeless
8. **Kleen Team Entertainment** — DJ PHARFETCHED + tent rentals for weddings/events
9. **Why Not Buy It Shop** — External domain (whynotbuyitshop.com) — migrate to main site
10. **Keeping It Real Psych** — Coming soon (mental health/services)
11. **Refurbished Goods** — Coming soon (Richard Johnson, CEO)

## External Domains to Migrate
- `keepingitkleenservices.com` → `/businesses/keeping-it-kleen` (or similar)
- `givingbackpack.com` → `/businesses/giving-backpack-foundation`
- `whynotbuyitshop.com` → `/businesses/why-not-buy-it-shop`

## Current Pricing (Accurate — Preserve)
| Service | Duration | Price |
|---------|----------|-------|
| Car Rental | 1 day | $70 |
| Consulting | 2 hr | $145 |
| Kleen Prints Virtual Consultation | 1 hr | $50 |
| Kleen Team Entertainment | 2 hr | $300 |
| Keeping it Kleen Janitorial | 1 hr | $100 |
| Dispatching | Per load | 10% of gross |

## Booking Forms (Preserve Fields, Modernize UX)
1. **Car Rental Quote** — 25+ fields including license/insurance uploads, vehicle selection, mileage options, terms acceptance
2. **Dispatch Sign-up** — MC/DOT, truck type, load details, payment method, rate confirmation
3. **Coaching Services** — Session tier selection, scheduling, terms acceptance, signature
4. **Kleen Prints Design** — Product selection, customization, artwork upload, shipping
5. **Kleen Team Entertainment** — Simple contact form (name, email, message)
6. **Get Hired** — Employment application with SSN, background, availability

## Booking Lifecycle Statuses
`New` → `Pending Review` → `Contacted` → `Confirmed` → `In Progress` → `Completed` / `Cancelled` / `Rejected`

## Admin Requirements
- Single super-admin (secure one-time setup page)
- Session timeout: 24h default, 30d with remember-me
- Full CRUD: Businesses, Services, Pages, Navigation, Media, Bookings, Events, FAQs, Testimonials, Settings
- Audit logging for all admin actions

## Migration Strategy
- **Phased rollout**: Core pages first (Home, About, Businesses, Services, Booking, Contact)
- **URL preservation**: All existing Wix URLs maintained exactly; 301 redirects for any changes
- **DNS cutover**: After staging approval on Vercel preview + custom staging subdomain
- **Content**: Fresh copy (admin-managed), not direct Wix migration
- **Images**: Extract from Wix CDN → upload to Cloudinary → reference in MongoDB

## Success Criteria
- ✅ Lighthouse Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90
- ✅ WCAG 2.2 AA compliance
- ✅ All booking forms functional with server-side validation
- ✅ Admin CMS manages 100% of dynamic content (no code deploys for content changes)
- ✅ Zero critical security findings
- ✅ GA4 + Sentry operational
- ✅ Automated test coverage ≥ 80% for business logic