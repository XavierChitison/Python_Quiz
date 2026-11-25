let pyodideReady = null;

async function getPyodide() {
  if (!pyodideReady) {
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js');
    pyodideReady = loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/' });
  }
  return pyodideReady;
}

self.onmessage = async event => {
  const { id, code, input = '', timeout = 8000 } = event.data;
  let timeoutId;
  try {
    const pyodide = await Promise.race([
      getPyodide(),
      new Promise((_, reject) => { timeoutId = setTimeout(() => reject(new Error('Runtime initialization timeout')), timeout); })
    ]);
    clearTimeout(timeoutId);
    pyodide.setStdout({ batched: text => self.postMessage({ id, type: 'stdout', text }) });
    pyodide.setStderr({ batched: text => self.postMessage({ id, type: 'stderr', text }) });

    const escaped = JSON.stringify(input);
    await pyodide.runPythonAsync(`
import sys, io
_pylevel_stdin = io.StringIO(${escaped})
sys.stdin = _pylevel_stdin
`);
    const result = await Promise.race([
      pyodide.runPythonAsync(code),
      new Promise((_, reject) => { timeoutId = setTimeout(() => reject(new Error('Time Limit Exceeded')), timeout); })
    ]);
    clearTimeout(timeoutId);
    self.postMessage({ id, type: 'complete', stdout: '', stderr: '', result: result == null ? null : String(result) });
  } catch (error) {
    clearTimeout(timeoutId);
    const message = error && error.message ? error.message : String(error);
    self.postMessage({ id, type: 'error', error: message });
  }
};
