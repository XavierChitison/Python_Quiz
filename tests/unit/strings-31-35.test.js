import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { strings3135Challenges } from '../../src/data/strings-31-35.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${31 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const lines = input => input.split('\n');
const words = text => text.trim() ? text.trim().split(/\s+/) : [];
const counts = text => [...text].reduce((map, ch) => map.set(ch, (map.get(ch) || 0) + 1), new Map());
const answers = {
  'level-31-problem-1': input => String(lines(input)[0].codePointAt(0)),
  'level-31-problem-2': input => [...lines(input)[0]].reverse().join(''),
  'level-31-problem-3': input => [...lines(input)[0]].filter((_, i) => i % 2 === 0).join(''),
  'level-31-problem-4': input => lines(input)[0].match(/\[([^\]]*)\]/)[1],
  'level-31-problem-5': input => {
    const [text, k] = lines(input);
    return `${text.substring(0, Number(k))}\n${text.substring(Number(k))}`;
  },
  'level-32-problem-1': input => String((lines(input)[0].match(/[0-9]+/g) || []).length),
  'level-32-problem-2': input => /(?:[a-zA-Z]{2}|[0-9]{2})/.test(lines(input)[0]) ? 'NO' : 'YES',
  'level-32-problem-3': input => String((lines(input)[0].match(/[aeiou]/gi) || []).length),
  'level-32-problem-4': input => lines(input)[0].replace(/[0-9]/g, ''),
  'level-32-problem-5': input => [...lines(input)[0]].map((ch, i) => i % 2 ? ch.toLowerCase() : ch.toUpperCase()).join(''),
  'level-33-problem-1': input => String(words(lines(input)[0]).length),
  'level-33-problem-2': input => words(lines(input)[0]).reverse().join(' '),
  'level-33-problem-3': input => words(lines(input)[0]).reduce((best, word) => word.length > best.length ? word : best, ''),
  'level-33-problem-4': input => words(lines(input)[0]).map(word => word[0].toUpperCase() + word.slice(1)).join(' '),
  'level-33-problem-5': input => lines(input)[0].split('@')[1],
  'level-34-problem-1': input => {
    const text = lines(input)[0];
    return (text + text).slice(1, -1).includes(text) ? 'YES' : 'NO';
  },
  'level-34-problem-2': input => lines(input)[0].replace(/ +/g, ' '),
  'level-34-problem-3': input => {
    const [text, prefix] = lines(input);
    return text.indexOf(prefix) === 0 ? text.slice(prefix.length) : text;
  },
  'level-34-problem-4': input => {
    const [text, pattern, replacement] = lines(input);
    return text.replace(pattern, () => replacement);
  },
  'level-34-problem-5': input => {
    const [text, pattern] = lines(input);
    let count = 0, pos = -1;
    while ((pos = text.indexOf(pattern, pos + 1)) !== -1) count++;
    return String(count);
  },
  'level-35-problem-1': input => [...counts(lines(input)[0])]
    .sort(([a], [b]) => a.codePointAt(0) - b.codePointAt(0))
    .map(([ch, count]) => `${ch.codePointAt(0)} ${count}`).join('\n'),
  'level-35-problem-2': input => {
    const text = lines(input)[0];
    return [...text].find(ch => text.indexOf(ch) === text.lastIndexOf(ch)) ?? 'NONE';
  },
  'level-35-problem-3': input => {
    const [source, target] = lines(input), available = counts(source);
    return [...counts(target)].every(([ch, count]) => count <= (available.get(ch) || 0)) ? 'YES' : 'NO';
  },
  'level-35-problem-4': input => {
    const text = lines(input)[0];
    const gaps = [...text].flatMap((a, i) =>
      [...text].flatMap((b, j) => i < j && a === b ? [j - i] : []));
    return String(Math.max(-1, ...gaps));
  },
  'level-35-problem-5': input => {
    const [first, second] = lines(input);
    if (first.length !== second.length) return 'NO';
    for (let i = 0; i < first.length; i++) {
      for (let j = 0; j < first.length; j++) {
        if ((first[i] === first[j]) !== (second[i] === second[j])) return 'NO';
      }
    }
    return 'YES';
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

describe('string challenges, levels 31–35', () => {
  it('exports complete metadata and eight distinct manual cases per ID', () => {
    expect(Object.keys(strings3135Challenges)).toEqual(ids);
    for (const [id, problem] of Object.entries(strings3135Challenges)) {
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

  it('independently checks all expected outputs', () => {
    for (const [id, problem] of Object.entries(strings3135Challenges)) {
      expect(typeof answers[id], id).toBe('function');
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(answers[id](testCase.input), `${id}: ${JSON.stringify(testCase.input)}`).toBe(testCase.output);
      }
    }
  });

  it('executes all 200 reference cases in Pyodide', async () => {
    const cases = ids.flatMap(id => {
      const problem = strings3135Challenges[id];
      return [...problem.publicTestCases, ...problem.hiddenTestCases]
        .map(c => ({ id, ...c, source: problem.referenceSolution }));
    });
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [index, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${JSON.stringify(testCase.input)}`;
      expect(results[index].error, label).toBeNull();
      expect(results[index].output.replace(/\n$/, ''), label).toBe(testCase.output);
    }
  });

  it('compiles and runs every starter on all inputs without output', async () => {
    const cases = ids.flatMap(id => {
      const problem = strings3135Challenges[id];
      return [...problem.publicTestCases, ...problem.hiddenTestCases]
        .map(c => ({ id, ...c, source: problem.starterCode.stdin }));
    });
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [index, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${JSON.stringify(testCase.input)}`;
      expect(results[index].error, label).toBeNull();
      expect(results[index].output, label).toBe('');
    }
  });
});
