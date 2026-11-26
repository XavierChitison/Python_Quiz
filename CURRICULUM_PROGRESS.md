# Curriculum overhaul checkpoint

The 500-problem overhaul is implemented and locally validated. Deployment verification is pending.

## Status

- Batch 1 (levels 1–10): implemented and reference-tested; 50 replacements.
- Batch 2 (levels 11–20): implemented and reference-tested; 50 replacements.
- Batch 3 (levels 21–30): implemented and reference-tested; 50 replacements.
- Batch 4 (levels 31–40): implemented and reference-tested; 50 replacements.
- Batch 5 (levels 41–50): implemented and reference-tested; 50 replacements.
- Batch 6 (levels 51–60): implemented and reference-tested; 50 replacements.
- Batch 7 (levels 61–70): implemented and reference-tested; 50 replacements.
- Batch 8 (levels 71–80): implemented and reference-tested; 50 replacements.
- Batch 9 (levels 81–90): implemented and reference-tested; 50 replacements.
- Batch 10 (levels 91–100): implemented and reference-tested; 50 replacements.
- All 500 replacement records are integrated and locally validated; deployment is pending.
- Cross-curriculum objective review identified two superficial duplicates, which were replaced; automated duplicate detection cannot prove semantic uniqueness.

## Implemented objectives

All entries below have two explained examples, eight manually specified tests, and a reference solution. Each uses standard input and output.

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
| level-09-problem-5 | Mask all but the last four characters | Combine a repeated mask and an unchanged suffix | Pyodide cases passed |
| level-10-problem-1 | Format two initials | Extract and capitalize initials with punctuation | Pyodide cases passed |
| level-10-problem-2 | Weighted average of two scores | Apply complementary percentage weights | Pyodide cases passed |
| level-10-problem-3 | Update an account balance | Add a deposit and subtract a withdrawal | Pyodide cases passed |
| level-10-problem-4 | Minutes between same-day clock times | Parse clock fields and subtract minute totals | Pyodide cases passed |
| level-10-problem-5 | Remove last K characters | Slice with explicit zero and full-length boundaries | Pyodide cases passed |

These objectives use beginner input, output, arithmetic, and string operations. Both examples' inputs, outputs, and explanations are embedded in the existing description because the current UI displays only the first structured example.

Batch 2 adds comparisons, Boolean logic, conditions, dates, and coordinate problems. Its individual objectives and validation statuses are recorded in `CURRICULUM_MANIFEST.md`. Both batches retain eight cases per challenge and at least two explained examples.

Batch 3 adds distinct iteration, digit processing, number theory, and nested-loop problems. Its objectives and validation statuses are recorded in the same manifest; each has eight cases and two explained examples.

Batch 4 adds string, text-processing, and parsing problems, with individual objectives in the manifest. Each has eight cases and two explained examples.

Batch 5 adds list, grouping, and sequence-algorithm problems, each with eight cases and two explained examples.

Batch 6 adds dictionary, set, frequency, and graph-mapping problems. Each has two explained examples and at least eight cases.

Batch 7 adds functions, callbacks, matrices, numerical methods, and linear algebra. Each has two explained examples and eight cases.

Batch 8 adds binary search, sorting, number theory, greedy algorithms, and sliding windows. Each has two explained examples and eight cases.

Batch 9 adds recursion, stacks, queues, binary trees, and tries. Each has two explained examples and eight cases.

Batch 10 adds graph algorithms, backtracking, dynamic programming, and advanced assessments. Each has two explained examples and eight cases.

The final semantic review replaced the duplicate prefix and division objectives at levels 9-5 and 14-4 with masking and arithmetic-sequence classification. Their content revision is 2 so prior accepted solutions remain historical and saved drafts remain recoverable.

## Compatibility

IDs, draft keys, and level unlocks remain unchanged. Old completions for revised problems are archived separately and are not treated as passing the replacement. Previously completed levels, assessment answers and submissions, and daily completion dates are retained as history; earned XP, streaks, and daily rewards remain intact. Existing drafts remain under their original keys and may need editing for the replacement problem. Re-solving a replacement can award its normal XP again.

The history is retained in browser storage and backups, but the existing UI has no separate history view. Versioning must be advanced for future revisions of any already-revised problem. The shared static module version was advanced to 2.1.0 to prevent returning browsers from reusing cached old modules.

## Verification

