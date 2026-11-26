import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { loops2630Challenges } from '../../src/data/loops-26-30.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${26 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const tokens = input => input.trim().split(/\s+/);
const nums = input => tokens(input).map(Number);
const sequence = input => nums(input).slice(1);
const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
const prime = n => n >= 2 && Array.from({ length: Math.max(0, n - 2) }, (_, i) => i + 2).every(d => n % d !== 0);

// Round the exact binary float to nearest, ties to even, as Python formatting does.
function fixedEven(value, places) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0);
  const exponent = Number((bits >> 52n) & 0x7ffn);
  const fraction = bits & ((1n << 52n) - 1n);
  const mantissa = exponent === 0 ? fraction : (1n << 52n) + fraction;
  const shift = (exponent === 0 ? -1022 : exponent - 1023) - 52;
  let numerator = mantissa * 10n ** BigInt(places);
  let denominator = 1n;
  if (shift >= 0) numerator <<= BigInt(shift);
  else denominator <<= BigInt(-shift);
  let rounded = numerator / denominator;
  const remainder = numerator % denominator;
  if (2n * remainder > denominator || (2n * remainder === denominator && rounded % 2n === 1n)) rounded++;
  const digits = rounded.toString().padStart(places + 1, '0');
  return `${digits.slice(0, -places)}.${digits.slice(-places)}`;
}

// These calculations deliberately use different approaches from the Python references.
const answers = {
  'level-26-problem-1': input => {
    const [h, w, c] = tokens(input);
    return Array(Number(h)).fill(c.repeat(Number(w))).join('\n');
  },
  'level-26-problem-2': input => {
    const [n, c] = tokens(input);
    return Array.from({ length: Number(n) }, (_, i) => c.repeat(i + 1)).join('\n');
  },
  'level-26-problem-3': input => {
    const [hs, ws, c] = tokens(input);
    const h = Number(hs), w = Number(ws);
    const full = c.repeat(w);
    const middle = w <= 2 ? full : c + ' '.repeat(w - 2) + c;
    return Array.from({ length: h }, (_, i) => i === 0 || i === h - 1 ? full : middle).join('\n');
  },
  'level-26-problem-4': input => {
    const [h, w] = nums(input);
    return Array.from({ length: h }, (_, i) =>
      Array.from({ length: w }, (_, j) => (i + 1) * (j + 1)).join(' ')).join('\n');
  },
  'level-26-problem-5': input => {
    const [ns, c] = tokens(input), n = Number(ns);
    return Array.from({ length: n }, (_, i) => ' '.repeat(n - i - 1) + c.repeat(2 * i + 1)).join('\n');
  },
  'level-27-problem-1': input => {
    const values = sequence(input);
    return String(values.filter((value, i) => values.slice(0, i).every(previous => previous < value)).length);
  },
  'level-27-problem-2': input => {
    const a = sequence(input);
    return String(a.filter((v, i) => i > 0 && ((v < 0 && a[i - 1] > 0) || (v > 0 && a[i - 1] < 0))).length);
  },
  'level-27-problem-3': input => {
    const runs = sequence(input).reduce((groups, value) => {
      if (groups.length && groups[groups.length - 1][0] === value) groups[groups.length - 1].push(value);
      else groups.push([value]);
      return groups;
    }, []);
    return String(Math.max(...runs.map(run => run.length)));
  },
  'level-27-problem-4': input => {
    const a = sequence(input);
    return String(a.findIndex((value, i) => i > 0 && value < a[i - 1]));
  },
  'level-27-problem-5': input => {
    const a = sequence(input);
    return a.map((_, i) => Math.min(...a.slice(0, i + 1))).join(' ');
  },
  'level-28-problem-1': input => {
    const [n, tolerance] = nums(input), initial = Math.max(1, n);
    const steps = Math.max(0, Math.ceil(Math.log2(initial / tolerance)));
    const width = initial / 2 ** steps;
    const bucket = Math.min(2 ** steps - 1, Math.floor(Math.sqrt(n) / width));
    return fixedEven((bucket + 0.5) * width, 6);
  },
  'level-28-problem-2': input => String(tokens(input)[0].match(/0*$/)[0].length),
  'level-28-problem-3': input => Number(input).toString(2),
  'level-28-problem-4': input => String(parseInt(input.trim(), 2)),
  'level-28-problem-5': input => {
    const n = Number(input);
    return String(n === 0 ? 0 : 1 + (n - 1) % 9);
  },
  'level-29-problem-1': input => {
    const [low, high] = nums(input);
    return String(Array.from({ length: high - low + 1 }, (_, i) => low + i).filter(prime).length);
  },
  'level-29-problem-2': input => {
    const n = Number(input);
    const sum = Array.from({ length: n - 1 }, (_, i) => i + 1)
      .filter(d => n % d === 0).reduce((a, b) => a + b, 0);
    return sum === n ? 'YES' : 'NO';
  },
  'level-29-problem-3': input => {
    const [a, b] = nums(input);
    if (!a || !b) return '0';
    const step = Math.abs(a);
    let result = step;
    while (result % Math.abs(b) !== 0) result += step;
    return String(result);
  },
  'level-29-problem-4': input => {
    const s = input.trim();
    return s === [...s].reverse().join('') ? 'YES' : 'NO';
  },
  'level-29-problem-5': input => {
    const n = Number(input);
    return String(Array.from({ length: n }, (_, i) => i + 1).filter(x => gcd(x, n) === 1).length);
  },
  'level-30-problem-1': input => {
    const [amount, rate, periods] = nums(input);
    return fixedEven(amount * (1 + rate / 100) ** periods, 2);
  },
  'level-30-problem-2': input => {
    const [n, target, ...values] = nums(input);
    const lengths = values.slice(0, n).flatMap((_, start) =>
      values.slice(start).map((__, offset) => {
        const segment = values.slice(start, start + offset + 1);
        return segment.reduce((sum, value) => sum + value, 0) === target ? segment.length : 0;
      }));
    return String(Math.max(0, ...lengths));
  },
  'level-30-problem-3': input => {
    const [n, threshold, ...values] = nums(input);
    return String(values.slice(0, n).flatMap((a, i) =>
      values.slice(i + 1).filter(b => a + b < threshold)).length);
  },
  'level-30-problem-4': input => {
    const budget = Number(input);
    return String(Math.floor((Math.sqrt(1 + 8 * budget) - 1) / 2));
  },
  'level-30-problem-5': input => {
    const digits = input.trim();
    const index = [...digits].findIndex((digit, i) => digits.indexOf(digit) < i);
    return String(index < 0 ? -1 : index + 1);
  }
};

