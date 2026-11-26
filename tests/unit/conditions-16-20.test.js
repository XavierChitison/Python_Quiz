import { beforeAll, describe, expect, it } from 'vitest';
import { loadPyodide } from 'pyodide';
import { fileURLToPath } from 'node:url';
import { conditions1620Challenges } from '../../src/data/conditions-16-20.js';

const expectedIds = [
  'level-16-problem-1', 'level-16-problem-2', 'level-16-problem-3', 'level-16-problem-4', 'level-16-problem-5',
  'level-17-problem-1', 'level-17-problem-2', 'level-17-problem-3', 'level-17-problem-4', 'level-17-problem-5',
  'level-18-problem-1', 'level-18-problem-2', 'level-18-problem-3', 'level-18-problem-4', 'level-18-problem-5',
  'level-19-problem-1', 'level-19-problem-2', 'level-19-problem-3', 'level-19-problem-4', 'level-19-problem-5',
  'level-20-problem-1', 'level-20-problem-2', 'level-20-problem-3', 'level-20-problem-4', 'level-20-problem-5'
];

const numbers = input => input.trim().split(/\s+/).map(Number);
const isLeapYear = year => year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
const monthLength = (year, month) => month === 2
  ? (isLeapYear(year) ? 29 : 28)
  : ([4, 6, 9, 11].includes(month) ? 30 : 31);

const independentCalculations = {
  'level-16-problem-1': input => {
    const [x, y] = numbers(input);
    if (x === 0 && y === 0) return 'Origin';
    if (x === 0) return 'Y-axis';
    if (y === 0) return 'X-axis';
    return `Quadrant ${x > 0 ? (y > 0 ? 'I' : 'IV') : (y > 0 ? 'II' : 'III')}`;
  },
  'level-16-problem-2': input => {
    const [xmin, ymin, xmax, ymax, x, y] = numbers(input);
    return x >= xmin && x <= xmax && y >= ymin && y <= ymax ? 'YES' : 'NO';
  },
  'level-16-problem-3': input => {
    const [row, column] = numbers(input);
    return (row + column) % 2 === 0 ? 'Dark' : 'Light';
  },
  'level-16-problem-4': input => {
    const [r1, c1, r2, c2] = numbers(input);
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return Math.max(dr, dc) === 1 ? 'YES' : 'NO';
  },
  'level-16-problem-5': input => {
    const [xmin1, ymin1, xmax1, ymax1, xmin2, ymin2, xmax2, ymax2] = numbers(input);
    return xmax1 >= xmin2 && xmax2 >= xmin1 && ymax1 >= ymin2 && ymax2 >= ymin1 ? 'YES' : 'NO';
  },
  'level-17-problem-1': input => {
    const [year, month] = numbers(input);
    return String(monthLength(year, month));
  },
  'level-17-problem-2': input => {
    const [year, month, day] = numbers(input);
    return month >= 1 && month <= 12 && day >= 1 && day <= monthLength(year, month) ? 'YES' : 'NO';
  },
  'level-17-problem-3': input => {
    let [year, month, day] = numbers(input);
    if (day < monthLength(year, month)) {
      day += 1;
    } else {
      day = 1;
      if (month === 12) {
        month = 1;
        year += 1;
      } else {
        month += 1;
      }
    }
    return `${year} ${month} ${day}`;
  },
  'level-17-problem-4': input => {
    const [y1, m1, d1, y2, m2, d2] = numbers(input);
    for (const [first, second] of [[y1, y2], [m1, m2], [d1, d2]]) {
      if (first < second) return '1';
      if (first > second) return '2';
    }
    return '0';
  },
  'level-17-problem-5': input => {
    const [start1, end1, start2, end2] = numbers(input);
    return Math.max(start1, start2) < Math.min(end1, end2) ? 'YES' : 'NO';
  },
  'level-18-problem-1': input => numbers(input).reduce((sum, vote) => sum + vote, 0) >= 2 ? 'YES' : 'NO',
  'level-18-problem-2': input => {
    const [age, score, waiver] = numbers(input);
    return (age >= 18 && score >= 70) || waiver === 1 ? 'YES' : 'NO';
  },
  'level-18-problem-3': input => {
    const [a, b, c] = numbers(input);
    const total = a + b + c;
    return [a, b, c].some(value => 2 * value === total) ? 'YES' : 'NO';
  },
  'level-18-problem-4': input => {
    const [p, q, r] = numbers(input);
    return (p === 0 || q === 1) && (q === 0 || r === 1) ? 'TRUE' : 'FALSE';
  },
  'level-18-problem-5': input => {
    const [operatorReady, doorClosed, emergency] = numbers(input);
    if (emergency === 1) return 'STOP';
    return operatorReady === 1 && doorClosed === 1 ? 'READY' : 'WAIT';
  },
  'level-19-problem-1': input => {
    const [weight, longestSide] = numbers(input);
    const basePrice = weight <= 100 ? 1 : weight <= 500 ? 3 : weight <= 1000 ? 5 : 8;
    return String(basePrice + (longestSide > 60 ? 4 : 0));
  },
  'level-19-problem-2': input => {
    const [first, second] = input.trim().split(/\s+/);
    if (first === second) return 'Draw';
    const beats = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
    return beats[first] === second ? 'Win' : 'Lose';
  },
  'level-19-problem-3': input => {
    const [a, b, c] = numbers(input);
    const discriminant = b * b - 4 * a * c;
    return discriminant < 0 ? '0' : discriminant === 0 ? '1' : '2';
  },
  'level-19-problem-4': input => {
    const [balance, amount] = numbers(input);
    return amount > balance ? 'DENIED' : String(balance - amount);
  },
  'level-19-problem-5': input => {
    const [target, first, second] = numbers(input);
    const firstDistance = Math.abs(target - first);
    const secondDistance = Math.abs(target - second);
    return String(firstDistance < secondDistance || (firstDistance === secondDistance && first < second) ? first : second);
  },
  'level-20-problem-1': input => {
    const [itemWidth, itemHeight, containerWidth, containerHeight] = numbers(input);
    const unrotated = itemWidth <= containerWidth && itemHeight <= containerHeight;
    const rotated = itemHeight <= containerWidth && itemWidth <= containerHeight;
    return unrotated || rotated ? 'YES' : 'NO';
  },
  'level-20-problem-2': input => {
    const [x, y, cx, cy, radius] = numbers(input);
    return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2 ? 'YES' : 'NO';
  },
  'level-20-problem-3': input => {
    const [hourText, marker] = input.trim().split(/\s+/);
    const hour = Number(hourText);
    if (marker === 'AM') return String(hour === 12 ? 0 : hour);
    return String(hour === 12 ? 12 : hour + 12);
  },
  'level-20-problem-4': input => {
    const [dividend, divisor] = numbers(input);
    if (divisor === 0) return 'ZERO DIVISOR';
    return dividend % divisor === 0 ? 'EXACT' : 'INEXACT';
  },
  'level-20-problem-5': input => {
    const [attendance, capacity, needsProjector, hasProjector] = numbers(input);
    return attendance <= capacity && (needsProjector === 0 || hasProjector === 1) ? 'YES' : 'NO';
  }
};

