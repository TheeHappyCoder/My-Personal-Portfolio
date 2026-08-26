"use client";

import { FileText, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const originalNotes: Record<string, string> = {
  "reminders.txt": `dentist thurs 10:30
reply to liam
take charger
move car before 8
buy coffee
call mom
passport expiry??

1 + 3 = 4

blue cable is the good one`,
  "work.txt": `before demo

restart api
sample building 3
close downloads
mute teams
hotspot if wifi is weird

check 375px
empty state still jumps
dates on cv

send build before 2`,
  "numbers.txt": `450 + 180 = 630
630 / 3 = 210

12% of 480 = 57.6

14:30
09:15 friday
28 / 4 = 7

1 + 3 = 4`,
  "shopping.txt": `milk
coffee
dish soap
bin bags
bread
small batteries
toothpaste

check if we still have rice`,
  "later.txt": `backup laptop
rename photos
fix desk drawer
domain renewal
read bacnet notes again
sort cables

ask about floor 2 controller
check logs first`,
};

const storageKey = "markos-private-notes-v2";

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
              {menu === "file" ? <><button type="button" onClick={addNote}><span>New tab</span><kbd>Ctrl+N</kbd></button><button type="button" onClick={() => setMenu(null)}><span>Save</span><kbd>Ctrl+S</kbd></button><hr /><button type="button" onClick={resetNotes}><span>Restore original notes</span></button></> : null}
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
