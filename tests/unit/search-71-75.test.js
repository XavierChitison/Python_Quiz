import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { search7175Challenges as challenges } from '../../src/data/search-71-75.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${71 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const nums = s => s.trim() ? s.trim().split(/\s+/).map(Number) : [];
const sorted = a => [...a].sort((x, y) => x - y);
const list = a => a.join(' ');
const median = a => {
  const b = sorted(a), n = b.length;
  return ((b[Math.floor((n - 1) / 2)] + b[Math.floor(n / 2)]) / 2).toFixed(1);
};
const isSorted = a => a.every((x, i) => i === 0 || a[i - 1] <= x);

function minSwaps(a) {
  const target = list(sorted(a));
  const queue = [[a, 0]], seen = new Set([list(a)]);
  for (let q = 0; q < queue.length; q++) {
    const [current, count] = queue[q];
    if (list(current) === target) return count;
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) {
      const b = [...current];
      [b[i], b[j]] = [b[j], b[i]];
      const key = list(b);
      if (!seen.has(key)) { seen.add(key); queue.push([b, count + 1]); }
    }
  }
}

function oracle(id, input) {
  const lines = input.slice(0, -1).split('\n');
  const a = nums(lines[0]);
  const target = Number(lines[1]);
  switch (id) {
    case 'level-71-problem-1': return String(a.findIndex((x, i) => x === i));
    case 'level-71-problem-2': {
      const k = Number(lines[0]);
      let n = 0, zeros = 0;
      while (zeros < k) {
        n++;
        let x = n;
        while (x % 5 === 0) { zeros++; x /= 5; }
      }
      return String(n);
    }
    case 'level-71-problem-3': return String(a.filter(x => x < target).length);
    case 'level-71-problem-4': {
      const feasible = Array.from({ length: Math.max(...a) + 1 }, (_, h) => h)
        .filter(h => a.reduce((sum, tree) => sum + Math.max(0, tree - h), 0) >= target);
      return String(feasible.length ? feasible.at(-1) : -1);
    }
    case 'level-71-problem-5': {
      const k = Number(lines[0]);
      let text = '';
      for (let n = 1; text.length < k; n++) text += String(n);
      return text[k - 1];
    }
    case 'level-72-problem-1': return String(minSwaps(a));
    case 'level-72-problem-2': {
      if (isSorted(a)) return '-1 -1';
      for (let length = 2; length <= a.length; length++) {
        for (let l = 0; l + length <= a.length; l++) {
          const r = l + length;
          if (isSorted([...a.slice(0, l), ...sorted(a.slice(l, r)), ...a.slice(r)])) return `${l} ${r - 1}`;
        }
      }
      throw new Error('No sortable subarray');
    }
    case 'level-72-problem-3': return list(a.map(x => 1 + a.filter(y => y > x).length));
    case 'level-72-problem-4': {
      const words = lines[0].trim() ? lines[0].trim().split(/\s+/) : [];
      return list(words.map((word, i) => ({ word, i })).sort((x, y) => x.word.length - y.word.length || x.i - y.i).map(x => x.word));
    }
    case 'level-72-problem-5': return String(a.reduce((sum, x, i) => sum + a.slice(i + 1).filter(y => x > y).length, 0));
    case 'level-73-problem-1': {
      const b = nums(lines[1]);
      if (!a.length) return '0';
      for (let shift = 0; shift < a.length; shift++) {
        if (list([...a.slice(shift), ...a.slice(0, shift)]) === list(b)) return String(shift);
      }
      return '-1';
    }
    case 'level-73-problem-2': return String(Math.min(...a));
    case 'level-73-problem-3': return String(a.indexOf(Math.max(...a)));
    case 'level-73-problem-4': {
      const [r] = a;
      const matrix = lines.slice(1, r + 1).flatMap(nums);
      return matrix.includes(Number(lines[r + 1])) ? 'YES' : 'NO';
    }
    case 'level-73-problem-5': {
      let x = 0, missing = 0;
      while (missing < target) { x++; if (!a.includes(x)) missing++; }
      return String(x);
    }
    case 'level-74-problem-1': return list(sorted(a));
    case 'level-74-problem-2': {
      const tokens = lines[0].split(/\s+/);
      const permutations = items => items.length
        ? items.flatMap((x, i) => permutations(items.filter((_, j) => i !== j)).map(rest => x + rest))
        : [''];
      const best = permutations(tokens).sort().at(-1);
      return /^0+$/.test(best) ? '0' : best;
    }
    case 'level-74-problem-3': {
      const b = sorted(a);
      return String(Math.max(0, ...b.slice(1).map((x, i) => x - b[i])));
    }
    case 'level-74-problem-4': return String(Math.max(...Array.from({ length: a.length + 1 }, (_, h) => a.filter(x => x >= h).length >= h ? h : 0)));
    case 'level-74-problem-5': {
      const rows = lines.slice(1, Number(lines[0]) + 1).map(nums);
      const values = sorted([...new Set(rows.flat())]);
      let best = null;
      for (const lo of values) for (const hi of values) {
        if (hi < lo || !rows.every(row => row.some(x => lo <= x && x <= hi))) continue;
        if (!best || hi - lo < best[1] - best[0] || (hi - lo === best[1] - best[0] && lo < best[0])) best = [lo, hi];
      }
      return list(best);
    }
    case 'level-75-problem-1': return String(sorted(a)[target - 1]);
    case 'level-75-problem-2': {
      const [k, t] = nums(lines[1]);
      const chosen = [...a].sort((x, y) => Math.abs(x - t) - Math.abs(y - t) || x - y).slice(0, k);
      return list(sorted(chosen));
    }
    case 'level-75-problem-3': return median([...a, ...nums(lines[1])]);
    case 'level-75-problem-4': return a.map((_, i) => list(sorted(a.slice(0, i + 1)).reverse().slice(0, target))).join('\n');
    case 'level-75-problem-5': return a.map((_, i) => median(a.slice(0, i + 1))).join('\n');
    default: throw new Error(`Unknown ID: ${id}`);
  }
}

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

describe('search and ordering levels 71–75', () => {
  const cases = ids.flatMap(id => {
    const p = challenges[id];
    return [...p.publicTestCases, ...p.hiddenTestCases].map(c => ({ id, ...c }));
  });

  it('exports complete independently authored challenge metadata', () => {
    expect(Object.keys(challenges)).toEqual(ids);
    for (const [id, p] of Object.entries(challenges)) {
      const all = [...p.publicTestCases, ...p.hiddenTestCases];
      expect(all, id).toHaveLength(8);
      expect(new Set(all.map(c => c.input)).size, id).toBe(8);
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
    for (const c of cases) expect(oracle(c.id, c.input), `${c.id}: ${c.input}`).toBe(c.output);
  });

  it('executes all 200 reference cases in Pyodide', async () => {
    const results = await runPython(cases.map(c => [challenges[c.id].referenceSolution, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output.replace(/\n$/, ''), `${c.id}: ${c.input}`).toBe(c.output);
    }
  });

  it('compiles and runs every starter on every case', async () => {
    const results = await runPython(cases.map(c => [challenges[c.id].starterCode.stdin, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output, `${c.id}: ${c.input}`).toBe('');
    }
  });
});
