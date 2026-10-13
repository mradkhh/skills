import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, progress, rise, stagger } from "../anim";
import { BRAND, C, FONT } from "../theme";
import type { ClosingBeat, SceneProps } from "../types";
import { SceneFrame } from "./Common";

export function ClosingScene({ beat, frames }: SceneProps<ClosingBeat>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = beat.points.length;
  const brandAt = stagger(n, n + 1, frames) + 10;

  return (
    <SceneFrame headline={beat.headline}>
      <div style={{ display: "flex", flexDirection: "column", gap: 40, paddingTop: 10 }}>
        {beat.points.map((point, i) => {
          const at = stagger(i, n, frames);
          const check = progress(frame, at + 8, at + 22);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 36, ...rise(enter(frame, fps, at), 30) }}>
              <svg width="72" height="72" viewBox="0 0 72 72" style={{ flex: "none" }}>
                <rect x="3" y="3" width="66" height="66" rx="16" fill="none" stroke={C.accent} strokeWidth="5" />
                <path
                  d="M20 37 L31 48 L53 25"
                  fill="none"
                  stroke={C.accent}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset={50 * (1 - check)}
                />
              </svg>
              <div style={{ fontSize: 48, lineHeight: 1.25 }}>{point}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          textAlign: "right",
          ...rise(enter(frame, fps, brandAt)),
        }}
      >
        <div style={{ fontFamily: FONT.heading, fontSize: 56, fontWeight: 700 }}>
          <span style={{ color: C.accent }}>●</span> {BRAND.name}
        </div>
        <div style={{ fontSize: 32, color: C.muted, marginTop: 8 }}>{BRAND.url}</div>
      </div>
    </SceneFrame>
  );
}
