#!/usr/bin/env node
/**
 * Renders a storyboard with Remotion.
 *
 *   node scripts/video.mjs <storyboard.json> --stills <dir>       one PNG per beat, for review
 *   node scripts/video.mjs <storyboard.json> <out.mp4> [--draft]  the video (draft = half size)
 *
 * The project is bundled once per run. The first run downloads Chrome
 * Headless Shell (~100 MB) into node_modules.
 */
import { mkdirSync, readFileSync } from "node:fs";
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
const [input, output] = args;

if (!input || (!stillsDir && !output)) {
  console.error("Usage: node scripts/video.mjs <storyboard.json> (--stills <dir> | <out.mp4> [--draft])");
  process.exit(2);
}

const storyboard = JSON.parse(readFileSync(input, "utf8"));

await ensureBrowser();
console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: join(ENGINE, "src/index.ts") });
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
