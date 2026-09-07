"use client";
import { PageLayout } from "@/components/page-layout";
import { useState, useEffect, useRef } from "react";
import BeijingMap from "./beijing-map";
import article from "./article.json";
import localPlaces from "./local-places.json";
import styles from "./reader.module.css";
const areas: Record<string, string> = { center: "all", "center-center": "Center", south: "South", east: "East", north: "North", west: "West", chaoyang: "Chaoyang", wangjing: "Wangjing", haidian: "Haidian", misc: "Beyond the city" };
// IDs follow field-notes.json; null entries use inline links or have no single location.
const bulletPlaces: Record<string, (string | null)[]> = {
  "center-center": ["1", "2", "3"], south: ["4", "5"], east: ["6", "7", "8", "9", null],
  north: ["10", "11", "12", "14", "17", "18", "19", "20"], west: ["21", "22", "23", "24"],
  chaoyang: ["25", "26", "27", "28", "30"], wangjing: ["31", "32"], haidian: ["33", "34", null, null, null], misc: ["37"]
};
function localLinks(text: string, select?: (id: string) => void, activeId = "") {
  if (!select) return text;
  const aliases = [...localPlaces.flatMap(place => place.aliases.map(alias => ({alias, id: place.id}))),
    { alias: "drum", id: "15" }, { alias: "clock towers", id: "16" },
    { alias: "mutianyu", id: "37" }, { alias: "badaling", id: "38" },
    { alias: "peking university", id: "35" }, { alias: "tsinghua university", id: "36" }
  ].sort((a,b) => b.alias.length-a.alias.length);
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${aliases.map(item => escape(item.alias)).join("|")})`, "gi");
  return text.split(pattern).map((part,i) => {
    const match = aliases.find(item => item.alias.toLowerCase() === part.toLowerCase());
    return match ? <button key={i} className={styles.localPlace} data-inline-location={match.id} aria-pressed={match.id === activeId} onClick={() => select(match.id)}>{part}</button> : part;
  });
}
function inline(text: string, onSelect?: () => void, active = false, select?: (id: string) => void, activeId = "") {
  // Whitespace inside a button's label does not reliably separate inline text.
  // Move Notion's trailing bold whitespace outside the heading boundary.
  text = text.replace(/^(\*\*[^*]*?\S)\s+\*\*/, "$1** ")
    .replace(/^(\*\*[^*]*:)\*\*(?=\S)/, "$1** ");
  return text.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith("**")) return i === 1 && onSelect ? <button key={i} className={styles.bulletHeading} onClick={onSelect} aria-pressed={active}>{part.slice(2, -2)}</button> : <strong key={i}>{localLinks(part.slice(2, -2), select, activeId)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && /^https?:\/\//.test(link[2])) return <a key={i} href={link[2]}>{link[1]}</a>;
    return localLinks(part.replace(/\*([^*]+)\*/g, "$1"), select, activeId);
  });
}
export default function BeijingReader() {
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
  return <PageLayout className={styles.reader} headerClassName={styles.breadcrumb} breadcrumbs={[{ label: "home", href: "/" }, { label: "blogs", href: "/blogs" }, { label: "beijing field notes" }]}>
    <div className={styles.mapPane}><BeijingMap embedded area={area} locationId={locationId} onPlaceSelect={id => {
      selectLocation(id);
      document.querySelector(`[data-inline-location="${id}"], [data-map-location="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }} /></div>
    <article ref={notes} className={styles.notes}>
      <h1>beijing field notes</h1><p>{article.intro}</p>
      <h2 data-map-area="all">geography</h2><p>{article.geography}</p>
      {article.sections.map((section, index) => <section key={section.title} id={section.title} data-map-area={areas[section.title]}>
        <div className={styles.sectionHeading}>{index === 0 ? <h2>{section.title}</h2> : <h3>{section.title}</h3>}</div>
        {section.blocks.map((block, i) => {
          if (block.type === "paragraph") return <p key={i}>{inline(block.text)}</p>;
          const bulletIndex = section.blocks.slice(0, i).filter(item => item.type === "bullet").length;
          const id = bulletPlaces[section.title]?.[bulletIndex];
          return <ul key={i}><li data-map-location={id || undefined}>{inline(block.text, id ? () => selectLocation(id) : undefined, locationId === id, selectLocation, locationId)}{id && !block.text.startsWith("**") && <button className={styles.inlineMapLink} onClick={() => selectLocation(id)}>Show on map ↖</button>}</li></ul>;
        })}
      </section>)}
      <footer><a href="https://app.notion.com/p/3c839765c7b980ffbe59e65308a800d1">Original notes on Notion ↗</a></footer>
    </article>
  </PageLayout>;
}
