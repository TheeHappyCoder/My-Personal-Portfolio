import type { AppId } from "../types";

export type MessageAction = {
  label: string;
  app?: AppId;
  project?: string;
};

export type AnswerTopic = "work" | "novacore" | "team" | "difference" | "automation" | "contact" | "notes" | "resume" | "general";

export type MarkGptSource = {
  title: string;
  detail: string;
  badge: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  topic?: AnswerTopic;
  action?: MessageAction;
  sources?: MarkGptSource[];
  followUps?: string[];
};

export type PromptIdea = {
  label: string;
  question: string;
  icon: "work" | "story" | "fit" | "contact";
};
