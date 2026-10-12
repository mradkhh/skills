---
name: mradkhh-explain
description: Explain a piece of logic or an LLM's output on a rung of the format ladder — STE text, diagram, HTML page, or narrated video.
disable-model-invocation: true
argument-hint: "[ste|diagram|html|video] <what to explain>"
---

# Explain

The user wants to **understand** something: a code path, a feature, a recent diff, or your own earlier answer. Your job is oversight support, not a summary. Build a **discardable** artifact that makes the mechanism obvious, on the right rung of the **ladder**:

| Rung      | Format                                     | Reach for it when the subject is…                          | Read        |
| --------- | ------------------------------------------ | ---------------------------------------------------------- | ----------- |
| `ste`     | Text in ASD-STE100 Simplified Technical English | one idea, one rule, one decision                           | [STE.md](STE.md) |
| `diagram` | One diagram + short STE legend             | several actors, states, or a branching flow                | [DIAGRAM.md](DIAGRAM.md) |
| `html`    | One self-contained interactive page        | a walk-through, or "what happens if X?" questions          | [HTML.md](HTML.md) |
| `video`   | Narrated explainer video, 3Blue1Brown style | a process that changes over time, to rewatch or show others | [VIDEO.md](VIDEO.md) |

Every rung uses STE for its words, so always read [STE.md](STE.md) as well as the rung's own file.

## Steps

### 1. Pin the target

Parse the argument: an optional rung (`ste`, `diagram`, `html`, `video`), then the subject. With no subject, the subject is your previous answer or the change you just made.

Done when you can state in one sentence where the subject starts (entry point), where it ends (result or side effect), and which files it spans.

### 2. Ground it

Read the real code and trace the subject from entry to end. Follow every branch the subject's behaviour depends on. When the project has a glossary (`GLOSSARY.md` or similar), use its terms.

Done when every claim you plan to make is **grounded**: tied to a `file:line`, a command output, or a doc. Mark anything you could not verify as _assumption_.

### 3. Pick the rung

If the user named a rung, use it. Otherwise pick the **lowest** rung that carries the subject, using the table above. State the rung and the reason in one line before you build.

### 4. Build

Follow the rung's file. Write each artifact to a gitignored temp directory in the project (for example `.temp/explain/<slug>/`); with none, use the session scratchpad or the system temp directory. When the session has a tool that publishes or renders HTML (an Artifact tool, an inline widget), use it for the `html` rung.

### 5. Close the loop

Show or open the artifact. End with:

- 2–3 **check-yourself** questions whose answers are in the code (put the answers in a collapsed block or at the end).
- One line offering the next rung up, when one exists.

Done when the user can see the artifact and every claim in it is grounded.
