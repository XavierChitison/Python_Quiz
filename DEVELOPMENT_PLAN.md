# Development plan

## Static runtime

- [x] Make root `index.html` the application entry point.
- [x] Replace required Vite/Monaco runtime with browser-native modules and a textarea editor.
- [x] Preserve browser Python execution in a pinned Pyodide Web Worker.
- [x] Use relative paths and test root plus repository-prefix hosting.
- [x] Remove obsolete Vite configuration and unused workspace/styles.

## Retained game

- [x] Start new visitors in the first problem.
- [x] Keep Problems, All Levels, Daily Challenge, Interview Practice, and Settings.
- [x] Preserve progress/drafts and legacy storage keys.
- [x] Add sequential progression, daily rewards, timed question navigation, and result scoring.
- [x] Keep local backup, export, settings, reduced motion, sound, and celebrations.

## Remaining

- [ ] Author and validate topic-accurate problems throughout all 100 levels.
- [ ] Add accessible syntax highlighting to the editor.
- [ ] Expand end-to-end coverage for runtime recovery, timed assessments, and backup workflows.
- [ ] Obtain authorization before any public deployment.
