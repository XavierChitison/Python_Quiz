import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { lists4145Challenges } from '../../src/data/lists-41-45.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${41 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const lines = input => input.slice(0, -1).split('\n');
const list = line => line.trim() === '' ? [] : line.trim().split(/\s+/).map(Number);
const show = values => values.join(' ');
const answers = [
  input => String(list(lines(input)[0]).reduce((a, b) => a + b, 0)),
  input => { const a = list(lines(input)[0]).sort((x, y) => x - y); return `${a[a.length - 1]} ${a[0]}`; },
  input => { const a = list(lines(input)[0]); return show(a.filter((_, i) => i === Math.floor((a.length - 1) / 2) || i === Math.floor(a.length / 2))); },
  input => { const [a, t] = lines(input); return String(list(a).filter(x => x > Number(t)).length); },
  input => { const [a, bounds] = lines(input), [start, end] = list(bounds); return show(list(a).filter((_, i) => start <= i && i < end)); },
  input => show(list(lines(input)[0]).map(x => Math.max(0, x))),
  input => { const [a, divisor] = lines(input); return show(list(a).filter(x => x % Number(divisor) === 0)); },
  input => { const [a, b] = lines(input).map(list); return show(a.map((x, i) => x + b[i])); },
  input => { const [a, b] = lines(input).map(list); return String(a.filter((x, i) => x === b[i]).length); },
  input => { const [a, index] = lines(input); return show(list(a).filter((_, i) => i !== Number(index))); },
  input => { const [line, args] = lines(input), a = list(line), [index, value] = list(args); return show([...a.slice(0, index), value, ...a.slice(index)]); },
  input => { const a = list(lines(input)[0]); return show(a.map((_, value) => a.indexOf(value))); },
  input => { const a = list(lines(input)[0]); return show(a.map((x, i) => i % 2 ? a[i - 1] : (i + 1 < a.length ? a[i + 1] : x))); },
  input => { const a = list(lines(input)[0]); return show([...a.filter(x => x % 2 === 0), ...a.filter(x => x % 2 !== 0)]); },
  input => { const [a, p] = lines(input).map(list); return show(p.map(i => a[i])); },
  input => { const a = list(lines(input)[0]); return String(Math.abs(a.indexOf(Math.min(...a)) - a.indexOf(Math.max(...a)))); },
  input => { const [a, t] = lines(input); return show(list(a).flatMap((x, i) => x === Number(t) ? [i] : [])); },
  input => { const a = [...new Set(list(lines(input)[0]))].sort((x, y) => y - x); return a.length < 2 ? 'NONE' : String(a[1]); },
  input => { const a = list(lines(input)[0]); return String(a.filter((x, i) => i > 0 && i < a.length - 1 && x === a[i - 1] + a[i + 1]).length); },
  input => { const a = list(lines(input)[0]); return String(a.filter((x, i) => i > 0 && i < a.length - 1 && x > a[i - 1] && x > a[i + 1]).length); },
  input => show([...new Set(list(lines(input)[0]))]),
  input => show(lines(input).flatMap(list).sort((a, b) => a - b)),
  input => {
    const [a, b] = lines(input).map(list);
    const remaining = [...b];
    return show(a.filter(x => {
      const index = remaining.indexOf(x);
      if (index < 0) return false;
      remaining.splice(index, 1);
      return true;
    }));
  },
  input => { const [a, value] = lines(input); return show([...list(a), Number(value)].sort((x, y) => x - y)); },
  input => show(list(lines(input)[0]).map(x => x * x).sort((a, b) => a - b))
];

let pyodide;
beforeAll(async () => {
  pyodide = await loadPyodide({ indexURL: fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url)) });
});

describe('list challenges, levels 41–45', () => {
  it('provides complete metadata and eight distinct manual cases per challenge', () => {
    expect(Object.keys(lists4145Challenges)).toEqual(ids);
    for (const [id, problem] of Object.entries(lists4145Challenges)) {
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      expect(cases, id).toHaveLength(8);
      expect(new Set(cases.map(c => c.input)).size, id).toBe(8);
      expect(problem.contentRevision, id).toBe(1);
      expect(problem.examples, id).toHaveLength(2);
      expect(problem.examples.every(example => example.explanation), id).toBe(true);
      expect(problem.examples.map(({ input, output }) => ({ input, output })), id).toEqual(cases.slice(0, 2));
      expect(problem.hints, id).toHaveLength(5);
      expect(problem.hints.every(hint => hint.trim()), id).toBe(true);
      expect(problem.inputFormat, id).toBeTruthy();
      expect(problem.outputFormat, id).toBeTruthy();
      expect(problem.constraints.length, id).toBeGreaterThan(0);
      expect(problem.starterCode.stdin, id).not.toBe(problem.referenceSolution);
    }
  });

  it('independently checks every specified expected output', () => {
    ids.forEach((id, i) => {
      const problem = lists4145Challenges[id];
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(answers[i](testCase.input), `${id}: ${JSON.stringify(testCase.input)}`).toBe(testCase.output);
      }
    });
  });

  it('runs all 200 reference cases in Pyodide and compiles all starters', async () => {
    const records = ids.flatMap(id => {
      const problem = lists4145Challenges[id];
      return [...problem.publicTestCases, ...problem.hiddenTestCases].map(testCase =>
        ({ id, source: problem.referenceSolution, input: testCase.input, expected: testCase.output }));
    });
    const starters = ids.map(id => ({ id, source: lists4145Challenges[id].starterCode.stdin }));
    pyodide.globals.set('_records_json', JSON.stringify(records));
    pyodide.globals.set('_starters_json', JSON.stringify(starters));
    const result = JSON.parse(await pyodide.runPythonAsync([
      'import io, json, sys',
      '_failures = []',
      'for _item in json.loads(_starters_json):',
      '    try:',
      '        compile(_item["source"], _item["id"], "exec")',
      '    except Exception as _error:',
      '        _failures.append(_item["id"] + " starter: " + repr(_error))',
      '_stdin, _stdout = sys.stdin, sys.stdout',
      'for _item in json.loads(_records_json):',
      '    _capture = io.StringIO()',
      '    try:',
      '        sys.stdin, sys.stdout = io.StringIO(_item["input"]), _capture',
      '        exec(compile(_item["source"], _item["id"], "exec"), {"__name__": "__main__"})',
      '        if _capture.getvalue() != _item["expected"] + "\\n":',
      '            _failures.append(_item["id"] + " input " + repr(_item["input"]) + " got " + repr(_capture.getvalue()))',
      '    except Exception as _error:',
      '        _failures.append(_item["id"] + " input " + repr(_item["input"]) + ": " + repr(_error))',
      '    finally:',
      '        sys.stdin, sys.stdout = _stdin, _stdout',
      'json.dumps(_failures)'
    ].join('\n')));
    expect(result).toEqual([]);
  }, 60000);
});
