// Shared by the Remotion composition and the Node scripts, so the video,
// the stills, and the check report always agree on when each beat plays.

export const FPS = 30;
export const TRANSITION_FRAMES = 15;

const MIN_SECONDS = 4;
const MAX_SECONDS = 14;

/** Every on-screen string of a beat, in reading order. */
export function beatTexts(beat) {
  const out = [beat.headline, beat.subtitle, beat.question, beat.caption];
  for (const p of beat.points ?? []) out.push(p);
  for (const s of beat.steps ?? []) out.push(s.actor, s.label);
  for (const o of beat.options ?? []) out.push(o.when, o.then);
  for (const side of [beat.before, beat.after]) {
    if (side) out.push(side.title, ...(side.points ?? []));
  }
  for (const m of beat.metrics ?? []) out.push(m.value, m.label);
  for (const e of beat.elements ?? []) out.push(e.label);
  return out.filter(t => typeof t === "string" && t.trim() !== "");
}

/** Number of things that animate in one after another. */
function itemCount(beat) {
  return (
    (beat.points?.length ?? 0) +
    (beat.steps?.length ?? 0) +
    (beat.options?.length ?? 0) +
    (beat.metrics?.length ?? 0) +
    (beat.elements?.length ?? 0) +
    (beat.before ? 1 : 0) +
    (beat.after ? 1 : 0)
  );
}

/**
 * How long a beat stays on screen. There is no narration, so the viewer
 * must read every word: ~0.32 s per word plus time to watch each item.
 */
export function beatSeconds(beat) {
  if (typeof beat.seconds === "number") return beat.seconds;
  const words = beatTexts(beat).join(" ").split(/\s+/).filter(Boolean).length;
  const raw = 2.5 + words * 0.32 + itemCount(beat) * 0.6;
  return Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, Math.round(raw * 2) / 2));
}

/**
 * Start frame and length of every beat. Transitions overlap neighbouring
 * beats, so each start moves back by one transition per earlier beat.
 */
export function timeline(storyboard) {
  let from = 0;
  return storyboard.beats.map((beat, i) => {
    const frames = Math.round(beatSeconds(beat) * FPS);
    const entry = { id: beat.id, from, frames };
    from += frames - (i < storyboard.beats.length - 1 ? TRANSITION_FRAMES : 0);
    return entry;
  });
}

export function totalFrames(storyboard) {
  const tl = timeline(storyboard);
  if (tl.length === 0) return FPS;
  const last = tl[tl.length - 1];
  return last.from + last.frames;
}
