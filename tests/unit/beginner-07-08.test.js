import { beforeAll, describe, expect, it } from 'vitest';
import { loadPyodide } from 'pyodide';
import { fileURLToPath } from 'node:url';
import { beginner0708Challenges } from '../../src/data/beginner-07-08.js';

const expectedIds = [
  'level-07-problem-1',
  'level-07-problem-2',
  'level-07-problem-3',
  'level-07-problem-4',
  'level-07-problem-5',
  'level-08-problem-1',
  'level-08-problem-2',
  'level-08-problem-3',
  'level-08-problem-4',
  'level-08-problem-5'
];

const linesOf = input => input.endsWith('\n')
  ? input.slice(0, -1).split('\n')
  : input.split('\n');

const independentCalculations = {
  'level-07-problem-1': input => {
    const [a, x, b, c] = input.trim().split(/\s+/).map(Number);
    return String(a * x * x + b * x + c);
  },
  'level-07-problem-2': input => {
    const [a, b] = input.trim().split(/\s+/).map(Number);
    return String(Math.abs(a - b));
  },
  'level-07-problem-3': input => {
    const [a, b] = input.trim().split(/\s+/).map(Number);
    return ((a + b) / 2).toFixed(1);
  },
  'level-07-problem-4': input => {
    const [a, b] = input.trim().split(/\s+/).map(Number);
    return Math.hypot(a, b).toFixed(2);
  },
  'level-07-problem-5': input => {
    const [first, difference, position] = input.trim().split(/\s+/).map(Number);
    return String(first + (position - 1) * difference);
  },
  'level-08-problem-1': input => String(linesOf(input)[0].length),
  'level-08-problem-2': input => linesOf(input)[0][0],
  'level-08-problem-3': input => linesOf(input)[0].slice(1, -1),
  'level-08-problem-4': input => {
    const [first, second] = linesOf(input);
    return `${first} ${second}`;
  },
  'level-08-problem-5': input => {
    const [text, count] = linesOf(input);
    return text.repeat(Number(count));
  }
};

let pyodide;

beforeAll(async () => {
  const indexURL = fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url));
  pyodide = await loadPyodide({ indexURL });
});

describe('beginner levels 7 and 8', () => {
  it('contains only the ten requested challenges in objective order', () => {
    expect(Object.keys(beginner0708Challenges)).toEqual(expectedIds);
    expect(Object.values(beginner0708Challenges).map(problem => problem.title)).toEqual([
      'Evaluate a Quadratic Expression',
      'Distance on a Number Line',
      'Midpoint of Two Numbers',
      'Hypotenuse of a Right Triangle',
      'Arithmetic Progression Term',
      'String Length',
      'First Character',
      'Interior of a String',
      'Join Two Lines with a Space',
      'Repeat a String N Times'
    ]);
  });

  it('uses the helper metadata, eight cases, two explained examples, and five hints', () => {
    for (const [id, problem] of Object.entries(beginner0708Challenges)) {
      expect(problem.contentRevision, id).toBe(1);
      expect(problem.starterCode, id).toHaveProperty('stdin');
      expect(problem.examples, id).toHaveLength(2);
      expect(problem.examples.every(example => Boolean(example.explanation)), id).toBe(true);
      expect(problem.publicTestCases, id).toHaveLength(3);
      expect(problem.hiddenTestCases, id).toHaveLength(5);
      expect(problem.hints, id).toHaveLength(5);
      expect(problem.starterCode.stdin, id).not.toBe(problem.referenceSolution);
    }
  });

  it('checks all 80 expected outputs with independent JavaScript calculations', () => {
    for (const [id, problem] of Object.entries(beginner0708Challenges)) {
      const calculate = independentCalculations[id];
      expect(typeof calculate, id).toBe('function');
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(calculate(testCase.input), `${id} input ${JSON.stringify(testCase.input)}`)
          .toBe(testCase.output);
      }
    }
  });

  it('compiles and runs every reference solution against all 80 cases in Pyodide', async () => {
    const records = expectedIds.flatMap(id => {
      const problem = beginner0708Challenges[id];
      return [...problem.publicTestCases, ...problem.hiddenTestCases].map(testCase => [
        problem.referenceSolution,
        testCase.input
      ]);
    });
    const python = [
      'import io, json, sys',
      '_real_stdout = sys.stdout',
      '_results = []',
      `for _source, _input in ${JSON.stringify(records)}:`,
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
      const problem = beginner0708Challenges[id];
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(outputs[outputIndex].replace(/\n$/, ''), `${id} reference output`)
          .toBe(testCase.output);
        outputIndex += 1;
      }
    }
  });
});
