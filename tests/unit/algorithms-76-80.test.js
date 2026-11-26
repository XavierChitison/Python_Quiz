import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { algorithms7680Challenges as problems } from '../../src/data/algorithms-76-80.js';

const ids = Array.from({ length: 25 }, (_, i) => `level-${76 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const numbers = line => line.trim() ? line.trim().split(/\s+/).map(Number) : [];
const pairs = a => a.flatMap((x, i) => a.slice(i + 1).map((y, j) => [x, y, i, i + j + 1]));
const rows = records => [records.length, ...records.map(r => r.join(' '))].join('\n');

// Exhaustive enumeration is deliberately independent of the pointer solutions.
const answers = {
  'level-76-problem-1': lines => {
    const [n, m] = numbers(lines[0]);
    const a = lines.slice(1, n + 1).map(numbers);
    const b = lines.slice(n + 1, n + m + 1).map(numbers);
    return rows(a.flatMap(([l, r]) => b.map(([s, t]) => [Math.max(l, s), Math.min(r, t)]))
      .filter(([l, r]) => l <= r).sort((x, y) => x[0] - y[0] || x[1] - y[1]));
  },
  'level-76-problem-2': lines => {
    const a = numbers(lines[0]);
    const triples = new Set();
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++)
      for (let k = j + 1; k < a.length; k++)
        if (a[i] + a[j] + a[k] === 0) triples.add([a[i], a[j], a[k]].sort((x, y) => x - y).join(' '));
    return rows([...triples].map(numbers).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]));
  },
  'level-76-problem-3': lines => {
    const target = Number(lines[1]);
    const sums = pairs(numbers(lines[0])).map(([x, y]) => x + y);
    sums.sort((a, b) => Math.abs(a - target) - Math.abs(b - target) || a - b);
    return String(sums[0]);
  },
  'level-76-problem-4': lines => String(Math.max(0, ...pairs(numbers(lines[0]))
    .map(([x, y, i, j]) => Math.min(x, y) * (j - i)))),
  'level-76-problem-5': lines => String(pairs(numbers(lines[0]))
    .filter(([x, y]) => Math.abs(y - x) <= Number(lines[1])).length),
  'level-77-problem-1': lines => {
    const n = Number(lines[0]);
    let count = 0;
    for (let x = 1; x <= n; x++) {
      let squareFree = true;
      for (let d = 2; d * d <= x; d++)
        if (x % (d * d) === 0) { squareFree = false; break; }
      if (squareFree) count++;
    }
    return String(count);
  },
  'level-77-problem-2': lines => {
    const [base, exp, mod] = numbers(lines[0]).map(BigInt);
    const exponent = Number(exp);
    let result = 1n % mod;
    const seen = new Map(), sequence = [];
    for (let i = 0; i <= exponent; i++) {
      if (seen.has(result)) {
        const start = seen.get(result);
        return String(sequence[start + (exponent - start) % (i - start)]);
      }
      seen.set(result, i);
      sequence.push(result);
      result = ((result * base) % mod + mod) % mod;
    }
    return String(sequence[exponent]);
  },
  'level-77-problem-3': lines => {
    const [a, b] = numbers(lines[0]);
    const gcd = (x, y) => y ? gcd(y, x % y) : x;
    const g = gcd(Math.abs(a), Math.abs(b));
    if (!b) return `${g} ${Math.sign(a)} 0`;
    const x = Array.from({ length: Math.abs(b) / g }, (_, i) => i).find(i => (g - a * i) % b === 0);
    return `${g} ${x} ${(g - a * x) / b}`;
  },
  'level-77-problem-4': lines => {
    const n = Number(lines[0]);
    let count = 0;
    // For x <= y, the equation bounds x to n+1 through 2*n.
    for (let x = n + 1; x <= 2 * n; x++) {
      const numerator = n * x, denominator = x - n;
      if (numerator % denominator === 0 && numerator / denominator >= x) count++;
    }
    return String(count);
  },
  'level-77-problem-5': lines => {
    const [lo, hi] = numbers(lines[0]);
    const primes = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
      .filter(x => x >= 2 && Array.from({ length: x - 2 }, (_, d) => d + 2).every(d => x % d !== 0));
    const gaps = primes.slice(1).map((p, i) => [primes[i], p, p - primes[i]]);
    gaps.sort((a, b) => b[2] - a[2] || a[0] - b[0]);
    return gaps.length ? gaps[0].join(' ') : 'NONE';
  },
  'level-78-problem-1': lines => {
    const [n, k] = numbers(lines[0]);
    const a = lines.slice(1, n + 1).map(numbers);
    let best = 0;
    for (let mask = 0; mask < 2 ** n; mask++) {
      const selected = a.filter((_, i) => mask & (1 << i));
      if (selected.every(([t]) => selected.filter(([l, r]) => l <= t && t < r).length <= k))
        best = Math.max(best, selected.length);
    }
    return String(best);
  },
  'level-78-problem-2': lines => {
    const n = Number(lines[0]);
    const a = lines.slice(1, n + 1).map(numbers);
    return String(Math.max(0, ...a.map(([t]) => a.filter(([l, r]) => l <= t && t < r).length)));
  },
  'level-78-problem-3': lines => {
    const [n, k] = numbers(lines[0]);
    const a = lines.slice(1, n + 1).map(numbers);
    return String(Array.from({ length: 2000 }, (_, i) => i - 1000)
      .filter(t => a.filter(([l, r]) => l <= t && t < r).length >= k).length);
  },
  'level-78-problem-4': lines => {
    const [n, l, r] = numbers(lines[0]);
    const a = lines.slice(1, n + 1).map(numbers);
    let best = Infinity;
    for (let mask = 0; mask < 2 ** n; mask++) {
      const selected = a.filter((_, i) => mask & (1 << i));
      if (Array.from({ length: r - l }, (_, i) => l + i)
        .every(t => selected.some(([s, e]) => s <= t && e >= t + 1)))
        best = Math.min(best, selected.length);
    }
    return String(best === Infinity ? -1 : best);
  },
  'level-78-problem-5': lines => {
    const [n, capacity] = numbers(lines[0]);
    const items = lines.slice(1, n + 1).map(numbers);
    let bestNum = 0, bestDen = 1;
    // Every optimum has at most one partially taken item.
    for (let mask = 0; mask < 2 ** n; mask++) {
      const chosen = items.filter((_, i) => mask & (1 << i));
      const weight = chosen.reduce((s, [w]) => s + w, 0);
      if (weight > capacity) continue;
      const value = chosen.reduce((s, [, v]) => s + v, 0);
      for (let i = 0; i <= n; i++) {
        if (i < n && (mask & (1 << i))) continue;
        const [w, v] = i === n ? [1, 0] : items[i];
        const num = value * w + Math.min(capacity - weight, w) * v;
        if (num * bestDen > bestNum * w) [bestNum, bestDen] = [num, w];
      }
    }
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const g = gcd(bestNum, bestDen);
    return `${bestNum / g} ${bestDen / g}`;
  },
  'level-79-problem-1': lines => {
    const s = lines[0], k = Number(lines[1]);
    let best = 0;
    for (let i = 0; i < s.length; i++) for (let j = i + 1; j <= s.length; j++) {
      const part = s.slice(i, j);
      if ([...new Set(part)].some(c => part.length - [...part].filter(x => x === c).length <= k))
        best = Math.max(best, part.length);
    }
    return String(best);
  },
  'level-79-problem-2': lines => {
    const a = numbers(lines[0]), k = Number(lines[1]);
    let count = 0;
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j <= a.length; j++)
      if (new Set(a.slice(i, j)).size <= k) count++;
    return String(count);
  },
  'level-79-problem-3': lines => String(Math.max(0, ...pairs(numbers(lines[0]))
    .filter(([x, y]) => x <= y).map(([, , i, j]) => j - i))),
  'level-79-problem-4': lines => {
    const a = numbers(lines[0]), k = Number(lines[1]);
    return a.slice(k - 1).map((_, i) => Math.max(...a.slice(i, i + k))).join(' ');
  },
  'level-79-problem-5': lines => {
    const a = numbers(lines[0]), limit = Number(lines[1]);
    let best = 0;
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j <= a.length; j++) {
      const part = a.slice(i, j);
      if (Math.max(...part) - Math.min(...part) <= limit) best = Math.max(best, part.length);
    }
    return String(best);
  },
  'level-80-problem-1': lines => {
    const a = numbers(lines[0]), days = Number(lines[1]);
    let best = Infinity;
    for (let mask = 0; mask < 2 ** (a.length - 1); mask++) {
      const groups = [[]];
      a.forEach((v, i) => {
        groups[groups.length - 1].push(v);
        if (i < a.length - 1 && (mask & (1 << i))) groups.push([]);
      });
      if (groups.length <= days)
        best = Math.min(best, Math.max(...groups.map(g => g.reduce((x, y) => x + y, 0))));
    }
    return String(best);
  },
  'level-80-problem-2': lines => {
    const a = numbers(lines[0]), h = Number(lines[1]);
    return String(Array.from({ length: Math.max(...a) }, (_, i) => i + 1)
      .find(rate => a.reduce((s, p) => s + Math.ceil(p / rate), 0) <= h));
  },
  'level-80-problem-3': lines => {
    const a = numbers(lines[0]), k = Number(lines[1]);
    let best = 0;
    for (let mask = 0; mask < 2 ** a.length; mask++) {
      const selected = a.filter((_, i) => mask & (1 << i));
      if (selected.length === k)
        best = Math.max(best, Math.min(...pairs(selected).map(([x, y]) => Math.abs(x - y))));
    }
    return String(best);
  },
  'level-80-problem-4': lines => {
    const a = numbers(lines[0]);
    return a.map((_, start) => {
      let current = start;
      for (let steps = 1; steps <= a.length; steps++) {
        current = a[current];
        if (current === start) return start;
      }
      return -1;
    }).filter(i => i !== -1).join(' ');
  },
  'level-80-problem-5': lines => {
    const a = numbers(lines[0]);
    const permute = values => values.length === 0 ? [[]] :
      values.flatMap((v, i) => permute(values.filter((_, j) => i !== j)).map(rest => [v, ...rest]));
    const sorted = [...a].sort((x, y) => x - y);
    return String(permute(sorted).findIndex(p => p.every((v, i) => v === a[i])) + 1);
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

describe('algorithm challenges, levels 76–80', () => {
  it('has complete metadata and eight distinct cases per challenge', () => {
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

  it('checks every expected output with an independent oracle', () => {
    for (const [id, p] of Object.entries(problems))
      for (const c of [...p.publicTestCases, ...p.hiddenTestCases])
        expect(answers[id](c.input.split('\n')), `${id}: ${c.input}`).toBe(c.output);
  });

  it('runs every reference case in Pyodide', async () => {
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
