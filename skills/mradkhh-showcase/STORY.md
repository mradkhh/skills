# Story and storyboard

## The arc

Use 5–8 beats in this order. Skip a beat when it has nothing true to say; never pad.

| # | Beat | Type | Question it answers for the audience |
| --- | --- | --- | --- |
| 1 | Title | `title` | What is this about, and what is the promise? |
| 2 | Change | `compare` (or `points`) | What was hard before, and what is different now? |
| 3 | How it works | `flow` | Who does what, in which order? Which step is new? |
| 4 | Rules | `branch` | When does the outcome change? (at most 2 branch beats) |
| 5 | What people see | `screen` | What does the customer or staff member see? |
| 6 | Impact | `metric` | What do we gain, in numbers? **Only with numbers from the user.** |
| 7 | Limits | `points` | What does it not do? What depends on others? |
| 8 | Next | `closing` | What happens next, and what do we need from you? |

## Pick the type

| The content is… | Type |
| --- | --- |
| a sequence of actions by people and the system | `flow` |
| a condition that sends things down different paths | `branch` |
| the old way next to the new way | `compare` |
| what appears on a screen, a message, a notification | `screen` |
| 1–3 numbers the user gave you | `metric` |
| a short list of independent statements | `points` |
| next steps and asks | `closing` |

## Storyboard fields

`storyboard.json` root: `title` (required), `client`, `date` (shown on the title beat), `voice` (narration voice, default `uz-UZ-SardorNeural`), `beats` (4–10).

Every beat has:

- `id` — kebab-case, unique.
- `type` — one of the types below.
- `headline` — the beat's message as a short sentence or question; at most 40 characters (70 for `title`).
- `facts` — IDs from `facts.md`. Required for `points`, `flow`, `branch`, `compare`, `screen`.
- `notes` — optional speaker notes for the deck: what to say aloud, 1–3 sentences. Never shown in the video.
- `narration` — optional voice-over, ≤ 320 characters (see below). Also the default speaker note when `notes` is empty.
- `seconds` — optional override of the on-screen time. By default it comes from the narration's length, or from the word count when there is none.

`highlight: true` marks **what this change adds**. It turns the item green and adds a "Yangi" badge. Use it on one item per beat.

| Type | Fields (limits in characters) |
| --- | --- |
| `title` | `subtitle` (≤ 90) |
| `points` | `points`: 2–4 strings (≤ 70) |
| `closing` | `points`: 1–4 strings (≤ 70) — next steps; start the client's tasks with "Sizdan:" |
| `flow` | `steps`: 2–5 × `{ actor` (≤ 18), `label` (≤ 32), `highlight }` |
| `branch` | `question` (≤ 60); `options`: 2–3 × `{ when` (≤ 28), `then` (≤ 48), `highlight }` |
| `compare` | `before`, `after`: `{ title` (≤ 16), `points`: 1–3 (≤ 48) `}` |
| `metric` | `metrics`: 1–3 × `{ value` (≤ 10), `label` (≤ 40) `}`; `source` (required, ≤ 110) — who gave the numbers |
| `screen` | `device`: `phone` \| `browser`; `elements`: 1–6 × `{ kind, label` (≤ 26 phone, ≤ 40 browser), `highlight }`; `caption` (≤ 120) |

`screen` element kinds: `header`, `text`, `input`, `button`, `list`, `card`, `badge`, `toast`. Elements stack top to bottom in order. A `toast` slides in at the end in the video and sits at the bottom of the screen on the slide. The `caption` points at the highlighted element.

`check.mjs` enforces all of the above. The full working example is `assets/engine/storyboard.example.json`.

## Writing the beats

- The headline carries the message; the visual proves it. "Pul avtomatik qaytadi", not "Qaytarish jarayoni".
- `flow` actors are roles the audience knows: `Mijoz`, `Kassir`, `Tizim`, `Bank`. 3–5 steps; merge technical steps into one action.
- `branch` options use the words the audience uses for the situation, not the code's condition.
- `screen` labels are the real texts the person sees on the screen, simplified.
- `points` under Limits are honest: what is still manual, what depends on a bank or a partner.

## Writing the narration

The voice says what the picture shows, in the order it appears — it does not read the slide word for word.

- 1–3 short spoken sentences per beat (about 7–11 seconds). Give every beat a narration, or none: a silent beat inside a narrated video feels broken.
- Write numbers and symbols as they are spoken: "yetmish foiz", not "70%"; "bir daqiqa", not "1 daq."; "ikki yarim", not "2,5". `check.mjs` warns about symbols.
- No abbreviations the voice cannot say (SMS is fine; "h.k.", "va b." are not).
- Same plain-language rules as the screen text ([PLAIN.md](PLAIN.md)): no code, no jargon, same words for the same things.
