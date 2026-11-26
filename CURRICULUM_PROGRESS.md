# Curriculum overhaul checkpoint

The overhaul is incomplete. Do not push this partial curriculum to the live site.

## Status

- Batch 1 (levels 1–10): implemented and reference-tested; 50 replacements.
- Batches 2–10: not started.
- 450 problem records still need replacement and review against the full requirements.
- Cross-curriculum semantic uniqueness remains unverified.

## Implemented objectives

All entries below have two explained examples, eight manually specified tests, a reference solution, and content revision 1. Each uses standard input and output.

| Existing ID | Objective | Concepts / approach | Validation |
| --- | --- | --- | --- |
| level-01-problem-1 | Swap two input values | Parse two integers and print them in reverse order | Pyodide cases passed |
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
| level-06-problem-1 | Find the last digit | Isolate the ones digit with modulo | Pyodide cases passed |
| level-06-problem-2 | Remove the last digit | Drop the ones digit using integer division | Pyodide cases passed |
| level-06-problem-3 | Sum the digits of a two-digit number | Extract and add both digits | Pyodide cases passed |
| level-06-problem-4 | Reverse a two-digit number | Exchange place values and handle leading zeros | Pyodide cases passed |
| level-06-problem-5 | Find the tens digit | Shift and isolate a decimal digit | Pyodide cases passed |
| level-07-problem-1 | Evaluate a quadratic expression | Evaluate terms from four inputs | Pyodide cases passed |
| level-07-problem-2 | Distance on a number line | Absolute difference of two positions | Pyodide cases passed |
| level-07-problem-3 | Midpoint of two numbers | Average two inputs and format one decimal | Pyodide cases passed |
| level-07-problem-4 | Hypotenuse of a right triangle | Pythagorean theorem and square root | Pyodide cases passed |
| level-07-problem-5 | Arithmetic progression term | Compute a one-based term from first and difference | Pyodide cases passed |
| level-08-problem-1 | String length | Count characters including spaces | Pyodide cases passed |
| level-08-problem-2 | First character | Index the first character, preserving spaces | Pyodide cases passed |
| level-08-problem-3 | Interior of a string | Slice away the first and last characters | Pyodide cases passed |
| level-08-problem-4 | Join two lines with a space | Preserve and concatenate two input lines | Pyodide cases passed |
| level-08-problem-5 | Repeat a string N times | Repeat a line using a second-line count | Pyodide cases passed |
| level-09-problem-1 | Uppercase text | Convert ASCII letters to uppercase | Pyodide cases passed |
| level-09-problem-2 | Lowercase text | Convert ASCII letters to lowercase | Pyodide cases passed |
| level-09-problem-3 | Trim outer whitespace | Remove outer ASCII spaces but preserve other characters | Pyodide cases passed |
| level-09-problem-4 | Replace spaces with hyphens | Replace each ASCII space without collapsing | Pyodide cases passed |
| level-09-problem-5 | First three characters | Prefix slice, including short lines | Pyodide cases passed |
| level-10-problem-1 | Format two initials | Extract and capitalize initials with punctuation | Pyodide cases passed |
| level-10-problem-2 | Weighted average of two scores | Apply complementary percentage weights | Pyodide cases passed |
| level-10-problem-3 | Update an account balance | Add a deposit and subtract a withdrawal | Pyodide cases passed |
| level-10-problem-4 | Minutes between same-day clock times | Parse clock fields and subtract minute totals | Pyodide cases passed |
| level-10-problem-5 | Remove last K characters | Slice with explicit zero and full-length boundaries | Pyodide cases passed |

These objectives require only beginner input, output, and arithmetic. Both examples' inputs, outputs, and explanations are embedded in the existing description because the current UI displays only the first structured example.

## Compatibility

IDs, draft keys, and level unlocks remain unchanged. Old completions for revised problems are archived separately and are not treated as passing the replacement. Previously completed levels, assessment answers and submissions, and daily completion dates are retained as history; earned XP, streaks, and daily rewards remain intact. Existing drafts remain under their original keys and may need editing for the replacement problem. Re-solving a replacement can award its normal XP again.

The history is retained in browser storage and backups, but the existing UI has no separate history view. Versioning must be advanced for future revisions of any already-revised problem. Before eventual deployment, update the static asset version queries documented in `DEPLOYMENT_GUIDE.md` so browsers do not reuse cached old modules.

## Verification

- `npm test`: 30 tests passed, including progress migration and independent JavaScript checks of all 400 Batch 1 case outputs.
- Targeted Pyodide validation: all 168 reference cases for the first problem and levels 7–10 passed. The previous validator run passed all 232 cases for the unchanged 29 replacements. This does not independently prove semantic uniqueness.
- Full browser regression: 28 tests passed before the example-description adjustment and later curriculum changes. Focused browser checks subsequently passed for old progress migration, the new first problem and level progression, and whitespace-preserving multiline output.
- Representative incorrect solutions for the first problem and all 35 level 4–10 problems were rejected by their cases in Pyodide.
- The speed reference was compared with exact decimal, half-even rounding for all 100,010 permitted distance-and-duration combinations.
- The duplicate audit reports no duplicate ID, title, description, reference, AST candidate, or case group involving Batch 1, and no Batch 1 problem has fewer than two examples or six tests. It still reports 450 untouched records with fewer than two examples. Normalized AST matches are review candidates, not conclusive semantic duplicates.

## Next action

Continue with Batch 2 at `level-11-problem-1`. Complete the required 500-objective manifest, then implement the conditions and Boolean logic problems with independently checked outputs, semantic review, targeted validation, and local commits. Do not publish until all batches and regression tests pass.
