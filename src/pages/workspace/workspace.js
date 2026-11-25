import { saveProgress } from '../../services/storage.js';
import { createIcons, icons } from 'lucide';

let monaco;
let editor;
let worker;
let runCounter = 0;

function normalizeOutput(output) {
  return output.replace(/\r\n/g, '\n').replace(/\n+$/, '').replace(/[ \t]+\n/g, '\n');
}

export async function WorkspacePage(id, problems, progress) {
  const problem = problems.find(p => p.id === id) || problems[0];
  const currentIndex = problems.findIndex(p => p.id === problem.id);
  const previous = problems[Math.max(0, currentIndex - 1)];
  const next = problems[Math.min(problems.length - 1, currentIndex + 1)];
  setTimeout(() => initWorkspace(problem, progress), 0);
  return `
    <div class="workspace">
      <div class="workspace-header"><div><a href="#problems"><i data-lucide="ArrowLeft"></i> Problem Library</a><span>${problem.topic}</span></div><div><a class="icon-button" href="#workspace/${previous.id}" aria-label="Previous problem"><i data-lucide="ChevronLeft"></i></a><span>${currentIndex + 1} / ${problems.length}</span><a class="icon-button" href="#workspace/${next.id}" aria-label="Next problem"><i data-lucide="ChevronRight"></i></a></div></div>
      <div class="workspace-grid">
        <section class="problem-pane" aria-label="Problem description">
          <div class="problem-meta"><span class="difficulty">${problem.difficulty}</span><span>${problem.topic}</span><span>${problem.xpReward} XP</span></div>
          <h1>${problem.title}</h1>
          <div class="problem-section"><h2>Description</h2><p>${problem.description}</p></div>
          <div class="problem-section"><h2>Input</h2><pre>${problem.inputFormat}</pre></div>
          <div class="problem-section"><h2>Output</h2><pre>${problem.outputFormat}</pre></div>
          <div class="problem-section"><h2>Example</h2><div class="example"><span>Input</span><pre>${problem.examples[0].input}</pre><span>Output</span><pre>${problem.examples[0].output}</pre></div></div>
          <div class="problem-section"><h2>Constraints</h2><ul>${problem.constraints.map(c=>`<li>${c}</li>`).join('')}</ul></div>
          <details class="hints"><summary>Reveal a hint</summary>${problem.hints.map((hint,i)=>`<p><strong>Hint ${i+1}</strong> ${hint}</p>`).join('')}<button id="confirm-solution" class="text-button">Confirm reveal: full solution</button><pre id="full-solution" hidden>${problem.referenceSolution}</pre></details>
        </section>
        <section class="editor-pane" aria-label="Code editor">
          <div class="editor-toolbar"><div><span class="file-tab">solution.py</span><span class="runtime-label"><i data-lucide="Circle" class="status-dot"></i> Python 3</span></div><div><button id="editor-reset" class="icon-button" title="Reset starter code" aria-label="Reset starter code"><i data-lucide="RotateCcw"></i></button><button id="editor-download" class="icon-button" title="Download Python file" aria-label="Download Python file"><i data-lucide="Download"></i></button></div></div>
          <div id="monaco-editor" class="monaco-editor"></div>
          <div class="editor-actions"><span id="engine-status">Loading Python runtime...</span><div><button id="stop-run" class="button secondary" disabled>Stop</button><button id="run-code" class="button run">Run Code</button><button id="submit-code" class="button primary">Submit</button></div></div>
        </section>
      </div>
      <section class="output-panel" aria-label="Code output">
        <div class="output-tabs" role="tablist"><button class="active" role="tab" data-tab="test">Test Cases</button><button role="tab" data-tab="custom">Custom Input</button><button role="tab" data-tab="console">Console</button><button role="tab" data-tab="results">Submission Results</button></div>
        <div class="output-content"><div id="tab-test" class="output-tab active">${problem.publicTestCases.map((tc,i)=>`<div class="test-result" data-test="${i}"><div><strong>Test Case ${i+1}</strong><span>Not run</span></div><small>Input: ${tc.input.trim()}</small><small>Expected: ${tc.output}</small></div>`).join('')}</div><div id="tab-custom" class="output-tab"><label>Custom input<textarea id="custom-input" rows="5" placeholder="Enter stdin here">${progress.settings?.defaultCustomInput || ''}</textarea></label></div><div id="tab-console" class="output-tab"><pre id="console-output" aria-live="polite">Ready.</pre></div><div id="tab-results" class="output-tab"><div id="submission-results">No submission yet.</div></div></div>
      </section>
    </div>`;
}

