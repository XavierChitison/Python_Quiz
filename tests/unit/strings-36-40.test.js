import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { strings3640Challenges } from '../../src/data/strings-36-40.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${36 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const lines = input => input.slice(0, -1).split('\n');
const words = text => text.trim() ? text.trim().split(/[ \t]+/) : [];
const palindrome = s => s === [...s].reverse().join('');
const substrings = s => Array.from({ length: s.length }, (_, start) =>
  Array.from({ length: s.length - start }, (_, offset) => ({ start, text: s.slice(start, start + offset + 1) }))).flat();
const longestFirst = entries => entries.sort((a, b) => b.text.length - a.text.length || a.start - b.start);

// Independent JavaScript oracles, using brute force where the references use windows.
const answers = {
  'level-36-problem-1': input => {
    const [s, k] = lines(input), alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return [...s].map(ch => alphabet.includes(ch) ? alphabet[(alphabet.indexOf(ch) + Number(k)) % 26] : ch).join('');
  },
  'level-36-problem-2': input => lines(input).slice(1).map(row => {
    const [ch, n] = row.split(' ');
    return ch.repeat(Number(n));
  }).join(''),
  'level-36-problem-3': input => (lines(input)[0].match(/(.)\1*/g) || []).map(run => run[0] + run.length).join(''),
  'level-36-problem-4': input => {
    const s = lines(input)[0], letters = [...s].filter(ch => /[a-z]/i.test(ch)).reverse();
    let index = 0;
    return [...s].map(ch => /[a-z]/i.test(ch) ? letters[index++] : ch).join('');
  },
  'level-36-problem-5': input => [...lines(input)[0]].map(ch =>
    /[a-z]/.test(ch) ? ch.toUpperCase() : /[A-Z]/.test(ch) ? ch.toLowerCase() : ch).join(''),
  'level-37-problem-1': input => {
    const s = lines(input)[0];
    const depths = [...s].map((_, i) => [...s.slice(0, i + 1)].reduce((d, ch) => d + (ch === '(' ? 1 : -1), 0));
    return depths.some(d => d < 0) || (depths.at(-1) || 0) !== 0 ? '-1' : String(Math.max(0, ...depths));
  },
  'level-37-problem-2': input => {
    const s = lines(input)[0];
    let depth = 0, start = 0, out = '';
    for (let i = 0; i < s.length; i++) {
      depth += s[i] === '(' ? 1 : -1;
      if (depth === 0) { out += s.slice(start + 1, i); start = i + 1; }
    }
    return out;
  },
  'level-37-problem-3': input => {
    const a = lines(input).slice(1), shortest = a.reduce((x, y) => x.length <= y.length ? x : y);
    for (let n = shortest.length; n >= 0; n--) if (a.every(w => w.startsWith(shortest.slice(0, n)))) return shortest.slice(0, n);
  },
  'level-37-problem-4': input => {
    const [a, b] = lines(input).map(s => s.split('.').map(Number));
    const diff = Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) - (b[i] || 0)).find(x => x !== 0) || 0;
    return String(Math.sign(diff));
  },
  'level-37-problem-5': input => /^[A-Za-z_][A-Za-z0-9_]*$/.test(lines(input)[0]) ? 'YES' : 'NO',
  'level-38-problem-1': input => words(lines(input)[0]).map(w => [...w].reverse().join('')).join(' '),
  'level-38-problem-2': input => words(lines(input)[0]).filter(palindrome).join(' '),
  'level-38-problem-3': input => {
    const [s, target] = lines(input);
    return String(words(s).filter(w => w === target).length);
  },
  'level-38-problem-4': input => words(lines(input)[0]).find(w =>
    new Set([...w.toLowerCase()].filter(ch => 'aeiou'.includes(ch))).size === 5) || '',
  'level-38-problem-5': input => {
    const [width, s] = lines(input);
    return words(s).reduce((out, word) => {
      if (!out.length || out[out.length - 1].length + 1 + word.length > Number(width)) out.push(word);
      else out[out.length - 1] += ' ' + word;
      return out;
    }, []).join('\n');
  },
  'level-39-problem-1': input => {
    const s = lines(input)[0];
    const lengths = Array.from({ length: Math.max(0, s.length - 1) }, (_, i) => {
      let n = 0;
      while (i + 1 + n < s.length && s[n] === s[i + 1 + n]) n++;
      return n;
    });
    return s.slice(0, Math.max(0, ...lengths));
  },
  'level-39-problem-2': input => {
    let [s, k] = lines(input);
    for (let i = 0; i < (s.length ? Number(k) % s.length : 0); i++) s = s.slice(1) + s[0];
    return s;
  },
  'level-39-problem-3': input => {
    const [a, b] = lines(input);
    if (a.length === b.length) return [...a].filter((ch, i) => ch !== b[i]).length === 1 ? 'YES' : 'NO';
    const shorter = a.length < b.length ? a : b, longer = a.length < b.length ? b : a;
    return longer.length === shorter.length + 1 && [...longer].some((_, i) => longer.slice(0, i) + longer.slice(i + 1) === shorter) ? 'YES' : 'NO';
  },
  'level-39-problem-4': input => String(Math.max(0, ...substrings(lines(input)[0]).filter(x => new Set(x.text).size === x.text.length).map(x => x.text.length))),
  'level-39-problem-5': input => {
    const [text, pattern, target] = lines(input);
    const matches = [...text].map((_, i) => i).filter(i => text.startsWith(pattern, i));
    matches.sort((a, b) => Math.abs(a - Number(target)) - Math.abs(b - Number(target)) || a - b);
    return String(matches.length ? matches[0] : -1);
  },
  'level-40-problem-1': input => BigInt(lines(input)[0]).toString(),
  'level-40-problem-2': input => {
    const [a, b] = lines(input);
    return (BigInt(a) + BigInt(b)).toString();
  },
  'level-40-problem-3': input => {
    const s = lines(input)[0], symbols = { I: 1, IV: 4, V: 5, IX: 9, X: 10, XL: 40, L: 50, XC: 90, C: 100, CD: 400, D: 500, CM: 900, M: 1000 };
    return String((s.match(/IV|IX|XL|XC|CD|CM|./g) || []).reduce((sum, token) => sum + symbols[token], 0));
  },
  'level-40-problem-4': input => {
    const s = lines(input)[0], fields = [];
    const pattern = /(?:"((?:[^"]|"")*)"|([^,]*))(?:,|$)/g;
    let match;
    while ((match = pattern.exec(s))) {
      fields.push(match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2]);
      if (pattern.lastIndex === s.length) {
        if (s.endsWith(',')) fields.push('');
        break;
      }
    }
    return JSON.stringify(fields);
  },
  'level-40-problem-5': input => longestFirst(substrings(lines(input)[0]).filter(x => palindrome(x.text)))[0]?.text || ''
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

