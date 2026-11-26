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
  it('starts with an input-free Hello, World! challenge', () => {
    const first = levels[0].problems[0];
    expect(first.title).toBe('Print Hello, World!');
    expect(first.publicTestCases.every(testCase =>
      testCase.input === '' && testCase.output === 'Hello, World!'
    )).toBe(true);
    expect(first.referenceSolution).toContain('print("Hello, World!")');
  });
  it('gives revised beginner challenges distinct solutions and meaningful examples', () => {
    const revised = problems.filter(problem => problem.contentRevision === 1);
    expect(revised).toHaveLength(19);
    expect(new Set(revised.map(problem => problem.referenceSolution)).size).toBe(revised.length);
    for (const problem of revised) {
      expect(problem.examples).toHaveLength(2);
      expect(problem.examples.every(example => example.explanation)).toBe(true);
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      expect(new Set(cases.map(testCase => testCase.input)).size).toBeGreaterThanOrEqual(6);
      expect(new Set(cases.map(testCase => testCase.output)).size).toBeGreaterThan(1);
    }
  });

  it('checks revised expected outputs using independent JavaScript calculations', () => {
    const calculate = {
      'level-01-problem-2': input => input.replace(/\n$/, ''),
      'level-01-problem-3': input => String(Number(input) * 2),
      'level-01-problem-4': input => String(Number(input) ** 2),
      'level-01-problem-5': input => String(input.trim().split(/\s+/).map(Number).reduce((a, b) => a + b)),
      'level-02-problem-1': input => { const [a, b] = input.trim().split(/\s+/).map(Number); return String(a - b); },
      'level-02-problem-2': input => { const [a, b] = input.trim().split(/\s+/).map(Number); return String(a * b); },
      'level-02-problem-3': input => { const [a, b] = input.trim().split(/\s+/).map(Number); return String(Math.floor(a / b)); },
      'level-02-problem-4': input => { const [a, b] = input.trim().split(/\s+/).map(Number); return String(a % b); },
      'level-02-problem-5': input => (input.trim().split(/\s+/).map(Number).reduce((a, b) => a + b) / 3).toFixed(2),
      'level-03-problem-1': input => { const [a, b] = input.trim().split(/\s+/).map(Number); return `${a * b} ${2 * (a + b)}`; },
      'level-03-problem-2': input => { const [a, b] = input.trim().split(/\s+/).map(Number); return (a * b / 2).toFixed(2); },
      'level-03-problem-3': input => String(Number(input) ** 3),
      'level-03-problem-4': input => { const [a, b, c] = input.trim().split(/\s+/).map(Number); return String(2 * (a * b + a * c + b * c)); },
      'level-03-problem-5': input => { const [a, b, c, d] = input.trim().split(/\s+/).map(Number); return String((c - a) ** 2 + (d - b) ** 2); },
      'level-04-problem-1': input => { const [h, m] = input.trim().split(/\s+/).map(Number); return String(h * 60 + m); },
      'level-04-problem-2': input => ((Number(input) * 18 + 320) / 10).toFixed(1),
      'level-04-problem-3': input => { const n = Number(input); return `${Math.floor(n / 3600)} ${Math.floor((n % 3600) / 60)} ${n % 60}`; },
      'level-04-problem-4': input => { const [h, m, elapsed] = input.trim().split(/\s+/).map(Number); const total = (h * 60 + m + elapsed) % 1440; return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`; },
      'level-04-problem-5': input => {
        const [distance, hours] = input.trim().split(/\s+/).map(Number);
        const numerator = distance * 100;
        const whole = Math.floor(numerator / hours);
        const remainder = numerator % hours;
        const cents = whole + Number(2 * remainder > hours || (2 * remainder === hours && whole % 2 === 1));
        return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
      }
    };
    for (const problem of problems.filter(item => item.contentRevision === 1)) {
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(calculate[problem.id](testCase.input), `${problem.id}: ${testCase.input}`).toBe(testCase.output);
      }
    }
  });
});
