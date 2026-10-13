#!/usr/bin/env node
/**
 * Builds an editable .pptx deck from a storyboard: one slide per beat, made
 * of native shapes and text (no images), with the beat's notes as speaker
 * notes. The layouts mirror the video scenes, so deck and video match.
 *
 *   node scripts/deck.mjs <storyboard.json> <out.pptx>
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pptxgen from "pptxgenjs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node scripts/deck.mjs <storyboard.json> <out.pptx>");
  process.exit(2);
}

const sb = JSON.parse(readFileSync(input, "utf8"));
const brand = JSON.parse(readFileSync(new URL("../brand.json", import.meta.url), "utf8"));
const D = Object.fromEntries(
  Object.entries(brand.deck).map(([k, v]) => [k, typeof v === "string" ? v.replace("#", "") : v])
);
const HEAD = brand.deck.headingFont;
const BODY = brand.deck.bodyFont;

// Slide geometry in inches (16:9, 13.333 × 7.5). Content sits in X..X+W, TOP..BOTTOM.
const X = 0.6;
const W = 12.13;
const TOP = 1.75;
const BOTTOM = 6.6;
const H = BOTTOM - TOP;

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.title = sb.title;
pptx.author = brand.name;
pptx.company = brand.name;

pptx.defineSlideMaster({
  title: "BRAND",
  background: { color: D.background },
  objects: [
    {
      text: {
        text: `● ${brand.name}`,
        options: { x: X, y: 6.95, w: 3, h: 0.35, fontFace: HEAD, fontSize: 11, bold: true, color: D.muted, margin: 0 },
      },
    },
  ],
  slideNumber: { x: 12.2, y: 6.95, w: 0.55, h: 0.35, fontFace: BODY, fontSize: 10, color: D.muted, align: "right" },
});

const S = pptx.ShapeType;

function headline(slide, text) {
  slide.addShape(S.rect, { x: X, y: 0.55, w: 0.7, h: 0.07, fill: { color: D.accent }, line: { type: "none" } });
  slide.addText(text, {
    x: X, y: 0.72, w: W, h: 0.8, margin: 0,
    fontFace: HEAD, fontSize: 30, bold: true, color: D.foreground, valign: "top",
  });
}

function box(slide, { x, y, w, h, highlight = false, fill = D.surface, radius = 0.18 }) {
  slide.addShape(S.roundRect, {
    x, y, w, h, rectRadius: radius,
    fill: { color: fill },
    line: { color: highlight ? D.accent : D.border, width: highlight ? 2.5 : 1 },
  });
}

function newBadge(slide, x, y) {
  slide.addText(brand.labels.new.toUpperCase(), {
    shape: S.roundRect, rectRadius: 0.17, x, y, w: 0.95, h: 0.34, margin: 0,
    fill: { color: D.accent }, line: { type: "none" },
    fontFace: BODY, fontSize: 10, bold: true, color: D.accentForeground, align: "center", valign: "middle",
  });
}

/** A straight connector; pptx lines go top-left → bottom-right, so flip for upward ones. */
function arrow(slide, x1, y1, x2, y2, { color = D.muted, width = 1.75, head = true } = {}) {
  slide.addShape(S.line, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipV: y2 < y1,
    line: { color, width, endArrowType: head ? "triangle" : "none" },
  });
}

// ---- one renderer per beat type ------------------------------------------

