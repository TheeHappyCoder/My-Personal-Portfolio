"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ChevronRight,
  CirclePower,
  Gamepad2,
  Info,
  Laptop,
  Moon,
  MoreHorizontal,
  Network,
  Palette,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Volume2,
  Wifi,
  X,
} from "lucide-react";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import profilePhoto from "@/assets/profile/profile.jpg";
import { getPortfolioProject, profile, projects } from "@/data/portfolio";
import { AppContent, AppId } from "./apps";
import {
  APPEARANCE_STORAGE_KEY,
  type AppearancePreferences,
  defaultAppearancePreferences,
  readAppearancePreferences,
  writeAppearancePreferences,
} from "./appearance";
import { WindowFrame, WindowPosition, WindowSize } from "./window-frame";
import { WindowsAsset, WindowsIconName } from "./shared/windows-asset";

type WindowModel = {
  id: string;
  app: AppId;
  payload?: string;
  title: string;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
};

type AppMeta = {
  title: string;
  size: WindowSize;
  position: WindowPosition;
};

const APP_META: Record<AppId, AppMeta> = {
  welcome: { title: "Welcome to MarkOS", size: { width: 920, height: 632 }, position: { x: 150, y: 18 } },
  explorer: { title: "My work — Showcase", size: { width: 1120, height: 680 }, position: { x: 70, y: 24 } },
  about: { title: "About Mark", size: { width: 930, height: 650 }, position: { x: 180, y: 50 } },
  settings: { title: "Settings", size: { width: 980, height: 660 }, position: { x: 154, y: 38 } },
  skills: { title: "Skills - Settings", size: { width: 940, height: 640 }, position: { x: 170, y: 45 } },
  photos: { title: "Photos", size: { width: 930, height: 640 }, position: { x: 145, y: 48 } },
  arcade: { title: "MarkOS Arcade", size: { width: 930, height: 650 }, position: { x: 160, y: 42 } },
  notepad: { title: "reminders.txt - Notepad", size: { width: 820, height: 590 }, position: { x: 230, y: 72 } },
  browser: { title: "Google Chrome", size: { width: 1080, height: 680 }, position: { x: 84, y: 24 } },
  chat: { title: "MarkGPT", size: { width: 900, height: 620 }, position: { x: 190, y: 55 } },
  terminal: { title: "mark@portfolio:~ — Windows Terminal", size: { width: 860, height: 550 }, position: { x: 220, y: 84 } },
  contact: { title: "Contact Mark", size: { width: 820, height: 570 }, position: { x: 230, y: 72 } },
  resume: { title: "Mark-Steyn-CV.pdf", size: { width: 850, height: 660 }, position: { x: 210, y: 36 } },
  project: { title: "Project showcase", size: { width: 1160, height: 690 }, position: { x: 50, y: 18 } },
};

const initialWindow: WindowModel = {
  id: "welcome",
  app: "welcome",
  title: APP_META.welcome.title,
  position: APP_META.welcome.position,
  size: APP_META.welcome.size,
  zIndex: 10,
  minimized: false,
  maximized: false,
};

const desktopShortcuts: Array<{ label: string; app: AppId; payload?: string; icon: WindowsIconName | "arcade"; shortcut?: boolean }> = [
  { label: "My work", app: "explorer", icon: "projects" },
  { label: "About Mark", app: "about", icon: "user" },
  { label: "Settings", app: "settings", icon: "settings" },
  { label: "Skills", app: "skills", icon: "tools" },
  { label: "Photos", app: "photos", icon: "pictures" },
  { label: "Arcade", app: "arcade", icon: "arcade" },
  { label: "Resume.pdf", app: "resume", icon: "file" },
  { label: "Google Chrome", app: "browser", icon: "chrome", shortcut: true },
  { label: "Notepad", app: "notepad", icon: "notepad", shortcut: true },
  { label: "Contact.url", app: "contact", icon: "network", shortcut: true },
];

const pinnedApps: AppId[] = ["explorer", "browser", "chat", "arcade", "notepad", "terminal"];

function WindowsLogo({ size = 18 }: { size?: number }) {
  return <WindowsAsset name="windowsStart" size={size} />;
}

