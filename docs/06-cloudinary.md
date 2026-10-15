# Butts Productions — Cloudinary Media Management

**Version**: 1.0  
**Phase**: 2 Deliverable  
**Status**: For Approval

---

## Folder Structure

```
buttsproductions/                    ← Root folder (CLOUDINARY_FOLDER_PREFIX)
├── admin/                           ← Admin uploads (CMS-managed)
│   ├── businesses/                  ← Business logos, covers, galleries
│   │   ├── {business-slug}/
│   │   │   ├── logo.{ext}
│   │   │   ├── cover.{ext}
│   │   │   └── gallery/
│   │   │       ├── {timestamp}-{uuid}.{ext}
│   │   │       └── ...
│   ├── services/                    ← Service images, galleries
│   │   ├── {service-slug}/
│   │   │   ├── hero.{ext}
│   │   │   └── gallery/
│   ├── pages/                       ← Page block images (Hero, Gallery, etc.)
│   │   ├── home/
│   │   │   ├── hero.{ext}
│   │   │   └── blocks/
│   │   └── {page-slug}/
│   ├── events/                      ← Event images
│   │   ├── {event-slug}/
│   │   │   ├── hero.{ext}
│   │   │   └── gallery/
│   ├── team/                        ← Team member photos
│   │   ├── {member-slug}.{ext}
│   ├── testimonials/                ← Testimonial author photos
│   │   ├── {testimonial-id}.{ext}
│   ├── faqs/                        ← FAQ-related images (rare)
│   ├── legal/                       ← Legal page images (rare)
│   ├── statistics/                  ← Statistic icons
│   │   ├── {statistic-id}.{ext}
│   └── temp/                        ← Temporary uploads (cleanup job)
│
├── public/                          ← Public-facing optimized delivery
│   ├── businesses/                  ← Auto-generated from admin/businesses
│   ├── services/                    ← Auto-generated from admin/services
│   ├── pages/                       ← Auto-generated from admin/pages
│   ├── events/                      ← Auto-generated from admin/events
│   ├── team/                        ← Auto-generated from admin/team
│   └── testimonials/                ← Auto-generated from admin/testimonials
│
├── forms/                           ← Form file uploads (user submissions)
│   ├── car-rental/                  ← License, insurance uploads
│   │   ├── {booking-id}/
│   │   │   ├── license.{ext}
│   │   │   └── insurance.{ext}
│   ├── dispatch/                    ← Dispatch documents
│   ├── coaching/                    ← Coaching signatures
│   ├── custom-print/                ← Artwork uploads
│   ├── careers/                     ← Resumes
│   │   ├── {application-id}/
│   │   │   └── resume.{ext}
│   └── temp/                        ← Temporary (cleanup after booking creation)
│
└── system/                          ← System-generated
    ├── og-images/                   ← Auto-generated Open Graph images
    ├── placeholders/                ← Placeholder images (blur, loading)
    └── icons/                       ← SVG icons, favicons
```

---

## Upload Presets

### 1. Admin Direct Upload (Unsigned)
**Preset Name**: `buttsproductions_admin`  
**Use Case**: Admin dashboard media library uploads (browser → Cloudinary)

```json
{
  "name": "buttsproductions_admin",
  "unsigned": true,
  "folder": "buttsproductions/admin/temp",
  "allowed_formats": ["jpg", "jpeg", "png", "webp", "avif", "pdf"],
  "max_file_size": 20971520,
  "resource_type": "auto",
  "eager": [
    { "width": 1920, "crop": "limit", "quality": "auto", "fetch_format": "auto" },
    { "width": 1280, "crop": "limit", "quality": "auto", "fetch_format": "auto" },
    { "width": 800, "crop": "limit", "quality": "auto", "fetch_format": "auto" },
    { "width": 400, "crop": "limit", "quality": "auto", "fetch_format": "auto" }
  ],
  "eager_async": true,
  "eager_notification_url": "https://buttsproductions.com/api/webhooks/cloudinary",
  "tags": ["admin-upload"],
  "context": "alt=|caption=|uploaded_by=",
  "faces": false,
  "phash": true,
  "backup": true
}
```

### 2. Form Uploads (Signed - Server Controlled)
**Use Case**: Public form submissions (car rental license, insurance, resumes, artwork)

```typescript
// Server generates signed upload params per request
// Folder: buttsproductions/forms/{form-type}/{booking-id}/
// Allowed formats per form type
```

---

## Transformation Presets (Named Transformations)

Create in Cloudinary Dashboard → Transformations → Named:

| Name | Transformation | Use Case |
|------|----------------|----------|
| `hero` | `c_fill,w_1920,h_1080,g_auto,q_auto,f_auto` | Hero backgrounds |
| `hero-mobile` | `c_fill,w_800,h_600,g_auto,q_auto,f_auto` | Mobile hero |
| `card` | `c_fill,w_600,h_400,g_auto,q_auto,f_auto` | Service/Business cards |
| `card-sm` | `c_fill,w_300,h_200,g_auto,q_auto,f_auto` | Small cards |
| `thumbnail` | `c_fill,w_150,h_150,g_auto,q_auto,f_auto` | Thumbnails |
| `gallery` | `c_limit,w_1600,h_1200,q_auto,f_auto` | Gallery images |
| `avatar` | `c_fill,w_200,h_200,g_face,q_auto,f_auto` | Team photos |
| `logo` | `c_limit,w_300,h_150,q_auto,f_auto` | Business logos |
| `og-image` | `c_fill,w_1200,h_630,g_auto,q_auto,f_auto` | Open Graph |
| `icon` | `c_fill,w_64,h_64,q_auto,f_auto` | Icons, favicons |
| `document` | `c_limit,w_1200,q_auto,f_pdf` | PDF documents |
| `blur-placeholder` | `c_scale,w_20,q_auto,f_auto` | LQIP blur placeholder |

