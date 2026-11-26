import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { functions6165Challenges as problems } from '../../src/data/functions-61-65.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${61 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const numbers = line => line.trim() ? line.trim().split(/\s+/).map(Number) : [];
const words = line => line.trim() ? line.trim().split(/\s+/) : [];
const join = values => values.join(' ');
const sum = values => values.reduce((a, b) => a + b, 0);
const yes = value => value ? 'YES' : 'NO';
const matrix = (lines, start, rows) => lines.slice(start, start + rows).map(numbers);
const outputRows = rows => rows.map(join).join('\n');
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const range = n => Array.from({ length: n }, (_, i) => i);

// These independent JavaScript oracles check literals without executing the Python solutions.
const answers = {
  'level-61-problem-1': l => {
    const [year, month, day] = numbers(l[0]);
    const date = new Date(0), first = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    first.setUTCFullYear(year, 0, 1);
    return String((date - first) / 86400000 + 1);
  },
  'level-61-problem-2': l => {
    const vectors = { N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0] };
    const [start, end] = words(l[0]), [x, y] = vectors[start], [a, b] = vectors[end];
    const dot = x * a + y * b, cross = x * b - y * a;
    return dot === 1 ? 'STRAIGHT' : dot === -1 ? 'BACK' : cross < 0 ? 'RIGHT' : 'LEFT';
  },
  'level-61-problem-3': l => {
    let [a, b] = numbers(l[0]); const d = gcd(a, b);
    if (b < 0) { a = -a; b = -b; }
    return join([a / d || 0, b / d]);
  },
  'level-61-problem-4': l => `${l[1] || 'Hello'}, ${l[0]}!`,
  'level-61-problem-5': l => { const n = Number(l[0]); return join([(n + 1) ** 2, n ** 2 + 1]); },
  'level-62-problem-1': l => {
    const a = numbers(l[0]);
    return String(sum(a.flatMap((x, i) => a.slice(i + 1).map(y => Math.abs(x - y)))));
  },
  'level-62-problem-2': l => {
    const checks = { positive: x => x > 0, negative: x => x < 0, even: x => x % 2 === 0 };
    const flags = numbers(l[1]).map(checks[l[0]]);
    return String(flags.filter((value, i) => value && i > 0 && flags[i - 1]).length);
  },
  'level-62-problem-3': l => {
    const ops = { double: x => 2 * x, negate: x => -x, square: x => x * x };
    return join(numbers(l[1]).map(ops[l[0]]));
  },
  'level-62-problem-4': l => {
    const callbacks = { identity: x => x, abs: Math.abs, square: x => x ** 2, neg: x => -x };
    const a = numbers(l[1]).map(callbacks[l[0]]);
    let best = 0;
    for (let start = 0; start < a.length; start++) {
      for (let end = start; end < a.length; end++) {
        const run = a.slice(start, end + 1);
        if (run.every((x, i) => i === 0 || run[i - 1] < x)) best = Math.max(best, run.length);
      }
    }
    return String(best);
  },
  'level-62-problem-5': l => {
    const ops = { inc: x => x + 1, double: x => 2 * x, neg: x => -x };
    return String(words(l[1]).reduce((value, op) => ops[op](value), Number(l[0])) || 0);
  },
  'level-63-problem-1': l => {
    const k = Number(l[0]), values = numbers(l[1]);
    return join(values.filter((value, i) =>
      values.slice(0, i + 1).filter(x => x === value).length % k !== 0));
  },
  'level-63-problem-2': l => {
    const tokens = words(l[0]), valid = token => /^[+-]?[0-9]+$/.test(token);
    return join(tokens.filter(valid).map(Number)) + '\n' + join(tokens.filter(t => !valid(t)));
  },
  'level-63-problem-3': l => {
    const [a, b] = numbers(l[0]);
    return `${a}\n${b}\n${join([...numbers(l[1]), b])}`;
  },
  'level-63-problem-4': l => {
    const total = [...l[0]].reverse().reduce((s, digit, i) => s + Number(digit) * (i + 2), 0);
    const check = range(11).find(x => (total + x) % 11 === 0);
    return check === 10 ? 'X' : String(check);
  },
  'level-63-problem-5': l => {
    const a = numbers(l[0]), total = sum(a);
    return `${a.length} ${total} ${(total / a.length).toFixed(2)}`;
  },
  'level-64-problem-1': l => {
    const [r] = numbers(l[0]); return join(matrix(l, 1, r).map(sum));
  },
  'level-64-problem-2': l => {
    const [r] = numbers(l[0]); return String(matrix(l, 1, r).flat().filter(x => x !== 0).length);
  },
  'level-64-problem-3': l => {
    const [r, c] = numbers(l[0]), a = matrix(l, 1, r);
    return outputRows(range(c).map(j => a.map(row => row[j])));
  },
  'level-64-problem-4': l => {
    const [r] = numbers(l[0]);
    return String(matrix(l, 1, r).filter(row => Math.min(...row) < 0 && Math.max(...row) > 0).length);
  },
  'level-64-problem-5': l => {
    const n = Number(l[0]), a = matrix(l, 1, n);
    return String(sum(a.map((row, i) => row[i])));
  },
  'level-65-problem-1': l => {
    const n = Number(l[0]), a = matrix(l, 1, n);
    return yes(a.every((row, i) => row.slice(0, i).every(x => x === 0)));
  },
  'level-65-problem-2': l => {
    const n = Number(l[0]);
    return outputRows(range(n).map(i => range(n).map(j => Number(i === j))));
  },
  'level-65-problem-3': l => {
    const n = Number(l[0]), a = matrix(l, 1, n);
    return yes(a.every((row, i) => row.every((x, j) => x === a[j][i])));
  },
  'level-65-problem-4': l => {
    const n = Number(l[0]), a = matrix(l, 1, n);
    return outputRows(range(n).map(j => a.map(row => row[j]).reverse()));
  },
  'level-65-problem-5': l => {
    const [r, k, c] = numbers(l[0]), a = matrix(l, 1, r), b = matrix(l, r + 1, k);
    return outputRows(a.map(row => range(c).map(j => sum(row.map((v, t) => v * b[t][j])))));
  }
};

