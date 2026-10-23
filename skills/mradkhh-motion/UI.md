# Product and UI motion

Read this when the video shows a product interface. "SaaS/UI motion" here is a short name for staging an interface, not a fixed art style.

## One app, one task per episode

- Give every episode a clear task: pick an item, change a setting, drag a card, rebuild a panel, start a process, show the result.
- Show **one believable app** with consistent data and states — not a new decorative card under a new title in every scene.
- Keep the hierarchy of cards, panels, and buttons, and the same radii, shadows, and line weights.
- Highlight only a few main controls per action (about 1–3 is a guide, not a quota).
- Demo data is demo data. Never present it as real features or metrics of an existing product.

## The cursor drives the action

**hover → target reacts → press or grab → change → readable result.**

- The cursor never wanders over a passive screen.
- A hit is decided by the arrow tip (the hotspot), not the sprite centre.
- Before a click, a short readable hover; after it, a visible state change it caused.
- The cursor stays sharp and fully visible during the press, and never covers the button label, the result, or numbers the viewer must read.
- A starting point for a cursor move: 0.6–0.9 s along a small arc, a slight squash on click, recovery after. It may enter and leave the frame. Tune to tempo, frame size, and reading time — never copy numbers blindly.

## States

- Button and object states follow cause: hover, pressed or dragging, processing, success or selected — or another meaningful set.
- Never show success before the process ends. A chart, a percentage, and a progress bar of one operation share one progress value.
- A wait shortened in the edit is not the product's real speed. Mark it as shortened or as a demo when it matters.

## Drag and drop

- Fix the grab point and the cursor-to-object offset.
- The card lifts and follows on an arc; the drop zone lights up; on drop the card shrinks a little and settles into the slot.
- Follow-through and lag may show weight, but never look like a lost grip. Neighbours react after the event.
- Drop, snap, and settle end in a stable, clear layout. Do not put the same spring on every layer.

## Transitions and camera

- Hand an object between scenes with matching screen position, size, and state. No double, no ghost left behind.
- A result grows out of the element that caused it. Cards part on soft arcs.
- In a morph, change the real size and layout of the shape. Do not stretch the whole UI with its text and radii.
- The camera serves the action: follow the caret, push in to a click, pull out for the result, orbit separated layers. A close-up reads a detail; a wide shot gives context. Pick one meaningful move, not all of them each time.
- Small micro-reactions (target highlight, state change, a neighbour's response, a panel opening) support the main point; they do not compete with it.

## 2D, 2.5D, and 3D are different

| Mode | What must really change |
| --- | --- |
| 2D | Flat panels, cards, buttons, and content. No fake thickness. The cursor and the state change are the centre. |
| 2.5D | The same flat panels spread out in depth. The camera reveals their layout, perspective, overlap, and parallax. Panels get **no** real sides or extrusion. |
| 3D | Recognisable objects get real thickness, edges, and side faces. Light, normals, shadows, and an orbit or fly-through prove the volume — not scale or a drop shadow alone. |

When one video shows the same interface in several modes, keep the same object IDs, anchors, colours, content, and result, so the viewer sees one interface change its spatial model.

## Coordinates and determinism

- Keep **world-space UI** and **screen-space overlay** apart.
- When the cursor works on an object in the world, compute its screen point from the current projection of the anchor: camera, viewport, aspect ratio, and window scale. When the cursor lives entirely in screen space, check its target in that same space. Never mix CSS pixels, video-frame pixels, and world units without a conversion.
- A screen-space label keeps its place and look while the camera moves. Labels on world objects may follow their projection; check margins, overlap, depth, and leaving the frame. A 3D panel must not cover an overlay cursor or required text by accident.
- Drive the cursor, the grab, states, and delays from **one deterministic timeline**. No real input is needed for playback. Compute states from time, or from a reproducible bake or replay, including scrubbing back. Nothing may depend on an earlier mouse event or on how many frames already played.
- Full QA of fast repeated clicks, resize, and reduced motion is for a live app. Do not turn a demo video into product development.

## Check

At speed and at every cut: is the action clear, is the grab precise, does the drop finish, do progress and states agree, is the interface identity kept where required, are the spatial modes distinct, does projection hold during camera moves and scrubbing, can the overlay be read? Then check the decoded export with sound. A cursor, a `translateZ`, or an extrusion parameter in the code does not prove the visual result.
