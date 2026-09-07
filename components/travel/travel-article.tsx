import Image from "next/image";
import type { TravelBlock, TravelSection } from "./types";
import { RichText, type LocationAlias } from "./rich-text";
import styles from "./reader.module.css";
type Props = { sections: TravelSection[]; aliases: LocationAlias[]; select: (id: string) => void; activeId: string };
export default function TravelArticle({ sections, aliases, select, activeId }: Props) {
  const rich = (text: string) => <RichText text={text} aliases={aliases} select={select} activeId={activeId} />;
  function blocks(items: TravelBlock[]) {
    const result = [];
    for (let i = 0; i < items.length; i++) {
      const block = items[i];
      if (block.type === "bullet") {
        const list = [];
        const start = i;
        while (i < items.length && items[i].type === "bullet") {
          const bullet = items[i];
          list.push(<li key={i}>{rich(bullet.text)}{bullet.children && blocks(bullet.children)}</li>);
          i++;
        }
        i--;
        result.push(<ul key={start}>{list}</ul>);
      } else if (block.type === "image") {
        result.push(<figure key={i}><Image src={block.text} alt={block.alt || "Map from the original travel notes"} width={block.width || 1200} height={block.height || 800} sizes="(max-width: 760px) calc(100vw - 48px), 42vw" /></figure>);
      } else if (block.type === "heading") result.push(<h4 key={i}>{block.text}</h4>);
      else result.push(<p key={i}>{rich(block.text)}</p>);
    }
    return result;
  }
  return <>{sections.map(section => {
    const Heading = section.level === 2 ? "h2" : section.level === 3 ? "h3" : "h4";
    const location = aliases.find(item => item.alias === section.title);
    return <section id={section.id} key={section.id} data-map-area={section.area} data-map-location={section.locationId}>
      <div className={styles.sectionHeading}><Heading>{location ? <button className={styles.localPlace} data-map-location={location.id} aria-pressed={location.id === activeId} onClick={() => select(location.id)}>{section.title}</button> : section.title}</Heading></div>
      {blocks(section.blocks)}
    </section>;
  })}</>;
}