const incorrectImplementations = [
  {
    source: "xmin, ymin, xmax, ymax, x, y = map(int, input().split())\nprint('YES' if xmin < x < xmax and ymin < y < ymax else 'NO')\n",
    input: '0 0 10 8 0 5\n',
    expected: 'YES'
  },
  {
    source: "year, month = map(int, input().split())\nprint(29 if month == 2 and year % 4 == 0 else (28 if month == 2 else 30 if month in (4, 6, 9, 11) else 31))\n",
    input: '1900 2\n',
    expected: '28'
  },
  {
    source: "a, b, c = map(int, input().split())\nprint('YES' if c == a + b else 'NO')\n",
    input: '7 3 4\n',
    expected: 'YES'
  },
  {
    source: "p, q, r = map(int, input().split())\nprint('TRUE' if p and q and r else 'FALSE')\n",
    input: '0 0 0\n',
    expected: 'TRUE'
  },
  {
    source: "start1, end1, start2, end2 = map(int, input().split())\nprint('YES' if start1 <= end2 and start2 <= end1 else 'NO')\n",
    input: '60 120 120 180\n',
    expected: 'NO'
  },
  {
    source: "target, first, second = map(int, input().split())\nprint(first if abs(target - first) <= abs(target - second) else second)\n",
    input: '10 12 8\n',
    expected: '8'
  },
  {
    source: "item_width, item_height, container_width, container_height = map(int, input().split())\nprint('YES' if item_width <= container_width and item_height <= container_height else 'NO')\n",
    input: '5 3 4 7\n',
    expected: 'YES'
  },
  {
    source: "operator_ready, door_closed, emergency = map(int, input().split())\nif operator_ready == 1 and door_closed == 1:\n    print('READY')\nelif emergency == 1:\n    print('STOP')\nelse:\n    print('WAIT')\n",
    input: '1 1 1\n',
    expected: 'STOP'
  },
  {
    source: "weight, longest_side = map(int, input().split())\nif weight <= 100:\n    print(1)\nelif weight <= 500:\n    print(3)\nelif weight <= 1000:\n    print(5)\nelse:\n    print(8)\n",
    input: '100 61\n',
    expected: '5'
  }
];

