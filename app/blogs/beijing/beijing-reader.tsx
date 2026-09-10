"use client";
import { RichText } from "@/components/travel/rich-text";
import TravelReader from "@/components/travel/travel-reader";
import { beijingMap } from "./map-config";
import article from "./article.json";
import localPlaces from "./local-places.json";
import { withChinese } from "./location-labels";
import styles from "@/components/travel/reader.module.css";
const areas: Record<string, string> = { center: "all", "center-center": "Center", south: "South", east: "East", north: "North", west: "West", chaoyang: "Chaoyang", wangjing: "Wangjing", haidian: "Haidian", misc: "Beyond the city" };
// IDs follow field-notes.json; null entries use inline links or have no single location.
const bulletPlaces: Record<string, (string | null)[]> = {
  "center-center": ["1", "2", "3"], south: ["4", "5"], east: ["6", "7", "8", "9", null],
  north: ["10", "11", "12", "14", "17", "18", "19", "20"], west: ["21", "22", "23", "24"],
  chaoyang: ["25", "26", "27", "28", "30"], wangjing: ["31", "32"], haidian: ["33", "34", null, null, null], misc: ["37"]
};
const aliases = [...localPlaces.flatMap(place => place.aliases.map(alias => ({ alias, id: place.id }))),
  { alias: "drum", id: "15" }, { alias: "clock towers", id: "16" }, { alias: "mutianyu", id: "37" },
  { alias: "badaling", id: "38" }, { alias: "peking university", id: "35" }, { alias: "tsinghua university", id: "36" }
];
function inline(text: string, onSelect?: () => void, active = false, select?: (id: string) => void, activeId = "") {
  return <RichText text={text} aliases={aliases} transform={withChinese} onSelect={onSelect} active={active} select={select} activeId={activeId} />;
}
export default function BeijingReader() {
  return <TravelReader config={beijingMap}>{(selectLocation, locationId) => <>
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
    </>}</TravelReader>;
}
