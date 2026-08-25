"use client";

import { Bot, BriefcaseBusiness, FileText, Mail, MoreHorizontal, Send, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { AppId, PortfolioAppProps } from "./types";

type MessageAction = {
  label: string;
  app?: AppId;
  project?: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  action?: MessageAction;
};

type PromptIdea = {
  label: string;
  question: string;
  icon: "work" | "story" | "fit" | "contact";
};

const promptIdeas: PromptIdea[] = [
  { label: "The short version", question: "What does Mark actually build?", icon: "work" },
  { label: "Start here", question: "Show me Mark's best project", icon: "story" },
  { label: "Team fit", question: "What is Mark like to work with?", icon: "fit" },
  { label: "Why him?", question: "What makes Mark different?", icon: "story" },
  { label: "Origin story", question: "Why building automation?", icon: "work" },
  { label: "Say hello", question: "How do I contact Mark?", icon: "contact" },
];

function answerPrompt(prompt: string): Omit<ChatMessage, "role"> {
  const lower = prompt.toLowerCase();

  if (lower.includes("best project") || lower.includes("novacore")) {
    return {
      text: "Start with NovaCore. It is not one dashboard: Mark designed a local automation platform, protocol-neutral engineering model, graphics runtime, control engine, operations suite, security layer, and NovaCloud control plane. It is the clearest overlap of his product architecture, TypeScript work, and hands-on systems-integration experience.",
      action: { label: "Open NovaCore case study", project: "novacore" },
    };
  }

  if (lower.includes("actually build") || lower.includes("what does mark") || lower.includes("work")) {
    return {
      text: "Mark builds the layer between complicated systems and the people who use them: automation platforms, operational tools, focused client applications, and high-craft websites that make hardware, software, data, and business goals behave like one product.",
      action: { label: "Browse selected work", app: "explorer" },
    };
  }

  if (lower.includes("work with") || lower.includes("team") || lower.includes("colleague")) {
    return {
      text: "Practical, curious, and unusually attentive to the last 10%. Mark asks enough questions to understand the real problem, communicates trade-offs plainly, and prefers leaving both the interface and the underlying system easier for the next person to reason about.",
      action: { label: "See experience", app: "about" },
    };
  }

  if (lower.includes("different") || lower.includes("why him") || lower.includes("hire")) {
    return {
      text: "His useful edge is range with continuity. He can discuss BACnet points and network topology, model the data, build the React interface, and still care whether the empty state feels human. Fewer hand-offs; more context survives from problem to product.",
      action: { label: "Inspect the skill set", app: "skills" },
    };
  }

  if (lower.includes("building automation") || lower.includes("bacnet") || lower.includes("origin")) {
    return {
      text: "Buildings are giant physical computers with decades of protocols, sensors, edge cases, and real consequences. Mark likes that the work is both deeply technical and immediately tangible: when the software gets better, a real place becomes easier to operate.",
      action: { label: "Open About Mark", app: "about" },
    };
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("hello")) {
    return {
      text: "Email marksteyn1001@gmail.com, or use the Contact app for LinkedIn and a copy button. A clear problem, a weird idea, or a good role are all valid opening messages.",
      action: { label: "Open Contact", app: "contact" },
    };
  }

  if (lower.includes("debug") || lower.includes("ritual")) {
    return {
      text: "Reproduce it. Reduce it. Question the innocent-looking line. Add one tasteful log. Discover a typo. Remove fourteen less-tasteful logs. Call the commit ‘small cleanup’. This answer was recovered from a Notepad file Mark hoped you would miss.",
      action: { label: "Open the suspicious notes", app: "notepad" },
    };
  }

  if (lower.includes("cv") || lower.includes("resume")) {
    return {
      text: "The one-page version covers Mark's systems-integration work, product development, education, and technical toolkit. The case studies add the detail a PDF cannot.",
      action: { label: "Open Mark-Steyn-CV.pdf", app: "resume" },
    };
  }

  return {
    text: "I only know the useful Mark lore stored on this machine. Try asking what he builds, what makes him different, which project to open first, or what his debugging ritual looks like.",
  };
}

function PromptIcon({ name }: { name: PromptIdea["icon"] }) {
  if (name === "contact") return <Mail size={15} />;
  if (name === "fit") return <Sparkles size={15} />;
  if (name === "story") return <FileText size={15} />;
  return <BriefcaseBusiness size={15} />;
}

export function MarkGptApp({ onOpenApp, onOpenProject }: PortfolioAppProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi. I'm the suspiciously well-informed local assistant on Mark's portfolio. Pick a useful question below, or ask your own.",
    },
  ]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, typing]);

  const send = (prompt: string) => {
    const clean = prompt.trim();
    if (!clean || typing) return;

    setMessages((current) => [...current, { role: "user", text: clean }]);
    setValue("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: "assistant", ...answerPrompt(clean) }]);
      setTyping(false);
    }, 420);
  };

  const runAction = (action: MessageAction) => {
    if (action.project) onOpenProject(action.project);
    if (action.app) onOpenApp(action.app);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    send(value);
  };

  return (
    <div className="chat-app">
      <aside>
        <button type="button" className="new-chat" onClick={() => setMessages(messages.slice(0, 1))}>
          <Sparkles size={16} /> New chat
        </button>
        <p>Suggested</p>
        <button type="button" className="selected" onClick={() => send("What does Mark actually build?")}>Recruiter quick scan</button>
        <button type="button" onClick={() => send("Show me Mark's best project")}>Pick a case study</button>
        <button type="button" onClick={() => send("What is Mark's debugging ritual?")}>Recovered notes</button>
        <div className="chat-user"><span>MS</span><div><b>Mark</b><small>Professional tab collector</small></div></div>
      </aside>

      <main>
        <header><Bot size={18} /><span><b>MarkGPT</b><small>Portfolio knowledge · runs locally</small></span><MoreHorizontal size={18} /></header>
        <div className="chat-messages" aria-live="polite">
          {messages.map((message, index) => (
            <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
              <span>{message.role === "assistant" ? <Bot size={16} /> : "You"}</span>
              <div>
                <p>{message.text}</p>
                {message.action ? <button type="button" className="chat-message-action" onClick={() => runAction(message.action!)}>{message.action.label}</button> : null}
              </div>
            </div>
          ))}
          {typing ? <div className="chat-message assistant typing"><span><Bot size={16} /></span><p><i /><i /><i /></p></div> : null}
          <div ref={endRef} />
        </div>

        {messages.length === 1 ? (
          <div className="prompt-grid">
            {promptIdeas.map((prompt) => (
              <button type="button" key={prompt.question} onClick={() => send(prompt.question)}>
                <PromptIcon name={prompt.icon} />
                <span><small>{prompt.label}</small><b>{prompt.question}</b></span>
              </button>
            ))}
          </div>
        ) : (
          <div className="prompt-chips">
            {promptIdeas.slice(0, 3).map((prompt) => <button type="button" key={prompt.question} onClick={() => send(prompt.question)}>{prompt.question}</button>)}
          </div>
        )}

        <form onSubmit={submit}>
          <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Ask about Mark, his work, or that suspicious Notepad…" aria-label="Message MarkGPT" />
          <button type="submit" aria-label="Send prompt" disabled={!value.trim() || typing}><Send size={17} /></button>
        </form>
        <small className="chat-disclaimer">Answers come from this portfolio, not a mysterious cloud bill.</small>
      </main>
    </div>
  );
}
