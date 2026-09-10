export type Motion = { value: number; target: number; velocity: number };

/** Bounded, critically damped movement with continuous velocity across inputs. */
export function advanceMotion(state: Motion, milliseconds: number) {
  let remaining = Math.min(64, Math.max(0, milliseconds)) / 1000;
  while (remaining > 0) {
    const dt = Math.min(remaining, 1 / 240);
    const error = state.target - state.value;
    const acceleration = Math.max(-6400, Math.min(6400, 144 * error - 24 * state.velocity));
    state.velocity = Math.max(-1200, Math.min(1200, state.velocity + acceleration * dt));
    state.value += state.velocity * dt;
    remaining -= dt;
  }
  const done = Math.abs(state.target - state.value) < 0.02 && Math.abs(state.velocity) < 0.1;
  if (done) { state.value = state.target; state.velocity = 0; }
  return done;
}

/** CSS cubic-bezier(0, 0, 0.8, 1), evaluated by elapsed time (the x axis). */
export function wheelProgress(progress: number) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  let low = 0;
  let high = 1;
  for (let iteration = 0; iteration < 24; iteration++) {
    const t = (low + high) / 2;
    const x = 2.4 * (1 - t) * t * t + t * t * t;
    if (x < progress) low = t;
    else high = t;
  }
  const t = (low + high) / 2;
  return 3 * (1 - t) * t * t + t * t * t;
}
