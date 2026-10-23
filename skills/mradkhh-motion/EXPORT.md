# Review, export, and verification

This is the working check behind rule 3 — not a certificate earned by having code.

## Review loop after the first build

1. Watch the whole draft at normal speed.
2. Go through each scene and each cut. With sound, listen to the full mix and the stems you need.
3. Log each real issue: **interval → observation → cause → fix → re-check.**
4. Fix the causes. Re-watch each change with its neighbouring shots, then the whole video.
5. After any simplification, compare with the brief: "cleaner" is not acceptable when required characters, text, setting, or actions are gone.

Check:

- Does the idea read? Is the hero recognisable? Is there development, not a boring hold?
- Do camera, shot size, perspective, and layers guide attention? Are speeds and joins smooth?
- Does the type act? Can the required words be read without pausing?
- Are form, light, shadow, material, identity, and contact intact? Any artifacts, stray crops, layer fights?
- Do blur and focus match motion and depth without hiding what matters?
- Do music and SFX fit the style, rhythm, and events? Any drift, clicks, or cut-off tails?
- Are format, length, fps, silent/offline, and other explicit requirements met?

Stop when everything required is done and checked, real defects are fixed, and what remains is taste.

## Build path

When plain HTML/CSS/JS, SVG or Canvas, and your own timeline can reach the quality, take that path. Do not demand Remotion or another framework up front, and do not install dependencies by habit. Three.js, Remotion, Lottie, and audio libraries are fine when the result needs them. Choose by quality, needed features, the available environment, and the cost of complexity.

Web Audio API is built into the browser. It is fine for synthesis, but a real-time preview does not put sound in the MP4.

## Export

1. **Deterministic frames.** Every frame is a pure function of `t = i / fps`. Render **all** frames, including hard phases and transitions; check the sequence is complete and in order. Never screen-record a real-time playback that may drop frames.
2. **Real audio file.** Mix music, SFX, and voice into one exportable track on the shared timeline, with starts, offsets, accents, and the ending. Get it through an offline render or another reliable method, and check what is really in the file.
3. **Mux with `ffmpeg`** (or an equally reliable pipeline). Keep the frame rate and timing. Map the video and audio streams on purpose: do not drop the voice, music, or SFX, or replace the mix with one effect. In silent mode, add no audio.
4. **Align the ends** with the brief before muxing. Do not cut the last scene, the voice, or the music's ending to make lengths match, and do not stretch the video with a stray audio tail. Never use `-shortest` blindly.
5. **Check the decoded MP4:** codec and pixel format, resolution, constant fps and timestamps, frame count and exact length, AAC and the presence of the right audio, A/V sync, start, end, and scene boundaries. Watch and listen to the final file — the preview does not prove the export.

A typical check:

```bash
ffprobe -v error -show_entries stream=codec_name,pix_fmt,width,height,r_frame_rate,nb_frames:format=duration -of compact video.mp4
```

**Frame count example:** 20 s at 60 fps = 1200 frames, `t = 0/60 … 1199/60`. `renderAt(20)` is not an extra frame. 20 s is only an example length.

**Note:** an audio stream is not the same as good sound. A silent stream never passes as a sound result, and the presence of AAC does not prove audible, balanced music or voice.

When the environment really cannot render, encode, or deliver a file, name the exact blocker, what you finished, and the real format. Hand over the sources and the steps to export. Never call HTML a finished video, and never install an unavailable framework just to get around the block.

## Verify what you deliver

- Open and decode the final export. Check start and end, the frames just before and after every scene boundary, the reading holds, and the fastest phases.
- A contact sheet judges composition, a dense frame strip judges one cut, full playback judges rhythm and smoothness, listening judges sound. One does not replace another.
- With music sync, compare the chosen cuts and actions against accent timecodes of the **real track** and frames of the decoded export, including the audio offset after mux. Matching numbers alone do not prove sync.
- Seek the timeline cold, scrub backwards, and jump in from elsewhere: the same frame must render the same. Simulations and accumulating effects need an analytic state, a bake, or a replay — one random seed is not enough.

## Honest statuses

Keep these apart: **built**, **ran**, **seen in frames**, **watched in motion**, **listened to**. Nothing unchecked gets a PASS from parameters or a general impression. When a tool is missing, name the check you could not do and why, and label the artifact you hand over.

Do not use repeated strobing as energy. Check risky brightness changes in the output. Reduced motion and an error-free run do not prove flash safety; do not claim a standard without the analysis.
