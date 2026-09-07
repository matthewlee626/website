import coordtransform from "coordtransform";

// CARTO / OpenStreetMap expects WGS84. Keep the source system with each
// coordinate so Chinese map imports are converted once, never guessed.
export function toMapCoordinates(coordinates: number[], system: string): [number, number] {
  const [lng, lat] = coordinates;
  if (coordinates.length !== 2 || !Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) {
    throw new Error("Invalid location coordinates");
  }
  if (system === "wgs84") return [lng, lat];
  if (system === "gcj02") return coordtransform.gcj02towgs84(lng, lat);
  if (system === "bd09") return coordtransform.gcj02towgs84(...coordtransform.bd09togcj02(lng, lat));
  throw new Error(`Unknown coordinate system: ${system}`);
}
