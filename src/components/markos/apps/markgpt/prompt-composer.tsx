"use client";

import {
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { PromptIdea } from "./types";

type PromptComposerProps = {
  options: PromptIdea[];
  disabled: boolean;
  onSelect: (question: string, label: string) => void;
};

function PromptIcon({ name }: { name: PromptIdea["icon"] }) {
  if (name === "contact") return <Mail size={14} />;
  if (name === "fit") return <UserRound size={14} />;
  if (name === "story") return <FileText size={14} />;
  return <BriefcaseBusiness size={14} />;
}

/** Preset-only question dock. No fake freeform input or controls that cannot work. */
export function PromptComposer({ options, disabled, onSelect }: PromptComposerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (option: PromptIdea) => {
    setOpen(false);
    onSelect(option.question, option.label);
  };

  return (
    <div className="markgpt-composer-wrap">
      <div ref={rootRef} className="markgpt-question-dock">
        <div className="markgpt-question-dock-label">
          <span aria-hidden="true"><Sparkles size={14} /></span>
          <div><b>Ask next</b><small>Choose a question</small></div>
        </div>

        <div className="markgpt-question-shortcuts">
          {options.slice(0, 3).map((option) => (
            <button type="button" key={option.question} disabled={disabled} onClick={() => choose(option)} title={option.question}>
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="markgpt-question-more"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((current) => !current)}
        >
          More <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
        </button>

        <AnimatePresence>
          {open ? (
            <motion.div
              className="markgpt-question-menu"
              role="menu"
              initial={{ opacity: 0, y: 5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.985, transition: { duration: 0.1 } }}
              transition={{ type: "spring", stiffness: 550, damping: 38 }}
            >
              <header><b>Choose a question</b><small>Answers use portfolio content only.</small></header>
              {options.map((option) => (
                <button type="button" role="menuitem" key={option.question} onClick={() => choose(option)}>
                  <span><PromptIcon name={option.icon} /></span>
                  <span><b>{option.question}</b><small>{option.label}</small></span>
                </button>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
