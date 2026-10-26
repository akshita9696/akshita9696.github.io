# Akshita Dhariwal · Portfolio

My personal portfolio, styled as a streaming-service title page: marketing that runs itself.

**Live at [akshita9696.github.io](https://akshita9696.github.io)**

I build it in public by vibe coding with an AI pair programmer (Claude Code). I decide the concept, the story and every design call; the AI writes the code with me.

## What's inside

- **Hero:** an intro video, a photo that follows your cursor, and pop-ups behind the round buttons (shortlist, like, dislike, share).
- **Try my AI:** paste a website and a live n8n workflow reads the landing page and suggests 3 automation ideas.
- **Gallery:** my automation systems, what I'm building now, my marketing years in India and my MSc projects.
- **Watch it run:** each automation card plays an example run on top of the real n8n workflows. A dot follows the real wires, each step lights up, and a caption explains what happened.
- **Details:** experience, education and tools. **Search** finds anything on the page.

## Run it locally

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

## Build for the web

```bash
npm run build
```

The finished site goes into `dist/`. Every push to `main` builds it and publishes it to GitHub Pages automatically (see `.github/workflows/deploy.yml`).

## How the project is organised

- `index.html` is the page shell, with the link preview tags
- `src/content.js` holds all the words on the site
- `src/main.js` puts the sections together
- `src/sections/` holds one file per section
- `src/ui/` holds the pop-ups, search and the "Watch it run" player
- `src/flows/` holds the example runs and the layout of each n8n workflow (step positions and wire shapes only, no settings)
- `src/style.css` holds the styles
- `public/images/` holds the photos, Gallery covers and workflow pictures
- `tools/og-image.py` makes the link preview image

## Built with

- HTML, CSS and JavaScript
- [Vite](https://vite.dev) for the local dev server and the build
- [n8n](https://n8n.io) for the automations shown in the Gallery and the live AI
