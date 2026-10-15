# Butts Productions — Design System

**Version**: 1.0  
**Phase**: 3 Deliverable  
**Status**: For Approval

---

## Design Principles

1. **Professional & Trustworthy** — Clean, corporate aesthetic that conveys reliability
2. **Modern & Elegant** — Refined typography, generous spacing, subtle depth
3. **Accessible First** — WCAG 2.2 AA compliance, readable at all sizes
4. **Performance-Conscious** — Minimal CSS, efficient layouts, no unnecessary animation
5. **Mobile-First** — Responsive by default, touch-friendly targets
6. **Brand-Consistent** — Single design language across all 11 business divisions

---

## 1. Brand Palette

### Primary Colors (Derived from current blue/white theme)
```json
{
  "color": {
    "primary": {
      "50":  "#eff6ff",
      "100": "#dbeafe",
      "200": "#bfdbfe",
      "300": "#93c5fd",
      "400": "#60a5fa",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "800": "#1e40af",
      "900": "#1e3a8a",
      "950": "#172554"
    }
  }
}
```

### Neutral Colors
```json
{
  "color": {
    "neutral": {
      "0":   "#ffffff",
      "50":  "#f9fafb",
      "100": "#f3f4f6",
      "200": "#e5e7eb",
      "300": "#d1d5db",
      "400": "#9ca3af",
      "500": "#6b7280",
      "600": "#4b5563",
      "700": "#374151",
      "800": "#1f2937",
      "900": "#111827",
      "950": "#030712"
    }
  }
}
```

### Semantic Colors
```json
{
  "color": {
    "success": { "50": "#f0fdf4", "500": "#22c55e", "600": "#16a34a", "700": "#15803d" },
    "warning": { "50": "#fffbeb", "500": "#f59e0b", "600": "#d97706", "700": "#b45309" },
    "error":   { "50": "#fef2f2", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c" },
    "info":    { "50": "#eff6ff", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8" }
  }
}
```

### Color Usage
| Token | Usage | Example |
|-------|-------|---------|
| `primary-600` | Primary buttons, links, accents | CTAs, nav hover |
| `primary-700` | Button hover, emphasis | Button :hover |
| `primary-50` | Light backgrounds, badges | Info banners |
| `neutral-900` | Primary text | Headings, body |
| `neutral-600` | Secondary text | Descriptions, metadata |
| `neutral-100` | Borders, dividers | Card borders, HR |
| `neutral-50` | Backgrounds | Page sections |
| `success-600` | Success states | Confirmed badges |
| `warning-600` | Warning states | Pending badges |
| `error-600` | Error states | Error messages, cancelled |

---

## 2. Typography System

### Font Families
```json
{
  "font": {
    "sans":  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "display": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "mono":  "'JetBrains Mono', 'Fira Code', Consolas, monospace"
  }
}
```

**Rationale**: Inter is a modern, highly-legible sans-serif with excellent rendering at all sizes. Self-hosted via `next/font/google` for performance.

### Type Scale
```json
{
  "fontSize": {
    "xs":    { "value": "0.75rem",  "lineHeight": "1rem",     "letterSpacing": "0em" },
    "sm":    { "value": "0.875rem", "lineHeight": "1.25rem",  "letterSpacing": "0em" },
    "base":  { "value": "1rem",    "lineHeight": "1.5rem",   "letterSpacing": "0em" },
    "lg":    { "value": "1.125rem", "lineHeight": "1.75rem",  "letterSpacing": "0em" },
    "xl":    { "value": "1.25rem", "lineHeight": "1.75rem",  "letterSpacing": "-0.01em" },
    "2xl":   { "value": "1.5rem",  "lineHeight": "2rem",     "letterSpacing": "-0.02em" },
    "3xl":   { "value": "1.875rem", "lineHeight": "2.25rem", "letterSpacing": "-0.02em" },
    "4xl":   { "value": "2.25rem", "lineHeight": "2.5rem",   "letterSpacing": "-0.02em" },
    "5xl":   { "value": "3rem",    "lineHeight": "1",       "letterSpacing": "-0.02em" },
    "6xl":   { "value": "3.75rem", "lineHeight": "1",       "letterSpacing": "-0.03em" }
  }
}
```

### Font Weights
```json
{
  "fontWeight": {
    "normal":    "400",
    "medium":    "500",
    "semibold":  "600",
    "bold":      "700",
    "extrabold": "800"
  }
}
```