describe('string challenges, levels 36–40', () => {
  it('exports complete metadata and eight distinct manual cases per ID', () => {
    expect(Object.keys(strings3640Challenges)).toEqual(ids);
    for (const [id, problem] of Object.entries(strings3640Challenges)) {
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
    for (const [id, problem] of Object.entries(strings3640Challenges)) {
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(answers[id](testCase.input), `${id}: ${JSON.stringify(testCase.input)}`).toBe(testCase.output);
      }
    }
  });

  it('executes all 200 reference cases in Pyodide', async () => {
    const cases = ids.flatMap(id => {
      const p = strings3640Challenges[id];
      return [...p.publicTestCases, ...p.hiddenTestCases].map(c => ({ id, ...c, source: p.referenceSolution }));
    });
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${JSON.stringify(testCase.input)}`;
      expect(results[i].error, label).toBeNull();
      expect(results[i].output.replace(/\n$/, ''), label).toBe(testCase.output);
    }
  });

  it('runs all starters on their inputs without exceptions or unsolicited output', async () => {
    const cases = ids.flatMap(id => {
      const p = strings3640Challenges[id];
      return [...p.publicTestCases, ...p.hiddenTestCases].map(c => ({ id, ...c, source: p.starterCode.stdin }));
    });
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${JSON.stringify(testCase.input)}`;
      expect(results[i].error, label).toBeNull();
      expect(results[i].output, label).toBe('');
    }
  });
});
