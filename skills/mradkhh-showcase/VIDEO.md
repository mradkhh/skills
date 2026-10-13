# Video

A 1920×1080, 30 fps `.mp4` rendered with **Remotion** (React). The animation and the on-screen text carry the story; an Uzbek **voice-over** is optional. Without a voice, each beat stays on screen long enough to read (time from its word count); with a voice, each beat lasts until its narration ends (see `lib/timing.mjs`). A good video is 45–120 seconds.

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

## Voice-over (optional)

The narration uses Microsoft Edge's online Read Aloud voices through `msedge-tts` — free, no API key, and it speaks Uzbek: `uz-UZ-SardorNeural` (male, default) and `uz-UZ-MadinaNeural` (female).

**Warning:** the narration text is sent to Microsoft's servers, and the service is unofficial, so it can change without notice. Get the user's OK before using it with client material. When it fails, render without voice (`--mute`) and say so.

From `<work>/engine/`:

```bash
node scripts/voice.mjs ../<slug>/storyboard.json
```

It writes `<slug>/audio/<beat-id>.mp3` and `audio/manifest.json`, and prints each beat's length. Run it again after you change a narration — it synthesizes only the beats whose text or voice changed. `--voice <name>` overrides the storyboard's `voice`; `--list uz` lists the voices.

`video.mjs` picks up the manifest by itself: each narrated beat plays its audio and lasts until the voice ends plus a short pause. A beat whose narration changed after `voice.mjs` ran stays silent and prints a warning. `--mute` renders the silent version, timed for reading.

Listen to one beat (`xdg-open` / `open` on an mp3) before the full render: check that names, numbers, and stress sound right. Rephrase what the voice gets wrong.

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
3. Open the video (`xdg-open` / `open`) and watch it once from start to end — with sound, when it has a voice.

To scrub the animation live, run Remotion Studio with the storyboard:

```bash
npx remotion studio src/index.ts --props=../<slug>/storyboard.json
```

## Timing

When a beat feels rushed or slow, set `"seconds"` on that beat (4–14 is the useful range) and render again. With a voice, shorten or lengthen the narration instead. `check.mjs` prints the timeline, from the real audio once `voice.mjs` has run.

## Extending

A new beat type needs five changes in your engine copy: `src/types.ts`, a scene in `src/scenes/`, the switch in `src/Showcase.tsx`, a renderer in `scripts/deck.mjs`, and its limits in `scripts/check.mjs`.

Done when the video plays from start to end, every beat is readable at normal speed, each highlight is clear, and the voice (if any) matches the picture.
