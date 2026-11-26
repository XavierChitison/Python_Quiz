import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { auditProblems } from '../../scripts/audit-curriculum.js';

function problem(id, title, description, solution, tests) {
  return {
    id, title, description, referenceSolution: solution,
    examples: [{ input: '1', output: '1' }, { input: '2', output: '2' }],
    publicTestCases: tests,
    hiddenTestCases: tests
  };
}

describe('curriculum audit', () => {
  it('finds repeated content, near-duplicate candidates, and missing examples or tests', async () => {
    const tests = [{ input: '1', output: '1' }, { input: '2', output: '2' }, { input: '3', output: '3' }];
    const first = problem('one', 'First', 'Repeated', 'print(a + 1)', tests);
    const second = problem('two', 'Second', 'Repeated', 'print(b + 2)', [...tests].reverse());
    const third = problem('three', 'first', 'Other', 'print(a + 1)', []);
    third.examples = [];
    const report = await auditProblems([first, second, third], () => 'same shape');

    expect(report.duplicateTitles).toEqual([['one', 'three']]);
    expect(report.duplicateDescriptions).toEqual([['one', 'two']]);
    expect(report.identicalSolutions).toEqual([['one', 'three']]);
    expect(report.similarSolutions).toEqual([['one', 'two', 'three']]);
    expect(report.identicalCases).toEqual([['one', 'two']]);
    expect(report.fewerThanTwoExamples).toEqual(['three']);
    expect(report.fewerThanSixTests).toEqual(['three']);
  });

  it('recognizes renamed variables and changed constants while distinguishing operations', () => {
    const script = `
      import assert from 'node:assert/strict';
      import { createFingerprinter } from './scripts/audit-curriculum.js';
      const normalizer = await createFingerprinter();
      try {
        const { fingerprint } = normalizer;
        const original = fingerprint('value = int(input())\\nprint(value + 3)');
        assert.equal(fingerprint('number = int(input())\\nprint(number + 9)'), original);
        assert.notEqual(fingerprint('number = int(input())\\nprint(number - 9)'), original);
        assert.notEqual(
          fingerprint('x = int(input())\\ny = int(input())\\nprint(x + y)'),
          fingerprint('x = int(input())\\ny = int(input())\\nprint(x + x)')
        );
      } finally {
        normalizer.dispose();
      }
    `;
    execFileSync(process.execPath, ['--input-type=module', '-e', script], { stdio: 'pipe' });
  });
});
