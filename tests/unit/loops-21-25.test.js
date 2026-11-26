import { beforeAll, describe, expect, it } from 'vitest';
import { loadPyodide } from 'pyodide';
import { fileURLToPath } from 'node:url';
import { loops2125Challenges } from '../../src/data/loops-21-25.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${21 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const nums = input => input.trim().split(/\s+/).map(Number);
const sequence = (length, fn) => Array.from({ length }, (_, i) => fn(i));
const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
const prime = n => n > 1 && sequence(Math.max(0, n - 2), i => i + 2).every(d => n % d !== 0);

// Independent oracles use formulas, strings, or different traversal strategies.
const calculate = [
  input => sequence(nums(input)[0], i => i + 1).join(' '),
  input => { const lines = input.split('\n'); const n = Number(lines[0]); return String(lines.slice(1, n + 1).filter(line => line.length > 0).length); },
  input => { const [n] = nums(input); return String(n * (n + 1) / 2); },
  input => String(sequence(nums(input)[0], i => i + 1).reduce((a, b) => a * b, 1)),
  input => { const [a, n] = nums(input); return sequence(n, i => a * (i + 1)).join(' '); },
  input => { const [a, b] = nums(input); return String(sequence(b - a + 1, i => a + i).filter(x => x % 2 === 0).reduce((x, y) => x + y, 0)); },
  input => { const [a, b, d] = nums(input); return String(Math.floor(b / d) - Math.floor((a - 1) / d)); },
  input => { const [n] = nums(input); return String(n * (n + 1) * (2 * n + 1) / 6); },
  input => sequence(nums(input)[0], i => (i % 2 ? -1 : 1) / (i + 1)).reduce((a, b) => a + b, 0).toFixed(6),
  input => { const [a, r, n] = nums(input); return String(sequence(n, i => a * r ** i).reduce((x, y) => x * y, 1)); },
  input => String(nums(input)[0]).length.toString(),
  input => { const digits = [...String(nums(input)[0])]; return String(digits.reduce((sum, digit, i) => sum + Number(digit) * ((digits.length - 1 - i) % 2 ? -1 : 1), 0)); },
  input => { const digits = String(nums(input)[0]); return String([...digits.slice(1)].filter((digit, i) => digit === digits[i]).length); },
  input => String(Math.max(...[...String(nums(input)[0])].map(Number))),
  input => { const [n, d] = nums(input); return String([...String(n)].filter(c => c === String(d)).length); },
  input => { const values = nums(input); return String(values.slice(0, values.indexOf(0)).reduce((a, b) => a + b, 0)); },
  input => { const [bound] = nums(input); return String(bound === 0 ? 0 : Math.floor(Math.log2(bound)) + 1); },
  input => { const [n, limit] = nums(input); const sum = height => height <= limit ? height : height + sum(Math.floor(height / 2)); return String(sum(n)); },
  input => { const [n, target, ...values] = nums(input); const index = values.slice(0, n).findIndex((_, i) => values.slice(0, i + 1).reduce((a, b) => a + b, 0) >= target); return String(index < 0 ? -1 : index + 1); },
  input => { let [n] = nums(input); let count = 0; for (; n !== 1; count++) n = n % 2 ? 3 * n + 1 : n / 2; return String(count); },
  input => { const [n] = nums(input); const result = [0, 1]; for (let i = 2; i < n; i++) result.push(result[i - 1] + result[i - 2]); return result.slice(0, n).join(' '); },
  input => { const [a, b] = nums(input); return String(gcd(Math.abs(a), Math.abs(b))); },
  input => { const [n] = nums(input); return sequence(n, i => i + 1).filter(d => n % d === 0).join(' '); },
  input => prime(nums(input)[0]) ? 'YES' : 'NO',
  input => { let [n] = nums(input); const factors = []; for (let d = 2; d <= n; d++) if (prime(d)) while (n % d === 0) { factors.push(d); n /= d; } return factors.join(' '); }
];

let pyodide;

beforeAll(async () => {
  pyodide = await loadPyodide({ indexURL: fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url)) });
});

describe('loop challenges, levels 21–25', () => {
  it('exports all 25 ordered challenges with complete metadata and eight distinct cases', () => {
    expect(Object.keys(loops2125Challenges)).toEqual(ids);
    for (const [id, problem] of Object.entries(loops2125Challenges)) {
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      expect(cases, id).toHaveLength(8);
      expect(new Set(cases.map(testCase => testCase.input)).size, id).toBe(8);
      expect(problem.contentRevision, id).toBe(1);
      expect(problem.examples, id).toHaveLength(2);
      expect(problem.examples.every(example => example.explanation), id).toBe(true);
      expect(problem.examples.map(({ input, output }) => ({ input, output })), id).toEqual(cases.slice(0, 2));
      expect(problem.hints, id).toHaveLength(5);
      expect(problem.constraints.length, id).toBeGreaterThan(0);
      expect(problem.inputFormat, id).toBeTruthy();
      expect(problem.outputFormat, id).toBeTruthy();
      expect(problem.starterCode.stdin, id).not.toBe(problem.referenceSolution);
    }
  });

  it('independently checks every manually specified expected output', () => {
    ids.forEach((id, i) => {
      const problem = loops2125Challenges[id];
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(calculate[i](testCase.input), `${id}: ${JSON.stringify(testCase.input)}`).toBe(testCase.output);
      }
    });
  });

  it('executes all 200 references and all starters in isolated Pyodide namespaces', async () => {
    const records = ids.flatMap(id => {
      const problem = loops2125Challenges[id];
      return [...problem.publicTestCases, ...problem.hiddenTestCases].flatMap(testCase => [
        [id, 'reference', problem.referenceSolution, testCase.input, testCase.output],
        [id, 'starter', problem.starterCode.stdin, testCase.input, null]
      ]);
    });
    const python = [
      'import io, json, sys, traceback',
      '_stdin, _stdout = sys.stdin, sys.stdout',
      '_results = []',
      `for _id, _kind, _source, _input, _expected in json.loads(${JSON.stringify(JSON.stringify(records))}):`,
      '    try:',
      '        sys.stdin = io.StringIO(_input)',
      '        sys.stdout = io.StringIO()',
      '        exec(compile(_source, "<challenge>", "exec"), {"__name__": "__main__"})',
      '        _results.append({"output": sys.stdout.getvalue()})',
      '    except Exception:',
      '        _results.append({"error": traceback.format_exc()})',
      '    finally:',
      '        sys.stdin, sys.stdout = _stdin, _stdout',
      'json.dumps(_results)'
    ].join('\n');
    const results = JSON.parse(await pyodide.runPythonAsync(python));
    expect(results).toHaveLength(400);
    records.forEach(([id, kind, , input, expected], index) => {
      const context = `${id} ${kind}: ${JSON.stringify(input)}`;
      expect(results[index].error, context).toBeUndefined();
      if (kind === 'reference') {
        expect(results[index].output.replace(/\n$/, ''), context).toBe(expected);
      }
    });
  });
});
