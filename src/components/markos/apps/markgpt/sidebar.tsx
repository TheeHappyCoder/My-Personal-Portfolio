"use client";

import {
  BriefcaseBusiness,
  ChevronDown,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { GlideMenu } from "./glide-menu";

export type MarkGptRecent = {
  label: string;
  prompt: string;
};

type MarkGptSidebarProps = {
  activeTitle: string | null;
  recents: MarkGptRecent[];
  onNewChat: () => void;
  onPrompt: (prompt: string, label: string) => void;
};

/** Sidebar structure and gliding hover behavior adapted from Beautiful UI (MIT). */
export function MarkGptSidebar({ activeTitle, recents, onNewChat, onPrompt }: MarkGptSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const visibleRecents = useMemo(
    () => recents.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())),
    [query, recents],
  );

  const openSearch = () => {
    if (collapsed) setCollapsed(false);
    setSearchOpen(true);
    window.setTimeout(() => searchRef.current?.focus(), 180);
  };

  return (
    <aside className={`markgpt-sidebar${collapsed ? " is-collapsed" : ""}`} aria-label="MarkGPT navigation">
      <div className="markgpt-sidebar-workspace">
        <span className="markgpt-sidebar-logo">M</span>
        <span className="markgpt-sidebar-copy"><b>Mark</b><small>Portfolio index</small></span>
        <ChevronDown className="markgpt-sidebar-copy" size={14} />
        <button
          type="button"
          className="markgpt-sidebar-collapse"
          onClick={() => {
            setCollapsed((current) => !current);
            setSearchOpen(false);
            setQuery("");
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      <GlideMenu className="markgpt-sidebar-primary">
        <button data-markgpt-row type="button" title="New chat" onClick={onNewChat}>
          <Plus size={17} /><span className="markgpt-sidebar-copy">New chat</span>
        </button>
        <button data-markgpt-row type="button" title="Recruiter brief" onClick={() => onPrompt("What makes Mark different?", "Recruiter brief")}>
          <BriefcaseBusiness size={17} /><span className="markgpt-sidebar-copy">Recruiter brief</span>
        </button>
        <button data-markgpt-row type="button" title="About Mark" onClick={() => onPrompt("What is Mark like to work with?", "About Mark")}>
          <UserRound size={17} /><span className="markgpt-sidebar-copy">About Mark</span>
        </button>
      </GlideMenu>

      <section className="markgpt-sidebar-history">
        <div className="markgpt-sidebar-history-head">
          <span className="markgpt-sidebar-copy">Chats</span>
          <button type="button" onClick={openSearch} aria-label="Search chats"><Search size={15} /></button>
        </div>

        <div className={`markgpt-sidebar-search${searchOpen ? " is-open" : ""}`}>
          <Search size={14} />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSearchOpen(false);
                setQuery("");
              }
            }}
            placeholder="Search chats"
            aria-label="Search chat history"
            tabIndex={searchOpen ? 0 : -1}
          />
          <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="Close chat search"><X size={13} /></button>
        </div>

        <GlideMenu className="markgpt-sidebar-recents">
          {visibleRecents.map((item) => (
            <button
              data-markgpt-row
              type="button"
              key={item.label}
              className={activeTitle === item.label ? "is-active" : ""}
              title={item.label}
              onClick={() => onPrompt(item.prompt, item.label)}
            >
              <MessageSquareText size={15} />
              <span className="markgpt-sidebar-copy">{item.label}</span>
            </button>
          ))}
          {query && visibleRecents.length === 0 ? <p className="markgpt-sidebar-empty markgpt-sidebar-copy">No chats found</p> : null}
        </GlideMenu>
      </section>

      <div className="markgpt-sidebar-profile">
        <span>MS</span>
        <div className="markgpt-sidebar-copy"><b>Mark Steyn</b><small><i /> Available for the right role</small></div>
      </div>
    </aside>
  );
}
