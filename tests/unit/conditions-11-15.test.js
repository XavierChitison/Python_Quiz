import { describe, expect, it } from 'vitest';
import { conditions1115Challenges } from '../../src/data/conditions-11-15.js';

const integerValues = input => input.trim().split(/\s+/).map(Number);
const boolText = value => value ? 'True' : 'False';

const independentlyCalculate = {
  'level-11-problem-1': input => {
    const [n] = integerValues(input);
    return n < 0 ? 'Negative' : n === 0 ? 'Zero' : 'Positive';
  },
  'level-11-problem-2': input => integerValues(input)[0] % 2 === 0 ? 'Even' : 'Odd',
  'level-11-problem-3': input => {
    const [a, b] = integerValues(input);
    return a < b ? 'Less' : a === b ? 'Equal' : 'Greater';
  },
  'level-11-problem-4': input => String(Math.max(...integerValues(input))),
  'level-11-problem-5': input => {
    const [x, low, high] = integerValues(input);
    return String(Math.min(high, Math.max(low, x)));
  },
  'level-12-problem-1': input => {
    const [x, low, high] = integerValues(input);
    return boolText(low <= x && x <= high);
  },
  'level-12-problem-2': input => {
    const [n, a, b] = integerValues(input);
    return boolText(n % a === 0 && n % b === 0);
  },
  'level-12-problem-3': input => {
    const [first, second] = integerValues(input);
    return (first > 0) !== (second > 0) ? 'Yes' : 'No';
  },
  'level-12-problem-4': input => {
    const [a, b, c] = integerValues(input);
    return new Set([a, b, c]).size === 3 ? 'Yes' : 'No';
  },
  'level-12-problem-5': input => {
    const year = integerValues(input)[0];
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? 'Leap year' : 'Common year';
  },
  'level-13-problem-1': input => String(integerValues(input).sort((a, b) => a - b)[1]),
  'level-13-problem-2': input => integerValues(input).sort((a, b) => a - b).join(' '),
  'level-13-problem-3': input => {
    const [a, b, c] = integerValues(input);
    return a + b > c && a + c > b && b + c > a ? 'Valid' : 'Invalid';
  },
  'level-13-problem-4': input => {
    const [a, b, c] = integerValues(input);
    return a === b && b === c ? 'Equilateral' : a === b || a === c || b === c ? 'Isosceles' : 'Scalene';
  },
  'level-13-problem-5': input => {
    const [a, b, c] = integerValues(input).sort((x, y) => x - y);
    const shortSquares = a * a + b * b;
    const longSquare = c * c;
    return shortSquares === longSquare ? 'Right' : shortSquares > longSquare ? 'Acute' : 'Obtuse';
  },
  'level-14-problem-1': input => {
    const score = integerValues(input)[0];
    return score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  },
  'level-14-problem-2': input => {
    const usage = integerValues(input)[0];
    return String(usage <= 10 ? 5 : 5 + (usage - 10) * 2);
  },
  'level-14-problem-3': input => {
    const income = integerValues(input)[0];
    return (Math.min(income, 10000) * 0.1 + Math.max(0, income - 10000) * 0.2).toFixed(2);
  },
  'level-14-problem-4': input => {
    const [a, b, c] = integerValues(input);
    return b - a !== c - b ? 'Not arithmetic' : b > a ? 'Increasing' : b < a ? 'Decreasing' : 'Constant';
  },
  'level-14-problem-5': input => {
    const [a, b] = integerValues(input);
    return a === 0 ? b === 0 ? 'Infinitely many solutions' : 'No solution' : b === 0 ? '0.00' : (-b / a).toFixed(2);
  },
  'level-15-problem-1': input => {
    const character = input.slice(0, -1);
    const code = character.charCodeAt(0);
    return code >= 65 && code <= 90 ? 'Uppercase letter'
      : code >= 97 && code <= 122 ? 'Lowercase letter'
        : code >= 48 && code <= 57 ? 'Digit' : 'Other';
  },
  'level-15-problem-2': input => 'aeiou'.includes(input.slice(0, -1).toLowerCase()) ? 'Vowel' : 'Consonant',
  'level-15-problem-3': input => {
    const [first, second] = input.trim().split(' ');
    return first.toLowerCase() === second.toLowerCase() ? 'Equal' : 'Different';
  },
  'level-15-problem-4': input => {
    const [first, second] = input.slice(0, -1).split('\n');
    return first <= second ? first : second;
  },
  'level-15-problem-5': input => {
    const [filename, extension] = input.slice(0, -1).split('\n');
    return filename.toLowerCase().endsWith(extension.toLowerCase()) ? 'Yes' : 'No';
  }
};

describe('conditional and Boolean challenges for levels 11 through 15', () => {
  it('exports all 25 challenges in manifest order', () => {
    expect(Object.keys(conditions1115Challenges)).toEqual(
      Array.from({ length: 25 }, (_, index) => {
        const level = 11 + Math.floor(index / 5);
        const problem = (index % 5) + 1;
        return `level-${level}-problem-${problem}`;
      })
    );
  });

  it('checks metadata and independently calculates all 200 expected outputs', () => {
    let totalCases = 0;
    for (const [id, problem] of Object.entries(conditions1115Challenges)) {
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      expect(cases, `${id} case count`).toHaveLength(8);
      expect(new Set(cases.map(({ input }) => input)).size, `${id} distinct inputs`).toBe(8);
      expect(problem.contentRevision, `${id} revision`).toBe(id === 'level-14-problem-4' ? 2 : 1);
      expect(problem.description, `${id} description`).toBeTruthy();
      expect(problem.inputFormat, `${id} input format`).toBeTruthy();
      expect(problem.outputFormat, `${id} output format`).toBeTruthy();
      expect(problem.constraints.length, `${id} constraints`).toBeGreaterThan(0);
      expect(problem.examples, `${id} examples`).toHaveLength(2);
      expect(problem.examples.every(example => example.explanation), `${id} explained examples`).toBe(true);
      expect(problem.hints, `${id} hints`).toHaveLength(5);
      expect(problem.starterCode.stdin, `${id} starter`).toContain('#');
      expect(problem.referenceSolution, `${id} reference`).toBeTruthy();
      for (const { input, output } of cases) {
        expect(independentlyCalculate[id](input), `${id}: ${JSON.stringify(input)}`).toBe(output);
        totalCases += 1;
      }
    }
    expect(totalCases).toBe(200);
  });
});
