import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { advanced96100Challenges as challenges } from '../../src/data/advanced-96-100.js';

const ids = ['level-96-problem-1', 'level-96-problem-2', 'level-96-problem-3', 'level-96-problem-4', 'level-96-problem-5',
  ...[97, 98, 99, 100].flatMap(level =>
    Array.from({ length: 5 }, (_, i) => `level-${level}-problem-${i + 1}`))];
const lines = input => input.slice(0, -1).split('\n');
const nums = line => line.trim() ? line.trim().split(/\s+/).map(Number) : [];
const subsets = a => Array.from({ length: 2 ** a.length }, (_, mask) =>
  a.filter((_, i) => mask & (1 << i)));

const oracles = {
  'level-96-problem-1': input => {
    const n = Number(input), results = [];
    function permute(p, left) {
      if (!left.length) {
        if (p.every((a, i) => p.every((b, j) => i === j || Math.abs(a - b) !== Math.abs(i - j))))
          results.push(p.length ? p.join(' ') : 'EMPTY');
        return;
      }
      for (const x of left) permute([...p, x], left.filter(y => y !== x));
    }
    permute([], Array.from({ length: n }, (_, i) => i));
    return results.join('\n') || 'NONE';
  },
  'level-96-problem-2': input => {
    const board = lines(input).map(row => [...row].map(Number));
    function possibilities(r, c) {
      const used = new Set([...board[r], ...board.map(row => row[c])]);
      for (let i = Math.floor(r / 3) * 3; i < Math.floor(r / 3) * 3 + 3; i++)
        for (let j = Math.floor(c / 3) * 3; j < Math.floor(c / 3) * 3 + 3; j++) used.add(board[i][j]);
      return Array.from({ length: 9 }, (_, i) => i + 1).filter(d => !used.has(d));
    }
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const value = board[r][c];
      if (!value) continue;
      board[r][c] = 0;
      const valid = possibilities(r, c).includes(value);
      board[r][c] = value;
      if (!valid) return 'NONE';
    }
    let best = null;
    function solve() {
      let chosen = null;
      for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (!board[r][c]) {
        const options = possibilities(r, c);
        if (!chosen || options.length < chosen.options.length) chosen = { r, c, options };
      }
      if (!chosen) {
        const value = board.map(row => row.join('')).join('\n');
        if (best === null || value < best) best = value;
        return;
      }
      for (const digit of chosen.options) {
        board[chosen.r][chosen.c] = digit;
        solve();
      }
      board[chosen.r][chosen.c] = 0;
    }
    solve();
    return best ?? 'NONE';
  },
  'level-96-problem-3': input => {
    const [header, ...rest] = lines(input), [r, c] = nums(header), grid = rest.slice(0, r), word = rest[r];
    let paths = [[]];
    for (const ch of word) {
      paths = paths.flatMap(path => {
        const cells = [];
        for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
          if (grid[i][j] !== ch || path.some(([x, y]) => x === i && y === j)) continue;
          if (path.length && Math.abs(path.at(-1)[0] - i) + Math.abs(path.at(-1)[1] - j) !== 1) continue;
          cells.push([...path, [i, j]]);
        }
        return cells;
      });
    }
    return paths.length ? 'YES' : 'NO';
  },
  'level-96-problem-4': input => {
    const [header, ...rest] = lines(input), [n, , k] = nums(header), edges = rest.map(nums);
    if (!n) return 'EMPTY';
    for (let x = 0; x < k ** n; x++) {
      let value = x, colors = Array(n);
      for (let i = n - 1; i >= 0; i--) {
        colors[i] = value % k + 1;
        value = Math.floor(value / k);
      }
      if (edges.every(([u, v]) => colors[u] !== colors[v])) return colors.join(' ');
    }
    return 'NONE';
  },
  'level-96-problem-5': input => {
    const [raw, line] = lines(input), k = Number(raw), values = nums(line), target = values.reduce((a, b) => a + b, 0) / k;
    function partition(remaining, groups) {
      if (!groups) return !remaining.length;
      return subsets(remaining.map((v, i) => [v, i])).some(s => s.length &&
        s.reduce((sum, [v]) => sum + v, 0) === target &&
        partition(remaining.filter((_, i) => !s.some(([, j]) => i === j)), groups - 1));
    }
    return partition(values, k) ? 'YES' : 'NO';
  },
  'level-97-problem-1': input => {
    const s = lines(input)[0];
    function count(i) {
      if (i === s.length) return 1;
      if (s[i] === '0') return 0;
      return count(i + 1) + (i + 1 < s.length && Number(s.slice(i, i + 2)) <= 26 ? count(i + 2) : 0);
    }
    return String(count(0));
  },
  'level-97-problem-2': input => {
    const [raw, line] = lines(input), target = Number(raw), coins = nums(line);
    let frontier = new Set([0]);
    for (let count = 0; count <= target; count++) {
      if (frontier.has(target)) return String(count);
      frontier = new Set([...frontier].flatMap(x => coins.map(c => x + c).filter(x => x <= target)));
    }
    return '-1';
  },
  'level-97-problem-3': input => {
    const [raw, line] = lines(input), coins = nums(line);
    function count(i, remaining) {
      if (i === coins.length) return Number(remaining === 0);
      let total = 0;
      for (let n = 0; n * coins[i] <= remaining; n++) total += count(i + 1, remaining - n * coins[i]);
      return total;
    }
    return String(count(0, Number(raw)));
  },
  'level-97-problem-4': input => {
    const a = nums(input);
    let best = 0;
    for (let mask = 0; mask < 2 ** a.length; mask++) {
      if (mask & (mask << 1)) continue;
      best = Math.max(best, a.reduce((sum, v, i) => sum + ((mask & (1 << i)) ? v : 0), 0));
    }
    return String(best);
  },
  'level-97-problem-5': input => {
    const n = Number(input), placements = [];
    for (let c = 0; c < n; c++) {
      placements.push([c, n + c]);
      if (c + 1 < n) {
        placements.push([c, c + 1], [n + c, n + c + 1]);
        const square = [c, c + 1, n + c, n + c + 1];
        for (let omit = 0; omit < 4; omit++) placements.push(square.filter((_, i) => i !== omit));
      }
    }
    function count(used) {
      let first = 0;
      while (first < 2 * n && used.has(first)) first++;
      if (first === 2 * n) return 1;
      return placements.filter(p => p.includes(first) && p.every(i => !used.has(i)))
        .reduce((sum, p) => sum + count(new Set([...used, ...p])), 0);
    }
    return String(count(new Set()));
  },
  'level-98-problem-1': input => {
    const [header, ...rest] = lines(input), [, capacity] = nums(header), items = rest.map(nums);
    return String(Math.max(...subsets(items).filter(s => s.reduce((x, [w]) => x + w, 0) <= capacity)
      .map(s => s.reduce((x, [, v]) => x + v, 0))));
  },
  'level-98-problem-2': input => {
    const seq = subsets(nums(input)).filter(a => a.length < 3 || a.slice(2).every((v, i) => v - a[i + 1] === a[1] - a[0]));
    return String(Math.max(...seq.map(a => a.length)));
  },
  'level-98-problem-3': input => String(Math.max(...subsets(nums(input))
    .filter(a => a.slice(1).every((v, i) => a[i] < v)).map(a => a.length))),
  'level-98-problem-4': input => {
    const [a, b] = lines(input);
    const candidates = subsets([...a]).map(s => s.join(''));
    return String(Math.max(...candidates.filter(s => {
      let i = 0;
      for (const c of b) if (s[i] === c) i++;
      return i === s.length;
    }).map(s => s.length)));
  },
  'level-98-problem-5': input => {
    const [a, b] = lines(input);
    function distance(x, y) {
      if (!x.length) return y.length;
      if (!y.length) return x.length;
      return Math.min(1 + distance(x.slice(1), y), 1 + distance(x, y.slice(1)),
        Number(x[0] !== y[0]) + distance(x.slice(1), y.slice(1)));
    }
    return String(distance(a, b));
  },
  'level-99-problem-1': input => {
    const [, ...grid] = lines(input);
    let total = 0;
    for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid[0].length; c++) {
      for (let size = 1; r + size <= grid.length && c + size <= grid[0].length; size++) {
        let valid = true;
        for (let i = r; i < r + size; i++) for (let j = c; j < c + size; j++)
          if (grid[i][j] !== '1') valid = false;
        if (valid) total++;
      }
    }
    return String(total);
  },
  'level-99-problem-2': input => {
    const [a, b, target] = lines(input);
    function interleave(x, y, result) {
      if (!x && !y) return result === target;
      return (x && interleave(x.slice(1), y, result + x[0])) ||
        (y && interleave(x, y.slice(1), result + y[0])) || false;
    }
    return interleave(a, b, '') ? 'YES' : 'NO';
  },
  'level-99-problem-3': input => String(Math.max(...subsets([...lines(input)[0]])
    .filter(s => s.join('') === [...s].reverse().join('')).map(s => s.length))),
  'level-99-problem-4': input => {
    const d = nums(input);
    function cost(i, j) {
      if (j - i <= 1) return 0;
      let best = Infinity;
      for (let k = i + 1; k < j; k++) best = Math.min(best, cost(i, k) + cost(k, j) + d[i] * d[k] * d[j]);
      return best;
    }
    return String(cost(0, d.length - 1));
  },
  'level-99-problem-5': input => {
    const [, ...rest] = lines(input), intervals = rest.map(nums);
    const valid = subsets(intervals).filter(s => s.every(([a, b], i) =>
      s.every(([c, d], j) => i === j || b <= c || d <= a)));
    return String(Math.max(...valid.map(s => s.reduce((sum, item) => sum + item[2], 0))));
  },
  'level-100-problem-1': input => {
    const [raw, ...rows] = lines(input), n = Number(raw), cost = rows.map(nums);
    if (n === 1) return '0';
    const totals = [];
    function permute(path, left) {
      if (!left.length) {
        const tour = [0, ...path, 0];
        const edges = tour.slice(1).map((v, i) => cost[tour[i]][v]);
        if (edges.every(v => v >= 0)) totals.push(edges.reduce((a, b) => a + b, 0));
      }
      for (const v of left) permute([...path, v], left.filter(x => x !== v));
    }
    permute([], Array.from({ length: n - 1 }, (_, i) => i + 1));
    return String(totals.length ? Math.min(...totals) : -1);
  },
  'level-100-problem-2': input => {
    const [header, ...rest] = lines(input), [n] = nums(header), edges = rest.map(nums);
    let best = Infinity;
    for (let mask = 0; mask < 2 ** n; mask++) {
      if (!(mask & 1) || (mask & (1 << (n - 1)))) continue;
      const cut = edges.reduce((sum, [u, v, cap]) =>
        sum + ((mask & (1 << u)) && !(mask & (1 << v)) ? cap : 0), 0);
      best = Math.min(best, cut);
    }
    return String(best);
  },
  'level-100-problem-3': input => {
    const [header, ...rest] = lines(input), [n] = nums(header), edges = rest.map(nums);
    function components(removed) {
      const remaining = new Set(Array.from({ length: n }, (_, i) => i).filter(i => i !== removed));
      let count = 0;
      while (remaining.size) {
        count++;
        const queue = [remaining.values().next().value];
        remaining.delete(queue[0]);
        for (const u of queue) for (const [a, b] of edges) {
          const v = a === u ? b : b === u ? a : -1;
          if (remaining.delete(v)) queue.push(v);
        }
      }
      return count;
    }
    const base = components(-1);
    const result = Array.from({ length: n }, (_, i) => i).filter(i => components(i) > base);
    return result.length ? result.join(' ') : 'NONE';
  },
  'level-100-problem-4': input => {
    const [text, , ...words] = lines(input);
    function solve(s) {
      if (!s.length) return 0;
      const candidates = words.filter(w => s.startsWith(w)).map(w => 1 + solve(s.slice(w.length)));
      return Math.min(Infinity, ...candidates);
    }
    const result = solve(text);
    return String(Number.isFinite(result) ? result : -1);
  },
  'level-100-problem-5': input => {
    const [, ...rows] = lines(input), grid = rows.map(nums);
    function walk(i, j) {
      let best = 1;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = i + di, y = j + dj;
        if (grid[x]?.[y] !== undefined && grid[x][y] > grid[i][j]) best = Math.max(best, 1 + walk(x, y));
      }
      return best;
    }
    return String(Math.max(...grid.flatMap((row, i) => row.map((_, j) => walk(i, j)))));
  }
};

