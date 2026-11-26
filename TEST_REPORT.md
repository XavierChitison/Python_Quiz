# Test report

## Verification results

- `npm test`: 101 tests passed across 25 unit-test files.
- `npm run test:e2e`: all 33 Playwright browser tests passed on the local static test server.
- `npm run test:accessibility`: the representative route/state Axe test passed with zero reported violations. Coverage includes 15 sampled states; details and limitations are in [ACCESSIBILITY_REPORT.md](./ACCESSIBILITY_REPORT.md).
- `npm run validate:problems`: all 4,001 reference executions passed; 100 levels and 500 challenges were validated, with 1,500 public and 2,501 hidden cases.
- Responsive automated checks covered workspace, All Levels, and Settings at 16 widths from 320px to 2560px, text-spacing overrides at 320px, and portrait/landscape viewport sizes; no page-wide horizontal overflow was found.
- Touch-enabled phone emulation completed a correct challenge, verified saved progress/draft, exported the Python file, and checked a landscape viewport. This did not emulate an operating-system keyboard or a physical device.
- Browser regression coverage includes routing and history, skip-link focus, route focus and page titles, Ace highlighting/editing, output-tab keyboard behavior without recreating Ace, Python execution, correct and incorrect solutions, custom input, errors and worker recovery, progress, settings, audio controls, export, and level-completion accessibility.
- The project remains a static site: tests used the repository's static server, without a build or backend.

## Browser and deployment limits

- Playwright Chromium was available. Firefox and WebKit executables were not installed; no other browser engine was tested.
- No physical mobile/tablet, screen reader, audible-speaker, virtual-keyboard, pinch-zoom, or real-device safe-area test was performed.
- These responsive and accessibility changes have not yet been verified on GitHub Pages. Production status must be updated after deployment checks; do not infer production success from local tests.
