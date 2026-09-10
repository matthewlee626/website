// The shelf rises from lower left to upper right; scroll direction is independent.
export const SHELF_SLOPE = -0.28;

export function popOutProgress(index: number, position: number): number {
  const proximity = Math.max(0, 1 - Math.abs(index - position));
  return proximity ** 3 * (proximity * (proximity * 6 - 15) + 10);
}

export function centralShelfOffsets(offsets: number[], extents: number[], position: number, fixedOpening?: number): number[] {
  if (!offsets.length) return [];
  // One fixed opening, sized once for the collection. No cumulative gap
  // expansion or moving recentering correction: each side is a rigid group.
  let opening = fixedOpening ?? 0;
  for (let index = 1; index < offsets.length; index++) {
    const baseGap = offsets[index] - offsets[index - 1];
    opening = Math.max(opening, extents[index - 1] + extents[index] + 16 - baseGap);
  }
  return offsets.map((offset, index) => {
    const relative = index - position;
    const t = Math.min(1, Math.abs(relative));
    const blend = t ** 3 * (t * (t * 6 - 15) + 10);
    return offset + Math.sign(relative) * opening * blend;
  });
}

export function dragDistance(dx: number, dy: number, scale: number): number {
  return (dx + dy * SHELF_SLOPE) / (1 + SHELF_SLOPE ** 2) / scale;
}

// Shared physical scale: one millimetre is one scene unit before responsive scaling.
// A constant air gap plus half of each neighbouring depth gives thicker books more room.
export function shelfOffsets(thicknesses: number[], gap = 38): number[] {
  const offsets = [0];
  for (let index = 1; index < thicknesses.length; index++) {
    offsets.push(offsets[index - 1] + gap + (thicknesses[index - 1] + thicknesses[index]) / 2);
  }
  return offsets;
}

export function distanceAt(position: number, offsets: number[]): number {
  const lower = Math.max(0, Math.min(offsets.length - 1, Math.floor(position)));
  const upper = Math.min(offsets.length - 1, lower + 1);
  return offsets[lower] + (offsets[upper] - offsets[lower]) * (position - lower);
}

export function positionAt(distance: number, offsets: number[]): number {
  if (distance <= offsets[0]) return 0;
  for (let index = 1; index < offsets.length; index++) {
    if (distance <= offsets[index]) {
      return index - 1 + (distance - offsets[index - 1]) / (offsets[index] - offsets[index - 1]);
    }
  }
  return offsets.length - 1;
}

// Trackpads report pixels; mouse wheels may report lines or pages. Use the
// dominant axis so a diagonal gesture does not count the same motion twice.
export function wheelDistance(deltaX: number, deltaY: number, deltaMode: number, pageHeight: number, scale: number): number {
  const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
  const unit = deltaMode === 1 ? 16 : deltaMode === 2 ? pageHeight : 1;
  return delta * unit / scale;
}

// Include cover overhang, selected-book separation, and a preloading buffer.
// Positions still come from the full catalogue, so mounting a new slice never
// changes physical spacing or the scroll position.
export function visibleBookRange(offsets: number[], position: number, viewportWidth: number, scale: number, coverExtent: number): { start: number; end: number } {
  if (!offsets.length) return { start: 0, end: 0 };
  const center = distanceAt(position, offsets);
  const reach = viewportWidth / (2 * scale) + coverExtent + 95 + 160 / scale;
  return {
    start: Math.floor(positionAt(center - reach, offsets)),
    end: Math.min(offsets.length, Math.ceil(positionAt(center + reach, offsets)) + 1),
  };
}
