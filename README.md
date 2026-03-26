# Apex Stats

Apex Stats is a Formula 1 analytics dashboard built with React, TypeScript, and Vite.

It includes standings, race analytics, comparison views, prediction widgets, and an F1 news feed, with a fast frontend workflow powered by local service data.

## Features

- Multi-tab dashboard: Overview, Standings, Analytics, Results, Predictions, Calendar, News, Compare
- Season-aware filtering (currently focused on 2025 and 2026 datasets)
- Driver and team comparison UI
- Visual analytics using Recharts and Chart.js
- Rich media assets for drivers, teams, cars, and news cards
- Database SQL scripts and Supabase function scaffolding for backend evolution

## Tech Stack

- React 18
- TypeScript
- Vite 6
- Tailwind CSS 4
- Recharts + Chart.js
- Radix UI + MUI components
- Supabase CLI/tooling

## Requirements

- Node.js 20+
- npm 9+

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

## Scripts

- `npm run dev` - start the local development server
- `npm run build` - create the production build in `dist/`

## Data Source (Current State)

The current UI is powered by local/mock services while backend integration continues:

- `src/app/services/api.ts`
- `src/app/services/driverStatsApi.ts`

This keeps iteration fast and deterministic during UI and feature development.

## Project Layout

```text
src/
  app/
    App.tsx
    components/
    contexts/
    data/
    services/
    utils/
public/
  Cars/
  Countries/
  Driver Images/
  Drivers 2025/
  Team Images/
  News/
database/
  f1_schema.sql
  f1_views.sql
  f1_procedures.sql
  f1_triggers.sql
  f1_2025_season_data.sql
supabase/
  functions/server/
```

## Deployment

`render.yaml` is configured for static hosting on Render:

- Build command: `npm install && npm run build`
- Publish path: `./dist`
- Rewrite rule: `/* -> /index.html` (SPA routing support)

## Roadmap Notes

- SQL files in `database/` define schema, views, procedures, triggers, and seed data.
- News content is currently maintained in `src/app/data/newsData.ts`.
- Package name in `package.json` (`@figma/my-make-file`) appears to be a placeholder and can be renamed when publishing or standardizing project metadata.











