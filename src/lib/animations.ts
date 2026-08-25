import { Variants, Transition } from "framer-motion";

// ============================================
// UTILITY FUNCTIONS (moved from gsap-utils)
// ============================================

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function getMousePosition(e: MouseEvent, element?: HTMLElement) {
  if (element) {
    const rect = element.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      normalizedX: (e.clientX - rect.left) / rect.width,
      normalizedY: (e.clientY - rect.top) / rect.height,
    };
  }
  return {
    x: e.clientX,
    y: e.clientY,
    normalizedX: e.clientX / window.innerWidth,
    normalizedY: e.clientY / window.innerHeight,
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ============================================
// TEXT SCRAMBLE (pure JS, no GSAP)
// ============================================

export function createTextScramble(
  element: HTMLElement,
  options: {
    finalText?: string;
    duration?: number;
    scrambleChars?: string;
    onComplete?: () => void;
  } = {}
): () => void {
  const {
    finalText = element.textContent || "",
    duration = 1500,
    scrambleChars = "!<>-_\\/[]{}=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    onComplete,
  } = options;

  const chars = finalText.split("");
  const startTime = performance.now();

  const interval = setInterval(() => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const revealedCount = Math.floor(progress * chars.length);

    const currentText = chars.map((char, i) => {
      if (i < revealedCount) return char;
      if (char === " ") return " ";
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    });

    element.textContent = currentText.join("");

    if (progress >= 1) {
      clearInterval(interval);
      element.textContent = finalText;
      onComplete?.();
    }
  }, 30);

  return () => clearInterval(interval);
}

// ============================================
// SPLIT TEXT UTILITY
// ============================================

export interface SplitTextResult {
  chars: HTMLSpanElement[];
  words: HTMLSpanElement[];
  lines: HTMLSpanElement[];
  revert: () => void;
}

export function splitText(
  element: HTMLElement,
  options: {
    type?: "chars" | "words" | "lines" | "chars,words" | "chars,lines" | "words,lines" | "chars,words,lines";
    charsClass?: string;
    wordsClass?: string;
    linesClass?: string;
  } = {}
): SplitTextResult {
  const {
    type = "chars,words",
    charsClass = "char",
    wordsClass = "word",
  } = options;

  const originalHTML = element.innerHTML;
  const text = element.textContent || "";
  const chars: HTMLSpanElement[] = [];
  const words: HTMLSpanElement[] = [];
  const lines: HTMLSpanElement[] = [];

  element.innerHTML = "";

  const wordStrings = text.split(/\s+/).filter(Boolean);

  wordStrings.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = wordsClass;
    wordSpan.style.display = "inline-block";
    wordSpan.style.whiteSpace = "nowrap";

    if (type.includes("chars")) {
      word.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.className = charsClass;
        charSpan.style.display = "inline-block";
        charSpan.textContent = char;
        charSpan.dataset.charIndex = String(chars.length);
        chars.push(charSpan);
        wordSpan.appendChild(charSpan);
      });
    } else {
      wordSpan.textContent = word;
    }

    wordSpan.dataset.wordIndex = String(wordIndex);
    words.push(wordSpan);
    element.appendChild(wordSpan);

    if (wordIndex < wordStrings.length - 1) {
      element.appendChild(document.createTextNode(" "));
    }
  });

  return {
    chars,
    words,
    lines,
    revert: () => {
      element.innerHTML = originalHTML;
    },
  };
}

// ============================================
// Spring animation presets
// ============================================

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const gentleSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

export const bouncySpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
};

// ============================================
// Fade animations
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition
  },
};

// ============================================
// Scale animations
// ============================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: bouncySpring
  },
};

// ============================================
// Stagger containers
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Character animation for names/titles
export const characterAnimation: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    }
  },
};

// ============================================
// Card & Button hover effects
// ============================================

export const cardHover = {
  rest: {
    scale: 1,
    transition: springTransition
  },
  hover: {
    scale: 1.02,
    transition: springTransition
  },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.98 },
};

// ============================================
// Section viewport animation
// ============================================

export const sectionViewport = {
  once: true,
  margin: "-100px" as const,
};

// ============================================
// Page transition variants
// ============================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  },
};

// ============================================
// Slide up reveal
// ============================================

export const slideUpReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    transition: { duration: 0.5 }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
};

// ============================================
// Image reveal
// ============================================

export const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
};

// ============================================
// List item animation
// ============================================

export const listItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition
  },
};

// ============================================
// Footer animation
// ============================================

export const footerAnimation: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: 0.3
    }
  },
};
