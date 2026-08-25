"use client";

import { FileText, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const originalNotes: Record<string, string> = {
  "reminders.txt": `REMINDERS — extremely normal and professional

□ Reply to recruiter while "soon" still means soon.
□ Replace profile photo. This one is fine. Stop overthinking it.
□ Book dentist appointment. "After launch" was three launches ago.
□ Do not begin another side project after 11 p.m.
□ If the demo works first time, DO NOT TOUCH IT.
□ Buy coffee.

Important:
The 1px alignment issue is visible to no one.
Fix it anyway.`,
  "things-that-took-20-minutes.txt": `Things I confidently said would take 20 minutes:

1. "Just wire up the API."
2. "Just one responsive breakpoint."
3. "Just clean up the old building data."
4. "Just make the window draggable."
5. "Just center the Start menu."

Current combined duration: legally classified as a quarter.`,
  "do-not-open.txt": `Okay, since you're here:

- I still google the exact flexbox syntax.
- I practise important introductions in the car.
- I have renamed final-final-v3 twice.
- A green build genuinely improves my mood.
- Sometimes I open DevTools on sites I like just to look around.

Please close this tab before the professional version of me notices.`,
  "interview-cheat-sheet.txt": `INTERVIEW NOTES (not nervous, merely prepared)

Remember:
- Slow down.
- Ask what success looks like after six months.
- Give the short answer before the architecture documentary.
- "It depends" requires an explanation.
- Do not call every interesting problem "fun".
- Their name is at the top of the call. Use it.

Emergency closer:
"What would make someone exceptional in this role?"`,
  ".side-projects-i-am-not-starting.txt": `Projects I am absolutely not starting this weekend:

- Building dashboard for houseplants
- Git blame, but emotionally supportive
- BACnet-powered coffee machine
- Calendar that simply says "no"
- Another portfolio operating system

Update: one of these appears to have escaped containment.`,
};

const storageKey = "markos-private-notes";

export function NotepadApp() {
  const [notes, setNotes] = useState(originalNotes);
  const [activeTitle, setActiveTitle] = useState(Object.keys(originalNotes)[0]);
  const [menu, setMenu] = useState<"file" | "edit" | "view" | null>(null);
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const titles = useMemo(() => Object.keys(notes), [notes]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Record<string, string>;
      if (Object.keys(parsed).length) window.queueMicrotask(() => setNotes(parsed));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes]);

  const updateCursor = () => {
    const element = textAreaRef.current;
    if (!element) return;
    const beforeCursor = element.value.slice(0, element.selectionStart);
    const parts = beforeCursor.split("\n");
    setCursor({ line: parts.length, column: parts.at(-1)!.length + 1 });
  };

  const addNote = () => {
    let count = 1;
    let title = "Untitled.txt";
    while (notes[title]) title = `Untitled (${++count}).txt`;
    setNotes((current) => ({ ...current, [title]: "" }));
    setActiveTitle(title);
    setMenu(null);
    window.setTimeout(() => textAreaRef.current?.focus(), 0);
  };

  const resetNotes = () => {
    setNotes(originalNotes);
    setActiveTitle(Object.keys(originalNotes)[0]);
    setMenu(null);
  };

  return (
    <div className="notepad-app" onClick={() => setMenu(null)}>
      <div className="notepad-tabs">
        {titles.map((title) => (
          <button className={activeTitle === title ? "selected" : ""} type="button" key={title} onClick={(event) => { event.stopPropagation(); setActiveTitle(title); }}>
            <FileText size={13} />{title}<X size={11} />
          </button>
        ))}
        <button className="new-note" type="button" aria-label="New note" onClick={addNote}>+</button>
      </div>

      <div className="notepad-menu">
        <div>
          <button type="button" onClick={(event) => { event.stopPropagation(); setMenu(menu === "file" ? null : "file"); }}>File</button>
          <button type="button" onClick={(event) => { event.stopPropagation(); setMenu(menu === "edit" ? null : "edit"); }}>Edit</button>
          <button type="button" onClick={(event) => { event.stopPropagation(); setMenu(menu === "view" ? null : "view"); }}>View</button>
          {menu ? (
            <div className="notepad-dropdown" onClick={(event) => event.stopPropagation()}>
              {menu === "file" ? <><button type="button" onClick={addNote}><span>New tab</span><kbd>Ctrl+N</kbd></button><button type="button" onClick={() => setMenu(null)}><span>Save</span><kbd>Ctrl+S</kbd></button><hr /><button type="button" onClick={resetNotes}><span>Restore original evidence</span></button></> : null}
              {menu === "edit" ? <><button type="button" onClick={() => { textAreaRef.current?.select(); setMenu(null); }}><span>Select all</span><kbd>Ctrl+A</kbd></button><button type="button" onClick={() => setMenu(null)}><span>Find</span><kbd>Ctrl+F</kbd></button></> : null}
              {menu === "view" ? <><button type="button" onClick={() => setMenu(null)}><span>Zoom</span><kbd>100%</kbd></button><button type="button" onClick={() => setMenu(null)}><span>Status bar</span><kbd>✓</kbd></button></> : null}
            </div>
          ) : null}
        </div>
        <span>All changes saved</span>
      </div>

      <textarea
        ref={textAreaRef}
        aria-label={activeTitle}
        spellCheck={false}
        value={notes[activeTitle] ?? ""}
        onChange={(event) => setNotes((current) => ({ ...current, [activeTitle]: event.target.value }))}
        onClick={updateCursor}
        onKeyUp={updateCursor}
      />
      <div className="notepad-status"><span>Ln {cursor.line}, Col {cursor.column}</span><span>100%</span><span>Windows (CRLF)</span><span>UTF-8</span></div>
    </div>
  );
}
