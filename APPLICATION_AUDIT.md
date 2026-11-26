# Application audit

## Architecture

- The root `index.html` loads the static app directly with relative CSS and JavaScript module paths.
- `src/app.js` handles the five retained destinations: Problems, All Levels, Daily Challenge, Interview Practice, and Settings.
- `src/workers/python.worker.js` runs the pinned Pyodide runtime off the main thread.
- Browser progress and drafts stay in local storage; legacy `pylevel-*` keys are retained for migration.
- GitHub Pages compatibility is configured for source publishing; no deployment was performed.

## Findings and status

| Area | Finding | Status and evidence |
|---|---|---|
| Startup | A new visitor should begin with the first coding problem, not an onboarding page. | Implemented and covered by Playwright. |
| Static hosting | No frontend build should be required; paths must work below a repository prefix. | Native modules and relative paths are served by the static test server; `/repo/` browser test passes. |
| Navigation | Only the five retained areas should be user-facing; old links must not expose removed pages. | Implemented; removed legacy routes redirect to the coding workspace. |
| Curriculum | There are 100 levels and 500 problem records with 1,500 public and 2,500 hidden cases. Many records are still factory-generated and do not teach their stated topic. | High-priority unresolved content issue. All 4,000 reference executions pass, which does not establish educational quality. |
| Editor | The native textarea supports editing, indentation, line numbers, save, reset, and export. | Functional; syntax highlighting is not currently provided. |
| Python runtime | Pyodide runs in a worker; source, input, output, timeout, and cancellation safeguards are present. | One real browser submission and the curriculum validator pass. Additional exception, output-limit, timeout-recovery, and cancellation browser cases remain to be verified. |
| Progression | Completion, XP, daily rewards, levels, and streaks are based on saved browser state. | Unit coverage exists for rewards, level progression, and daily idempotency; milestone completion UI has not been exercised end to end. |
| Daily Challenge | Picks a real challenge consistently for each local date and opens it in the shared workspace. | Covered for navigation; date rollover and repeated reward scenarios are unit-tested in part. |
| Interview Practice | Timed assessment questions use the shared coding workspace and persist their deadline. | Configuration, question navigation, and result scoring are implemented; expiration/reload and full result review need further browser verification. |
| Settings and backups | Settings persist, drafts migrate, backups are versioned, and reset is scoped to this app's data. | Storage normalization and reset scope have focused unit tests; download/import UI flows are not yet tested end to end. |
| Accessibility | Native controls, labels, focus handling, reduced-motion setting, and dialog focus trap are present. | Axe reports no serious or critical violations on the default workspace. Manual keyboard/screen-reader review is still needed. |
| Deployment | No live Pages deployment has been performed. | The guide explains source publishing; deployment remains an owner-controlled action. |

## Removed features

The dashboard, activity/skill metrics, code prediction, lessons, guided learning, mistake notebook, achievements page, debugging challenges, generator, standalone playground, analytics, and separate review page are not in the navigation or runtime. Legacy route names redirect to the main workspace. Shared coding and progression services remain because retained features use them.

## Reliability and privacy notes

- Python code runs in the visitor's browser, not on a server. This is not a hardened security sandbox, and client-side hidden tests can be inspected.
- Pyodide loads from jsDelivr on first use and requires network access.
- Progress is browser-specific and does not sync to another device.
