import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, progress, pulse, rise, stagger } from "../anim";
import { C } from "../theme";
import type { FlowBeat, SceneProps } from "../types";
import { CONTENT_H, CONTENT_W, DrawPath, NewBadge, SceneFrame } from "./Common";

const GAP = 100;
const BOX_H = 260;
const ACTOR_H = 66;
const TRACK_GAP = 80;

/**
 * Steps appear left to right with arrows between them. Then a dot walks the
 * whole path, lifting each step it passes, so the order reads as motion.
 */
export function FlowScene({ beat, frames }: SceneProps<FlowBeat>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = beat.steps.length;
  const boxW = (CONTENT_W - GAP * (n - 1)) / n;
  const top = (CONTENT_H - (ACTOR_H + BOX_H + TRACK_GAP)) / 2;
  const boxY = top + ACTOR_H;
  const trackY = boxY + BOX_H + TRACK_GAP;
  const fontSize = n <= 3 ? 46 : n === 4 ? 40 : 34;
  const at = (i: number) => stagger(i, n, frames);
  const centerX = (i: number) => i * (boxW + GAP) + boxW / 2;

  const walkFrom = at(n - 1) + 24;
  const walk = progress(frame, walkFrom, Math.max(walkFrom + 30, frames * 0.88));
  const dotX = centerX(0) + (centerX(n - 1) - centerX(0)) * walk;
  const walking = frame >= walkFrom;
  const active = walking ? Math.round(walk * (n - 1)) : -1;
  // 1 when the dot is on step i, falling to 0 a step away.
  const lift = (i: number) => (walking ? Math.max(0, 1 - Math.abs(walk * (n - 1) - i) * 1.5) : 0);
  const trackP = progress(frame, walkFrom - 12, walkFrom);

  return (
    <SceneFrame headline={beat.headline}>
      <svg width={CONTENT_W} height={CONTENT_H} style={{ position: "absolute", inset: 0 }}>
        {beat.steps.slice(1).map((_, i) => {
          const x1 = (i + 1) * (boxW + GAP) - GAP + 14;
          const x2 = (i + 1) * (boxW + GAP) - 22;
          const y = boxY + BOX_H / 2;
          return (
            <DrawPath
              key={i}
              d={`M${x1},${y} L${x2},${y}`}
              length={x2 - x1}
              p={progress(frame, at(i) + 8, at(i + 1))}
              color={C.muted}
              width={5}
              arrow
            />
          );
        })}
        <line
          x1={centerX(0)}
          x2={centerX(0) + (centerX(n - 1) - centerX(0)) * trackP}
          y1={trackY}
          y2={trackY}
          stroke={C.border}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <line x1={centerX(0)} x2={dotX} y1={trackY} y2={trackY} stroke={C.accent} strokeWidth={6} strokeLinecap="round" opacity={trackP} />
        <circle cx={dotX} cy={trackY} r={18} fill={C.accent} opacity={trackP} />
        <circle cx={dotX} cy={trackY} r={30} fill={C.accent} opacity={0.25 * trackP} />
      </svg>

      {beat.steps.map((step, i) => {
        const p = enter(frame, fps, at(i));
        const glow = step.highlight ? pulse(frame, at(i) + 20) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: i * (boxW + GAP), top: top, width: boxW, ...rise(p) }}>
            <div
              style={{
                height: ACTOR_H,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: C.muted,
              }}
            >
              {step.actor ?? ""}
            </div>
            <div
              style={{
                position: "relative",
                height: BOX_H,
                boxSizing: "border-box",
                padding: "28px 30px",
                borderRadius: 28,
                background: C.surface,
                border: `4px solid ${step.highlight || active === i ? C.accent : C.border}`,
                boxShadow: step.highlight ? `0 0 ${30 + glow * 40}px ${C.accent}55` : "none",
                display: "flex",
                alignItems: "center",
                fontSize,
                fontWeight: 500,
                lineHeight: 1.22,
                transform: `translateY(${-16 * lift(i)}px)`,
              }}
            >
              {step.label}
              {step.highlight && (
                <div style={{ position: "absolute", top: -24, right: 20 }}>
                  <NewBadge p={enter(frame, fps, at(i) + 14)} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </SceneFrame>
  );
}
