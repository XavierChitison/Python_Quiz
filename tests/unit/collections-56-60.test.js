import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { collections5660Challenges as problems } from '../../src/data/collections-56-60.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${56 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const nums = line => line.trim() ? line.trim().split(/\s+/).map(Number) : [];
const words = line => line.trim() ? line.trim().split(/\s+/) : [];
const join = a => a.join(' ');
const yes = b => b ? 'YES' : 'NO';
const listAndTarget = lines => [nums(lines[0]), Number(lines[1])];
const allPairs = a => a.flatMap((x, i) => a.slice(i + 1).map((y, j) => [i, i + j + 1, x, y]));
const windows = a => a.flatMap((_, i) => a.slice(i).map((__, j) => a.slice(i, i + j + 1)));
const sum = a => a.reduce((x, y) => x + y, 0);
const rows = records => `${records.length}${records.length ? '\n' + records.map(join).join('\n') : ''}`;

function readRecords(lines) {
  let at = 0;
  const take = () => {
    const n = Number(lines[at++]);
    return Array.from({ length: n }, () => nums(lines[at++]));
  };
  const a = take();
  return { a, take, rest: () => lines[at] };
}
function groupsOutput(items, matches) {
  const groups = [];
  for (const item of items) {
    const group = groups.find(g => matches(g[0], item));
    if (group) group.push(item);
    else groups.push([item]);
  }
  return rows(groups);
}
function graph(lines) {
  const [n, m] = nums(lines[0]);
  return { n, edges: lines.slice(1, m + 1).map(nums) };
}
const linked = (edges, a, b) => edges.some(([x, y]) =>
  (x === a && y === b) || (x === b && y === a));
const range = n => Array.from({ length: n }, (_, i) => i);

