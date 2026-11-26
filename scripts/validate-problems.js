import { levels, problems } from '../src/data/curriculum.js';

const ids = new Set();
const failures = [];
if (levels.length !== 100) failures.push(`Expected 100 levels, found ${levels.length}`);
if (problems.length < 500) failures.push(`Expected at least 500 problems, found ${problems.length}`);
for (const level of levels) {
  if (level.problems.length < 5) failures.push(`Level ${level.number} has fewer than five problems`);
  for (const problem of level.problems) {
    if (ids.has(problem.id)) failures.push(`Duplicate id: ${problem.id}`);
    ids.add(problem.id);
    if (!problem.referenceSolution) failures.push(`Missing reference solution: ${problem.id}`);
    if (problem.publicTestCases.length < 3) failures.push(`Expected at least 3 public tests: ${problem.id}`);
    if (problem.hiddenTestCases.length < 5) failures.push(`Expected at least 5 hidden tests: ${problem.id}`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Validated ${levels.length} levels and ${problems.length} challenge instances.`);
