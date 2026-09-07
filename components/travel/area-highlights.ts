import type { AreaHighlight } from "./types";

// Geographic circles stay the same ground size while the map zooms.
// These are editorial neighborhood guides, not administrative boundaries.
type HighlightFeature = { type: "Feature"; properties: { label: string }; geometry: { type: "Polygon"; coordinates: number[][][] } | { type: "Point"; coordinates: number[] } };

export function areaHighlightFeatures(areas: AreaHighlight[]) {
  return {
    type: "FeatureCollection" as const,
    features: areas.flatMap<HighlightFeature>(({ label, center: [lng, lat], radiusKm }) => {
      const latitudeRadius = radiusKm / 111.32;
      const longitudeRadius = latitudeRadius / Math.cos(lat * Math.PI / 180);
      const ring = Array.from({ length: 65 }, (_, i) => {
        const angle = (i % 64) / 64 * 2 * Math.PI;
        return [lng + longitudeRadius * Math.cos(angle), lat + latitudeRadius * Math.sin(angle)];
      });
      return [
        { type: "Feature" as const, properties: { label }, geometry: { type: "Polygon" as const, coordinates: [ring] } },
        { type: "Feature" as const, properties: { label }, geometry: { type: "Point" as const, coordinates: [lng, lat + latitudeRadius] } },
      ];
    }),
  };
}
