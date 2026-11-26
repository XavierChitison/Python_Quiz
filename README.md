# Xavier's Python Challenge

Xavier's Python Challenge is a free, local-first Python coding game. It is a static website built with HTML, CSS, and browser-native JavaScript modules; the root `index.html` is the app entry point.

## Features
- Start directly in the first coding problem
- 100 levels and 500 challenge records, with sequential progression
- Ace-based Python editor with local syntax highlighting, keyboard editing, and configurable themes
- Custom stdin, public/hidden test evaluation, and progressive hints
- Pyodide Python runtime in a browser Web Worker
- Daily challenge, timed interview practice, settings, and local progress
- Saved drafts, JSON backup/restore, and Python-file export
- Responsive phone, tablet, and desktop layouts, keyboard navigation, reduced-motion support, and opt-in procedural background music and sound effects

## Run the app

1. Open the project folder in VS Code.
2. Open the root `index.html`.
3. Start the page with the **Live Server** extension.

Serve the page over HTTP; browser-native modules do not work reliably from `file://`. Visitors do not need npm, Node.js, a build step, an account, or a backend. Ace is vendored under `public/vendor/ace/`, so the editor also works on static hosting.

## Contributor checks

Install test-only dependencies with `npm ci`, then run:

```powershell
npm test
npm run test:e2e
npm run test:accessibility
npm run validate:problems
node scripts/audit-curriculum.js
```

`npm run serve:test` starts the small static test server used by Playwright. It can also serve the app under `/repo/` to verify repository subpaths. There is intentionally no Vite build or development-server requirement.

The curriculum validator checks all reference executions and required metadata. The separate audit checks duplicate candidates; AST similarity still requires human interpretation, and passing reference tests alone do not prove semantic uniqueness.

## Accessibility and responsive testing

The interface includes a skip link, semantic page landmarks, keyboard-operable controls, reduced-motion support, and layouts tested from 320px to 2560px. Key touch targets expand to 44px at tablet and phone widths. Read [ACCESSIBILITY_REPORT.md](./ACCESSIBILITY_REPORT.md) and [RESPONSIVE_TEST_REPORT.md](./RESPONSIVE_TEST_REPORT.md) for measured coverage and limitations.

The reports describe Chromium and touch-device emulation only. No physical phone/tablet or screen reader was available, so this project does not claim complete WCAG conformance or verified mobile virtual-keyboard behavior.

## Python execution and privacy

The first Python run downloads the pinned Pyodide runtime from jsDelivr and needs an internet connection. Code executes locally in a browser Web Worker. This is not a hardened security sandbox; hidden test data is inspectable. Progress and drafts stay in the current browser profile unless exported, and do not sync across devices.

## Publishing

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md). GitHub Pages publishes from the repository root without bundling. The production site is available at [Xavier's Python Challenge](https://xavierchitison.github.io/Python_Quiz/).

See [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md) for editor and Python-runtime notices.

## Validation status

See [TEST_REPORT.md](./TEST_REPORT.md) for the latest unit, browser, accessibility, and curriculum validation results. Automated checks sample routes and states; they do not replace manual assistive-technology, real-device, or full WCAG evaluation.
