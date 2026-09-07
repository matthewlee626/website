import type { ReactNode } from "react";
import styles from "./reader.module.css";
export type LocationAlias = { alias: string; id: string };
type Props = {
  text: string; aliases?: LocationAlias[]; transform?: (text: string) => string;
  onSelect?: () => void; select?: (id: string) => void; activeId?: string; active?: boolean;
};
const identity = (text: string) => text;
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function RichText({ text, aliases = [], transform = identity, onSelect, select, activeId = "", active = false }: Props) {
  function plain(value: string): ReactNode {
    if (!select || !aliases.length) return transform(value);
    const sorted = [...aliases].sort((a, b) => b.alias.length - a.alias.length);
    const pattern = new RegExp(`(?<![a-z])(${sorted.map(item => escape(item.alias)).join("|")})(?![a-z])`, "gi");
    return value.split(pattern).map((part, i) => {
      const match = sorted.find(item => item.alias.toLowerCase() === part.toLowerCase());
      return match ? <button key={i} className={styles.localPlace} data-inline-location={match.id} aria-pressed={match.id === activeId} onClick={() => select?.(match.id)}>{transform(part)}</button> : transform(part);
    });
  }
  function render(value: string, linkLabel = false): ReactNode {
    return value.split(/(\[[^\]]+\]\([^)]+\)|<span underline="true">.*?<\/span>|\*\*.*?\*\*|\*[^*]+\*)/g).map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = /^https?:\/\//.test(link[2]) ? link[2] : /^[\w-]+\.[a-z]{2,}(?:\/|$)/i.test(link[2]) ? `https://${link[2]}` : undefined;
        const label = link[1].replace(/\*/g, "");
        const location = aliases.find(item => item.alias.toLowerCase() === label.toLowerCase());
        if (href && location && select) return <span key={i} data-map-location={location.id}><a href={href}>{render(link[1], true)}</a><button className={styles.inlineMapIcon} aria-label={`Show ${label} on map`} aria-pressed={location.id === activeId} onClick={() => select(location.id)}>↖</button></span>;
        return href ? <a key={i} href={href}>{render(link[1], true)}</a> : render(link[1], true);
      }
      if (part.startsWith('<span underline="true">')) return <u key={i}>{render(part.slice(23, -7), linkLabel)}</u>;
      if (part.startsWith("**")) return i === 1 && onSelect && !linkLabel ? <button key={i} className={styles.bulletHeading} onClick={onSelect} aria-pressed={active}>{transform(part.slice(2, -2))}</button> : <strong key={i}>{linkLabel ? transform(part.slice(2, -2)) : plain(part.slice(2, -2))}</strong>;
      if (part.startsWith("*")) return <em key={i}>{linkLabel ? transform(part.slice(1, -1)) : plain(part.slice(1, -1))}</em>;
      return linkLabel ? transform(part) : plain(part);
    });
  }
  return <>{render(text.replace(/^(\*\*[^*]*?\S)\s+\*\*/, "$1** ").replace(/^(\*\*[^*]*:)\*\*(?=\S)/, "$1** "))}</>;
}
