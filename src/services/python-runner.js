const MAX_SOURCE_LENGTH = 50000;
const MAX_INPUT_LENGTH = 50000;
const MAX_OUTPUT_LENGTH = 50000;
const RUNTIME_INITIALIZATION_TIMEOUT = 60000;
let worker = null;
let requestId = 0;
let activeRequest = null;

function createWorker() {
  worker = new Worker(new URL('../workers/python.worker.js?v=2.4.2', import.meta.url));
  worker.onmessage = handleWorkerMessage;
  worker.onerror = event => {
    const error = new Error(event.message || 'The Python worker failed.');
    worker?.terminate();
    worker = null;
    settleActive(error);
  };
}

function settleActive(error, result) {
  if (!activeRequest) return;
  clearTimeout(activeRequest.timer);
  const active = activeRequest;
  activeRequest = null;
  if (error) active.reject(error);
  else active.resolve(result);
}

function handleWorkerMessage(event) {
  const message = event.data;
  if (!activeRequest || message.id !== activeRequest.id) return;
  if (message.type === 'ready') {
    clearTimeout(activeRequest.timer);
    activeRequest.timer = setTimeout(() => {
      worker?.terminate();
      worker = null;
      settleActive(new Error('Time Limit Exceeded.'));
    }, activeRequest.timeout);
    activeRequest.onReady?.();
  } else if (message.type === 'stdout' || message.type === 'stderr') {
    const stream = message.type;
    activeRequest[stream] += `${message.text}\n`;
    activeRequest.onOutput?.(stream, message.text);
    if (activeRequest.stdout.length + activeRequest.stderr.length > MAX_OUTPUT_LENGTH) {
      worker?.terminate();
      worker = null;
      settleActive(new Error('Output limit exceeded (50,000 characters).'));
    }
  } else if (message.type === 'output-limit') {
    worker?.terminate();
    worker = null;
    settleActive(new Error('Output limit exceeded (50,000 characters).'));
  } else if (message.type === 'complete') {
    settleActive(null, { stdout: activeRequest.stdout, stderr: activeRequest.stderr });
  } else if (message.type === 'error') {
    settleActive(new Error(message.error || 'Python execution failed.'));
  }
}

export function runPython(code, input = '', options = {}) {
  if (activeRequest) return Promise.reject(new Error('Python is already running.'));
  if (typeof code !== 'string' || code.length > MAX_SOURCE_LENGTH) {
    return Promise.reject(new Error('Python code must be a string under 50,000 characters.'));
  }
  if (typeof input !== 'string' || input.length > MAX_INPUT_LENGTH) {
    return Promise.reject(new Error('Input must be under 50,000 characters.'));
  }
  if (typeof Worker === 'undefined') return Promise.reject(new Error('This browser does not support Web Workers.'));
  if (!worker) createWorker();
  const id = ++requestId;
  const timeout = Math.min(Math.max(Number(options.timeout) || 8000, 1000), 15000);
  return new Promise((resolve, reject) => {
    activeRequest = {
      id, resolve, reject, stdout: '', stderr: '',
      timeout,
      onReady: options.onReady,
      onOutput: options.onOutput,
      timer: setTimeout(() => {
        worker?.terminate();
        worker = null;
        settleActive(new Error('Python Runtime initialization timed out. Check your internet connection and retry.'));
      }, RUNTIME_INITIALIZATION_TIMEOUT)
    };
    worker.postMessage({ id, code, input, timeout, maxOutput: MAX_OUTPUT_LENGTH });
  });
}

export function stopPython() {
  if (worker) worker.terminate();
  worker = null;
  settleActive(new DOMException('Execution cancelled.', 'AbortError'));
}
