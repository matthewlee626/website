"use client";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { PageLayout } from "@/components/page-layout";
import TravelMap from "./travel-map";
import type { AtlasConfig } from "./types";
import styles from "./reader.module.css";
export default function TravelReader({ config, children }: { config: AtlasConfig; children: (selectLocation: (id: string) => void, locationId: string) => ReactNode }) {
  const [area, setArea] = useState("");
  const [locationId, setLocationId] = useState("");
  const notes = useRef<HTMLElement>(null);
  const pauseUntil = useRef(0);
  const readingArea = useRef("");
  function selectLocation(id: string) { pauseUntil.current = Date.now() + 1000; setArea(""); setLocationId(id); }
  useEffect(() => {
    let frame = 0;
    const followReading = () => {
      if (Date.now() < pauseUntil.current || !notes.current) return;
      const anchor = window.innerWidth <= 760 ? window.innerHeight * .42 + 100 : window.innerHeight * .32;
      const targets = Array.from(notes.current.querySelectorAll<HTMLElement>("[data-map-area]"));
      let current: HTMLElement | undefined;
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= anchor) current = target;
        else break;
      }
      if (!current) return;
      const nextArea = current.dataset.mapArea || "";
      if (readingArea.current !== nextArea) {
        readingArea.current = nextArea;
        setLocationId("");
        setArea(nextArea);
      }
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(followReading); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    followReading();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return <PageLayout className={styles.reader}>
    <div className={styles.mapPane}><TravelMap config={config} embedded area={area} locationId={locationId} onPlaceSelect={id => {
      selectLocation(id);
      (notes.current?.querySelector(`[data-map-location="${id}"]`) || notes.current?.querySelector(`[data-inline-location="${id}"]`))?.scrollIntoView({ behavior: "smooth", block: "center" });
    }} /></div>
    <article ref={notes} className={styles.notes}>
      {children(selectLocation, locationId)}
    </article>
  </PageLayout>;
}
