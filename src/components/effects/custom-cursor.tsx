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
    window.queueMicrotask(() => setIsMobile(window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window));
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (!visible) setVisible(true);
  }, [visible]);

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
