# Test report

## Latest verification

- `npm test`: passed, 19 unit tests across 4 test files, including audio-controller behavior.
- `npm run test:e2e`: passed, 24 browser tests. Coverage includes static hosting at `/` and `/repo/`, stale-module caching, direct and invalid hash routes, browser history, skip-link focus, Python execution and progression, runtime-load retry, slow cold-start handling, timeouts, cancellation, output limits, worker recovery, Ace syntax highlighting, draft export, and music settings.
- `npm run test:accessibility`: passed; no serious or critical Axe violations on the default workspace.
- `npm run validate:problems`: passed; 100 levels, 500 challenge records, 1,500 public cases, 2,500 hidden cases, and 4,000/4,000 reference-solution executions.
- The browser suite uses the plain static test server, not a bundler or development server. Python and the checked-in Ace assets both work below `/repo/`.
- Audio unit tests use a fake Web Audio context to cover opt-in, track switching, volume, visibility pause/resume, autoplay recovery, and disabled effects.
- On the live GitHub Pages site, Chromium checks passed for startup, syntax highlighting, Python execution and custom input, correct and incorrect submissions, progress and draft persistence, navigation and information dialogs, skip-link focus, browser history, music and sound-effect scheduling, settings, export download, invalid routes, mobile width, and Axe serious/critical checks. A seeded level-10 completion showed the milestone dialog and confetti. No application JavaScript exceptions or same-origin HTTP errors were observed in the checked sessions.
- The GitHub Pages deployment and CI for commit `68129ae` completed successfully.

## Known gaps

- The curriculum validator proves structural and reference-test consistency, not that 500 entries are distinct or accurately teach their assigned topic.
- Axe coverage is limited to the default workspace; automated checks do not prove full accessibility or replace assistive-technology testing.
- The browser audio checks verify Web Audio state and scheduling, not audible output on physical speakers.

Production checks were performed in isolated Chromium browser profiles.
