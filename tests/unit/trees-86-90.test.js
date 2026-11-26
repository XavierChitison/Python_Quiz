import { beforeAll, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { trees8690Challenges as challenges } from '../../src/data/trees-86-90.js';

const ids = Array.from({ length: 25 }, (_, i) =>
  `level-${86 + Math.floor(i / 5)}-problem-${1 + i % 5}`);

function readTree(lines, start = 0) {
  const n = Number(lines[start]);
  return [lines.slice(start + 1, start + 1 + n).map(line => line.split(' ').map(Number)), start + n + 1];
}

function paths(tree) {
  if (!tree.length) return [];
  const result = [], pending = [[0, []]];
  while (pending.length) {
    const [id, prefix] = pending.pop();
    const [value, left, right] = tree[id], path = [...prefix, value];
    if (left === -1 && right === -1) result.push(path);
    if (left !== -1) pending.push([left, path]);
    if (right !== -1) pending.push([right, path]);
  }
  return result;
}

function representation(tree) {
  if (!tree.length) return '#';
  const pending = [0], result = [];
  while (pending.length) {
    const i = pending.pop();
    if (i === -1) result.push('#');
    else {
      result.push(String(tree[i][0]));
      pending.push(tree[i][2], tree[i][1]);
    }
  }
  return result.join(',');
}

function diameter(tree) {
  const neighbors = tree.map(() => []);
  tree.forEach(([, left, right], i) => {
    for (const child of [left, right]) if (child !== -1) {
      neighbors[i].push(child);
      neighbors[child].push(i);
    }
  });
  let best = 0;
  for (let source = 0; source < tree.length; source++) {
    const queue = [[source, 0]], seen = new Set([source]);
    for (let k = 0; k < queue.length; k++) {
      const [node, distance] = queue[k];
      best = Math.max(best, distance);
      for (const next of neighbors[node]) if (!seen.has(next)) {
        seen.add(next);
        queue.push([next, distance + 1]);
      }
    }
  }
  return best;
}

function oracle(id, input) {
  if (id === 'level-90-problem-3') {
    const lines = input.trimEnd().split('\n'), n = Number(lines[0]);
    const prefixes = new Set();
    for (const word of lines.slice(1, n + 1)) {
      for (let i = 1; i <= word.length; i++) prefixes.add(word.slice(0, i));
    }
    return String(prefixes.size);
  }
  if (id === 'level-90-problem-4') {
    const lines = input.trimEnd().split('\n'), n = Number(lines[0]), words = lines.slice(1, n + 1);
    return words.map((word, i) => {
      for (let length = 1; length <= word.length; length++) {
        const prefix = word.slice(0, length);
        if (words.every((other, j) => i === j || !other.startsWith(prefix))) return prefix;
      }
      return 'NONE';
    }).join('\n');
  }
  if (id === 'level-90-problem-5') {
    const tokens = input.trim().split(' ');
    let cursor = 0;
    function atom() {
      const token = tokens[cursor++];
      if (token !== '(') return [token];
      const result = expression();
      cursor++;
      return result;
    }
    function product() {
      let out = atom();
      while (tokens[cursor] === '*' || tokens[cursor] === '//') {
        const op = tokens[cursor++];
        out = [...out, ...atom(), op];
      }
      return out;
    }
    function expression() {
      let out = product();
      while (tokens[cursor] === '+' || tokens[cursor] === '-') {
        const op = tokens[cursor++];
        out = [...out, ...product(), op];
      }
      return out;
    }
    return expression().join(' ');
  }
  if (id === 'level-89-problem-5') {
    const lines = input.split('\n'), n = Number(lines[0]);
    if (!n) return 'EMPTY';
    const pre = lines[1].split(' ').map(Number), ino = lines[2].split(' ').map(Number);
    const rows = pre.map(v => [v, -1, -1]), stack = [0];
    let cursor = 0;
    for (let i = 1; i < n; i++) {
      let parent = stack.at(-1), side = 1;
      while (stack.length && pre[stack.at(-1)] === ino[cursor]) {
        parent = stack.pop();
        cursor++;
        side = 2;
      }
      rows[parent][side] = i;
      stack.push(i);
    }
    return rows.map(row => row.join(' ')).join('\n');
  }
  const lines = input.trimEnd().split('\n');
  const [tree, next] = readTree(lines);
  switch (id) {
    case 'level-86-problem-1':
      return String(paths(tree).reduce((sum, path) => sum + BigInt(path.join('')), 0n));
    case 'level-86-problem-2':
      return String(tree.filter(([value, left, right]) => {
        const pending = [left, right], descendants = [];
        while (pending.length) {
          const i = pending.pop();
          if (i !== -1) {
            descendants.push(tree[i][0]);
            pending.push(tree[i][1], tree[i][2]);
          }
        }
        return value === descendants.reduce((sum, n) => sum + n, 0);
      }).length);
    case 'level-86-problem-3':
      return paths(tree).some(p => p.join(',') === [...p].reverse().join(',')) ? 'YES' : 'NO';
    case 'level-86-problem-4': {
      if (!tree.length) return 'EMPTY';
      const queue = [[0, 0]], levels = [];
      for (let k = 0; k < queue.length; k++) {
        const [i, depth] = queue[k], [value, left, right] = tree[i];
        (levels[depth] ??= []).push(value);
        if (left !== -1) queue.push([left, depth + 1]);
        if (right !== -1) queue.push([right, depth + 1]);
      }
      return levels.map(level => level.join(' ')).join('\n');
    }
    case 'level-86-problem-5':
      return String(tree.filter(([, l, r]) => l === -1 && r === -1).length);
    case 'level-87-problem-1':
      return String(Math.max(0, ...paths(tree).map(p => p.length)) - 1);
    case 'level-87-problem-2':
      return tree.length ? tree.map(([v, l, r]) => `${v} ${r} ${l}`).join('\n') : 'EMPTY';
    case 'level-87-problem-3':
      return representation(tree) === representation(readTree(lines, next)[0]) ? 'YES' : 'NO';
    case 'level-87-problem-4':
      return paths(tree).some(p => p.reduce((sum, n) => sum + n, 0) === Number(lines[next])) ? 'YES' : 'NO';
    case 'level-87-problem-5':
      return String(diameter(tree));
    case 'level-88-problem-1': {
      const [low, high] = lines[next].split(' ').map(Number);
      return String(tree.reduce((sum, [v]) => sum + (low <= v && v <= high ? v : 0), 0));
    }
    case 'level-88-problem-2': {
      const key = Number(lines[next]), n = tree.length;
      if (n) {
        const slots = [[0, -Infinity, Infinity]];
        for (const [i, low, high] of slots) {
          const [v, left, right] = tree[i];
          for (const [side, child, a, b] of [[1, left, low, v], [2, right, v, high]]) {
            if (child !== -1) slots.push([child, a, b]);
            else if (a < key && key < b) tree[i][side] = n;
          }
        }
      }
      tree.push([key, -1, -1]);
      return tree.map(row => row.join(' ')).join('\n');
    }
    case 'level-88-problem-3': {
      const stack = [], values = [];
      let node = tree.length ? 0 : -1;
      while (node !== -1 || stack.length) {
        while (node !== -1) {
          stack.push(node);
          node = tree[node][1];
        }
        node = stack.pop();
        values.push(tree[node][0]);
        node = tree[node][2];
      }
      return values.every((v, i) => i === 0 || values[i - 1] < v) ? 'YES' : 'NO';
    }
    case 'level-88-problem-4': {
      const target = representation(tree), keys = tree.map(row => row[0]);
      let matches = 0;
      function permutations(prefix, rest) {
        if (!rest.length) {
          const rebuilt = [];
          for (const key of prefix) {
            if (!rebuilt.length) rebuilt.push([key, -1, -1]);
            else {
              let i = 0;
              while (true) {
                const side = key < rebuilt[i][0] ? 1 : 2;
                if (rebuilt[i][side] === -1) {
                  rebuilt[i][side] = rebuilt.length;
                  rebuilt.push([key, -1, -1]);
                  break;
                }
                i = rebuilt[i][side];
              }
            }
          }
          if (representation(rebuilt) === target) matches++;
          return;
        }
        rest.forEach((v, i) => permutations([...prefix, v], [...rest.slice(0, i), ...rest.slice(i + 1)]));
      }
      permutations([], keys);
      return String(matches);
    }
    case 'level-88-problem-5': {
      if (!tree.length) return '0';
      let best = 0;
      const stack = [[0, []]];
      while (stack.length) {
        const [i, ancestors] = stack.pop(), [value, l, r] = tree[i];
        for (const a of ancestors) best = Math.max(best, Math.abs(a - value));
        if (l !== -1) stack.push([l, [...ancestors, value]]);
        if (r !== -1) stack.push([r, [...ancestors, value]]);
      }
      return String(best);
    }
    case 'level-89-problem-1': {
      if (!tree.length) return 'EMPTY';
      const entries = [], stack = [[0, 0, '']];
      while (stack.length) {
        const [i, col, route] = stack.pop(), [v, l, r] = tree[i];
        entries.push({ col, route, v });
        if (l !== -1) stack.push([l, col - 1, route + '0']);
        if (r !== -1) stack.push([r, col + 1, route + '1']);
      }
      entries.sort((a, b) => a.col - b.col || a.route.length - b.route.length || a.route.localeCompare(b.route));
      const groups = new Map();
      for (const e of entries) {
        if (!groups.has(e.col)) groups.set(e.col, []);
        groups.get(e.col).push(e.v);
      }
      return [...groups.values()].map(g => g.join(' ')).join('\n');
    }
    case 'level-89-problem-2': {
      if (!tree.length) return 'EMPTY';
      const visible = [], stack = [[0, 0]];
      while (stack.length) {
        const [i, depth] = stack.pop(), [value, left, right] = tree[i];
        if (visible[depth] === undefined) visible[depth] = value;
        if (left !== -1) stack.push([left, depth + 1]);
        if (right !== -1) stack.push([right, depth + 1]);
      }
      return visible.join(' ');
    }
    case 'level-89-problem-3': {
      function subtreeHeight(root) {
        if (root === -1) return -1;
        const queue = [[root, 0]];
        for (let k = 0; k < queue.length; k++) {
          const [i, depth] = queue[k];
          for (const child of tree[i].slice(1)) if (child !== -1) queue.push([child, depth + 1]);
        }
        return queue.at(-1)[1];
      }
      return tree.every(([, l, r]) => Math.abs(subtreeHeight(l) - subtreeHeight(r)) <= 1) ? 'YES' : 'NO';
    }
    case 'level-89-problem-4': {
      if (!tree.length) return 'NONE';
      const [a, b] = lines[next].split(' ').map(Number);
      const paths = [], stack = [[0, []]];
      while (stack.length) {
        const [i, parentPath] = stack.pop(), path = [...parentPath, i];
        if (i === a || i === b) paths.push(path);
        for (const child of tree[i].slice(1)) if (child !== -1) stack.push([child, path]);
      }
      if (a === b) return String(a);
      return String(paths[0].filter((v, i) => v === paths[1][i]).at(-1));
    }
    case 'level-90-problem-1': {
      let count = 0;
      for (let mask = 0; mask < 2 ** tree.length; mask++) {
        const valid = tree.every(([, l, r], i) => !(mask & (1 << i)) ||
          [l, r].every(child => child === -1 || !(mask & (1 << child))));
        if (valid) count++;
      }
      return String(count);
    }
    case 'level-90-problem-2': {
      if (!tree.length) return 'EMPTY';
      const neighbors = tree.map(() => []);
      tree.forEach(([, l, r], i) => {
        for (const child of [l, r]) if (child !== -1) {
          neighbors[i].push(child);
          neighbors[child].push(i);
        }
      });
      let best = -Infinity;
      tree.forEach(([value], start) => {
        const queue = [[start, -1, value]];
        for (let k = 0; k < queue.length; k++) {
          const [i, parent, total] = queue[k];
          best = Math.max(best, total);
          for (const child of neighbors[i]) if (child !== parent) {
            queue.push([child, i, total + tree[child][0]]);
          }
        }
      });
      return String(best);
    }
    default:
      throw new Error(`Missing oracle for ${id}`);
  }
}

let pyodide;
beforeAll(async () => {
  pyodide = await loadPyodide({ indexURL: fileURLToPath(new URL('../../node_modules/pyodide/', import.meta.url)) });
});

async function runPython(records) {
  const script = [
    'import io, json, sys',
    '_old_in, _old_out = sys.stdin, sys.stdout',
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
    '        sys.stdin, sys.stdout = _old_in, _old_out',
    'json.dumps(_results)'
  ].join('\n');
  return JSON.parse(await pyodide.runPythonAsync(script));
}

describe('tree challenges, levels 86–90', () => {
  it('has individually specified metadata and cases', () => {
    expect(Object.keys(challenges)).toEqual(ids);
    expect(new Set(ids.map(id => challenges[id].title)).size).toBe(ids.length);
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

  it('independently checks every expected answer', () => {
    for (const id of ids) for (const c of [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]) {
      expect(oracle(id, c.input), `${id}: ${c.input}`).toBe(c.output);
    }
  });

  it('runs every reference case in Pyodide', async () => {
    const cases = ids.flatMap(id => [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: challenges[id].referenceSolution })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output.replace(/\r\n/g, '\n').replace(/\n+$/, ''), `${c.id}: ${c.input}`).toBe(c.output);
    }
  });

  it('compiles and runs every starter with each case', async () => {
    const cases = ids.flatMap(id => [...challenges[id].publicTestCases, ...challenges[id].hiddenTestCases]
      .map(c => ({ id, ...c, source: challenges[id].starterCode.stdin })));
    const results = await runPython(cases.map(c => [c.source, c.input]));
    for (const [i, c] of cases.entries()) {
      expect(results[i].error, `${c.id}: ${c.input}`).toBeNull();
      expect(results[i].output, `${c.id}: ${c.input}`).toBe('');
    }
  });
});
