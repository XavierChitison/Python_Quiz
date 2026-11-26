import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { matrices6670Challenges as problems } from '../../src/data/matrices-66-70.js';

const ids = Array.from({ length: 25 }, (_, i) => `level-${66 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const nums = s => s.trim() ? s.trim().split(/\s+/).map(Number) : [];
const sum = a => a.reduce((x, y) => x + y, 0);
const rows = a => a.map(row => row.join(' ')).join('\n');
const coords = a => [a.length, ...a.map(x => x.join(' '))].join('\n');
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (a, b = 1) => {
  if (b < 0) { a = -a; b = -b; }
  const d = gcd(a, b);
  return [a / d, b / d];
};
const add = ([a, b], [c, d]) => frac(a * d + c * b, b * d);
const mul = ([a, b], [c, d]) => frac(a * c, b * d);
const div = ([a, b], [c, d]) => frac(a * d, b * c);
const neg = ([a, b]) => [-a, b];
const show = ([a, b]) => b === 1 ? String(a) : `${a}/${b}`;

function exactTrapezoid(a, b, c, left, right, n) {
  const width = right - left;
  const f = x => a * x * x + b * x + c;
  // Endpoint trapezoid minus the exact correction for the interior divisions.
  const [numerator, denominator] = frac(
    3 * n * n * width * (f(left) + f(right)) - a * width ** 3 * (n * n - 1),
    6 * n * n
  );
  const scaled = Math.abs(numerator) * 1000000;
  let rounded = Math.floor(scaled / denominator);
  const remainder = scaled % denominator;
  if (remainder * 2 > denominator || (remainder * 2 === denominator && rounded % 2)) rounded++;
  const sign = numerator < 0 && rounded ? '-' : '';
  return `${sign}${Math.floor(rounded / 1000000)}.${String(rounded % 1000000).padStart(6, '0')}`;
}

function parseMatrix(lines) {
  const [r, c] = nums(lines[0]);
  return { r, c, grid: lines.slice(1, r + 1).map(nums), tail: lines.slice(r + 1) };
}
const allCells = (r, c) => Array.from({ length: r * c }, (_, k) => [Math.floor(k / c), k % c]);
const neighbors = (r, c, i, j, diagonal = false) => allCells(r, c).filter(([x, y]) =>
  (diagonal ? Math.max(Math.abs(x - i), Math.abs(y - j)) === 1 : Math.abs(x - i) + Math.abs(y - j) === 1));
const permutations = a => a.length ? a.flatMap((x, i) => permutations(a.filter((_, j) => i !== j)).map(p => [x, ...p])) : [[]];

// These calculations deliberately use direct enumeration, independent of the
// prefix, Horner, elimination-product, and neighbor-offset reference solutions.
function expected(id, input) {
  const lines = input.slice(0, -1).split('\n');
  const p = Number(id.slice(-1));
  const level = Number(id.slice(6, 8));
  if (level === 67 && p === 1) {
    const [r, c, i, j] = nums(lines[0]);
    return coords(neighbors(r, c, i, j));
  }
  if (level === 67 && (p === 4 || p === 5)) {
    const n = Number(lines[0]), grid = lines.slice(1).map(nums);
    const flat = grid.flat(), cols = Array.from({ length: n }, (_, j) => grid.map(row => row[j]));
    if (p === 4) {
      const required = Array.from({ length: n }, (_, i) => i + 1).join(',');
      return [...grid, ...cols].every(row => [...row].sort((a, b) => a - b).join(',') === required) ? 'YES' : 'NO';
    }
    const required = Array.from({ length: n * n }, (_, i) => i + 1).join(',');
    const diagonals = [grid.map((row, i) => row[i]), grid.map((row, i) => row[n - 1 - i])];
    return [...flat].sort((a, b) => a - b).join(',') === required &&
      [...grid, ...cols, ...diagonals].every(row => sum(row) === sum(grid[0])) ? 'YES' : 'NO';
  }
  if (level === 69) {
    if (p === 1) {
      const a = nums(lines[0]), x = Number(lines[1]), degree = a.length - 1;
      const value = sum(a.map((v, i) => v * x ** (degree - i)));
      const derivative = sum(a.slice(0, -1).map((v, i) => v * (degree - i) * x ** (degree - i - 1)));
      return `${value} ${derivative}`;
    }
    if (p === 2) {
      const a = nums(lines[0]), norm = Math.hypot(...a);
      return a.map(x => (x / norm).toFixed(6)).join(' ');
    }
    if (p === 3) {
      const [a, b, x, y] = nums(lines[0]), [n, d] = frac(y - b, a);
      return `${a * x + b} ${n} ${d}`;
    }
    if (p === 4) {
      const a = nums(lines[0]);
      return `${a.map(x => x * x + 1).join(' ')}\n${new Set(a).size}`;
    }
    return exactTrapezoid(...nums(lines[0]));
  }
  if (level === 70 && p === 1) {
    const [r, c, h, w] = nums(lines[0]), grid = lines.slice(1, r + 1).map(nums), kernel = lines.slice(r + 1).map(nums);
    return rows(Array.from({ length: r - h + 1 }, (_, i) => Array.from({ length: c - w + 1 }, (_, j) =>
      sum(kernel.flatMap((row, x) => row.map((v, y) => v * grid[i + x][j + y]))))));
  }
  if (level === 70 && p === 2) {
    const m = lines.map(line => nums(line).map(x => frac(x))), pivots = [];
    for (let col = 0; col < 2; col++) {
      const k = pivots.length, found = m.findIndex((row, i) => i >= k && row[col][0]);
      if (found < 0) continue;
      [m[k], m[found]] = [m[found], m[k]];
      const pivot = m[k][col];
      m[k] = m[k].map(x => div(x, pivot));
      for (let i = 0; i < 2; i++) {
        if (i === k) continue;
        const factor = neg(m[i][col]);
        m[i] = m[i].map((x, j) => add(x, mul(factor, m[k][j])));
      }
      pivots.push(col);
    }
    if (m.some(row => !row[0][0] && !row[1][0] && row[2][0])) return 'NONE';
    return pivots.length === 2 ? `UNIQUE ${show(m[0][2])} ${show(m[1][2])}` : 'INFINITE';
  }
  if (level === 70 && p === 4) {
    const n = Number(lines[0]), grid = lines.slice(1).map(nums);
    return String(sum(permutations(Array.from({ length: n }, (_, i) => i)).map(perm => {
      const inversions = sum(perm.map((x, i) => perm.slice(i + 1).filter(y => x > y).length));
      return (inversions % 2 ? -1 : 1) * perm.reduce((acc, j, i) => acc * grid[i][j], 1);
    })));
  }
  const { r, c, grid, tail } = parseMatrix(lines), cells = allCells(r, c);
  if (level === 66) {
    if (p === 1) return String(sum(cells.filter(([i, j]) => !i || !j || i === r - 1 || j === c - 1).map(([i, j]) => grid[i][j])));
    if (p === 2) {
      const maximum = Math.max(...grid.flat());
      return cells.find(([i, j]) => grid[i][j] === maximum).join(' ');
    }
    if (p === 3) {
      const diagonals = new Map();
      for (const [i, j] of cells) {
        const key = i - j;
        if (!diagonals.has(key)) diagonals.set(key, new Set());
        diagonals.get(key).add(grid[i][j]);
      }
      return [...diagonals.values()].every(values => values.size === 1) ? 'YES' : 'NO';
    }
    if (p === 4) {
      return rows(grid.map((row, i) => row.map((value, j) =>
        row.includes(0) || grid.some(other => other[j] === 0) ? 0 : value)));
    }
    return String(grid.map(sum).indexOf(Math.max(...grid.map(sum))));
  }
  if (level === 67) {
    return rows(grid.map((row, i) => row.map((v, j) => {
      const count = sum(neighbors(r, c, i, j, true).map(([x, y]) => grid[x][y]));
      return p === 2 ? count : Number(count === 3 || (v === 1 && count === 2));
    })));
  }
  if (level === 68) {
    if (p === 1) return rows(grid.map((row, i) => row.map((_, j) => {
      const values = cells.filter(([x, y]) => x - y === i - j).map(([x, y]) => grid[x][y]);
      return values.sort((a, b) => a - b)[Math.min(i, j)];
    })));
    if (p === 2) throw new Error('square power uses another parser');
    if (p === 3) return tail.slice(1).map(line => {
      const [a, b, d, e] = nums(line);
      return sum(cells.filter(([i, j]) => a <= i && i <= d && b <= j && j <= e).map(([i, j]) => grid[i][j]));
    }).join('\n');
    if (p === 4) return rows(grid.map((row, i) => row.map((v, j) => {
      if (r === 1) return grid[0][(j + c - 1) % c];
      if (c === 1) return grid[(i + r - 1) % r][0];
      if (i === 0 && j > 0) return grid[i][j - 1];
      if (j === c - 1 && i > 0) return grid[i - 1][j];
      if (i === r - 1 && j < c - 1) return grid[i][j + 1];
      if (j === 0 && i < r - 1) return grid[i + 1][j];
      return v;
    })));
    return coords(cells.filter(([i, j]) => grid[i][j] === Math.min(...grid[i]) && grid[i][j] === Math.max(...grid.map(row => row[j]))));
  }
  if (level === 70 && p === 3) {
    const m = grid.map(row => row.map(x => frac(x))), pivotRows = [];
    for (let col = 0; col < c; col++) {
      const k = pivotRows.length;
      if (k === r) break;
      const index = m.findIndex((row, i) => i >= k && row[col][0] !== 0);
      if (index < 0) continue;
      [m[k], m[index]] = [m[index], m[k]];
      const pivot = m[k][col];
      m[k] = m[k].map(x => div(x, pivot));
      for (let i = k + 1; i < r; i++) {
        const coefficient = neg(m[i][col]);
        m[i] = m[i].map((x, j) => add(x, mul(coefficient, m[k][j])));
      }
      pivotRows.push(col);
    }
    return rows(m.map(row => row.map(show)));
  }
  if (level === 70 && p === 5) {
    const zr = grid.flatMap((row, i) => row.every(x => x === 0) ? [i] : []);
    const zc = Array.from({ length: c }, (_, j) => j).filter(j => grid.every(row => row[j] === 0));
    return `${[zr.length, ...zr].join(' ')}\n${[zc.length, ...zc].join(' ')}`;
  }
  throw new Error(`Unknown challenge ${id}`);
}

function independentAnswer(id, input) {
  if (id !== 'level-68-problem-2') return expected(id, input);
  const lines = input.slice(0, -1).split('\n'), [n, power] = nums(lines[0]), grid = lines.slice(1).map(nums);
  // Enumerate all intermediate-index paths rather than performing matrix multiplication.
  const entry = (i, j, steps) => {
    if (!steps) return Number(i === j);
    return sum(Array.from({ length: n }, (_, k) => grid[i][k] * entry(k, j, steps - 1)));
  };
  return rows(Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => entry(i, j, power))));
}

let pyodide;
beforeAll(async () => {
  pyodide = await loadPyodide({ indexURL: fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url)) });
});

async function runPython(records) {
  const script = [
    'import io, json, sys',
    '_old_in, _old_out = sys.stdin, sys.stdout',
    '_results = []',
    `for _source, _input in ${JSON.stringify(records)}:`,
    '    _capture = io.StringIO()',
    '    try:',
    '        sys.stdin, sys.stdout = io.StringIO(_input), _capture',
    '        exec(compile(_source, "<challenge>", "exec"), {"__name__": "__main__"})',
    '        _results.append([_capture.getvalue(), None])',
    '    except Exception as _error:',
    '        _results.append([_capture.getvalue(), repr(_error)])',
    '    finally:',
    '        sys.stdin, sys.stdout = _old_in, _old_out',
    'json.dumps(_results)'
  ].join('\n');
  return JSON.parse(await pyodide.runPythonAsync(script));
}

describe('matrix and function challenges, levels 66–70', () => {
  it('exports complete individually authored challenge metadata', () => {
    expect(Object.keys(problems)).toEqual(ids);
    for (const [id, problem] of Object.entries(problems)) {
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      expect(cases, id).toHaveLength(8);
      expect(new Set(cases.map(c => c.input)).size, id).toBe(8);
      expect(problem.contentRevision, id).toBe(1);
      expect(problem.examples, id).toHaveLength(2);
      expect(problem.examples.every(example => example.explanation), id).toBe(true);
      expect(problem.hints, id).toHaveLength(5);
      expect(new Set(problem.hints).size, id).toBe(5);
      expect(problem.inputFormat, id).toBeTruthy();
      expect(problem.outputFormat, id).toBeTruthy();
      expect(problem.constraints.length, id).toBeGreaterThan(0);
      expect(problem.starterCode.stdin, id).not.toBe(problem.referenceSolution);
    }
  });

  it('independently checks every expected output', () => {
    for (const [id, problem] of Object.entries(problems)) {
      for (const c of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect.soft(independentAnswer(id, c.input), `${id}: ${c.input}`).toBe(c.output);
      }
    }
  });

  it('runs all 200 reference cases in Pyodide', async () => {
    const cases = ids.flatMap(id => [...problems[id].publicTestCases, ...problems[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: problems[id].referenceSolution })));
    expect(cases).toHaveLength(200);
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect.soft(results[i][1], `${c.id}: ${c.input}`).toBeNull();
      expect.soft(results[i][0].replace(/\n$/, ''), `${c.id}: ${c.input}`).toBe(c.output);
    }
  });

  it('checks exact trapezoid rounding across a strong bounded-domain sample', async () => {
    const source = problems['level-69-problem-5'].referenceSolution;
    const cases = [];
    for (const a of [-10, -3, -1, 0, 1, 3, 10]) {
      for (const [b, c] of [[0, 0], [-3, 6], [10, -10], [-10, 10]]) {
        for (const [left, right] of [[-10, 10], [-5, 9], [0, 1], [-1, 1], [4, 4], [-10, -3], [3, 10]]) {
          for (let n = 1; n <= 20; n++) {
            const values = [a, b, c, left, right, n];
            cases.push({ input: `${values.join(' ')}\n`, output: exactTrapezoid(...values) });
          }
        }
      }
    }
    const results = await runPython(cases.map(c => [source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect.soft(results[i][1], c.input).toBeNull();
      expect.soft(results[i][0].replace(/\n$/, ''), c.input).toBe(c.output);
    }
  }, 30000);

  it('compiles and runs every starter on every case', async () => {
    const cases = ids.flatMap(id => [...problems[id].publicTestCases, ...problems[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: problems[id].starterCode.stdin })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i][1], `${c.id}: ${c.input}`).toBeNull();
      expect(results[i][0], `${c.id}: ${c.input}`).toBe('');
    }
  });
});