### Type Styles (Semantic)
```css
/* Display */
.text-display-1 { font-size: 3.75rem; line-height: 1; font-weight: 800; letter-spacing: -0.03em; }
.text-display-2 { font-size: 3rem; line-height: 1; font-weight: 800; letter-spacing: -0.02em; }

/* Heading */
.text-h1 { font-size: 2.25rem; line-height: 2.5rem; font-weight: 700; letter-spacing: -0.02em; }
.text-h2 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; letter-spacing: -0.02em; }
.text-h3 { font-size: 1.5rem; line-height: 2rem; font-weight: 600; letter-spacing: -0.01em; }
.text-h4 { font-size: 1.25rem; line-height: 1.75rem; font-weight: 600; }
.text-h5 { font-size: 1.125rem; line-height: 1.75rem; font-weight: 600; }
.text-h6 { font-size: 1rem; line-height: 1.5rem; font-weight: 600; }

/* Body */
.text-body-lg { font-size: 1.125rem; line-height: 1.75rem; font-weight: 400; }
.text-body { font-size: 1rem; line-height: 1.5rem; font-weight: 400; }
.text-body-sm { font-size: 0.875rem; line-height: 1.25rem; font-weight: 400; }

/* Caption */
.text-caption { font-size: 0.875rem; line-height: 1.25rem; font-weight: 400; color: theme(colors.neutral.600); }
.text-caption-sm { font-size: 0.75rem; line-height: 1rem; font-weight: 400; color: theme(colors.neutral.500); }

/* Label */
.text-label { font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; }
.text-label-sm { font-size: 0.75rem; line-height: 1rem; font-weight: 500; }
```

---

## 3. Spacing & Layout

### Spacing Scale (8px base)
```json
{
  "spacing": {
    "0":  "0",
    "1":  "0.25rem",   /* 4px */
    "2":  "0.5rem",    /* 8px */
    "3":  "0.75rem",   /* 12px */
    "4":  "1rem",      /* 16px */
    "5":  "1.25rem",   /* 20px */
    "6":  "1.5rem",    /* 24px */
    "8":  "2rem",      /* 32px */
    "10": "2.5rem",    /* 40px */
    "12": "3rem",      /* 48px */
    "16": "4rem",      /* 64px */
    "20": "5rem",      /* 80px */
    "24": "6rem",      /* 96px */
    "32": "8rem",      /* 128px */
    "40": "10rem",     /* 160px */
    "48": "12rem",     /* 192px */
    "64": "16rem",     /* 256px */
    "80": "20rem",     /* 320px */
    "96": "24rem"      /* 384px */
  }
}
```

### Layout Containers
```json
{
  "container": {
    "sm":  { "maxWidth": "640px" },
    "md":  { "maxWidth": "768px" },
    "lg":  { "maxWidth": "1024px" },
    "xl":  { "maxWidth": "1280px" },
    "2xl": { "maxWidth": "1536px" },
    "full": { "maxWidth": "100%" }
  }
}
```

### Section Spacing
```css
/* Vertical rhythm */
.section { padding: theme(spacing.12) 0; }        /* 48px top/bottom */
.section-lg { padding: theme(spacing.16) 0; }     /* 64px top/bottom */
.section-sm { padding: theme(spacing.8) 0; }      /* 32px top/bottom */

/* Container padding */
.container-px { padding-left: theme(spacing.4); padding-right: theme(spacing.4); }
@media (min-width: 640px) {
  .container-px { padding-left: theme(spacing.6); padding-right: theme(spacing.6); }
}
@media (min-width: 1024px) {
  .container-px { padding-left: theme(spacing.8); padding-right: theme(spacing.8); }
}
```

### Grid System
```json
{
  "grid": {
    "cols-1":  { "gridTemplateColumns": "repeat(1, minmax(0, 1fr))" },
    "cols-2":  { "gridTemplateColumns": "repeat(2, minmax(0, 1fr))" },
    "cols-3":  { "gridTemplateColumns": "repeat(3, minmax(0, 1fr))" },
    "cols-4":  { "gridTemplateColumns": "repeat(4, minmax(0, 1fr))" },
    "cols-5":  { "gridTemplateColumns": "repeat(5, minmax(0, 1fr))" },
    "cols-6":  { "gridTemplateColumns": "repeat(6, minmax(0, 1fr))" },
    "gap-4":    { "gap": "1rem" },
    "gap-6":    { "gap": "1.5rem" },
    "gap-8":    { "gap": "2rem" }
  }
}
```

