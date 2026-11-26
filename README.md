# Xavier's Python Challenge

Xavier's Python Challenge is a completely free, local-first browser platform for Python learning and technical interview preparation.

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

## Static hosting
Run `npm run build` and publish the `dist` directory. Relative Vite assets are configured for static subdirectory hosting.

Recommended: Cloudflare Pages or Netlify's free tier. Neither requires a backend for this application. Do not commit a custom domain or payment configuration.

Each browser profile maintains independent progress. Export JSON from Settings to transfer progress to another browser or device.
