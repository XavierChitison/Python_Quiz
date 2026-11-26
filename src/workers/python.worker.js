const PYODIDE_VERSION = '0.27.2';
const OUTPUT_LIMIT = 50000;
let pyodidePromise;

async function loadRuntime() {
  if (!pyodidePromise) {
    const root = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
    importScripts(`${root}pyodide.js`);
    pyodidePromise = loadPyodide({ indexURL: root });
  }
  return pyodidePromise;
}

self.onmessage = async event => {
  const { id, code, input = '' } = event.data;
  let outputLength = 0;
  let outputExceeded = false;
  try {
    let pyodide;
    try {
      pyodide = await loadRuntime();
    } catch (error) {
      pyodidePromise = null;
      throw error;
    }
    self.postMessage({ id, type: 'ready' });
    const sendOutput = type => text => {
      outputLength += text.length;
      if (outputLength > OUTPUT_LIMIT) {
        if (!outputExceeded) self.postMessage({ id, type: 'output-limit' });
        outputExceeded = true;
        return;
      }
      self.postMessage({ id, type, text });
    };
    pyodide.setStdout({ batched: sendOutput('stdout') });
    pyodide.setStderr({ batched: sendOutput('stderr') });
    pyodide.globals.set('_xpc_input', input);
    pyodide.globals.set('_xpc_code', code);
    let result;
    try {
      result = await pyodide.runPythonAsync(`
import io, sys
sys.stdin = io.StringIO(_xpc_input)
exec(compile(_xpc_code, '<solution>', 'exec'), {'__name__': '__main__'})
`);
    } finally {
      pyodide.globals.delete('_xpc_input');
      pyodide.globals.delete('_xpc_code');
      if (result && typeof result.destroy === 'function') result.destroy();
    }
    if (!outputExceeded) self.postMessage({ id, type: 'complete' });
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      error: error && error.message ? error.message : String(error)
    });
  }
};
