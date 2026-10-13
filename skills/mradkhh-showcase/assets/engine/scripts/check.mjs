#!/usr/bin/env node
/**
 * Checks a storyboard before anything is rendered.
 *
 *   node scripts/check.mjs <storyboard.json> [--fix]
 *
 * Errors (exit 1): broken structure, text that will not fit, code on screen,
 * beats without a fact, numbers without a source.
 * Warnings: jargon, numbers in plain text, ASCII apostrophes. Review each one.
 * --fix rewrites Uzbek apostrophes (o' g' → o‘ g‘, other ' → ’) in place.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { FPS, beatSeconds, beatTexts, timeline, totalFrames } from "../lib/timing.mjs";

const [file, ...flags] = process.argv.slice(2);
if (!file) {
  console.error("Usage: node scripts/check.mjs <storyboard.json> [--fix]");
  process.exit(2);
}
const fix = flags.includes("--fix");
const jargon = JSON.parse(readFileSync(new URL("./jargon.json", import.meta.url), "utf8"));

let sb;
try {
  sb = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`✗ ${file}: ${e.message}`);
  process.exit(1);
}

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

// Character limits keep text inside its box on a 1920×1080 frame and a
// 13.33×7.5 in slide. Raise one only after you checked the stills.
const MAX = {
  title: 70,
  subtitle: 90,
  headline: 40,
  point: 70,
  stepLabel: 32,
  actor: 18,
  question: 60,
  when: 28,
  then: 48,
  sideTitle: 16,
  sidePoint: 48,
  metricValue: 10,
  metricLabel: 40,
  source: 110,
  elementLabel: { phone: 26, browser: 40 },
  caption: 120,
};
const COUNT = {
  beats: [4, 10],
  points: [2, 4],
  closing: [1, 4],
  steps: [2, 5],
  options: [2, 3],
  sidePoints: [1, 3],
  metrics: [1, 3],
  elements: [1, 6],
};
// Same heights as src/scenes/ScreenScene.tsx, to catch an overfull phone.
const ELEMENT_H = { header: 80, text: 50, input: 78, button: 84, list: 180, card: 128, badge: 54, toast: 0 };
const PHONE_SPACE = 620 - 68 - 20;
const TYPES = ["title", "points", "flow", "branch", "compare", "metric", "screen", "closing"];
const NEEDS_FACTS = ["points", "flow", "branch", "compare", "screen"];

function text(where, value, max, required = true) {
  if (value === undefined || value === null || value === "") {
    if (required) err(where, "is required");
    return;
  }
  if (typeof value !== "string") return err(where, "must be a string");
  if (value.length > max) err(where, `${value.length} chars, max ${max}: "${value}"`);
}

function count(where, list, [min, max]) {
  if (!Array.isArray(list)) return err(where, "must be a list"), false;
  if (list.length < min || list.length > max) err(where, `${list.length} items, need ${min}–${max}`);
  return true;
}

// ---- structure -----------------------------------------------------------

text("title", sb.title, MAX.title);
if (count("beats", sb.beats, COUNT.beats)) {
  const ids = new Set();
  sb.beats.forEach((b, i) => {
    const at = `beats[${i}]${b?.id ? ` (${b.id})` : ""}`;
    if (!b || typeof b !== "object") return err(at, "must be an object");
    if (!b.id || !/^[a-z0-9-]+$/.test(b.id)) err(at, "id must be kebab-case");
    if (ids.has(b.id)) err(at, "duplicate id");
    ids.add(b.id);
    if (!TYPES.includes(b.type)) return err(at, `type must be one of ${TYPES.join(", ")}`);

    text(`${at}.headline`, b.headline, b.type === "title" ? MAX.title : MAX.headline);
    if (NEEDS_FACTS.includes(b.type) && !(Array.isArray(b.facts) && b.facts.length > 0)) {
      err(at, "facts is empty — every claim needs an ID from facts.md");
    }

    switch (b.type) {
      case "title":
        text(`${at}.subtitle`, b.subtitle, MAX.subtitle, false);
        break;
      case "points":
      case "closing":
        if (count(`${at}.points`, b.points, b.type === "points" ? COUNT.points : COUNT.closing)) {
          b.points.forEach((p, j) => text(`${at}.points[${j}]`, p, MAX.point));
        }
        break;
      case "flow":
        if (count(`${at}.steps`, b.steps, COUNT.steps)) {
          b.steps.forEach((s, j) => {
            text(`${at}.steps[${j}].label`, s.label, MAX.stepLabel);
            text(`${at}.steps[${j}].actor`, s.actor, MAX.actor, false);
          });
        }
        break;
      case "branch":
        text(`${at}.question`, b.question, MAX.question);
        if (count(`${at}.options`, b.options, COUNT.options)) {
          b.options.forEach((o, j) => {
            text(`${at}.options[${j}].when`, o.when, MAX.when);
            text(`${at}.options[${j}].then`, o.then, MAX.then);
          });
        }
        break;
      case "compare":
        for (const side of ["before", "after"]) {
          if (!b[side]) {
            err(`${at}.${side}`, "is required");
            continue;
          }
          text(`${at}.${side}.title`, b[side].title, MAX.sideTitle);
          if (count(`${at}.${side}.points`, b[side].points, COUNT.sidePoints)) {
            b[side].points.forEach((p, j) => text(`${at}.${side}.points[${j}]`, p, MAX.sidePoint));
          }
        }
        break;
      case "metric":
        text(`${at}.source`, b.source, MAX.source);
        if (count(`${at}.metrics`, b.metrics, COUNT.metrics)) {
          b.metrics.forEach((m, j) => {
            text(`${at}.metrics[${j}].value`, m.value, MAX.metricValue);
            text(`${at}.metrics[${j}].label`, m.label, MAX.metricLabel);
          });
        }
        break;
      case "screen": {
        if (!["phone", "browser"].includes(b.device)) err(`${at}.device`, "must be phone or browser");
        text(`${at}.caption`, b.caption, MAX.caption, false);
        if (count(`${at}.elements`, b.elements, COUNT.elements)) {
          const max = MAX.elementLabel[b.device] ?? MAX.elementLabel.phone;
          b.elements.forEach((e, j) => {
            if (!(e.kind in ELEMENT_H)) err(`${at}.elements[${j}].kind`, `must be one of ${Object.keys(ELEMENT_H).join(", ")}`);
            text(`${at}.elements[${j}].label`, e.label, max);
          });
          if (b.elements.filter(e => e.kind === "toast").length > 1) err(`${at}.elements`, "at most one toast");
          const used = b.elements.reduce((h, e) => h + (ELEMENT_H[e.kind] ?? 0) + (e.kind === "toast" ? 0 : 16), 0);
          if (used > PHONE_SPACE) err(`${at}.elements`, `do not fit on the screen (${used}px of ${PHONE_SPACE}px) — drop or merge some`);
          if (b.elements.filter(e => e.highlight).length > 1) warn(`${at}.elements`, "more than one highlight; only the first gets the callout");
        }
        break;
      }
    }
  });
}

// ---- words ---------------------------------------------------------------

const CODE_PATTERNS = [
  [/[a-z][A-Z]/, "camelCase identifier"],
  [/\b\w+_\w+\b/, "snake_case identifier"],
  [/[`{}<>]|\(\)|=>/, "code symbols"],
  [/\b[\w-]+\.(ts|tsx|js|jsx|mjs|py|php|go|rb|java|kt|swift|sql|json|yaml|yml)\b/i, "file name"],
  [/(^|\s)\/?[\w-]+\/[\w-]+\//, "file path"],
  [/\b(GET|POST|PUT|PATCH|DELETE)\s+\//, "HTTP route"],
  [/\b[1-5]\d\d\b.*\b(error|xato|status)\b/i, "HTTP status code"],
];

function tokens(s) {
  return s
    .toLowerCase()
    .split(/[^\p{L}\p{N}'‘’ʻʼ-]+/u)
    .map(t => t.split(/['‘’ʻʼ]/)[0])
    .filter(Boolean);
}

function jargonIn(s) {
  const lower = s.toLowerCase().replace(/[‘’ʻʼ]/g, "'");
  const toks = tokens(s);
  return jargon.filter(term =>
    term.includes(" ")
      ? lower.includes(term)
      : toks.some(t => t === term || (term.length >= 5 && t.startsWith(term)))
  );
}

const fixApostrophes = s =>
  s.replace(/([OoGg])'/g, "$1‘").replace(/(\p{L})'(\p{L})/gu, "$1’$2");

let changed = false;
for (const [i, b] of (sb.beats ?? []).entries()) {
  const at = `beats[${i}] (${b.id})`;
  for (const t of beatTexts(b)) {
    for (const [re, what] of CODE_PATTERNS) {
      if (re.test(t)) err(at, `${what} on screen: "${t}" — say what it does for the user instead`);
    }
    const found = jargonIn(t);
    if (found.length) warn(at, `jargon (${found.join(", ")}): "${t}" — see PLAIN.md`);
    if (b.type !== "metric" && b.type !== "screen" && /\d/.test(t)) {
      warn(at, `number in "${t}" — keep it only if the user or the code gave it`);
    }
    if (t.includes("'")) {
      if (!fix) warn(at, `ASCII apostrophe in "${t}" — run with --fix`);
    }
  }
}

if (fix) {
  const walk = v =>
    typeof v === "string"
      ? (() => {
          const f = fixApostrophes(v);
          if (f !== v) changed = true;
          return f;
        })()
      : Array.isArray(v)
        ? v.map(walk)
        : v && typeof v === "object"
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === "id" || k === "type" ? x : walk(x)]))
          : v;
  sb = walk(sb);
  if (changed) {
    writeFileSync(file, JSON.stringify(sb, null, 2) + "\n");
    console.log(`Fixed apostrophes in ${file}`);
  }
}

// ---- report --------------------------------------------------------------

if (errors.length === 0 && Array.isArray(sb.beats)) {
  const tl = timeline(sb);
  const total = totalFrames(sb) / FPS;
  console.log("Timeline (no narration — every beat stays long enough to read):");
  sb.beats.forEach((b, i) => {
    const start = (tl[i].from / FPS).toFixed(1).padStart(5);
    console.log(`  ${start}s  ${beatSeconds(b).toFixed(1).padStart(4)}s  ${b.type.padEnd(8)} ${b.id}`);
  });
  console.log(`  total ${total.toFixed(1)}s`);
  if (total > 150) warn("video", `${total.toFixed(0)}s is long for a client — cut beats`);
  if (total < 30) warn("video", `${total.toFixed(0)}s is short — the story may be missing a part`);
}

for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.log(`✗ ${e}`);
console.log(errors.length ? `\n${errors.length} error(s), ${warnings.length} warning(s).` : `\nOK — ${warnings.length} warning(s) to review.`);
process.exit(errors.length ? 1 : 0);