let pyodide;
beforeAll(async () => {
  pyodide = await loadPyodide({ indexURL: fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url)) });
});

async function runPython(records) {
  const script = [
    'import io, json, sys',
    '_original_in, _original_out = sys.stdin, sys.stdout',
    '_results = []',
    `for _source, _input in ${JSON.stringify(records)}:`,
    '    _capture = io.StringIO()',
    '    try:',
    '        sys.stdin, sys.stdout = io.StringIO(_input), _capture',
    '        exec(compile(_source, "<challenge>", "exec"), {"__name__": "__main__"})',
    '        _results.append({"output": _capture.getvalue(), "error": None})',
    '    except Exception as _error:',
    '        _results.append({"output": _capture.getvalue(), "error": repr(_error)})',
    '    finally:',
    '        sys.stdin, sys.stdout = _original_in, _original_out',
    'json.dumps(_results)'
  ].join('\n');
  return JSON.parse(await pyodide.runPythonAsync(script));
}

describe('functions and matrices, levels 61–65', () => {
  it('exports complete metadata and eight distinct cases per ID', () => {
    expect(Object.keys(problems)).toEqual(ids);
    for (const [id, p] of Object.entries(problems)) {
      const cases = [...p.publicTestCases, ...p.hiddenTestCases];
      expect(cases, id).toHaveLength(8);
      expect(new Set(cases.map(c => c.input)).size, id).toBe(8);
      expect(p.contentRevision, id).toBe(1);
      expect(p.examples, id).toHaveLength(2);
      expect(p.examples.every(e => e.explanation), id).toBe(true);
      expect(p.hints, id).toHaveLength(5);
      expect(new Set(p.hints).size, id).toBe(5);
      expect(p.constraints.length, id).toBeGreaterThan(0);
      expect(p.inputFormat, id).toBeTruthy();
      expect(p.outputFormat, id).toBeTruthy();
      expect(p.starterCode.stdin, id).not.toBe(p.referenceSolution);
    }
  });

  it('independently checks every expected output', () => {
    for (const [id, p] of Object.entries(problems)) {
      for (const c of [...p.publicTestCases, ...p.hiddenTestCases]) {
        expect(answers[id](c.input.split('\n')), `${id}: ${c.input}`).toBe(c.output);
      }
    }
  });

  it('executes all 200 reference cases in Pyodide', async () => {
    const cases = ids.flatMap(id => [...problems[id].publicTestCases, ...problems[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: problems[id].referenceSolution })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output.replace(/\n$/, ''), `${c.id}: ${c.input}`).toBe(c.output);
    }
  });

  it('cross-checks the five revised objectives on additional boundary combinations', async () => {
    const cases = [];
    const add = (id, input) => cases.push({ id, input, source: problems[id].referenceSolution });
    for (const year of [1, 4, 100, 400, 1900, 2000, 2100, 2400, 9999]) {
      for (const [month, day] of [[1, 1], [2, 28], [3, 1], [12, 31]]) {
        add('level-61-problem-1', `${year} ${month} ${day}\n`);
      }
    }
    for (const start of 'NESW') for (const end of 'NESW') {
      add('level-61-problem-2', `${start} ${end}\n`);
    }
    let frontier = [[]];
    const sequences = [[]];
    for (let length = 1; length <= 3; length++) {
      frontier = frontier.flatMap(values => [-1, 0, 1].map(value => [...values, value]));
      sequences.push(...frontier);
    }
    for (const values of sequences) {
      for (const op of ['identity', 'abs', 'square', 'neg']) {
        add('level-62-problem-4', `${op}\n${join(values)}\n`);
      }
      for (const k of [1, 2, 3]) {
        add('level-63-problem-1', `${k}\n${join(values)}\n`);
      }
    }
    for (let n = 0; n < 150; n++) {
      add('level-63-problem-4', `${String(n).padStart(9, '0')}\n`);
    }
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output.replace(/\n$/, ''), `${c.id}: ${c.input}`)
        .toBe(answers[c.id](c.input.split('\n')));
    }
  });

  it('compiles and runs every starter on every case', async () => {
    const cases = ids.flatMap(id => [...problems[id].publicTestCases, ...problems[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: problems[id].starterCode.stdin })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output, `${c.id}: ${c.input}`).toBe('');
    }
  });
});