const render = {
  title(slide, b) {
    const meta = [sb.client, sb.date].filter(Boolean).join(" · ");
    if (meta) slide.addText(meta, { x: 0.9, y: 1.7, w: 11, h: 0.45, margin: 0, fontFace: BODY, fontSize: 16, color: D.muted });
    slide.addText(b.headline, {
      x: 0.9, y: 2.2, w: 11.4, h: 1.9, margin: 0, valign: "bottom",
      fontFace: HEAD, fontSize: 44, bold: true, color: D.foreground,
    });
    slide.addShape(S.rect, { x: 0.9, y: 4.35, w: 1.6, h: 0.09, fill: { color: D.accent }, line: { type: "none" } });
    if (b.subtitle) {
      slide.addText(b.subtitle, { x: 0.9, y: 4.65, w: 11.4, h: 0.8, margin: 0, valign: "top", fontFace: BODY, fontSize: 22, color: D.muted });
    }
  },

  points(slide, b) {
    headline(slide, b.headline);
    const rowH = Math.min(1.05, H / b.points.length);
    b.points.forEach((p, i) => {
      const y = TOP + 0.15 + i * rowH;
      slide.addText(String(i + 1), {
        shape: S.ellipse, x: X, y, w: 0.6, h: 0.6, margin: 0,
        fill: { color: D.background }, line: { color: D.accent, width: 2.25 },
        fontFace: HEAD, fontSize: 18, bold: true, color: D.accent, align: "center", valign: "middle",
      });
      slide.addText(p, { x: X + 0.9, y: y - 0.1, w: W - 0.9, h: 0.8, margin: 0, valign: "middle", fontFace: BODY, fontSize: 24, color: D.foreground });
    });
  },

  closing(slide, b) {
    headline(slide, b.headline);
    b.points.forEach((p, i) => {
      const y = TOP + 0.15 + i * 0.95;
      slide.addText("✓", {
        shape: S.roundRect, rectRadius: 0.1, x: X, y, w: 0.6, h: 0.6, margin: 0,
        fill: { color: D.background }, line: { color: D.accent, width: 2.25 },
        fontFace: BODY, fontSize: 20, bold: true, color: D.accent, align: "center", valign: "middle",
      });
      slide.addText(p, { x: X + 0.9, y: y - 0.1, w: W - 0.9, h: 0.8, margin: 0, valign: "middle", fontFace: BODY, fontSize: 24, color: D.foreground });
    });
    slide.addText(
      [
        { text: `● ${brand.name}`, options: { fontFace: HEAD, fontSize: 26, bold: true, color: D.foreground, breakLine: true } },
        { text: brand.url, options: { fontFace: BODY, fontSize: 14, color: D.muted } },
      ],
      { x: 8.7, y: 5.6, w: 4.03, h: 1.0, margin: 0, align: "right", valign: "bottom" }
    );
  },

  flow(slide, b) {
    headline(slide, b.headline);
    const n = b.steps.length;
    const gap = 0.55;
    const w = (W - gap * (n - 1)) / n;
    const h = 1.9;
    const y = TOP + (H - h) / 2 + 0.25;
    const size = n <= 3 ? 22 : n === 4 ? 19 : 16;
    b.steps.forEach((s, i) => {
      const x = X + i * (w + gap);
      if (s.actor) {
        slide.addText(s.actor.toUpperCase(), { x, y: y - 0.5, w, h: 0.4, margin: 0, fontFace: BODY, fontSize: 12, bold: true, charSpacing: 1.5, color: D.muted });
      }
      box(slide, { x, y, w, h, highlight: s.highlight });
      slide.addText(s.label, { x: x + 0.2, y, w: w - 0.4, h, margin: 0, valign: "middle", fontFace: BODY, fontSize: size, color: D.foreground });
      if (s.highlight) newBadge(slide, x + w - 1.1, y - 0.18);
      if (i < n - 1) arrow(slide, x + w + 0.08, y + h / 2, x + w + gap - 0.1, y + h / 2);
    });
  },

  branch(slide, b) {
    headline(slide, b.headline);
    const qx = X, qw = 3.9, qh = 2.3, qy = TOP + (H - qh) / 2;
    box(slide, { x: qx, y: qy, w: qw, h: qh });
    slide.addText("?", {
      shape: S.ellipse, x: qx + 0.3, y: qy + 0.3, w: 0.55, h: 0.55, margin: 0,
      fill: { color: D.accent }, line: { type: "none" },
      fontFace: HEAD, fontSize: 20, bold: true, color: D.accentForeground, align: "center", valign: "middle",
    });
    slide.addText(b.question, { x: qx + 0.3, y: qy + 0.95, w: qw - 0.6, h: qh - 1.15, margin: 0, valign: "top", fontFace: BODY, fontSize: 22, color: D.foreground });

    const n = b.options.length;
    const ox = 6.0, ow = X + W - ox, oh = 1.2, og = 0.35;
    const top = TOP + (H - (n * oh + (n - 1) * og)) / 2;
    b.options.forEach((o, i) => {
      const y = top + i * (oh + og);
      arrow(slide, qx + qw, qy + qh / 2, ox - 0.08, y + oh / 2, o.highlight ? { color: D.accent, width: 2.5 } : {});
      box(slide, { x: ox, y, w: ow, h: oh, highlight: o.highlight });
      slide.addText(
        [
          { text: o.when.toUpperCase(), options: { fontSize: 12, bold: true, charSpacing: 1.5, color: o.highlight ? D.accent : D.muted, breakLine: true } },
          { text: o.then, options: { fontSize: 20, color: D.foreground } },
        ],
        { x: ox + 0.3, y, w: ow - 0.6, h: oh, margin: 0, valign: "middle", fontFace: BODY, paraSpaceAfter: 4 }
      );
      if (o.highlight) newBadge(slide, ox + ow - 1.15, y - 0.18);
    });
  },

  compare(slide, b) {
    headline(slide, b.headline);
    const cw = 5.4, ch = H - 0.1;
    const sides = [
      [b.before, X, false],
      [b.after, X + W - cw, true],
    ];
    for (const [side, x, isAfter] of sides) {
      box(slide, { x, y: TOP, w: cw, h: ch, highlight: isAfter });
      slide.addText(side.title, {
        shape: S.roundRect, rectRadius: 0.2, x: x + 0.35, y: TOP + 0.35, w: Math.max(1.2, side.title.length * 0.14 + 0.6), h: 0.45, margin: 0,
        fill: { color: isAfter ? D.accent : D.border }, line: { type: "none" },
        fontFace: HEAD, fontSize: 15, bold: true, color: isAfter ? D.accentForeground : D.foreground, align: "center", valign: "middle",
      });
      slide.addText(
        side.points.map(p => ({
          text: p,
          options: { bullet: isAfter ? { characterCode: "2713", indent: 22 } : { indent: 22 }, breakLine: true },
        })),
        { x: x + 0.35, y: TOP + 1.1, w: cw - 0.7, h: ch - 1.4, margin: 0, valign: "top", fontFace: BODY, fontSize: 20, color: isAfter ? D.foreground : D.muted, paraSpaceAfter: 14 }
      );
    }
    arrow(slide, X + cw + 0.2, TOP + ch / 2, X + W - cw - 0.2, TOP + ch / 2, { color: D.accent, width: 3 });
  },

  metric(slide, b) {
    headline(slide, b.headline);
    const n = b.metrics.length;
    const cw = W / n;
    b.metrics.forEach((m, i) => {
      const x = X + i * cw;
      slide.addShape(S.rect, { x, y: TOP + 0.4, w: 0.6, h: 0.06, fill: { color: D.accent }, line: { type: "none" } });
      slide.addText(m.value, { x, y: TOP + 0.6, w: cw - 0.3, h: 1.4, margin: 0, valign: "middle", fontFace: HEAD, fontSize: n === 1 ? 88 : 66, bold: true, color: D.accent });
      slide.addText(m.label, { x, y: TOP + 2.1, w: cw - 0.3, h: 0.9, margin: 0, valign: "top", fontFace: BODY, fontSize: 20, color: D.foreground });
    });
    slide.addText(`${brand.labels.source}: ${b.source}`, { x: X, y: BOTTOM - 0.4, w: W, h: 0.35, margin: 0, fontFace: BODY, fontSize: 12, color: D.muted });
  },

  screen(slide, b) {
    headline(slide, b.headline);
    const phone = b.device === "phone";
    // Same pixel layout as ScreenScene.tsx, scaled to inches.
    const dev = phone ? { x: 1.0, w: 2.75, pxW: 420, top: 68, pad: 24 } : { x: X, w: 6.6, pxW: 1000, top: 86, pad: 40 };
    const k = dev.w / dev.pxW;
    const devH = H;
    const HEIGHT = { header: 80, text: 50, input: 78, button: 84, list: 180, card: 128, badge: 54 };
    const font = phone ? 11 : 13;
    const screen = { bg: "F7F8FA", fg: "1F2430", muted: "8A90A0", line: "E1E4EA", card: "FFFFFF" };

    slide.addShape(S.roundRect, {
      x: dev.x, y: TOP, w: dev.w, h: devH, rectRadius: phone ? 0.3 : 0.12,
      fill: { color: screen.bg }, line: { color: D.border, width: 4 },
    });
    if (phone) {
      slide.addShape(S.roundRect, { x: dev.x + dev.w / 2 - 0.36, y: TOP + 0.1, w: 0.72, h: 0.17, rectRadius: 0.08, fill: { color: screen.fg }, line: { type: "none" } });
    } else {
      slide.addShape(S.rect, { x: dev.x + 0.04, y: TOP + 0.04, w: dev.w - 0.08, h: 0.36, fill: { color: screen.card }, line: { color: screen.line, width: 1 } });
    }

    const ix = dev.x + dev.pad * k;
    const iw = dev.w - 2 * dev.pad * k;
    let y = TOP + dev.top * k;
    let hi = null;
    const toast = b.elements.find(e => e.kind === "toast");
    for (const el of b.elements.filter(e => e.kind !== "toast")) {
      const h = HEIGHT[el.kind] * k;
      drawElement(slide, el, ix, y, iw, h, font, screen);
      if (el.highlight && !hi) hi = { y, h };
      y += h + 16 * k;
    }
    if (toast) {
      // A static slide cannot slide the toast in, so it sits at the bottom like a snackbar.
      const h = 92 * k;
      const ty = TOP + devH - h - dev.pad * k;
      drawElement(slide, toast, ix, ty, iw, h, font, screen);
      if (toast.highlight && !hi) hi = { y: ty, h };
    }

    if (b.caption) {
      const cx = dev.x + dev.w + 1.0;
      const cw = X + W - cx;
      const chh = 1.4;
      const cy = hi ? Math.min(Math.max(hi.y + hi.h / 2 - chh / 2, TOP), BOTTOM - chh) : TOP + (H - chh) / 2;
      if (hi) arrow(slide, ix + iw + 0.05, hi.y + hi.h / 2, cx - 0.05, cy + chh / 2, { color: D.accent, width: 2, head: false });
      slide.addShape(S.rect, { x: cx, y: cy, w: 0.08, h: chh, fill: { color: D.accent }, line: { type: "none" } });
      slide.addText(b.caption, {
        x: cx + 0.08, y: cy, w: cw - 0.08, h: chh, margin: 14, valign: "middle",
        fill: { color: D.surface }, fontFace: BODY, fontSize: 20, color: D.foreground,
      });
    }
  },
};

