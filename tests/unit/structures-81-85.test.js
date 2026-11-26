import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { structures8185Challenges as challenges } from '../../src/data/structures-81-85.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${81 + Math.floor(i / 5)}-problem-${1 + i % 5}`);
const nums = line => line.trim() ? line.trim().split(/\s+/).map(Number) : [];
const lines = input => input.slice(0, -1).split('\n');

function hanoi(input) {
  const [raw, from, to] = input.trim().split(' ');
  const n = Number(raw), start = from.repeat(n), target = to.repeat(n);
  const queue = [[start, []]], seen = new Set([start]);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const [state, path] = queue[cursor];
    if (state === target) return path.join('\n');
    for (const a of 'ABC') for (const b of 'ABC') {
      if (a === b) continue;
      const disk = state.indexOf(a), other = state.indexOf(b);
      if (disk < 0 || (other >= 0 && other < disk)) continue;
      const next = state.slice(0, disk) + b + state.slice(disk + 1);
      if (!seen.has(next)) {
        seen.add(next);
        queue.push([next, [...path, `${a} ${b}`]]);
      }
    }
  }
  throw new Error('No Hanoi solution');
}

function commands(input, pushName, takeName, peekName) {
  let items = [], out = [];
  for (const line of lines(input).slice(1)) {
    const [op, val] = line.split(' ');
    if (op === pushName) items = [...items, val];
    else if (!items.length) out.push('EMPTY');
    else if (op === peekName) out.push(pushName === 'push' ? items.at(-1) : items[0]);
    else if (op === takeName) {
      out.push(pushName === 'push' ? items.at(-1) : items[0]);
      items = pushName === 'push' ? items.slice(0, -1) : items.slice(1);
    }
  }
  return out.join('\n');
}

function decode(text) {
  let i = 0;
  function section() {
    let result = '';
    while (i < text.length && text[i] !== ']') {
      if (/[0-9]/.test(text[i])) {
        let digits = '';
        while (/[0-9]/.test(text[i] ?? '')) digits += text[i++];
        i++; // [
        const inner = section();
        i++; // ]
        result += inner.repeat(Number(digits));
      } else result += text[i++];
    }
    return result;
  }
  return section();
}

function minimumDigits(s, k) {
  const candidates = [];
  function choose(i, remaining, value) {
    if (i === s.length) {
      if (!remaining) candidates.push(value.replace(/^0+/, '') || '0');
      return;
    }
    if (remaining) choose(i + 1, remaining - 1, value);
    choose(i + 1, remaining, value + s[i]);
  }
  choose(0, k, '');
  return candidates.sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
}

