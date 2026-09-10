"use client";
import { PostHeader } from "@/components/posts/post-header";
import { posts } from "../posts";

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
    <PostHeader title="japan travel notes" writtenOn={posts.find(post => post.slug === "japan")?.writtenOn} />
    <TravelArticle sections={articleSections} aliases={aliases} select={select} activeId={activeId} />
  </>}</TravelReader>;
}
