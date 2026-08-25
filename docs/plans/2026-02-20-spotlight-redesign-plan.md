# Spotlight Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the portfolio from a generic template into a dark, cinematic, Awwwards-level experience using GSAP + ScrollTrigger + Lenis.

**Architecture:** Replace Framer Motion animations with GSAP ScrollTrigger for scroll-driven reveals. Strip gamification, particle field, marquees, and gradient orbs. Rewrite all 4 sections (hero, projects, about, contact) with cinematic typography, clip-path reveals, pinned scroll scenes, and parallax. Keep custom cursor (simplified), noise texture, and contact form (Firebase).

**Tech Stack:** Next.js 15, React 18, GSAP 3 + ScrollTrigger, Lenis, Tailwind CSS 4

---

### Task 1: Install GSAP and set up GSAP + Lenis integration

**Files:**
- Modify: `package.json`
- Create: `src/lib/gsap.ts`
- Modify: `src/components/lenis-provider.tsx`

**Step 1: Install GSAP**

Run: `cd C:/apps/portfolio && npm install gsap`
Expected: gsap added to dependencies

**Step 2: Create GSAP + Lenis setup module**

Create `src/lib/gsap.ts`:
```typescript
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
```

**Step 3: Update LenisProvider to connect Lenis → ScrollTrigger**

Rewrite `src/components/lenis-provider.tsx`:
```typescript
'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function LenisProvider() {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    const l = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenis.current = l;

    // Connect Lenis scroll to GSAP ScrollTrigger
    l.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      l.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      l.destroy();
      gsap.ticker.remove(l.raf);
    };
  }, []);

  return null;
}
```

**Step 4: Commit**

```bash
git add package.json package-lock.json src/lib/gsap.ts src/components/lenis-provider.tsx
git commit -m "feat: install GSAP and integrate with Lenis smooth scroll"
```

---

### Task 2: Create reusable GSAP animation utilities

**Files:**
- Create: `src/lib/animations-gsap.ts`

**Step 1: Create animation utilities**

