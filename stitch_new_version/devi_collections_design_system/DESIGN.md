---
name: Devi Collections Design System
colors:
  surface: '#fcf8f8'
  surface-dim: '#ddd9d9'
  surface-bright: '#fcf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c8'
  surface-tint: '#5d5f5f'
  primary: '#5d5f5f'
  on-primary: '#ffffff'
  primary-container: '#ffffff'
  on-primary-container: '#747676'
  inverse-primary: '#c6c6c7'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#e1e3e4'
  on-secondary-container: '#626566'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffffff'
  on-tertiary-container: '#747676'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e1e3e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1d'
  on-secondary-fixed-variant: '#454748'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
  mono-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.02em
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for an elite, high-conversion e-commerce experience. It balances the editorial elegance of luxury fashion with the rigorous utility of enterprise inventory management. 

The aesthetic is **Ultra-Minimalist and Corporate**, prioritizing clarity, high-contrast legibility, and massive amounts of negative space. By removing all decorative flourishes like gradients or rounded corners, the system directs the user’s full attention to product photography and critical data. 

The emotional response should be one of **sophistication, efficiency, and absolute precision**. It mimics the "Luxe" segments of global fashion aggregators, where the interface acts as a silent, high-end gallery frame for the ethnic wear collections.

## Colors

The palette is strictly monochromatic with a single corporate accent to denote action and intent. 

- **Pure White (#FFFFFF):** The foundational surface color for all primary containers and backgrounds.
- **Ultra-Light Gray (#F8F9FA):** Used exclusively for structural differentiation, such as section alternates, table headers, and sidebar backgrounds.
- **Deep Charcoal Black (#111111):** Applied to all primary text and iconography to ensure maximum contrast and an editorial feel.
- **Muted Corporate Navy (#1A365D):** Reserved for primary calls-to-action (CTAs), active navigation states, and critical interaction points.
- **Border Neutral (#E2E8F0):** A razor-sharp 1px stroke used to define boundaries in the absence of heavy shadows.

## Typography

This design system utilizes **Inter** exclusively. The typographic hierarchy is driven by weight and case rather than complex font pairings. 

- **Headlines:** Use tight letter-spacing and heavy weights for a modern, bold look.
- **Body Text:** Ample line-height (1.6) is maintained to ensure readability during long browsing or data-entry sessions.
- **Labels:** Product metadata, size chips, and table headers use uppercase with slight tracking (letter-spacing) to evoke a premium retail aesthetic.
- **Enterprise Utility:** Smaller scales (label-sm) are used for technical specs and admin-side tooltips.

## Layout & Spacing

The system follows a strict **4px baseline grid**. 

- **E-commerce Grid:** A 12-column fluid grid for desktop with 24px gutters. Product listings should use generous padding (xl) between items to maintain the "Luxe" feel.
- **Admin Layout:** A fixed sidebar (280px) with a fluid content area. Data tables and forms use a more compact spacing (md) to maximize information density.
- **Breakpoints:** 
  - Mobile: < 768px (4 columns, 16px margins).
  - Tablet: 768px - 1280px (8 columns, 24px margins).
  - Desktop: > 1280px (12 columns, 64px margins).

## Elevation & Depth

This design system favors **flat, structural depth** over realistic shadows. 

1.  **Level 0 (Base):** Backgrounds in #FFFFFF or #F8F9FA.
2.  **Level 1 (Borders):** 1px #E2E8F0 strokes define cards, table cells, and input fields.
3.  **Level 2 (Subtle Shadow):** Used only for floating elements like dropdowns, tooltips, or "Add to Cart" sticky bars. 
    - `shadow-sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05).
    - `shadow-md`: 0 4px 6px -1px rgba(0, 0, 0, 0.07).
4.  **No Glassmorphism:** Surfaces are always 100% opaque. Depth is created through tonal shifts in gray rather than blurs.

## Shapes

To maintain a corporate, architectural feel, the system uses **Sharp (0px)** roundedness for all primary components. This includes buttons, input fields, images, and cards.

Secondary elements like "Low Stock" status badges or "New" tags may use a 1px radius only if required for legibility against busy images, but the default preference is a 90-degree corner.

## Components

### Retail UI
- **Primary Button:** Solid #1A365D background, White text, 0px radius. Transitions to black on hover.
- **Size Chips:** Square boxes with 1px #E2E8F0 borders. Active state uses a #111111 border with bold text. Out-of-stock sizes feature a diagonal 1px strike-through.
- **Status Badges:** Small, uppercase labels. "New Arrival" in #111111; "Low Stock" in a muted amber-tinted text (no background).
- **Color Swatches:** 24px x 24px squares with a 1px border. The active swatch is surrounded by a 2px offset ring.

### Admin UI
- **Data Tables:** #F8F9FA headers, #FFFFFF rows, 1px horizontal borders only. No vertical lines. High-density padding.
- **Form Inputs:** 1px #E2E8F0 border, #FFFFFF background. Focus state: 1px #1A365D border. Labels are always positioned above the input in `label-sm`.
- **Metric Cards:** Large `display-md` numbers. 1px border container. No shadow.
- **Sidebar Navigation:** #F8F9FA background. Active links use a 3px left-border in #1A365D and semi-bold text.