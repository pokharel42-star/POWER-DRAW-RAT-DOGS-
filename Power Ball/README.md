# Power Draw Championship — Next.js

This is a Next.js App Router version of your tournament dashboard, styled to match the original reference vibe and set up for live score polling.

## Features

- Scoreboard, Squads, Group Map, and Schedule tabs
- Your 4 managers and 48 teams preloaded
- Polls `/api/live` every 15 seconds
- Falls back to seeded demo scores if no live API key is configured
- Ready for Vercel deployment

## Local setup

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repo into Vercel.
3. Add environment variables in Vercel:

```bash
WORLD_CUP_API_KEY=your_api_key_here
WORLD_CUP_API_BASE=https://worldcupapi.com/api
```

4. Redeploy.

## How live tracking works

The client polls `/api/live` every 15 seconds. That route calls your football API with the server-side key, maps returned matches to your tracked teams, and sends updated scores back to the browser.

If your chosen provider uses a different response shape, edit:

- `app/api/live/route.js` for the fetch URL, headers, and response mapping

## Suggested providers

You still need to choose and subscribe to a real football data provider. World Cup and football APIs advertise live scores, fixtures, and completed match results, which is what this project relies on for automatic updates.
