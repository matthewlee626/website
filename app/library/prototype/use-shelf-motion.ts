"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { advanceMotion } from "./motion";

// One animation clock drives both the shelf and each cover's reveal. Wheel
// input keeps a fractional target; only explicit book navigation centers it.
export function useShelfMotion(initial: number, maximum: number) {
  const [distance, setDistance] = useState(initial);
  const motion = useRef({ value: initial, target: initial, velocity: 0, frame: 0, last: 0 });

  const stop = useCallback(() => {
    cancelAnimationFrame(motion.current.frame);
    motion.current.frame = 0;
    motion.current.target = motion.current.value;
    motion.current.velocity = 0;
  }, []);

  const jumpTo = useCallback((value: number) => {
    stop();
    const next = Math.max(0, Math.min(maximum, value));
    motion.current.value = motion.current.target = next;
    setDistance(next);
  }, [maximum, stop]);

  const moveTo = useCallback((value: number) => {
    const next = Math.max(0, Math.min(maximum, value));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      jumpTo(next);
      return;
    }
    const state = motion.current;
    state.target = next;
    if (state.frame) return;
    state.last = performance.now();
    function tick(now: number) {
      const dt = Math.max(0, Math.min(64, now - state.last));
      state.last = now;
      const done = advanceMotion(state, dt);
      if (state.value < 0 || state.value > maximum) {
        state.value = Math.max(0, Math.min(maximum, state.value));
        state.velocity = 0;
      }
      setDistance(state.value);
      state.frame = done ? 0 : requestAnimationFrame(tick);
    }
    state.frame = requestAnimationFrame(tick);
  }, [jumpTo, maximum]);

  const moveBy = useCallback((delta: number) => {
    const state = motion.current;
    const pending = state.target - state.value;
    // Reverse immediately instead of having to exhaust a queued gesture.
    const origin = pending * delta < 0 ? state.value : state.target;
    const softened = 90 * Math.tanh(delta / 90);
    // Don't accumulate a long fling when wheel events arrive faster than frames.
    const target = Math.max(state.value - 180, Math.min(state.value + 180, origin + softened));
    moveTo(target);
  }, [moveTo]);
  useEffect(() => stop, [stop]);
  return { distance, moveTo, moveBy, jumpTo, stop };
}
