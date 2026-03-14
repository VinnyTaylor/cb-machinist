# CB-Machinist Project Instructions

## Project Overview
- **Type:** React PWA (Progressive Web App)
- **Stack:** React 18, TypeScript, Vite, React Router
- **Deployment:** Netlify
- **Purpose:** Machinist calculator and reference tool

## Project Structure
```
src/
├── calculators/     # Calculator components (BoltCircle, Speeds/Feeds, etc.)
├── components/      # Shared UI components
├── data/            # Static data (gcodes, materials, threads, etc.)
├── hooks/           # Custom React hooks
├── manual/          # Manual/documentation content
├── reference/       # Reference page components
├── App.tsx          # Main app with routing
└── main.tsx         # Entry point
```

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run generate-icons` | Generate PWA icons |

## Session Tracking
Session logs are stored in `docs/sessions/` with format `YYYY-MM-DD.md`.

Each session log should include:
- Date and summary of work done
- Files modified
- Any incomplete tasks or next steps

## Development Notes
- PWA enabled via `vite-plugin-pwa`
- Bottom navigation for mobile-first design
- Local storage hooks for persisting user preferences
