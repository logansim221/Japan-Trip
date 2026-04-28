# Cambodia & Japan 2026 — Family Trip Dashboard

A shareable family trip dashboard built with Next.js.

## To edit the trip
All trip content lives in one file: **`app/data.js`**

- Edit `tripMeta` to update group members
- Edit `cambodiaItinerary` / `japanItinerary` for day-by-day changes
- Edit `transportInfo` for transport updates
- Edit `bookingChecklist` to add/remove tasks

## Deploy to Vercel (free, takes 2 minutes)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import your GitHub repo
4. Click Deploy — that's it

Vercel auto-detects Next.js. No config needed.

Your site will be live at `your-project.vercel.app` and you can share the link with the family.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
