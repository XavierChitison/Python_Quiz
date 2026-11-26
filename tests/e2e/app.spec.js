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
  await expect(page.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
  await page.getByRole('link', { name: 'All Levels', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'All Levels' })).toBeVisible();
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page).toHaveTitle(/All Levels — Xavier's Python Challenge/);
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await expect(page.locator('#main-content')).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'All Levels' })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  for (const hash of ['#/not-a-route', '#/problems/no-such-problem', '#/problems/%E0%A4%A', '#main-content']) {
    await page.goto(`/repo/${hash}`);
    await expect(page).toHaveURL(/#\/problems\/level-01-problem-1$/);
    await expect(page.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
  }
});

test('returning visitors resume the next problem and a legacy saved draft', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('pylevel-progress', JSON.stringify({
      profile: { level: 1 },
      solved: ['level-01-problem-1'],
      solvedRevisions: { 'level-01-problem-1': 1 },
      lastProblemId: 'level-01-problem-1'
    }));
    localStorage.setItem('pylevel-draft-level-01-problem-2', 'print("legacy draft")');
  });
  await page.goto('/');
  await expect(page).toHaveURL(/#\/problems\/level-01-problem-2$/);
  expect(await getEditorValue(page)).toBe('print("legacy draft")');
});

test('the rewritten first problem archives old progress but keeps its saved code', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('xpc-progress', JSON.stringify({
      solved: ['level-01-problem-1'],
      profile: { level: 1, xp: 10 }
    }));
    localStorage.setItem('xpc-draft-level-01-problem-1', 'print("Hello, World!")');
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
  expect(await getEditorValue(page)).toBe('print("Hello, World!")');
  const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')));
  expect(progress.historicalSolved).toContain('level-01-problem-1');
  expect(progress.solved).not.toContain('level-01-problem-1');
  expect(progress.profile.xp).toBe(10);
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Wrong Answer', { timeout: 90000 });
  await setEditorValue(page, 'first, second = map(int, input().split())\nprint(second, first)');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Accepted', { timeout: 90000 });
});