---

## 4. Responsive Breakpoints

```json
{
  "breakpoint": {
    "sm":  "640px",   /* Mobile landscape */
    "md":  "768px",   /* Tablet */
    "lg":  "1024px",  /* Laptop */
    "xl":  "1280px",  /* Desktop */
    "2xl": "1536px"   /* Large desktop */
  }
}
```

### Breakpoint Usage
| Breakpoint | Layout Changes |
|------------|----------------|
| `< sm` (default) | Single column, stacked, full-width |
| `sm` | 2-col grids, side-by-side forms |
| `md` | 3-col grids, expanded nav |
| `lg` | 4-col grids, mega-menu, sidebar layouts |
| `xl` | Max container width, generous spacing |
| `2xl` | Ultra-wide, optional |

### Responsive Typography
```css
.text-h1 { font-size: 1.875rem; line-height: 2.25rem; }  /* Mobile */
@media (min-width: 768px) {
  .text-h1 { font-size: 2.25rem; line-height: 2.5rem; }  /* Tablet+ */
}
@media (min-width: 1024px) {
  .text-h1 { font-size: 3rem; line-height: 1; }           /* Desktop+ */
}
```

---

## 5. Border Radius

```json
{
  "borderRadius": {
    "none": "0",
    "sm":   "0.125rem",  /* 2px */
    "md":   "0.25rem",   /* 4px */
    "lg":   "0.5rem",    /* 8px */
    "xl":   "0.75rem",   /* 12px */
    "2xl":  "1rem",      /* 16px */
    "3xl":  "1.5rem",    /* 24px */
    "full": "9999px"
  }
}
```

### Usage
| Token | Usage |
|-------|-------|
| `rounded-lg` | Cards, inputs, modals |
| `rounded-xl` | Large cards, hero overlays |
| `rounded-full` | Avatars, badges, pills |
| `rounded-md` | Small buttons, tags |

---

## 6. Shadows & Depth

```json
{
  "boxShadow": {
    "sm":  "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md":  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg":  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "xl":  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    "none": "none"
  }
}
```

### Usage
| Token | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation (tags, badges) |
| `shadow-md` | Cards, dropdowns |
| `shadow-lg` | Modals, popovers, hero overlays |
| `shadow-xl` | Floating elements, admin sidebar |

---

## 7. Component Specifications

### 7.1 Button

```typescript
// Variants
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string; // Renders as Link if provided
}
```

**Visual Specs**:
```
┌─────────────────────────────────────────┐
│  PRIMARY (default)                       │
│  bg: primary-600, text: white            │
│  hover: primary-700                      │
│  active: primary-800                     │
│  disabled: primary-300, cursor: not-allowed│
├─────────────────────────────────────────┤
│  SECONDARY                               │
│  bg: neutral-100, text: neutral-900      │
│  hover: neutral-200                      │
│  active: neutral-300                     │
├─────────────────────────────────────────┤
│  OUTLINE                                 │
│  bg: transparent, border: neutral-300    │
│  text: neutral-700                       │
│  hover: bg-neutral-50, border-neutral-400│
├─────────────────────────────────────────┤
│  GHOST                                   │
│  bg: transparent, text: neutral-700      │
│  hover: bg-neutral-100                   │
├─────────────────────────────────────────┤
│  DANGER                                  │
│  bg: error-600, text: white              │
│  hover: error-700                        │
└─────────────────────────────────────────┘

Sizes:
sm: h-8 px-3 text-sm rounded-md gap-1.5
md: h-10 px-4 text-sm rounded-lg gap-2
lg: h-12 px-6 text-base rounded-lg gap-2.5

Loading: spinner + disabled state
```

### 7.2 Input / Form Fields

```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'time' | 'url' | 'file';
  value?: string;
  onChange?: (value: string) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  autoComplete?: string;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}
```

