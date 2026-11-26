# Changelog

## Unreleased

- Replaced the Vite/Monaco runtime with direct browser-native modules from root `index.html`.
- Added a small static test server and repository-prefix coverage for `/repo/`.
- Simplified navigation to Problems, All Levels, Daily Challenge, Interview Practice, and Settings.
- Removed old dashboard/learning/analytics routes, the standalone generator and playground, and unused Vite-era styles and workspace code.
- Added local progress normalization and backup validation while retaining compatible legacy storage keys.
- Added local progression, daily challenge, timed interview assessment, settings, sound, and celebration services.
- Added opt-in original ambient music, track and volume controls, synthesized sound effects, and persisted audio preferences.
- Added a locally hosted Ace Python editor with syntax highlighting, configurable themes, and source-preserving execution and export.
- Preserved hash routing when the keyboard skip link focuses the current page; covered repository-subpath navigation, refresh, browser history, and invalid routes.
- Versioned the static module and worker URLs to prevent older cached application files from breaking this deployment.
- Added unit and browser coverage for audio preferences, editor highlighting, Python execution, unsaved-code export, and accessible music controls.
- Documented the vendored editor and runtime licenses in `THIRD_PARTY_LICENSES.md`.
- Added focused unit and browser tests and updated the static-hosting documentation.
- Published the static application from `master` to GitHub Pages. Curriculum topic quality remains a known gap.
