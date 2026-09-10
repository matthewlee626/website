import photos from "./photos.json";
import mainPlaces from "./field-notes.json";
import localPlaces from "./local-places.json";
import { toMapCoordinates } from "./coordinates";
import { withChinese } from "./location-labels";
import type { AtlasConfig } from "@/components/travel/types";
export const beijingMap: AtlasConfig = {
  title: "Beijing", localTitle: "北京", language: "zh", seal: "京",
  sourceUrl: "https://app.notion.com/p/3c839765c7b980ffbe59e65308a800d1",
  center: [116.397, 39.94], zoom: 11.8, minZoom: 8,
  bounds: [[115.4, 39.3], [117.4, 40.6]], overviewExcludedAreas: ["Beyond the city"],
  places: [...mainPlaces, ...localPlaces].map(place => ({ ...place, photos: (photos as Record<string, { src: string; alt: string }[]>)[place.id], name: withChinese(place.name), coordinates: toMapCoordinates(place.coordinates, place.coordinateSystem) })),
};