function drawElement(slide, el, x, y, w, h, font, s) {
  const ring = el.highlight ? { color: D.accent, width: 2.5 } : null;
  const text = (t, o = {}) => slide.addText(t, { x, y, w, h, margin: 6, valign: "middle", fontFace: BODY, fontSize: font, color: s.fg, ...o });
  const bar = (bx, by, bw) => slide.addShape(S.roundRect, { x: bx, y: by, w: bw, h: 0.06, rectRadius: 0.03, fill: { color: s.line }, line: { type: "none" } });

  switch (el.kind) {
    case "header":
      text(el.label, { fontSize: font * 1.3, bold: true, margin: 0 });
      slide.addShape(S.line, { x, y: y + h, w, h: 0, line: { color: s.line, width: 1 } });
      break;
    case "text":
      text(el.label, { color: s.muted, margin: 0 });
      break;
    case "input":
      text(el.label, { shape: S.roundRect, rectRadius: 0.06, fill: { color: s.card }, line: ring ?? { color: s.line, width: 1 }, color: s.muted });
      break;
    case "button":
      text(el.label, { shape: S.roundRect, rectRadius: 0.06, fill: { color: el.highlight ? D.accent : s.fg }, line: { type: "none" }, color: "FFFFFF", bold: true, align: "center" });
      break;
    case "list":
      slide.addText(el.label, { x, y, w, h: h * 0.25, margin: 0, fontFace: BODY, fontSize: font, bold: true, color: s.fg });
      for (let r = 0; r < 3; r++) {
        const ry = y + h * 0.32 + r * h * 0.22;
        slide.addShape(S.roundRect, { x, y: ry, w: 0.17, h: 0.17, rectRadius: 0.04, fill: { color: s.line }, line: { type: "none" } });
        bar(x + 0.27, ry + 0.06, (w - 0.3) * (0.7 - r * 0.12));
      }
      break;
    case "card":
      slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: s.card }, line: ring ?? { color: s.line, width: 1 } });
      slide.addText(el.label, { x: x + 0.1, y: y + h * 0.12, w: w - 0.2, h: h * 0.35, margin: 0, fontFace: BODY, fontSize: font, bold: true, color: s.fg });
      bar(x + 0.1, y + h * 0.58, (w - 0.2) * 0.8);
      bar(x + 0.1, y + h * 0.76, (w - 0.2) * 0.55);
      break;
    case "badge":
      text(el.label, { shape: S.roundRect, rectRadius: h / 2, w: Math.min(w, el.label.length * font * 0.011 + 0.4), fill: { color: s.card }, line: ring ?? { color: s.line, width: 1 }, bold: true });
      break;
    case "toast":
      text(`✓  ${el.label}`, { shape: S.roundRect, rectRadius: 0.08, fill: { color: s.fg }, line: ring ?? { type: "none" }, color: "FFFFFF" });
      break;
  }
  if (el.highlight) {
    if (["header", "text", "list"].includes(el.kind)) {
      slide.addShape(S.roundRect, { x: x - 0.04, y: y - 0.04, w: w + 0.08, h: h + 0.08, rectRadius: 0.06, fill: { type: "none" }, line: ring });
    }
    newBadge(slide, x + w - 0.85, y - 0.2);
  }
}

for (const beat of sb.beats) {
  const slide = pptx.addSlide({ masterName: "BRAND" });
  render[beat.type](slide, beat);
  // Speaker notes: what to say. The narration is a good default when there are no notes.
  const notes = beat.notes ?? beat.narration;
  if (notes) slide.addNotes(notes);
}

await pptx.writeFile({ fileName: resolve(output) });
console.log(`Wrote ${resolve(output)} (${sb.beats.length} slides)`);
