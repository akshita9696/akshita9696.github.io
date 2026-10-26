# Akshita Dhariwal · Portfolio

My personal portfolio: creative marketing × intelligent automation.

**Live at [akshita9696.github.io](https://akshita9696.github.io)**

I'm building it in public, one step at a time, by vibe coding with an AI pair programmer (Claude Code). I decide the concept, the story and every design call; the AI writes the code with me. The commit history shows how it came together.

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

- `index.html` is the page shell
- `src/main.js` puts the sections together
- `src/sections/` holds one file per section of the portfolio
- `src/style.css` holds the shared styles
- `public/images/` holds my photos and work images

## Built with

- HTML, CSS and JavaScript
- [Vite](https://vite.dev) for the local dev server and the build