let pyodide;
beforeAll(async () => {
  pyodide = await loadPyodide({ indexURL: fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url)) });
});

describe('advanced dynamic programming challenges', () => {
  it('has complete metadata and eight distinct manually specified cases', () => {
    expect(Object.keys(challenges)).toEqual(ids);
    expect(new Set(ids.map(id => challenges[id].title)).size).toBe(25);
    for (const id of ids) {
      const p = challenges[id], cases = [...p.publicTestCases, ...p.hiddenTestCases];
      expect(cases, id).toHaveLength(8);
      expect(new Set(cases.map(c => c.input)).size, id).toBe(8);
      expect(p.contentRevision, id).toBe(1);
      expect(p.examples, id).toHaveLength(2);
      expect(p.examples.every(e => e.explanation), id).toBe(true);
      expect(p.examples.map(({ input, output }) => ({ input, output })), id).toEqual(cases.slice(0, 2));
      expect(p.hints, id).toHaveLength(5);
      expect(new Set(p.hints).size, id).toBe(5);
      expect(p.inputFormat && p.outputFormat && p.constraints.length, id).toBeTruthy();
    }
  });

  it('independently checks every expected answer by exhaustive search', () => {
    for (const id of ids) for (const c of [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]) {
      expect(oracles[id](c.input), `${id}: ${c.input}`).toBe(c.output);
    }
  });

  it('runs all references in Pyodide and compiles every starter', async () => {
    const cases = ids.flatMap(id => [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: challenges[id].referenceSolution })));
    const script = [
      'import io, json, sys',
      '_in, _out = sys.stdin, sys.stdout',
      '_results = []',
      `for _source, _input in ${JSON.stringify(cases.map(c => [c.source, c.input]))}:`,
      '    _capture = io.StringIO()',
      '    try:',
      '        sys.stdin, sys.stdout = io.StringIO(_input), _capture',
      '        exec(compile(_source, "<reference>", "exec"), {"__name__": "__main__"})',
      '        _results.append([_capture.getvalue(), None])',
      '    except Exception as e:',
      '        _results.append([_capture.getvalue(), repr(e)])',
      '    finally:',
      '        sys.stdin, sys.stdout = _in, _out',
      `for _source in ${JSON.stringify(ids.map(id => challenges[id].starterCode.stdin))}:`,
      '    compile(_source, "<starter>", "exec")',
      'json.dumps(_results)'
    ].join('\n');
    const results = JSON.parse(await pyodide.runPythonAsync(script));
    for (const [i, c] of cases.entries()) {
      expect(results[i][1], `${c.id}: ${c.input}`).toBeNull();
      expect(results[i][0].replace(/\r\n/g, '\n').replace(/\n+$/, ''), `${c.id}: ${c.input}`).toBe(c.output);
    }
  }, 30000);
});
