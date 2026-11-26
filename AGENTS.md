# Xavier's Python Challenge Agent Guide

## Architecture
- `index.html` is the static entry point; no application build is required.
- `src/main.js` starts the app and `src/app.js` owns routing and UI.
- `src/workers/python.worker.js` runs Pyodide in a browser Web Worker.
- `src/data/curriculum.js` owns levels and challenge metadata.
- `src/services/` owns persistence, progression, execution, audio, and effects.
- `src/styles/game.css` is the application stylesheet.

## Commands
- Open the root `index.html` with VS Code Live Server to use the app.
- `npm ci` installs contributor-only test dependencies.
- `npm test`
- `npm run test:e2e`
- `npm run validate:problems`

## Conventions
- Keep UI text accessible and use native controls.
- Never claim browser Python is a secure server-side sandbox.
- Validate every challenge reference solution before adding it.
- Run the curriculum validator after curriculum changes.
- Keep static asset, module, and worker URLs relative for repository subpaths.
