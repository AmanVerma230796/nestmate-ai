---
name: Warm Urban Trust
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#58413d'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#8c716c'
  outline-variant: '#e0bfba'
  surface-tint: '#ab3425'
  primary: '#a83223'
  on-primary: '#ffffff'
  primary-container: '#c94a38'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a8'
  secondary: '#366572'
  on-secondary: '#ffffff'
  secondary-container: '#b8e7f7'
  on-secondary-container: '#3b6977'
  tertiary: '#006b2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#00873a'
  on-tertiary-container: '#f7fff2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410100'
  on-primary-fixed-variant: '#8a1c10'
  secondary-fixed: '#bbeafa'
  secondary-fixed-dim: '#9fcedd'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#1b4d5a'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-numeric-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.02em
  label-numeric-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-badge:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system merges the emotional warmth of home-finding with the rigorous reassurance of a fintech verification engine. Built specifically for ambitious young professionals navigating shared urban housing in high-density Indian tech corridors, it balances welcoming hospitality with uncompromising boundary clarity.

### Personality & Values
- **Warm Authority:** Approaching co-living not merely as real estate inventory, but as mutual relational safety and lifestyle compatibility.
- **Fintech-Grade Rigor:** Compatibility metrics, rent splits, security deposit escrow, and house rule constitutions are rendered with tabular clarity and precision.
- **Urban Warmth:** Grounded in earthy, tactile undertones that contrast against the cold, sterile interfaces of traditional rental portals.

### Visual Style
A hybrid of **Warm Lifestyle Editorial** and **High-Trust Utility**. Surfaces are soft, paper-like off-whites layered with micro-borders rather than loud drop shadows. Contrast is deliberate: high-energy terracotta prompts action and social connection, while deep slate teal anchors background checks, verification seals, and legal boundaries.

## Colors

The palette establishes an immediate psychological split: emotional resonance versus analytical security.