async function initWorkspace(problem, progress) {
  try { createIcons({icons}); } catch {}
  if (!worker) worker = new Worker(new URL('../../workers/python.worker.js', import.meta.url));
  worker.onmessage = handleWorkerMessage;

  try {
    const saved = localStorage.getItem(`pylevel-draft-${problem.id}`);
    const [{ default: monacoApi }] = await Promise.all([import('monaco-editor')]);
    monaco = monacoApi;
    monaco.editor.defineTheme('pylevel-dark', { base:'vs-dark', inherit:true, rules:[{token:'',foreground:'E5E7EB'}], colors:{'editor.background':'#090e17','editorLineNumber.foreground':'#536176','editor.lineHighlightBackground':'#111827','editor.selectionBackground':'#8b5cf64d'} });
    editor = monaco.editor.create(document.getElementById('monaco-editor'), {
      value: saved || problem.starterCode.stdin,
      language:'python',
      theme:'pylevel-dark',
      fontSize: progress.settings?.fontSize || 14,
      minimap:{enabled:false},
      automaticLayout:true,
      wordWrap:'on',
      lineNumbers:'on',
      padding:{top:16,bottom:16}
    });
    document.getElementById('engine-status').textContent = 'Python runtime ready';
  } catch (error) {
    document.getElementById('engine-status').textContent = 'Editor unavailable';
  }

  editor?.onDidChangeModelContent(() => {
    clearTimeout(editor.saveTimer);
    editor.saveTimer = setTimeout(() => localStorage.setItem(`pylevel-draft-${problem.id}`, editor.getValue()), 500);
  });

  document.querySelectorAll('.output-tabs button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.output-tabs button').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.output-tab').forEach(t=>t.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(`tab-${button.dataset.tab}`).classList.add('active');
  }));
  document.getElementById('editor-reset')?.addEventListener('click', () => {
    if (confirm('Reset this editor to the starter code?')) editor.setValue(problem.starterCode.stdin);
  });
  document.getElementById('editor-download')?.addEventListener('click', () => {
    const blob = new Blob([editor.getValue()], {type:'text/x-python'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='solution.py'; a.click(); URL.revokeObjectURL(url);
  });
  document.getElementById('confirm-solution')?.addEventListener('click', () => {
    if (confirm('Reveal the full solution?')) document.getElementById('full-solution').hidden = false;
  });
  document.getElementById('run-code')?.addEventListener('click', () => runCode(problem, false));
  document.getElementById('submit-code')?.addEventListener('click', () => runCode(problem, true));
  document.getElementById('stop-run')?.addEventListener('click', stopExecution);
}

function stopExecution() {
  if (worker) worker.terminate();
  worker = null;
  document.getElementById('engine-status').textContent = 'Execution cancelled';
  document.getElementById('stop-run').disabled = true;
  document.getElementById('console-output').textContent = 'Execution cancelled.';
}

let pendingRun;
function runCode(problem, submit) {
  if (!editor) return;
  if (!worker) worker = new Worker(new URL('../../workers/python.worker.js', import.meta.url));
  worker.onmessage = handleWorkerMessage;
  const cases = submit ? [...problem.publicTestCases, ...problem.hiddenTestCases] : [problem.publicTestCases[0]];
  const custom = document.getElementById('custom-input')?.value;
  pendingRun = { problem, submit, cases, index:0, passed:0, results:[], code:editor.getValue(), output:'', customInput:custom };
  document.getElementById('engine-status').textContent = 'Running...';
  document.getElementById('stop-run').disabled = false;
  document.querySelector('[data-tab="console"]')?.click();
  document.getElementById('console-output').textContent = 'Executing Python...\n';
  executeNextCase(custom);
}

function executeNextCase(customInput) {
  if (!pendingRun) return;
  const { problem, cases, index, code } = pendingRun;
  if (index >= cases.length) return finishRun();
  const tc = cases[index];
  const input = pendingRun.submit ? tc.input : (pendingRun.customInput?.trim() ? pendingRun.customInput : tc.input);
  pendingRun.output = '';
  const id = ++runCounter;
  pendingRun.currentId = id;
  worker.postMessage({ id, code, input, timeout:8000 });
}

function handleWorkerMessage(event) {
  if (!pendingRun) return;
  const message = event.data;
  if (message.id !== pendingRun.currentId) return;
  if (message.type === 'stdout') {
    pendingRun.output += message.text + '\n';
    document.getElementById('console-output').textContent = pendingRun.output;
  }
  if (message.type === 'stderr') {
    document.getElementById('console-output').textContent += message.text + '\n';
  }
  if (message.type === 'error' || message.type === 'complete') {
    const tc = pendingRun.cases[pendingRun.index];
    const actual = normalizeOutput(pendingRun.output);
    const expected = normalizeOutput(tc.output);
    const passed = message.type === 'complete' && actual === expected;
    pendingRun.results.push({ tc, actual, passed, error: message.error || '' });
    if (passed) pendingRun.passed++;
    pendingRun.index++;
    executeNextCase(document.getElementById('custom-input')?.value);
  }
}

function finishRun() {
  const run = pendingRun;
  pendingRun = null;
  document.getElementById('engine-status').textContent = run.passed === run.cases.length ? 'Accepted' : 'Wrong Answer';
  document.getElementById('stop-run').disabled = true;
  const accepted = run.passed === run.cases.length;
  const visibleResults = run.submit ? run.results.filter((_,i)=>i<run.problem.publicTestCases.length) : run.results;
  document.getElementById('submission-results').innerHTML = `<div class="submission-summary ${accepted?'success':'failure'}"><strong>${accepted?'Accepted':'Submission rejected'}</strong><span>${run.passed}/${run.cases.length} test cases passed</span></div>${visibleResults.map((r,i)=>`<div class="test-detail"><div><strong>Test ${i+1}</strong><span class="${r.passed?'accepted':'failed'}">${r.passed?'Passed':'Failed'}</span></div><small>Expected: ${r.tc.output}</small><small>Actual: ${r.actual || '(no output)'}</small>${r.error?`<small class="error-text">${r.error}</small>`:''}</div>`).join('')}`;
  document.querySelector('[data-tab="results"]')?.click();

  const progress = JSON.parse(localStorage.getItem('pylevel-progress') || '{}');
  progress.profile ||= { name:'Learner', level:1, xp:0, streak:0 };
  progress.solved ||= [];
  progress.submissions ||= [];
  progress.submissions.push({problemId:run.problem.id,title:run.problem.title,accepted,date:new Date().toISOString(),code:run.code});
  if (accepted && !progress.solved.includes(run.problem.id)) {
    progress.solved.push(run.problem.id);
    progress.profile.xp = (progress.profile.xp || 0) + run.problem.xpReward;
  }
  saveProgress(progress);
}
