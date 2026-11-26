# Feature verification

Statuses below reflect the current local test run, not the presence of code alone.

| Feature | Status | Evidence / remaining work |
|---|---|---|
| Start at Level 1, Problem 1 | Verified | Playwright checks first-load route and coding controls. |
| Five-item navigation | Verified | Playwright checks the retained primary navigation. |
| Removed destinations | Verified | Generator, playground, and legacy workspace hashes redirect to the first problem. |
| All Levels | Verified | Playwright checks level search and selected level; unit tests verify all 100 levels. |
| Static hosting and repository subpath | Verified locally | Browser tests load the root and `/repo/` using `scripts/static-server.js`; no Vite is used. |
| Editable code and saved drafts | Verified | Playwright checks edit, navigate, and reload; unit tests check empty-draft preservation and old-key migration. |
| Run Code / Submit Solution | Partially verified | Browser submission executes real Pyodide and records accepted progress; broader error/timeout/cancel cases are pending. |
| Curriculum reference validation | Verified mechanically | 100 levels, 500 records, 4,000/4,000 reference executions; see the report for the content-quality caveat. |
| Progression and daily reward | Unit-verified | Focused tests cover completion, XP, level advancement, and duplicate daily reward prevention. |
| Daily Challenge route | Verified | Playwright opens the date-selected real problem in the workspace. |
| Interview Practice | Partially verified | Preset selection, timer bar, question navigation, and score calculation are covered; reload, timeout, and result browser flows remain. |
| Settings | Partially verified | Persistence is tested; not every setting and export/import interaction has an end-to-end test. |
| Backup validation and reset scope | Unit-verified | Tests cover version/schema rejection, normalization, migration, and preservation of unrelated local storage. |
| Accessibility | Automated check passed | Axe found no serious or critical violations on the default workspace; this is not a full accessibility audit. |
| GitHub Pages | Not deployed | Source layout and relative URLs are prepared; no public deployment was authorized or tested. |
| Curriculum learning quality | Known gap | Content is repetitive and topic-mismatched despite executable reference answers. |
| Python syntax highlighting | Not implemented | Native textarea is retained for reliable, accessible editing. |
