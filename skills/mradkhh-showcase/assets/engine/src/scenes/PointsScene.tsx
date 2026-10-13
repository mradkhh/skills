import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, rise, stagger } from "../anim";
import { C, FONT } from "../theme";
import type { PointsBeat, SceneProps } from "../types";
import { SceneFrame } from "./Common";

export function PointsScene({ beat, frames }: SceneProps<PointsBeat>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = beat.points.length;

  return (
    <SceneFrame headline={beat.headline}>
      <div style={{ display: "flex", flexDirection: "column", gap: 44, paddingTop: 20 }}>
        {beat.points.map((point, i) => {
          const p = enter(frame, fps, stagger(i, n, frames));
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, ...rise(p, 30) }}>
              <div
                style={{
                  flex: "none",
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  border: `4px solid ${C.accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT.heading,
                  fontSize: 38,
                  fontWeight: 700,
                  color: C.accent,
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: 50, lineHeight: 1.25 }}>{point}</div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
}
