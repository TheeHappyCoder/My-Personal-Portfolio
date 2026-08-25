export type AppId =
  | "welcome"
  | "explorer"
  | "about"
  | "settings"
  | "skills"
  | "photos"
  | "notepad"
  | "browser"
  | "chat"
  | "terminal"
  | "contact"
  | "resume"
  | "project";

export type OpenApp = (app: AppId, payload?: string) => void;

export type PortfolioAppProps = {
  onOpenApp: OpenApp;
  onOpenProject: (slug: string) => void;
};
