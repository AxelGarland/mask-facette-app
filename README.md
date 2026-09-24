# Kindred

A poster collection of generated faces. Twenty-seven hand-drawn tiles and a few
rules of symmetry produce endless faces that share the same DNA.

This repo holds the landing page, the interactive face generator, and the poster
inquiry form.

## Tech stack

- Vanilla JS modules, HTML and CSS, built with Vite
- p5.js (loaded from a CDN) for the face generator
- A generated SVG tile sprite for the landing page faces

## Getting started

Requires Node.js 18 or higher.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually `http://localhost:5173`).

## Scripts

- `npm run dev` starts the development server
- `npm run build` builds for production
- `npm run preview` previews the production build
- `npm run lint` runs ESLint

## Where things live

- `index.html`, `kindred.css`, `landing.js`: the landing page
- `face-engine.js`: the face rules (which tile goes in which cell)
- `main.js`: the face generator, and the tile and word data tables
- `posters.js`: contact email, poster list, product facts and mockups
- `public/tiles`: the 27 tile SVGs. After editing them, run
  `node scripts/build-tile-sprite.mjs` to regenerate `tile-sprite.js`
- `public/posters` and `public/mockups`: poster and mockup images

## Deployment

Configured for Vercel. Connect the repository and it builds automatically.
