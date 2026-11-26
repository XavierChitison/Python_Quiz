import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { lists4650Challenges } from '../../src/data/lists-46-50.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${46 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const sum = a => a.reduce((s, x) => s + x, 0);
const product = a => a.reduce((s, x) => s * x, 1);
const windows = a => a.flatMap((_, i) => a.slice(i).map((__, j) => a.slice(i, i + j + 1)));
const permutations = a => a.length
  ? a.flatMap((x, i) => permutations(a.filter((_, j) => i !== j)).map(rest => [x, ...rest]))
  : [[]];
const compare = (a, b) => {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
};

const numbers = line => line.trim() ? line.trim().split(/\s+/).map(Number) : [];
const grouped = new Set(['level-47-problem-2', 'level-47-problem-3', 'level-47-problem-5']);
const paired = new Set(['level-47-problem-4', 'level-50-problem-2']);

function parseInput(id, input) {
  const lines = input.slice(0, -1).split('\n');
  if (id === 'level-47-problem-1' || id === 'level-47-problem-5') {
    return { rows: lines.slice(1, 1 + Number(lines[0])).map(numbers) };
  }
  if (id === 'level-50-problem-4') {
    return { grid: lines.slice(1, 1 + Number(lines[0])).map(numbers) };
  }
  if (id === 'level-50-problem-2') {
    return { intervals: lines.slice(1, 1 + Number(lines[0])).map(numbers) };
  }
  if (id === 'level-48-problem-1') {
    return {
      a: numbers(lines[0]),
      commands: lines.slice(2, 2 + Number(lines[1])).map(line => {
        const [name, ...args] = line.split(' ');
        return [name, ...args.map(Number)];
      })
    };
  }
  if (id === 'level-47-problem-4') return { a: numbers(lines[0]), b: numbers(lines[1]) };
  if (id === 'level-48-problem-4') return { a: numbers(lines[0]), edges: numbers(lines[1]) };
  if (['level-46-problem-3', 'level-46-problem-4', 'level-47-problem-2'].includes(id)) {
    return { a: numbers(lines[0]), k: Number(lines[1]) };
  }
  if (['level-49-problem-1', 'level-49-problem-5'].includes(id)) {
    return { a: numbers(lines[0]), target: Number(lines[1]) };
  }
  return { a: numbers(lines[0]) };
}

function formatOutput(id, result) {
  if (grouped.has(id)) return [result.length, ...result.map(row => [row.length, ...row].join(' '))].join('\n');
  if (paired.has(id)) return [result.length, ...result.map(row => row.join(' '))].join('\n');
  if (Array.isArray(result)) return result.join(' ');
  return result === null ? 'NONE' : String(result);
}