Create `src/lib/animations-gsap.ts`:
```typescript
"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Split text into spans for line-by-line or word-by-word animation.
 * Returns cleanup function to restore original HTML.
 */
export function splitText(
  element: HTMLElement,
  type: "words" | "lines" | "chars" = "words"
): HTMLElement[] {
  const text = element.textContent || "";
  element.innerHTML = "";

  if (type === "chars") {
    const spans = text.split("").map((char) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.textContent = char === " " ? "\u00A0" : char;
      element.appendChild(span);
      return span;
    });
    return spans;
  }

  if (type === "words") {
    const spans = text.split(" ").map((word, i, arr) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.textContent = word;
      element.appendChild(span);
      if (i < arr.length - 1) {
        const space = document.createElement("span");
        space.innerHTML = "&nbsp;";
        space.style.display = "inline-block";
        element.appendChild(space);
      }
      return span;
    });
    return spans;
  }

  // lines — wrap each line in a div
  // First, put text in and measure
  element.textContent = text;
  const words = text.split(" ");
  element.innerHTML = "";

  const lineContainers: HTMLElement[] = [];
  let currentLine = document.createElement("div");
  currentLine.style.overflow = "hidden";
  element.appendChild(currentLine);

  words.forEach((word, i) => {
    const testSpan = document.createElement("span");
    testSpan.style.display = "inline";
    testSpan.textContent = (currentLine.textContent ? " " : "") + word;
    currentLine.appendChild(testSpan);

    if (currentLine.scrollWidth > element.clientWidth && currentLine.childNodes.length > 1) {
      currentLine.removeChild(testSpan);
      lineContainers.push(currentLine);
      currentLine = document.createElement("div");
      currentLine.style.overflow = "hidden";
      element.appendChild(currentLine);
      testSpan.textContent = word;
      currentLine.appendChild(testSpan);
    }
  });
  lineContainers.push(currentLine);

  return lineContainers;
}

/**
 * Animate elements fading up on scroll.
 */
export function fadeUp(
  elements: HTMLElement | HTMLElement[] | string,
  options: {
    trigger?: HTMLElement | string;
    start?: string;
    y?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
  } = {}
) {
  const {
    trigger,
    start = "top 85%",
    y = 60,
    duration = 1,
    stagger = 0.1,
    delay = 0,
  } = options;

  return gsap.from(elements, {
    y,
    opacity: 0,
    duration,
    stagger,
    delay,
    ease: "power3.out",
    scrollTrigger: trigger
      ? { trigger, start, toggleActions: "play none none none" }
      : undefined,
  });
}

/**
 * Reveal text with clip-path animation.
 */
export function clipReveal(
  element: HTMLElement | string,
  options: {
    trigger?: HTMLElement | string;
    start?: string;
    duration?: number;
    delay?: number;
    direction?: "up" | "left" | "center";
  } = {}
) {
  const {
    trigger,
    start = "top 85%",
    duration = 1.2,
    delay = 0,
    direction = "up",
  } = options;

  const clipPaths: Record<string, { from: string; to: string }> = {
    up: {
      from: "inset(100% 0% 0% 0%)",
      to: "inset(0% 0% 0% 0%)",
    },
    left: {
      from: "inset(0% 100% 0% 0%)",
      to: "inset(0% 0% 0% 0%)",
    },
    center: {
      from: "inset(0 50% 0 50%)",
      to: "inset(0 0% 0 0%)",
    },
  };

  const { from, to } = clipPaths[direction];

  return gsap.fromTo(
    element,
    { clipPath: from },
    {
      clipPath: to,
      duration,
      delay,
      ease: "power4.inOut",
      scrollTrigger: trigger
        ? { trigger, start, toggleActions: "play none none none" }
        : undefined,
    }
  );
}

/**
 * Parallax effect on scroll.
 */
export function parallax(
  element: HTMLElement | string,
  options: {
    trigger?: HTMLElement | string;
    start?: string;
    end?: string;
    y?: number | string;
    speed?: number;
  } = {}
) {
  const {
    trigger,
    start = "top bottom",
    end = "bottom top",
    y,
    speed = 0.5,
  } = options;

  const yValue = y ?? `${speed * 100}px`;

  return gsap.fromTo(
    element,
    { y: typeof yValue === "string" ? `-${yValue}` : -yValue },
    {
      y: yValue,
      ease: "none",
      scrollTrigger: {
        trigger: trigger || element,
        start,
        end,
        scrub: true,
      },
    }
  );
}

/**
 * Magnetic hover effect for buttons/links.
 */
export function magneticHover(element: HTMLElement, strength = 0.3) {
  const handleMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  element.addEventListener("mousemove", handleMove);
  element.addEventListener("mouseleave", handleLeave);

  return () => {
    element.removeEventListener("mousemove", handleMove);
    element.removeEventListener("mouseleave", handleLeave);
  };
}
```

**Step 2: Commit**

```bash
git add src/lib/animations-gsap.ts
git commit -m "feat: add reusable GSAP animation utilities (fadeUp, clipReveal, parallax, magnetic)"
```

---

### Task 3: Strip gamification and unused effects

**Files:**
- Delete: `src/app/context/game-context.tsx`
- Delete: `src/components/effects/particle-field.tsx`
- Delete: `src/components/effects/xp-bar.tsx`
- Delete: `src/components/effects/achievement-toast.tsx`
- Delete: `src/components/effects/achievements-panel.tsx`
- Delete: `src/components/effects/page-transition.tsx`
- Delete: `src/components/effects/gradient-orb.tsx`
- Delete: `src/components/effects/marquee-text.tsx`
- Delete: `src/components/effects/scroll-progress.tsx`
- Delete: `src/components/loading-bar.tsx`
- Modify: `src/app/layout.tsx` — remove all gamification/effects imports and providers
- Modify: `src/app/page.tsx` — remove GradientOrbGroup and MarqueeText

**Step 1: Delete unused files**

Run:
```bash
cd C:/apps/portfolio
rm src/app/context/game-context.tsx
rm src/components/effects/particle-field.tsx
rm src/components/effects/xp-bar.tsx
rm src/components/effects/achievement-toast.tsx
rm src/components/effects/achievements-panel.tsx
rm src/components/effects/page-transition.tsx
rm src/components/effects/gradient-orb.tsx
rm src/components/effects/marquee-text.tsx
rm src/components/effects/scroll-progress.tsx
rm src/components/loading-bar.tsx
```