let pyodide;

beforeAll(async () => {
  const indexURL = fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url));
  pyodide = await loadPyodide({ indexURL });
});

describe('beginner conditional and Boolean challenges, levels 16–20', () => {
  it('exports the 25 manifest objectives in level and problem order', () => {
    expect(Object.keys(conditions1620Challenges)).toEqual(expectedIds);
    expect(Object.values(conditions1620Challenges).map(problem => problem.title)).toEqual([
      'Point Quadrant', 'Point Inside Rectangle', 'Chessboard Square Color', 'King Move Legality', 'Rectangle Intersection',
      'Days in a Month', 'Valid Calendar Date', 'Next Calendar Date', 'Earlier of Two Dates', 'Overlapping Time Intervals',
      'Majority of Three Votes', 'Eligibility with an Exception', 'One Value Is the Sum of the Other Two', 'Implication Chain', 'Safety Interlock State',
      'Postage With Size Surcharge', 'Rock Paper Scissors Outcome', 'Quadratic Root Count', 'Withdrawal With Overdraft Protection', 'Closest of Two Candidates',
      'Rotatable Rectangle Fit', 'Point in a Circle', 'Convert 12-Hour Clock to 24-Hour', 'Classify Integer Division', 'Meeting Room Fit'
    ]);
  });

  it('provides eight specified cases, two explained examples, clear metadata, and five hints per challenge', () => {
    for (const [id, problem] of Object.entries(conditions1620Challenges)) {
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      expect(cases, id).toHaveLength(8);
      expect(new Set(cases.map(testCase => testCase.input)).size, `${id} distinct inputs`).toBe(8);
      expect(problem.contentRevision, id).toBe(1);
      expect(problem.examples, id).toHaveLength(2);
      expect(problem.examples.every(example => Boolean(example.explanation)), id).toBe(true);
      expect(problem.hints, id).toHaveLength(5);
      expect(problem.constraints.length, id).toBeGreaterThan(0);
      expect(problem.inputFormat, id).toBeTruthy();
      expect(problem.outputFormat, id).toBeTruthy();
      expect(problem.starterCode.stdin, id).toContain('#');
      expect(problem.referenceSolution, id).toBeTruthy();
      expect(problem.starterCode.stdin, id).not.toBe(problem.referenceSolution);
    }
  });

  it('checks all 200 expected outputs with independent JavaScript implementations', () => {
    for (const [id, problem] of Object.entries(conditions1620Challenges)) {
      expect(typeof independentCalculations[id], id).toBe('function');
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(independentCalculations[id](testCase.input), `${id} input ${JSON.stringify(testCase.input)}`)
          .toBe(testCase.output);
      }
    }
  });

  it('executes all 200 reference solutions in Pyodide and distinguishes common incorrect approaches', async () => {
    const records = expectedIds.flatMap(id => {
      const problem = conditions1620Challenges[id];
      return [...problem.publicTestCases, ...problem.hiddenTestCases].map(testCase => [
        problem.referenceSolution,
        testCase.input
      ]);
    });
    const wrongRecords = incorrectImplementations.map(({ source, input }) => [source, input]);
    const python = [
      'import io, json, sys',
      '_real_stdout = sys.stdout',
      '_results = []',
      `for _source, _input in ${JSON.stringify([...records, ...wrongRecords])}:`,
      '    sys.stdin = io.StringIO(_input)',
      '    _capture = io.StringIO()',
      '    sys.stdout = _capture',
      '    exec(compile(_source, "<reference>", "exec"))',
      '    sys.stdout = _real_stdout',
      '    _results.append(_capture.getvalue())',
      'json.dumps(_results)'
    ].join('\n');
    const outputs = JSON.parse(await pyodide.runPythonAsync(python));
    let outputIndex = 0;

    for (const id of expectedIds) {
      const problem = conditions1620Challenges[id];
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(outputs[outputIndex].replace(/\n$/, ''), `${id} reference output for ${JSON.stringify(testCase.input)}`)
          .toBe(testCase.output);
        outputIndex += 1;
      }
    }
    for (const [index, incorrect] of incorrectImplementations.entries()) {
      expect(outputs[outputIndex + index].replace(/\n$/, ''), `incorrect implementation ${index + 1}`)
        .not.toBe(incorrect.expected);
    }
  });
});
