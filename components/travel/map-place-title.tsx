import type { Place } from "./types";
import styles from "./map.module.css";

// Atlas coordinates are normalized to WGS84 before reaching the shared map.
export default function MapPlaceTitle({ place, language }: { place: Place; language: string }) {
  const [lng, lat] = place.coordinates;
  const amap = language === "zh";
  const params = new URLSearchParams(amap
    ? { position: `${lng},${lat}`, name: place.name, coordinate: "wgs84", callnative: "1" }
    : { api: "1", query: `${lat},${lng}` });
  const href = `${amap ? "https://uri.amap.com/marker?" : "https://www.google.com/maps/search/?"}${params}`;
  return <a className={styles.placeTitleLink} href={href} target="_blank" rel="noopener noreferrer"
    aria-label={`Open ${place.name} in ${amap ? "Amap" : "Google Maps"}`}>
    {place.name} <span aria-hidden="true">↗</span>
  </a>;
}
