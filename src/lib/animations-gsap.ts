"use client";

import { gsap } from "@/lib/gsap";

/**
 * Split text into spans for line-by-line or word-by-word animation.
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

  // lines fallback — just return the element wrapped
  const div = document.createElement("div");
  div.style.overflow = "hidden";
  div.textContent = text;
  element.appendChild(div);
  return [div];
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
 * Reveal with clip-path animation.
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
    up: { from: "inset(100% 0% 0% 0%)", to: "inset(0% 0% 0% 0%)" },
    left: { from: "inset(0% 100% 0% 0%)", to: "inset(0% 0% 0% 0%)" },
    center: { from: "inset(0 50% 0 50%)", to: "inset(0 0% 0 0%)" },
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
