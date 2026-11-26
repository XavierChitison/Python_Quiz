import { describe, it, expect } from 'vitest';
import { levels, problems } from '../../src/data/curriculum.js';

describe("Xavier's Python Challenge curriculum", () => {
  it('contains exactly 100 levels', () => {
    expect(levels).toHaveLength(100);
  });
  it('contains at least 500 challenge instances', () => {
    expect(problems.length).toBeGreaterThanOrEqual(500);
  });
  it('has five challenges in every level', () => {
    expect(levels.every(level => level.problems.length >= 5)).toBe(true);
  });
  it('uses unique problem identifiers', () => {
    expect(new Set(problems.map(problem => problem.id)).size).toBe(problems.length);
  });
  it('provides complete public and hidden test coverage', () => {
    expect(problems.every(problem =>
      problem.publicTestCases.length >= 3 &&
      problem.hiddenTestCases.length >= 5 &&
      Boolean(problem.referenceSolution)
    )).toBe(true);
  });
});
