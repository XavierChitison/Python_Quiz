import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function setEditorValue(page, value) {
  await page.evaluate(code => {
    const host = document.getElementById('editor-surface');
    const editor = window.ace?.edit(host);
    if (editor) editor.setValue(code, -1);
    else {
      const fallback = document.getElementById('code-editor');
      fallback.value = code;
      fallback.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, value);
}

async function getEditorValue(page) {
  return page.evaluate(() => {
    const host = document.getElementById('editor-surface');
    return window.ace?.edit(host)?.getValue() ?? document.getElementById('code-editor')?.value ?? '';
  });
}

async function pressEditorKey(page, key) {
  await page.locator('#editor-surface textarea.ace_text-input').press(key);
}

test('new visitors land directly in the Level 1 coding workspace', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Xavier's Python Challenge/);
  await expect(page.getByRole('heading', { name: 'Level 1: Printing values' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Print Hello, World!' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveCount(5);
  await expect(page.getByRole('button', { name: 'Run Code' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit Solution' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Python code editor/ })).toBeVisible();
});

test('legacy routes redirect to the current problem workspace', async ({ page }) => {
  await page.goto('/#/generator');
  await expect(page).toHaveURL(/#\/problems\/level-01-problem-1$/);
  await page.goto('/#/playground');
  await expect(page).toHaveURL(/#\/problems\/level-01-problem-1$/);
  await page.goto('/#/workspace/level-01-problem-1');
  await expect(page).toHaveURL(/#\/problems\/level-01-problem-1$/);
});

test('skip link focuses the current page without changing its route or history', async ({ page }) => {
  await page.goto('/repo/#/settings');
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to coding workspace' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page).toHaveURL(/#\/settings$/);
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});

test('direct, invalid, and history routes remain usable under the repository prefix', async ({ page }) => {
  await page.goto('/repo/#/problems/level-01-problem-1');
  await expect(page.getByRole('heading', { name: 'Print Hello, World!' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Print Hello, World!' })).toBeVisible();
  await page.getByRole('link', { name: 'All Levels', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'All Levels' })).toBeVisible();
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'All Levels' })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  for (const hash of ['#/not-a-route', '#/problems/no-such-problem', '#/problems/%E0%A4%A', '#main-content']) {
    await page.goto(`/repo/${hash}`);
    await expect(page).toHaveURL(/#\/problems\/level-01-problem-1$/);
    await expect(page.getByRole('heading', { name: 'Print Hello, World!' })).toBeVisible();
  }
});

test('returning visitors resume the next problem and a legacy saved draft', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('pylevel-progress', JSON.stringify({
      profile: { level: 1 },
      solved: ['level-01-problem-1'],
      lastProblemId: 'level-01-problem-1'
    }));
    localStorage.setItem('pylevel-draft-level-01-problem-2', 'print("legacy draft")');
  });
  await page.goto('/');
  await expect(page).toHaveURL(/#\/problems\/level-01-problem-2$/);
  expect(await getEditorValue(page)).toBe('print("legacy draft")');
});

test('replaced problems retain old drafts but require a new accepted submission', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('xpc-progress', JSON.stringify({
      profile: { level: 1, xp: 20 },
      solved: ['level-01-problem-1', 'level-01-problem-2'],
      completedLevels: [1]
    }));
    localStorage.setItem('xpc-draft-level-01-problem-2', 'print("old draft")');
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Echo a Line' })).toBeVisible();
  expect(await getEditorValue(page)).toBe('print("old draft")');
  const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')));
  expect(progress.historicalSolved).toContain('level-01-problem-2');
  expect(progress.solved).not.toContain('level-01-problem-2');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Wrong Answer', { timeout: 90000 });
  await setEditorValue(page, 'line = input()\nprint(line)');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Accepted', { timeout: 90000 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).solvedRevisions['level-01-problem-2'])).toBe(1);
});

test('a revised geometry challenge rejects a sample-only answer and advances the level', async ({ page }) => {
  await page.addInitScript(() => {
    const solved = Array.from({ length: 4 }, (_, index) => `level-03-problem-${index + 1}`);
    localStorage.setItem('xpc-progress', JSON.stringify({
      profile: { level: 3 },
      solved,
      solvedRevisions: Object.fromEntries(solved.map(id => [id, 1]))
    }));
  });
  await page.goto('/#/problems/level-03-problem-5');
  await expect(page.getByRole('heading', { name: 'Squared Distance Between Points' })).toBeVisible();
  await setEditorValue(page, 'print(25)');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Wrong Answer', { timeout: 90000 });
  await setEditorValue(page, 'x1, y1, x2, y2 = map(int, input().split())\nprint((x2 - x1) ** 2 + (y2 - y1) ** 2)');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.getByRole('heading', { name: 'Level Complete' })).toBeVisible({ timeout: 90000 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).profile.level)).toBe(4);
});

test('All Levels exposes the curriculum and preserves level selection', async ({ page }) => {
  await page.goto('/#/levels');
  await expect(page.getByRole('heading', { name: 'All Levels' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Level 1, Printing values, current/ })).toBeVisible();
  await expect(page.getByText('of 500', { exact: false })).toBeVisible();
  await page.getByLabel('Search levels and problems').fill('Even and odd');
  await expect(page.getByRole('button', { name: /Level 14, Even and odd/ })).toBeVisible();
});

test('daily challenge opens even when its problem is beyond normal progression', async ({ page }) => {
  await page.goto('/#/daily');
  await expect(page.getByRole('heading', { name: 'Daily Challenge' })).toBeVisible();
  await page.getByRole('link', { name: /Start Challenge/ }).click();
  await expect(page.locator('.challenge-panel h2')).toBeVisible();
  await expect(page.locator('.challenge-panel h2')).not.toHaveText('');
});

test('interview presets start a timed assessment with navigable questions', async ({ page }) => {
  await page.goto('/#/interview');
  await page.getByLabel('Preset').selectOption('Strings and Lists');
  await page.getByLabel('Questions').selectOption('3');
  await page.getByRole('button', { name: 'Start Assessment' }).click();
  await expect(page.getByRole('region', { name: 'Interview assessment' })).toBeVisible();
  await expect(page.getByText('Question 1 of 3')).toBeVisible();
  const savedDeadline = await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).activeAssessment.endsAt);
  await page.reload();
  await expect(page.getByRole('region', { name: 'Interview assessment' })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).activeAssessment.endsAt)).toBe(savedDeadline);
  await page.getByRole('link', { name: 'Question 2, unanswered' }).click();
  await expect(page.getByText('Question 2 of 3')).toBeVisible();
});

test('an assessment with an expired persisted deadline finishes with saved answers', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('xpc-progress', JSON.stringify({
      activeAssessment: {
        id: 'expired-test',
        preset: 'PNC-style stdin/stdout',
        durationMinutes: 15,
        startedAt: Date.now() - 120000,
        endsAt: Date.now() - 1000,
        questionIds: ['level-01-problem-1'],
        currentIndex: 0,
        answers: {},
        submissions: {}
      }
    }));
  });
  await page.goto('/');
  await expect(page).toHaveURL(/#\/interview\/results$/);
  await expect(page.getByRole('heading', { name: 'Practice Results' })).toBeVisible();
  await expect(page.getByText('Unanswered', { exact: true })).toBeVisible();
});