// Brute-force enumeration and direct comparisons serve as independent oracles.
const answers = {
  'level-56-problem-1': l => yes(join(nums(l[0]).sort((a,b) => a-b)) === join(nums(l[1]).sort((a,b) => a-b))),
  'level-56-problem-2': l => {
    const removed = nums(l[1]);
    return join(nums(l[0]).filter(x => {
      const i = removed.indexOf(x);
      if (i < 0) return true;
      removed.splice(i, 1);
      return false;
    }));
  },
  'level-56-problem-3': l => {
    const documents = l.slice(1, Number(l[0]) + 1).map(words);
    const vocabulary = [...new Set(documents.flat())].sort();
    return rows(vocabulary.map(w => [w, ...range(documents.length).filter(i => documents[i].includes(w))]));
  },
  'level-56-problem-4': l => groupsOutput(words(l[0]), (a, b) =>
    a.length === b.length && [...'abcdefghijklmnopqrstuvwxyz'].every(c =>
      [...a].filter(x => x === c).length === [...b].filter(x => x === c).length)),
  'level-56-problem-5': l => {
    const [a, target] = listAndTarget(l);
    const pair = allPairs(a).find(([, , x, y]) => x + y === target);
    return pair ? join(pair.slice(0, 2)) : '-1';
  },
  'level-57-problem-1': l => {
    const [a, target] = listAndTarget(l);
    return String(allPairs(a).filter(([, , x, y]) => x + y === target).length);
  },
  'level-57-problem-2': l => {
    const [a, target] = listAndTarget(l);
    return String(windows(a).filter(w => sum(w) === target).length);
  },
  'level-57-problem-3': l => {
    const unique = [...new Set(nums(l[0]))].sort((a,b) => a-b);
    let best = 0, run = 0;
    unique.forEach((v, i) => { run = i && unique[i-1] === v-1 ? run+1 : 1; best = Math.max(best, run); });
    return String(best);
  },
  'level-57-problem-4': l => {
    const a = nums(l[0]);
    const counts = [...new Set(a)].map(x => a.filter(y => x === y).length);
    const best = (i, chosen) => {
      if (i === counts.length) return 0;
      return Math.max(...range(counts[i] + 1).filter(n => n === 0 || !chosen.includes(n))
        .map(n => n + best(i + 1, n ? [...chosen, n] : chosen)));
    };
    return String(a.length - best(0, []));
  },
  'level-57-problem-5': l => {
    const [a, k] = listAndTarget(l);
    return join(range(a.length-k+1).map(i => new Set(a.slice(i, i+k)).size));
  },
  'level-58-problem-1': l => {
    const r = readRecords(l), b = r.take();
    return String(sum(r.a.flatMap(([i, v]) => b.filter(([j]) => i === j).map(([, w]) => v*w))));
  },
  'level-58-problem-2': l => rows(readRecords(l).a.filter(([e,c]) => e > 0 && c !== 0)
    .map(([e,c]) => [e-1, e*c]).sort((a,b) => a[0]-b[0])),
  'level-58-problem-3': l => {
    const r = readRecords(l);
    return String(nums(r.rest()).filter(x => sum(r.a.map(([e,c]) => c * x**e)) === 0).length);
  },
  'level-58-problem-4': l => {
    const r = readRecords(l), b = r.take();
    const dot = sum(r.a.flatMap(([i,v]) => b.filter(([j]) => i === j).map(([,w]) => v*w)));
    const norm = Math.sqrt(sum(r.a.map(([,v]) => v*v)) * sum(b.map(([,v]) => v*v)));
    return (dot / norm).toFixed(6);
  },
  'level-58-problem-5': l => {
    const r = readRecords(l), b = r.take();
    const products = r.a.flatMap(([e,c]) => b.map(([f,d]) => [e+f,c*d]));
    const exponents = [...new Set(products.map(([e]) => e))].sort((a,b) => a-b);
    return rows(exponents.map(e => [e, sum(products.filter(([x]) => x === e).map(([,c]) => c))]).filter(([,c]) => c));
  },
  'level-59-problem-1': l => {
    const {n, edges} = graph(l);
    return range(n).map(v => join([v, ...range(n).filter(w => linked(edges,v,w))])).join('\n');
  },
  'level-59-problem-2': l => {
    const {n, edges} = graph(l);
    return join(range(n).map(v => edges.filter(e => e.includes(v)).length));
  },
  'level-59-problem-3': l => {
    const {edges} = graph(l);
    return yes(edges.some(([a,b], i) => linked(edges.slice(0,i), a, b)));
  },
  'level-59-problem-4': l => {
    const {edges} = graph(l);
    const walk = nums(l[edges.length + 1]);
    return yes(walk.slice(1).every((v, i) => linked(edges, walk[i], v)));
  },
  'level-59-problem-5': l => {
    const {n, edges} = graph(l);
    let total = 0;
    for (let a = 0; a < n; a++) for (let b = a+1; b < n; b++) for (let c = b+1; c < n; c++)
      if (linked(edges,a,b) && linked(edges,a,c) && linked(edges,b,c)) total++;
    return String(total);
  },
  'level-60-problem-1': l => {
    const n = Number(l[0]);
    const stock = l.slice(1, n + 1).map(line => {
      const [name, amount] = words(line);
      return [name, Number(amount)];
    });
    const m = Number(l[n + 1]);
    const accepted = [];
    for (let i = 0; i < m; i++) {
      const [name, amount] = words(l[n + 2 + i]);
      const entry = stock.find(([item]) => item === name);
      if (entry && entry[1] >= Number(amount)) {
        entry[1] -= Number(amount);
        accepted.push(i);
      }
    }
    return join(accepted);
  },
  'level-60-problem-2': l => {
    const records = l.slice(1, Number(l[0])+1).map(words);
    return yes(records.every(([k,v]) => records.every(([key,value]) => key !== k || value === v)));
  },
  'level-60-problem-3': l => groupsOutput(words(l[0]), (a,b) =>
    a.length === b.length && [...a].every((c,i) =>
      (b.charCodeAt(i) - c.charCodeAt(0) + 26) % 26 === (b.charCodeAt(0) - a.charCodeAt(0) + 26) % 26)),
  'level-60-problem-4': l => {
    const valid = windows(nums(l[0])).filter(w => w.filter(x => x === 0).length === w.filter(x => x === 1).length);
    return String(Math.max(0, ...valid.map(w => w.length)));
  },
  'level-60-problem-5': l => {
    const [a,k] = listAndTarget(l);
    return String(new Set(windows(a).filter(w => w.length === k).map(join)).size);
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

describe('collections challenges, levels 56–60', () => {
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