test('replaced problems retain old drafts but require a new accepted submission', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('xpc-progress', JSON.stringify({
      profile: { level: 1, xp: 20 },
      solved: ['level-01-problem-1', 'level-01-problem-2'],
      solvedRevisions: { 'level-01-problem-1': 1 },
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

test('a revised conversion challenge rejects a sample-only answer and accepts its reference solution', async ({ page }) => {
  await page.addInitScript(() => {
    const solved = Array.from({ length: 4 }, (_, index) => `level-04-problem-${index + 1}`);
    localStorage.setItem('xpc-progress', JSON.stringify({
      profile: { level: 4 },
      solved,
      solvedRevisions: Object.fromEntries(solved.map(id => [id, 1]))
    }));
  });
  await page.goto('/#/problems/level-04-problem-5');
  await expect(page.getByRole('heading', { name: 'Average Trip Speed' })).toBeVisible();
  await setEditorValue(page, 'print("60.00")');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Wrong Answer', { timeout: 90000 });
  await setEditorValue(page, 'distance, hours = map(int, input().split())\nprint(f"{distance / hours:.2f}")');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.getByRole('heading', { name: 'Level Complete' })).toBeVisible({ timeout: 90000 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).solvedRevisions['level-04-problem-5'])).toBe(1);
});

test('a revised shopping challenge rejects rounding down and accepts the correct solution', async ({ page }) => {
  await page.addInitScript(() => {
    const solved = Array.from({ length: 4 }, (_, index) => `level-05-problem-${index + 1}`);
    localStorage.setItem('xpc-progress', JSON.stringify({
      profile: { level: 5 },
      solved,
      solvedRevisions: Object.fromEntries(solved.map(id => [id, 1]))
    }));
  });
  await page.goto('/#/problems/level-05-problem-5');
  await expect(page.getByRole('heading', { name: 'Pizzas Needed for a Group' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Problem description' })).toContainText('Example 2: Input "3 2 6"; output "1".');
  await setEditorValue(page, 'people, per_person, per_pizza = map(int, input().split())\nprint(people * per_person // per_pizza)');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Wrong Answer', { timeout: 90000 });
  await setEditorValue(page, 'people, per_person, per_pizza = map(int, input().split())\nprint((people * per_person + per_pizza - 1) // per_pizza)');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.getByRole('heading', { name: 'Level Complete' })).toBeVisible({ timeout: 90000 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).solvedRevisions['level-05-problem-5'])).toBe(1);
});

test('a revised digit challenge checks leading zeros when reversing', async ({ page }) => {
  await page.addInitScript(() => {
    const solved = Array.from({ length: 3 }, (_, index) => `level-06-problem-${index + 1}`);
    localStorage.setItem('xpc-progress', JSON.stringify({
      profile: { level: 6 },
      solved,
      solvedRevisions: Object.fromEntries(solved.map(id => [id, 1]))
    }));
  });
  await page.goto('/#/problems/level-06-problem-4');
  await expect(page.getByRole('heading', { name: 'Reverse a Two-Digit Number' })).toBeVisible();
  await setEditorValue(page, 'print(input()[::-1])');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Wrong Answer', { timeout: 90000 });
  await setEditorValue(page, 'number = int(input())\nprint(number % 10 * 10 + number // 10)');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Accepted', { timeout: 90000 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).solvedRevisions['level-06-problem-4'])).toBe(1);
});

test('a revised multiline challenge preserves spaces in browser Python output', async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => {
    localStorage.setItem('xpc-progress', JSON.stringify({ settings: { unrestrictedPractice: true } }));
  });
  await page.goto('/#/problems/level-08-problem-4');
  await expect(page.getByRole('heading', { name: 'Join Two Lines with a Space' })).toBeVisible();
  await setEditorValue(page, 'print(input().strip() + " " + input().strip())');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Wrong Answer', { timeout: 90000 });
  await setEditorValue(page, 'first = input()\nsecond = input()\nprint(first + " " + second)');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Accepted', { timeout: 90000 });
});

test('All Levels exposes the curriculum and preserves level selection', async ({ page }) => {
  await page.goto('/#/levels');
  await expect(page.getByRole('heading', { name: 'All Levels' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Level 1, Printing values, current/ })).toBeVisible();
  await expect(page.getByText('of 500', { exact: false })).toBeVisible();
  await page.getByLabel('Search levels and problems').fill('Thresholds and equations');
  await expect(page.getByRole('button', { name: /Level 14, Thresholds and equations/ })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
  await setEditorValue(page, 'print("fresh worker")');
  await page.getByRole('button', { name: 'Run Code' }).click();
  await expect(page.locator('.console-output')).toContainText('fresh worker', { timeout: 90_000 });
});

test('representative routes and interaction states pass accessibility scans without axe violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const scan = async () => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  };
  for (const [route, heading] of [
    ['/', 'Swap Two Values'],
    ['/#/levels', 'All Levels'],
    ['/#/daily', 'Daily Challenge'],
    ['/#/interview', 'Interview Practice'],
    ['/#/interview/results', 'No assessment results yet'],
    ['/#/settings', 'Settings']
  ]) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    if (route === '/') {
      const animationDuration = await page.locator('.page-enter').evaluate(element => getComputedStyle(element).animationDuration);
      expect(parseFloat(animationDuration)).toBeLessThan(0.001);
    }
    await scan();
  }
  for (const name of ['About', 'Help', 'Privacy', 'Keyboard shortcuts']) {
    const trigger = page.getByRole('button', { name, exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toBeFocused();
    await scan();
    if (name === 'About') {
      await page.keyboard.press('Shift+Tab');
      await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    } else {
      await page.getByRole('button', { name: 'Close', exact: true }).click();
    }
  }
  await page.goto('/');
  await page.locator('.hint-box summary').click();
  await scan();
  await page.getByRole('tab', { name: 'Console' }).click();
  await scan();
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await scan();
  }
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
  await expect(music).toBeChecked();
  await page.getByRole('button', { name: 'Play background music' }).click();
  await expect(page.locator('#music-control-status')).toHaveText('Music on');
  await expect(music).toBeChecked();
  await page.getByRole('link', { name: 'Problems', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
  await expect(page.locator('#music-track-name')).toHaveText('Digital Exploration');
  await page.reload();
  await page.goto('/#/settings');
  await expect(page.getByRole('checkbox', { name: 'Background Music' })).toBeChecked();
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('xpc-progress'))).settings.musicVolume).toBe(0.55);
});

