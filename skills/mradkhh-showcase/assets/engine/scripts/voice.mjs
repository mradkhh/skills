#!/usr/bin/env node
/**
 * Turns each beat's `narration` into speech with Microsoft Edge's online
 * Read Aloud voices (edge-tts), which include Uzbek.
 *
 *   node scripts/voice.mjs <storyboard.json> [--voice uz-UZ-MadinaNeural]
 *   node scripts/voice.mjs --list [uz]          voices for a locale prefix
 *
 * Writes audio/<beat-id>.mp3 and audio/manifest.json next to the storyboard;
 * manifest file names are relative to that audio folder.
 * A beat is synthesized again only when its text or the voice changed.
 * video.mjs reads the manifest and times each beat to its audio.
 *
 * The narration text is sent to Microsoft's servers. Ask before you use it
 * with confidential client material.
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const DEFAULT_VOICE = "uz-UZ-SardorNeural";
// Constant bitrate, so the duration follows from the file size.
const FORMAT = OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3;
const BITS_PER_SECOND = 96_000;

const args = process.argv.slice(2);

if (args[0] === "--list") {
  const prefix = args[1] ?? "uz";
  const voices = await new MsEdgeTTS().getVoices();
  for (const v of voices.filter(v => v.Locale.startsWith(prefix))) {
    console.log(`${v.ShortName}\t${v.Gender}`);
  }
  process.exit(0);
}

const voiceAt = args.indexOf("--voice");
const voiceArg = voiceAt === -1 ? undefined : args.splice(voiceAt, 2)[1];
const [input] = args;
if (!input) {
  console.error("Usage: node scripts/voice.mjs <storyboard.json> [--voice <name>] | --list [locale]");
  process.exit(2);
}

const storyboard = JSON.parse(readFileSync(input, "utf8"));
const voice = voiceArg ?? storyboard.voice ?? DEFAULT_VOICE;
const audioDir = join(dirname(resolve(input)), "audio");
const manifestPath = join(audioDir, "manifest.json");
mkdirSync(audioDir, { recursive: true });

const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { beats: {} };
const manifest = { voice, beats: {} };

const escapeXml = s =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let made = 0;
for (const beat of storyboard.beats) {
  const text = beat.narration?.trim();
  if (!text) continue;
  const file = `${beat.id}.mp3`;
  const path = join(audioDir, file);
  const old = previous.beats?.[beat.id];

  if (!(old && old.text === text && previous.voice === voice && existsSync(path))) {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, FORMAT);
    const { audioStream } = tts.toStream(escapeXml(text));
    await pipeline(audioStream, createWriteStream(path));
    tts.close();
    made++;
  }

  const seconds = Math.round(((statSync(path).size * 8) / BITS_PER_SECOND) * 100) / 100;
  if (seconds < 0.3) throw new Error(`${beat.id}: the voice service returned no audio — check the voice name and the network`);
  manifest.beats[beat.id] = { text, file, seconds };
  console.log(`  ${beat.id.padEnd(12)} ${seconds.toFixed(1).padStart(5)}s`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const count = Object.keys(manifest.beats).length;
console.log(count ? `${count} narrated beat(s), ${made} synthesized, voice ${voice}.` : "No beat has narration; nothing to do.");
