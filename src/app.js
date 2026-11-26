import { levels, problems, stageNames } from './data/curriculum.js?v=2.3.0';
import {
  clearApplicationData, createDefaultProgress, exportBackup, getDraft, normalizeProgress,
  progressSnapshot, saveDraft, saveProgress, validateBackup
} from './services/storage.js?v=2.3.0';
import { assessmentScore, currentLevel, isProblemAvailable, localDateKey, recordAccepted, selectDailyProblem } from './services/progression.js?v=2.3.0';
import { runPython, stopPython } from './services/python-runner.js?v=2.3.0';
import { audioController, playSound } from './services/audio.js?v=2.3.0';
import { celebrate } from './services/effects.js?v=2.3.0';

const REMOVED_ROUTES = new Set([
  'dashboard', 'roadmap', 'generator', 'playground', 'debugging', 'prediction',
  'lessons', 'guided', 'review', 'mistakes', 'analytics', 'history',
  'achievements', 'about', 'help', 'privacy'
]);
const MILESTONES = [10, 25, 50, 75, 100];

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function normalizeOutput(value) {
  return String(value ?? '').replace(/\r\n/g, '\n').replace(/\n+$/, '');
}

const RUNTIME_LOAD_ERROR = /Python Runtime Error|Failed to fetch|NetworkError|Failed to execute ["']importScripts["']|importScripts.*failed to load|Runtime initialization|loadPyodide/i;

function dateLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export class App {
  constructor(root) {
    this.root = root;
    this.progress = progressSnapshot();
    this.ensureProgress();
    this.progress.problemsByLevel = Object.fromEntries(levels.map(level => [level.number, level.problems.map(problem => problem.id)]));
    this.ui = {
      outputTab: 'tests',
      results: [],
      consoleText: '',
      status: '',
      statusKind: '',
      hintIndex: {},
      selectedLevel: currentLevel(this.progress),
      levelSearch: '',
      levelView: 'grid',
      levelFilter: 'all',
      expandedWorld: Math.ceil(currentLevel(this.progress) / 10),
      solutionConfirmed: false,
      runId: 0,
      running: false,
      drafts: new Map(),
      editorCursors: new Map()
    };
    this.previousFocus = null;
    this.editor = null;
    this.editorProblemId = null;
    this.audioUnsubscribe = audioController.subscribe(state => this.updateAudioControls(state));
    this.audioGestureHandler = () => audioController.unlock();
    document.addEventListener('pointerdown', this.audioGestureHandler, { passive: true });
    document.addEventListener('keydown', this.audioGestureHandler);
    audioController.applySettings(this.progress.settings);
    this.render();
    this.root.addEventListener('click', event => this.handleClick(event));
    this.root.addEventListener('input', event => this.handleInput(event));
    this.root.addEventListener('change', event => this.handleChange(event));
    this.root.addEventListener('keydown', event => this.handleKeydown(event));
    this.root.addEventListener('submit', event => this.handleSubmit(event));
    this.root.addEventListener('scroll', event => {
      if (event.target.id !== 'code-editor') return;
      const gutter = this.root.querySelector('#line-gutter');
      if (gutter) gutter.scrollTop = event.target.scrollTop;
    }, true);
    window.addEventListener('hashchange', () => this.handleRouteChange());
    this.clockTimer = window.setInterval(() => this.updateAssessmentClock(), 1000);
    this.ensureHash();
  }

  ensureProgress() {
    this.progress = normalizeProgress(this.progress);
  }

  save() {
    try {
      saveProgress(this.progress);
      return true;
    } catch (error) {
      console.error('Could not save your progress.', error);
      this.toast('Progress could not be saved. Check available browser storage.');
      return false;
    }
  }
  mainProblemId() {
    const last = problems.find(problem => problem.id === this.progress.lastProblemId);
    if (last && isProblemAvailable(last, this.progress)) {
      if (!this.progress.solved.includes(last.id)) return last.id;
      const currentLevelProblems = levels[last.level - 1]?.problems || [];
      const next = currentLevelProblems.find(problem => !this.progress.solved.includes(problem.id));
      if (next && isProblemAvailable(next, this.progress)) return next.id;
    }
    const level = levels[currentLevel(this.progress) - 1] || levels[0];
    return level.problems.find(problem => !this.progress.solved.includes(problem.id))?.id || level.problems[0].id;
  }

  ensureHash() {
    if (!location.hash) location.replace(`${location.pathname}${location.search}#/problems/${this.mainProblemId()}`);
    const route = location.hash.replace(/^#\/?/, '').split('/')[0];
    if (REMOVED_ROUTES.has(route)) location.replace(`#/problems/${this.mainProblemId()}`);
  }

  resolveRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!parts.length) return { page: 'problem', id: this.mainProblemId() };
    if (REMOVED_ROUTES.has(parts[0])) {
      location.replace(`#/problems/${this.mainProblemId()}`);
      return { page: 'problem', id: this.mainProblemId() };
    }
    if (parts[0] === 'workspace') {
      location.replace(`#/problems/${encodeURIComponent(parts[1] || this.mainProblemId())}`);
      return { page: 'problem', id: parts[1] || this.mainProblemId() };
    }
    if (parts[0] === 'problems') {
      let id;
      try {
        id = decodeURIComponent(parts[1] || this.mainProblemId());
      } catch {
        const nextId = this.mainProblemId();
        location.replace(`#/problems/${nextId}`);
        return { page: 'problem', id: nextId };
      }
      const problem = problems.find(item => item.id === id);
      const inAssessment = this.progress.activeAssessment?.questionIds?.includes(id);
      const isDailyChallenge = this.progress.daily.date === localDateKey() && this.progress.daily.problemId === id;
      if (!problem || (!inAssessment && !isDailyChallenge && (!isProblemAvailable(problem, this.progress) || !this.previousProblemIsDone(problem)))) {
        const nextId = this.mainProblemId();
        if (id !== nextId) location.replace(`#/problems/${nextId}`);
        return { page: 'problem', id: nextId };
      }
      return { page: 'problem', id };
    }
    if (parts[0] === 'levels') return { page: 'levels' };
    if (parts[0] === 'daily') return { page: 'daily' };
    if (parts[0] === 'interview' && parts[1] === 'results') return { page: 'interview-results' };
    if (parts[0] === 'interview') return { page: 'interview' };
    if (parts[0] === 'settings') return { page: 'settings' };
    location.replace(`#/problems/${this.mainProblemId()}`);
    return { page: 'problem', id: this.mainProblemId() };
  }

  previousProblemIsDone(problem) {
    const level = levels[problem.level - 1];
    const index = level?.problems.findIndex(item => item.id === problem.id) ?? -1;
    return index <= 0 || this.progress.solved.includes(level.problems[index - 1].id) || this.progress.settings.unrestrictedPractice;
  }

  handleRouteChange() {
    if (this.ui.running) {
      this.ui.runId += 1;
      this.ui.running = false;
      stopPython();
      this.ui.status = 'Execution stopped after navigation';
      this.ui.statusKind = 'error';
    }
    this.render();
    this.root.querySelector('#main-content')?.focus();
  }

  render() {
    this.captureAndDestroyEditor();
    const route = this.resolveRoute();
    const previousProblemId = this.renderedProblemId;
    this.currentRoute = route;
    const activeProblem = route.page === 'problem' ? problems.find(item => item.id === route.id) : null;
    const pageTitle = activeProblem
      ? `${activeProblem.title} · Level ${activeProblem.level}`
      : ({
          levels: 'All Levels',
          daily: 'Daily Challenge',
          interview: 'Interview Practice',
          'interview-results': 'Practice Results',
          settings: 'Settings'
        }[route.page] || 'Python coding practice');
    document.title = `${pageTitle} — Xavier's Python Challenge`;
    if (route.page === 'problem' && this.progress.activeAssessment) {
      const assessmentIndex = this.progress.activeAssessment.questionIds?.indexOf(route.id) ?? -1;
      if (assessmentIndex >= 0) this.progress.activeAssessment.currentIndex = assessmentIndex;
    }
    document.documentElement.dataset.reduceMotion = String(Boolean(this.progress.settings.reduceMotion));
    this.root.innerHTML = `
      <header class="topbar">
        <a class="brand" href="#/problems/${this.mainProblemId()}">
          <img src="./public/xpc-logo.svg" alt="">
          <span class="brand-name">XAVIER'S PYTHON CHALLENGE<span>Code. Solve. Level Up.</span></span>
        </a>
        <nav class="primary-nav" aria-label="Main navigation">
          ${this.navLink('problems', 'Problems', route.page === 'problem')}
          ${this.navLink('levels', 'All Levels', route.page === 'levels')}
          ${this.navLink('daily', 'Daily Challenge', route.page === 'daily')}
          ${this.navLink('interview', 'Interview Practice', route.page.startsWith('interview'))}
          ${this.navLink('settings', 'Settings', route.page === 'settings')}
        </nav>
        <div class="top-status">
          <span class="status-chip"><strong>LV ${currentLevel(this.progress)}</strong></span>
          <span class="status-chip" title="Consecutive local calendar days practiced">🔥 ${this.progress.profile.streak || 0}</span>
          <details class="music-menu">
            <summary><span aria-hidden="true">♫</span><span id="music-control-status">Music off</span></summary>
            <div class="music-popover" aria-label="Background music controls">
              <p><strong id="music-track-name">Coding Focus</strong><span id="music-playback-status" role="status">Music is off</span></p>
              <div class="music-actions">
                <button class="icon-button" data-action="music-playback" aria-label="Enable background music">▶</button>
                <button class="icon-button" data-action="music-mute" aria-label="Mute background music" aria-pressed="false">◖</button>
                <button class="icon-button" data-action="music-next" aria-label="Play next music track">⏭</button>
              </div>
              <label class="music-volume"><span>Music volume</span><input type="range" min="0" max="1" step="0.01" data-setting="musicVolume" aria-label="Music volume" aria-valuetext="${Math.round(this.progress.settings.musicVolume * 100)}%"><output data-value-for="musicVolume">${Math.round(this.progress.settings.musicVolume * 100)}%</output></label>
            </div>
          </details>
          <button class="icon-button" data-action="sound-toggle" aria-label="${this.progress.settings.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}" aria-pressed="${Boolean(this.progress.settings.soundEnabled)}">${this.progress.settings.soundEnabled ? '♫' : '♪'}</button>
        </div>
      </header>
      <main id="main-content" class="main-content page-enter" tabindex="-1">${this.renderPage(route)}</main>
      <div id="overlay-root"></div>
      <div class="toast-region" id="toast-region" aria-live="polite"></div>`;
    if (route.page === 'problem') {
      const problem = problems.find(item => item.id === route.id);
      if (problem) {
        this.progress.lastProblemId = problem.id;
        this.save();
        this.updateEditorSettings();
        if (route.id !== previousProblemId && this.progress.settings.autoRun && !this.progress.activeAssessment) {
          window.setTimeout(() => {
            if (this.currentRoute?.page === 'problem' && this.currentRoute.id === route.id) this.executeCurrent(false);
          }, 0);
        }
        this.renderedProblemId = route.id;
      }
    }
    this.updateAudioControls(audioController.getState());
    this.updateAssessmentClock();
  }

  navLink(route, text, active) {
    const href = route === 'problems' ? `#/problems/${this.mainProblemId()}` : `#/${route}`;
    return `<a class="nav-link ${active ? 'active' : ''}" href="${href}" ${active ? 'aria-current="page"' : ''}>${text}</a>`;
  }

  renderPage(route) {
    if (route.page === 'problem') return this.renderWorkspace(route.id);
    if (route.page === 'levels') return this.renderLevels();
    if (route.page === 'daily') return this.renderDaily();
    if (route.page === 'interview') return this.renderInterview();
    if (route.page === 'interview-results') return this.renderInterviewResults();
    if (route.page === 'settings') return this.renderSettings();
    return '';
  }

  renderWorkspace(problemId) {
    const problem = problems.find(item => item.id === problemId);
    if (!problem) return '';
    const level = levels[problem.level - 1];
    const solvedCount = level.problems.filter(item => this.progress.solved.includes(item.id)).length;
    const locked = !this.progress.settings.unrestrictedPractice && level.number > currentLevel(this.progress);
    const savedDraft = getDraft(problem.id);
    const draft = this.ui.drafts.has(problem.id)
      ? this.ui.drafts.get(problem.id)
      : savedDraft === null ? problem.starterCode.stdin : savedDraft;
    const isAssessment = Boolean(this.progress.activeAssessment);
    const retryRuntime = this.ui.statusKind === 'error' && RUNTIME_LOAD_ERROR.test(this.ui.status);
    const assessment = this.progress.activeAssessment;
    return `<section class="level-banner" aria-label="Level progress">
        <div><p class="eyebrow">${escapeHTML(level.stageTitle)} · WORLD ${level.stage}</p><h1>Level ${level.number}: ${escapeHTML(level.title)}</h1><p>${escapeHTML(level.description)}</p></div>
        <div class="level-progress"><div class="progress-label"><span>${solvedCount} of ${level.problems.length} problems complete</span><strong>${Math.round(solvedCount / level.problems.length * 100)}%</strong></div><div class="progress-track" role="progressbar" aria-label="Level ${level.number} progress" aria-valuemin="0" aria-valuemax="${level.problems.length}" aria-valuenow="${solvedCount}"><div class="progress-fill" style="width:${solvedCount / level.problems.length * 100}%"></div></div></div>
        <div class="problem-dots" role="group" aria-label="Problems in level ${level.number}">${level.problems.map((item, index) => {
          const itemLocked = !this.progress.settings.unrestrictedPractice && index > 0 && !this.progress.solved.includes(level.problems[index - 1].id) && !this.progress.solved.includes(item.id);
          const done = this.progress.solved.includes(item.id);
          return `<a class="problem-dot ${item.id === problem.id ? 'current' : ''} ${done ? 'done' : ''} ${itemLocked ? 'locked' : ''}" href="${itemLocked ? '#' : `#/problems/${item.id}`}" aria-label="Problem ${index + 1}${done ? ', completed' : ''}${itemLocked ? ', locked' : ''}" ${itemLocked ? 'aria-disabled="true" tabindex="-1"' : ''}>${done ? '✓' : index + 1}</a>`;
        }).join('')}</div>
      </section>
      ${locked ? '<div class="notice notice-warn">You are practicing ahead. Level unlocks still follow the sequence.</div>' : ''}
      ${isAssessment ? this.renderAssessmentBar(assessment) : ''}
      <div class="workspace-grid">
        <aside class="panel problem-rail" aria-label="Problems in this level">
          <div class="rail-heading"><h2>Level ${level.number} problems</h2><span>${solvedCount}/${level.problems.length}</span></div>
          <div class="problem-list">${level.problems.map((item, index) => {
            const isDone = this.progress.solved.includes(item.id);
            const isLocked = !this.progress.settings.unrestrictedPractice && index > 0 && !this.progress.solved.includes(level.problems[index - 1].id) && !isDone;
            return `<a class="problem-link ${item.id === problem.id ? 'active' : ''} ${isDone ? 'done' : ''} ${isLocked ? 'locked' : ''}" href="${isLocked ? '#' : `#/problems/${item.id}`}" ${isLocked ? 'aria-disabled="true" tabindex="-1"' : ''}>
              <span class="problem-number">${isDone ? '✓' : index + 1}</span><span class="problem-title">${escapeHTML(item.title)}</span><span class="problem-check">${isLocked ? '⌑' : isDone ? '✓' : ''}</span></a>`;
          }).join('')}</div>
          <div class="rail-bottom"><a href="#/levels">← All Levels</a></div>
        </aside>
        <section class="panel challenge-panel" aria-label="Problem description">
          <div class="challenge-meta"><span class="pill purple">LEVEL ${problem.level}</span><span class="pill">${escapeHTML(problem.difficulty)}</span><span class="pill">${escapeHTML(problem.topic)}</span>${this.progress.solved.includes(problem.id) ? '<span class="pill green">✓ Solved</span>' : ''}</div>
          <h2>${escapeHTML(problem.title)}</h2>
          <p class="challenge-description">${escapeHTML(problem.description)}</p>
          <section class="challenge-section"><h3>Input</h3><p>${escapeHTML(problem.inputFormat || 'Read the provided values from standard input.')}</p></section>
          <section class="challenge-section"><h3>Output</h3><p>${escapeHTML(problem.outputFormat || 'Print the result to standard output.')}</p></section>
          <section class="challenge-section"><h3>Example</h3><div class="example-grid">
            <div><span class="example-caption">Input</span><pre class="example-box">${escapeHTML(problem.examples?.[0]?.input ?? '')}</pre></div>
            <div><span class="example-caption">Output</span><pre class="example-box">${escapeHTML(problem.examples?.[0]?.output ?? '')}</pre></div>
          </div></section>
          ${problem.constraints?.length ? `<section class="challenge-section"><h3>Constraints</h3><ul>${problem.constraints.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul></section>` : ''}
          ${isAssessment ? '<div class="notice">Hints and explanations are disabled during an assessment.</div>' : `<details class="hint-box"><summary>Progressive hints <span id="hint-counter">${this.ui.hintIndex[problem.id] || 0}/5 revealed</span></summary><div class="hint-body"><p id="hint-content">${this.renderHint(problem)}</p><div class="hint-actions">${(this.ui.hintIndex[problem.id] || 0) < 5 ? `<button data-action="next-hint" data-id="${problem.id}">Reveal next hint</button>` : '<span>All hints revealed</span>'}<button data-action="show-solution" data-id="${problem.id}">Explain solution</button></div><div id="solution-details" hidden><p>${escapeHTML(problem.explanation || '')}</p><pre class="example-box">${escapeHTML(problem.referenceSolution || '')}</pre></div></div></details>`}
        </section>
        <section class="panel editor-panel" aria-label="Python coding workspace">
          <div class="editor-toolbar"><span class="file-tab">main.py</span><div class="editor-tools">
            <button class="icon-button" data-action="reset-code" aria-label="Reset code" title="Reset code">↺</button>
            <button class="icon-button" data-action="export-code" aria-label="Export Python file" title="Export Python file">⇩</button>
            <button class="icon-button" data-action="stop-code" aria-label="Stop Python execution" title="Stop execution" ${this.ui.running ? '' : 'disabled'}>■</button>
          </div></div>
          <div class="editor-frame" id="editor-frame" style="--editor-size:${Number(this.progress.settings.fontSize) || 14}px;--tab-size:${Number(this.progress.settings.tabSize) || 4}">
            <span class="sr-only" id="editor-label">Python source code for ${escapeHTML(problem.title)}</span>
            <span class="sr-only" id="editor-help">Use Escape to move focus to Run Code. Ctrl or Command plus Enter runs code; add Shift to submit.</span>
            <div id="editor-surface" aria-labelledby="editor-label" aria-describedby="editor-help"></div>
            <textarea class="code-editor-fallback" id="code-editor" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" wrap="${this.progress.settings.wordWrap ? 'soft' : 'off'}" aria-label="Python code editor">${escapeHTML(draft)}</textarea>
          </div>
          <div class="editor-status" aria-hidden="true"><span>Python</span><span id="editor-position">Ln 1, Col 1</span><span>UTF-8</span></div>
          <div class="custom-input"><label for="custom-stdin">Custom input</label><textarea id="custom-stdin" maxlength="50000" placeholder="Enter stdin for Run Code">${escapeHTML(this.ui.customInput || '')}</textarea><label class="custom-toggle"><input id="use-custom-input" type="checkbox" ${this.ui.useCustomInput ? 'checked' : ''}> Use this input for Run Code</label></div>
          <div class="editor-actions"><span class="execution-state ${this.ui.statusKind}" id="execution-state" role="status">${escapeHTML(this.ui.status || 'Ready · Python loads on first run')}</span>
            <div class="action-group"><button class="button button-run" data-action="run-code" ${this.ui.running ? 'disabled' : ''}>${retryRuntime ? '↻ Retry Python Runtime' : '▶ Run Code'}</button><button class="button button-primary" data-action="submit-code" ${this.ui.running ? 'disabled' : ''}>Submit Solution</button></div>
          </div>
          <div class="output-panel">
            <div class="output-tabs">
              <div class="output-tab-list" role="tablist" aria-label="Execution output">
              <button id="output-tab-tests" class="output-tab-button ${this.ui.outputTab === 'tests' ? 'active' : ''}" role="tab" aria-controls="output-body" aria-selected="${this.ui.outputTab === 'tests'}" tabindex="${this.ui.outputTab === 'tests' ? '0' : '-1'}" data-action="output-tab" data-tab="tests">Test cases (${problem.publicTestCases?.length || 0})</button>
              <button id="output-tab-console" class="output-tab-button ${this.ui.outputTab === 'console' ? 'active' : ''}" role="tab" aria-controls="output-body" aria-selected="${this.ui.outputTab === 'console'}" tabindex="${this.ui.outputTab === 'console' ? '0' : '-1'}" data-action="output-tab" data-tab="console">Console</button>
              </div><button class="button button-quiet" data-action="clear-console" style="margin-left:auto;min-height:44px;padding:0 8px">Clear console</button>
            </div><div class="output-body" id="output-body" role="tabpanel" tabindex="0" aria-labelledby="output-tab-${this.ui.outputTab}">${this.renderOutputBody(problem)}</div>
          </div>
        </section>
      </div>`;
  }

  renderHint(problem) {
    const count = this.ui.hintIndex[problem.id] || 0;
    return count ? escapeHTML(problem.hints?.[count - 1] || 'No more hints.') : 'Reveal hints one at a time when you need a nudge.';
  }

  renderTestCase(testCase, result, number, visibility) {
    const state = result ? (result.passed ? 'pass' : 'fail') : '';
    const status = result ? (result.passed ? 'Passed' : result.error || 'Failed') : 'Not run';
    const actual = result?.actual ?? 'Run or submit your code to see output.';
    return `<details class="test-case"><summary><span class="case-state ${state}" aria-hidden="true">${result ? result.passed ? '✓' : '!' : number}</span><strong>Test ${number}</strong><span class="case-status ${state}">${escapeHTML(status)}</span></summary>
      <div class="case-details"><div><small>Input</small><pre>${escapeHTML(testCase.input)}</pre></div><div><small>Expected</small><pre>${escapeHTML(testCase.output)}</pre></div><div><small>Actual</small><pre>${escapeHTML(actual)}</pre></div></div></details>`;
  }

  renderOutputBody(problem) {
    if (this.ui.outputTab === 'console') {
      return `<pre class="console-output">${escapeHTML(this.ui.consoleText || 'Console output will appear here.')}</pre>`;
    }
    const publicResults = this.ui.results.filter(item => item.visibility === 'public');
    const hiddenSummary = this.ui.results.filter(item => item.visibility === 'hidden' && item.passed).length;
    const hiddenTotal = this.ui.results.filter(item => item.visibility === 'hidden').length;
    return `${problem.publicTestCases.map((testCase, index) => this.renderTestCase(testCase, publicResults[index], index + 1, 'public')).join('')}
      ${problem.hiddenTestCases?.length ? `<div class="hidden-summary"><strong>Hidden tests</strong><span>${hiddenTotal ? `${hiddenSummary}/${hiddenTotal} passed` : `${problem.hiddenTestCases.length} hidden cases`}</span><small>Hidden inputs and expected answers are not shown.</small></div>` : ''}`;
  }

  updateOutputPanel() {
    const problem = problems.find(item => item.id === this.currentRoute?.id);
    const body = this.root.querySelector('#output-body');
    if (!problem || !body) return;
    for (const tab of this.root.querySelectorAll('[data-action="output-tab"]')) {
      const selected = tab.dataset.tab === this.ui.outputTab;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    body.setAttribute('aria-labelledby', `output-tab-${this.ui.outputTab}`);
    body.innerHTML = this.renderOutputBody(problem);
  }

  renderAssessmentBar(assessment) {
    const questionIds = assessment.questionIds || [];
    const currentIndex = Math.max(0, Math.min(assessment.currentIndex || 0, questionIds.length - 1));
    return `<section class="assessment-bar" aria-label="Interview assessment">
      <div><strong>Interview practice</strong><span id="assessment-clock">--:--</span></div>
      <div class="assessment-questions">${questionIds.map((id, index) => `<a class="assessment-question ${id === this.currentRoute.id ? 'active' : ''} ${assessment.answers?.[id] === true ? 'correct' : assessment.answers?.[id] === false ? 'incorrect' : ''}" href="#/problems/${id}" aria-label="Question ${index + 1}${assessment.answers?.[id] === true ? ', correct' : assessment.answers?.[id] === false ? ', incorrect' : ', unanswered'}">${index + 1}${assessment.answers?.[id] === true ? ' ✓' : ''}</a>`).join('')}</div>
      <div class="assessment-actions"><span>Question ${currentIndex + 1} of ${questionIds.length}</span><button class="button button-quiet" data-action="finish-assessment">Finish assessment</button></div>
    </section>`;
  }

  renderLevels() {
    const completedProblems = this.progress.solved.length;
    const percentage = Math.round(completedProblems / problems.length * 100);
    const selected = levels[this.ui.selectedLevel - 1] || levels[0];
    const query = this.ui.levelSearch.toLowerCase();
    const filteredLevels = levels.filter(level => {
      const match = `${level.number} ${level.title} ${level.topic} ${level.problems.map(problem => problem.title).join(' ')}`.toLowerCase().includes(query);
      const done = this.progress.completedLevels.includes(level.number);
      if (this.ui.levelFilter === 'completed' && !done) return false;
      if (this.ui.levelFilter === 'available' && (level.number > currentLevel(this.progress) && !this.progress.settings.unrestrictedPractice)) return false;
      return match;
    });
    const worlds = Array.from({ length: 10 }, (_, index) => {
      const worldNumber = index + 1;
      const worldLevels = filteredLevels.filter(level => level.stage === worldNumber);
      if (!worldLevels.length) return '';
      const done = worldLevels.filter(level => this.progress.completedLevels.includes(level.number)).length;
      const expanded = this.ui.expandedWorld === worldNumber || Boolean(query);
      return `<section class="world-card"><button class="world-toggle" data-action="toggle-world" data-world="${worldNumber}" aria-expanded="${expanded}"><span><strong>World ${worldNumber}: ${escapeHTML(stageNames[index][0])}</strong><br><small>${escapeHTML(stageNames[index][1])}</small></span><span class="world-count">${done}/10 complete · ${expanded ? '−' : '+'}</span></button>
        ${expanded ? `<div class="world-content"><div class="${this.ui.levelView === 'grid' ? 'level-grid' : 'level-list'}">${worldLevels.map(level => this.levelTile(level)).join('')}</div></div>` : ''}</section>`;
    }).join('');
    return `<section class="page-heading"><div><p class="eyebrow">YOUR CODING JOURNEY</p><h1>All Levels</h1><p>Explore ten worlds, one challenge at a time.</p></div><a class="button button-primary" href="#/problems/${this.mainProblemId()}">Continue Learning</a></section>
      <section class="levels-summary" aria-label="Overall progress">
        ${this.summaryItem('Current level', currentLevel(this.progress), 'of 100')}
        ${this.summaryItem('Levels complete', this.progress.completedLevels.length, 'of 100')}
        ${this.summaryItem('Problems solved', completedProblems, `of ${problems.length}`)}
        ${this.summaryItem('Journey complete', `${percentage}%`, 'real progress')}
      </section>
      <section class="level-controls"><label class="sr-only" for="level-search">Search levels and problems</label><input class="field" id="level-search" type="search" value="${escapeHTML(this.ui.levelSearch)}" placeholder="Search levels, topics, problems">
        <label class="sr-only" for="level-filter">Filter levels</label><select class="select-field" id="level-filter"><option value="all" ${this.ui.levelFilter === 'all' ? 'selected' : ''}>All levels</option><option value="available" ${this.ui.levelFilter === 'available' ? 'selected' : ''}>Available</option><option value="completed" ${this.ui.levelFilter === 'completed' ? 'selected' : ''}>Completed</option></select>
        <button class="button button-quiet" data-action="level-view" data-view="grid" aria-pressed="${this.ui.levelView === 'grid'}">Grid</button><button class="button button-quiet" data-action="level-view" data-view="list" aria-pressed="${this.ui.levelView === 'list'}">List</button>
      </section>
      <div class="world-list">${worlds || '<div class="surface-card">No levels match that search.</div>'}</div>
      <section class="surface-card selected-level"><div><h2>Level ${selected.number}: ${escapeHTML(selected.title)}</h2><p>${escapeHTML(selected.description)} · ${selected.problems.length} problems · ${selected.problems.filter(problem => this.progress.solved.includes(problem.id)).length} solved${this.levelCanStart(selected) ? '' : ' · Complete the previous level to unlock.'}</p></div>${this.levelCanStart(selected) ? `<a class="button button-primary" href="#/problems/${this.nextProblemInLevel(selected).id}">Start / Continue Level</a>` : '<button class="button button-quiet" disabled>Locked</button>'}</section>`;
  }

  summaryItem(label, value, suffix) {
    return `<div class="summary-item"><span>${label}</span><strong>${value}</strong><small>${suffix}</small></div>`;
  }

  levelTile(level) {
    const done = this.progress.completedLevels.includes(level.number);
    const current = level.number === currentLevel(this.progress);
    const locked = level.number > currentLevel(this.progress) && !this.progress.settings.unrestrictedPractice && !done;
    const state = done ? 'completed' : current ? 'current' : locked ? 'locked' : '';
    const icon = done ? '✓' : locked ? '🔒' : current ? 'CURRENT' : '';
    const disabled = locked ? 'disabled aria-disabled="true"' : '';
    return `<button class="level-tile ${state}" data-action="select-level" data-level="${level.number}" ${disabled}><span class="tile-icon">${icon}</span><span>${level.number}</span><span class="sr-only">Level ${level.number}, ${escapeHTML(level.title)}, ${done ? 'completed' : current ? 'current' : locked ? 'locked' : 'available'}</span></button>`;
  }

  nextProblemInLevel(level) {
    return level.problems.find(problem => !this.progress.solved.includes(problem.id)) || level.problems[0];
  }

  levelCanStart(level) {
    return level.number <= currentLevel(this.progress) || this.progress.settings.unrestrictedPractice;
  }

  renderDaily() {
    const problem = selectDailyProblem(problems);
    const date = localDateKey();
    this.progress.daily.date = date;
    this.progress.daily.problemId = problem?.id || '';
    this.progress.daily.contentRevision = problem?.contentRevision || 0;
    this.save();
    const completed = this.progress.daily.completedDates.includes(date);
    const rewardClaimed = this.progress.daily.rewardedDates.includes(date);
    return `<section class="page-heading"><div><p class="eyebrow">${escapeHTML(dateLabel(new Date()))}</p><h1>Daily Challenge</h1><p>A fresh challenge, selected from the full practice library each local day.</p></div><span class="pill ${completed ? 'green' : 'purple'}">${completed ? '✓ Completed today' : 'One challenge today'}</span></section>
      <article class="daily-card"><div><p class="eyebrow">TODAY'S CHALLENGE</p><h2>${escapeHTML(problem.title)}</h2><p>${escapeHTML(problem.topic)} · ${escapeHTML(problem.difficulty)} · ${problem.estimatedMinutes} min<br>${escapeHTML(problem.description)}</p></div><a class="button button-primary" href="#/problems/${problem.id}">${completed ? 'Review Challenge' : 'Start Challenge'}</a>
      <div class="daily-state" role="status">${completed ? `Completed ${dateLabel(new Date())}${rewardClaimed ? ' · Daily reward already claimed.' : ''}` : 'Complete this problem with a passing submission to record today’s challenge.'}</div></article>`;
  }

  renderInterview() {
    const active = this.progress.activeAssessment;
    if (active) {
      const remaining = Math.max(0, active.endsAt - Date.now());
      return `<section class="page-heading"><div><p class="eyebrow">PRACTICE ASSESSMENT</p><h1>Interview Practice</h1><p>Your assessment is saved locally and its timer keeps running across refreshes.</p></div></section>
        <article class="surface-card"><h2>${escapeHTML(active.preset)}</h2><p>${active.questionIds.length} questions · ${active.durationMinutes} minutes · PNC-style stdin/stdout</p><p><strong id="assessment-clock">${this.clockText(remaining)}</strong> remaining</p><div class="modal-actions"><a class="button button-primary" href="#/problems/${active.questionIds[active.currentIndex || 0]}">Resume Assessment</a><button class="button button-danger" data-action="finish-assessment">Finish Assessment</button></div></article>`;
    }
    return `<section class="page-heading"><div><p class="eyebrow">TIMED PYTHON PRACTICE</p><h1>Interview Practice</h1><p>Practice assessment-style problems using standard input and output.</p></div></section>
      <form class="surface-card assessment-form" id="assessment-form">
        <label class="form-control">Preset<select name="preset"><option>PNC-style stdin/stdout</option><option>Python Fundamentals</option><option>Strings and Lists</option><option>Interview Algorithms</option></select></label>
        <label class="form-control">Difficulty<select name="difficulty"><option value="any">Mixed practice</option><option>Very Easy</option><option>Beginner</option><option>Easy</option><option>Intermediate</option></select></label>
        <label class="form-control">Questions<select name="questions"><option value="3">3 questions</option><option value="5" selected>5 questions</option><option value="10">10 questions</option></select></label>
        <label class="form-control">Duration<select name="duration"><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option></select></label>
        <button class="button button-primary form-full" type="submit">Start Assessment</button>
      </form>
      ${this.progress.interviewResults.length ? `<section class="surface-card" style="margin-top:14px"><h2>Previous result</h2><p>${this.progress.interviewResults.length} assessment${this.progress.interviewResults.length === 1 ? '' : 's'} completed.</p><a class="button button-quiet" href="#/interview/results">Review latest result</a></section>` : ''}`;
  }

  renderInterviewResults() {
    const result = this.progress.interviewResults.at(-1);
    if (!result) return `<section class="surface-card"><h1>No assessment results yet</h1><a href="#/interview">Start Interview Practice</a></section>`;
    const score = assessmentScore(result);
    const questionIds = Array.isArray(result.questionIds) ? result.questionIds : [];
    const answers = result.answers && typeof result.answers === 'object' ? result.answers : {};
    return `<section class="page-heading"><div><p class="eyebrow">ASSESSMENT COMPLETE</p><h1>Practice Results</h1><p>${escapeHTML(result.preset)} · ${new Date(result.finishedAt).toLocaleString()}</p></div><a class="button button-quiet" href="#/interview">Done</a></section>
      <section class="result-grid">${this.summaryItem('Score', `${score.percentage}%`, `${score.correct}/${score.total} correct`)}${this.summaryItem('Correct', score.correct, 'questions')}${this.summaryItem('Incorrect', score.incorrect, 'questions')}${this.summaryItem('Unanswered', score.unanswered, 'questions')}</section>
      <section class="surface-card"><h2>Review answers</h2>${questionIds.map((id, index) => { const problem = problems.find(item => item.id === id); const answer = answers[id]; return `<article class="review-answer"><span class="pill ${answer === true ? 'green' : ''}">Question ${index + 1} · ${answer === true ? 'Correct' : answer === false ? 'Incorrect' : 'Unanswered'}</span><h3>${escapeHTML(problem?.title || id)}</h3><a href="#/problems/${encodeURIComponent(id)}">Review problem and solution →</a></article>`; }).join('')}</section>`;
  }

  renderSettings() {
    const settings = this.progress.settings;
    const toggle = (key, title, description = '') => `<label class="setting-row"><span>${title}${description ? `<small>${description}</small>` : ''}</span><input class="toggle" type="checkbox" data-setting="${key}" ${settings[key] ? 'checked' : ''} aria-label="${title}"></label>`;
    const select = (key, title, values) => `<label class="setting-row"><span>${title}</span><select class="setting-input" data-setting="${key}">${values.map(([value, label]) => `<option value="${value}" ${String(settings[key]) === String(value) ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`;
    const range = (key, title, description = '') => `<label class="setting-row setting-range"><span>${title}${description ? `<small>${description}</small>` : ''}<output data-value-for="${key}">${Math.round(settings[key] * 100)}%</output></span><input class="setting-input" type="range" min="0" max="1" step="0.01" data-setting="${key}" aria-label="${title}" aria-valuetext="${Math.round(settings[key] * 100)}%"></label>`;
    return `<section class="page-heading"><div><p class="eyebrow">PERSONALIZE YOUR WORKSPACE</p><h1>Settings</h1><p>Preferences and progress stay in this browser.</p></div></section>
      <div class="setting-grid">
        <section class="surface-card setting-card"><h2>Editor</h2>${toggle('lineNumbers','Show line numbers')}${select('fontSize','Editor font size',[[12,'12 px'],[14,'14 px'],[16,'16 px'],[18,'18 px'],[20,'20 px']])}${select('tabSize','Tab size',[[2,'2 spaces'],[4,'4 spaces'],[8,'8 spaces']])}${toggle('wordWrap','Word wrap')}${toggle('autoSave','Automatic draft saving','Save code as you type.')}${select('editorTheme','Editor theme',[['dark','Dark'],['light','Light']])}</section>
        <section class="surface-card setting-card"><h2>Audio &amp; Sound</h2>${toggle('musicEnabled','Background Music','Original ambient music starts only when enabled.')}${range('musicVolume','Music Volume')}${toggle('soundEnabled','Sound Effects')}${range('soundVolume','Sound Effects Volume')}${toggle('autoTrackSwitch','Automatic Track Switching')}${toggle('pauseMusicWhenHidden','Pause Music When Tab Is Hidden')}<div class="setting-row"><span>Preview sound</span><button class="button button-quiet" data-action="preview-sound">Play preview</button></div></section>
        <section class="surface-card setting-card"><h2>Game experience</h2>${toggle('reduceMotion','Reduce animations')}${toggle('showCelebrations','Show level celebrations')}${toggle('unrestrictedPractice','Unrestricted practice','Browse advanced problems without marking skipped work complete.')}${toggle('autoRun','Auto-run on problem start','Off by default; never submits or awards progress.')}</section>
        <section class="surface-card setting-card"><h2>Files and backups</h2><div class="setting-row"><span>Current solution</span><button class="button button-quiet" data-action="export-code">Export .py file</button></div><div class="setting-row"><span>Progress backup</span><button class="button button-quiet" data-action="export-backup">Export JSON</button></div><label class="setting-row"><span>Import a validated backup</span><input class="setting-input" id="backup-file" type="file" accept=".json,application/json"></label><div class="setting-row"><span>Start over<small>Removes XPC progress and saved code only.</small></span><button class="button button-danger" data-action="reset-progress">Reset progress</button></div></section>
        <section class="surface-card setting-card"><h2>Information & resources</h2><p class="muted-copy">Xavier's Python Challenge · completely free · no account or backend.</p><div class="resource-links"><button class="button button-quiet" data-action="info" data-info="About">About</button><button class="button button-quiet" data-action="info" data-info="Help">Help</button><button class="button button-quiet" data-action="info" data-info="Privacy">Privacy</button><button class="button button-quiet" data-action="info" data-info="Keyboard shortcuts">Keyboard shortcuts</button></div><p class="muted-copy">Python runs locally in a browser Web Worker using Pyodide loaded from jsDelivr. This is a practice environment, not a hardened sandbox.</p></section>
      </div>`;
  }

  handleClick(event) {
    const disabledLink = event.target.closest('a[aria-disabled="true"]');
    if (disabledLink) {
      event.preventDefault();
      return;
    }
    const button = event.target.closest('[data-action]');
    if (!button || !this.root.contains(button)) return;
    const action = button.dataset.action;
    if (action === 'sound-toggle') {
      this.updateSetting('soundEnabled', !this.progress.settings.soundEnabled, false);
      if (this.progress.settings.soundEnabled) playSound('click', this.progress.settings, true);
      this.render();
    } else if (action === 'music-playback') {
      if (audioController.getState().playing) {
        this.progress.settings.musicPaused = true;
        this.save();
        audioController.applySettings(this.progress.settings);
      } else {
        this.progress.settings.musicEnabled = true;
        this.progress.settings.musicPaused = false;
        this.save();
        audioController.applySettings(this.progress.settings);
      }
    } else if (action === 'music-mute') {
      this.updateSetting('musicMuted', !this.progress.settings.musicMuted, false);
    } else if (action === 'music-next') {
      if (!this.progress.settings.musicEnabled) {
        this.progress.settings.musicEnabled = true;
        this.progress.settings.musicPaused = false;
        this.save();
      }
      audioController.nextTrack();
      audioController.applySettings(this.progress.settings);
    } else if (action === 'run-code') this.executeCurrent(false);
    else if (action === 'submit-code') this.executeCurrent(true);
    else if (action === 'stop-code') this.cancelExecution();
    else if (action === 'reset-code') this.resetCode();
    else if (action === 'export-code') this.exportCode();
    else if (action === 'output-tab') {
      this.ui.outputTab = button.dataset.tab;
      this.updateOutputPanel();
    } else if (action === 'clear-console') {
      this.ui.consoleText = '';
      this.updateOutputPanel();
    } else if (action === 'next-hint') this.revealHint(button.dataset.id);
    else if (action === 'show-solution') this.confirmSolution(button.dataset.id);
    else if (action === 'toggle-world') {
      const world = Number(button.dataset.world);
      this.ui.expandedWorld = this.ui.expandedWorld === world ? 0 : world;
      this.render();
    } else if (action === 'select-level') {
      this.ui.selectedLevel = Number(button.dataset.level);
      this.render();
    } else if (action === 'level-view') {
      this.ui.levelView = button.dataset.view;
      this.render();
    } else if (action === 'finish-assessment') this.finishAssessment();
    else if (action === 'preview-sound') playSound('success', this.progress.settings, true);
    else if (action === 'export-backup') this.exportBackup();
    else if (action === 'reset-progress') this.resetProgress();
    else if (action === 'info') this.openInfo(button.dataset.info);
    else if (action === 'close-modal') this.closeModal();
    else if (action === 'continue-after-celebration') this.closeModal();
  }

  handleInput(event) {
    if (event.target.matches('[data-setting][type="range"]')) {
      this.updateSetting(event.target.dataset.setting, Number(event.target.value), false);
    } else if (event.target.id === 'code-editor') {
      const problem = problems.find(item => item.id === this.currentRoute.id);
      if (!problem) return;
      this.ui.drafts.set(problem.id, event.target.value);
      if (this.progress.settings.autoSave) {
        try { saveDraft(problem.id, event.target.value); }
        catch { this.toast('Draft could not be saved. Export your code to keep a copy.'); }
      }
    } else if (event.target.id === 'custom-stdin') {
      this.ui.customInput = event.target.value;
    } else if (event.target.id === 'level-search') {
      this.ui.levelSearch = event.target.value;
      const selection = event.target.selectionStart;
      this.render();
      const input = this.root.querySelector('#level-search');
      input?.focus();
      input?.setSelectionRange(selection, selection);
    }
  }

  handleChange(event) {
    if (event.target.id === 'level-filter') {
      this.ui.levelFilter = event.target.value;
      this.render();
      return;
    }
    if (event.target.id === 'use-custom-input') {
      this.ui.useCustomInput = event.target.checked;
      return;
    }
    if (event.target.id === 'backup-file' && event.target.files?.[0]) {
      this.importBackup(event.target.files[0]);
      return;
    }
    const key = event.target.dataset.setting;
    if (!key) return;
    if (event.target.type === 'range') return;
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    if (['fontSize', 'tabSize', 'soundVolume', 'musicVolume'].includes(key)) value = Number(value);
    this.updateSetting(key, value);
  }

  updateSetting(key, value, shouldRender = true) {
    if (key === 'musicEnabled') this.progress.settings.musicPaused = false;
    this.progress.settings[key] = value;
    if (key === 'autoSave' && value) {
      try {
        for (const [problemId, code] of this.ui.drafts) saveDraft(problemId, code);
      } catch {
        this.toast('One or more drafts could not be saved. Export your code to keep a copy.');
      }
    }
    this.save();
    if (['musicEnabled', 'musicPaused', 'musicMuted', 'musicVolume', 'autoTrackSwitch', 'pauseMusicWhenHidden', 'soundEnabled', 'soundVolume'].includes(key)) {
      audioController.applySettings(this.progress.settings);
    }
    if (key === 'soundEnabled' && value) playSound('click', this.progress.settings, true);
    if (key === 'musicVolume' || key === 'soundVolume') {
      for (const input of this.root.querySelectorAll(`[data-setting="${key}"]`)) {
        input.value = String(value);
        input.setAttribute('aria-valuetext', `${Math.round(Number(value) * 100)}%`);
      }
      for (const output of this.root.querySelectorAll(`[data-value-for="${key}"]`)) {
        output.value = `${Math.round(Number(value) * 100)}%`;
        output.textContent = `${Math.round(Number(value) * 100)}%`;
      }
    }
    if (shouldRender) this.render();
  }

  handleKeydown(event) {
    if (event.key === 'Escape' && this.root.querySelector('.modal-backdrop')) {
      this.closeModal();
      return;
    }
    if (event.key === 'Tab') {
      const modal = this.root.querySelector('.modal');
      if (modal) {
        const focusable = [...modal.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first) {
          event.preventDefault();
          modal.focus();
        } else if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    if (event.target.matches?.('[role="tab"][data-action="output-tab"]') &&
        ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const tabs = [...this.root.querySelectorAll('[role="tab"][data-action="output-tab"]')];
      const currentIndex = tabs.indexOf(event.target);
      const nextIndex = event.key === 'Home' ? 0
        : event.key === 'End' ? tabs.length - 1
          : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      this.ui.outputTab = tabs[nextIndex].dataset.tab;
      this.updateOutputPanel();
      tabs[nextIndex].focus();
    }
    if (event.target.id === 'code-editor') {
      if (event.key === 'Tab') {
        event.preventDefault();
        const editor = event.target;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const spaces = ' '.repeat(Number(this.progress.settings.tabSize) || 4);
        editor.setRangeText(spaces, start, end, 'end');
        editor.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (event.key === 'Enter' && !(event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        const editor = event.target;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const lineStart = editor.value.lastIndexOf('\n', start - 1) + 1;
        const currentLine = editor.value.slice(lineStart, start);
        const indent = currentLine.match(/^\s*/)?.[0] || '';
        const extraIndent = /:\s*(?:#.*)?$/.test(currentLine.trimEnd()) ? ' '.repeat(Number(this.progress.settings.tabSize) || 4) : '';
        editor.setRangeText(`\n${indent}${extraIndent}`, start, end, 'end');
        editor.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.executeCurrent(Boolean(event.shiftKey));
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.root.querySelector('[data-action="run-code"]')?.focus();
      }
    }
  }

  async handleSubmit(event) {
    if (event.target.id !== 'assessment-form') return;
    event.preventDefault();
    const data = new FormData(event.target);
    const count = Number(data.get('questions'));
    const preset = String(data.get('preset'));
    const presetIncludes = problem => {
      if (preset === 'Python Fundamentals') return problem.level <= 30;
      if (preset === 'Strings and Lists') return problem.level >= 31 && problem.level <= 60;
      if (preset === 'Interview Algorithms') return problem.level >= 71;
      return true;
    };
    const level = levels[currentLevel(this.progress) - 1] || levels[0];
    const filtered = problems.filter(problem =>
      presetIncludes(problem) &&
      (data.get('difficulty') === 'any' || problem.difficulty === data.get('difficulty'))
    );
    const preferred = [...level.problems.filter(problem => filtered.some(item => item.id === problem.id)), ...filtered]
      .filter((problem, index, list) => list.findIndex(item => item.id === problem.id) === index);
    const questionIds = preferred.slice(0, count).map(problem => problem.id);
    if (questionIds.length < count) {
      const candidates = problems.filter(problem =>
        presetIncludes(problem) &&
        (data.get('difficulty') === 'any' || problem.difficulty === data.get('difficulty')) &&
        !questionIds.includes(problem.id)
      );
      questionIds.push(...candidates.slice(0, count - questionIds.length).map(problem => problem.id));
    }
    this.progress.activeAssessment = {
      id: `assessment-${Date.now()}`,
      preset,
      durationMinutes: Number(data.get('duration')),
      startedAt: Date.now(),
      endsAt: Date.now() + Number(data.get('duration')) * 60000,
      questionIds,
      currentIndex: 0,
      answers: {},
      submissions: {}
    };
    this.save();
    location.hash = `#/problems/${questionIds[0]}`;
  }

  async executeCurrent(submit) {
    if (this.ui.running) return;
    const problem = problems.find(item => item.id === this.currentRoute.id);
    if (!problem || (!this.editor && !this.root.querySelector('#code-editor'))) return;
    const code = this.getEditorValue();
    this.ui.drafts.set(problem.id, code);
    if (this.progress.settings.autoSave) {
      try { saveDraft(problem.id, code); } catch { this.toast('Draft saving failed. Export your code before leaving.'); }
    }
    const custom = this.root.querySelector('#custom-stdin')?.value || '';
    this.ui.running = true;
    this.ui.status = submit ? 'Running public and hidden tests…' : 'Starting Python runtime…';
    this.ui.statusKind = '';
    this.ui.consoleText = '';
    this.ui.results = [];
    this.ui.outputTab = submit ? 'tests' : 'console';
    const runId = ++this.ui.runId;
    this.render();
    if (!submit) {
      const input = this.ui.useCustomInput ? custom : (problem.publicTestCases?.[0]?.input || '');
      try {
        const result = await runPython(code, input, {
          onReady: () => this.setExecutionStatus('Python runtime ready'),
          onOutput: (stream, text) => this.appendConsole(stream, text)
        });
        if (runId !== this.ui.runId) return;
        this.ui.consoleText = `${result.stdout}${result.stderr ? `\n[stderr]\n${result.stderr}` : ''}`;
        this.ui.status = 'Run complete · no progress or XP awarded';
        this.ui.statusKind = 'success';
      } catch (error) {
        if (runId !== this.ui.runId) return;
        this.ui.consoleText += `\n${error.message}`;
        this.ui.status = error.name === 'AbortError' ? 'Execution cancelled' : error.message;
        this.ui.statusKind = 'error';
      }
      this.ui.running = false;
      this.render();
      return;
    }

    const cases = [
      ...(problem.publicTestCases || []).map((testCase, index) => ({ ...testCase, visibility: 'public', number: index + 1 })),
      ...(problem.hiddenTestCases || []).map((testCase, index) => ({ ...testCase, visibility: 'hidden', number: index + 1 }))
    ];
    const results = [];
    let stoppedByError = false;
    for (const testCase of cases) {
      if (runId !== this.ui.runId) return;
      try {
        const result = await runPython(code, testCase.input, {
          timeout: 8000,
          onReady: () => this.setExecutionStatus('Python runtime ready'),
          onOutput: (stream, text) => {
            if (testCase.visibility === 'public') this.appendConsole(stream, text);
          }
        });
        const passed = normalizeOutput(result.stdout) === normalizeOutput(testCase.output);
        results.push({ ...testCase, actual: result.stdout, error: result.stderr, passed });
      } catch (error) {
        results.push({ ...testCase, actual: '', error: error.message, passed: false });
        if (error.name === 'AbortError' || /Time Limit|Output limit|Runtime initialization|Failed to fetch|NetworkError|importScripts failed|loadPyodide/i.test(error.message)) {
          stoppedByError = true;
          break;
        }
      }
      this.ui.results = [...results];
      this.render();
    }
    if (stoppedByError && results.length < cases.length) {
      for (const testCase of cases.slice(results.length)) results.push({ ...testCase, actual: '', error: 'Not run after execution limit.', passed: false });
    }
    if (runId !== this.ui.runId) return;
    this.ui.results = results;
    this.ui.running = false;
    const accepted = results.length === cases.length && results.every(result => result.passed);
    this.ui.status = accepted ? 'Accepted' : this.resultStatus(results);
    this.ui.statusKind = accepted ? 'success' : 'error';
    if (this.progress.activeAssessment) {
      const assessment = this.progress.activeAssessment;
      assessment.answers[problem.id] = accepted;
      assessment.submissions[problem.id] = code;
      assessment.questionRevisions = assessment.questionRevisions || {};
      assessment.questionRevisions[problem.id] = problem.contentRevision || 0;
      this.save();
      this.render();
      playSound(accepted ? 'success' : 'failure', this.progress.settings);
      return;
    }

    const before = this.progress.solved.includes(problem.id);
    const completion = accepted ? recordAccepted(this.progress, problem) : null;
    this.progress.submissions.push({
      problemId: problem.id, title: problem.title, accepted,
      date: new Date().toISOString(), code,
      failedTests: results.filter(result => !result.passed).length
    });
    this.progress.submissions = this.progress.submissions.slice(-200);
    this.save();
    const status = this.ui.status;
    this.render();
    this.ui.status = status;
    this.ui.statusKind = accepted ? 'success' : 'error';
    this.updateStatusInDOM(status, this.ui.statusKind);
    if (accepted && completion?.firstSolve) {
      if (completion.levelCompleted) {
        if (this.progress.settings.showCelebrations) this.showLevelCelebration(problem.level, completion.finalCompletion);
        else playSound(completion.finalCompletion ? 'milestone' : 'level', this.progress.settings);
      } else {
        playSound(completion.streakIncreased ? completion.streakStarted ? 'streak' : 'streak-increase' : 'success', this.progress.settings);
      }
      if (!completion.levelCompleted) this.toast(completion.dailyCompleted ? 'Accepted! Daily challenge complete · +15 XP.' : 'Accepted! Progress saved.');
    } else if (accepted) {
      playSound(completion?.streakIncreased ? completion.streakStarted ? 'streak' : 'streak-increase' : 'success', this.progress.settings);
      this.toast(completion?.dailyCompleted ? 'Daily challenge complete · +15 XP.' : 'Accepted again. Your completion reward is not repeated.');
    } else {
      playSound('failure', this.progress.settings);
    }
  }

  resultStatus(results) {
    const error = results.find(result => !result.passed)?.error || '';
    if (/SyntaxError/i.test(error)) return 'Syntax Error';
    if (/Time Limit/i.test(error)) return 'Time Limit Exceeded';
    if (/Output limit/i.test(error)) return 'Output Limit Exceeded';
    if (RUNTIME_LOAD_ERROR.test(error)) return 'Python Runtime Error';
    if (error && !/Not run after execution limit/.test(error)) return 'Runtime Error';
    return 'Wrong Answer';
  }

  setExecutionStatus(message) {
    if (!this.ui.running) return;
    const status = this.root.querySelector('#execution-state');
    if (status) status.textContent = message;
  }

  appendConsole(stream, text) {
    this.ui.consoleText += `${stream === 'stderr' ? '[stderr] ' : ''}${text}\n`;
    if (this.ui.consoleText.length > 50000) this.ui.consoleText = `${this.ui.consoleText.slice(0, 50000)}\nOutput truncated.`;
    const consoleOutput = this.root.querySelector('.console-output');
    if (consoleOutput && this.ui.outputTab === 'console') consoleOutput.textContent = this.ui.consoleText;
  }

  updateStatusInDOM(status, kind) {
    const element = this.root.querySelector('#execution-state');
    if (element) {
      element.textContent = status;
      element.className = `execution-state ${kind}`;
    }
  }

  cancelExecution() {
    if (!this.ui.running) return;
    this.ui.runId += 1;
    this.ui.running = false;
    stopPython();
    this.ui.status = 'Execution cancelled';
    this.ui.statusKind = 'error';
    this.render();
  }

  resetCode() {
    const problem = problems.find(item => item.id === this.currentRoute.id);
    if (!problem || !window.confirm('Replace this draft with the original starter code?')) return;
    this.ui.drafts.set(problem.id, problem.starterCode.stdin);
    try { saveDraft(problem.id, problem.starterCode.stdin); }
    catch { this.toast('Could not save the reset draft.'); }
    this.render();
  }

  revealHint(problemId) {
    const problem = problems.find(item => item.id === problemId);
    if (!problem) return;
    this.ui.hintIndex[problemId] = Math.min(problem.hints?.length || 0, (this.ui.hintIndex[problemId] || 0) + 1);
    this.render();
  }

  confirmSolution(problemId) {
    if (!window.confirm('Show the full solution? This will not replace your code.')) return;
    this.ui.solutionConfirmed = true;
    const solution = this.root.querySelector('#solution-details');
    if (solution) solution.hidden = false;
  }

  exportCode() {
    const problemId = this.currentRoute?.id || this.progress.lastProblemId || this.mainProblemId();
    const problem = problems.find(item => item.id === problemId);
    const currentDraft = problem ? getDraft(problem.id) : null;
    const code = this.currentRoute?.page === 'problem' && this.editorProblemId === problemId
      ? this.editor.getValue()
      : this.root.querySelector('#code-editor')?.value ??
      (problem && this.ui.drafts.has(problem.id) ? this.ui.drafts.get(problem.id) :
        currentDraft === null ? problem?.starterCode.stdin || '' : currentDraft);
    const slug = (problem?.title || 'solution').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
    this.download(code, `level-${String(problem?.level || 1).padStart(2, '0')}-${slug}.py`, 'text/x-python');
  }

  exportBackup() {
    this.download(JSON.stringify(exportBackup(this.progress), null, 2), 'xpc-progress-backup.json', 'application/json');
  }

  download(content, filename, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async importBackup(file) {
    try {
      if (file.size > 2_000_000) throw new RangeError('Backup is too large (maximum 2 MB).');
      const backup = JSON.parse(await file.text());
      const next = validateBackup(backup);
      if (!window.confirm('Replace current Xavier’s Python Challenge progress with this backup?')) return;
      this.progress = next;
      this.ensureProgress();
      this.progress.problemsByLevel = Object.fromEntries(levels.map(level => [level.number, level.problems.map(problem => problem.id)]));
      this.save();
      this.toast('Backup restored.');
      this.render();
    } catch (error) {
      console.error('Backup import rejected.', error);
      this.toast(`Backup was not imported: ${error.message}`);
    } finally {
      const input = this.root.querySelector('#backup-file');
      if (input) input.value = '';
    }
  }

  resetProgress() {
    if (!window.confirm('Reset all Xavier’s Python Challenge progress and saved drafts? Other browser data will not be changed.')) return;
    try {
      clearApplicationData();
    } catch (error) {
      console.error('Could not clear saved progress.', error);
      this.toast('Progress could not be reset because browser storage is unavailable.');
      return;
    }
    this.progress = createDefaultProgress();
    this.ensureProgress();
    location.replace(`#/problems/${problems[0].id}`);
    this.toast('Progress and saved drafts were reset.');
    this.render();
  }

  openInfo(title) {
    const content = {
      About: '<p>A free, local-first Python coding game. It is not affiliated with any bank, school, or employer.</p>',
      Help: '<p>Write Python in the editor. Run Code uses the first example or your custom stdin. Submit Solution checks public and hidden cases. Use Ctrl/Cmd+Enter to run and Ctrl/Cmd+Shift+Enter to submit. Tab inserts indentation; press Escape to move from the editor to Run Code.</p><p>Python initializes from the pinned Pyodide CDN on first use and requires an internet connection.</p>',
      Privacy: '<p>Progress and drafts remain in this browser unless you export them. Python code is executed locally in a Web Worker; it is not sent to a judging server.</p><p>Browser Python is not a hardened security sandbox, and client-side hidden tests can be inspected.</p>',
      'Keyboard shortcuts': '<p><kbd>Ctrl/Cmd + Enter</kbd> Run Code<br><kbd>Ctrl/Cmd + Shift + Enter</kbd> Submit Solution<br><kbd>Tab</kbd> Insert indentation in the editor<br><kbd>Escape</kbd> Move from the editor to Run Code, or close a dialog</p>'
    };
    this.showModal(title, content[title] || '<p>Information unavailable.</p>', 'Close');
  }

  showLevelCelebration(levelNumber, finalCompletion) {
    const level = levels[levelNumber - 1];
    const milestone = MILESTONES.includes(levelNumber);
    const heading = finalCompletion
      ? 'Congratulations! You’ve completed all 100 levels of Xavier’s Python Challenge.'
      : milestone ? `Milestone ${levelNumber}!` : 'Level Complete';
    const next = finalCompletion
      ? `<a class="button button-primary" href="#/levels">Review Problems</a><a class="button button-quiet" href="#/interview">Practice Interviews</a>`
      : `<a class="button button-primary" href="#/problems/${levels[levelNumber]?.problems[0]?.id || level.problems[0].id}">Continue to Level ${levelNumber + 1}</a>`;
    this.showModal(`<span class="trophy" aria-hidden="true">🏆</span><span class="milestone-number">${levelNumber}</span><h2>${heading}</h2><p>Level ${levelNumber}: ${escapeHTML(level.title)} · ${level.problems.length} problems completed.</p><div class="celebration-progress"><span style="width:${levelNumber}%"></span></div><div class="modal-actions">${next}<button class="button button-quiet" data-action="close-modal">All Levels</button></div>`, '', 'Continue', true, milestone ? 3800 : 2400);
    playSound(finalCompletion ? 'milestone' : 'level', this.progress.settings);
  }

  showModal(title, body, closeLabel = 'Close', celebratory = false, duration = 0) {
    const overlay = this.root.querySelector('#overlay-root');
    if (!overlay) return;
    this.previousFocus = document.activeElement;
    const content = celebratory
      ? title.replace('<h2>', '<h2 id="modal-title">')
      : `<h2 id="modal-title">${escapeHTML(title)}</h2>${body}`;
    overlay.innerHTML = `<div class="modal-backdrop" role="presentation"><section class="modal ${celebratory ? 'milestone-modal' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"><button class="icon-button modal-close" data-action="close-modal" aria-label="Close dialog">×</button><div id="modal-content">${content}</div>${!celebratory ? `<div class="modal-actions"><button class="button button-primary" data-action="close-modal">${escapeHTML(closeLabel)}</button></div>` : ''}</section></div>`;
    const modal = overlay.querySelector('.modal');
    modal?.focus();
    if (celebratory) celebrate(modal, this.progress.settings.reduceMotion, duration);
  }

  closeModal() {
    const overlay = this.root.querySelector('#overlay-root');
    if (overlay) overlay.innerHTML = '';
    this.previousFocus?.focus?.();
  }

  getEditorValue() {
    return this.editor?.getValue() ?? this.root.querySelector('#code-editor')?.value ?? '';
  }

  saveEditorDraft(problemId, code) {
    const problem = problems.find(item => item.id === problemId);
    if (!problem) return;
    this.ui.drafts.set(problem.id, code);
    if (this.progress.settings.autoSave) {
      try { saveDraft(problem.id, code); }
      catch { this.toast('Draft could not be saved. Export your code to keep a copy.'); }
    }
  }

  captureAndDestroyEditor() {
    if (!this.editor) return;
    const cursor = this.editor.getCursorPosition();
    this.ui.editorCursors.set(this.editorProblemId, cursor);
    this.saveEditorDraft(this.editorProblemId, this.editor.getValue());
    this.editor.destroy();
    this.editor = null;
    this.editorProblemId = null;
  }

  updateEditorSettings() {
    const host = this.root.querySelector('#editor-surface');
    const fallback = this.root.querySelector('#code-editor');
    const problem = problems.find(item => item.id === this.currentRoute?.id);
    if (!host || !fallback || !problem) return;
    const settings = this.progress.settings;
    const savedDraft = getDraft(problem.id);
    const code = this.ui.drafts.has(problem.id)
      ? this.ui.drafts.get(problem.id)
      : savedDraft === null ? problem.starterCode.stdin : savedDraft;
    fallback.value = code;
    const ace = window.ace;
    if (!ace) {
      host.hidden = true;
      fallback.hidden = false;
      fallback.setAttribute('aria-label', `Python code editor for ${problem.title}`);
      return;
    }

    const assetPath = new URL('./public/vendor/ace/', document.baseURI).href;
    ace.config.set('basePath', assetPath);
    ace.config.set('modePath', assetPath);
    ace.config.set('themePath', assetPath);
    const editor = ace.edit(host);
    this.editor = editor;
    this.editorProblemId = problem.id;
    host.hidden = false;
    host.setAttribute('role', 'textbox');
    host.setAttribute('aria-multiline', 'true');
    host.setAttribute('aria-label', `Python code editor for ${problem.title}`);
    fallback.hidden = true;
    const frame = this.root.querySelector('#editor-frame');
    frame?.classList.add('ace-ready');
    editor.setTheme(settings.editorTheme === 'light' ? 'ace/theme/chrome' : 'ace/theme/tomorrow_night');
    editor.session.setMode('ace/mode/python');
    editor.session.setUseWorker(false);
    editor.setOptions({
      fontSize: `${Number(settings.fontSize) || 14}px`,
      tabSize: Number(settings.tabSize) || 4,
      useSoftTabs: true,
      showGutter: Boolean(settings.lineNumbers),
      showLineNumbers: Boolean(settings.lineNumbers),
      showPrintMargin: false,
      highlightActiveLine: true,
      highlightGutterLine: true,
      displayIndentGuides: true,
      showFoldWidgets: true,
      behavioursEnabled: true,
      wrap: Boolean(settings.wordWrap),
      useWorker: false
    });
    editor.renderer.setPadding(14);
    editor.renderer.setScrollMargin(14, 14, 0, 0);
    editor.setValue(code, -1);
    const textInput = editor.textInput?.getElement();
    textInput?.setAttribute('aria-label', `Python code editor for ${problem.title}`);
    textInput?.setAttribute('aria-describedby', 'editor-help');
    textInput?.setAttribute('aria-multiline', 'true');
    textInput?.setAttribute('autocapitalize', 'off');
    textInput?.setAttribute('autocomplete', 'off');
    textInput?.setAttribute('autocorrect', 'off');
    textInput?.setAttribute('spellcheck', 'false');
    editor.commands.addCommand({
      name: 'xpc-run-code',
      bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
      exec: () => this.executeCurrent(false)
    });
    editor.commands.addCommand({
      name: 'xpc-submit-code',
      bindKey: { win: 'Ctrl-Shift-Enter', mac: 'Command-Shift-Enter' },
      exec: () => this.executeCurrent(true)
    });
    editor.commands.addCommand({
      name: 'xpc-focus-run-button',
      bindKey: 'Esc',
      exec: () => this.root.querySelector('[data-action="run-code"]')?.focus()
    });
    editor.commands.addCommand({
      name: 'xpc-toggle-comment',
      bindKey: { win: 'Ctrl-/', mac: 'Command-/' },
      exec: activeEditor => activeEditor.toggleCommentLines()
    });
    editor.session.on('change', () => this.saveEditorDraft(problem.id, editor.getValue()));
    editor.selection.on('changeCursor', () => this.updateEditorPosition(editor));
    const cursor = this.ui.editorCursors.get(problem.id);
    if (cursor) editor.moveCursorToPosition(cursor);
    this.updateEditorPosition(editor);
  }

  updateEditorPosition(editor = this.editor) {
    const element = this.root.querySelector('#editor-position');
    if (!element || !editor) return;
    const cursor = editor.getCursorPosition();
    element.textContent = `Ln ${cursor.row + 1}, Col ${cursor.column + 1}`;
  }

  updateAudioControls(state) {
    const status = this.root.querySelector('#music-control-status');
    const playbackStatus = this.root.querySelector('#music-playback-status');
    const track = this.root.querySelector('#music-track-name');
    const playButton = this.root.querySelector('[data-action="music-playback"]');
    const muteButton = this.root.querySelector('[data-action="music-mute"]');
    if (status) status.textContent = state.playing ? state.muted ? 'Music muted' : 'Music on' : state.status === 'blocked' ? 'Tap to start' : 'Music off';
    if (playbackStatus) {
      playbackStatus.textContent = state.playing ? state.muted ? 'Playing (muted)' : 'Playing' : state.status === 'blocked'
        ? 'Playback is waiting for a user gesture.'
        : state.status === 'unavailable' ? 'Audio is not available in this browser.' : 'Paused';
    }
    if (track) track.textContent = state.track;
    if (playButton) {
      playButton.setAttribute('aria-label', state.playing ? 'Pause background music' : 'Play background music');
      playButton.setAttribute('aria-pressed', String(state.playing));
      playButton.textContent = state.playing ? 'Ⅱ' : '▶';
    }
    if (muteButton) {
      muteButton.setAttribute('aria-label', state.muted ? 'Unmute background music' : 'Mute background music');
      muteButton.setAttribute('aria-pressed', String(state.muted));
    }
  }

  toast(message) {
    const region = this.root.querySelector('#toast-region');
    if (!region) return;
    const node = document.createElement('div');
    node.className = 'toast-message';
    node.setAttribute('role', 'status');
    node.textContent = message;
    region.append(node);
    window.setTimeout(() => node.remove(), 4200);
  }

  clockText(milliseconds) {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  updateAssessmentClock() {
    const assessment = this.progress.activeAssessment;
    if (!assessment) return;
    const remaining = assessment.endsAt - Date.now();
    const clock = this.root.querySelector('#assessment-clock');
    if (clock) clock.textContent = this.clockText(remaining);
    if (remaining <= 0 && this.currentRoute?.page !== 'interview-results') this.finishAssessment(true);
  }

  finishAssessment(expired = false) {
    const assessment = this.progress.activeAssessment;
    if (!assessment) return;
    const result = { ...assessment, finishedAt: Date.now(), expired };
    this.progress.interviewResults.push(result);
    this.progress.interviewResults = this.progress.interviewResults.slice(-20);
    this.progress.activeAssessment = null;
    this.save();
    location.hash = '#/interview/results';
    this.render();
    this.toast(expired ? 'Assessment time expired. Your answers were saved.' : 'Assessment finished. Your results are ready.');
  }
}
