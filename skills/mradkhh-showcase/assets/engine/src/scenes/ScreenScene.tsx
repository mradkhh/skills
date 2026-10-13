import type { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, progress, pulse, rise, stagger } from "../anim";
import { C } from "../theme";
import type { SceneProps, ScreenBeat, ScreenElementKind } from "../types";
import { CONTENT_H, CONTENT_W, DrawPath, NewBadge, SceneFrame } from "./Common";

// The mock screen is light, like a real app, so it reads as "the product"
// against the dark video background.
const S = { bg: "#f7f8fa", fg: "#1f2430", muted: "#8a90a0", line: "#e1e4ea", card: "#ffffff" };

const DEVICE = {
  phone: { x: 80, w: 420, pad: 24, top: 68, font: 27 },
  browser: { x: 0, w: 1000, pad: 40, top: 86, font: 28 },
} as const;

const HEIGHT: Record<ScreenElementKind, number> = {
  header: 80,
  text: 50,
  input: 78,
  button: 84,
  list: 180,
  card: 128,
  badge: 54,
  toast: 0,
};
const GAP = 16;

/**
 * A simplified phone or browser screen. Elements stack in order; the
 * highlighted one pulses and a callout explains it. A toast slides in
 * from the top near the end, like a real notification.
 */
export function ScreenScene({ beat, frames }: SceneProps<ScreenBeat>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = DEVICE[beat.device];
  const stacked = beat.elements.filter(e => e.kind !== "toast");
  const toast = beat.elements.find(e => e.kind === "toast");
  const n = stacked.length + (toast ? 1 : 0);

  let y = d.top;
  const placed = stacked.map(el => {
    const top = y;
    y += HEIGHT[el.kind] + GAP;
    return { el, top };
  });

  const toastAt = toast ? stagger(n - 1, n, frames) + 10 : 0;
  const hiIndex = placed.findIndex(p => p.el.highlight);
  const hiTop = toast?.highlight ? 18 : hiIndex >= 0 ? placed[hiIndex].top : -1;
  const hiHeight = toast?.highlight ? 92 : hiIndex >= 0 ? HEIGHT[placed[hiIndex].el.kind] : 0;
  const hiAt = toast?.highlight ? toastAt : hiIndex >= 0 ? stagger(hiIndex, n, frames) : stagger(n - 1, n, frames);
  const calloutAt = hiAt + 18;
  const calloutX = d.x + d.w + 160;
  const calloutY = hiTop >= 0 ? Math.min(Math.max(hiTop + hiHeight / 2 - 90, 0), CONTENT_H - 180) : CONTENT_H / 2 - 90;
  const glow = pulse(frame, hiAt + 10);

  return (
    <SceneFrame headline={beat.headline}>
      <div
        style={{
          position: "absolute",
          left: d.x,
          top: 0,
          width: d.w,
          height: CONTENT_H,
          overflow: "hidden",
          borderRadius: beat.device === "phone" ? 48 : 22,
          border: `10px solid ${C.border}`,
          boxSizing: "border-box",
          background: S.bg,
          fontSize: d.font,
          color: S.fg,
          ...rise(enter(frame, fps, 0)),
        }}
      >
        {beat.device === "phone" ? <PhoneBar /> : <BrowserBar />}
        {placed.map(({ el, top }, i) => {
          const p = enter(frame, fps, stagger(i, n, frames));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.pad,
                right: d.pad,
                top: top - 10,
                height: HEIGHT[el.kind],
                ...rise(p, 16),
              }}
            >
              <Element kind={el.kind} label={el.label} highlight={!!el.highlight} glow={glow} />
            </div>
          );
        })}
        {toast && (
          <div
            style={{
              position: "absolute",
              left: d.pad,
              right: d.pad,
              top: 18 + (1 - enter(frame, fps, toastAt)) * -120,
              height: 92,
            }}
          >
            <Element kind="toast" label={toast.label} highlight={!!toast.highlight} glow={glow} />
          </div>
        )}
      </div>

      {hiTop >= 0 && (
        <svg width={CONTENT_W} height={CONTENT_H} style={{ position: "absolute", inset: 0 }}>
          <DrawPath
            d={`M${d.x + d.w - d.pad + 6},${hiTop + hiHeight / 2 - 10} L${calloutX - 20},${calloutY + 90}`}
            length={Math.hypot(calloutX - d.x - d.w, calloutY + 90 - hiTop)}
            p={progress(frame, calloutAt - 12, calloutAt)}
            color={C.accent}
            width={5}
          />
        </svg>
      )}
      {beat.caption && (
        <div
          style={{
            position: "absolute",
            left: calloutX,
            top: calloutY,
            width: CONTENT_W - calloutX,
            boxSizing: "border-box",
            padding: "32px 40px",
            borderRadius: 28,
            background: C.surface,
            borderLeft: `8px solid ${C.accent}`,
            fontSize: 42,
            lineHeight: 1.3,
            ...rise(enter(frame, fps, calloutAt), 24),
          }}
        >
          {beat.caption}
        </div>
      )}
    </SceneFrame>
  );
}

