"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { advanceMotion } from "./motion";

// Navigation animates; wheel input follows the gesture directly, once per frame.
export function useShelfMotion(initial: number) {
  const [distance, setDistance] = useState(initial);
  const motion = useRef({ value: initial, target: initial, velocity: 0, frame: 0, last: 0, wheel: false });

  const stop = useCallback(() => {
    cancelAnimationFrame(motion.current.frame);
    motion.current.frame = 0;
    motion.current.target = motion.current.value;
    motion.current.velocity = 0;
  }, []);

  const jumpTo = useCallback((value: number) => {
    stop();
    const next = value;
    motion.current.value = motion.current.target = next;
    setDistance(next);
  }, [stop]);

  const moveTo = useCallback((value: number) => {
    const next = value;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      jumpTo(next);
      return;
    }
    const state = motion.current;
    if (state.wheel) stop();
    state.target = next;
    state.wheel = false;
    if (state.frame) return;
    state.last = performance.now();
    function tick(now: number) {
      const dt = Math.max(0, Math.min(64, now - state.last));
      state.last = now;
      const done = advanceMotion(state, dt);
      setDistance(state.value);
      state.frame = done ? 0 : requestAnimationFrame(tick);
    }
    state.frame = requestAnimationFrame(tick);
  }, [jumpTo, stop]);

  const moveBy = useCallback((delta: number) => {
    const state = motion.current;
    const next = state.value + delta;
    if (!state.wheel) stop();
    state.wheel = true;
    state.value = state.target = next;
    if (state.frame) return;
    state.frame = requestAnimationFrame(() => {
      setDistance(state.value);
      state.frame = 0;
    });
  }, [stop]);
  useEffect(() => stop, [stop]);
  return { distance, moveTo, moveBy, jumpTo, stop };
}
