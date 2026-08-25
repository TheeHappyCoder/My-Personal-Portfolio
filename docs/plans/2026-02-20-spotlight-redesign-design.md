# Spotlight Redesign — Design Document

**Date:** 2026-02-20
**Direction:** Dark cinematic — Apple product reveal energy
**Stack:** Next.js 15, GSAP + ScrollTrigger, Lenis smooth scroll, Tailwind CSS 4

---

## Concept

The portfolio as a cinematic experience. Every section is a scene revealed by scroll. Dark backgrounds, dramatic typography reveals, spotlight effects, and scroll-driven parallax. Strip all clutter — let the work speak.

## What Gets Removed

- Gamification system (XP bar, achievements, game-context)
- Particle field
- Scramble text effect
- Achievement toasts
- Loading bar / NProgress
- Page transition component
- Marquee text dividers
- Gradient orb overlays

## What Gets Kept (Refined)

- Custom cursor (simplified — dot + ring, no trail)
- Noise texture overlay (film grain)
- Dark/light theme toggle (dark default)
- Contact form with Firebase
- Lenis smooth scrolling

## What Gets Added

- GSAP + ScrollTrigger for all animations
- GSAP SplitText-style line/word reveals (manual implementation)
- Clip-path hero reveal animation
- Scroll-driven pinned project showcases
- Parallax image effects
- Magnetic hover effects on buttons/links

---

## Section-by-Section Design

### 1. Hero (100vh)

**Layout:** Full viewport, centered content, dark background (#0a0a0a).

**Content:**
- Name "MARK STEYN" in massive display type (~15vw, font-weight 800, uppercase, letter-spacing tight)
- Revealed with a clip-path wipe animation (circle or horizontal reveal on load, ~1.2s)
- Subtitle line beneath: role/tagline in light gray (#888), fades up after name reveal (~0.4s delay)
- Subtle scroll indicator at bottom (thin animated line or chevron)

**Animation:**
- GSAP timeline on mount: clip-path `inset(0 50% 0 50%)` → `inset(0 0% 0 0%)` for the name
- Subtitle: `opacity: 0, y: 20` → `opacity: 1, y: 0`
- Scroll indicator: infinite pulse

**No:** particles, background effects, orbs. Pure dark + type.

### 2. Projects (pinned scroll sections)

**Layout:** Each project is a full-screen pinned section. 3 projects = 3 scenes.

**Per project scene:**
- Left side: Project image/screenshot that scales from 80% → 100% as you scroll in
- Right side: Project title (large, bold), one-line description, tech tags, "View Case Study" link
- Text elements stagger in with GSAP (word-by-word or line-by-line)
- Image has subtle parallax (moves slower than scroll)

**Animation:**
- ScrollTrigger pin each project section
- Image: `scale(0.85)` → `scale(1)`, slight Y parallax
- Title: split into lines, each line reveals with `y: 60, opacity: 0` → `y: 0, opacity: 1`, staggered 0.1s
- Description and tags fade up after title completes
- On scroll-out: everything fades/moves out before next project pins

**Transitions between projects:** Crossfade or vertical slide.

### 3. About (100vh, split layout)

**Layout:** Two-column at desktop. Image left, text right.

**Left column:**
- Profile photo with subtle slow parallax drift (GSAP ScrollTrigger, y offset based on scroll)
- Slight scale effect on scroll entry

**Right column:**
- "About" heading — line-by-line reveal
- Bio text — paragraph fades up
- Skills — minimal grid of text labels (not badges), staggered fade
- CV download — clean button with magnetic hover effect

**Animation:**
- All text reveals triggered by ScrollTrigger entering viewport
- Photo: `scale(1.05), y: 30` → `scale(1), y: 0` over scroll distance
- Skills grid: each item fades up with 0.05s stagger

### 4. Contact (100vh)

**Layout:** Centered, generous whitespace.

**Content:**
- Large heading: "Let's Talk" or "Get In Touch" (~8vw)
- Subtitle line in gray
- Clean form: name, email, message fields
- Animated underline inputs (bottom border grows from center on focus)
- Submit button with magnetic hover effect and subtle glow

**Animation:**
- Heading: line reveal (clip-path or y-translate)
- Form fields: stagger fade-up on scroll entry
- Submit button: scale micro-interaction on hover

### 5. Footer

- Minimal: social links (icons), copyright
- Links have magnetic hover effect
- Clean horizontal rule separator

---

## Global Effects

### Custom Cursor
- Main: 8px solid white dot
- Ring: 40px border ring, follows with slight delay (lerp)
- Hover state: ring expands to 60px, dot shrinks
- Link hover: ring fills with low opacity
- No trail particles

### Noise Texture
- Keep existing noise overlay at very low opacity (~0.03)
- Adds cinematic film grain to dark backgrounds

### Smooth Scroll
- Lenis with GSAP ScrollTrigger integration (`lenis.on('scroll', ScrollTrigger.update)`)
- Duration ~1.2 for smooth feel

### Navigation
- Fixed top nav, transparent initially
- Blurs/darkens on scroll (backdrop-filter)
- Logo left, nav links right
- Links have underline-on-hover animation (width grows from left)
- Hamburger on mobile

---

## Typography

- **Display:** Manrope 800 (or consider a sharper display font)
- **Body:** Manrope 400/500
- **Sizes:** Clamp-based responsive scaling
  - Hero name: `clamp(3rem, 15vw, 12rem)`
  - Section headings: `clamp(2rem, 6vw, 5rem)`
  - Body: `clamp(1rem, 1.2vw, 1.25rem)`

## Color Palette

- **Background:** #0a0a0a (near black)
- **Text primary:** #fafafa (near white)
- **Text secondary:** #888888
- **Text muted:** #555555
- **Accent:** #ffffff (white as accent on dark — keeps it monochrome cinematic)
- **Hover/active:** subtle white glow (`box-shadow: 0 0 20px rgba(255,255,255,0.1)`)

## Tech Implementation

### GSAP Setup
- Install `gsap` package
- Register ScrollTrigger plugin
- Connect Lenis scroll to ScrollTrigger updates
- Create reusable animation utilities (text split, fade-up, parallax)

### File Structure Changes
- Remove: `effects/particle-field.tsx`, `effects/xp-bar.tsx`, `effects/achievement-toast.tsx`, `effects/page-transition.tsx`, `effects/loading-bar.tsx`, `effects/marquee-text.tsx`, `effects/gradient-orb.tsx`, `context/game-context.tsx`
- Rewrite: `sections/hero-section.tsx`, `sections/projects-section.tsx`, `sections/about-section.tsx`, `sections/contact-section.tsx`
- Refine: `effects/custom-cursor.tsx`, `effects/noise-texture.tsx`
- Add: `lib/gsap.ts` (GSAP + ScrollTrigger + Lenis setup), `lib/animations-gsap.ts` (reusable GSAP utilities)
- Update: `layout.tsx` (remove providers for gamification, add GSAP/Lenis provider)

### Performance
- GSAP animations are GPU-accelerated (transform, opacity only)
- No layout-triggering properties animated
- will-change hints on animated elements
- ScrollTrigger lazy initialization
- Images use Next.js Image with priority for above-fold
