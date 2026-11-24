# Lokoja flood risk map (web app)

Interactive map for the Lokoja flood susceptibility, exposure and risk results.
Next.js (App Router) + TypeScript + Leaflet. The map layers are static PNG tiles, so no map server is needed.

## Run it on your computer
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Run `python phase7a_make_web_data.py` in your analysis project. It creates a folder called `web_data`.
4. Copy that `web_data` folder into this app's `public` folder, so you have `public/web_data/layers.json`.
5. Run `npm run dev` and open http://localhost:3000.

## How it works
- `public/web_data/layers.json` lists the layers (title, legend, tile path, note). The app builds the layer list and legend from it.
- `public/web_data/summary.json` holds the tables and caveats shown in the side panel.
- `public/web_data/tiles/<layer>/<z>/<x>/<y>.png` are the map tiles.
- Add or remove a layer by changing the layers in `phase7a_make_web_data.py` and re-running it. The app needs no code change.

## Demonstration banner
`.env.local` has `NEXT_PUBLIC_DEMO=true`, which shows a banner saying the dynamic layers come from past data.
Set it to `false` (or delete the file) once the layers come from a live run.

## Files
- `app/page.tsx` page layout and data loading
- `components/FloodMap.tsx` Leaflet map and tile layer
- `components/LayerPanel.tsx` layer list, legend, opacity
- `components/InfoPanel.tsx` tables and caveats
- `lib/types.ts` types for the two JSON files

## Notes
- The base map uses OpenStreetMap tiles. For a public site, check the OpenStreetMap tile usage policy or use another base map provider.
- Build for hosting with `npm run build`, then deploy to a host such as Vercel or run `npm run start` on a server.
