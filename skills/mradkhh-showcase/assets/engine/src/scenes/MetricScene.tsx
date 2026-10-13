import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, progress, rise, stagger } from "../anim";
import { C, FONT, LABELS } from "../theme";
import type { MetricBeat, SceneProps } from "../types";
import { CONTENT_H, CONTENT_W, SceneFrame } from "./Common";

/** Counts the numeric part of "−70%", "1 daqiqa", "2,5 mln" up from zero. */
function countUp(value: string, p: number) {
  const m = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return value;
  const [, prefix, num, suffix] = m;
  const sep = num.includes(",") ? "," : ".";
  const decimals = num.split(/[.,]/)[1]?.length ?? 0;
  const target = Number(num.replace(",", "."));
  const shown = (target * p).toFixed(decimals).replace(".", sep);
  return `${prefix}${shown}${suffix}`;
}

export function MetricScene({ beat, frames }: SceneProps<MetricBeat>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = beat.metrics.length;
  const colW = CONTENT_W / n;

  return (
    <SceneFrame headline={beat.headline}>
      {beat.metrics.map((metric, i) => {
        const at = stagger(i, n, frames);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * colW,
              top: 70,
              width: colW - 40,
              ...rise(enter(frame, fps, at)),
            }}
          >
            <div style={{ width: 80, height: 8, borderRadius: 4, background: C.accent, marginBottom: 30 }} />
            <div
              style={{
                fontFamily: FONT.heading,
                fontSize: n === 1 ? 190 : 140,
                fontWeight: 700,
                lineHeight: 1,
                color: C.accent,
                letterSpacing: -4,
                whiteSpace: "nowrap",
              }}
            >
              {countUp(metric.value, progress(frame, at, at + 36))}
            </div>
            <div style={{ fontSize: 42, lineHeight: 1.25, marginTop: 28 }}>{metric.label}</div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: CONTENT_H - 50,
          fontSize: 28,
          color: C.muted,
          opacity: progress(frame, stagger(n, n + 1, frames), stagger(n, n + 1, frames) + 15),
        }}
      >
        {LABELS.source}: {beat.source}
      </div>
    </SceneFrame>
  );
}
