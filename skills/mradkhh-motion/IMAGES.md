# Generated images and one consistent hero

Read this when the video needs generated images: one character, object, or scene across several poses, or images with transparency.

## Keep the hero the same

- Use a reference/editing workflow anchored to **one canonical set of references**. For every new pose, feed that same set — not only the latest regeneration with its accumulated drift. Never generate each frame as an independent look-alike.
- Before generating, fix: constant features, camera and shot size, anchors, scale, light source, background or alpha, and what changes in each phase.
- After generating: align anchor points, silhouette, and contact; check face and anatomy, hands, object details, perspective, and light direction. Note the real intervals where each state appears in the video.
- The task sets the number of poses; there is no fixed three or five.

## Be honest about motion

- Three poses are a discrete series, not a smooth rotation.
- Crop, zoom, interpolation, or 2.5D parallax of one image is not a new pose or a free 3D camera.
- A smooth change needs consistent in-between states or real geometry. Pick the method by the task and name the result honestly. Morphing broken anatomy is not smoothness.
- For smooth motion it is often better to animate a consistent cutout or rig than to generate every frame.
- Layers and inpainted hidden areas must survive the chosen camera. Do not promise a believable new angle from data the source does not have.

## Transparency

Make a real PNG with an alpha channel. A drawn checkerboard or a flat background is not transparency. Check the alpha channel, the edge on dark and light backgrounds, colour halos, and premultiplied alpha. Export and scaling must not bring back a baked background or a ragged edge.

## Give the image a job

In motion, an image plays a role: the hero, an object of contact, a layer of space, a material, or part of a transformation. Tie its motion to the storyboard. A plain pan over a passive picture does not replace a promised action.

## Providers

Use a generation tool that is **already available and allowed**. Do not sign up for services, add an MCP server or API, or set up a local backend unless the user says so. When one route is not available, pick another and keep the staging and the honest limits.

**Note:** the facts below come from provider documentation, last checked **2026-10-16**. They were not tested for keeping a character consistent. Plans and limits change — check the provider's page before you rely on them, and write the date you checked into the delivery notes.

| Provider | What the docs say — and what not to promise |
| --- | --- |
| [Krea](https://www.krea.ai/docs/developers/mcp) (MCP: `https://api.krea.ai/mcp`) | MCP through OAuth spends workspace compute units; an API token spends a **separate paid API balance**. [Free](https://www.krea.ai/pricing): 100 units a day, no card — not a guaranteed number of reference edits. Krea 3 takes up to 6 references. Commercial license on paid plans only; treat Free as personal testing. Native alpha not confirmed. |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/) | Free: 10,000 neurons a day, reset at 00:00 UTC. Neurons are compute, not images. [FLUX.2 Klein 4B](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/): multipart input, up to 4 references (`input_image_0…3`), each **under 512×512**; output 256–1920 px, base64. REST only — needs a small adapter; no turnkey MCP. Native alpha not confirmed. |
| [Gemini web](https://support.google.com/gemini/answer/14286560?hl=en), [ChatGPT images](https://help.openai.com/en/articles/11084440-images-in-chatgpt) | Web fallbacks for reference editing. Limits float. A free chat is not a free API. Automation only with a browser tool that is really available. Asking for transparency does not replace checking the alpha. |
| [Leonardo](https://leonardo.ai/pricing) | 150 tokens a day, free work is public, API separate. Image guidance limited on Free; reference + alpha on Free needs a real test. |
| [Ideogram](https://docs.ideogram.ai/plans-and-billing/available-plans.md) | 30 credits a week; free work is public. No free API. |
| [Hugging Face](https://huggingface.co/docs/inference-providers/main/pricing) | $0.10 a month of inference; ZeroGPU Spaces have queues and quotas. Not a reliable production backend. |
| [Recraft](https://www.recraft.ai/docs/plans-and-billing/free-plan) | Limited free plan, no commercial license. |
| Pollinations, Replicate, fal | Paid or trial credits. Do not list them as free routes without a fresh check. |

**Local route (optional):** [ComfyUI MCP](https://docs.comfy.org/agent-tools/mcp), a small SD 1.5 + IPAdapter, and [rembg](https://github.com/danielgatis/rembg) for background removal — only in an environment that already has them, or with the user's OK to set them up. Never install by default. Strong image-edit models need a lot of VRAM (Klein 4B: about 8.4 GB); check the user's GPU before you promise them.

In the delivery notes, list the provider and model you really used, the route, the date you checked the limits, and the terms.
