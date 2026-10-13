#!/usr/bin/env node
/**
 * Renders a storyboard with Remotion.
 *
 *   node scripts/video.mjs <storyboard.json> --stills <dir>       one PNG per beat, for review
 *   node scripts/video.mjs <storyboard.json> <out.mp4> [--draft]  the video (draft = half size)
 *
 * When audio/manifest.json exists next to the storyboard (scripts/voice.mjs),
 * each narrated beat plays its audio and lasts as long as it. --mute ignores it.
 *
 * The project is bundled once per run. The first run downloads Chrome
 * Headless Shell (~100 MB) into node_modules.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { TRANSITION_FRAMES, timeline } from "../lib/timing.mjs";

const ENGINE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
/** Removes `name` (and its value) from args and returns the value or true. */
function takeFlag(name, hasValue) {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const [, value] = args.splice(i, hasValue ? 2 : 1);
  return hasValue ? value : true;
}
const stillsDir = takeFlag("--stills", true);
const draft = takeFlag("--draft", false) === true;
const mute = takeFlag("--mute", false) === true;
const [input, output] = args;

if (!input || (!stillsDir && !output)) {
  console.error("Usage: node scripts/video.mjs <storyboard.json> (--stills <dir> | <out.mp4> [--draft] [--mute])");
  process.exit(2);
}

const storyboard = JSON.parse(readFileSync(input, "utf8"));
const storyDir = dirname(resolve(input));

// Attach narration audio. A beat whose text changed after voice.mjs ran
// stays silent, so a stale voice never plays over a new picture.
const audioDir = join(storyDir, "audio");
const manifestPath = join(audioDir, "manifest.json");
if (mute) {
  // A silent video is timed for reading, not for the voice.
  for (const beat of storyboard.beats) delete beat.narration;
} else if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const beat of storyboard.beats) {
    const a = manifest.beats?.[beat.id];
    if (!beat.narration) continue;
    if (a && a.text === beat.narration.trim()) beat.audio = { file: a.file, seconds: a.seconds };
    else console.warn(`⚠ ${beat.id}: narration changed or has no audio — run voice.mjs again`);
  }
} else if (storyboard.beats.some(b => b.narration)) {
  console.warn("⚠ The storyboard has narration but no audio/manifest.json — run voice.mjs first, or pass --mute");
}

await ensureBrowser();
console.log("Bundling…");
// Only the audio folder is public (Remotion copies the whole public dir into
// the bundle), so staticFile("<beat-id>.mp3") resolves to the narration.
const serveUrl = await bundle({
  entryPoint: join(ENGINE, "src/index.ts"),
  publicDir: existsSync(audioDir) ? audioDir : null,
});
const composition = await selectComposition({ serveUrl, id: "Showcase", inputProps: storyboard });

if (stillsDir) {
  // One frame per beat, after its animations finish and before the fade out.
  mkdirSync(stillsDir, { recursive: true });
  const tl = timeline(storyboard);
  for (const [i, beat] of storyboard.beats.entries()) {
    const { from, frames } = tl[i];
    const frame = from + Math.min(Math.round(frames * 0.9), frames - TRANSITION_FRAMES - 2);
    const file = resolve(stillsDir, `${String(i + 1).padStart(2, "0")}-${beat.id}.png`);
    await renderStill({ composition, serveUrl, output: file, frame, inputProps: storyboard, scale: 0.5 });
    console.log(`  ${file}`);
  }
} else {
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: resolve(output),
    inputProps: storyboard,
    scale: draft ? 0.5 : 1,
    crf: draft ? 28 : 18,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== last) console.log(`  ${pct}%`), (last = pct);
    },
  });
  console.log(`Wrote ${resolve(output)} (${(composition.durationInFrames / composition.fps).toFixed(1)}s)`);
}
