# Curriculum overhaul checkpoint

The overhaul is incomplete. Do not push this partial curriculum to the live site.

## Status

- Batch 1 (levels 1–10): in progress; 14 replacements implemented and reference-tested.
- Batches 2–10: not started.
- The original first "Print Hello, World!" problem is preserved for now; it still has only one example and repeated identical tests.
- 486 problem records, including the preserved first problem, still need review against the full requirements.
- A complete 500-objective development manifest has not yet been created. Cross-curriculum semantic uniqueness remains unverified.

## Implemented objectives

All entries below have two explained examples, eight manually specified tests, a reference solution, and content revision 1. Each uses standard input and output.

| Existing ID | Objective | Concepts / approach | Validation |
| --- | --- | --- | --- |
| level-01-problem-2 | Echo a line, preserving spaces | Read and print a string | Pyodide cases passed |
| level-01-problem-3 | Double an integer | Integer input and multiplication | Pyodide cases passed |
| level-01-problem-4 | Square an integer | Multiply a value by itself | Pyodide cases passed |
| level-01-problem-5 | Add two integers | Parse two values and add | Pyodide cases passed |
| level-02-problem-1 | Subtract two integers | Parse two values and subtract in order | Pyodide cases passed |
| level-02-problem-2 | Multiply two integers | Parse two values and multiply | Pyodide cases passed |
| level-02-problem-3 | Find a floor quotient | Integer parsing and floor division | Pyodide cases passed |
| level-02-problem-4 | Find a remainder | Integer parsing and modulo | Pyodide cases passed |
| level-02-problem-5 | Average three integers | Sum, divide, and format two decimals | Pyodide cases passed |
| level-03-problem-1 | Rectangle area and perimeter | Parse dimensions; calculate two results | Pyodide cases passed |
| level-03-problem-2 | Triangle area | Multiply dimensions, halve, format decimals | Pyodide cases passed |
| level-03-problem-3 | Cube volume | Cube an integer | Pyodide cases passed |
| level-03-problem-4 | Cuboid surface area | Combine three face-area products | Pyodide cases passed |
| level-03-problem-5 | Squared distance between points | Calculate coordinate differences and squares | Pyodide cases passed |

These objectives require only beginner input, output, and arithmetic. Their examples are embedded in the existing description because the current UI displays only the first structured example.

## Compatibility

IDs, draft keys, and level unlocks remain unchanged. Old completions for revised problems are archived separately and are not treated as passing the replacement. Previously completed levels, assessment answers and submissions, and daily completion dates are retained as history; earned XP, streaks, and daily rewards remain intact. Existing drafts remain under their original keys and may need editing for the replacement problem. Re-solving a replacement can award its normal XP again.

The history is retained in browser storage and backups, but the existing UI has no separate history view. Versioning must be advanced for future revisions of any already-revised problem. Before eventual deployment, update the static asset version queries documented in `DEPLOYMENT_GUIDE.md` so browsers do not reuse cached old modules.

## Verification

- `npm run validate:problems`: 4,000/4,000 current reference executions passed, including 112 for the 14 replacements. This does not independently prove semantic uniqueness.
- `npm test`: 24 tests passed, including revision migration, audit tests, and independent JavaScript checks of all 112 replacement-case outputs.
- `npm run test:e2e`: 25 browser tests passed before the geometry additions. After the additions, three focused browser tests passed, covering geometry rejection and acceptance, level progression, and progress migration.
- The full duplicate audit still fails on untouched content; it reports 485 records in identical-reference groups and 486 records with fewer than two examples. Normalized AST matches are review candidates, not conclusive semantic duplicates.

## Next action

Continue Batch 1 with `level-04-problem-1` through `level-10-problem-5`, and resolve the preserved first problem's missing second example. Build the required 500-objective manifest without inventing repetitive placeholder objectives, then complete each batch with independently checked test outputs, semantic review, validation, and local commits. Do not publish until all batches and regression tests pass.
