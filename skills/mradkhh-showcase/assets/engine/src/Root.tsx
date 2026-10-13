import { Composition } from "remotion";
import { FPS, totalFrames } from "../lib/timing.mjs";
import example from "../storyboard.example.json";
import { Showcase } from "./Showcase";
import type { Storyboard } from "./types";

export const Root: React.FC = () => (
  <Composition
    id="Showcase"
    component={Showcase}
    width={1920}
    height={1080}
    fps={FPS}
    durationInFrames={FPS * 10}
    defaultProps={example as Storyboard}
    calculateMetadata={({ props }) => ({
      durationInFrames: totalFrames(props),
    })}
  />
);
