"use client";

import { AboutApp } from "./about";
import { ArcadeApp } from "./arcade";
import { ChromeApp } from "./chrome";
import { ContactApp } from "./contact";
import { ExplorerApp } from "./explorer";
import { MarkGptApp } from "./markgpt";
import { NotepadApp } from "./notepad";
import { PhotosApp } from "./photos";
import { ProjectApp } from "./project";
import { ResumeApp } from "./resume";
import { SettingsApp } from "./settings";
import { SkillsApp } from "./skills";
import { TerminalApp } from "./terminal";
import type { AppId, OpenApp } from "./types";
import { WelcomeApp } from "./welcome";
import type { AppearancePreferences } from "../appearance";

export type { AppId, OpenApp } from "./types";

type AppContentProps = {
  app: AppId;
  payload?: string;
  onOpenApp: OpenApp;
  onOpenProject: (slug: string) => void;
  appearance: AppearancePreferences;
  onAppearanceChange: (patch: Partial<AppearancePreferences>) => void;
  onResetAppearance: () => void;
};

export function AppContent({ app, payload, onOpenApp, onOpenProject, appearance, onAppearanceChange, onResetAppearance }: AppContentProps) {
  switch (app) {
    case "welcome":
      return <WelcomeApp onOpenApp={onOpenApp} />;
    case "explorer":
      return <ExplorerApp onOpenApp={onOpenApp} onOpenProject={onOpenProject} />;
    case "about":
      return <AboutApp onOpenApp={onOpenApp} />;
    case "settings":
      return <SettingsApp preferences={appearance} onChange={onAppearanceChange} onReset={onResetAppearance} />;
    case "skills":
      return <SkillsApp />;
    case "photos":
      return <PhotosApp />;
    case "arcade":
      return <ArcadeApp />;
    case "notepad":
      return <NotepadApp />;
    case "browser":
      return <ChromeApp onOpenApp={onOpenApp} onOpenProject={onOpenProject} />;
    case "chat":
      return <MarkGptApp onOpenApp={onOpenApp} onOpenProject={onOpenProject} />;
    case "terminal":
      return <TerminalApp onOpenApp={onOpenApp} onOpenProject={onOpenProject} />;
    case "contact":
      return <ContactApp />;
    case "resume":
      return <ResumeApp />;
    case "project":
      return payload
        ? <ProjectApp slug={payload} onOpenApp={onOpenApp} />
        : <ExplorerApp onOpenApp={onOpenApp} onOpenProject={onOpenProject} />;
  }
}
