---
name: Christopher Two
description: A monochrome proof-sheet portfolio for products that reach production.
colors:
  paper: "#f7f7f5"
  white: "#ffffff"
  black: "#0d0d0d"
  ink: "#111111"
  ink-soft: "#5c5c58"
  surface: "#ebebe7"
  surface-deep: "#d8d8d3"
  contrast: "#0d0d0d"
  contrast-text: "#f7f7f5"
  contrast-muted: "#b9b9b2"
typography:
  scale:
    micro: "10px"
    label: "11px"
    metadata: "12px"
    body-small: "13px"
    body: "14px"
    base: "16px"
    lead: "18px"
    display-compact: "1.2rem"
    display-detail: "1.3rem"
    display-lede: "1.4rem"
    display-contact: "1.35rem"
    title-small: "1.5rem"
    title-project: "1.6rem"
    title-card: "1.8rem"
    title-section: "2rem"
    title-brand: "2.3rem"
    title-app: "2.4rem"
    title-page: "2.5rem"
    title-panel: "2.6rem"
    title-project-large: "2.8rem"
    title-article: "3rem"
    arrow-small: "18px"
    arrow-project: "29px"
    arrow-card: "34px"
    display-wide: "4.5rem"
    display-brand: "5rem"
    display-max: "5.5rem"
    display-section-max: "5.2rem"
    display-article: "6rem"
    display-brand-wide: "13rem"
  display:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(3.4rem, 8vw, 6.8rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.075em"
  body:
    fontFamily: "Bricolage Grotesque, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.1em"
rounded:
  sm: "0"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "72px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "13px 17px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "13px 17px"
---

# Design System: Christopher Two

## Overview

**Creative North Star: "The Monochrome Proof Sheet"**

The portfolio behaves like a precise studio proof: white paper carries the reading experience, black ink establishes hierarchy, and rules mark the edges between ideas. The system is intentionally quiet in color and decisive in scale, allowing the projects and their context to do the work.

Large typographic statements create the first impression. Compact mono labels, numbered work, and measured borders create an index that can be scanned quickly. Motion is the physical act of a page settling into place: confident entrance, viewport reveals, and small directional responses on links.

The whole site carries a low-contrast monochrome dithering shader as a living paper field. It is texture, not decoration: its X/Y offset shifts subtly with scroll while the content remains the highest-contrast layer.

**Key Characteristics:**
- White-dominant monochrome surfaces with black structural contrast.
- Heavy editorial display type paired with utilitarian mono metadata.
- Flat geometric silhouettes, thin rules, and restrained ambient depth.
- Entrance and scroll motion that yields immediately to reduced-motion preferences.

## Colors

The palette is a grayscale material system rather than an accent system. Theme switching inverts the paper and ink roles while preserving the same hierarchy.

### Primary
- **Black Ink** (`{colors.ink}`): Primary text, borders, active controls, and decisive surfaces.

### Secondary
- **Surface Gray** (`{colors.surface}`): Quiet section backgrounds and secondary containers.
- **Deep Surface Gray** (`{colors.surface-deep}`): Tonal separation for cards and labels.

### Neutral
- **Paper** (`{colors.paper}`): Default reading canvas and light text on dark surfaces.
- **White** (`{colors.white}`): Explicit white control state and high-contrast cards.
- **Soft Ink** (`{colors.ink-soft}`): Secondary copy and metadata.

### Named Rules
**The Ink-First Rule.** Color never competes with the work; hierarchy comes from contrast, scale, and spacing.

## Typography

**Display Font:** Archivo (with Arial, sans-serif fallback)
**Body Font:** Bricolage Grotesque (with Arial, sans-serif fallback)
**Label/Mono Font:** IBM Plex Mono (monospace)

**Character:** Archivo gives statements a dense, assertive silhouette without adding ornament. Bricolage Grotesque gives the reading layer a more expressive editorial rhythm while staying clear in Spanish. IBM Plex Mono is reserved for navigation, measurements, metadata, and project indexing.

### Hierarchy
- **Display** (900, `clamp(3.4rem, 8vw, 6.8rem)`, `.86`): Hero and page-introduction statements.
- **Headline** (800, `clamp(2.5rem, 5vw, 5.2rem)`, `.9`): Section-level ideas and contact prompts.
- **Title** (800-900, responsive): Project names, cards, and manifesto sections.
- **Body** (400, `16px`, `1.5-1.7`): Explanatory copy kept within a readable measure.
- **Label** (500, `11px`, `.1em`, uppercase): Navigation, metadata, categories, and proof marks.

### Named Rules
**The Two-Voice Rule.** Display type makes the claim; mono type tells visitors where they are.

## Layout

The site uses a centered `min(1280px, 100% - 36px)` content field with full-width ruled sections. The landing page alternates broad quiet fields with dense project indexes. Desktop layouts use split grids and two-column project catalogs; below `1023px`, navigation becomes a contained menu, and below `767px`, content stacks into one readable column.

Spacing expands around major statements and contracts around metadata. Project rows use a consistent number, title, description, tag, and directional arrow relationship. No layout depends on color to communicate order.

## Elevation & Depth

Surfaces are flat by default. Depth appears as a soft ambient shadow on interactive cards, images, and navigation panels, and as a small transform on hover. Hard offset shadows and decorative glow are not part of the system.

### Shadow Vocabulary
- **Ambient surface** (`0 18px 42px rgba(0, 0, 0, .12)`): Cards and the profile image when they lift from the page.
- **Interactive lift** (`0 24px 50px rgba(0, 0, 0, .18)`): Hover state for project and published-app cards.

### Named Rules
**The Flat-By-Default Rule.** Resting surfaces stay quiet; depth only acknowledges a relationship or interaction.

## Shapes

The form language is square and editorial: zero-radius geometry, one-pixel rules for indexing, and two-pixel rules for primary boundaries. Images use controlled crops, not decorative masks. Focus rings are offset and visible rather than hidden inside the border.

## Components

### Buttons
- **Shape:** Square, ruled, and typographic (`0` radius).
- **Primary:** Black ink with paper text; compact mono uppercase label.
- **Hover / Focus:** Ambient lift or inversion, with a visible two-pixel focus outline.
- **Secondary / Ghost:** Transparent surface with an ink rule, inverting on hover.

### Chips
- **Style:** Transparent grayscale labels with a thin ink rule.
- **State:** The active filter uses a solid ink field with paper text; inactive filters remain quiet.

### Cards / Containers
- **Corner Style:** Square corners.
- **Background:** Paper, surface gray, deep surface gray, or contrast black/white by semantic role.
- **Shadow Strategy:** Ambient shadow only on cards that can be lifted or explored.
- **Border:** One-pixel rule for indexing, two-pixel rule for primary cards.
- **Internal Padding:** Compact metadata starts at `24px`; broad sections use responsive vertical padding.

### Navigation
- **Style:** Centered mono index on desktop with a persistent Black/White control at the edge.
- **States:** Trigger hover uses a tonal surface; panels use a ruled boundary and a soft ambient shadow.
- **Mobile:** Navigation becomes a full-width contained list below the sticky header.

### Motion
- **Entrance:** Hero content, illustration, and page introductions rise and settle with an exponential ease-out.
- **Scroll reveal:** Project rows, cards, skills, and sections reveal once as they enter the viewport.
- **Feedback:** Links and cards respond through underline, transform, tonal inversion, or ambient lift.
- **Site shader:** A black-and-white dithering field runs behind every route, shifts its X/Y offset with scroll, pauses when out of view, and becomes static for reduced motion.
- **Accessibility:** `prefers-reduced-motion` disables authored motion and keeps all content visible.

## Do's and Don'ts

### Do:
- **Do** use black, white, and the established grayscale surfaces as the complete visual palette.
- **Do** let bold Archivo headlines carry the hierarchy before adding decoration.
- **Do** use IBM Plex Mono for navigation, metadata, indexes, and technical labels.
- **Do** keep projects and contact visible within the main reading path.
- **Do** preserve the same contrast and focus behavior in both theme states.

### Don't:
- **Don't** reintroduce saturated accent colors, gradients, or colored glow.
- **Don't** use rounded cards, pill-heavy controls, or soft glass panels.
- **Don't** animate layout dimensions; use transform, opacity, clip-path, and tonal transitions.
- **Don't** hide content when motion scripts are unavailable or reduced motion is requested.