const oracles = {
  'level-81-problem-1': input => String([...input.trim()].reverse().filter((d, i) => Number(d) === i).length),
  'level-81-problem-2': input => {
    const [a, r, n] = nums(input);
    return String(Array.from({ length: n }, (_, i) => BigInt(a) * BigInt(r) ** BigInt(i)).reduce((x, y) => x + y, 0n));
  },
  'level-81-problem-3': input => {
    const [candidate, text] = lines(input);
    let pos = 0;
    for (const c of text) if (c === candidate[pos]) pos++;
    return pos === candidate.length ? 'YES' : 'NO';
  },
  'level-81-problem-4': input => input.trim().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  'level-81-problem-5': input => {
    const n = Number(input), dp = [1];
    for (let i = 1; i <= n; i++) dp[i] = dp[i - 1] + (i % 2 ? 0 : dp[i / 2]);
    return String(dp[n]);
  },
  'level-82-problem-1': input => String((input.match(/-?\d+/g) ?? []).reduce((s, x) => s + Number(x), 0)),
  'level-82-problem-2': input => JSON.stringify(JSON.parse(input, (_, value) =>
    Array.isArray(value) ? value.filter(child => !Array.isArray(child) || child.length > 0) : value)),
  'level-82-problem-3': input => (input.match(/-?\d+/g) ?? []).join(' '),
  'level-82-problem-4': hanoi,
  'level-82-problem-5': input => {
    const [n, k] = nums(input);
    if (k > n - k + 1) return '0';
    // Place k ones into the n-k+1 gaps around the zeros.
    let ways = 1n;
    for (let i = 1; i <= k; i++) ways = ways * BigInt(n - k + 2 - i) / BigInt(i);
    return String(ways);
  },
  'level-83-problem-1': input => commands(input, 'push', 'pop', 'peek'),
  'level-83-problem-2': input => {
    let text = input.trimEnd().replace(/[^()[\]{}]/g, ''), previous;
    do {
      previous = text;
      text = text.replace(/\(\)|\[\]|\{\}/g, '');
    } while (text !== previous);
    return text ? 'NO' : 'YES';
  },
  'level-83-problem-3': input => {
    const tokens = input.trim().split(' ');
    function evaluate() {
      const token = tokens.pop();
      if (!['+', '-', '*', '//'].includes(token)) return Number(token);
      const right = evaluate(), left = evaluate();
      if (token === '+') return left + right;
      if (token === '-') return left - right;
      if (token === '*') return left * right;
      return Math.floor(left / right);
    }
    return String(evaluate());
  },
  'level-83-problem-4': input => {
    const pieces = [];
    for (const line of lines(input).slice(1)) {
      if (line === 'undo') pieces.splice(-1, 1);
      else pieces.push(line.slice(7));
    }
    return pieces.join('');
  },
  'level-83-problem-5': input => {
    const parts = input.trim().split('/').filter(x => x && x !== '.');
    for (let i = 0; i < parts.length;) {
      if (parts[i] === '..') {
        const start = Math.max(0, i - 1);
        parts.splice(start, i - start + 1);
        i = start;
      } else i++;
    }
    return '/' + parts.join('/');
  },
  'level-84-problem-1': input => {
    const a = nums(input);
    return a.map((v, i) => a.slice(i + 1).find(x => x > v) ?? 'NONE').join(' ');
  },
  'level-84-problem-2': input => decode(lines(input)[0]),
  'level-84-problem-3': input => {
    const a = nums(input);
    return a.map((v, i) => {
      let j = i - 1;
      while (j >= 0 && a[j] <= v) j--;
      return i - j;
    }).join(' ');
  },
  'level-84-problem-4': input => {
    const a = nums(input);
    let best = 0;
    for (let i = 0; i < a.length; i++) for (let j = i; j < a.length; j++)
      best = Math.max(best, Math.min(...a.slice(i, j + 1)) * (j - i + 1));
    return String(best);
  },
  'level-84-problem-5': input => {
    const [s, k] = lines(input);
    return minimumDigits(s, Number(k));
  },
  'level-85-problem-1': input => commands(input, 'enqueue', 'dequeue', 'front'),
  'level-85-problem-2': input => {
    const work = nums(input);
    return work.map((t, i) => work.reduce((s, x, j) =>
      s + Math.min(x, t - 1) + (j <= i && x >= t ? 1 : 0), 0)).join(' ');
  },
  'level-85-problem-3': input => {
    const [line, raw] = lines(input), a = nums(line), k = Number(raw);
    return [...a.slice(0, k).reverse(), ...a.slice(k)].join(' ');
  },
  'level-85-problem-4': input => {
    const [n, k] = nums(input);
    let survivor = 0;
    for (let size = 2; size <= n; size++) survivor = (survivor + k) % size;
    return String(survivor + 1);
  },
  'level-85-problem-5': input => [...lines(input)[0]].map((_, i, a) => {
    const prefix = a.slice(0, i + 1);
    return prefix.find(c => prefix.filter(x => x === c).length === 1) ?? '#';
  }).join(' ')
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

describe('recursion, stack and queue challenges, levels 81–85', () => {
  it('exports complete, distinct metadata and eight cases per challenge', () => {
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

  it('checks every manually specified answer with independent oracles', () => {
    for (const id of ids) for (const c of [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]) {
      expect(oracles[id](c.input), `${id}: ${c.input}`).toBe(c.output);
    }
  });

  it('executes all 200 reference cases in Pyodide', async () => {
    const cases = ids.flatMap(id => [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: challenges[id].referenceSolution })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output.replace(/\r\n/g, '\n').replace(/\n+$/, ''), `${c.id}: ${c.input}`).toBe(c.output);
    }
  });

  it('handles representative constraint boundaries', async () => {
    const checks = [
      ['level-81-problem-3', `${'a'.repeat(100)}\n${'a'.repeat(100)}\n`, 'YES'],
      ['level-81-problem-5', '100\n', oracles['level-81-problem-5']('100\n')],
      ['level-82-problem-2', `${'['.repeat(30)}0${']'.repeat(30)}\n`, `${'['.repeat(30)}0${']'.repeat(30)}`],
      ['level-82-problem-2', `${'['.repeat(30)}${']'.repeat(30)}\n`, '[]'],
      ['level-82-problem-5', '50 17\n', oracles['level-82-problem-5']('50 17\n')],
      ['level-84-problem-2', '20[20[20[a]]]x\n', `${'a'.repeat(8000)}x`],
      ['level-84-problem-4', `${Array(1000).fill(10000).join(' ')}\n`, '10000000'],
      ['level-84-problem-5', `${'9'.repeat(1000)}\n999\n`, '9'],
      ['level-85-problem-2', `${Array(100).fill(100).join(' ')}\n`, Array.from({ length: 100 }, (_, i) => 9901 + i).join(' ')],
      ['level-85-problem-4', '100 1000\n', oracles['level-85-problem-4']('100 1000\n')]
    ];
    const results = await runPython(checks.map(([id, input]) => [challenges[id].referenceSolution, input]));
    for (const [i, [id, , expected]] of checks.entries()) {
      expect(results[i].error, id).toBeNull();
      expect(results[i].output.replace(/\r\n/g, '\n').replace(/\n+$/, ''), id).toBe(expected);
    }
  });

  it('compiles and runs each starter for all its cases', async () => {
    const cases = ids.flatMap(id => [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: challenges[id].starterCode.stdin })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output, `${c.id}: ${c.input}`).toBe('');
    }
  });
});
