# Xavier's Python Challenge Agent Guide

## Architecture
- `src/app.js` owns routing and application shell.
- `src/pages/workspace` owns Monaco and judge UI.
- `src/workers/python.worker.js` owns browser Python execution.
- `src/data/curriculum.js` owns levels and challenge metadata.
- `src/services/storage.js` owns browser persistence.

## Commands
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run validate:problems`

## Conventions
- Keep UI text accessible and use native controls.
- Never claim browser Python is a secure server-side sandbox.
- Validate every challenge reference solution before adding it.
- Run the curriculum validator after curriculum changes.
