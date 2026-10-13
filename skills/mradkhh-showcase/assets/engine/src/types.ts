// The storyboard is the single source for both the deck and the video.
// STORY.md documents every field; scripts/check.mjs enforces the limits.

type BeatBase = {
  id: string;
  headline: string;
  /** Speaker notes for the deck. Never shown in the video. */
  notes?: string;
  /** IDs from facts.md that ground this beat in the code. */
  facts?: string[];
  /** Overrides the computed on-screen time. */
  seconds?: number;
};

export type TitleBeat = BeatBase & { type: "title"; subtitle?: string };
export type PointsBeat = BeatBase & { type: "points"; points: string[] };
export type FlowBeat = BeatBase & {
  type: "flow";
  steps: { label: string; actor?: string; highlight?: boolean }[];
};
export type BranchBeat = BeatBase & {
  type: "branch";
  question: string;
  options: { when: string; then: string; highlight?: boolean }[];
};
export type CompareBeat = BeatBase & {
  type: "compare";
  before: { title: string; points: string[] };
  after: { title: string; points: string[] };
};
export type MetricBeat = BeatBase & {
  type: "metric";
  metrics: { value: string; label: string }[];
  /** Who supplied the numbers. Required: numbers are never invented. */
  source: string;
};
export type ScreenElementKind =
  | "header"
  | "text"
  | "input"
  | "button"
  | "list"
  | "card"
  | "badge"
  | "toast";
export type ScreenBeat = BeatBase & {
  type: "screen";
  device: "phone" | "browser";
  elements: { kind: ScreenElementKind; label: string; highlight?: boolean }[];
  caption?: string;
};
export type ClosingBeat = BeatBase & { type: "closing"; points: string[] };

export type Beat =
  | TitleBeat
  | PointsBeat
  | FlowBeat
  | BranchBeat
  | CompareBeat
  | MetricBeat
  | ScreenBeat
  | ClosingBeat;

export type Storyboard = {
  title: string;
  client?: string;
  date?: string;
  beats: Beat[];
};

export type SceneProps<B extends Beat = Beat> = {
  beat: B;
  /** Length of this beat in frames. */
  frames: number;
  storyboard: Storyboard;
};