- Final `npm test`: 101 tests passed, including progress migration and independent expected-output checks.
- Targeted Pyodide validation: all 400/400 Batch 1 reference cases passed, and all 50 starter programs compiled. This does not independently prove semantic uniqueness.
- Targeted Pyodide validation: all 400/400 Batch 2 reference cases passed, and all 50 starter programs compiled.
- Targeted Batch 3 tests: 20 tests passed, including progress migration, integration, and independent expected-output checks; all 400/400 Batch 3 reference cases passed in Pyodide, and all 50 starters compiled.
- Targeted Batch 4 tests: 21 tests passed, including progress migration and independent expected-output checks; all 400/400 Batch 4 reference cases passed in Pyodide with exact output whitespace, and all 50 starters compiled.
- Targeted Batch 5 tests: 20 tests passed, including progress migration and independent expected-output checks; all 400/400 Batch 5 reference cases passed in Pyodide and all 50 starters compiled.
- Targeted Batch 6 tests: 21 tests passed, including progress migration and independent expected-output checks; all 401/401 Batch 6 reference cases passed in Pyodide and all 50 starters ran successfully.
- Targeted Batch 7 tests: 23 tests passed, including progress migration and independent expected-output checks; all 400/400 Batch 7 reference cases passed in Pyodide and all 50 starters ran successfully. Additional checks covered 482 function boundaries and 3,920 exact trapezoid-rounding inputs.
- Targeted Batch 8 tests: all 400/400 reference cases passed in Pyodide and all 50 starters ran successfully; expected outputs were independently checked.
- Targeted Batch 9 tests: all 400/400 reference cases passed in Pyodide and all 50 starters ran successfully; expected outputs were independently checked.
- Targeted Batch 10 tests: all 400/400 reference cases passed in Pyodide and all 50 starters ran successfully; expected outputs were independently checked.
- Final `npm run validate:problems`: 4,001/4,001 cases passed in Pyodide; all 500 records have content revisions. The validator uses the application's output-whitespace normalization.
- Independent boundary checks passed for 1,480 calendar-date, half-open interval, and rotatable-rectangle inputs.
- Batch 2 cases rejected five representative incorrect approaches involving switch states, degenerate triangles, filename suffixes, empty intervals, and rectangle rotation.
- Batch 3 cases rejected four representative incorrect approaches involving whitespace, overlapping digit pairs, tied records, and early stopping with negative values.
- Batch 4 cases rejected six representative incorrect approaches involving digit runs, one-to-one mappings, selective reversal, closest matches, CSV parsing, and palindrome ties.
- Independent string property checks passed for 1,287 pattern-search, palindrome, and CSV inputs.
- Levels 41–45: 200 reference cases passed in Pyodide; 1,500 independent list property checks passed, and six representative incorrect implementations were rejected.
- Levels 46–50: 200 reference cases passed in Pyodide; 1,500 independent list and window property checks passed, and six representative incorrect implementations were rejected.
- Batch 6: 1,250 independent collections property checks passed; six representative incorrect implementations were rejected after adding a missing duplicate-requirement case.
- Batch 7: 1,779 independent matrix and linear-equation property checks passed, including 300 diagonal-sorting cases.
- Batch 8: 1,655 independent search, scheduling, window, and graph property checks passed.
- Batch 9: 750 independent tree property checks passed.
- Batch 10: 500 independent enclosed-water and traveling-tour checks passed.
- Level 14-4: the revised reference passed its eight cases and 1,000 additional generated cases in Pyodide; revision-one migration was tested.
- Level 9-5: the revised reference passed its eight cases and 500 additional generated cases in Pyodide; revision-one migration was tested.
- Alternating harmonic-sum rounding was independently checked for all 20 permitted positive term counts.
- Final full browser regression: 31 tests passed, covering routing, progress migration, the editor, execution, settings, exports, music controls, mobile viewport, and automated accessibility checks.
- Representative incorrect solutions for the first problem and all 35 level 4–10 problems were rejected by their cases in Pyodide.
- The speed reference was compared with exact decimal, half-even rounding for all 100,010 permitted distance-and-duration combinations.
- The duplicate audit of all 500 records found no duplicate IDs, titles, descriptions, references, AST candidates, or case groups, and no revised problem has fewer than two examples or six tests. Normalized AST matches are review candidates, not conclusive semantic duplicates.

## Next action

Commit the release-validation updates, push the completed curriculum if authorized, and verify the GitHub Pages deployment.