function AppGlyph({ app, size = 18 }: { app: AppId; size?: number }) {
  const icons: Partial<Record<AppId, WindowsIconName>> = {
    welcome: "windowsStart",
    explorer: "explorer",
    about: "user",
    settings: "settings",
    skills: "settings",
    photos: "pictures",
    notepad: "notepad",
    browser: "chrome",
    contact: "network",
    resume: "file",
    project: "projects",
  };
  if (app === "chat") return <span className="markgpt-glyph" style={{ width: size, height: size, fontSize: Math.max(10, size * 0.55) }}>M</span>;
  if (app === "arcade") return <span className="arcade-glyph" style={{ width: size, height: size }}><Gamepad2 size={Math.max(12, size * 0.68)} /></span>;
  if (app === "terminal") return <span className="terminal-glyph" style={{ width: size, height: size, fontSize: Math.max(8, size * 0.42) }}>&gt;_</span>;
  return <span className={`app-glyph glyph-${app}`}><WindowsAsset name={icons[app] ?? "file"} size={size} /></span>;
}

export function PortfolioDesktop() {
  const [windows, setWindows] = useState<WindowModel[]>([initialWindow]);
  const [topZ, setTopZ] = useState(10);
  const [selectedShortcut, setSelectedShortcut] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [appearance, setAppearance] = useState<AppearancePreferences>(readAppearancePreferences);
  const [systemDark, setSystemDark] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [locked, setLocked] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => setSystemDark(media.matches);
    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, []);

  useEffect(() => {
    writeAppearancePreferences(appearance);
  }, [appearance]);

  useEffect(() => {
    const syncStoredAppearance = (event: StorageEvent) => {
      if (event.key === APPEARANCE_STORAGE_KEY) setAppearance(readAppearancePreferences());
    };
    window.addEventListener("storage", syncStoredAppearance);
    return () => window.removeEventListener("storage", syncStoredAppearance);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setStartOpen(true);
        setQuickOpen(false);
        window.setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (event.key === "Escape") {
        setStartOpen(false);
        setQuickOpen(false);
        setContextMenu(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const focusWindow = (id: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows((items) => items.map((item) => item.id === id ? { ...item, zIndex: nextZ, minimized: false } : item));
  };

  const openApp = (app: AppId, payload?: string) => {
    const id = app === "project" && payload ? `project:${payload}` : app;
    const existing = windows.find((item) => item.id === id);
    setStartOpen(false);
    setQuickOpen(false);
    setContextMenu(null);

    if (existing) {
      focusWindow(id);
      return;
    }

    const nextZ = topZ + 1;
    const meta = APP_META[app];
    const project = app === "project" && payload ? getPortfolioProject(payload) : undefined;
    const offset = windows.length * 14;
    setTopZ(nextZ);
    setWindows((items) => [
      ...items,
      {
        id,
        app,
        payload,
        title: project ? `${project.title} - Portfolio` : meta.title,
        position: { x: meta.position.x + (offset % 70), y: meta.position.y + (offset % 45) },
        size: meta.size,
        zIndex: nextZ,
        minimized: false,
        maximized: false,
      },
    ]);
  };

  const openProject = (slug: string) => openApp("project", slug);

  const closeWindow = (id: string) => setWindows((items) => items.filter((item) => item.id !== id));
  const minimizeWindow = (id: string) => setWindows((items) => items.map((item) => item.id === id ? { ...item, minimized: true } : item));
  const toggleMaximize = (id: string) => setWindows((items) => items.map((item) => item.id === id ? { ...item, maximized: !item.maximized } : item));
  const moveWindow = (id: string, position: WindowPosition) => setWindows((items) => items.map((item) => item.id === id ? { ...item, position } : item));

  const topVisibleZ = Math.max(0, ...windows.filter((item) => !item.minimized).map((item) => item.zIndex));
  const runningApps = new Set(windows.map((item) => item.app));

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    const appResults = Object.entries(APP_META)
      .filter(([app, meta]) => app !== "project" && (app.includes(query) || meta.title.toLowerCase().includes(query)))
      .map(([app, meta]) => ({ type: "app" as const, id: app, title: meta.title, subtitle: "App" }));
    const projectResults = projects
      .filter((project) => `${project.title} ${project.eyebrow} ${project.tech.join(" ")}`.toLowerCase().includes(query))
      .map((project) => ({ type: "project" as const, id: project.slug, title: project.title, subtitle: project.eyebrow }));
    return [...appResults, ...projectResults].slice(0, 8);
  }, [search]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const updateAppearance = (patch: Partial<AppearancePreferences>) => {
    setAppearance((current) => ({ ...current, ...patch }));
  };

  const resetAppearance = () => {
    setAppearance({ ...defaultAppearancePreferences });
    showToast("Appearance reset to defaults.");
  };

  const isDark = appearance.theme === "dark" || (appearance.theme === "system" && systemDark);
  const toggleDarkMode = () => updateAppearance({ theme: isDark ? "light" : "dark" });

  const activateShortcut = (label: string, app: AppId, payload?: string) => {
    setSelectedShortcut(label);
    openApp(app, payload);
  };

  const handleShortcutKey = (event: KeyboardEvent<HTMLButtonElement>, label: string, app: AppId, payload?: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateShortcut(label, app, payload);
    }
  };

  const timeText = now?.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false }) ?? "--:--";
  const dateText = now?.toLocaleDateString("en-ZA", { day: "2-digit", month: "2-digit", year: "numeric" }) ?? "--/--/----";
  const longDate = now?.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" }) ?? "Welcome";

  return (
    <MotionConfig reducedMotion={appearance.reduceMotion ? "always" : "user"}>
      <div
        id="markos-desktop"
        className="markos-desktop"
        data-theme={isDark ? "dark" : "light"}
        data-theme-mode={appearance.theme}
        data-font={appearance.font}
        data-text-size={appearance.textSize}
        data-wallpaper={appearance.wallpaper}
        data-accent={appearance.accent}
        data-transparency={appearance.transparency ? "on" : "off"}
        data-motion={appearance.reduceMotion ? "reduced" : "full"}
        suppressHydrationWarning
        onClick={() => { setSelectedShortcut(null); setContextMenu(null); }}
        onContextMenu={(event) => {
          if ((event.target as HTMLElement).closest(".app-window, .taskbar, .start-menu, .quick-panel")) return;
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY });
        }}
      >
      <div className="wallpaper" aria-hidden="true"><span className="wallpaper-ribbon one" /><span className="wallpaper-ribbon two" /><span className="wallpaper-ribbon three" /><span className="wallpaper-glow" /></div>

      <main className="desktop-area" aria-label="MarkOS desktop">
        <div className="desktop-icons" role="group" aria-label="Desktop shortcuts">
          {desktopShortcuts.map((shortcut) => (
            <button
              type="button"
              className={`desktop-shortcut ${selectedShortcut === shortcut.label ? "selected" : ""}`}
              key={shortcut.label}
              onClick={(event) => { event.stopPropagation(); setSelectedShortcut(shortcut.label); }}
              onDoubleClick={() => activateShortcut(shortcut.label, shortcut.app, shortcut.payload)}
              onKeyDown={(event) => handleShortcutKey(event, shortcut.label, shortcut.app, shortcut.payload)}
            >
              <span className="desktop-icon">{shortcut.icon === "arcade" ? <AppGlyph app="arcade" size={48} /> : <WindowsAsset name={shortcut.icon} size={48} shortcut={shortcut.shortcut} priority />}</span>
              <span>{shortcut.label}</span>
            </button>
          ))}
        </div>

        <aside className="desktop-tip-card">
          <div className="tip-card-user"><Image src={profilePhoto} alt="" fill sizes="44px" /></div>
          <div><span>Welcome to MarkOS.</span><p>Double-click a shortcut, or press <kbd>Ctrl</kbd> + <kbd>K</kbd>.</p></div>
          <button type="button" onClick={() => openApp("terminal")} aria-label="Open Terminal"><ChevronRight size={16} /></button>
        </aside>

        <AnimatePresence>
          {windows.filter((item) => !item.minimized).map((item) => (
            <WindowFrame
              key={item.id}
              windowId={item.id}
              title={item.title}
              icon={<AppGlyph app={item.app} size={15} />}
              position={item.position}
              size={item.size}
              zIndex={item.zIndex}
              active={item.zIndex === topVisibleZ}
              maximized={item.maximized}
              onFocus={() => focusWindow(item.id)}
              onMove={(position) => moveWindow(item.id, position)}
              onMinimize={() => minimizeWindow(item.id)}
              onMaximize={() => toggleMaximize(item.id)}
              onClose={() => closeWindow(item.id)}
            >
              <AppContent app={item.app} payload={item.payload} onOpenApp={openApp} onOpenProject={openProject} appearance={appearance} onAppearanceChange={updateAppearance} onResetAppearance={resetAppearance} />
            </WindowFrame>
          ))}
        </AnimatePresence>
      </main>

      <nav className="taskbar" aria-label="Taskbar">
        <div className="taskbar-center">
          <button type="button" className={`taskbar-button start-button ${startOpen ? "active" : ""}`} onClick={(event) => { event.stopPropagation(); setStartOpen((value) => !value); setQuickOpen(false); }} aria-label="Start"><WindowsLogo size={21} /></button>
          <button type="button" className="taskbar-button search-button" onClick={(event) => { event.stopPropagation(); setStartOpen(true); setQuickOpen(false); window.setTimeout(() => searchRef.current?.focus(), 50); }} aria-label="Search"><Search size={20} /></button>
          {pinnedApps.map((app) => {
            const activeWindow = windows.filter((item) => item.app === app).sort((a, b) => b.zIndex - a.zIndex)[0];
            return (
              <button type="button" key={app} className={`taskbar-button pinned ${runningApps.has(app) ? "running" : ""} ${activeWindow?.zIndex === topVisibleZ && !activeWindow.minimized ? "active" : ""}`} onClick={(event) => { event.stopPropagation(); if (activeWindow && !activeWindow.minimized && activeWindow.zIndex === topVisibleZ) minimizeWindow(activeWindow.id); else openApp(app); }} aria-label={APP_META[app].title} title={APP_META[app].title}>
                <AppGlyph app={app} size={21} />
              </button>
            );
          })}
          {windows.filter((item) => item.app === "project").slice(-2).map((item) => (
            <button type="button" key={item.id} className={`taskbar-button pinned running ${item.zIndex === topVisibleZ && !item.minimized ? "active" : ""}`} onClick={(event) => { event.stopPropagation(); focusWindow(item.id); }} title={item.title} aria-label={item.title}><AppGlyph app="project" size={21} /></button>
          ))}
        </div>

        <button className="system-tray" type="button" onClick={(event) => { event.stopPropagation(); setQuickOpen((value) => !value); setStartOpen(false); }} aria-label="Quick settings and clock">
          <span className="tray-icons"><Wifi size={14} /><Volume2 size={14} /><Laptop size={14} /></span>
          <span className="tray-clock"><b>{timeText}</b><small>{dateText}</small></span>
        </button>
      </nav>

      <AnimatePresence>
        {startOpen && (
          <motion.div className="start-menu" initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.985, transition: { duration: 0.1 } }} transition={{ type: "spring", stiffness: 550, damping: 38 }} onClick={(event) => event.stopPropagation()}>
            <label className="start-search"><Search size={17} /><input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Type here to search" /></label>

            {search.trim() ? (
              <div className="search-results">
                <div className="start-section-heading"><b>Best match</b><span>{searchResults.length} results</span></div>
                {searchResults.length ? searchResults.map((result) => (
                  <button type="button" key={`${result.type}-${result.id}`} onClick={() => result.type === "project" ? openProject(result.id) : openApp(result.id as AppId)}>
                    {result.type === "project" ? <AppGlyph app="project" size={22} /> : <AppGlyph app={result.id as AppId} size={22} />}
                    <span><b>{result.title}</b><small>{result.subtitle}</small></span><ChevronRight size={15} />
                  </button>
                )) : <div className="no-results"><Search size={26} /><p>No matches. Try “NovaCore”, “skills”, or “contact”.</p></div>}
              </div>
            ) : (
              <>
                <div className="start-section-heading"><b>Pinned</b><button type="button" onClick={() => openApp("explorer")}>All apps <ChevronRight size={13} /></button></div>
                <div className="pinned-grid">
                  {(["explorer", "browser", "about", "settings", "skills", "photos", "arcade", "chat", "notepad", "terminal", "resume", "contact"] as AppId[]).map((app) => (
                    <button type="button" key={app} onClick={() => openApp(app)}><AppGlyph app={app} size={25} /><span>{APP_META[app].title.replace(" - Settings", "").replace("Mark-Steyn-CV.pdf", "Resume")}</span></button>
                  ))}
                </div>
                <div className="start-section-heading recommended-heading"><b>Recommended</b><span>Featured and recent</span></div>
                <div className="recommended-grid">
                  <button type="button" onClick={() => openProject("novacore")}><span className="recommend-preview novacore"><WindowsAsset name="projects" size={25} /></span><span><b>NovaCore</b><small>Flagship project</small></span></button>
                  <button type="button" onClick={() => openApp("resume")}><AppGlyph app="resume" size={23} /><span><b>Mark-Steyn-CV.pdf</b><small>Recently updated</small></span></button>
                </div>
              </>
            )}

            <footer className="start-footer"><button type="button" onClick={() => openApp("about")}><span className="start-avatar"><Image src={profilePhoto} alt="" fill sizes="34px" /></span><b>{profile.name}</b></button><button type="button" onClick={() => { setLocked(true); setStartOpen(false); }} aria-label="Lock MarkOS"><CirclePower size={18} /></button></footer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickOpen && (
          <motion.aside className="quick-panel" initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, transition: { duration: 0.1 } }} transition={{ type: "spring", stiffness: 550, damping: 38 }} onClick={(event) => event.stopPropagation()}>
            <div className="quick-toggle-grid">
              <button type="button" className="on"><Wifi /><span>Wi-Fi</span><ChevronRight /></button>
              <button type="button" className="on"><Network /><span>Network</span></button>
              <button type="button" onClick={toggleDarkMode} className={isDark ? "on" : ""}>{isDark ? <Moon /> : <Sun />}<span>Dark mode</span></button>
              <button type="button" onClick={() => showToast("Focus mode: unnecessary notifications ignored.")}><Sparkles /><span>Focus</span></button>
            </div>
            <label className="quick-slider"><Sun size={15} /><input type="range" aria-label="Brightness" min="20" max="100" defaultValue="86" /></label>
            <label className="quick-slider"><Volume2 size={15} /><input type="range" aria-label="Volume" min="0" max="100" defaultValue="42" /></label>
            <footer><span><b>{timeText}</b><small>{longDate}</small></span><button type="button" onClick={() => openApp("settings")} aria-label="Open Settings"><SlidersHorizontal size={17} /></button></footer>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contextMenu && (
          <motion.div className="desktop-context-menu" style={{ left: contextMenu.x, top: contextMenu.y }} initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ type: "spring", stiffness: 550, damping: 38 }} onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => openApp("explorer")}><WindowsAsset name="projects" size={16} /> Open my work</button>
            <button type="button" onClick={() => { showToast("Desktop refreshed. Curiosity restored."); setContextMenu(null); }}><MoreHorizontal size={16} /> Refresh</button>
            <div />
            <button type="button" onClick={() => openApp("settings")}><Palette size={16} /> Personalize</button>
            <button type="button" onClick={() => { openApp("about"); setContextMenu(null); }}><Info size={16} /> About MarkOS</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <motion.div className="desktop-toast" initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ type: "spring", stiffness: 400, damping: 30 }}><Sparkles size={17} /><span>{toast}</span><button type="button" onClick={() => setToast(null)} aria-label="Dismiss"><X size={14} /></button></motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {locked && (
          <motion.div className="lock-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="lock-wallpaper" aria-hidden="true" />
            <div className="lock-time"><strong>{timeText}</strong><span>{longDate}</span></div>
            <div className="lock-login"><span className="lock-avatar"><Image src={profilePhoto} alt="Mark Steyn" fill sizes="110px" /></span><h2>Mark Steyn</h2><button type="button" onClick={() => setLocked(false)}>Enter portfolio</button><small>No PIN. Recruiter-friendly security policy.</small></div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
