# Deck

An editable 16:9 `.pptx`: one slide per beat, built with **pptxgenjs** from native shapes and text (no screenshots), with each beat's `notes` as speaker notes. It opens in PowerPoint, Keynote, and Google Slides, so the user can still change any word.

The deck uses the brand's light theme and Arial (`brand.json → deck`), so it looks the same on any computer. Slides are static; the motion lives in the video.

## Build

From `<work>/engine/`:

```bash
node scripts/deck.mjs ../<slug>/storyboard.json ../<slug>/deck.pptx
```

## Check

Look at every slide before you show the deck.

1. When `soffice` (LibreOffice) is available, render the slides:

   ```bash
   soffice --headless --convert-to pdf --outdir ../<slug> ../<slug>/deck.pptx
   ```

   ```bash
   pdftoppm -r 60 -png ../<slug>/deck.pdf ../<slug>/slide
   ```

   Then read each `slide-N.png`.
2. Without LibreOffice, review the video stills instead (the layouts match) and tell the user the deck itself was not rendered for a visual check.

Look for: text that leaves its box or wraps into a third line, overlapping shapes, a highlight that does not stand out, an empty-looking slide.

## Fix

Shorten the text in `storyboard.json`, run `check.mjs` again, then rebuild. Do not edit the `.pptx` by hand and do not shrink fonts — the next rebuild would lose the change, and small text fails in a meeting room.

A layout the eight types cannot express: change `scripts/deck.mjs` **and** the matching scene in `src/scenes/` in your engine copy, so the deck and the video stay the same.
