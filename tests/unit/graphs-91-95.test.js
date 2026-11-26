import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { graphs9195Challenges as challenges } from '../../src/data/graphs-91-95.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${91 + Math.floor(i / 5)}-problem-${1 + i % 5}`);
const ints = text => text.trim() ? text.trim().split(/\s+/).map(Number) : [];
const lines = text => text.slice(0, -1).split('\n');
const parseGraph = input => {
  const rows = lines(input);
  const [n, m] = ints(rows[0]);
  return { n, edges: rows.slice(1, m + 1).map(ints), rest: rows.slice(m + 1).map(ints) };
};
const matrix = (n, edges, directed = true) => {
  const a = Array.from({ length: n }, () => Array(n).fill(false));
  for (const [u, v] of edges) {
    a[u][v] = true;
    if (!directed) a[v][u] = true;
  }
  return a;
};
const closure = a => {
  const b = a.map(row => [...row]);
  for (let k = 0; k < b.length; k++)
    for (let i = 0; i < b.length; i++)
      for (let j = 0; j < b.length; j++)
        b[i][j] ||= b[i][k] && b[k][j];
  return b;
};
const components = (a, strong = false) => {
  const reach = closure(a), unseen = new Set(a.map((_, i) => i)), groups = [];
  while (unseen.size) {
    const start = unseen.values().next().value;
    const group = [...unseen].filter(v => v === start || (reach[start][v] && (!strong || reach[v][start])));
    group.forEach(v => unseen.delete(v));
    groups.push(group);
  }
  return groups;
};
const groupsOut = groups => [groups.length, ...groups.map(g => g.join(' '))].join('\n');
const permutations = arr => arr.length
  ? arr.flatMap((v, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(p => [v, ...p]))
  : [[]];
const lex = (a, b) => {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return a.length - b.length;
};
const listOut = answers => [answers.length, ...answers.sort(lex).map(a => a.length ? a.join(' ') : '-')].join('\n');
const subsets = n => Array.from({ length: 2 ** n }, (_, mask) =>
  Array.from({ length: n }, (_, i) => i).filter(i => mask & (1 << i)));
const paths = (a, s, t) => {
  const found = [];
  function walk(u, visited, length) {
    if (u === t) { found.push(length); return; }
    for (let v = 0; v < a.length; v++)
      if (a[u][v] && !visited.has(v)) walk(v, new Set([...visited, v]), length + 1);
  }
  walk(s, new Set([s]), 0);
  return found;
};
const distances = (n, edges, bottleneck = false) => {
  const d = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 0 : Infinity));
  for (const [u, v, w] of edges) d[u][v] = Math.min(d[u][v], w);
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
    d[i][j] = Math.min(d[i][j], bottleneck ? Math.max(d[i][k], d[k][j]) : d[i][k] + d[k][j]);
  return d;
};
const fmt = row => row.map(x => x === Infinity ? 'INF' : String(x)).join(' ');
const parseGrid = input => {
  const rows = lines(input), [h, w] = ints(rows[0]);
  return { h, w, a: rows.slice(1, h + 1).map(ints), rest: rows.slice(h + 1).map(ints) };
};
const neighbors = (r, c, h, w) => [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]
  .filter(([x, y]) => x >= 0 && x < h && y >= 0 && y < w);
const region = (a, r, c) => {
  const h = a.length, w = a[0].length, color = a[r][c], seen = new Set([`${r},${c}`]), q = [[r,c]];
  for (let i = 0; i < q.length; i++) {
    for (const [x,y] of neighbors(...q[i], h, w))
      if (a[x][y] === color && !seen.has(`${x},${y}`)) {
        seen.add(`${x},${y}`); q.push([x,y]);
      }
  }
  return q;
};

