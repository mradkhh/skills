---
name: mradkhh-motion
description: Direct and render an original motion video — product animation, UI demo, or kinetic typography — from a short brief, through a dynamic storyboard, a risk test, and a reviewed 1080p60 MP4 with music and sound design.
disable-model-invocation: true
argument-hint: "[storyboard|video] <brief>"
---

# Motion

The user wants a **motion video**: a product or UI animation, a kinetic-typography piece, a short promo or intro. A one-line idea is enough. You are the director: make the creative calls yourself, and ask only for facts you cannot know (real product features, prices, required text, brand assets).

This skill is for videos made to look good. To explain how code works, use `/mradkhh-explain video`. To present a change to a client with a deck, use `/mradkhh-showcase`.

## Three rules

Everything else in this skill serves these three. The user's brief (format, length, sound, allowed resources) wins over every default.

### 1. Rich by default

- **The camera keeps moving** while the story is active: smooth acceleration and braking, one connected path, motivated tilts, diagonals, and orbits. One linear zoom on a flat layout is not camera work. A held final frame may stay still.
- **Show depth.** Foreground, midground, and background differ in scale, overlap, perspective, and relative speed.
- **Type acts.** Letters and words build, stretch, mask, and interact with objects — not only fade in as captions.
- **Objects have physics:** weight, inertia, material, light, contact shadows, and secondary reactions.
- **Optics follow motion.** Motion blur from relative screen motion, depth of field in spatial and close shots, radial blur only as a deliberate accent. Never at the cost of legibility.
- **Sound by default:** music **and** sound design, in sync with the action and the style. Silent only when the brief says so — and then never call it a sound video.
- **Hit accents sometimes.** Tie key cuts, reveals, and landings to real accents in the actual track — not a cut on every beat.

Details: [MOTION.md](MOTION.md).

### 2. Direct before you build

Before the full build, write one original through-line and a complete storyboard. For **every scene**, sketch 3–5 genuinely different options and pick the strongest for the whole. Then test the biggest risk in a short probe. Details: [STORYBOARD.md](STORYBOARD.md).

### 3. The first build is a draft

Watch the whole draft at normal speed, then scene by scene and cut by cut; listen to the full mix. Fix causes, re-check what changed and the whole. Deliver a verified MP4, not an HTML preview. Details: [EXPORT.md](EXPORT.md).

**Default delivery:** MP4, 1920×1080, 60 fps, H.264, `yuv420p`, AAC audio — plus the editable sources. 4K only on request.

## Tools

Prefer plain HTML/CSS/JS, SVG or Canvas, and your own deterministic timeline, rendered frame by frame and muxed with `ffmpeg`. Use Three.js, Remotion, Lottie, or an audio library when the result really needs it. Respect a stack the user or the project already chose.

**Note:** Install nothing without asking. Show the command and the download size first. Needs `ffmpeg` and a headless browser (or another frame renderer) for the final MP4.

## Modules — read only when the brief needs them

| File | Read it when |
| --- | --- |
| [MOTION.md](MOTION.md) | always — camera, optics, type, rhythm, music |
| [STORYBOARD.md](STORYBOARD.md) | always — step 2 |
| [EXPORT.md](EXPORT.md) | always — steps 4–6 |
| [REFERENCES.md](REFERENCES.md) | the user gave a reference video, or several to combine |
| [UI.md](UI.md) | the video shows a product interface: cursor, clicks, states, drag and drop, 2D / 2.5D / 3D |
| [IMAGES.md](IMAGES.md) | you need generated images: one consistent character or object, poses, transparency |
| [MODELS-3D.md](MODELS-3D.md) | you need ready-made 3D models: sources, licenses, preparing a model for the scene |

## Steps

### 1. Read the brief

Parse the argument: an optional stop point (`storyboard` = stop after step 2; `video` = full run, the default), then the brief. Extract: goal, audience, key message, required text, format, length, sound or silent, allowed resources, and outputs. Open every reference the user gave ([REFERENCES.md](REFERENCES.md)).

Done when you can say in one sentence what the video must make the viewer feel or understand, and you have listed every hard requirement.

### 2. Storyboard

Follow [STORYBOARD.md](STORYBOARD.md). Show the user the through-line, the chosen option per scene with a one-line reason, and the storyboard. Wait for an OK only when the user asked to approve it, or when the stop point is `storyboard`.

Done when every scene and every cut has a filled plan card.

### 3. Probe the risk

Build the riskiest moment — a hard transition, a 3D shot, a sound sync — at real quality, in motion, with sound when there is sound. Choose its length by what it must prove.

Done when the probe proves the approach works, or you changed the approach.

### 4. Build the full draft

Build every scene on one timeline that is a pure function of time. Make the music and sound design with whatever allowed method fits.

Done when every frame renders from `t = i / fps` and the full mix exists as an audio file.

### 5. Review and fix

Follow the review loop in [EXPORT.md](EXPORT.md). Log each real issue as **interval → observation → cause → fix → re-check**. Do not invent issues to look busy; when nothing is wrong, say what you checked.

Done when every required item is met and checked, and only matters of taste remain.

### 6. Export and verify

Render all frames, mux with the mix, then decode and check the **final file** ([EXPORT.md](EXPORT.md)).

### 7. Deliver

End with:

- the MP4 path and its real specs (resolution, fps, codec, length, audio);
- the source folder and the command that re-renders it;
- what you checked and how: rendered, seen in frames, watched in motion, listened to — and anything you could not check;
- the assets you used (models, images, fonts, music): source, author, license, date checked.

---

Inspired by the `vizavi_motion` skill (v1.6.1); rewritten in our own words for this collection.
