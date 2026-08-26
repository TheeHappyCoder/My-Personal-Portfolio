"use client";

import { Check, ChevronDown, Search, Shapes, TextCursorInput } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  { label: "Searching the project index", meta: "7 case studies", icon: Search },
  { label: "Matching evidence to the question", meta: "skills + outcomes", icon: Shapes },
  { label: "Writing a concise answer", meta: "portfolio only", icon: TextCursorInput },
];

/** Thinking trace and pixel loader adapted from Beautiful UI (MIT). */
export function ThinkingTrace() {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState(reduceMotion ? steps.length : 0);
  const [expanded, setExpanded] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const startedAt = performance.now();
    const ticker = window.setInterval(() => setElapsed(performance.now() - startedAt), 100);
    const timers = [520, 1400, 2350].map((delay, index) => window.setTimeout(() => setStage(index + 1), delay));
    return () => {
      window.clearInterval(ticker);
      timers.forEach(window.clearTimeout);
    };
  }, [reduceMotion]);

  const done = stage >= steps.length;

  return (
    <div className="markgpt-thinking" role="status" aria-live="polite">
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
        <span className={`markgpt-pixel-loader${done ? " is-done" : ""}`} aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => <i key={index} style={{ animationDelay: `${index * 70}ms` }} />)}
        </span>
        <span>{done ? "Portfolio reviewed" : "Reviewing portfolio"}</span>
        <small>{(elapsed / 1000).toFixed(1)}s</small>
        <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            className="markgpt-thinking-steps"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 550, damping: 40 }}
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              const visible = index < Math.max(stage, 1);
              const complete = index < stage;
              return visible ? (
                <motion.div
                  key={step.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(3px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <span>{complete ? <Check size={13} /> : <Icon size={13} />}</span>
                  <b>{step.label}</b>
                  <small>{step.meta}</small>
                </motion.div>
              ) : null;
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
