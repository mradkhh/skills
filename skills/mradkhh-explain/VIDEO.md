# Video rung

A short narrated explainer in the style of 3Blue1Brown: clean shapes on a dark canvas, each idea built up step by step while a voice explains it. Target 1–3 minutes.

Stack, all free and local: **Manim Community** (animation) + a local **TTS** (narration) + **ffmpeg** (encoding, used by Manim).

## 1. Set up the toolchain

Work in `<tmp>/explain/.venv` (the temp directory from SKILL.md step 4), shared by every video, so later runs skip setup.

1. Check what exists: `ffmpeg -version`, `python3 --version`, `uv --version`, and whether `<tmp>/explain/.venv` already has `manim`.
2. Manim and the TTS engines need a Python they support (3.10–3.12 is the safe range). If the system Python is newer, create the venv with `uv venv --python 3.12`. Without `uv`, ask the user to install it.
3. Install into the venv: `manim`, `soundfile`, and a TTS engine:
   - **Kokoro** (best quality): `kokoro`. Its phonemizer needs the `espeak-ng` system package for some words.
   - **Piper** (lighter fallback): `piper-tts` plus one voice model.
4. Manim needs the `cairo` and `pango` system libraries. Use `Text`, not `MathTex`, unless a LaTeX install is present.

**Warning:** System packages and the first model download need the user's approval. Show the exact commands and their size, ask, then run them.

If the user has `ELEVENLABS_API_KEY` set and asks for it, use ElevenLabs for the narration step instead; everything else stays the same.

## 2. Write the script

Write `<slug>/script.json`: 5–8 **beats**. Each beat holds:

- `id`
- `narration` — STE sentences, 1–3 per beat, spoken in the user's language when the voice supports it (otherwise English, and say so).
- `visual` — what appears and moves while the narration plays.
- `source` — the `file:line` the beat is grounded in.

One beat = one idea. Show the beats to the user as an STE outline before you render, so a wrong story costs a minute, not a render.

## 3. Generate narration

For each beat, synthesize `<slug>/audio/<id>.wav` and record its duration (`soundfile.info(path).duration`) back into `script.json`.

Kokoro sketch:

```python
from kokoro import KPipeline
import numpy as np, soundfile as sf
pipe = KPipeline(lang_code="a")  # "a" = American English
chunks = [audio for _, _, audio in pipe(beat["narration"], voice="af_heart")]
sf.write(path, np.concatenate(chunks), 24000)
```

## 4. Build the scene

Write `<slug>/explainer.py` with one `Scene`. Drive timing from the audio, so voice and picture stay in sync:

```python
import json
from manim import *

BEATS = json.load(open("script.json"))["beats"]

class Explainer(Scene):
    def beat(self, i, *animations, share=0.6):
        b = BEATS[i]
        self.add_sound(f"audio/{b['id']}.wav")
        run = b["duration"] * share
        if animations:
            self.play(*animations, run_time=run)
        self.wait(max(b["duration"] - run, 0.1))

    def construct(self):
        ...  # one self.beat(i, ...) call per beat, in order
```

Visual language:

- Real names on screen: functions, tables, statuses, in a monospace `Text`.
- Build up, don't cut: `Create`, `Write`, `Transform` the previous state into the next one.
- One accent colour for the thing being explained now; grey out the rest.
- A small caption with the current beat's `file:line` in a corner.

## 5. Render and deliver

1. Draft: `manim -ql explainer.py Explainer` and check the timing.
2. Final: `manim -qh explainer.py Explainer`.
3. Copy the result to `<slug>/explainer.mp4` and open it for the user.

Done when the video plays, each beat's narration matches its picture, and every beat has a `source`.
