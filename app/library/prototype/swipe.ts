// Touch gestures advance at most one book, independent of physical book depth.
export function swipePosition(origin: number, movement: number, width: number) {
  const travel = Math.max(90, Math.min(140, width * 0.3));
  const step = Math.max(-1, Math.min(1, -movement / travel));
  const center = Math.round(origin);
  return Math.max(center - 1, Math.min(center + 1, origin + step));
}

export function swipeTarget(origin: number, movement: number, canceled = false) {
  const step = canceled || Math.abs(movement) < 28 ? 0 : -Math.sign(movement);
  return Math.round(origin) + step;
}
