# Athif Ahammed — Portfolio (recreation)

Homepage rebuild of https://athifahammed.framer.website/, built as a plain static site
(no framework, no build step) so it deploys to Vercel with zero config.

## What's done
- `index.html` — full homepage (hero, services, showreel, about/stats, clients, featured
  projects, CTA, newsletter, footer)
- `portfolio.html`, `about.html`, `service.html`, `blog.html`, `terms.html` — placeholder
  pages linked from the nav, ready to be built out next
- `styles.css`, `script.js` — shared across all pages

## Design direction
Recreated the content 1:1, but since Framer's source/CSS isn't accessible, the visual
design was rebuilt from scratch as an "editor's timeline" theme fitting a video editor /
motion designer: near-black canvas, one kinetic lime accent (#d4ff3f), tick-mark rulers
as section dividers instead of soft gradients, a running timecode readout in the hero,
Bricolage Grotesque for display type + Inter for body + JetBrains Mono for
labels/timecodes.

Images are currently hot-linked from the original Framer CDN (framerusercontent.com /
i.ytimg.com) so the page works immediately — swap in your own hosted copies under
`/assets` when convenient (paths are already set up for that).

## Deploy to Vercel
1. Push this folder to a GitHub repo (or drag-and-drop the folder at vercel.com/new).
2. In Vercel: New Project → Import this repo.
3. Framework Preset: **Other** (it's static HTML — no build command needed).
4. Deploy.

Or via CLI, from inside this folder:
```
npm i -g vercel
vercel
```

## Next steps
- Build out Portfolio / About / Service / Blog pages with real content
- Replace hot-linked images with your own hosted assets
- Wire the newsletter form to an actual provider (Mailchimp, ConvertKit, etc.) — it's
  currently a static form with no backend
- Swap the CV download link / contact details if anything's changed
