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
