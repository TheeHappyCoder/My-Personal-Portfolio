"use client";

import { motion } from "framer-motion";
import { Minus, Square, X } from "lucide-react";
import { PointerEvent as ReactPointerEvent, ReactNode, useEffect, useRef } from "react";
import { flushSync } from "react-dom";

export type WindowPosition = { x: number; y: number };
export type WindowSize = { width: number; height: number };

type WindowFrameProps = {
  windowId: string;
  title: string;
  icon: ReactNode;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  active: boolean;
  maximized: boolean;
  onFocus: () => void;
  onMove: (position: WindowPosition) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  children: ReactNode;
};

export function WindowFrame({
  windowId,
  title,
  icon,
  position,
  size,
  zIndex,
  active,
  maximized,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onClose,
  children,
}: WindowFrameProps) {
  const frameRef = useRef<HTMLElement>(null);
  const onMoveRef = useRef(onMove);

  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    lastX: number;
    lastY: number;
  } | null>(null);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const currentDrag = drag.current;
      if (!currentDrag || currentDrag.pointerId !== event.pointerId) return;

      const nextX = currentDrag.originX + event.clientX - currentDrag.startX;
      const nextY = currentDrag.originY + event.clientY - currentDrag.startY;
      const maxX = Math.max(8, window.innerWidth - 220);
      const maxY = Math.max(8, window.innerHeight - 112);
      const clampedX = Math.min(Math.max(nextX, 8 - size.width + 190), maxX);
      const clampedY = Math.min(Math.max(nextY, 8), maxY);

      currentDrag.lastX = clampedX;
      currentDrag.lastY = clampedY;

      frameRef.current?.style.setProperty(
        "translate",
        `${clampedX - currentDrag.originX}px ${clampedY - currentDrag.originY}px`,
      );
    };

    const handleUp = (event: PointerEvent) => {
      const currentDrag = drag.current;
      if (!currentDrag || currentDrag.pointerId !== event.pointerId) return;

      drag.current = null;
      flushSync(() => onMoveRef.current({ x: currentDrag.lastX, y: currentDrag.lastY }));
      frameRef.current?.style.removeProperty("translate");
      frameRef.current?.classList.remove("is-dragging");
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [size.width]);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (maximized || event.button !== 0 || window.innerWidth <= 680) return;
    if ((event.target as HTMLElement).closest("button")) return;

    onFocus();
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      lastX: position.x,
      lastY: position.y,
    };
    frameRef.current?.classList.add("is-dragging");
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const frameStyle = maximized
    ? { inset: "8px 8px 64px", zIndex }
    : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      };

  return (
    <motion.section
      ref={frameRef}
      data-window-id={windowId}
      className={`app-window ${active ? "is-active" : ""} ${maximized ? "is-maximized" : ""}`}
      style={frameStyle}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.975, y: 5, transition: { duration: 0.1 } }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      onPointerDown={onFocus}
      aria-label={`${title} window`}
    >
      <div
        className="window-titlebar"
        onPointerDown={startDrag}
        onDoubleClick={onMaximize}
      >
        <div className="window-title">
          <span className="window-title-icon" aria-hidden="true">
            {icon}
          </span>
          <span>{title}</span>
        </div>

        <div className="window-controls">
          <button type="button" onClick={onMinimize} aria-label={`Minimize ${title}`}>
            <Minus size={15} strokeWidth={1.8} />
          </button>
          <button type="button" onClick={onMaximize} aria-label={`${maximized ? "Restore" : "Maximize"} ${title}`}>
            <Square size={11} strokeWidth={1.8} />
          </button>
          <button type="button" className="window-close" onClick={onClose} aria-label={`Close ${title}`}>
            <X size={15} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="window-content">{children}</div>
    </motion.section>
  );
}