test('mobile music toggle supports touch and keyboard without crowding the header', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  try {
    await page.goto('/#/settings');
    const toggle = page.locator('.music-toggle');
    const setting = page.getByRole('checkbox', { name: 'Background Music' });
    await expect(setting).not.toBeChecked();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    const viewports = [
      [320, 720], [360, 800], [375, 812], [390, 844], [414, 896], [430, 932],
      [480, 900], [600, 960], [768, 1024], [820, 1180], [844, 390], [900, 600], [932, 430],
      [1024, 768], [1280, 800], [1440, 900], [1920, 1080]
    ];
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      const geometry = await page.evaluate(() => {
        const bounds = selector => {
          const rect = document.querySelector(selector).getBoundingClientRect();
          return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
        };
        const toggle = document.querySelector('.music-toggle');
        const toggleBounds = toggle.getBoundingClientRect();
        const summaryBounds = document.querySelector('.music-menu summary').getBoundingClientRect();
        const intersects = (left, right) => left.left < right.right && left.right > right.left && left.top < right.bottom && left.bottom > right.top;
        const hit = document.elementFromPoint((toggleBounds.left + toggleBounds.right) / 2, (toggleBounds.top + toggleBounds.bottom) / 2);
        const groupBounds = bounds('.music-control-group');
        const siblingBounds = [...document.querySelectorAll('.top-status > .status-chip, .top-status > .icon-button')].map(element => {
          const rect = element.getBoundingClientRect();
          return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
        });
        return {
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          toggle: bounds('.music-toggle'),
          menu: bounds('.music-menu summary'),
          toggleMenuOverlap: intersects(toggleBounds, summaryBounds),
          siblingOverlap: siblingBounds.some(sibling => intersects(groupBounds, sibling)),
          hitTargetIsToggle: toggle.contains(hit)
        };
      });
      expect(geometry.documentWidth, `header overflow at ${width}px`).toBeLessThanOrEqual(geometry.viewportWidth);
      expect(geometry.toggleMenuOverlap, `music controls overlap at ${width}px`).toBe(false);
      expect(geometry.siblingOverlap, `music control overlaps a sibling at ${width}px`).toBe(false);
      expect(geometry.hitTargetIsToggle, `music toggle is obstructed at ${width}px`).toBe(true);
      expect(geometry.toggle.width, `music toggle too narrow at ${width}px`).toBeGreaterThanOrEqual(width <= 900 ? 43.5 : 24);
      expect(geometry.toggle.height, `music toggle too short at ${width}px`).toBeGreaterThanOrEqual(width <= 900 ? 43.5 : 24);
      expect(geometry.menu.width, `music menu trigger too narrow at ${width}px`).toBeGreaterThanOrEqual(width <= 900 ? 43.5 : 24);
      expect(geometry.menu.height, `music menu trigger too short at ${width}px`).toBeGreaterThanOrEqual(width <= 900 ? 43.5 : 24);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await toggle.tap();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toHaveAttribute('aria-label', /Music on|Tap to start|Audio unavailable|Music muted/);
    await expect(setting).toBeChecked();
    expect(JSON.parse(await page.evaluate(() => localStorage.getItem('xpc-progress'))).settings.musicEnabled).toBe(true);
    const playbackDescription = await page.locator('#music-control-status').innerText();
    expect(['Music on', 'Music muted', 'Music paused', 'Tap to start', 'Audio unavailable']).toContain(playbackDescription);

    await toggle.tap();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(setting).not.toBeChecked();

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(setting).toBeChecked();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(setting).not.toBeChecked();

    await toggle.tap();
    await expect(setting).toBeChecked();
    await page.reload();
    await expect(page.getByRole('checkbox', { name: 'Background Music' })).toBeChecked();
    await expect(page.locator('.music-toggle')).toHaveAttribute('aria-pressed', 'true');
  } finally {
    await context.close();
  }
});

test('header music toggle reports blocked playback and retries from a user gesture', async ({ page }) => {
  await page.addInitScript(() => {
    const makeParam = () => ({
      value: 0,
      setValueAtTime(value) { this.value = value; },
      setTargetAtTime(value) { this.value = value; },
      exponentialRampToValueAtTime(value) { this.value = value; },
      cancelScheduledValues() {}
    });
    class AudioNode {
      constructor() {
        this.gain = makeParam();
        this.frequency = makeParam();
        this.Q = makeParam();
      }
      connect() {}
      disconnect() {}
      start() {}
      stop() {}
      addEventListener() {}
    }
    class ControlledAudioContext {
      state = 'suspended';
      currentTime = 0;
      destination = {};
      createGain() { return new AudioNode(); }
      createOscillator() { return new AudioNode(); }
      createBiquadFilter() { return new AudioNode(); }
      resume() {
        if (!window.__xpcAllowMusicResume) {
          return Promise.reject(Object.assign(new Error('Audio playback requires a user gesture.'), { name: 'NotAllowedError' }));
        }
        this.state = 'running';
        return Promise.resolve();
      }
    }
    window.__xpcAllowMusicResume = false;
    window.AudioContext = ControlledAudioContext;
  });
  await page.goto('/');
  const toggle = page.locator('.music-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Tap to start (background music)');
  await expect(page.locator('#music-control-status-compact')).toHaveText('Retry');

  await page.evaluate(() => { window.__xpcAllowMusicResume = true; });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-label', 'Music on (background music)');
  await expect(page.locator('#music-playback-status')).toHaveText('Playing');
});

