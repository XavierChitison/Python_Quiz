import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { collections5155Challenges as challenges } from '../../src/data/collections-51-55.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${51 + Math.floor(i / 5)}-problem-${i % 5 + 1}`);
const numeric = line => line.trim() ? line.trim().split(/\s+/).map(Number) : [];
const tokens = line => line.trim() ? line.trim().split(/\s+/) : [];
const sortedNumbers = values => values.slice().sort((a, b) => a - b);
const lines = input => input.replace(/\n$/, '').split('\n');
const readRecords = (inputLines, start = 0) => {
  const count = Number(inputLines[start]);
  return [inputLines.slice(start + 1, start + count + 1).map(tokens), start + count + 1];
};
const renderMap = rows => {
  const ordered = rows.slice().sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
  return [String(ordered.length), ...ordered.map(row => row.join(' '))].join('\n');
};
const list = values => values.join(' ');
const yn = condition => condition ? 'YES' : 'NO';

// These oracles use direct scans and record arrays, independently of the
// dictionary/set and nested-tree algorithms in the reference solutions.
const answers = {
  'level-51-problem-1': input => {
    const data = lines(input); const [rows, next] = readRecords(data);
    const [key, fallback] = tokens(data[next]);
    return String(Number((rows.find(row => row[0] === key) || ['', fallback])[1]));
  },
  'level-51-problem-2': input => {
    const [rows] = readRecords(lines(input));
    return renderMap(rows.filter((row, i) => !rows.slice(i + 1).some(later => later[0] === row[0])));
  },
  'level-51-problem-3': input => {
    const data = lines(input); const [rows, next] = readRecords(data);
    return renderMap(rows.filter(row => row[0] !== data[next]));
  },
  'level-51-problem-4': input => {
    const data = lines(input); const [rows, next] = readRecords(data);
    const [a, b] = tokens(data[next]);
    const left = rows.find(row => row[0] === a); const right = rows.find(row => row[0] === b);
    if (left && right) {
      const old = left[1]; left[1] = right[1]; right[1] = old;
    }
    return renderMap(rows);
  },
  'level-51-problem-5': input => {
    const data = lines(input); const [rows, next] = readRecords(data);
    return data.slice(next + 1, next + 1 + Number(data[next])).map(key => {
      const row = rows.find(entry => entry[0] === key);
      return !row ? 'ABSENT' : row[1] === 'null' ? 'NULL' : 'VALUE';
    }).join('\n');
  },
  'level-52-problem-1': input => {
    const words = tokens(lines(input)[0]);
    const unique = words.filter((word, i) => words.indexOf(word) === i).sort();
    return [String(unique.length), ...unique.map(word =>
      [word, ...words.flatMap((w, i) => w === word ? [i] : [])].join(' '))].join('\n');
  },
  'level-52-problem-2': input => {
    const data = lines(input); const values = numeric(data[0]); const k = Number(data[1]);
    return yn(values.some((value, i) => values.some((other, j) => i < j && j - i <= k && value === other)));
  },
  'level-52-problem-3': input => {
    const values = numeric(lines(input)[0]);
    return String(values.filter((value, i) => values.indexOf(value) === i).length);
  },
  'level-52-problem-4': input => {
    const values = numeric(lines(input)[0]);
    let best = values.length;
    for (let mask = 0; mask < 2 ** values.length; mask++) {
      const kept = values.filter((_, i) => mask & (2 ** i));
      const frequencies = kept.map(value => kept.filter(other => other === value).length);
      if (frequencies.every(count => count === frequencies[0])) best = Math.min(best, values.length - kept.length);
    }
    return String(best);
  },
  'level-52-problem-5': input => {
    const values = numeric(lines(input)[0]);
    return String(sortedNumbers(values).sort((a, b) =>
      values.filter(x => x === b).length - values.filter(x => x === a).length || a - b)[0]);
  },
  'level-53-problem-1': input => {
    const data = lines(input); const all = [...numeric(data[0]), ...numeric(data[1])];
    return list(sortedNumbers(all.filter((x, i) => all.indexOf(x) === i)));
  },
  'level-53-problem-2': input => {
    const data = lines(input); const required = numeric(data[0]); const stream = numeric(data[1]);
    for (let length = 0; length <= stream.length; length++) {
      if (required.every(value => stream.slice(0, length).includes(value))) return String(length);
    }
    return '-1';
  },
  'level-53-problem-3': input => {
    const points = numeric(lines(input)[0]); const midpoints = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i] !== points[j]) midpoints.push((points[i] + points[j]) / 2);
      }
    }
    return String(midpoints.filter((value, i) => midpoints.indexOf(value) === i).length);
  },
  'level-53-problem-4': input => {
    const data = lines(input); const [n, k] = numeric(data[0]);
    const groups = data.slice(1, n + 1).map(numeric); const all = groups.flat();
    return list(sortedNumbers(all.filter((value, i) => all.indexOf(value) === i &&
      groups.filter(group => group.includes(value)).length >= k)));
  },
  'level-53-problem-5': input => {
    const [x, a, b, m] = numeric(lines(input)[0]);
    const next = value => (a * value + b) % m;
    let slow = next(x), fast = next(next(x));
    while (slow !== fast) { slow = next(slow); fast = next(next(fast)); }
    let prefix = 0; slow = x;
    while (slow !== fast) { slow = next(slow); fast = next(fast); prefix++; }
    let cycle = 1; fast = next(slow);
    while (slow !== fast) { fast = next(fast); cycle++; }
    return `${prefix} ${cycle}`;
  },
  'level-54-problem-1': input => {
    const data = lines(input); const [raw, next] = readRecords(data);
    const [px, py] = numeric(data[next]);
    const points = raw.map(row => row.map(Number)).map(([x, y]) => [px + py - y, py + x - px]);
    const unique = points.filter((point, i) => !points.slice(0, i)
      .some(other => other[0] === point[0] && other[1] === point[1]));
    unique.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    return [String(unique.length), ...unique.map(point => point.join(' '))].join('\n');
  },
  'level-54-problem-2': input => {
    const [rows] = readRecords(lines(input));
    return rows.sort((a, b) => Number(b[1]) - Number(a[1]) || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
      .map(row => row.join(' ')).join('\n');
  },
  'level-54-problem-3': input => {
    const [rows] = readRecords(lines(input));
    const keys = rows.map(row => row[0]).filter((key, i, all) => all.indexOf(key) === i).sort();
    return [String(keys.length), ...keys.map(key =>
      [key, ...rows.filter(row => row[0] === key).map(row => row[1])].join(' '))].join('\n');
  },
  'level-54-problem-4': input => {
    const [raw] = readRecords(lines(input)); const rows = raw.map(row => row.map(Number));
    const same = (a, b) => a[0] === b[0] && a[1] === b[1];
    const distinct = rows.filter((row, i) => !rows.slice(0, i).some(other => same(row, other)));
    return String(distinct.filter(point => !distinct.some(other =>
      Math.abs(other[0] - point[0]) + Math.abs(other[1] - point[1]) === 1)).length);
  },
  'level-54-problem-5': input => {
    const data = lines(input); const [a, next] = readRecords(data); const [b] = readRecords(data, next);
    return list(a.filter(row => b.some(other => row[0] === other[0] && Number(row[1]) === Number(other[1])))
      .map(row => row[0]).sort());
  },
  'level-55-problem-1': input => {
    const data = lines(input); const [a, next] = readRecords(data); const [b] = readRecords(data, next);
    const keys = [...a, ...b].map(row => row[0]).filter((key, i, all) => all.indexOf(key) === i);
    return renderMap(keys.map(key => [key, [...a, ...b].filter(row => row[0] === key)
      .reduce((sum, row) => sum + Number(row[1]), 0)]));
  },
  'level-55-problem-2': input => {
    const [rows] = readRecords(lines(input));
    const maximum = Math.max(...rows.map(row => Number(row[1])));
    return rows.filter(row => Number(row[1]) === maximum).map(row => row[0]).sort()[0];
  },
  'level-55-problem-3': input => {
    const data = lines(input); const [rows, next] = readRecords(data);
    return renderMap(rows.filter(row => Number(row[1]) >= Number(data[next])));
  },
  'level-55-problem-4': input => {
    const data = lines(input); const [a, next] = readRecords(data); const [b] = readRecords(data, next);
    return renderMap(a.flatMap(row => {
      const match = b.find(other => other[0] === row[0]);
      return match ? [[row[0], row[1], match[1]]] : [];
    }));
  },
  'level-55-problem-5': input => {
    const data = lines(input); const [rows, next] = readRecords(data);
    const query = data[next];
    const leaf = rows.find(row => row[0] === query);
    if (leaf) return String(Number(leaf[1]));
    return rows.some(row => row[0].startsWith(`${query}/`)) ? 'MAP' : 'MISSING';
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

describe('dictionary and set challenges, levels 51–55', () => {
  it('exports complete metadata and distinct cases for every ID', () => {
    expect(Object.keys(challenges)).toEqual(ids);
    for (const [id, problem] of Object.entries(challenges)) {
      const cases = [...problem.publicTestCases, ...problem.hiddenTestCases];
      const expectedCount = id === 'level-53-problem-2' ? 9 : 8;
      expect(cases, id).toHaveLength(expectedCount);
      expect(new Set(cases.map(c => c.input)).size, id).toBe(expectedCount);
      expect(problem.contentRevision, id).toBe(1);
      expect(problem.examples, id).toHaveLength(2);
      expect(problem.examples.every(example => example.explanation), id).toBe(true);
      expect(problem.hints, id).toHaveLength(5);
      expect(new Set(problem.hints).size, id).toBe(5);
      expect(problem.constraints.length, id).toBeGreaterThan(0);
      expect(problem.inputFormat, id).toBeTruthy();
      expect(problem.outputFormat, id).toBeTruthy();
      expect(problem.starterCode.stdin, id).not.toBe(problem.referenceSolution);
    }
  });

  it('checks all expected outputs with independent oracles', () => {
    expect(Object.keys(answers)).toEqual(ids);
    for (const [id, problem] of Object.entries(challenges)) {
      for (const testCase of [...problem.publicTestCases, ...problem.hiddenTestCases]) {
        expect(answers[id](testCase.input), `${id}: ${testCase.input}`).toBe(testCase.output);
      }
    }
  });

  it('executes all reference cases in Pyodide', async () => {
    const cases = ids.flatMap(id => [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]
      .map(testCase => ({ id, ...testCase, source: challenges[id].referenceSolution })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${testCase.input}`;
      expect(results[i].error, label).toBeNull();
      expect(results[i].output.replace(/\n$/, ''), label).toBe(testCase.output);
    }
  });

  it('compiles and runs every starter on every case', async () => {
    const cases = ids.flatMap(id => [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]
      .map(testCase => ({ id, ...testCase, source: challenges[id].starterCode.stdin })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, testCase] of cases.entries()) {
      const label = `${testCase.id}: ${testCase.input}`;
      expect(results[i].error, label).toBeNull();
      expect(results[i].output, label).toBe('');
    }
  });
});