---

## Delivery URLs (Next.js Image Loader)

```typescript
// src/lib/cloudinary/loader.ts
import { ImageLoaderProps } from 'next/image';

const CLOUDINARY_BASE = `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload`;

export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  // src format: "buttsproductions/admin/businesses/acme/logo.jpg"
  // or just publicId: "buttsproductions/admin/businesses/acme/logo"
  
  const params = [
    'f_auto',
    'q_auto',
    width ? `w_${width}` : null,
    quality ? `q_${quality}` : null,
  ].filter(Boolean).join(',');

  return `${CLOUDINARY_BASE}/${params}/${src}`;
}
```

**Usage in Components**:
```tsx
import Image from 'next/image';

<Image
  src="buttsproductions/admin/businesses/keeping-it-kleen/hero.jpg"
  alt="Keeping it Kleen"
  width={800}
  height={600}
  loader={cloudinaryLoader}
  placeholder="blur"
  blurDataURL={getBlurDataUrl('buttsproductions/admin/businesses/keeping-it-kleen/hero.jpg')}
/>
```

---

## Media Asset Model Integration

```typescript
// When admin uploads via dashboard:
// 1. Browser uploads to Cloudinary (unsigned preset) → returns public_id
// 2. Frontend calls confirmMediaUpload action with public_id + metadata
// 3. Server fetches asset details from Cloudinary Admin API
// 4. Creates MediaAsset document with usage tracking

interface CloudinaryAssetDetails {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  folder: string;
  created_at: string;
  tags: string[];
  context: { alt?: string; caption?: string };
  eager: Array<{ secure_url: string; transformation: string }>;
}
```

---

## Migration from Wix (Static.wixstatic.com)

### Extraction Script
```typescript
// scripts/migrate-wix-images.ts
// 1. Parse all HTML from audit for image URLs
// 2. Download each unique URL
// 3. Determine target folder based on page context
// 4. Upload to Cloudinary with signed upload
// 5. Create MediaAsset records
// 6. Generate mapping: wixUrl → cloudinaryPublicId
// 7. Update all content references in DB
```

### Folder Mapping
| Wix Context | Cloudinary Folder |
|-------------|-------------------|
| Homepage hero/sections | `admin/pages/home/hero`, `admin/pages/home/blocks/` |
| Business pages | `admin/businesses/{slug}/` |
| Service pages | `admin/services/{slug}/` |
| Team photos | `admin/team/` |
| Event images | `admin/events/{slug}/` |
| Form uploads (future) | `forms/{type}/{id}/` |

---

## Cleanup & Maintenance

### Automated Jobs (Vercel Cron / External)
```typescript
// lib/jobs/media-cleanup.ts

// 1. Daily: Clean temp folders older than 24h
async function cleanTempFolders() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await cloudinary.api.delete_resources_by_prefix('buttsproductions/admin/temp/', {
    max_results: 500,
    // Filter by created_at < cutoff
  });
  await cloudinary.api.delete_resources_by_prefix('buttsproductions/forms/temp/', {
    max_results: 500,
  });
}

// 2. Weekly: Find orphaned assets (usageCount === 0, older than 30 days)
async function findOrphanedAssets() {
  const orphans = await MediaAsset.find({
    usageCount: 0,
    createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  }).limit(100);
  
  // Report for manual review (don't auto-delete)
  await notifyAdmin('Orphaned media assets found', orphans);
}

// 3. Monthly: Optimize storage - regenerate eager transformations for new presets
async function regenerateTransformations() {
  // For new named transformations
}
```

---

## Usage Tracking

```typescript
// Increment when asset is referenced
async function incrementUsage(publicId: string, ref: { type: string; id: Types.ObjectId; field: string }) {
  await MediaAsset.updateOne(
    { publicId },
    {
      $inc: { usageCount: 1 },
      $addToSet: { usageRefs: ref },
    }
  );
}

// Decrement when reference removed
async function decrementUsage(publicId: string, ref: { type: string; id: Types.ObjectId; field: string }) {
  const result = await MediaAsset.updateOne(
    { publicId },
    {
      $inc: { usageCount: -1 },
      $pull: { usageRefs: ref },
    }
  );
  // If usageCount === 0, schedule for review
}
```

---

## Security Rules

| Rule | Implementation |
|------|----------------|
| No secret in browser | `CLOUDINARY_API_SECRET` only on server |
| Unsigned preset limited | Folder-restricted, max 20MB, format allowlist |
| Form uploads signed | Server generates signature per upload |
| Delete protected | Check `usageCount > 0` before delete |
| Admin only uploads | Upload endpoints behind auth middleware |
| Audit all uploads | `AuditLog` on confirmMediaUpload |

---

## Cost Optimization

| Strategy | Implementation |
|----------|----------------|
| Auto format/quality | `f_auto,q_auto` on all deliveries |
| Responsive widths | Named transformations + `srcset` |
| LQIP blur placeholders | `blur-placeholder` transform (20px) |
| Cache headers | Cloudinary CDN: 1 year for transformed |
| Remove originals | Keep only transformed (Cloudinary default) |
| Monitor usage | Cloudinary Dashboard → Usage Reports |

---

## Approval

**Phase 2 Cloudinary Configuration Deliverable** — Reply "Approved" to proceed to Email templates, or request revisions.