**Visual Specs**:
```
┌─────────────────────────────────────────┐
│  Label (text-label, neutral-700)        │
│  ┌───────────────────────────────────┐  │
│  │ Input text...                     │  │  ← bg-white, border-neutral-300
│  └───────────────────────────────────┘  │     rounded-lg, h-10, px-3
│  Hint text (text-caption-sm, neutral-500)│
│                                         │
│  ERROR STATE:                           │
│  ┌───────────────────────────────────┐  │
│  │ Invalid input...                  │  │  ← border-error-500
│  └───────────────────────────────────┘  │
│  Error message (text-sm, error-600)     │
│                                         │
│  DISABLED:                              │
│  bg: neutral-100, text: neutral-400     │
│  cursor: not-allowed                    │
└─────────────────────────────────────────┘

Focus: ring-2 ring-primary-500 ring-offset-1
```

### 7.3 Card

```typescript
interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  bordered?: boolean;
  rounded?: 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}
```

**Visual Specs**:
```
┌─────────────────────────────────────────┐
│  Card (bg-white, rounded-lg, shadow-md) │
│  ┌───────────────────────────────────┐  │
│  │ padding: md (24px)                │  │
│  │                                   │  │
│  │  Content...                       │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Hover (if interactive):                │
│  shadow-lg, translateY(-1px)           │
│  transition: all 150ms ease             │
└─────────────────────────────────────────┘

Variants:
- elevated: shadow-md
- bordered: border border-neutral-200, no shadow
- flat: no shadow, no border
```

### 7.4 Modal / Dialog

```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}
```

**Visual Specs**:
```
┌─────────────────────────────────────────┐
│  Overlay: bg-neutral-900/50 backdrop-blur-sm │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Modal (bg-white, rounded-xl)     │  │
│  │  max-w: md (448px) / lg (512px)   │  │
│  │  shadow-2xl                       │  │
│  │  p-6                               │  │
│  │                                   │  │
│  │  Title (text-h3)            [×]   │  │  ← Close button
│  │  Description (text-body-sm)       │  │
│  │                                   │  │
│  │  Content...                       │  │
│  │                                   │  │
│  │  Footer (buttons right-aligned)   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

Animation: fade-in 150ms, scale-in 150ms
Focus trap: Tab cycles within modal
Escape: closes modal
```

### 7.5 Badge / Tag

```typescript
interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

**Visual Specs**:
```
default:  bg-neutral-100, text-neutral-700
primary:  bg-primary-50, text-primary-700
success:  bg-success-50, text-success-700
warning:  bg-warning-50, text-warning-700
error:    bg-error-50, text-error-700
info:     bg-info-50, text-info-700

sm: px-2 py-0.5 text-xs rounded-full
md: px-2.5 py-1 text-sm rounded-full
```

### 7.6 Navigation

```typescript
interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  children?: NavItem[];
}
```

**Desktop Nav**:
```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  Home  About  Services ▼  Quote ▼  Contact    │
│                        ├─ Keeping it Kleen               │
│                        ├─ Kleen Prints Ink               │
│                        ├─ Butts Consulting               │
│                        ├─ Dispatching                    │
│                        └─ ...                            │
└─────────────────────────────────────────────────────────┘

Active: text-primary-600 font-semibold
Hover: text-primary-600
Dropdown: bg-white rounded-lg shadow-lg border neutral-200
Mega-menu: 3-col grid, w-96
```

**Mobile Nav**:
```
┌─────────────────────────────────┐
│  [Logo]                   [☰]  │
└─────────────────────────────────┘
          │
          ▼ (hamburger tap)
┌─────────────────────────────────┐
│  [Logo]                   [×]  │
│  ─────────────────────────────  │
│  Home                           │
│  About                          │
│  Services ▼                     │
│    Keeping it Kleen             │
│    Kleen Prints Ink             │
│    Butts Consulting             │
│  Quote ▼                        │
│    Car Quote                    │
│    Dispatch Sign up             │
│  Contact                        │
└─────────────────────────────────┘

Animation: slide-in from right, 200ms ease
```

### 7.7 Footer

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]                                                 │
│  Family-owned business providing diverse services...   │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Contact      │  │ Quick Links  │  │ Newsletter   │ │
│  │ 📧 email     │  │ About        │  │              │ │
│  │ 📞 phone     │  │ Services     │  │ [email    ]  │ │
│  │ 📍 address   │  │ Careers      │  │ [Subscribe]  │ │
│  └──────────────┘  │ FAQ          │  │              │ │
│                     │ Contact      │  │ Social:      │ │
│                     └──────────────┘  │ [FB][IG][Turo]│ │
│                                       └──────────────┘ │
│  ─────────────────────────────────────────────────────  │
│  © 2026 Butts Productions Inc.  |  Privacy | Terms     │
└─────────────────────────────────────────────────────────┘

bg: neutral-900, text: neutral-300
Links: hover:text-white
Newsletter input: bg-neutral-800, border-neutral-700
```

