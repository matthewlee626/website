import { positionAt, shelfOffsets } from "./geometry";

export function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

// Include the last-to-first spacing in each lap, just like any other pair.
export function loopingShelf(thicknesses: number[]) {
  const offsets = shelfOffsets([...thicknesses, thicknesses[0]]);
  const count = thicknesses.length;
  const length = offsets[count];
  function distanceAt(position: number): number {
    const lap = Math.floor(position / count);
    const local = position - lap * count;
    const lower = Math.floor(local);
    return lap * length + offsets[lower] + (offsets[lower + 1] - offsets[lower]) * (local - lower);
  }
  function positionAtDistance(distance: number): number {
    const lap = Math.floor(distance / length);
    return lap * count + positionAt(distance - lap * length, offsets);
  }
  return { distanceAt, positionAt: positionAtDistance };
}
