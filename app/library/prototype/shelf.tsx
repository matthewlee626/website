"use client";

import { PageLayout } from "@/components/page-layout";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { distanceAt, positionAt, shelfOffsets, wheelDistance, dragDistance, visibleBookRange, popOutProgress, centralShelfOffsets, SHELF_SLOPE } from "./geometry";
import { useShelfMotion } from "./use-shelf-motion";
import styles from "./shelf.module.css";

export type ShelfBook = {
  slug: string;
  title: string;
  author: string;
  cover: string;
  width: number;
  height: number;
  physical: { widthMm: number; heightMm: number; thicknessMm: number };
  window?: { x: number; y: number; width: number; height: number };
};

function imageStyle(book: ShelfBook): CSSProperties | undefined {
  const crop = book.window;
  if (!crop) return;
  return {
    position: "absolute",
    maxWidth: "none",
    width: `${(book.width / crop.width) * 100}%`,
    height: `${(book.height / crop.height) * 100}%`,
    left: `${(-crop.x / crop.width) * 100}%`,
    top: `${(-crop.y / crop.height) * 100}%`,
  };
}

export default function Shelf({ books }: { books: ShelfBook[] }) {
  const initial = Math.min(6, books.length - 1);
  const offsets = useMemo(() => shelfOffsets(books.map((item) => item.physical.thicknessMm)), [books]);
  const { distance: focusDistance, moveTo, moveBy, jumpTo, stop } = useShelfMotion(offsets[initial], offsets[offsets.length - 1]);
  const position = positionAt(focusDistance, offsets);
  const [dragging, setDragging] = useState(false);
  const [requestedSlug, setRequestedSlug] = useState<string | null>(null);
  const requestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (requestTimer.current) clearTimeout(requestTimer.current);
  }, []);

  function requestBook(slug: string) {
    if (requestTimer.current) clearTimeout(requestTimer.current);
    setRequestedSlug(slug);
    requestTimer.current = setTimeout(() => {
      setRequestedSlug(null);
      requestTimer.current = null;
    }, 2000);
  }
  const [viewport, setViewport] = useState({ width: 1200, scale: 1 });
  const pageRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number; position: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const current = Math.round(position);
  const book = books[current];
  const clamp = (value: number) => Math.max(0, Math.min(books.length - 1, value));
  const coverExtents = useMemo(() => books.map((item) =>
    item.physical.widthMm / 2 + item.physical.thicknessMm + item.physical.heightMm * 0.06,
  ), [books]);
  const coverExtent = Math.max(...coverExtents);
  const slotOffsets = centralShelfOffsets(offsets, coverExtents, position);
  const range = visibleBookRange(offsets, position, viewport.width, viewport.scale, coverExtent);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const measure = () => {
      const width = page.clientWidth;
      const scale = Number.parseFloat(getComputedStyle(page).getPropertyValue("--book-scale")) || 1;
      setViewport((previous) => previous.width === width && previous.scale === scale ? previous : { width, scale });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  function preserveShelfFocus() {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.hasAttribute("data-book-index") && stageRef.current?.contains(active)) {
      // The focused book may leave the mounted window during a long gesture.
      stageRef.current.focus({ preventScroll: true });
    }
  }

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    function wheel(event: WheelEvent) {
      // Preserve browser zoom/pinch gestures and don't fight an active drag.
      if (event.ctrlKey || event.metaKey || drag.current) return;
      const scale = Number.parseFloat(getComputedStyle(page!).getPropertyValue("--book-scale")) || 1;
      const movement = wheelDistance(event.deltaX, event.deltaY, event.deltaMode, page!.clientHeight, scale);
      if (!movement) return;
      if (event.cancelable) event.preventDefault();
      preserveShelfFocus();
      moveBy(-movement);
    }
    // A native non-passive listener can suppress page scrolling reliably.
    page.addEventListener("wheel", wheel, { passive: false });
    return () => {
      page.removeEventListener("wheel", wheel);
    };
  }, [moveBy]);

  function select(index: number) {
    const next = clamp(index);
    moveTo(offsets[next]);
  }

  function pointerDown(event: PointerEvent<HTMLElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    stop();
    suppressClick.current = false;
    drag.current = { x: event.clientX, y: event.clientY, position, moved: false };
  }

  function pointerMove(event: PointerEvent<HTMLElement>) {
    const start = drag.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.moved && Math.hypot(dx, dy) < 6) return;
    start.moved = true;
    suppressClick.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    preserveShelfFocus();
    setDragging(true);
    const scale = Number.parseFloat(getComputedStyle(event.currentTarget).getPropertyValue("--book-scale")) || 1;
    const movement = dragDistance(dx, dy, scale);
    jumpTo(distanceAt(start.position, offsets) - movement);
  }

  function pointerEnd(event: PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <PageLayout ref={pageRef} className={styles.page} title="library" headerClassName={styles.header}>

      <section
        ref={stageRef}
        tabIndex={-1}
        className={styles.stage}
        data-dragging={dragging}
        aria-label="Interactive bookshelf. Scroll or drag to browse, select a book to reveal its cover. Use left and right arrow keys to browse."
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            const next = clamp(current + (event.key === "ArrowRight" ? 1 : -1));
            select(next);
            event.currentTarget.querySelector<HTMLButtonElement>(`[data-book-index="${next}"]`)?.focus({ preventScroll: true });
          }
          if (event.key === "Escape") stop();
        }}
      >
        {books.slice(range.start, range.end).map((item, localIndex) => {
          const index = range.start + localIndex;
          const distance = slotOffsets[index] - focusDistance;
          const railDistance = offsets[index] - focusDistance;
          const reveal = popOutProgress(index, position);
          const open = index === current;
          return (
            <button
              key={item.slug}
              type="button"
              data-book-index={index}
              data-open={open}
              className={styles.book}
              aria-label={`${item.title}, by ${item.author}`}
              aria-pressed={open}
              tabIndex={index === current ? 0 : -1}
              style={{
                "--x": `${distance}px`,
                "--y": `${railDistance * SHELF_SLOPE + reveal * 90}px`,
                "--yaw": "-16deg",
                "--roll": "3deg",
                "--width": `${item.physical.widthMm}px`,
                "--height": `${item.physical.heightMm}px`,
                "--thickness": `${item.physical.thicknessMm}px`,
                // Keep the same stacking order throughout the entire gesture.
                // One continuous pull-out motion; neighbors keep their slots.
                zIndex: books.length - index,
              } as CSSProperties}
              onClick={() => {
                if (suppressClick.current) return;
                select(index);
              }}
            >
              <span className={styles.backCover} aria-hidden="true" />
              <span className={styles.spine} aria-hidden="true" />
              <span className={styles.pageBlock} aria-hidden="true" />
              <span className={styles.coverFrame}>
                <Image
                  src={item.cover}
                  alt=""
                  width={item.width}
                  height={item.height}
                  style={imageStyle(item)}
                  className={styles.cover}
                  draggable={false}
                  priority={Math.abs(index - initial) < 9}
                  unoptimized
                />
              </span>
            </button>
          );
        })}
      </section>

      <footer className={styles.footer}>
        <button className={styles.previous} type="button" onClick={() => select(current - 1)} disabled={current === 0} aria-label="Previous book">←</button>
        <div className={styles.caption} aria-live="polite" aria-atomic="true">
          <p className={styles.title}>{book.title.toLowerCase()}</p>
          <p className={styles.author}>{book.author}</p>
          <button type="button" className={styles.request} onClick={() => requestBook(book.slug)}>
            <span aria-live="polite">{requestedSlug === book.slug ? "you know how!" : "request"}</span>
          </button>
        </div>
        <button className={styles.next} type="button" onClick={() => select(current + 1)} disabled={current === books.length - 1} aria-label="Next book">→</button>
      </footer>
    </PageLayout>
  );
}