test('real Python execution remains available in the shared workspace', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  await setEditorValue(page, 'a, b = map(int, input().split())\nprint(b, a)');
  await page.getByRole('button', { name: 'Submit Solution' }).click();
  await expect(page.locator('#execution-state')).toHaveText('Accepted', { timeout: 90_000 });
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')));
  expect(saved.solved).toContain('level-01-problem-1');
});

test('solving the five problems advances to Level 2 and celebrates completion', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  const solutions = [
    'a, b = map(int, input().split())\nprint(b, a)',
    'print(input())',
    'print(int(input()) * 2)',
    'n = int(input())\nprint(n * n)',
    'a, b = map(int, input().split())\nprint(a + b)'
  ];
  const titles = ['Swap Two Values', 'Echo a Line', 'Double an Integer', 'Square an Integer', 'Add Two Integers'];
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
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
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

test('workspace, levels, and settings reflow without horizontal page overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const viewports = [
    [320, 720], [360, 800], [375, 812], [390, 844], [414, 896], [430, 932],
    [480, 900], [600, 960], [768, 1024], [820, 1180], [900, 600],
    [1024, 768], [1280, 800], [1440, 900], [1920, 1080], [2560, 1440]
  ];
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    if (width <= 900) {
      await page.waitForFunction(() => {
        const control = document.querySelector('.editor-tools .icon-button');
        return control && control.getBoundingClientRect().height >= 43.5;
      });
    }
    const layout = await page.evaluate(() => {
      const bounds = selector => {
        const element = document.querySelector(selector);
        const rect = element.getBoundingClientRect();
        return { left: rect.left, top: rect.top, right: rect.right, width: rect.width, height: rect.height };
      };
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        workspace: bounds('.workspace-grid'),
        rail: bounds('.problem-rail'),
        challenge: bounds('.challenge-panel'),
        editor: bounds('.editor-panel'),
        controls: [
          '.nav-link', '.problem-dot', '.button-run', '.editor-tools .icon-button',
          '.hint-box summary', '.test-case summary'
        ].map(selector => ({ selector, ...bounds(selector) }))
      };
    });
    expect(layout.documentWidth, `workspace overflow at ${width}px`).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.challenge.right, `problem panel clipped at ${width}px`).toBeLessThanOrEqual(width);
    expect(layout.editor.right, `editor panel clipped at ${width}px`).toBeLessThanOrEqual(width);
    if (width <= 900) {
      expect(Math.abs(layout.challenge.left - layout.editor.left), `workspace should stack at ${width}px`).toBeLessThanOrEqual(1);
      for (const control of layout.controls) {
        expect(control.width, `${control.selector} touch target too narrow at ${width}px`).toBeGreaterThanOrEqual(43.5);
        expect(control.height, `${control.selector} touch target too short at ${width}px`).toBeGreaterThanOrEqual(43.5);
      }
    } else {
      expect(layout.challenge.left).toBeLessThan(layout.editor.left);
      expect(Math.abs(layout.challenge.top - layout.editor.top)).toBeLessThanOrEqual(1);
    }
    if (width <= 480) {
      const links = await page.locator('.primary-nav .nav-link').evaluateAll(elements => elements.map(element => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      }));
      expect(links).toHaveLength(5);
      for (const link of links) {
        expect(link.left).toBeGreaterThanOrEqual(0);
        expect(link.right).toBeLessThanOrEqual(width);
      }
    }
  }

  for (const route of ['/#/levels', '/#/settings']) {
    await page.goto(route);
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      if (route.endsWith('levels') && width <= 900) {
        await page.waitForFunction(() => {
          const tile = document.querySelector('.level-grid .level-tile');
          return tile && tile.getBoundingClientRect().height >= 43.5;
        });
      }
      if (route.endsWith('settings') && width <= 620) {
        await page.waitForFunction(() => {
          const grid = document.querySelector('.setting-grid');
          return grid && getComputedStyle(grid).gridTemplateColumns.split(' ').length === 1;
        });
      }
      const widths = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
        overflowingElements: [...document.body.querySelectorAll('*')]
          .map(element => {
            const rect = element.getBoundingClientRect();
            return {
              element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${typeof element.className === 'string' && element.className ? `.${element.className.trim().replace(/\s+/g, '.')}` : ''}`,
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              scrollWidth: element.scrollWidth,
              clientWidth: element.clientWidth,
              text: (element.innerText || '').trim().slice(0, 60)
            };
          })
          .filter(element => element.right > document.documentElement.clientWidth + 1 || element.scrollWidth > element.clientWidth + 1)
          .sort((left, right) => right.right - left.right)
          .slice(0, 12)
      }));
      expect(widths.document, `${route} overflow at ${width}px: ${JSON.stringify(widths)}`).toBeLessThanOrEqual(widths.viewport);
      if (route.endsWith('levels') && width <= 900) {
        const tileHeights = await page.locator('.level-grid .level-tile').evaluateAll(elements =>
          elements.map(element => {
            const rect = element.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
          })
        );
        expect(tileHeights.length).toBeGreaterThan(0);
        for (const tile of tileHeights) {
          expect(tile.width).toBeGreaterThanOrEqual(43.5);
          expect(tile.height).toBeGreaterThanOrEqual(43.5);
        }
      }
    }
  }
  await page.goto('/');
  await page.setViewportSize({ width: 320, height: 720 });
  await page.waitForFunction(() => {
    const control = document.querySelector('.editor-tools .icon-button');
    const nav = document.querySelector('.primary-nav');
    return control?.getBoundingClientRect().height >= 43.5 &&
      nav && getComputedStyle(nav).flexWrap === 'wrap';
  });
  await page.addStyleTag({ content: `
    *, *::before, *::after { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }
    p { margin-bottom: 2em !important; }
  ` });
  const spacedTextWidths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth
  }));
  expect(spacedTextWidths.document).toBeLessThanOrEqual(spacedTextWidths.viewport);
  await page.getByRole('button', { name: 'Run Code' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Run Code' })).toBeVisible();
});

test('execution tabs support arrow keys without recreating the editor', async ({ page }) => {
  await page.goto('/');
  await setEditorValue(page, 'print("keep editor state")');
  await page.evaluate(() => { window.__xpcEditor = window.ace.edit(document.getElementById('editor-surface')); });
  const consoleTab = page.getByRole('tab', { name: 'Console' });
  await consoleTab.click();
  await expect(consoleTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Console output will appear here.');
  expect(await getEditorValue(page)).toBe('print("keep editor state")');
  expect(await page.evaluate(() => window.__xpcEditor === window.ace.edit(document.getElementById('editor-surface')))).toBe(true);
  await consoleTab.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: /Test cases/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: /Test cases/ })).toBeFocused();
  expect(await getEditorValue(page)).toBe('print("keep editor state")');
});

test('touch-emulated phone can submit, save progress, and export a solution', async ({ page }) => {
  test.setTimeout(120_000);
  const context = await page.context().browser().newContext({
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    acceptDownloads: true
  });
  const phone = await context.newPage();
  try {
    await phone.goto('/');
    await expect(phone.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
    const solution = 'a, b = map(int, input().split())\nprint(b, a)';
    await setEditorValue(phone, solution);
    await phone.getByRole('button', { name: 'Submit Solution' }).tap();
    await expect(phone.locator('#execution-state')).toHaveText('Accepted', { timeout: 90_000 });
    expect(await phone.evaluate(() => JSON.parse(localStorage.getItem('xpc-progress')).solved))
      .toContain('level-01-problem-1');
    expect(await phone.evaluate(() => localStorage.getItem('xpc-draft-level-01-problem-1'))).toBe(solution);

    await phone.getByRole('link', { name: 'Settings', exact: true }).tap();
    await expect(phone.getByRole('heading', { name: 'Settings' })).toBeVisible();
    const downloadPromise = phone.waitForEvent('download');
    await phone.getByRole('button', { name: 'Export .py file' }).tap();
    const download = await downloadPromise;
    expect(await readFile(await download.path(), 'utf8')).toBe(solution);

    await phone.goto('/#/problems/level-01-problem-1');
    await expect(phone.getByRole('heading', { name: 'Swap Two Values' })).toBeVisible();
    expect(await getEditorValue(phone)).toBe(solution);
    await phone.setViewportSize({ width: 844, height: 390 });
    const dimensions = await phone.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  } finally {
    await context.close();
  }
});
