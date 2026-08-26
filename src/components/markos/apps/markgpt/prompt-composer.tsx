"use client";

import {
  ArrowUp,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  FileText,
  FolderKanban,
  Mic,
  Plus,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type PromptComposerProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
};

type SourceOption = {
  label: string;
  detail: string;
  icon: LucideIcon;
};

const sourceOptions: SourceOption[] = [
  { label: "Projects", detail: "7 shipped case studies", icon: FolderKanban },
  { label: "Experience", detail: "Roles and responsibilities", icon: BriefcaseBusiness },
  { label: "Resume", detail: "One-page career summary", icon: FileText },
  { label: "About Mark", detail: "Working style and background", icon: UserRound },
];

const modes = [
  { name: "Portfolio index", detail: "Balanced answers" },
  { name: "Recruiter brief", detail: "Short and direct" },
  { name: "Technical detail", detail: "Architecture first" },
];

/** Composer, context menu, model picker, and dictation adapted from Beautiful UI's Prompt Bar (MIT). */
export function PromptComposer({ value, disabled, onChange, onSend }: PromptComposerProps) {
  const [menu, setMenu] = useState<"sources" | "mode" | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [mode, setMode] = useState(modes[0]);
  const [listening, setListening] = useState(false);
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menu]);

  useEffect(() => {
    if (!listening) return;
    const timer = window.setTimeout(() => {
      onChange("What makes Mark different from other product engineers?");
      setListening(false);
      inputRef.current?.focus();
    }, 1050);
    return () => window.clearTimeout(timer);
  }, [listening, onChange]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "0px";
    input.style.height = `${Math.min(Math.max(input.scrollHeight, 24), 96)}px`;
  }, [value]);

  const toggleSource = (label: string) => {
    setSelectedSources((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
  };

  const send = () => {
    const clean = value.trim();
    if (!clean || disabled) return;
    onSend(clean);
    setSelectedSources([]);
    setMenu(null);
  };

  return (
    <div className="markgpt-composer-wrap">
      <form
        ref={rootRef}
        className="markgpt-composer"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <AnimatePresence>
          {menu === "sources" ? (
            <motion.div
              className="markgpt-composer-menu markgpt-source-menu"
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 550, damping: 38 }}
            >
              <header><b>Add portfolio context</b><small>Answers still stay local.</small></header>
              {sourceOptions.map((source) => {
                const Icon = source.icon;
                const selected = selectedSources.includes(source.label);
                return (
                  <button type="button" key={source.label} onClick={() => toggleSource(source.label)}>
                    <span><Icon size={15} /></span>
                    <span><b>{source.label}</b><small>{source.detail}</small></span>
                    {selected ? <Check size={14} /> : null}
                  </button>
                );
              })}
            </motion.div>
          ) : null}
          {menu === "mode" ? (
            <motion.div
              className="markgpt-composer-menu markgpt-mode-menu"
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 550, damping: 38 }}
            >
              {modes.map((item) => (
                <button type="button" key={item.name} onClick={() => { setMode(item); setMenu(null); }}>
                  <span><b>{item.name}</b><small>{item.detail}</small></span>
                  {mode.name === item.name ? <Check size={14} /> : null}
                </button>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {selectedSources.length > 0 ? (
          <div className="markgpt-selected-sources">
            {selectedSources.map((source) => (
              <span key={source}><FileText size={11} /> {source}<button type="button" onClick={() => toggleSource(source)} aria-label={`Remove ${source}`}><X size={10} /></button></span>
            ))}
          </div>
        ) : null}

        <textarea
          ref={inputRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              send();
            }
            if (event.key === "Escape") setMenu(null);
          }}
          placeholder={listening ? "Listening…" : "Ask about Mark, the work, or technical decisions…"}
          aria-label="Message MarkGPT"
        />

        <footer>
          <div>
            <button type="button" className={menu === "sources" ? "is-active" : ""} onClick={() => setMenu((current) => current === "sources" ? null : "sources")} aria-label="Add portfolio sources" aria-expanded={menu === "sources"}><Plus size={16} /></button>
            <button type="button" className="markgpt-mode-trigger" onClick={() => setMenu((current) => current === "mode" ? null : "mode")} aria-expanded={menu === "mode"}>{mode.name}<ChevronDown size={12} /></button>
          </div>
          <div>
            <button type="button" className={listening ? "is-listening" : ""} onClick={() => setListening((current) => !current)} aria-label={listening ? "Stop dictation" : "Start dictation"} aria-pressed={listening}>
              {listening ? <span className="markgpt-equalizer"><i /><i /><i /></span> : <Mic size={15} />}
            </button>
            <button type="submit" className="markgpt-send" aria-label="Send prompt" disabled={!value.trim() || disabled}><ArrowUp size={16} /></button>
          </div>
        </footer>
      </form>
      <small className="markgpt-composer-note">Portfolio answers only. No cloud account, no invented experience.</small>
    </div>
  );
}
