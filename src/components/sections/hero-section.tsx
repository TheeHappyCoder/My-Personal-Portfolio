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