let pyodide;
beforeAll(async () => {
  pyodide = await loadPyodide({
    indexURL: fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url))
  });
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

describe('loop challenges, levels 26–30', () => {
  it('exports complete challenge metadata and eight distinct manual cases per ID', () => {
    expect(Object.keys(loops2630Challenges)).toEqual(ids);
    for (const [id, problem] of Object.entries(loops2630Challenges)) {
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      expect(cases, id).toHaveLength(8);
      expect(new Set(cases.map(c => c.input)).size, id).toBe(8);
      expect(problem.contentRevision, id).toBe(1);
      expect(problem.examples, id).toHaveLength(2);
      expect(problem.examples.every(e => e.explanation), id).toBe(true);
      expect(problem.hints, id).toHaveLength(5);
      expect(problem.constraints.length, id).toBeGreaterThan(0);
      expect(problem.inputFormat, id).toBeTruthy();
      expect(problem.outputFormat, id).toBeTruthy();
      expect(problem.starterCode.stdin, id).not.toBe(problem.referenceSolution);
    }
  });

  it('independently checks every expected output', () => {
    for (const [id, problem] of Object.entries(loops2630Challenges)) {
      expect(typeof answers[id], id).toBe('function');
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(answers[id](testCase.input), `${id}: ${JSON.stringify(testCase.input)}`).toBe(testCase.output);
      }
    }
  });

  it('runs all 200 reference cases in Pyodide with isolated globals', async () => {
    const cases = ids.flatMap(id => {
      const problem = loops2630Challenges[id];
      return [...problem.publicTestCases, ...problem.hiddenTestCases].map(c => ({ id, ...c, source: problem.referenceSolution }));
    });
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [index, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${JSON.stringify(testCase.input)}`;
      expect(results[index].error, label).toBeNull();
      expect(results[index].output.replace(/\n$/, ''), label).toBe(testCase.output);
    }
  });

  it('runs each starter against all eight inputs without exceptions or unsolicited output', async () => {
    const cases = ids.flatMap(id => {
      const problem = loops2630Challenges[id];
      return [...problem.publicTestCases, ...problem.hiddenTestCases].map(c => ({ id, ...c, source: problem.starterCode.stdin }));
    });
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [index, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${JSON.stringify(testCase.input)}`;
      expect(results[index].error, label).toBeNull();
      expect(results[index].output, label).toBe('');
    }
  });
});