### 7.8 Hero Section

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Background Image / Video with overlay]                │
│                                                         │
│         Building Up The Legacy                          │
│         For My Three Sons.                              │
│                                                         │
│         Family-owned business providing                │
│         diverse services to the community.              │
│                                                         │
│         [Explore Services]  [Get a Quote]               │
│                                                         │
└─────────────────────────────────────────────────────────┘

bg: cover, center, min-h-[70vh]
Overlay: gradient from neutral-900/70 to neutral-900/30
Text: white, text-center
```

### 7.9 Service/Business Card

```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   [Image 16:9]            │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  Service Name                   │
│  Short description text...      │
│                                 │
│  $145  ·  2 hr  ·  On-site     │
│                                 │
│  [Book Now →]                   │
│                                 │
└─────────────────────────────────┘

bg: white, rounded-lg, shadow-md
Image: rounded-t-lg, aspect-video, object-cover
Hover: shadow-lg, translateY(-2px), transition 200ms
Price: text-h4, font-bold, primary-600
Meta: text-caption, neutral-500
```

---

## 8. Animations & Transitions

### Timing
```json
{
  "transition": {
    "duration": {
      "fast":   "100ms",
      "normal": "200ms",
      "slow":   "300ms"
    },
    "easing": {
      "in":     "cubic-bezier(0.4, 0, 1, 1)",
      "out":    "cubic-bezier(0, 0, 0.2, 1)",
      "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    }
  }
}
```

### Allowed Animations
| Animation | Duration | Usage |
|-----------|----------|-------|
| Fade in | 200ms | Page load, modal open |
| Slide up | 200ms | Cards, dropdowns |
| Scale in | 150ms | Modals, popovers |
| Hover lift | 200ms | Cards, buttons |
| Spin | 1s | Loading spinner |

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Z-Index Scale

```json
{
  "zIndex": {
    "base":     "0",
    "dropdown":  "10",
    "sticky":    "20",
    "overlay":   "30",
    "modal":     "40",
    "toast":     "50",
    "tooltip":   "60"
  }
}
```

---

## 10. Accessibility Requirements

### Focus States
```css
*:focus-visible {
  outline: 2px solid theme(colors.primary.600);
  outline-offset: 2px;
  border-radius: theme(borderRadius.sm);
}
```

### Color Contrast
- Body text on white: `neutral-900` on `neutral-0` → **17.4:1** ✓ AAA
- Secondary text: `neutral-600` on `neutral-0` → **7.5:1** ✓ AAA
- Primary buttons: `white` on `primary-600` → **4.8:1** ✓ AA
- Links: `primary-600` on `neutral-0` → **4.8:1** ✓ AA

### Touch Targets
- Minimum touch target: **44x44px** (WCAG 2.5.5)
- Button heights: `sm=32px`, `md=40px`, `lg=48px`
- Spacing between interactive elements: **8px minimum**

### ARIA Requirements
- All images: `alt` text (decorative: `alt=""`)
- Forms: `label` associated with `input` via `htmlFor`/`id`
- Errors: `aria-live="polite"` on error containers
- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Navigation: `aria-current="page"` on active item
- Dropdowns: `aria-expanded`, `aria-haspopup`

---

## 11. Admin Dashboard Design

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  Butts Productions Admin          [User ▼] [Logout] │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  Dashboard │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  ────────  │  │ Total   │ │ New     │ │ Pending │         │
│  Businesses│  │ Bookings│ │ Today   │ │ Review  │         │
│  Services  │  │  142    │ │   8     │ │   12    │         │
│  Bookings  │  └─────────┘ └─────────┘ └─────────┘         │
│  Pages     │                                                │
│  Media     │  ┌───────────────────────────────────────┐    │
│  Events    │  │  Recent Bookings                      │    │
│  FAQs      │  │  ┌─────┬──────┬──────┬──────┬─────┐  │    │
│  Settings  │  │  │ ID  │ Name │ Type │ Date │ Sts │  │    │
│            │  │  ├─────┼──────┼──────┼──────┼─────┤  │    │
│            │  │  │ ... │ ...  │ ...  │ ...  │ ... │  │    │
│            │  │  └─────┴──────┴──────┴──────┴─────┘  │    │
│            │  └───────────────────────────────────────┘    │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘

Sidebar: w-64, bg-neutral-900, text-neutral-300
Content: flex-1, bg-neutral-50, p-8
Cards: bg-white, rounded-lg, shadow-sm, border neutral-200
Tables: bg-white, rounded-lg, shadow-sm
```

### Admin Form Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Edit Business: Keeping it Kleen                            │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Basic Info                                           │ │
│  │                                                       │ │
│  │  Name *                                               │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │ Keeping it Kleen                                │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  Short Description                                    │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │ Commercial and residential cleaning...           │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  Description                                          │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │ Rich text editor...                             │ │ │
│  │  │                                                 │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Media                                                │ │
│  │                                                       │ │
│  │  Logo                                    [Upload]     │ │
│  │  ┌──────────┐                                         │ │
│  │  │ [Logo]   │  120 x 80 px                            │ │
│  │  └──────────┘                                         │ │
│  │                                                       │ │
│  │  Cover Image                              [Upload]    │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │ [Cover Image]                                   │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  SEO                                                  │ │
│  │  Meta Title, Meta Description, OG Image...            │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Publishing                                           │ │
│  │  [✓] Published    Display Order: [0]    [Featured]   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [Cancel]                              [Save Draft] [Publish]│
└─────────────────────────────────────────────────────────────┘

Max width: 1200px
Sections: cards with white bg, rounded-lg, shadow-sm
Sticky header: bg-white, border-b, shadow-sm
Action bar: sticky bottom, bg-white, border-t
```

---

## 12. Tailwind Config Integration

```typescript
// tailwind.config.ts (conceptual - v4 uses CSS)
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { /* palette */ },
        neutral: { /* palette */ },
        success: { /* palette */ },
        warning: { /* palette */ },
        error: { /* palette */ },
        info: { /* palette */ },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        /* type scale */
      },
      spacing: {
        /* spacing scale */
      },
      borderRadius: {
        /* radius scale */
      },
      boxShadow: {
        /* shadow scale */
      },
      transitionDuration: {
        fast: '100ms',
        normal: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        base: '0',
        dropdown: '10',
        sticky: '20',
        overlay: '30',
        modal: '40',
        toast: '50',
        tooltip: '60',
      },
      container: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 13. Design Token JSON

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "primary": {
      "50":  { "value": "#eff6ff" },
      "100": { "value": "#dbeafe" },
      "200": { "value": "#bfdbfe" },
      "300": { "value": "#93c5fd" },
      "400": { "value": "#60a5fa" },
      "500": { "value": "#3b82f6" },
      "600": { "value": "#2563eb" },
      "700": { "value": "#1d4ed8" },
      "800": { "value": "#1e40af" },
      "900": { "value": "#1e3a8a" },
      "950": { "value": "#172554" }
    },
    "neutral": {
      "0":   { "value": "#ffffff" },
      "50":  { "value": "#f9fafb" },
      "100": { "value": "#f3f4f6" },
      "200": { "value": "#e5e7eb" },
      "300": { "value": "#d1d5db" },
      "400": { "value": "#9ca3af" },
      "500": { "value": "#6b7280" },
      "600": { "value": "#4b5563" },
      "700": { "value": "#374151" },
      "800": { "value": "#1f2937" },
      "900": { "value": "#111827" },
      "950": { "value": "#030712" }
    },
    "success": {
      "50":  { "value": "#f0fdf4" },
      "500": { "value": "#22c55e" },
      "600": { "value": "#16a34a" },
      "700": { "value": "#15803d" }
    },
    "warning": {
      "50":  { "value": "#fffbeb" },
      "500": { "value": "#f59e0b" },
      "600": { "value": "#d97706" },
      "700": { "value": "#b45309" }
    },
    "error": {
      "50":  { "value": "#fef2f2" },
      "500": { "value": "#ef4444" },
      "600": { "value": "#dc2626" },
      "700": { "value": "#b91c1c" }
    },
    "info": {
      "50":  { "value": "#eff6ff" },
      "500": { "value": "#3b82f6" },
      "600": { "value": "#2563eb" },
      "700": { "value": "#1d4ed8" }
    }
  },
  "font": {
    "family": {
      "sans":  { "value": "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" },
      "display": { "value": "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" },
      "mono":  { "value": "JetBrains Mono, Fira Code, Consolas, monospace" }
    },
    "size": {
      "xs":    { "value": "0.75rem" },
      "sm":    { "value": "0.875rem" },
      "base":  { "value": "1rem" },
      "lg":    { "value": "1.125rem" },
      "xl":    { "value": "1.25rem" },
      "2xl":   { "value": "1.5rem" },
      "3xl":   { "value": "1.875rem" },
      "4xl":   { "value": "2.25rem" },
      "5xl":   { "value": "3rem" },
      "6xl":   { "value": "3.75rem" }
    },
    "weight": {
      "normal":    { "value": "400" },
      "medium":    { "value": "500" },
      "semibold":  { "value": "600" },
      "bold":      { "value": "700" },
      "extrabold": { "value": "800" }
    },
    "lineHeight": {
      "none":   { "value": "1" },
      "tight":   { "value": "1.25" },
      "snug":   { "value": "1.375" },
      "normal":  { "value": "1.5" },
      "relaxed": { "value": "1.625" },
      "loose":   { "value": "2" }
    },
    "letterSpacing": {
      "tightest": { "value": "-0.03em" },
      "tighter":  { "value": "-0.02em" },
      "tight":    { "value": "-0.01em" },
      "normal":   { "value": "0em" },
      "wide":     { "value": "0.01em" },
      "wider":    { "value": "0.02em" },
      "widest":   { "value": "0.03em" }
    }
  },
  "spacing": {
    "0":  { "value": "0" },
    "1":  { "value": "0.25rem" },
    "2":  { "value": "0.5rem" },
    "3":  { "value": "0.75rem" },
    "4":  { "value": "1rem" },
    "5":  { "value": "1.25rem" },
    "6":  { "value": "1.5rem" },
    "8":  { "value": "2rem" },
    "10": { "value": "2.5rem" },
    "12": { "value": "3rem" },
    "16": { "value": "4rem" },
    "20": { "value": "5rem" },
    "24": { "value": "6rem" },
    "32": { "value": "8rem" },
    "40": { "value": "10rem" },
    "48": { "value": "12rem" },
    "64": { "value": "16rem" },
    "80": { "value": "20rem" },
    "96": { "value": "24rem" }
  },
  "borderRadius": {
    "none": { "value": "0" },
    "sm":   { "value": "0.125rem" },
    "md":   { "value": "0.25rem" },
    "lg":   { "value": "0.5rem" },
    "xl":   { "value": "0.75rem" },
    "2xl":  { "value": "1rem" },
    "3xl":  { "value": "1.5rem" },
    "full": { "value": "9999px" }
  },
  "boxShadow": {
    "sm":  { "value": "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
    "md":  { "value": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" },
    "lg":  { "value": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" },
    "xl":  { "value": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" },
    "2xl": { "value": "0 25px 50px -12px rgb(0 0 0 / 0.25)" },
    "inner": { "value": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)" },
    "none": { "value": "none" }
  },
  "transitionDuration": {
    "fast":   { "value": "100ms" },
    "normal": { "value": "200ms" },
    "slow":   { "value": "300ms" }
  },
  "transitionTimingFunction": {
    "in":     { "value": "cubic-bezier(0.4, 0, 1, 1)" },
    "out":    { "value": "cubic-bezier(0, 0, 0.2, 1)" },
    "in-out": { "value": "cubic-bezier(0.4, 0, 0.2, 1)" }
  },
  "zIndex": {
    "base":     { "value": "0" },
    "dropdown":  { "value": "10" },
    "sticky":    { "value": "20" },
    "overlay":   { "value": "30" },
    "modal":     { "value": "40" },
    "toast":     { "value": "50" },
    "tooltip":   { "value": "60" }
  },
  "container": {
    "sm":  { "value": "640px" },
    "md":  { "value": "768px" },
    "lg":  { "value": "1024px" },
    "xl":  { "value": "1280px" },
    "2xl": { "value": "1536px" }
  },
  "breakpoint": {
    "sm":  { "value": "640px" },
    "md":  { "value": "768px" },
    "lg":  { "value": "1024px" },
    "xl":  { "value": "1280px" },
    "2xl": { "value": "1536px" }
  }
}
```

---

## Approval

**Phase 3 Design System Deliverable** — Reply "Approved" to proceed to Phase 4 (Project Foundation), or request revisions.