**Step 2: Rewrite `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import LenisProvider from "@/components/lenis-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NoiseTexture } from "@/components/effects/noise-texture";
import { CustomCursor } from "@/components/effects/custom-cursor";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Mark Steyn | Full-Stack Developer & BMS Integrator",
  description: "Full-Stack Developer specializing in React, TypeScript, Node.js, and Building Management Systems.",
  keywords: ["Full-Stack Developer", "React", "TypeScript", "BMS", "Building Management Systems", "Portfolio"],
  authors: [{ name: "Mark Steyn" }],
  openGraph: {
    title: "Mark Steyn | Full-Stack Developer & BMS Integrator",
    description: "Full-Stack Developer specializing in React, TypeScript, Node.js, and Building Management Systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          <LenisProvider />
          <NoiseTexture />
          <Navbar />
          <main className="relative">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Step 3: Simplify `src/app/page.tsx`**

```tsx
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
```

**Step 4: Remove gamification imports from navbar.tsx**

In `src/components/layout/navbar.tsx`:
- Remove `import { useGameActions } from "@/app/context/game-context";`
- Remove `const { trackThemeToggle } = useGameActions();`
- Remove `trackThemeToggle();` from handleThemeToggle (keep the setTheme call)

**Step 5: Verify dev server still compiles**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3005`
Expected: 200 (or check terminal for build errors)

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: strip gamification, particles, marquees, and unused effects"
```

---

### Task 4: Rewrite Hero Section — cinematic clip-path reveal

**Files:**
- Rewrite: `src/components/sections/hero-section.tsx`

**Step 1: Rewrite the hero**

Replace entire `src/components/sections/hero-section.tsx` with:
```tsx
"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !nameRef.current || !subtitleRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Name reveal — clip-path wipe from center
      tl.fromTo(
        nameRef.current,
        { clipPath: "inset(0 50% 0 50%)" },
        { clipPath: "inset(0 0% 0 0%)", duration: 1.4, ease: "power4.inOut" }
      );

      // Subtitle fade up
      tl.from(
        subtitleRef.current,
        { y: 30, opacity: 0, duration: 0.8 },
        "-=0.4"
      );

      // Line grow
      if (lineRef.current) {
        tl.from(
          lineRef.current,
          { scaleX: 0, duration: 0.8, ease: "power2.inOut" },
          "-=0.4"
        );
      }

      // Scroll indicator
      if (scrollIndicatorRef.current) {
        tl.from(
          scrollIndicatorRef.current,
          { opacity: 0, y: 10, duration: 0.6 },
          "-=0.2"
        );
      }

      // Scroll-based exit: fade out and move up as user scrolls past
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "center center",
        end: "bottom top",
        scrub: true,
        animation: gsap.to(sectionRef.current!.querySelector(".hero-content"), {
          y: -80,
          opacity: 0,
          ease: "none",
        }),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background"
    >
      {/* Subtle radial gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent" />

      {/* Content */}
      <div className="hero-content relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Name */}
        <h1
          ref={nameRef}
          className="text-[clamp(3rem,15vw,12rem)] font-extrabold uppercase leading-[0.85] tracking-tighter"
          style={{ clipPath: "inset(0 50% 0 50%)" }}
        >
          Mark Steyn
        </h1>

        {/* Decorative line */}
        <div
          ref={lineRef}
          className="mx-auto my-8 h-px w-24 origin-center bg-foreground/20"
        />

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg tracking-widest text-muted-foreground md:text-xl"
          style={{ opacity: 0 }}
        >
          FULL-STACK DEVELOPER &amp; BMS INTEGRATOR
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ opacity: 0 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-foreground/30 to-transparent">
          <div className="h-3 w-full animate-pulse bg-foreground/50" />
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify in browser**

Open http://localhost:3005 and confirm:
- Name reveals with clip-path center wipe on load
- Subtitle fades up after
- Scrolling down fades out the hero content
- No particles, no scramble, no grid pattern

**Step 3: Commit**

