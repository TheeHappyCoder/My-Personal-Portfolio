"use client";

import {
  BriefcaseBusiness,
  FileText,
  Mail,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { PortfolioAppProps } from "./types";
import { PromptComposer } from "./markgpt/prompt-composer";
import {
  EvidenceRun,
  StreamingAnswer,
} from "./markgpt/response-details";
import { MarkGptSidebar, type MarkGptRecent } from "./markgpt/sidebar";
import { ThinkingTrace } from "./markgpt/thinking-trace";
import type { ChatMessage, PromptIdea } from "./markgpt/types";

type MarkGptChat = MarkGptRecent & {
  messages: ChatMessage[];
};

const emptyMessages: ChatMessage[] = [];

const promptIdeas: PromptIdea[] = [
  { label: "The short version", question: "What does Mark actually build?", icon: "work" },
  { label: "Start here", question: "Show me Mark's best project", icon: "story" },
  { label: "Team fit", question: "What is Mark like to work with?", icon: "fit" },
  { label: "Useful edge", question: "What makes Mark different?", icon: "story" },
  { label: "Origin story", question: "Why building automation?", icon: "work" },
  { label: "Say hello", question: "How do I contact Mark?", icon: "contact" },
];

function answerPrompt(prompt: string): Omit<ChatMessage, "role"> {
  const lower = prompt.toLowerCase();

  if (lower.includes("best project") || lower.includes("novacore")) {
    return {
      topic: "novacore",
      text: "Start with NovaCore. Mark designed the local automation platform, protocol-neutral engineering model, graphics runtime, deterministic control engine, operations suite, security layer, and NovaCloud control plane. It is the clearest overlap of product architecture, TypeScript engineering, and hands-on systems integration.",
      action: { label: "Open NovaCore case study", project: "novacore" },
      sources: [
        { title: "NovaCore case study", detail: "Two apps, seven data sources, and a P1–P16 command model.", badge: "PROJECT" },
        { title: "Product scope", detail: "Local-first operations with an optional cloud control plane.", badge: "SCOPE" },
      ],
      followUps: ["What problem does NovaCore solve?", "What did Mark own on NovaCore?"],
    };
  }

  if (lower.includes("actually build") || lower.includes("what does mark build") || lower.includes("kind of work")) {
    return {
      topic: "work",
      text: "Mark builds the layer between complicated systems and the people who use them: automation platforms, operational tools, focused client applications, and high-craft websites that make hardware, software, data, and business goals behave like one product.",
      action: { label: "Browse selected work", app: "explorer" },
      sources: [
        { title: "Selected work", detail: "Seven shipped products, platforms, experiments, and client systems.", badge: "INDEX" },
        { title: "Technical profile", detail: "React, TypeScript, real-time systems, edge protocols, and product design.", badge: "SKILLS" },
      ],
      followUps: ["Show me Mark's best project", "What makes Mark different?"],
    };
  }

  if (lower.includes("work with") || lower.includes("team") || lower.includes("colleague")) {
    return {
      topic: "team",
      text: "Practical, curious, and attentive to the last 10%. Mark asks enough questions to understand the real problem, communicates trade-offs plainly, and prefers leaving both the interface and the underlying system easier for the next person to reason about.",
      action: { label: "See experience", app: "about" },
      sources: [
        { title: "About Mark", detail: "Product-minded engineer with hands-on systems integration experience.", badge: "PROFILE" },
        { title: "Working style", detail: "Clear trade-offs, fewer hand-offs, and strong ownership through delivery.", badge: "FIT" },
      ],
      followUps: ["What makes Mark different?", "What does Mark actually build?"],
    };
  }

  if (lower.includes("different") || lower.includes("why him") || lower.includes("hire") || lower.includes("product engineer")) {
    return {
      topic: "difference",
      text: "His useful edge is range with continuity. He can discuss BACnet points and network topology, model the data, build the React interface, and still care whether the empty state feels human. Fewer hand-offs means more context survives from problem to product.",
      action: { label: "Inspect the skill set", app: "skills" },
      sources: [
        { title: "Systems depth", detail: "Building automation, field protocols, edge services, and secure remote access.", badge: "SYSTEMS" },
        { title: "Product craft", detail: "Architecture, frontend engineering, interaction design, and delivery.", badge: "CRAFT" },
      ],
      followUps: ["Show me Mark's best project", "What is Mark like to work with?"],
    };
  }

  if (lower.includes("building automation") || lower.includes("bacnet") || lower.includes("origin")) {
    return {
      topic: "automation",
      text: "Buildings are giant physical computers with decades of protocols, sensors, edge cases, and real consequences. Mark likes that the work is deeply technical and immediately tangible: when the software gets better, a real place becomes easier to operate.",
      action: { label: "Open About Mark", app: "about" },
      sources: [
        { title: "Domain experience", detail: "BMS integration across BACnet, Modbus, KNX, MQTT, M-Bus, and HTTP.", badge: "BMS" },
        { title: "NovaCore", detail: "A product response to protocol-first building software.", badge: "PROJECT" },
      ],
      followUps: ["What problem does NovaCore solve?", "What does Mark actually build?"],
    };
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("hello")) {
    return {
      topic: "contact",
      text: "Email marksteyn1001@gmail.com, or open Contact for LinkedIn and a copy button. A clear problem, a strange idea, or a strong role are all valid opening messages.",
      action: { label: "Open Contact", app: "contact" },
      sources: [
        { title: "Contact details", detail: "Pretoria, South Africa · available for good ideas.", badge: "CONTACT" },
      ],
      followUps: ["What is Mark like to work with?", "Show me Mark's best project"],
    };
  }

  if (lower.includes("debug") || lower.includes("ritual")) {
    return {
      topic: "notes",
      text: "Mark starts by reproducing the bug, reducing it to the smallest failing case, checking the logs, and changing one thing at a time.",
      action: { label: "Open notes", app: "notepad" },
      sources: [{ title: "work.txt", detail: "Short reminders kept beside active work.", badge: "TXT" }],
      followUps: ["What does Mark actually build?", "How do I contact Mark?"],
    };
  }

  if (lower.includes("cv") || lower.includes("resume")) {
    return {
      topic: "resume",
      text: "The one-page resume covers Mark's systems-integration work, product development, education, and technical toolkit. The case studies add the detail a PDF cannot.",
      action: { label: "Open Mark-Steyn-CV.pdf", app: "resume" },
      sources: [
        { title: "Mark-Steyn-CV.pdf", detail: "Career summary, education, responsibilities, and technical toolkit.", badge: "PDF" },
        { title: "Selected work", detail: "Detailed product evidence behind the resume claims.", badge: "INDEX" },
      ],
      followUps: ["What makes Mark different?", "Show me Mark's best project"],
    };
  }

  return {
    topic: "general",
    text: "I only use the useful Mark lore stored in this portfolio. Ask what he builds, what makes him different, which project to open first, or what his debugging ritual looks like.",
    sources: [{ title: "Portfolio index", detail: "No matching section found; try one of the focused follow-ups.", badge: "LOCAL" }],
    followUps: ["What does Mark actually build?", "Show me Mark's best project"],
  };
}

function PromptIcon({ name }: { name: PromptIdea["icon"] }) {
  if (name === "contact") return <Mail size={15} />;
  if (name === "fit") return <UserRound size={15} />;
  if (name === "story") return <FileText size={15} />;
  return <BriefcaseBusiness size={15} />;
}

function PromptSearch({ onPrompt }: { onPrompt: (prompt: string, label?: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = promptIdeas.filter((prompt) => `${prompt.label} ${prompt.question}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="markgpt-prompt-search" aria-label="Suggested questions">
      <div className="markgpt-prompt-search-field">
        <Search size={15} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search useful questions…" aria-label="Search suggested questions" />
        {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear question search"><X size={13} /></button> : null}
      </div>
      {filtered.length ? (
        <div className="markgpt-prompt-grid">
          {filtered.map((prompt) => (
            <button type="button" key={prompt.question} onClick={() => onPrompt(prompt.question, prompt.label)}>
              <span><PromptIcon name={prompt.icon} /></span>
              <span><small>{prompt.label}</small><b>{prompt.question}</b></span>
            </button>
          ))}
        </div>
      ) : (
        <div className="markgpt-prompt-empty"><Search size={16} /><b>No question found.</b><span>Clear search to see every option.</span></div>
      )}
    </section>
  );
}

export function MarkGptApp({ onOpenApp, onOpenProject }: PortfolioAppProps) {
  const [chats, setChats] = useState<MarkGptChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [pendingChatId, setPendingChatId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const latestAnswerRef = useRef<HTMLElement>(null);
  const responseTimerRef = useRef<number | null>(null);
  const nextChatIdRef = useRef(1);

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;
  const messages = activeChat?.messages ?? emptyMessages;
  const activeTitle = activeChat?.label ?? null;
  const typing = pendingChatId !== null;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const latest = messages.at(-1);
      if (latest?.role === "assistant") latestAnswerRef.current?.scrollIntoView({ block: "start" });
      else endRef.current?.scrollIntoView({ block: "end" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, typing]);

  useEffect(() => () => {
    if (responseTimerRef.current !== null) window.clearTimeout(responseTimerRef.current);
  }, []);

  const send = (prompt: string, label?: string) => {
    const clean = prompt.trim();
    if (!clean || typing) return;

    const chatId = activeChatId ?? `markgpt-chat-${nextChatIdRef.current++}`;
    const title = label ?? (clean.length > 31 ? `${clean.slice(0, 31)}…` : clean);
    const userMessage: ChatMessage = { role: "user", text: clean };

    if (activeChatId) {
      setChats((current) => current.map((chat) => chat.id === chatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat));
    } else {
      setChats((current) => [{ id: chatId, label: title, messages: [userMessage] }, ...current]);
      setActiveChatId(chatId);
    }

    setPendingChatId(chatId);
    const responseDelay = 1500;
    responseTimerRef.current = window.setTimeout(() => {
      const assistantMessage: ChatMessage = { role: "assistant", ...answerPrompt(clean) };
      setChats((current) => current.map((chat) => chat.id === chatId
        ? { ...chat, messages: [...chat.messages, assistantMessage] }
        : chat));
      setPendingChatId(null);
      responseTimerRef.current = null;
    }, responseDelay);
  };

  const newChat = () => {
    if (responseTimerRef.current !== null) window.clearTimeout(responseTimerRef.current);
    responseTimerRef.current = null;
    setPendingChatId(null);
    setActiveChatId(null);
  };

  const runAction = (message: ChatMessage) => {
    if (message.action?.project) onOpenProject(message.action.project);
    if (message.action?.app) onOpenApp(message.action.app);
  };

  return (
    <div className="markgpt-app">
      <MarkGptSidebar
        activeId={activeChatId}
        recents={chats}
        onNewChat={newChat}
        onPrompt={send}
        onSelectChat={setActiveChatId}
      />

      <main className="markgpt-main">
        <header className="markgpt-header">
          <div><span className="markgpt-header-logo">M</span><span><b>MarkGPT</b><small>{activeTitle ?? "New conversation"}</small></span></div>
          <span className="markgpt-local-status"><i /> Local portfolio index <ShieldCheck size={13} /></span>
        </header>

        <div className="markgpt-conversation" aria-live="polite">
          {messages.length === 0 ? (
            <motion.div className="markgpt-home" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.18, ease: "easeOut" }}>
              <div className="markgpt-chat-start">
                <span className="markgpt-header-logo">M</span>
                <h2>What would you like to know?</h2>
                <p>Choose a question to start a chat.</p>
              </div>
              <PromptSearch onPrompt={send} />
            </motion.div>
          ) : (
            <div className="markgpt-thread">
              {messages.map((message, index) => message.role === "user" ? (
                <motion.div
                  className="markgpt-user-message"
                  key={`user-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <span>{message.text}</span>
                </motion.div>
              ) : (
                <motion.article
                  className="markgpt-assistant-message"
                  key={`assistant-${index}`}
                  ref={index === messages.length - 1 ? latestAnswerRef : undefined}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <span className="markgpt-answer-avatar">M</span>
                  <div>
                    <header><b>MarkGPT</b><small>Portfolio answer</small></header>
                    <section className="markgpt-answer-shell">
                      <header><span>Answer</span><small>Grounded in portfolio content</small></header>
                      <div className="markgpt-answer-body">
                        <StreamingAnswer text={message.text} />
                        {message.action ? <button type="button" className="markgpt-answer-action" onClick={() => runAction(message)}>{message.action.label}</button> : null}
                      </div>
                    </section>
                    {message.sources?.length ? <EvidenceRun sources={message.sources} /> : null}
                    {message.followUps?.length ? (
                      <div className="markgpt-followups">
                        <span>Follow-ups</span>
                        <div>{message.followUps.map((prompt) => <button type="button" key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div>
                      </div>
                    ) : null}
                  </div>
                </motion.article>
              ))}

              <AnimatePresence>
                {pendingChatId === activeChatId ? (
                  <motion.div className="markgpt-assistant-message" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                    <span className="markgpt-answer-avatar">M</span>
                    <ThinkingTrace />
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <div ref={endRef} />
            </div>
          )}
        </div>

        {messages.length > 0 ? <PromptComposer options={promptIdeas} disabled={typing} onSelect={send} /> : null}
      </main>
    </div>
  );
}
