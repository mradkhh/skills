# Video

A 1920×1080, 30 fps `.mp4` rendered with **Remotion** (React). There is no narration: the animation and the on-screen text carry the story. Each beat stays on screen long enough to read (time comes from its word count, see `lib/timing.mjs`). A good video is 45–120 seconds.

The video uses the brand's dark theme and Google Sans / Google Sans Code, loaded from Google Fonts at render time (network needed).

**Note:** Remotion is free for individuals and for companies with up to 3 people. Larger companies need a company license (remotion.dev/license). Tell the user once when they render for such a company.

## What moves

| Type | Motion |
| --- | --- |
| `title` | Words rise in one by one, an accent line draws, the subtitle fades in. |
| `points` | Numbered items rise in one after another. |
| `flow` | Steps appear left to right with arrows; then a dot walks the path and lifts each step it passes. The new step glows. |
| `branch` | The question appears; a line grows to each outcome. The new path is green and pulses. |
| `compare` | "Before" slides in; an arrow draws; "after" slides in and "before" steps back. |
| `metric` | Numbers count up from zero. |
| `screen` | The phone or browser builds element by element; the highlight pulses; a callout explains it; a toast drops in last. |
| `closing` | Checkboxes tick one by one; the brand appears. |

## Render

From `<work>/engine/`:

1. **Stills first.** One frame per beat, near its end, at half size:

   ```bash
   node scripts/video.mjs ../<slug>/storyboard.json --stills ../<slug>/stills
   ```

   Read every PNG. Look for text that overflows or overlaps, a highlight you cannot see, or an empty frame. Fix the storyboard, not the scene code.
2. **Final video:**

   ```bash
   node scripts/video.mjs ../<slug>/storyboard.json ../<slug>/video.mp4
   ```

   Add `--draft` for a fast half-size render while you iterate. A 90-second video renders in about a minute on a laptop.
3. Open the video (`xdg-open` / `open`) and watch it once from start to end.

To scrub the animation live, run Remotion Studio with the storyboard:

```bash
npx remotion studio src/index.ts --props=../<slug>/storyboard.json
```

## Timing

When a beat feels rushed or slow, set `"seconds"` on that beat (4–14 is the useful range) and render again. `check.mjs` prints the timeline.

## Extending

A new beat type needs five changes in your engine copy: `src/types.ts`, a scene in `src/scenes/`, the switch in `src/Showcase.tsx`, a renderer in `scripts/deck.mjs`, and its limits in `scripts/check.mjs`.

Done when the video plays from start to end, every beat is readable at normal speed, and each highlight is clear.
