# Ready-made 3D models

Read this when the scene needs downloaded 3D models: devices, props, characters, scans.

## Getting a model

- For the user's own video, you may find and download suitable free models as part of the request. Prefer GLB/glTF when it suits the renderer and the export.
- Check the specific model and its terms: "free" does not mean "any use". But do not block an ordinary personal download over a hypothetical future commercial use, and do not forbid showing devices in a video.
- Use a source you can really reach, through its normal download. Never bypass access limits, never claim a model you could not get, and never sign up or install integrations on your own.
- If a model is unavailable, paid, or its terms do not fit the planned use, find the next one.

## Sources

**Note:** last checked **2026-10-16** from the sites' own pages; not every file was downloaded and tested. Terms change — check the model's page and its bundled license when you download it.

| Need | Source | What to watch |
| --- | --- | --- |
| Realistic objects | [Poly Haven Models](https://polyhaven.com/models) | glTF, CC0, no account. Check the texture set and the actual model. |
| Stylised packs | [Kenney](https://kenney.nl/assets) | Pick a 3D pack: GLB, CC0. "Continue without donating" gets the free pack. |
| Characters and rigs | [Quaternius](https://quaternius.com/) | Free Standard releases often have FBX/glTF; Source can be paid. Keep the license of the exact release — not the whole site is CC0 (see below). |
| Real 3D scans | [ambientCG](https://ambientcg.com/list?type=3d-model,terrain) | CC0. Check the format and the ZIP contents; not every item comes as GLB. |
| Specific devices and more | [Sketchfab](https://sketchfab.com/) | Filter downloadable / free, glTF/GLB, and read each model's license. Downloading needs an account — use access the user already has, or another source. |
| Free with a format filter | [CGTrader](https://www.cgtrader.com/3d-models?free=1) | Check the glTF filter, a real zero price, and the model's terms. "Free in subscription" is not a free download. |
| Stylised characters | [KayKit Adventurers](https://kaylousberg.itch.io/kaykit-adventurers) | Free part: 5 models, FBX/glTF, CC0. Extras are paid. |
| Technical fallback | [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) | For compatibility and technical scenes. Each asset's license is in its own README. |

**Quaternius:** the [Quaternius Asset License v1.0](https://quaternius.com/license.html) allows personal and commercial finished projects, but forbids redistributing the assets themselves as packs or templates. Some older releases may still be CC0. Never carry one release's license over to another, and never bundle a model inside a distributed skill or template.

**Poly Pizza:** its [terms](https://poly.pizza/docs/tos) restrict automated downloads, so do not use it as an automatic source. Pick another one.

## Before the scene

1. **Inspect the real file**, not the page preview: mesh, UVs, textures, materials, rig and animations, external dependencies. Open or render it.
2. **Normalise:** units and scale, axes, position, orientation, origin and pivot. Check normals, edges, thickness, topology, transparency, roughness/metalness, texture colour space, and the match with your renderer. Do not use plain WebGL material properties for WebGPU/TSL, or the other way round.
3. **Textures and weight:** textures load, sizes and paths are right, alpha is correct. The model holds up at the planned shot size. Reduce heavy meshes and textures while keeping the silhouette and needed details; check the real render speed and the export path.
4. **Light it for its material:** environment, exposure, camera, shadows, and contact. Plastic, metal, and glass must behave differently. A bright highlight and a gradient do not fix a wrong shape.
5. **Hinged devices (laptops):** check that lid and base are separate and where the hinge axis is. Opening is a relative rotation of the lid around the hinge — not a turn of the whole body. Check the closed and open states, the screen, the start orientation, and that the underside does not show by accident.

Reveals, labels, and the camera all obey one spatial scene. On a close pass, keep the hero in focus at the right scale and never cut through the surface with the near plane. When you swap a model, re-check orientation, pivot, light, contact, and animation.

## In the delivery notes

List the sites and the files you really used: author and title, link, format, the stated license or terms with the date checked, required attribution, and your changes. Code, model, textures, font, and music can each have different rights. When the use really is restricted, say exactly how and pick an allowed alternative. A right to view or download is not a right to resell or redistribute.