const oracles = {
  'level-91-problem-1': input => {
    const { n, edges, rest: [[s,t]] } = parseGraph(input);
    return s === t || closure(matrix(n, edges))[s][t] ? 'YES' : 'NO';
  },
  'level-91-problem-2': input => {
    const { n, edges, rest: [[s,t]] } = parseGraph(input);
    const p = paths(matrix(n, edges, false), s, t);
    return p.length ? String(Math.min(...p)) : '-1';
  },
  'level-91-problem-3': input => {
    const { n, edges } = parseGraph(input);
    return groupsOut(components(matrix(n, edges, false)));
  },
  'level-91-problem-4': input => {
    const { n, edges, rest: [[s,t]] } = parseGraph(input);
    const p = paths(matrix(n, edges, false), s, t);
    return String(p.filter(x => x === Math.min(...p)).length);
  },
  'level-91-problem-5': input => {
    const { n, edges } = parseGraph(input);
    return Array.from({ length: 2 ** n }, (_, mask) => mask)
      .some(mask => edges.every(([u,v]) => Boolean(mask & (1 << u)) !== Boolean(mask & (1 << v)))) ? 'YES' : 'NO';
  },
  'level-92-problem-1': input => {
    const { n, edges } = parseGraph(input);
    const count = components(matrix(n, edges, false)).length;
    return edges.length > n - count ? 'YES' : 'NO';
  },
  'level-92-problem-2': input => {
    const { n, edges } = parseGraph(input), a = closure(matrix(n, edges));
    return a.some((row, i) => row[i]) ? 'YES' : 'NO';
  },
  'level-92-problem-3': input => {
    const { n, edges } = parseGraph(input);
    const order = permutations(Array.from({ length: n }, (_, i) => i))
      .find(p => edges.every(([u,v]) => p.indexOf(u) < p.indexOf(v)));
    return order ? order.join(' ') : 'CYCLE';
  },
  'level-92-problem-4': input => {
    const { n, edges } = parseGraph(input);
    return groupsOut(components(matrix(n, edges), true));
  },
  'level-92-problem-5': input => {
    const { n, edges, rest: [[s,t]] } = parseGraph(input);
    return String(paths(matrix(n, edges), s, t).length);
  },
  'level-93-problem-1': input => {
    const { n, edges, rest: [[s]] } = parseGraph(input);
    return fmt(distances(n, edges)[s]);
  },
  'level-93-problem-2': input => {
    const { n, edges, rest: [[s]] } = parseGraph(input), d = distances(n, edges);
    return d.some((row, i) => d[s][i] !== Infinity && row[i] < 0) ? 'NEGATIVE CYCLE' : fmt(d[s]);
  },
  'level-93-problem-3': input => {
    const { n, edges } = parseGraph(input);
    return distances(n, edges).map(fmt).join('\n');
  },
  'level-93-problem-4': input => {
    const { n, edges } = parseGraph(input);
    const original = components(matrix(n, edges, false)).length;
    let best = Infinity;
    for (const indices of subsets(edges.length)) {
      if (indices.length !== n - original) continue;
      const selected = indices.map(i => edges[i]);
      if (components(matrix(n, selected, false)).length === original)
        best = Math.min(best, selected.reduce((sum, e) => sum + e[2], 0));
    }
    return String(best);
  },
  'level-93-problem-5': input => {
    const { n, edges, rest: [[s]] } = parseGraph(input);
    return fmt(distances(n, edges, true)[s]);
  },
  'level-94-problem-1': input => {
    const { h, w, a } = parseGrid(input);
    let best = 0;
    for (let flip = -1; flip < h * w; flip++) {
      const b = a.map(row => [...row]);
      if (flip >= 0) b[Math.floor(flip / w)][flip % w] = 1;
      for (let r = 0; r < h; r++) for (let c = 0; c < w; c++)
        if (b[r][c]) best = Math.max(best, region(b, r, c).length);
    }
    return String(best);
  },
  'level-94-problem-2': input => {
    const { a, rest: [[r,c,color]] } = parseGrid(input);
    for (const [x,y] of region(a, r, c)) a[x][y] = color;
    return a.map(row => row.join(' ')).join('\n');
  },
  'level-94-problem-3': input => {
    const { h, w, a, rest: [[sr,sc,tr,tc]] } = parseGrid(input);
    let frontier = [[sr,sc,0]], seen = new Set([`${sr},${sc},0`]), distance = 0;
    while (frontier.length) {
      if (frontier.some(([r,c]) => r === tr && c === tc)) return String(distance);
      const next = [];
      for (const [r,c,used] of frontier) for (const [x,y] of neighbors(r,c,h,w)) {
        const remaining = used + a[x][y], key = `${x},${y},${remaining}`;
        if (remaining <= 1 && !seen.has(key)) { seen.add(key); next.push([x,y,remaining]); }
      }
      frontier = next; distance++;
    }
    return '-1';
  },
  'level-94-problem-4': input => {
    const { h, w, a } = parseGrid(input), seen = new Set();
    let total = 0;
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      if (a[r][c] !== 0 || seen.has(`${r},${c}`)) continue;
      const cells = region(a, r, c);
      for (const [x,y] of cells) seen.add(`${x},${y}`);
      if (cells.every(([x,y]) => x > 0 && x < h - 1 && y > 0 && y < w - 1))
        total += cells.length;
    }
    return String(total);
  },
  'level-94-problem-5': input => {
    const { h, w, a } = parseGrid(input);
    let cells = 0, shared = 0;
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) if (a[r][c]) {
      cells++;
      if (r + 1 < h && a[r+1][c]) shared++;
      if (c + 1 < w && a[r][c+1]) shared++;
    }
    return String(4 * cells - 2 * shared);
  },
  'level-95-problem-1': input => {
    const values = ints(input);
    return listOut(subsets(values.length).map(indices => indices.map(i => values[i]).sort((a,b) => a-b)));
  },
  'level-95-problem-2': input => listOut(permutations(ints(input))),
  'level-95-problem-3': input => {
    const [raw, prefix] = lines(input), n = Number(raw), result = [];
    for (let mask = 0; mask < 2 ** (2*n); mask++) {
      let text = '', balance = 0, valid = true;
      for (let i = 0; i < 2*n; i++) {
        const ch = mask & (1 << i) ? '(' : ')';
        text += ch; balance += ch === '(' ? 1 : -1;
        if (balance < 0) valid = false;
      }
      if (valid && balance === 0 && text.startsWith(prefix)) result.push(text);
    }
    result.sort();
    return [result.length, ...result.map(x => x || '-')].join('\n');
  },
  'level-95-problem-4': input => {
    const text = lines(input)[0], answers = [];
    if (!text.length) return '1\n-';
    for (let mask = 0; mask < 2 ** (text.length - 1); mask++) {
      const pieces = []; let start = 0;
      for (let i = 0; i < text.length - 1; i++) if (mask & (1 << i)) {
        pieces.push(text.slice(start, i + 1)); start = i + 1;
      }
      pieces.push(text.slice(start));
      if (pieces.every(p => p === [...p].reverse().join(''))) answers.push(pieces);
    }
    return listOut(answers);
  },
  'level-95-problem-5': input => {
    const [values, target] = lines(input), a = ints(values);
    return listOut(subsets(a.length).filter(indices =>
      indices.reduce((sum, i) => sum + a[i], 0) === Number(target)));
  }
};

