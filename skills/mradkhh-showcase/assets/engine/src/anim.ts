import type { CSSProperties } from "react";
import { interpolate, spring } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 spring that starts at `delay` frames. */
export function enter(frame: number, fps: number, delay = 0, damping = 200) {
  return spring({ frame: frame - delay, fps, config: { damping } });
}

/** Linear 0 → 1 between two frames. */
export function progress(frame: number, from: number, to: number) {
  return interpolate(frame, [from, to], [0, 1], CLAMP);
}

/** Fade-and-rise style for a 0 → 1 entry value. */
export function rise(p: number, distance = 40): CSSProperties {
  return { opacity: p, transform: `translateY(${(1 - p) * distance}px)` };
}

/**
 * Entry frame of item `i` of `n`, spread over the first half of the beat
 * so the viewer has the rest of the beat to read the full picture.
 */
export function stagger(i: number, n: number, frames: number, start = 18) {
  const window = Math.max(frames * 0.5 - start, n * 8);
  const gap = Math.min(26, window / Math.max(n, 1));
  return Math.round(start + i * gap);
}

/** Slow 0 → 1 → 0 pulse for highlighted things, once they are on screen. */
export function pulse(frame: number, from: number) {
  if (frame < from) return 0;
  return (Math.sin(((frame - from) / 30) * Math.PI) + 1) / 2;
}