test('settings persist in local browser storage', async ({ page }) => {
  await page.goto('/#/settings');
  const lineNumbers = page.getByRole('checkbox', { name: 'Show line numbers' });
  await expect(lineNumbers).toBeChecked();
  await lineNumbers.uncheck();
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Show line numbers' })).not.toBeChecked();
});

test('Python export downloads the current unsaved editor contents from Settings', async ({ page }) => {
  await page.goto('/#/settings');
  await page.getByRole('checkbox', { name: 'Automatic draft saving' }).uncheck();
  await page.getByRole('link', { name: 'Problems', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Print Hello, World!' })).toBeVisible();
  const code = 'print("export exactly this code")';
  await setEditorValue(page, code);
  await expect.poll(() => getEditorValue(page)).toBe(code);
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page).toHaveURL(/#\/settings$/);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export .py file' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^level-01-.*\.py$/);
  expect(await readFile(await download.path(), 'utf8')).toBe(code);
});

test('source app and relative assets work below a repository URL prefix', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (new URL(response.url()).origin === new URL(page.url()).origin && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto('/repo/');
  await expect(page.getByRole('heading', { name: 'Level 1: Printing values' })).toBeVisible();
  expect(await page.locator('.brand img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  const moduleResponse = await page.request.get('/repo/src/main.js');
  expect(moduleResponse.ok()).toBe(true);
  expect((await page.request.get('/repo/src/workers/python.worker.js')).ok()).toBe(true);
  const manifestResponse = await page.request.get('/repo/public/manifest.webmanifest');
  expect(manifestResponse.ok()).toBe(true);
  expect((await manifestResponse.json()).start_url).toBe('../');

  await setEditorValue(page, 'print("subpath Python works")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('subpath Python works', { timeout: 90_000 });
  expect(errors).toEqual([]);
});

test('a previously cached unversioned app does not break the current release', async ({ page }) => {
  test.setTimeout(120_000);
  const oldPaths = new Set([
    '/repo/src/main.js', '/repo/src/app.js', '/repo/src/data/curriculum.js',
    '/repo/src/services/storage.js', '/repo/src/workers/python.worker.js'
  ]);
  await page.route('**/repo/src/**', async route => {
    const url = new URL(route.request().url());
    if (oldPaths.has(url.pathname) && !url.search) {
      await route.fulfill({ contentType: 'text/javascript', body: 'throw new Error("stale cached module");' });
    } else {
      await route.continue();
    }
  });
  await page.goto('/repo/');
  await expect(page.getByRole('heading', { name: 'Print Hello, World!' })).toBeVisible();
  await setEditorValue(page, 'print("fresh worker")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('fresh worker', { timeout: 90_000 });
});

test('workspace has no automatically detectable serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact));
  expect(serious).toEqual([]);
});

test('editor drafts persist after navigation and reload', async ({ page }) => {
  await page.goto('/');
  await setEditorValue(page, 'print("draft survives")');
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByRole('link', { name: 'Problems', exact: true }).click();
  await expect(page.getByRole('textbox', { name: /Python code editor/ })).toBeVisible();
  expect(await getEditorValue(page)).toBe('print("draft survives")');
  await page.reload();
  await expect(page.getByRole('textbox', { name: /Python code editor/ })).toBeVisible();
  expect(await getEditorValue(page)).toBe('print("draft survives")');
});

test('editor indents new Python blocks and offers a keyboard exit', async ({ page }) => {
  await page.goto('/');
  await setEditorValue(page, 'if True:');
  await pressEditorKey(page, 'End');
  await pressEditorKey(page, 'Enter');
  expect(await getEditorValue(page)).toBe('if True:\n    ');
  await pressEditorKey(page, 'Escape');
  await expect(page.getByRole('button', { name: 'Run Code' })).toBeFocused();
  await setEditorValue(page, 'call');
  await pressEditorKey(page, 'End');
  await pressEditorKey(page, '(');
  expect(await getEditorValue(page)).toBe('call()');
  await pressEditorKey(page, 'Control+z');
  expect(await getEditorValue(page)).toBe('call');
});

test('Ace editor highlights Python tokens and runs the unchanged source', async ({ page }) => {
  test.setTimeout(120_000);
  const source = 'import sys\n\n# Count the vowels in a sentence\nvowels = "aeiouAEIOU"\n\nfor line in sys.stdin:\n    count = 0\n    for char in line:\n        if char in vowels:\n            count += 1\n    print(count)\n';
  await page.goto('/');
  await setEditorValue(page, source);
  expect(await getEditorValue(page)).toBe(source);
  const tokenClasses = await page.locator('#editor-surface .ace_text-layer').evaluate(layer =>
    [...layer.querySelectorAll('span')].map(token => token.className).join(' ')
  );
  expect(tokenClasses).toContain('ace_keyword');
  expect(tokenClasses).toContain('ace_comment');
  expect(tokenClasses).toContain('ace_string');
  expect(tokenClasses).toContain('ace_constant ace_numeric');
  expect(tokenClasses).toContain('ace_function');
  const colors = await page.evaluate(() => ({
    keyword: getComputedStyle(document.querySelector('#editor-surface .ace_keyword')).color,
    comment: getComputedStyle(document.querySelector('#editor-surface .ace_comment')).color,
    string: getComputedStyle(document.querySelector('#editor-surface .ace_string')).color
  }));
  expect(colors).toEqual({ keyword: 'rgb(197, 134, 192)', comment: 'rgb(106, 153, 85)', string: 'rgb(206, 145, 120)' });
  await page.locator('#custom-stdin').fill('hello world\n');
  await page.getByLabel('Use this input for Run Code').check();
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('3', { timeout: 90_000 });

  const advancedSource = 'class Calculator:\n    def divide(self, values: dict[str, int]) -> float:\n        try:\n            return values["total"] / values["count"]\n        except ZeroDivisionError:\n            return float("inf")\n\nresult = Calculator().divide({"total": 9, "count": 3})\nprint(f"Result: {result:.1f}")';
  await setEditorValue(page, advancedSource);
  expect(await getEditorValue(page)).toBe(advancedSource);
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('Result: 3.0', { timeout: 90_000 });
});

test('background music is opt-in and its controls and settings persist', async ({ page }) => {
  await page.goto('/#/settings');
  const music = page.getByRole('checkbox', { name: 'Background Music' });
  await expect(music).not.toBeChecked();
  await music.check();
  await expect(page.locator('#music-control-status')).toHaveText('Music on');
  await page.locator('.music-menu summary').click();
  await expect(page.getByRole('button', { name: 'Pause background music' })).toBeVisible();
  await expect(page.locator('#music-track-name')).toHaveText('Coding Focus');
  await page.getByRole('button', { name: 'Play next music track' }).click();
  await expect(page.locator('#music-track-name')).toHaveText('Digital Exploration');
  const volume = page.locator('[data-setting="musicVolume"]').first();
  await volume.evaluate(input => {
    input.value = '0.55';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('[data-value-for="musicVolume"]').first()).toHaveText('55%');
  await page.getByRole('button', { name: 'Mute background music' }).click();
  await expect(page.getByRole('button', { name: 'Unmute background music' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Unmute background music' }).click();
  await expect(page.getByRole('button', { name: 'Mute background music' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Pause background music' }).click();
  await expect(page.locator('#music-playback-status')).toHaveText('Paused');
  await page.getByRole('button', { name: 'Play background music' }).click();
  await expect(page.locator('#music-control-status')).toHaveText('Music on');
  await page.getByRole('link', { name: 'Problems', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Print Hello, World!' })).toBeVisible();
  await expect(page.locator('#music-track-name')).toHaveText('Digital Exploration');
  await page.reload();
  await page.goto('/#/settings');
  await expect(page.getByRole('checkbox', { name: 'Background Music' })).toBeChecked();
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('xpc-progress'))).settings.musicVolume).toBe(0.55);
});

test('real Python execution remains available in the shared workspace', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  await setEditorValue(page, 'print("Hello, World!")');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Accepted', { timeout: 90_000 });
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')));
  expect(saved.solved).toContain('level-01-problem-1');
});

test('solving the five problems advances to Level 2 and celebrates completion', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  const solutions = [
    'print("Hello, World!")',
    'print(input())',
    'print(int(input()) * 2)',
    'n = int(input())\nprint(n * n)',
    'a, b = map(int, input().split())\nprint(a + b)'
  ];
  const titles = ['Print Hello, World!', 'Echo a Line', 'Double an Integer', 'Square an Integer', 'Add Two Integers'];
  for (let index = 1; index <= 5; index += 1) {
    await setEditorValue(page, solutions[index - 1]);
    expect(await getEditorValue(page)).toBe(solutions[index - 1]);
    await page.getByRole('button', { name: 'Submit Solution' }).click();
    const executionState = page.locator('#execution-state');
    await expect(executionState).toHaveText('Running public and hidden tests…');
    await expect(executionState).toHaveText('Accepted', { timeout: 90_000 });
    if (index < 5) {
      const nextProblem = index + 1;
      await page.getByRole('link', { name: new RegExp(`Problem ${nextProblem}`) }).click();
      await expect(page.getByRole('heading', { name: titles[nextProblem - 1], exact: true })).toBeVisible();
    }
  }
  await expect(page.getByRole('heading', { name: 'Level Complete' })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).profile.level)).toBe(2);
  await expect(page.getByRole('link', { name: 'Continue to Level 2' })).toBeVisible();
});

test('Python supports multiline stdin, errors, timeouts, and worker recovery', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  const editor = page.locator('#editor-surface textarea.ace_text-input');
  const customInput = page.locator('#custom-stdin');
  await customInput.fill('5\n7\n10\n');
  await page.getByLabel('Use this input for Run Code').check();

  await setEditorValue(page, 'import sys\nfor line in sys.stdin:\n    print(int(line.strip()) * 2)');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('10\n14\n20', { timeout: 90_000 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).solved)).toEqual([]);
  await expect(page.locator('#execution-state')).toHaveText('Run complete · no progress or XP awarded');

  await customInput.fill('negative and zero\n');
  await setEditorValue(page, 'import sys\nprint(sys.stdin.read(), end="")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('negative and zero');

  await customInput.fill('Café\n2.5\n');
  await setEditorValue(page, 'first = input()\nsecond = input()\nprint(first)\nprint(float(second))');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('Café\n2.5');

  await setEditorValue(page, 'import sys\nprint("warning", file=sys.stderr)');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('[stderr]\nwarning');

  await setEditorValue(page, 'print(10 / 0)');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('#execution-state')).toContainText('ZeroDivisionError');

  await setEditorValue(page, 'if True');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('#execution-state')).toContainText('SyntaxError');

  await setEditorValue(page, 'Print("Hello")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('#execution-state')).toContainText('NameError');

  await setEditorValue(page, 'while True:\n    pass');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.getByRole('button', { name: 'Stop Python execution' })).toBeEnabled();
  await page.getByRole('button', { name: 'Stop Python execution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Execution cancelled');

  await setEditorValue(page, 'print("worker recovered after cancel")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('worker recovered after cancel', { timeout: 90_000 });

  await setEditorValue(page, 'while True:\n    pass');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('#execution-state')).toContainText('Time Limit Exceeded', { timeout: 15_000 });

  await setEditorValue(page, 'print("worker recovered")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('worker recovered', { timeout: 90_000 });

  await setEditorValue(page, 'print("x" * 50001)');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('#execution-state')).toContainText('Output limit exceeded');

  await setEditorValue(page, 'print("recovered after output cap")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('recovered after output cap', { timeout: 90_000 });
});

test('a failed Python runtime load exposes a working retry action', async ({ page }) => {
  test.setTimeout(120_000);
  const runtimeScript = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js';
  await page.route(runtimeScript, route => route.abort());
  await page.goto('/');
  await setEditorValue(page, 'print("retry works")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.getByRole('button', { name: 'Retry Python Runtime' })).toBeVisible({ timeout: 20_000 });

  await page.unroute(runtimeScript);
  await page.getByRole('button', { name: 'Retry Python Runtime' }).click();
  await expect(page.locator('.console-output')).toContainText('retry works', { timeout: 90_000 });
});

test('slow Python runtime initialization does not consume the code execution limit', async ({ page }) => {
  test.setTimeout(120_000);
  const runtimeScript = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js';
  await page.route(runtimeScript, async route => {
    await new Promise(resolve => setTimeout(resolve, 9_000));
    await route.continue();
  });
  await page.goto('/');
  await setEditorValue(page, 'print("execution survived slow startup")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('execution survived slow startup', { timeout: 30_000 });
  await expect(page.locator('#execution-state')).toHaveText('Run complete · no progress or XP awarded');
});

test('workspace remains usable at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Print Hello, World!' })).toBeVisible();
  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});
