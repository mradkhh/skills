import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, progress, rise } from "../anim";
import { C, FONT } from "../theme";
import type { CompareBeat, SceneProps } from "../types";
import { CONTENT_H, DrawPath, SceneFrame } from "./Common";

const CARD_W = 720;
const AFTER_X = 960;

/** "Before" comes in first; when "after" arrives, "before" steps back. */
export function CompareScene({ beat, frames }: SceneProps<CompareBeat>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const afterAt = Math.round(Math.max(40, frames * 0.32));
  const beforeP = enter(frame, fps, 10);
  const afterP = enter(frame, fps, afterAt);

  return (
    <SceneFrame headline={beat.headline}>
      <div style={{ position: "absolute", left: 0, top: 0, ...slideIn(beforeP, -1, 1 - 0.45 * afterP) }}>
        <Card side={beat.before} kind="before" frame={frame} fps={fps} from={14} />
      </div>
      <svg width={1680} height={CONTENT_H} style={{ position: "absolute", inset: 0 }}>
        <DrawPath
          d={`M${CARD_W + 50},${CONTENT_H / 2} L${AFTER_X - 56},${CONTENT_H / 2}`}
          length={AFTER_X - CARD_W - 106}
          p={progress(frame, afterAt - 18, afterAt)}
          color={C.accent}
          width={8}
          arrow
        />
      </svg>
      <div style={{ position: "absolute", left: AFTER_X, top: 0, ...slideIn(afterP, 1) }}>
        <Card side={beat.after} kind="after" frame={frame} fps={fps} from={afterAt + 4} />
      </div>
    </SceneFrame>
  );
}

function slideIn(p: number, dir: -1 | 1, dim = 1) {
  return { opacity: p * dim, transform: `translateX(${(1 - p) * 80 * dir}px)` };
}

function Card({
  side,
  kind,
  frame,
  fps,
  from,
}: {
  side: CompareBeat["before"];
  kind: "before" | "after";
  frame: number;
  fps: number;
  from: number;
}) {
  const isAfter = kind === "after";
  return (
    <div
      style={{
        width: CARD_W,
        height: CONTENT_H,
        boxSizing: "border-box",
        padding: "40px 44px",
        borderRadius: 32,
        background: C.surface,
        border: `4px solid ${isAfter ? C.accent : C.border}`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "8px 24px",
          borderRadius: 999,
          background: isAfter ? C.accent : C.border,
          color: isAfter ? C.accentForeground : C.foreground,
          fontFamily: FONT.heading,
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        {side.title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 44 }}>
        {side.points.map((point, i) => (
          <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start", ...rise(enter(frame, fps, from + 6 + i * 8), 20) }}>
            <div
              style={{
                flex: "none",
                marginTop: 4,
                width: 44,
                height: 44,
                borderRadius: 22,
                background: isAfter ? C.accent : "transparent",
                border: isAfter ? "none" : `4px solid ${C.muted}`,
                boxSizing: "border-box",
                color: C.accentForeground,
                fontSize: 28,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isAfter ? "✓" : ""}
            </div>
            <div style={{ fontSize: 42, lineHeight: 1.25, color: isAfter ? C.foreground : C.muted }}>{point}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
