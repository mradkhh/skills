# HTML rung

One self-contained, interactive web page that lets the user **walk** the mechanism and **poke** it.

## Delivery

- With an HTML-publishing or rendering tool in the session (Artifact tool, inline widget): use it, and follow its own design guidance.
- Otherwise: write a single `.html` file to the temp directory from SKILL.md step 4 and open it (`xdg-open` / `open`).
- Inline all CSS and JS. Load external libraries only from a CDN with an exact pinned version.

## Structure

1. **TL;DR** — one STE sentence at the top.
2. **Map** — a diagram of the whole flow (SVG, or Mermaid from a pinned CDN). Clicking a node jumps to its step.
3. **Stepper** — the main path, one step per screen, with Prev / Next and keyboard arrows. Each step shows:
   - an STE explanation of 1–3 sentences,
   - the relevant code excerpt (short, highlighted),
   - its `file:line`,
   - the map with the current node highlighted.
4. **What if?** — toggles or inputs for the branches the code handles (e.g. "balance low", "user is not owner"). Changing one re-runs a tiny JS model of the logic and shows which path fires and what the result is. Model only what the real code does; label it a simplified model.
5. **Check yourself** — 2–3 questions with click-to-reveal answers.

## Look

- Clean typography, generous spacing, readable code blocks.
- Light and dark themes via `prefers-color-scheme`.
- Works at phone width with no horizontal scroll.
- Subtle transitions between steps; motion supports the explanation, never decorates it.