// These oracles deliberately use direct enumeration for the sliding-window,
// prefix/suffix, and permutation exercises rather than the reference algorithms.
const answers = {
  'level-46-problem-1': ({ a }) => a.map((_, i) => sum(a.slice(0, i + 1))),
  'level-46-problem-2': ({ a }) => a.slice(1).map((x, i) => x - a[i]),
  'level-46-problem-3': ({ a, k }) => a.slice(k - 1).map((_, i) => sum(a.slice(i, i + k))),
  'level-46-problem-4': ({ a, k }) => windows(a).filter(w => product(w) < k).length,
  'level-46-problem-5': ({ a }) => a.findIndex((_, i) => sum(a.slice(0, i)) === sum(a.slice(i + 1))),
  'level-47-problem-1': ({ rows }) => Array.from(
    { length: Math.max(0, ...rows.map(r => r.length)) },
    (_, c) => sum(rows.filter(r => c < r.length).map(r => r[c]))),
  'level-47-problem-2': ({ a, k }) => a.reduce((out, x, i) => {
    if (i % k === 0) out.push([]);
    out[out.length - 1].push(x);
    return out;
  }, []),
  'level-47-problem-3': ({ a }) => {
    const separators = [-1, ...a.flatMap((x, i) => x === 0 ? [i] : []), a.length];
    return separators.slice(1).map((end, i) => a.slice(separators[i] + 1, end));
  },
  'level-47-problem-4': ({ a, b }) => a.flatMap(x => b.map(y => [x, y])),
  'level-47-problem-5': ({ rows }) => {
    const cells = rows.flatMap((row, r) => row.map((x, c) => ({ r, diagonal: r + c, x })));
    const diagonals = [...new Set(cells.map(cell => cell.diagonal))].sort((a, b) => a - b);
    return diagonals.map(d => cells.filter(cell => cell.diagonal === d).sort((a, b) => a.r - b.r).map(cell => cell.x));
  },
  'level-48-problem-1': ({ a, commands }) => commands.reduce((list, cmd) => {
    if (cmd[0] === 'append') return [...list, cmd[1]];
    if (cmd[0] === 'insert') return [...list.slice(0, cmd[1]), cmd[2], ...list.slice(cmd[1])];
    return [...list.slice(0, cmd[1]), ...list.slice(cmd[1] + 1)];
  }, a),
  'level-48-problem-2': ({ a }) => {
    const zeros = a.flatMap((x, i) => x === 0 ? [i] : []);
    return a.map((_, i) => zeros.length ? Math.min(...zeros.map(j => Math.abs(i - j))) : -1);
  },
  'level-48-problem-3': ({ a }) => a.map((_, i) => a[(i + a.length - 1) % a.length] + a[(i + 1) % a.length]),
  'level-48-problem-4': ({ a, edges }) => edges.slice(1).map((hi, i) =>
    a.filter(x => edges[i] <= x && x < hi).length),
  'level-48-problem-5': ({ a }) => a.map((_, i) => product(a.filter((__, j) => i !== j))),
  'level-49-problem-1': ({ a, target }) => a.filter(x => x !== target),
  'level-49-problem-2': ({ a }) => Array.from({ length: a.length + 1 }, (_, i) => i).find(x => !a.includes(x)),
  'level-49-problem-3': ({ a }) => a.find(x => a.filter(y => x === y).length > a.length / 2) ?? null,
  'level-49-problem-4': ({ a }) => Math.max(...windows(a).map(sum)),
  'level-49-problem-5': ({ a, target }) => {
    const lengths = windows(a).filter(w => sum(w) >= target).map(w => w.length);
    return lengths.length ? Math.min(...lengths) : 0;
  },
  'level-50-problem-1': ({ a }) => {
    const ordered = permutations(a).sort(compare);
    return ordered.find(p => compare(p, a) > 0) ?? ordered[0];
  },
  'level-50-problem-2': ({ intervals }) => {
    // Connected components of the interval overlap graph.
    const groups = intervals.map(pair => [pair]);
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length;) {
        if (groups[i].some(([a, b]) => groups[j].some(([c, d]) => a <= d && c <= b))) {
          groups[i].push(...groups.splice(j, 1)[0]);
          i = -1;
          break;
        }
        j++;
      }
    }
    return groups.map(g => [Math.min(...g.map(p => p[0])), Math.max(...g.map(p => p[1]))])
      .sort((a, b) => a[0] - b[0]);
  },
  'level-50-problem-3': ({ a }) => sum(a.map((x, i) =>
    Math.min(Math.max(...a.slice(0, i + 1)), Math.max(...a.slice(i))) - x)),
  'level-50-problem-4': ({ grid }) => {
    const cells = grid.flatMap((row, r) => row.map((value, c) => ({ r, c, value })));
    const result = [];
    let r = 0, c = 0, direction = 0;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    while (cells.length) {
      const index = cells.findIndex(cell => cell.r === r && cell.c === c);
      if (index < 0) throw new Error('Spiral oracle reached an invalid cell');
      result.push(cells.splice(index, 1)[0].value);
      if (!cells.length) break;
      let [dr, dc] = directions[direction];
      if (!cells.some(cell => cell.r === r + dr && cell.c === c + dc)) {
        direction = (direction + 1) % 4;
        [dr, dc] = directions[direction];
      }
      r += dr; c += dc;
    }
    return result;
  },
  'level-50-problem-5': ({ a }) => {
    const n = a.length, ones = sum(a);
    if (!ones) return 0;
    return Math.min(...a.map((_, start) =>
      Array.from({ length: ones }, (__, i) => a[(start + i) % n]).filter(x => x === 0).length));
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

describe('list challenges, levels 46–50', () => {
  it('exports complete metadata and eight distinct manual cases per ID', () => {
    expect(Object.keys(lists4650Challenges)).toEqual(ids);
    for (const [id, problem] of Object.entries(lists4650Challenges)) {
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      expect(cases, id).toHaveLength(8);
      expect(new Set(cases.map(c => c.input)).size, id).toBe(8);
      expect(problem.contentRevision, id).toBe(1);
      expect(problem.examples, id).toHaveLength(2);
      expect(problem.examples.every(e => e.explanation), id).toBe(true);
      expect(problem.hints, id).toHaveLength(5);
      expect(new Set(problem.hints).size, id).toBe(5);
      expect(problem.constraints.length, id).toBeGreaterThan(0);
      expect(problem.inputFormat, id).toBeTruthy();
      expect(problem.outputFormat, id).toBeTruthy();
      expect(problem.starterCode.stdin, id).not.toBe(problem.referenceSolution);
      expect(problem.starterCode.stdin, id).not.toMatch(/\bjson\b|def solve/);
      expect(problem.referenceSolution, id).not.toMatch(/\bjson\b|def solve/);
    }
  });

  it('independently checks every expected output', () => {
    for (const [id, problem] of Object.entries(lists4650Challenges)) {
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(formatOutput(id, answers[id](parseInput(id, testCase.input))),
          `${id}: ${testCase.input}`).toBe(testCase.output);
      }
    }
  });

  it('executes all 200 reference cases in Pyodide', async () => {
    const cases = ids.flatMap(id => {
      const p = lists4650Challenges[id];
      return [...p.publicTestCases, ...p.hiddenTestCases].map(c => ({ id, ...c, source: p.referenceSolution }));
    });
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${testCase.input}`;
      expect(results[i].error, label).toBeNull();
      expect(results[i].output.replace(/\n$/, ''), label).toBe(testCase.output);
    }
  });

  it('compiles and runs every starter on every case without errors or output', async () => {
    const cases = ids.flatMap(id => {
      const p = lists4650Challenges[id];
      return [...p.publicTestCases, ...p.hiddenTestCases].map(c => ({ id, ...c, source: p.starterCode.stdin }));
    });
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${testCase.input}`;
      expect(results[i].error, label).toBeNull();
      expect(results[i].output, label).toBe('');
    }
  });
});
