"use client";
import TravelReader from "@/components/travel/travel-reader";
import TravelArticle from "@/components/travel/travel-article";
import type { TravelSection } from "@/components/travel/types";
import sections from "./article.json";
import { japanMap } from "./map-config";
// City and neighborhood names stay plain; specific venues retain their map links.
const aliases = japanMap.places.filter(place => place.precision !== "area").flatMap(place => (place.aliases || [place.name]).map(alias => ({ alias, id: place.id })));
const articleSections = (sections as TravelSection[]).map(section => ({
  ...section, locationId: japanMap.places.find(place => place.name === section.title)?.id,
}));
export default function JapanReader() {
  return <TravelReader config={japanMap}>{(select, activeId) => <>
    <h1>japan travel notes</h1>
    <TravelArticle sections={articleSections} aliases={aliases} select={select} activeId={activeId} />
  </>}</TravelReader>;
}
