import type { AtlasConfig } from "@/components/travel/types";
import places from "./places.json";
export const japanMap: AtlasConfig = {
  title: "Japan", localTitle: "日本", language: "ja", seal: "日",
  sourceUrl: "https://matthewlee626.notion.site/2354ed41d0ff43afb27be7f73140416e",
  center: [139.73, 35.68], zoom: 11, minZoom: 4,
  areaGroups: { Tokyo: ["Tokyo", "Ginza", "Roppongi", "Shibuya", "Shinjuku", "Ikebukuro", "Ueno", "Ningyocho", "Shimokitazawa", "Tsukishima"] },
  areaZoom: { Tokyo: 11, Osaka: 12, Kyoto: 12, Hakone: 11, Yokohama: 12, Kamakura: 12 },
  areaHighlights: [
    { label: "ginza", center: [139.7647202, 35.6720135], radiusKm: 1.1 },
    { label: "roppongi", center: [139.7334981, 35.6624568], radiusKm: 1.3 },
    { label: "shibuya", center: [139.7004982, 35.6594951], radiusKm: 1.2 },
    { label: "shinjuku", center: [139.7036319, 35.6937632], radiusKm: 1.25 },
    { label: "ikebukuro", center: [139.7084043, 35.7358426], radiusKm: 1.1 },
    { label: "ueno", center: [139.775362, 35.7106288], radiusKm: 1.4 },
  ],
  places,
};
