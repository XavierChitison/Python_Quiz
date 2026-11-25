# PyLevel

PyLevel is a local-first, browser-based Python learning and coding interview practice platform.

## Features
- 100-level curriculum with 500 initial challenge instances
- Monaco Python editor
- Real Python execution with Pyodide in a Web Worker
- stdin/stdout and custom-input judging
- Problem library and learning roadmap
- Dashboard, XP, achievements, settings, playground, and local persistence
- Generated challenge entry point and backup export

## Development
```powers
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Commands
```powers
npm run build
npm run preview
npm run test
npm run test:e2e
npm run validate:problems
npm run test:accessibility
```

## Python execution
The first run downloads Pyodide from the jsDelivr CDN. Python executes inside a Web Worker with an in-memory stdin. Execution limits terminate or cancel long-running work. Browser execution is not a hardened security sandbox.

## Data
Learner progress is persisted in browser storage and local IndexedDB-backed/local profile data. Export progress from Settings for backup. Import and full restoration are documented as future work.
