"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  FolderKanban,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { MarkGptSource } from "./types";

const indexRows = [
  { label: "Product systems", detail: "7 shipped projects", icon: FolderKanban },
  { label: "Interface engineering", detail: "React + TypeScript", icon: Wrench },
  { label: "Physical operations", detail: "BMS + edge protocols", icon: ShieldCheck },
];

/** Compact task rows adapted from Beautiful UI's TaskRows primitive (MIT). */
export function PortfolioIndexRows() {
  return (
    <section className="markgpt-index-rows" aria-label="Portfolio index status">
      {indexRows.map((row, index) => {
        const Icon = row.icon;
        return (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.16, ease: "easeOut" }}
          >
            <span><Icon size={14} /></span>
            <b>{row.label}</b>
            <small>{row.detail}</small>
            <i><Check size={11} /> Indexed</i>
          </motion.div>
        );
      })}
    </section>
  );
}

type RecommendationCardProps = {
  onOpenProject: () => void;
  onBrowseWork: () => void;
};

/** Recommendation card and confidence meter adapted from Beautiful UI (MIT). */
export function NovaRecommendationCard({ onOpenProject, onBrowseWork }: RecommendationCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <section className="markgpt-recommendation" aria-label="Recommended starting point">
      <div className="markgpt-recommendation-copy">
        <div><span>Strongest starting point</span><small>2020 – present</small></div>
        <h3>NovaCore</h3>
        <p>Product architecture, frontend craft, control systems, and real operational depth in one case study.</p>
      </div>
      <AnimatePresence initial={false}>
        {detailsOpen ? (
          <motion.div
            className="markgpt-recommendation-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 550, damping: 40 }}
          >
            <span>Local platform</span><span>Cloud control plane</span><span>7 protocols</span><span>Deterministic control</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <footer>
        <button type="button" className="markgpt-confidence" onClick={() => setDetailsOpen((current) => !current)} aria-expanded={detailsOpen}>
          <span aria-hidden="true"><i /><i /><i /></span> Deepest evidence <ChevronDown size={13} />
        </button>
        <div>
          <button type="button" className="markgpt-button secondary" onClick={onBrowseWork}>Browse work</button>
          <button type="button" className="markgpt-button primary" onClick={onOpenProject}>Open NovaCore <ArrowRight size={13} /></button>
        </div>
      </footer>
    </section>
  );
}

/** Fast word-level focus arrival adapted from Beautiful UI's Streaming Text primitive (MIT). */
export function StreamingAnswer({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) return <p className="markgpt-answer-text">{text}</p>;

  return (
    <p className="markgpt-answer-text" aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          key={`${word}-${index}`}
          initial={{ opacity: 0.3, filter: "blur(3px)", y: 2 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ delay: Math.min(index * 0.012, 0.58), duration: 0.16, ease: "easeOut" }}
        >
          {word}{index === words.length - 1 ? "" : " "}
        </motion.span>
      ))}
    </p>
  );
}

function SourceCards({ sources }: { sources: MarkGptSource[] }) {
  return (
    <div className="markgpt-source-cards">
      {sources.map((source, index) => (
        <motion.article
          key={`${source.title}-${source.detail}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07, duration: 0.16, ease: "easeOut" }}
        >
          <header><FileText size={13} /><b>{source.title}</b><small>{source.badge}</small></header>
          <p>{source.detail}</p>
        </motion.article>
      ))}
    </div>
  );
}

/** Tool chips plus retrieved context cards, adapted from Beautiful UI (MIT). */
export function EvidenceRun({ sources }: { sources: MarkGptSource[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="markgpt-evidence-run">
      <button type="button" className="markgpt-evidence-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <FileText size={13} />
        <span>Sources</span>
        <small>{sources.length}</small>
        <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 550, damping: 40 }}
          >
            <SourceCards sources={sources} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
