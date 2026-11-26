import { pathToFileURL } from 'node:url';
import { loadPyodide } from 'pyodide';
import { problems } from '../src/data/curriculum.js';

function repeatedGroups(items, keyFor) {
  const groups = new Map();
  for (const problem of items) {
    const key = keyFor(problem);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(problem.id);
  }
  return [...groups.values()].filter(group => group.length > 1);
}

export async function auditProblems(items, fingerprint) {
  const fingerprintCache = new Map();
  for (const problem of items) {
    if (!fingerprintCache.has(problem.referenceSolution)) {
      fingerprintCache.set(problem.referenceSolution, await fingerprint(problem.referenceSolution));
    }
  }
  return {
    count: items.length,
    duplicateIds: repeatedGroups(items, problem => problem.id),
    duplicateTitles: repeatedGroups(items, problem => problem.title.trim().toLowerCase()),
    duplicateDescriptions: repeatedGroups(items, problem => problem.description.trim()),
    identicalSolutions: repeatedGroups(items, problem => problem.referenceSolution),
    similarSolutions: repeatedGroups(items, problem => fingerprintCache.get(problem.referenceSolution)),
    identicalCases: repeatedGroups(items, problem => JSON.stringify(
      [...problem.publicTestCases, ...problem.hiddenTestCases]
        .map(test => [test.input, test.output])
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
    )),
    fewerThanTwoExamples: items.filter(problem => problem.examples.length < 2).map(problem => problem.id),
    fewerThanSixTests: items.filter(problem => problem.publicTestCases.length < 2 ||
      problem.publicTestCases.length + problem.hiddenTestCases.length < 6).map(problem => problem.id)
  };
}

export async function createFingerprinter() {
  const python = await loadPyodide();
  await python.runPythonAsync(`
import ast
import builtins

class Normalize(ast.NodeTransformer):
    def __init__(self):
        self.names = {}

    def name(self, value):
        if value in dir(builtins):
            return value
        if value not in self.names:
            self.names[value] = "variable_" + str(len(self.names))
        return self.names[value]

    def visit_Name(self, node):
        node.id = self.name(node.id)
        return node

    def visit_arg(self, node):
        node.arg = self.name(node.arg)
        return self.generic_visit(node)

    def visit_FunctionDef(self, node):
        node.name = self.name(node.name)
        return self.generic_visit(node)

    def visit_AsyncFunctionDef(self, node):
        node.name = self.name(node.name)
        return self.generic_visit(node)

    def visit_Constant(self, node):
        node.value = type(node.value).__name__
        return node

def fingerprint(source):
    return ast.dump(Normalize().visit(ast.parse(source)), include_attributes=False)
`);
  const fingerprint = python.globals.get('fingerprint');
  return {
    fingerprint: source => fingerprint(source),
    dispose: () => fingerprint.destroy()
  };
}

async function main() {
  const normalizer = await createFingerprinter();
  let audit;
  try {
    audit = await auditProblems(problems, normalizer.fingerprint);
  } finally {
    normalizer.dispose();
  }
  console.log(`Audited ${audit.count} problem records.`);
  for (const [label, groups] of [
    ['Duplicate IDs', audit.duplicateIds],
    ['Duplicate titles', audit.duplicateTitles],
    ['Identical descriptions', audit.duplicateDescriptions],
    ['Identical reference solutions', audit.identicalSolutions],
    ['Normalized AST candidates', audit.similarSolutions],
    ['Identical test-case collections', audit.identicalCases]
  ]) {
    console.log(`\n${label}: ${groups.length} groups, ${groups.reduce((sum, group) => sum + group.length, 0)} records`);
    for (const group of groups) console.log(`  ${group.join(', ')}`);
  }
  console.log(`\nFewer than two examples: ${audit.fewerThanTwoExamples.length}`);
  console.log(`Fewer than two public or six total tests: ${audit.fewerThanSixTests.length}`);
  console.log('AST matches are review candidates, not proof of identical objectives. Semantic review is still required.');
  if (audit.duplicateIds.length || audit.duplicateTitles.length || audit.identicalSolutions.length ||
      audit.fewerThanTwoExamples.length || audit.fewerThanSixTests.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
