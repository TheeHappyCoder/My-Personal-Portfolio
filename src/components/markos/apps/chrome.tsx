"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  LockKeyhole,
  MoreVertical,
  Play,
  Plus,
  RefreshCw,
  Search,
  Star,
  X,
} from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { projects } from "@/data/portfolio";
import { WindowsAsset } from "../shared/windows-asset";
import type { PortfolioAppProps } from "./types";

type ChromeTabKind = "new-tab" | "google" | "videos" | "project" | "frame";

type ChromeTab = {
  id: string;
  title: string;
  address: string;
  kind: ChromeTabKind;
  src?: string;
  project?: string;
};

const firstTabs: ChromeTab[] = [
  { id: "home", title: "New Tab", address: "chrome://newtab", kind: "new-tab" },
  { id: "google", title: "Google", address: "https://www.google.com", kind: "google", src: "https://www.google.com?igu=1" },
  { id: "classics", title: "internet-classics.txt", address: "mark://internet-classics", kind: "videos" },
  { id: "novacore", title: "NovaCore — Case Study", address: "mark://work/novacore", kind: "project", project: "novacore" },
];

const internetClassics = [
  { title: "Critical speaker test", note: "A completely normal link. Promise.", id: "dQw4w9WgXcQ", color: "#ef476f" },
  { title: "Nyan Cat deployment monitor", note: "The progress bar never technically stops.", id: "QH2-TGUlwu4", color: "#5b8def" },
  { title: "Badger load test", note: "Validates repetition under production traffic.", id: "EIyixC9NsLI", color: "#78b159" },
];

function ChromeFavicon({ tab }: { tab: ChromeTab }) {
  if (tab.kind === "google") return <span className="google-favicon">G</span>;
  if (tab.kind === "videos") return <span className="youtube-favicon"><Play size={9} fill="currentColor" /></span>;
  if (tab.kind === "project") return <WindowsAsset name="projects" size={15} />;
  if (tab.kind === "frame") return <span className="web-favicon">◉</span>;
  return <WindowsAsset name="chrome" size={15} />;
}

