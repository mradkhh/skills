---
name: mradkhh-showcase
description: Present a code change or new logic to a non-technical audience — client, business owner, manager — as an editable .pptx deck and an animated explainer video, in plain Uzbek with business value first and no code on screen.
disable-model-invocation: true
argument-hint: "[deck|video|both] <change or feature to present>"
---

# Showcase

The user built or changed some logic and must explain it to people who do not read code: a client, a business owner, a manager. Your job is to turn the code into a short story about **what changes for people and why it matters**, then render that story twice from one source:

- an editable **`.pptx` deck** for the meeting, and
- an animated **`.mp4` video** to send before or after it.

Both come from one `storyboard.json`, so they always tell the same story. For a developer audience, use `/mradkhh-explain` instead.

## Rules

- **No code on screen.** No identifiers, file names, routes, status codes, or jargon. [PLAIN.md](PLAIN.md) has the rules and a translation table.
- **Grounded, but hidden.** Every claim comes from a fact in `facts.md` with its `file:line`. The audience never sees `file:line`; you and the presenter do.
- **Never invent numbers.** Time saved, money, percentages, user counts come only from the user or the code. No numbers → no metric beat.
- **Ask, don't guess, business context.** Who watches, what the problem cost, which numbers are real. Step 3.
- **Language:** all audience-facing text is Uzbek (Latin script) unless the user asks for another language. Write `o‘ g‘` with `‘` and the tutuq belgisi with `’`; `check.mjs --fix` converts ASCII `'`.

| File | Read it for |
| --- | --- |
| [PLAIN.md](PLAIN.md) | every word you write — always |
| [STORY.md](STORY.md) | the story arc and the storyboard fields (step 4) |
| [DECK.md](DECK.md) | rendering and checking the `.pptx` |
| [VIDEO.md](VIDEO.md) | rendering and checking the video |
| `assets/engine/` | the renderer you copy and run (step 5) |

## Steps

### 1. Pin the target

Parse the argument: an optional output (`deck`, `video`, `both`; default `both`), then the subject. With no subject, the subject is the current change: the diff against the base branch, or the last commit. Work only from code and diffs.

Done when you can say in one sentence what the change does for a person, and which files it spans.

### 2. Ground it in `facts.md`

Pick a work directory: a gitignored temp folder in the project (for example `.temp/showcase/`; confirm with `git check-ignore`), or the session scratchpad. Each subject gets `<work>/<slug>/`.

Read the real code from entry to end and write `<slug>/facts.md` — numbered facts, one plain sentence each, with `file:line`:

```markdown
- F1 — The customer can cancel an order while its status is "preparing". `src/orders/cancel.ts:14`
- F2 — On cancel, the system refunds the full amount to the card used. `src/payments/refund.ts:31`
```

Cover: who starts it, what the system does, **every condition that changes the outcome**, what the person sees (screens, messages, SMS), and what it does **not** do. Mark anything you could not verify as _assumption_. An assumption reaches the storyboard only after the user confirms it.

Done when every behaviour you plan to show has a fact.

### 3. Ask the user

The code does not hold the business context. Ask in one message (use the session's question tool when there is one):

1. Who watches, and what should they decide or understand afterwards?
2. What was the problem before this change, in the client's words? What did it cost (time, money, complaints)?
3. Which numbers can we show, and where do they come from (measured, client's estimate)? "None" is a fine answer.
4. Client or project name and date for the title (optional).
5. Anything to leave out (internal limits, unreleased parts)?

Do not fill gaps yourself. When the user skips a question, leave that part out of the story.

Done when each question has an answer or an explicit skip.

### 4. Write the storyboard

Follow [STORY.md](STORY.md): write `<slug>/storyboard.json` with 5–8 beats along the story arc, each tied to facts. Then check it (after step 5 exists, from `<work>/engine/`):

```bash
node scripts/check.mjs ../<slug>/storyboard.json --fix
```

Fix every `✗` error. Review every `⚠` warning and rewrite jargon with [PLAIN.md](PLAIN.md).

Show the user the outline — one line per beat: headline, then what appears — and wait for an OK before rendering. A wrong story costs a minute here, not a render.

Done when the check prints `OK` and the user approved the outline.

### 5. Set up the engine (once)

Copy `assets/engine/` from this skill to `<work>/engine/`, unless a copy with the same `package.json` is already there. It needs Node.js 20+. `npm install` takes about 350 MB; the first video render also downloads Chrome Headless Shell (about 100 MB). Show the command and the sizes and ask before you run `npm install`.

**Note:** npm 11+ may report that it blocked the `esbuild` install script. Rendering works without it.

The brand (colours, fonts, name) lives in `engine/brand.json` — the mradkhh personal brand by default.

### 6. Render

- Deck: follow [DECK.md](DECK.md).
- Video: follow [VIDEO.md](VIDEO.md).

Look at the slide images and video stills yourself before you show anything. When text overflows or overlaps, shorten the text in the storyboard — do not shrink fonts.

### 7. Deliver

Open or send `deck.pptx` and `video.mp4`. Then write `<slug>/qa.md` for the presenter: five questions the audience will likely ask, each with a short plain answer and its fact IDs.

End with:

- the paths of `deck.pptx`, `video.mp4`, `qa.md`;
- which beats rest on numbers the user gave;
- one line on editing: the deck opens in PowerPoint, Keynote, or Google Slides; to change the video, edit `storyboard.json` and render again.

Done when the user has both files and every beat traces back to a fact or a user answer.