### Palette Architecture
- **Primary Brand (Terracotta Rust / #E05A47):** Used exclusively for high-intent conversion points, personal match affinities, interactive chat actions, and primary calls to action.
- **Secondary / Trust (Deep Slate Teal / #1D4E5B):** Drives identity verification states, lease agreement signoffs, legal clauses, landlord credentials, and navigation active states.
- **Tertiary / Success (Emerald Mint / #16A34A):** Strictly reserved for verification checkmarks, high compatibility indicators (e.g., >85% match), and settled deposit transfers.
- **Warning & Friction (Soft Amber / #D97706):** Flags dietary or lifestyle dealbreakers (e.g., non-veg restrictions, smoking, late hours), pending KYC, and draft constitution approvals.
- **Surface Canvas (Warm Crisp Off-White / #FBFBF9):** An organic, eye-resting ground that mimics architectural parchment.
- **Borders & Dividers (Warm Edge / #EAE8E2):** Subdued hairline structural boundaries that separate cards and list groups without visual clutter.
- **Text & Contrast:** Deep Charcoal (`#191C1E`) provides AAA readability for headlines and key figures; Muted Slate (`#5E666D`) manages metadata, secondary badges, and microcopy.

## Typography

The type system pairs **Plus Jakarta Sans** for approachable, modern brand warmth with **Inter** for tabular metrics, currency symbols, percentages, and dense constitution terms.

### Rules & Numerical Hierarchy
- **Indian Rupee (₹) & Budget Display:** Always render `₹` alongside numerals in tabular figures (`font-variant-numeric: tabular-nums;`) using `Inter` to prevent character misalignment in comparative budget lists and rent split splits.
- **Match Compatibility Scores:** Display match percentages (`e.g., 94% Match`) using `label-numeric-lg` or `label-numeric-md` with `font-feature-settings: 'tnum' 1`.
- **Micro-Badges & Dealbreakers:** All boundary tags and lifestyle labels must use `label-badge` or `label-caps` in uppercase or semi-bold sentence case, preserving strict baseline alignment inside pill containers.

## Layout & Spacing

The design system operates on an 8-point baseline grid optimized for mobile PWA viewports (constrained to a maximum width of 420px centered on larger screens).

### Layout Specifications
- **Grid Architecture:** 4-column layout on mobile devices with `gutter` of 16px (`1rem`) and lateral screen `margin` of 16px (`1rem`). On displays under 360px wide, gutters and margins collapse gracefully to 12px.
- **Desktop Framing:** When loaded in a desktop browser, the interface locks to a centered 402px wide mobile phone canvas framed by a subtle neutral background (`#F4F3EF`), preserving the exact tactile thumb zone of a native application.
- **Vertical Flow:** Standard component stack spacing is `space-md` (16px), while distinct content blocks and card stacks divide cleanly via `space-lg` (24px).
- **Safe Area Anchors:** Bottom navigation and fixed floating action wrappers must include `env(safe-area-inset-bottom)` buffer padding plus `space-md` clearance above screen edges.

## Elevation & Depth

Visual hierarchy relies on crisp architectural surfaces and low-diffusion ambient shadows that emulate tactile paper and cards under soft ambient daylight. Heavy, murky dark drops are strictly prohibited.

### Tiers of Depth
- **Level 0 (Canvas):** Base background `#FBFBF9`. No shadows, totally flat.
- **Level 1 (Default Content Cards & List Blocks):** Pure white background (`#FFFFFF`) with a 1px continuous hairline outline using `#EAE8E2` and an ambient shadow: `box-shadow: 0 1px 3px rgba(25, 28, 30, 0.04), 0 4px 12px rgba(25, 28, 30, 0.02)`.
- **Level 2 (Active Swipes & Modals):** Elevated interaction cards and bottom sheets use `#FFFFFF` bounded by a 1px border of `#EAE8E2`, with an elevated lift: `box-shadow: 0 8px 24px -4px rgba(29, 78, 91, 0.08), 0 2px 6px -1px rgba(25, 28, 30, 0.04)`.
- **Level 3 (Sticky Bottom Bar & Floating CTAs):** Frosted glass canvas using `rgba(251, 251, 249, 0.88)` with `backdrop-filter: blur(12px)`, bordered by a continuous 1px top stroke of `#EAE8E2` and upward diffusion: `box-shadow: 0 -4px 16px rgba(25, 28, 30, 0.03)`.

## Shapes

The interface balances organic comfort with geometric stability. A base roundedness value of 2 (`0.5rem` / 8px) anchors interactive micro-components, stepping up contextually for structural housing cards.

### Corner Radius Mapping
- **Buttons, Text Inputs, and Dropdowns:** 10px to 12px radius, providing a tactile, thumb-friendly tap target.
- **Profile, Room, and Compatibility Cards:** 16px to 20px radius (`rounded-lg` to `rounded-xl`), creating comfortable, nest-like visual containers.
- **Pills, Badges, and Filters:** Full continuous curvature (`border-radius: 9999px`) for status tags, corridor chips, and compatibility pills.

## Components

### Buttons
- **Primary Action (Brand Affirmative):** Solid Terracotta Rust (`#E05A47`) with white text. Height: 52px on mobile to guarantee thumb reach. Active tap states scale down to `0.98` with a deepened tone (`#D04835`).
- **Secondary Action (Trust Verification):** Outline or subtle wash of Deep Slate Teal (`#1D4E5B`). White background with 1.5px solid border in `#1D4E5B` and matching text.
- **Ghost Action:** Transparent background with `#5E666D` text, transitioning to `#F4F3EF` on press.

### Trust Chips & Badges
- **Verified Flatmate Badge:** Pill container with Emerald Mint background wash (`#E8F5E9`), 1px stroke in `#16A34A` at 30% opacity, featuring `#16A34A` label and shield/check icon.
- **Dealbreaker Tags:** Pill container in warm off-white or soft tinted amber (`#FEF3C7`) with text and icons in `#D97706` (e.g., *Strict Vegetarian*, *Night Shift Routine*, *No Weekend Parties*).
- **Corridor / Hub Filter Chips:** Neutral inactive state (`#FFFFFF` background, `#EAE8E2` border, `#5E666D` text); active state switches to Deep Slate Teal (`#1D4E5B` fill with crisp white text).

### Cards
- **Match Compatibility Card:** Clean white container with a 16px radius, enclosed by a 1px `#EAE8E2` border. The top header integrates a split display: profile thumbnail, primary name, corporate workplace, and a bold circular or pill-shaped Compatibility Radial/Pill showing score (`e.g., 92%`).
- **Housing Constitution Item:** A specialized compact card indicating flat rule status: rule name, agreed status icon (Emerald check or Amber pending clock), and signatories' avatar stack.

### Inputs & Selectors
- **Form Fields:** Height 50px, background `#FFFFFF`, border 1px solid `#EAE8E2`, border-radius 10px. Focus state triggers a 1.5px Deep Slate Teal (`#1D4E5B`) ring without neon glows.
- **Budget Range Slider:** Double-thumb tactile handle in `#E05A47` connected by an active track in `#E05A47` and inactive track in `#EAE8E2`, paired with live tabular values in `₹` above each thumb.

### Navigation & App Bars
- **Bottom Navigation Bar:** Fixed PWA dock with a translucent background (`rgba(251, 251, 249, 0.92)` + `backdrop-filter: blur(12px)`). Contains 4 to 5 icons with 11px Inter labels. Active items render in `#1D4E5B` with a solid dot pip indicator; inactive items rest in `#8C939A`.
- **Top Safe Bar:** Minimal back action, title in `headline-sm`, and an optional right-aligned verified trust status shield.