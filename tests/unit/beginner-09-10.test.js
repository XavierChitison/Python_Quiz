import { describe, expect, it } from 'vitest';
import { beginner0910Challenges } from '../../src/data/beginner-09-10.js';

const independentlyCalculate = {
  'level-09-problem-1': input => input.slice(0, -1).toUpperCase(),
  'level-09-problem-2': input => input.slice(0, -1).toLowerCase(),
  'level-09-problem-3': input => input.slice(0, -1).replace(/^ +| +$/g, ''),
  'level-09-problem-4': input => input.slice(0, -1).replace(/ /g, '-'),
  'level-09-problem-5': input => [...input.slice(0, -1)].map((character, index, text) =>
    index < text.length - 4 ? '*' : character).join(''),
  'level-10-problem-1': input => input.trim().split(/ +/).map(name => `${name[0].toUpperCase()}.`).join(''),
  'level-10-problem-2': input => {
    const [first, second, weight] = input.trim().split(/\s+/).map(Number);
    return ((first * weight + second * (100 - weight)) / 100).toFixed(2);
  },
  'level-10-problem-3': input => {
    const [balance, deposit, withdrawal] = input.trim().split(/\s+/).map(Number);
    return String(balance + deposit - withdrawal);
  },
  'level-10-problem-4': input => {
    const [start, end] = input.trim().split(/\s+/);
    const toMinutes = time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    return String(toMinutes(end) - toMinutes(start));
  },
  'level-10-problem-5': input => {
    const [text, count] = input.split('\n');
    const k = Number(count);
    return k === 0 ? text : text.slice(0, text.length - k);
  }
};

describe('beginner levels 9 and 10 challenges', () => {
  it('provides the ten requested challenges in manifest order', () => {
    expect(Object.keys(beginner0910Challenges)).toEqual([
      'level-09-problem-1',
      'level-09-problem-2',
      'level-09-problem-3',
      'level-09-problem-4',
      'level-09-problem-5',
      'level-10-problem-1',
      'level-10-problem-2',
      'level-10-problem-3',
      'level-10-problem-4',
      'level-10-problem-5'
    ]);
  });

  it('checks each challenge case with an independent calculation and validates metadata', () => {
    for (const [id, problem] of Object.entries(beginner0910Challenges)) {
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      expect(cases).toHaveLength(8);
      expect(new Set(cases.map(({ input }) => input)).size, `${id} inputs`).toBe(8);
      expect(problem.contentRevision).toBe(id === 'level-09-problem-5' ? 2 : 1);
      expect(problem.examples).toHaveLength(2);
      expect(problem.examples.every(example => example.explanation)).toBe(true);
      expect(problem.hints).toHaveLength(5);
      expect(problem.constraints.length).toBeGreaterThan(0);
      expect(problem.starterCode.stdin).toContain('#');
      expect(problem.referenceSolution).toBeTruthy();
      for (const { input, output } of cases) {
        expect(independentlyCalculate[id](input), `${id}: ${JSON.stringify(input)}`).toBe(output);
      }
    }
  });
});
