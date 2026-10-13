import { Fragment } from "react";
import { AbsoluteFill, Html5Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TRANSITION_FRAMES, timeline } from "../lib/timing.mjs";
import { BRAND, C, FONT } from "./theme";
import type { Beat, SceneProps, Storyboard } from "./types";
import { BranchScene } from "./scenes/BranchScene";
import { ClosingScene } from "./scenes/ClosingScene";
import { CompareScene } from "./scenes/CompareScene";
import { FlowScene } from "./scenes/FlowScene";
import { MetricScene } from "./scenes/MetricScene";
import { PointsScene } from "./scenes/PointsScene";
import { ScreenScene } from "./scenes/ScreenScene";
import { TitleScene } from "./scenes/TitleScene";

function Scene(props: SceneProps) {
  const { beat } = props;
  switch (beat.type) {
    case "title":
      return <TitleScene {...props} beat={beat} />;
    case "points":
      return <PointsScene {...props} beat={beat} />;
    case "flow":
      return <FlowScene {...props} beat={beat} />;
    case "branch":
      return <BranchScene {...props} beat={beat} />;
    case "compare":
      return <CompareScene {...props} beat={beat} />;
    case "metric":
      return <MetricScene {...props} beat={beat} />;
    case "screen":
      return <ScreenScene {...props} beat={beat} />;
    case "closing":
      return <ClosingScene {...props} beat={beat} />;
    default:
      throw new Error(`Unknown beat type: ${(beat as Beat).type}`);
  }
}

/** Wordmark and progress bar that stay on screen for the whole video. */
function Chrome() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 52,
          fontFamily: FONT.heading,
          fontSize: 28,
          fontWeight: 700,
          color: C.muted,
        }}
      >
        <span style={{ color: C.accent }}>●</span> {BRAND.name}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 6,
          width: `${(frame / Math.max(durationInFrames - 1, 1)) * 100}%`,
          background: C.accent,
        }}
      />
    </AbsoluteFill>
  );
}

export const Showcase: React.FC<Storyboard> = storyboard => {
  const tl = timeline(storyboard);
  return (
    <AbsoluteFill
      style={{
        background: C.background,
        color: C.foreground,
        fontFamily: FONT.body,
      }}
    >
      <TransitionSeries>
        {storyboard.beats.map((beat, i) => (
          <Fragment key={beat.id}>
            {i > 0 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={tl[i].frames}>
              <AbsoluteFill style={{ background: C.background }}>
                <Scene beat={beat} frames={tl[i].frames} storyboard={storyboard} />
              </AbsoluteFill>
              {beat.audio && <Html5Audio src={staticFile(beat.audio.file)} />}
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
      <Chrome />
    </AbsoluteFill>
  );
};
