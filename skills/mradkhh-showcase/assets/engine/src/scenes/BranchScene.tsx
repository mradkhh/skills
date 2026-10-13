import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, progress, pulse, rise, stagger } from "../anim";
import { C, FONT } from "../theme";
import type { BranchBeat, SceneProps } from "../types";
import { CONTENT_H, DrawPath, NewBadge, SceneFrame } from "./Common";

const Q_W = 560;
const Q_H = 280;
const OPT_X = 820;
const OPT_W = 860;
const OPT_H = 170;
const OPT_GAP = 40;

/** A question on the left; each answer grows a line to its outcome. */
export function BranchScene({ beat, frames }: SceneProps<BranchBeat>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = beat.options.length;
  const qY = (CONTENT_H - Q_H) / 2;
  const qMid = qY + Q_H / 2;
  const optsTop = (CONTENT_H - (n * OPT_H + (n - 1) * OPT_GAP)) / 2;
  const optY = (i: number) => optsTop + i * (OPT_H + OPT_GAP);
  const at = (i: number) => stagger(i + 1, n + 1, frames);

  return (
    <SceneFrame headline={beat.headline}>
      <svg width={OPT_X} height={CONTENT_H} style={{ position: "absolute", inset: 0 }}>
        {beat.options.map((opt, i) => {
          const y = optY(i) + OPT_H / 2;
          return (
            <DrawPath
              key={i}
              d={`M${Q_W},${qMid} C${Q_W + 150},${qMid} ${OPT_X - 150},${y} ${OPT_X - 16},${y}`}
              length={420}
              p={progress(frame, at(i) - 14, at(i) + 4)}
              color={opt.highlight ? C.accent : C.muted}
              width={opt.highlight ? 7 : 5}
              arrow
            />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: qY,
          width: Q_W,
          height: Q_H,
          boxSizing: "border-box",
          padding: "34px 36px",
          borderRadius: 28,
          background: C.surface,
          border: `4px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
          ...rise(enter(frame, fps, stagger(0, n + 1, frames))),
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: C.accent,
            color: C.accentForeground,
            fontFamily: FONT.heading,
            fontSize: 40,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ?
        </div>
        <div style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.22 }}>{beat.question}</div>
      </div>

      {beat.options.map((opt, i) => {
        const glow = opt.highlight ? pulse(frame, at(i) + 20) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: OPT_X,
              top: optY(i),
              width: OPT_W,
              height: OPT_H,
              boxSizing: "border-box",
              padding: "22px 34px",
              borderRadius: 24,
              background: C.surface,
              border: `4px solid ${opt.highlight ? C.accent : C.border}`,
              boxShadow: opt.highlight ? `0 0 ${24 + glow * 36}px ${C.accent}55` : "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 8,
              ...rise(enter(frame, fps, at(i)), 30),
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: opt.highlight ? C.accent : C.muted }}>
              {opt.when}
            </div>
            <div style={{ fontSize: 42, fontWeight: 500, lineHeight: 1.2 }}>{opt.then}</div>
            {opt.highlight && (
              <div style={{ position: "absolute", top: -24, right: 24 }}>
                <NewBadge p={enter(frame, fps, at(i) + 14)} />
              </div>
            )}
          </div>
        );
      })}
    </SceneFrame>
  );
}