```bash
git add src/components/sections/hero-section.tsx
git commit -m "feat: rewrite hero with cinematic GSAP clip-path reveal"
```

---

### Task 5: Rewrite Projects Section — pinned scroll scenes

**Files:**
- Rewrite: `src/components/sections/projects-section.tsx`

**Step 1: Rewrite projects with pinned scroll**

Replace entire `src/components/sections/projects-section.tsx` with:
```tsx
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate each project scene
      projectRefs.current.forEach((project) => {
        if (!project) return;

        const image = project.querySelector(".project-image");
        const title = project.querySelector(".project-title");
        const details = project.querySelector(".project-details");
        const number = project.querySelector(".project-number");

        // Image scale reveal
        if (image) {
          gsap.from(image, {
            scale: 0.85,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });

          // Parallax on image
          gsap.to(image, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: project,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // Number
        if (number) {
          gsap.from(number, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        }

        // Title reveal
        if (title) {
          gsap.from(title, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          });
        }

        // Details stagger
        if (details) {
          gsap.from(details.children, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative py-32 md:py-48">
      {/* Section label */}
      <div className="mx-auto mb-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Selected Work
        </p>
      </div>

      {/* Project scenes */}
      <div className="space-y-32 md:space-y-48">
        {projects.map((project, index) => (
          <div
            key={project.slug}
            ref={(el) => { projectRefs.current[index] = el; }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <Link href={`/projects/${project.slug}`} className="group block">
              <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
                {/* Image — alternate sides */}
                <div className={`overflow-hidden rounded-2xl ${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="project-image relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={project.images[0] || "/placeholder.webp"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  {/* Project number */}
                  <span className="project-number mb-4 block font-mono text-sm text-muted-foreground/40">
                    0{index + 1}
                  </span>

                  {/* Title */}
                  <h3 className="project-title mb-4 text-4xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-5xl lg:text-6xl">
                    {project.title}
                  </h3>

                  {/* Details */}
                  <div className="project-details">
                    <p className="mb-2 text-lg text-muted-foreground/80">
                      {project.subtitle}
                    </p>
                    <p className="mb-6 max-w-md text-muted-foreground/60">
                      {project.description}
                    </p>

                    {/* Tech */}
                    <div className="mb-8 flex flex-wrap gap-2">
                      {project.tech.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-foreground transition-colors group-hover:text-primary">
                      VIEW PROJECT
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Divider between projects */}
            {index < projects.length - 1 && (
              <div className="mx-auto mt-32 h-px w-16 bg-border/30 md:mt-48" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 2: Verify in browser**

- Each project alternates image side (left/right)
- Images scale in and have parallax
- Text staggers in on scroll
- Hover shows primary color on title

**Step 3: Commit**

```bash
git add src/components/sections/projects-section.tsx
git commit -m "feat: rewrite projects with scroll-triggered reveals and alternating layout"
```

---

### Task 6: Rewrite About Section — split layout with parallax

**Files:**
- Rewrite: `src/components/sections/about-section.tsx`

**Step 1: Rewrite about section**

Replace entire `src/components/sections/about-section.tsx` with:
```tsx
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { magneticHover } from "@/lib/animations-gsap";
import profilePhoto from "@/assets/profile/profile.jpg";

const skills = [
  "React", "Next.js", "TypeScript", "Tailwind CSS",
  "Node.js", "Python", "Flask", "FastAPI",
  "SQLite", "Supabase", "Firebase", "WebSockets",
  "BACnet", "Desigo CC", "FIN Framework", "KNX",
];

const timeline = [
  { year: "2020", title: "System Integrator", company: "Avantior Building Services" },
  { year: "2023", title: "Desigo CC Certified", company: "Siemens" },
  { year: "2021", title: "FIN Framework Trained", company: "J2 Innovations" },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cvBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Image parallax
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Heading reveal
      const heading = sectionRef.current!.querySelector(".about-heading");
      if (heading) {
        gsap.from(heading, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Bio paragraphs stagger
      const bioTexts = sectionRef.current!.querySelectorAll(".bio-text");
      if (bioTexts.length) {
        gsap.from(bioTexts, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bioTexts[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Skills grid stagger
      const skillItems = sectionRef.current!.querySelectorAll(".skill-item");
      if (skillItems.length) {
        gsap.from(skillItems, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: skillItems[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Timeline items
      const timelineItems = sectionRef.current!.querySelectorAll(".timeline-item");
      if (timelineItems.length) {
        gsap.from(timelineItems, {
          x: -30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineItems[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // CV button magnetic
      if (cvBtnRef.current) {
        return magneticHover(cvBtnRef.current, 0.3);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          About
        </p>

        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <div ref={imageRef} className="absolute inset-[-10%]">
                <Image
                  src={profilePhoto}
                  alt="Mark Steyn"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Timeline */}
            <div className="mt-12 space-y-6 border-l border-border/30 pl-6">
              {timeline.map((item, i) => (
                <div key={i} className="timeline-item relative">
                  <div className="absolute -left-[25px] top-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground/50">
                    {item.year}
                  </p>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground/60">{item.company}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Content */}
          <div className="space-y-12">
            <h2 className="about-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Building systems{" "}
              <span className="text-muted-foreground/40">that matter</span>
            </h2>

            <div className="space-y-6">
              <p className="bio-text text-lg leading-relaxed text-muted-foreground">
                I&apos;m a full-stack developer with 5+ years of experience building
                modern web applications and intelligent building automation systems.
              </p>
              <p className="bio-text text-lg leading-relaxed text-muted-foreground/70">
                Based in Pretoria, South Africa, I work as a System Integrator at
                Avantior Building Services where I develop custom BMS solutions
                integrating BACnet, KNX, and Siemens Desigo CC platforms.
              </p>
            </div>

            {/* Skills grid */}
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-item rounded-full border border-border/30 px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:border-foreground/30 hover:text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* CV Download */}
            <a
              ref={cvBtnRef}
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-sm font-medium tracking-wider text-foreground transition-colors hover:text-primary"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                <Download className="h-4 w-4 transition-colors group-hover:text-primary-foreground" />
              </span>
              DOWNLOAD CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify in browser**

- Image has parallax drift on scroll
- Text reveals stagger in
- Skills fade in with micro-stagger
- Timeline items slide from left
- CV button has magnetic hover

**Step 3: Commit**

```bash
git add src/components/sections/about-section.tsx
git commit -m "feat: rewrite about section with GSAP scroll reveals and parallax"
```

---

### Task 7: Rewrite Contact Section — dramatic and clean

**Files:**
- Rewrite: `src/components/sections/contact-section.tsx`

**Step 1: Rewrite contact section**

Replace entire `src/components/sections/contact-section.tsx` with:
```tsx
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Mail, Linkedin, MapPin, Send, Check, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { magneticHover } from "@/lib/animations-gsap";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "marksteyn1001@gmail.com",
    href: "mailto:marksteyn1001@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Mark Steyn",
    href: "https://www.linkedin.com/in/mark-steyn-b71894139/",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Pretoria, South Africa",
    href: null,
  },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      const heading = sectionRef.current!.querySelector(".contact-heading");
      if (heading) {
        gsap.from(heading, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Subtitle
      const subtitle = sectionRef.current!.querySelector(".contact-subtitle");
      if (subtitle) {
        gsap.from(subtitle, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: subtitle,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Form fields stagger
      const fields = sectionRef.current!.querySelectorAll(".form-field");
      if (fields.length) {
        gsap.from(fields, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: fields[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Contact links
      const links = sectionRef.current!.querySelectorAll(".contact-link");
      if (links.length) {
        gsap.from(links, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: links[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Submit button magnetic
      if (submitBtnRef.current) {
        return magneticHover(submitBtnRef.current, 0.2);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Network error");

      setSubmitted(true);
      toast.success("Message sent. I'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Contact
        </p>

        {/* Heading */}
        <h2 className="contact-heading mb-4 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          Let&apos;s talk
        </h2>
        <p className="contact-subtitle mb-20 max-w-lg text-lg text-muted-foreground/60">
          Have a project in mind or want to collaborate? I&apos;d love to hear from you.
        </p>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="form-field">
              <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground/50">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-b border-border/50 bg-transparent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/30 focus:border-foreground"
                placeholder="Your name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground/50">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-border/50 bg-transparent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/30 focus:border-foreground"
                placeholder="your@email.com"
              />
            </div>

            <div className="form-field">
              <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground/50">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full resize-none border-b border-border/50 bg-transparent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/30 focus:border-foreground"
                placeholder="Tell me about your project..."
              />
            </div>

            <div className="form-field pt-4">
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center gap-3 text-sm font-medium tracking-wider text-foreground transition-colors hover:text-primary disabled:opacity-50"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border/50 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                  {submitted ? (
                    <Check className="h-5 w-5 transition-colors group-hover:text-primary-foreground" />
                  ) : (
                    <Send className="h-4 w-4 transition-colors group-hover:text-primary-foreground" />
                  )}
                </span>
                {submitting ? "SENDING..." : submitted ? "SENT" : "SEND MESSAGE"}
              </button>
            </div>
          </form>

          {/* Contact links */}
          <div className="space-y-6 lg:pt-8">
            {contactLinks.map((item) => (
              <div key={item.label} className="contact-link">
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between border-b border-border/20 pb-4 transition-colors hover:border-foreground/30"
                  >
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground/40">
                        {item.label}
                      </p>
                      <p className="text-lg font-medium">{item.value}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <div className="border-b border-border/20 pb-4">
                    <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground/40">
                      {item.label}
                    </p>
                    <p className="text-lg font-medium">{item.value}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Availability */}
            <div className="mt-12 flex items-center gap-3 pt-4">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-muted-foreground/60">
                Available for freelance &amp; full-time
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify in browser**

- "Let's talk" heading reveals on scroll
- Form fields have clean underline inputs
- Submit button has magnetic hover
- Contact links have border hover effect
- Green availability dot pulses

**Step 3: Commit**

```bash
git add src/components/sections/contact-section.tsx
git commit -m "feat: rewrite contact section with clean underline inputs and GSAP reveals"
```

---

### Task 8: Simplify custom cursor — dot + ring only

**Files:**
- Rewrite: `src/components/effects/custom-cursor.tsx`

**Step 1: Simplify the cursor**

Replace entire `src/components/effects/custom-cursor.tsx` with:
```tsx
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (!visible) setVisible(true);
  }, [visible]);

  // Hover detection
  useEffect(() => {
    if (isMobile) return;

    const grow = () => {
      if (ringRef.current) {
        gsap.to(ringRef.current, { width: 56, height: 56, borderColor: "hsl(var(--primary))", duration: 0.3, ease: "power2.out" });
      }
    };
    const shrink = () => {
      if (ringRef.current) {
        gsap.to(ringRef.current, { width: 36, height: 36, borderColor: "hsl(var(--foreground) / 0.2)", duration: 0.3, ease: "power2.out" });
      }
    };

    const setup = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };

    setup();
    const observer = new MutationObserver(setup);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, [isMobile]);

  // Animation loop
  useEffect(() => {
    if (isMobile) return;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", () => setVisible(false));
    document.addEventListener("mouseenter", () => setVisible(true));

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 3}px, ${mouse.current.y - 3}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, onMouseMove]);

  if (isMobile) return null;

  return (
    <>
      <style jsx global>{`* { cursor: none !important; }`}</style>

      {/* Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border"
        style={{
          width: 36,
          height: 36,
          borderColor: "hsl(var(--foreground) / 0.2)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
          mixBlendMode: "difference",
        }}
      />

      {/* Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: "hsl(var(--foreground))",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}

export default CustomCursor;
```

**Step 2: Verify — cursor is simple dot + ring, ring grows on hover**

**Step 3: Commit**

```bash
git add src/components/effects/custom-cursor.tsx
git commit -m "refactor: simplify custom cursor to dot + ring with GSAP hover"
```

---

### Task 9: Update navbar — remove gamification, refine styling

**Files:**
- Modify: `src/components/layout/navbar.tsx`

**Step 1: Update navbar**

Key changes:
- Remove `useGameActions` import and usage
- Remove `framer-motion` AnimatePresence and motion (use GSAP or plain CSS)
- Keep functionality (theme toggle, scroll nav, mobile menu)
- Simplify styling to match cinematic look

Remove these imports and usages:
- `import { useGameActions } from "@/app/context/game-context";`
- `const { trackThemeToggle } = useGameActions();`
- `trackThemeToggle();` from handleThemeToggle

Replace `motion.header` with a regular `<header>` and use CSS transitions for the scroll effect.

Replace the mobile menu `motion.div` with a plain `<div>` with CSS transition.

**Step 2: Verify nav still works — theme toggle, scroll, mobile menu**

**Step 3: Commit**

```bash
git add src/components/layout/navbar.tsx
git commit -m "refactor: simplify navbar, remove gamification dependency"
```

---

### Task 10: Clean up globals.css — remove unused animations

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Remove unused CSS**

Remove these CSS blocks that are no longer needed:
- `.grid-pattern` (hero no longer uses it)
- `@keyframes float` and `.animate-float` (gradient orbs removed)
- `@keyframes pulse-glow` and `.animate-pulse-glow` (removed)
- `@keyframes marquee` and `.animate-marquee` (marquee removed)
- `@keyframes orb-roll` and `.animate-orb-roll` (removed)
- `@keyframes text-shimmer` and `.animate-text-shimmer` (removed)
- `@keyframes glow-pulse` and `.animate-glow-pulse` (removed)
- `@keyframes border-draw` (removed)
- `.clip-reveal` CSS (GSAP handles clip-path now)
- `.primary-gradient` (removed)
- `.scroll-x-snap` and `.scroll-x-snap-child` (horizontal scroll removed)
- `@keyframes spin-slow` and `.animate-spin-slow` (removed)
- `.bg-gradient-conic` (removed)
- `@keyframes loading` (progress bar removed)

Keep:
- Tailwind imports
- Lenis smooth scroll styles
- Theme tokens (`:root` and `.dark`)
- Base styles (`*`, `body`, `html`)
- Noise overlay
- Custom scrollbar
- Selection color
- Focus visible
- `@keyframes fade-up` and `.animate-fade-up` (may be useful)
- `@keyframes line-reveal` and `.animate-line-reveal` (may be useful)
- `.text-gradient` and `.glow` (may be useful)
- `.magnetic-hover` and `.perspective-wrapper` (may be useful)
- Reduced motion media query (update to only reference kept animations)

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: clean up globals.css, remove unused animation keyframes"
```

---

### Task 11: Clean up unused files and dependencies

**Files:**
- Delete: `src/lib/animations.ts` (old Framer Motion animation utils)
- Delete: `src/lib/animation-utils.ts` (old animation helpers)
- Delete: `src/components/body-wrapper.tsx` (if unused)
- Delete: `src/components/mobile-spacer.tsx` (if unused)
- Delete: `src/components/scroll-top.tsx` (if unused)
- Delete: `src/components/magicui/` directory (if unused)
- Delete: `src/components/cards/project-card.tsx` (if unused)
- Optionally: Consider removing `framer-motion` and `motion` from package.json if no remaining files use them (check case study page first)

**Step 1: Check for remaining usages**

Run: Search for imports of deleted modules across remaining files. If the case study page (`src/app/projects/[slug]/page.tsx`) still uses framer-motion, keep the dependency.

**Step 2: Delete confirmed unused files**

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused components, animations, and dead code"
```

---

### Task 12: Final verification and polish

**Step 1: Full page scroll-through test**

Open http://localhost:3005 and verify:
- [ ] Hero: clip-path reveal on load, fades on scroll
- [ ] Projects: alternating layout, images scale in with parallax, text staggers
- [ ] About: image parallax, text reveals, skills fade, timeline slides
- [ ] Contact: heading reveal, underline inputs, magnetic submit, links animate
- [ ] Cursor: dot + ring, ring grows on interactive elements
- [ ] Noise texture: subtle grain visible
- [ ] Dark mode: everything looks correct
- [ ] Light mode: toggle works, colors adapt
- [ ] Mobile: cursor hidden, layout responsive
- [ ] No console errors

**Step 2: Fix any issues found**

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: Spotlight redesign complete — cinematic GSAP portfolio"
```
