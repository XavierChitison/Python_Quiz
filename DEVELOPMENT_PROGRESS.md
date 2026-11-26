# Development progress

## Current status

The application has been migrated to a static HTML/CSS/vanilla-JavaScript runtime. Opening the root `index.html` through VS Code Live Server is the normal way to use it; npm is only needed for contributor tests.

## Implemented

- Direct first-load into Level 1, Problem 1.
- Five-item navigation: Problems, All Levels, Daily Challenge, Interview Practice, and Settings.
- Local-first progress, settings, and saved code with legacy-key migration.
- Worker-based Pyodide execution with timeouts, cancellation, output limits, and worker recreation.
- Sequential levels, deterministic daily selection, timed interview configuration/results, settings, and versioned backup helpers.
- Responsive static layout, line numbers, indentation, keyboard shortcuts, reduced motion, sound controls, and celebrations.
- Relative module and asset URLs; local static-server tests include `/repo/` hosting.
- Removed old Vite, Monaco, standalone tools, and unused style modules.

## Remaining work

- Author and validate topic-accurate, distinct problems; current generated curriculum content remains repetitive.
- Add syntax highlighting without compromising editor accessibility or fallback behavior.
- Expand browser tests for Python exceptions, multi-line/custom stdin, output limits, cancellation, timeout recovery, interview expiration/reload, and backup UI workflows.
- Manually verify keyboard/screen-reader behavior and responsive layouts across browsers.
- GitHub Pages publication has not been authorized or performed.

## Verified

- `npm ci` passed.
- `npm test`: 12 tests passed.
- `npm run validate:problems`: 4,000/4,000 reference-solution executions passed across 100 levels and 500 records.
- `npm run test:accessibility` passed with no serious or critical Axe violations on the default workspace.
- Root and `/repo/` routes, navigation, daily flow, interview question navigation, settings persistence, draft persistence, mobile layout, and one real Python submission are covered by Playwright. A final full E2E rerun remains.
