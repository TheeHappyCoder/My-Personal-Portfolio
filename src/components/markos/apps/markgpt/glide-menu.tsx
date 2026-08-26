"use client";

import { useRef, useState, type ReactNode } from "react";

type GlideMenuProps = {
  children: ReactNode;
  className?: string;
  rowSelector?: string;
};

/** Adapted from Beautiful UI's GlideMenu primitive (MIT). */
export function GlideMenu({ children, className = "", rowSelector = "[data-markgpt-row]" }: GlideMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  const [visible, setVisible] = useState(false);

  const moveTo = (target: EventTarget | null) => {
    const container = ref.current;
    if (!(target instanceof Element) || !container) return;
    const row = target.closest(rowSelector);
    if (!(row instanceof HTMLElement) || !container.contains(row)) return;
    const containerRect = container.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    setBox({ top: rowRect.top - containerRect.top, height: rowRect.height });
    setVisible(true);
  };

  return (
    <div
      ref={ref}
      className={`markgpt-glide-menu ${className}`}
      onMouseOver={(event) => moveTo(event.target)}
      onMouseLeave={() => setVisible(false)}
      onFocusCapture={(event) => moveTo(event.target)}
      onBlurCapture={(event) => {
        if (!ref.current?.contains(event.relatedTarget as Node | null)) setVisible(false);
      }}
    >
      <span
        aria-hidden="true"
        className="markgpt-glide-highlight"
        style={{
          top: box?.top ?? 0,
          height: box?.height ?? 0,
          opacity: box && visible ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
}
