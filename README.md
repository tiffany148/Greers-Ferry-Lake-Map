# Greers Ferry Lake Map

Interactive map of Greers Ferry Lake (Arkansas) — coves, islands, parks, and marinas, plus community-named coves and a **Before the dam** overlay of USGS topographic maps from 1963 and earlier.

## Run it

Needs Node.js 22+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (the app is bound to port 8080).

## Put this on GitHub

Easiest: unzip this project, then on [github.com/new](https://github.com/new) create an empty repo and use **Add file → Upload files** to drop the whole folder in.

Or from a terminal in the unzipped folder (replace `YOUR_USER` / `YOUR_REPO`):

```bash
git init
git add .
git commit -m "Greers Ferry Lake map"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Do not commit `node_modules` — run `npm install` after cloning.

## What you get

- Pins for islands, coves, Corps parks, marinas, towns, and landmarks
- Search, region chips (Upper Lake, The Narrows, Lower Lake), and a distance ruler
- **Name a cove** — shared names persist when a database is configured
- **Before the dam** — georeferenced USGS historical topos (Little Red River valley before the reservoir)
- Saved hearts stay in the browser (`localStorage`)

## Database (optional)

Cove names are stored in Postgres. Locally, the app falls back to an in-memory database, so names reset on restart.

To keep names across restarts, set `DATABASE_URL` to a Postgres connection string (for example [Neon](https://neon.tech)) and run:

```bash
npm run db:migrate
```

There is no sign-in. Community cove rows are public.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run db:migrate` | Apply SQL migrations |
