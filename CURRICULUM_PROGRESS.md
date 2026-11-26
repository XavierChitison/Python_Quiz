# Curriculum overhaul checkpoint

The overhaul is incomplete. Do not push this partial curriculum to the live site.

## Status

- Batch 1 (levels 1–10): in progress; 24 replacements implemented and reference-tested.
- Batches 2–10: not started.
- The original first "Print Hello, World!" problem is preserved for now; it still has only one example and repeated identical tests.
- 476 problem records, including the preserved first problem, still need review against the full requirements.
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
| level-04-problem-1 | Convert hours and minutes to minutes | Multiply and add duration components | Pyodide cases passed |
| level-04-problem-2 | Convert Celsius to Fahrenheit | Apply a formula and format one decimal | Pyodide cases passed |
| level-04-problem-3 | Break seconds into hours, minutes, and seconds | Use division and remainders for multiple units | Pyodide cases passed |
| level-04-problem-4 | Find a clock time after elapsed minutes | Wrap an elapsed duration and format clock fields | Pyodide cases passed |
| level-04-problem-5 | Calculate average trip speed | Divide and round to two decimals | Pyodide cases passed; rounding independently checked for all valid inputs |
| level-05-problem-1 | Calculate a discounted price | Subtract a percentage and convert whole dollars to cents | Pyodide cases passed |
| level-05-problem-2 | Total two kinds of shopping items | Multiply each price by its quantity and add | Pyodide cases passed |
| level-05-problem-3 | Calculate simple interest | Apply principal, rate, and years without compounding | Pyodide cases passed |
| level-05-problem-4 | Split a bill and tip | Add amounts, then divide into shares and remainder | Pyodide cases passed |
| level-05-problem-5 | Find pizzas needed for a group | Calculate demand and use ceiling integer division | Pyodide cases passed |

These objectives require only beginner input, output, and arithmetic. Both examples' inputs, outputs, and explanations are embedded in the existing description because the current UI displays only the first structured example.

## Compatibility

IDs, draft keys, and level unlocks remain unchanged. Old completions for revised problems are archived separately and are not treated as passing the replacement. Previously completed levels, assessment answers and submissions, and daily completion dates are retained as history; earned XP, streaks, and daily rewards remain intact. Existing drafts remain under their original keys and may need editing for the replacement problem. Re-solving a replacement can award its normal XP again.

The history is retained in browser storage and backups, but the existing UI has no separate history view. Versioning must be advanced for future revisions of any already-revised problem. Before eventual deployment, update the static asset version queries documented in `DEPLOYMENT_GUIDE.md` so browsers do not reuse cached old modules.

## Verification

- `npm run validate:problems`: 4,000/4,000 current reference executions passed, including 192 for the 24 replacements. This does not independently prove semantic uniqueness.
- `npm test`: 24 tests passed, including revision migration, audit tests, and independent JavaScript checks of all 192 replacement-case outputs.
- Full browser regression: 28 tests passed before the example-description adjustment. A focused browser check was rerun afterward for the displayed second example and progress migration.
- Representative incorrect solutions for all 10 level 4 and 5 problems were rejected by their cases in Pyodide.
- The speed reference was compared with exact decimal, half-even rounding for all 100,010 permitted distance-and-duration combinations.
- The full duplicate audit still fails on untouched content; it reports 475 records in identical-reference groups and 476 records with fewer than two examples. No level 4 or 5 replacement appears in any reported duplicate group. Normalized AST matches are review candidates, not conclusive semantic duplicates.

## Next action

Continue Batch 1 with `level-06-problem-1` through `level-10-problem-5`, and resolve the preserved first problem's missing second example. Build the required 500-objective manifest without inventing repetitive placeholder objectives, then complete each batch with independently checked test outputs, semantic review, validation, and local commits. Do not publish until all batches and regression tests pass.