function LazyFrame({ tab, active }: { tab: ChromeTab; active: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const externalUrl = tab.kind === "google" ? "https://www.google.com" : tab.src;

  if (!active) return null;

  return (
    <div className="chrome-frame-wrap">
      {!loaded ? (
        <div className="chrome-frame-loader">
          <WindowsAsset name="chrome" size={52} />
          <span><i /><i /><i /></span>
          <p>Loading only because you opened this tab…</p>
        </div>
      ) : null}
      <iframe
        title={tab.title}
        src={tab.src}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
      <a className="chrome-open-external" href={externalUrl} target="_blank" rel="noreferrer">
        Page not visible? Open in browser <ExternalLink size={13} />
      </a>
    </div>
  );
}

export function ChromeApp({ onOpenApp, onOpenProject }: PortfolioAppProps) {
  const [tabs, setTabs] = useState(firstTabs);
  const [activeId, setActiveId] = useState(firstTabs[0].id);
  const [visited, setVisited] = useState(() => new Set([firstTabs[0].id]));
  const tabSequence = useRef(firstTabs.length);
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const [address, setAddress] = useState(activeTab.address);

  const selectTab = (id: string) => {
    const tab = tabs.find((item) => item.id === id);
    if (!tab) return;
    setVisited((current) => new Set(current).add(id));
    setActiveId(id);
    setAddress(tab.address);
  };

  const closeTab = (id: string) => {
    const index = tabs.findIndex((tab) => tab.id === id);
    const remaining = tabs.filter((tab) => tab.id !== id);
    if (!remaining.length) {
      const newTab: ChromeTab = { id: `new-${tabSequence.current++}`, title: "New Tab", address: "chrome://newtab", kind: "new-tab" };
      setTabs([newTab]);
      setVisited((current) => new Set(current).add(newTab.id));
      setActiveId(newTab.id);
      setAddress(newTab.address);
      return;
    }
    setTabs(remaining);
    if (id === activeId) {
      const nextTab = remaining[Math.max(0, index - 1)];
      setVisited((current) => new Set(current).add(nextTab.id));
      setActiveId(nextTab.id);
      setAddress(nextTab.address);
    }
  };

  const addTab = () => {
    const tab: ChromeTab = { id: `new-${tabSequence.current++}`, title: "New Tab", address: "chrome://newtab", kind: "new-tab" };
    setTabs((current) => [...current, tab]);
    setVisited((current) => new Set(current).add(tab.id));
    setActiveId(tab.id);
    setAddress(tab.address);
  };

  const updateActiveTab = (patch: Partial<ChromeTab>) => {
    setTabs((current) => current.map((tab) => tab.id === activeId ? { ...tab, ...patch } : tab));
    if (patch.address) setAddress(patch.address);
  };

  const navigate = (event: FormEvent) => {
    event.preventDefault();
    const clean = address.trim();
    if (!clean) return;

    if (clean.startsWith("mark://work/")) {
      const slug = clean.replace("mark://work/", "");
      updateActiveTab({ title: `${slug} — Case Study`, address: clean, kind: "project", project: slug, src: undefined });
      return;
    }

    const looksLikeUrl = /^(https?:\/\/|[\w-]+\.[a-z]{2,})/i.test(clean);
    const src = looksLikeUrl
      ? (clean.startsWith("http") ? clean : `https://${clean}`)
      : `https://www.google.com/search?igu=1&q=${encodeURIComponent(clean)}`;
    updateActiveTab({ title: looksLikeUrl ? new URL(src).hostname : `${clean} - Google Search`, address: src, kind: "frame", src });
  };

  const openVideo = (video: typeof internetClassics[number]) => {
    updateActiveTab({
      title: `${video.title} — YouTube`,
      address: `https://www.youtube.com/watch?v=${video.id}`,
      kind: "frame",
      src: `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`,
    });
  };

  const project = projects.find((item) => item.slug === activeTab?.project);

  if (!activeTab) return null;

  return (
    <div className="browser-app chrome-app">
      <div className="chrome-tab-strip">
        {tabs.map((tab) => (
          <div className={`chrome-tab ${tab.id === activeId ? "selected" : ""}`} key={tab.id}>
            <button type="button" className="chrome-tab-select" onClick={() => selectTab(tab.id)}>
              <ChromeFavicon tab={tab} /><span>{tab.title}</span>
            </button>
            <button type="button" className="chrome-tab-close" onClick={() => closeTab(tab.id)} aria-label={`Close ${tab.title}`}><X size={12} /></button>
          </div>
        ))}
        <button className="chrome-new-tab" type="button" onClick={addTab} aria-label="New tab"><Plus size={15} /></button>
      </div>

      <div className="chrome-toolbar">
        <button type="button" aria-label="Back"><ArrowLeft size={16} /></button>
        <button type="button" aria-label="Forward"><ArrowRight size={16} /></button>
        <button type="button" aria-label="Reload"><RefreshCw size={15} /></button>
        <form onSubmit={navigate} className="chrome-address">
          <LockKeyhole size={13} />
          <input value={address} onChange={(event) => setAddress(event.target.value)} aria-label="Address and search bar" />
          <button type="button" aria-label="Bookmark this tab"><Star size={14} /></button>
        </form>
        <button className="chrome-profile" type="button" aria-label="Chrome profile">M</button>
        <button type="button" aria-label="Chrome menu"><MoreVertical size={17} /></button>
      </div>

      <div className="chrome-bookmarks">
        <button type="button" onClick={() => onOpenApp("explorer")}><WindowsAsset name="projects" size={14} /> Mark&apos;s work</button>
        <button type="button" onClick={() => onOpenApp("resume")}><WindowsAsset name="file" size={14} /> CV.pdf</button>
        <a href="https://github.com/programming-with-ia/windows-11" target="_blank" rel="noreferrer"><WindowsAsset name="github" size={14} /> Clone inspiration</a>
        <button type="button" onClick={() => selectTab("classics")}><Play size={13} /> Break glass if bored</button>
      </div>

      <div className="chrome-viewport">
        {activeTab.kind === "new-tab" ? (
          <div className="chrome-new-tab-page">
            <div className="chrome-wordmark"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></div>
            <form onSubmit={navigate}><Search size={19} /><input value={address === "chrome://newtab" ? "" : address} onChange={(event) => setAddress(event.target.value)} placeholder="Search Google or type a URL" /><span>⌕</span></form>
            <div className="chrome-shortcuts">
              <button type="button" onClick={() => onOpenApp("explorer")}><span><WindowsAsset name="projects" size={26} /></span><b>My work</b></button>
              <button type="button" onClick={() => onOpenApp("chat")}><span className="markgpt-shortcut">M</span><b>Ask MarkGPT</b></button>
              <button type="button" onClick={() => onOpenApp("photos")}><span><WindowsAsset name="pictures" size={28} /></span><b>Photos</b></button>
              <button type="button" onClick={() => selectTab("classics")}><span className="youtube-shortcut"><Play size={18} fill="currentColor" /></span><b>YouTube</b></button>
            </div>
            <p className="chrome-lazy-note"><span /> {tabs.length - 1} background tabs sleeping. They load only when opened.</p>
          </div>
        ) : null}

        {activeTab.kind === "videos" ? (
          <div className="chrome-video-page">
            <header><span><Play size={17} fill="currentColor" /></span><div><small>Recovered bookmarks</small><h2>Internet classics</h2><p>Three tabs Mark calls “cross-browser testing.”</p></div></header>
            <div>
              {internetClassics.map((video) => (
                <button type="button" key={video.id} onClick={() => openVideo(video)}>
                  <span className="classic-video-thumb" style={{ background: video.color }}><Play size={23} fill="currentColor" /></span>
                  <span><b>{video.title}</b><small>{video.note}</small></span>
                  <Play size={16} />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab.kind === "project" && project ? (
          <div className="chrome-project-page">
            <div className="chrome-project-cover"><Image src={project.cover} alt={`${project.title} interface`} fill sizes="900px" /></div>
            <div><span>{project.status}</span><h2>{project.title}</h2><p>{project.summary}</p><button type="button" onClick={() => onOpenProject(project.slug)}>Open full case study <ExternalLink size={14} /></button></div>
          </div>
        ) : null}

        {(activeTab.kind === "google" || activeTab.kind === "frame") && visited.has(activeTab.id) ? <LazyFrame key={`${activeTab.id}-${activeTab.src}`} tab={activeTab} active /> : null}
      </div>
    </div>
  );
}
