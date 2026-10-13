# mradkhh skills

Agent Skills by [@mradkhh](https://github.com/mradkhh), following the [Agent Skills specification](https://agentskills.io/specification). They work in Claude Code, Codex, Gemini/Antigravity, and other clients that read `SKILL.md` folders.

Every skill name starts with `mradkhh-`, so it never collides with another author's skill of the same idea.

| Skill | What it does | Invocation |
| --- | --- | --- |
| [`mradkhh-adr-generator`](skills/mradkhh-adr-generator) | Records architectural and business decisions as ADRs, with rationale, consequences, and verification evidence. | Automatic on ADR requests, or by name |
| [`mradkhh-explain`](skills/mradkhh-explain) | Explains a piece of logic or an LLM's output on a rung of the format ladder: ASD-STE100 text → diagram → interactive HTML page → narrated explainer video. | By name only: `/mradkhh-explain [ste\|diagram\|html\|video] <topic>` |
| [`mradkhh-showcase`](skills/mradkhh-showcase) | Presents a code change to non-technical people (client, business owner) as an editable `.pptx` deck and an animated explainer video, in plain Uzbek with no code on screen. | By name only: `/mradkhh-showcase [deck\|video\|both] <change>` |

## Install

With the [`skills` CLI](https://github.com/vercel-labs/skills) (Node.js 22.20+):

```bash
npx skills add mradkhh/skills --skill mradkhh-explain
```

```bash
npx skills add mradkhh/skills --skill mradkhh-adr-generator
```

```bash
npx skills add mradkhh/skills --skill mradkhh-showcase
```

Add `--global` to install for every project, and `--agent <id>` (`claude-code`, `codex`, `antigravity`, …) to target one client. Without the CLI, copy or symlink a folder from `skills/` into your client's skills directory (for Claude Code: `.claude/skills/` or `~/.claude/skills/`).

## `mradkhh-explain` in short

As agents do more of the work, our job moves to oversight and understanding. This skill turns "explain this to me" into a discardable artifact on the lowest rung that carries the subject:

1. **ste** — text in ASD-STE100 Simplified Technical English (80% strict by default).
2. **diagram** — one sequence / state / flow / ER diagram with an STE legend.
3. **html** — a self-contained interactive page: map, stepper, "what if?" toggles, check-yourself questions.
4. **video** — a 3Blue1Brown-style explainer: Manim + local TTS (Kokoro or Piper), narration synced to the animation.

Every claim is grounded in a `file:line`. The video rung needs Python 3.10–3.12, `ffmpeg`, `cairo`, `pango`, and asks before installing anything.

## `mradkhh-showcase` in short

`mradkhh-explain` is for developers. `mradkhh-showcase` is for the people who pay for the work: it turns a feature or a diff into a story about what changes for customers and staff, and renders it twice from one `storyboard.json`:

1. **deck** — an editable 16:9 `.pptx` (pptxgenjs): native shapes, speaker notes, opens in PowerPoint, Keynote, and Google Slides.
2. **video** — an animated `.mp4` (Remotion): flows that walk, branches that grow, simplified phone and browser screens. No narration; the animation carries the story.

Every claim is grounded in a `file:line` in a private `facts.md`, but no code reaches the screen. The agent asks for business context and numbers instead of inventing them, and a checker blocks code, jargon, and unsourced metrics. Needs Node.js 20+; asks before installing (~350 MB of npm packages plus Chrome Headless Shell on the first render). Remotion is free for individuals and companies of up to 3 people.

## Migrating from `mradkhh/adr-generator`

The ADR skill moved here and was renamed `adr-generator` → `mradkhh-adr-generator`. Remove the old installation, then install the new one:

```bash
npx skills remove adr-generator
```

```bash
npx skills add mradkhh/skills --skill mradkhh-adr-generator
```

Existing `docs/adr/` records are untouched by either command.

## License

[MIT](LICENSE)