function PhoneBar() {
  return (
    <div style={{ position: "absolute", top: 14, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 110, height: 26, borderRadius: 13, background: S.fg }} />
    </div>
  );
}

function BrowserBar() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: S.card,
        borderBottom: `2px solid ${S.line}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 20px",
      }}
    >
      {["#ff5f57", "#febc2e", "#28c840"].map(c => (
        <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
      ))}
      <div style={{ marginLeft: 20, flex: 1, height: 30, borderRadius: 15, background: S.bg }} />
    </div>
  );
}

function Bar({ w, h = 12 }: { w: string; h?: number }) {
  return <div style={{ width: w, height: h, borderRadius: h / 2, background: S.line }} />;
}

function Element({
  kind,
  label,
  highlight,
  glow,
}: {
  kind: ScreenElementKind;
  label: string;
  highlight: boolean;
  glow: number;
}) {
  const ring: CSSProperties = highlight
    ? { boxShadow: `0 0 0 ${4 + glow * 6}px ${C.accent}66`, borderRadius: 14 }
    : {};
  const badge = highlight ? (
    <div style={{ position: "absolute", top: -22, right: -8, zIndex: 2 }}>
      <NewBadge p={1} />
    </div>
  ) : null;
  const box: CSSProperties = { position: "relative", height: "100%", boxSizing: "border-box", ...ring };

  switch (kind) {
    case "header":
      return (
        <div style={{ ...box, display: "flex", alignItems: "center", fontSize: "1.3em", fontWeight: 700, borderBottom: `2px solid ${S.line}` }}>
          {label}
          {badge}
        </div>
      );
    case "text":
      return (
        <div style={{ ...box, display: "flex", alignItems: "center", color: S.muted }}>
          {label}
          {badge}
        </div>
      );
    case "input":
      return (
        <div style={{ ...box, display: "flex", alignItems: "center", padding: "0 18px", border: `2px solid ${S.line}`, borderRadius: 14, background: S.card, color: S.muted }}>
          {label}
          {badge}
        </div>
      );
    case "button":
      return (
        <div
          style={{
            ...box,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
            background: highlight ? C.accent : S.fg,
            color: "#ffffff",
            fontWeight: 700,
          }}
        >
          {label}
          {badge}
        </div>
      );
    case "list":
      return (
        <div style={{ ...box, display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
          <div style={{ fontWeight: 700 }}>{label}</div>
          {[0, 1, 2].map(r => (
            <div key={r} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: S.line }} />
              <Bar w={`${70 - r * 12}%`} />
            </div>
          ))}
          {badge}
        </div>
      );
    case "card":
      return (
        <div
          style={{
            ...box,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 12,
            padding: "0 20px",
            borderRadius: 16,
            background: S.card,
            border: `2px solid ${S.line}`,
          }}
        >
          <div style={{ fontWeight: 700 }}>{label}</div>
          <Bar w="80%" />
          <Bar w="55%" />
          {badge}
        </div>
      );
    case "badge":
      return (
        <div style={{ ...box, display: "inline-flex", alignItems: "center", padding: "0 18px", borderRadius: 22, border: `2px solid ${highlight ? C.accent : S.line}`, fontWeight: 700 }}>
          {label}
          {badge}
        </div>
      );
    case "toast":
      return (
        <div
          style={{
            ...box,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 18px",
            borderRadius: 16,
            background: S.fg,
            color: "#ffffff",
            boxShadow: highlight ? ring.boxShadow : "0 12px 30px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              flex: "none",
              width: 34,
              height: 34,
              borderRadius: 17,
              background: C.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            ✓
          </div>
          <div style={{ lineHeight: 1.2 }}>{label}</div>
          {badge}
        </div>
      );
  }
}