let pyodide;
beforeAll(async () => {
  pyodide = await loadPyodide({ indexURL: fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url)) });
});

async function runPython(records) {
  const code = [
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
  return JSON.parse(await pyodide.runPythonAsync(code));
}

describe('graph and backtracking challenges, levels 91–95', () => {
  it('exports complete challenge metadata and eight distinct cases each', () => {
    expect(Object.keys(challenges)).toEqual(ids);
    expect(new Set(ids.map(id => challenges[id].title)).size).toBe(25);
    for (const id of ids) {
      const p = challenges[id], cases = [...p.publicTestCases, ...p.hiddenTestCases];
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
    }
  });

  it('checks manually specified expected outputs with independent oracles', () => {
    for (const id of ids) for (const c of [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases])
      expect(oracles[id](c.input), `${id}: ${c.input}`).toBe(c.output);
  });

  it('executes all 200 reference cases in Pyodide', async () => {
    const cases = ids.flatMap(id => [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: challenges[id].referenceSolution })));
    expect(cases).toHaveLength(200);
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output.replace(/\r\n/g, '\n').replace(/\n+$/, ''), `${c.id}: ${c.input}`).toBe(c.output);
    }
  });

  it('compiles and runs starters against every case', async () => {
    const cases = ids.flatMap(id => [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: challenges[id].starterCode.stdin })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output, `${c.id}: ${c.input}`).toBe('');
    }
  });
});
