import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enter, progress, rise } from "../anim";
import { C, FONT } from "../theme";
import type { SceneProps, TitleBeat } from "../types";

export function TitleScene({ beat, storyboard }: SceneProps<TitleBeat>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = beat.headline.split(/\s+/);
  const meta = [storyboard.client, storyboard.date].filter(Boolean).join(" · ");
  const wordsDone = 8 + words.length * 4;

  return (
    <AbsoluteFill style={{ padding: "0 160px", justifyContent: "center" }}>
      {meta && (
        <div
          style={{
            fontSize: 32,
            color: C.muted,
            marginBottom: 36,
            ...rise(enter(frame, fps, 0)),
          }}
        >
          {meta}
        </div>
      )}
      <h1
        style={{
          margin: 0,
          maxWidth: 1500,
          fontFamily: FONT.heading,
          fontSize: 92,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: -2,
        }}
      >
        {words.map((w, i) => (
          <span
            key={i}
            style={{ display: "inline-block", marginRight: 26, ...rise(enter(frame, fps, 6 + i * 4), 60) }}
          >
            {w}
          </span>
        ))}
      </h1>
      <div
        style={{
          marginTop: 44,
          width: 260 * progress(frame, wordsDone, wordsDone + 20),
          height: 10,
          borderRadius: 5,
          background: C.accent,
        }}
      />
      {beat.subtitle && (
        <div
          style={{
            marginTop: 40,
            fontSize: 46,
            color: C.muted,
            maxWidth: 1400,
            ...rise(enter(frame, fps, wordsDone + 6)),
          }}
        >
          {beat.subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
}
