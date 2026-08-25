"use client";

import { ChevronDown, Plus, TerminalSquare } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { experience, profile, projects, skillGroups } from "@/data/portfolio";
import type { AppId, PortfolioAppProps } from "./types";

type TerminalLine = { kind: "command" | "output" | "error" | "system"; text: string };

const prompt = "mark@portfolio:~$";

const tree = `.
├── about.md
├── work/
│   ├── novacore/
│   ├── legal-practice-suite/
│   ├── droplet/
│   └── websites/
├── skills.json
├── experience.log
├── notes/
│   └── .private-do-not-open.txt
└── contact.vcf`;

const appAliases: Record<string, AppId> = {
  about: "about",
  browser: "browser",
  chrome: "browser",
  contact: "contact",
  explorer: "explorer",
  files: "explorer",
  markgpt: "chat",
  chat: "chat",
  notepad: "notepad",
  notes: "notepad",
  photos: "photos",
  resume: "resume",
  skills: "skills",
};

export function TerminalApp({ onOpenApp, onOpenProject }: PortfolioAppProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { kind: "system", text: "Ubuntu 24.04.1 LTS on MarkOS [Version 11.0.2026]" },
    { kind: "system", text: "Type 'help' for commands. Tab completion powered by imagination." },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const addOutput = (command: string, output: string, kind: TerminalLine["kind"] = "output") => {
    setLines((current) => [
      ...current,
      { kind: "command", text: `${prompt} ${command}` },
      ...output.split("\n").map((text) => ({ kind, text })),
    ]);
  };

  const execute = (rawCommand: string) => {
    const clean = rawCommand.trim();
    if (!clean) return;

    setHistory((current) => [...current, clean]);
    setHistoryIndex(-1);
    setValue("");

    const [rawBase, ...rest] = clean.split(/\s+/);
    const base = rawBase.toLowerCase();
    const arg = rest.join(" ").toLowerCase();

    if (base === "clear") {
      setLines([]);
      return;
    }

    if (base === "help") {
      addOutput(clean, [
        "Portfolio commands:",
        "  about / whoami       the human behind the pixels",
        "  ls [work|notes]      list files",
        "  tree                 inspect the tidy file system",
        "  cat <file>           read about.md, skills.json, experience.log",
        "  projects             list case studies",
        "  open <app|project>   launch something",
        "  skills / resume      open recruiter essentials",
        "  contact              print contact details",
        "  history / date       useful shell things",
        "  clear                clean the screen",
      ].join("\n"));
      return;
    }

    if (base === "pwd") {
      addOutput(clean, "/home/mark");
      return;
    }

    if (base === "whoami" || base === "about") {
      addOutput(clean, `${profile.name}\n${profile.title}\n${profile.intro}`);
      return;
    }

    if (base === "tree") {
      addOutput(clean, tree);
      return;
    }

    if (base === "ls") {
      if (arg.includes("work")) addOutput(clean, projects.map((project) => `${project.slug}/`).join("  "));
      else if (arg.includes("notes")) addOutput(clean, "reminders.txt  do-not-open.txt  things-that-took-20-minutes.txt");
      else addOutput(clean, "about.md  work/  skills.json  experience.log  notes/  contact.vcf");
      return;
    }

    if (base === "cat") {
      if (arg.includes("about")) addOutput(clean, `# ${profile.name}\n${profile.intro}\nBased in ${profile.location}.`);
      else if (arg.includes("skills")) addOutput(clean, JSON.stringify(Object.fromEntries(skillGroups.map((group) => [group.title, group.skills])), null, 2));
      else if (arg.includes("experience")) addOutput(clean, experience.map((item) => `${item.period} | ${item.role} @ ${item.company}`).join("\n"));
      else if (arg.includes("contact")) addOutput(clean, `EMAIL=${profile.email}\nLINKEDIN=${profile.linkedin}`);
      else if (arg.includes("private") || arg.includes("do-not-open")) addOutput(clean, "Nice try. Open Notepad like a normal snoop.");
      else addOutput(clean, `cat: ${arg || "missing operand"}: No such file. Try 'ls'.`, "error");
      return;
    }

    if (base === "projects") {
      addOutput(clean, projects.map((project) => `${project.slug.padEnd(31)} ${project.eyebrow}`).join("\n"));
      return;
    }

    if (base === "skills" || base === "resume") {
      onOpenApp(base);
      addOutput(clean, `Opening ${base === "skills" ? "Skills" : "Mark-Steyn-CV.pdf"}...`);
      return;
    }

    if (base === "contact") {
      onOpenApp("contact");
      addOutput(clean, `${profile.email}\n${profile.linkedin}\nOpening Contact...`);
      return;
    }

    if (base === "date") {
      addOutput(clean, new Date().toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "medium" }));
      return;
    }

    if (base === "history") {
      addOutput(clean, [...history, clean].map((item, index) => `${String(index + 1).padStart(3)}  ${item}`).join("\n"));
      return;
    }

    if (base === "open" || base === "start") {
      const alias = appAliases[arg];
      if (alias) {
        onOpenApp(alias);
        addOutput(clean, `Opening ${arg}...`);
        return;
      }
      const project = projects.find((item) => item.slug.includes(arg) || item.title.toLowerCase().includes(arg));
      if (project) {
        onOpenProject(project.slug);
        addOutput(clean, `Opening ${project.title}...`);
      } else {
        addOutput(clean, `Nothing called '${arg || "(blank)"}'. Try 'projects' or 'open about'.`, "error");
      }
      return;
    }

    if (base === "sudo" && arg === "hire mark") {
      addOutput(clean, "[sudo] password for recruiter: ********\nPermission granted. Opening Contact...\nExcellent decision.");
      onOpenApp("contact");
      return;
    }

    if (base === "neofetch") {
      addOutput(clean, `MARK OS       mark@portfolio\n████████      OS: MarkOS 11 Pro\n██  ██  ██    Host: Pretoria, ZA\n████████      Shell: curiosity\n██  ██  ██    Uptime: since 2021\n████████      Packages: React, TS, BACnet`);
      return;
    }

    if (base === "echo") {
      addOutput(clean, rest.join(" "));
      return;
    }

    addOutput(clean, `${rawBase}: command not found. Try 'help'.`, "error");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    execute(value);
  };

  const handleHistory = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (!history.length) return;

    const nextIndex = event.key === "ArrowUp"
      ? Math.min(history.length - 1, historyIndex + 1)
      : Math.max(-1, historyIndex - 1);
    setHistoryIndex(nextIndex);
    setValue(nextIndex === -1 ? "" : history[history.length - 1 - nextIndex]);
  };

  return (
    <div className="terminal-app">
      <div className="terminal-tabs">
        <span><TerminalSquare size={14} /> Ubuntu 24.04</span>
        <button type="button" aria-label="New terminal tab"><Plus size={14} /></button>
        <button type="button" aria-label="Terminal menu"><ChevronDown size={14} /></button>
      </div>
      <div className="terminal-screen" onClick={() => document.getElementById("terminal-command")?.focus()}>
        <div className="terminal-command-hints">
          {['help', 'tree', 'projects', 'open novacore', 'sudo hire mark'].map((command) => <button type="button" key={command} onClick={() => execute(command)}>{command}</button>)}
        </div>
        {lines.map((line, index) => <p className={`terminal-line ${line.kind}`} key={`${line.text}-${index}`}>{line.text || " "}</p>)}
        <form onSubmit={submit}>
          <label htmlFor="terminal-command">{prompt}</label>
          <input id="terminal-command" autoComplete="off" spellCheck={false} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={handleHistory} autoFocus />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
