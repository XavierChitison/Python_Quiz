import { afterEach, describe, expect, it, vi } from 'vitest';
import { AudioController } from '../../src/services/audio.js';

class FakeParam {
  value = 0;
  setValueAtTime(value) { this.value = value; }
  setTargetAtTime(value) { this.value = value; }
  exponentialRampToValueAtTime(value) { this.value = value; }
  cancelScheduledValues() {}
}

class FakeAudioNode {
  constructor() {
    this.gain = new FakeParam();
    this.frequency = new FakeParam();
    this.Q = new FakeParam();
    this.listeners = new Map();
  }
  connect() {}
  disconnect() {}
  start() { this.startCount = (this.startCount || 0) + 1; }
  stop() {}
  addEventListener(name, listener) { this.listeners.set(name, listener); }
}

class FakeAudioContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  nodes = [];
  resumeError = null;
  resumeGate = null;
  createGain() { return this.addNode(new FakeAudioNode()); }
  createOscillator() { return this.addNode(new FakeAudioNode()); }
  createBiquadFilter() { return this.addNode(new FakeAudioNode()); }
  async resume() {
    if (this.resumeError) throw this.resumeError;
    if (this.resumeGate) await this.resumeGate;
    this.state = 'running';
  }
  addNode(node) {
    this.nodes.push(node);
    return node;
  }
}

function installAudioEnvironment({ resumeError = null, resumeGate = null } = {}) {
  const contexts = [];
  const fakeWindow = {
    AudioContext: class extends FakeAudioContext {
      constructor() {
        super();
        this.resumeError = resumeError;
        this.resumeGate = resumeGate;
        if (resumeError || resumeGate) this.state = 'suspended';
        contexts.push(this);
      }
    },
    setTimeout: (...args) => globalThis.setTimeout(...args),
    clearTimeout: (...args) => globalThis.clearTimeout(...args),
    setInterval: (...args) => globalThis.setInterval(...args),
    clearInterval: (...args) => globalThis.clearInterval(...args)
  };
  const fakeDocument = { hidden: false, addEventListener: vi.fn() };
  vi.stubGlobal('window', fakeWindow);
  vi.stubGlobal('document', fakeDocument);
  return { contexts, fakeDocument };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('original browser audio controller', () => {
  it('starts only when opted in and keeps a single context across tracks', async () => {
    const { contexts } = installAudioEnvironment();
    const audio = new AudioController();
    audio.applySettings({ musicEnabled: false });
    expect(audio.getState().playing).toBe(false);
    expect(contexts).toHaveLength(0);

    audio.applySettings({ musicEnabled: true, musicVolume: 0.2, autoTrackSwitch: false });
    await Promise.resolve();
    expect(audio.getState()).toMatchObject({ playing: true, track: 'Coding Focus' });
    audio.nextTrack();
    expect(audio.getState()).toMatchObject({ playing: true, track: 'Digital Exploration' });
    expect(contexts).toHaveLength(1);
    audio.pauseMusic();
    expect(audio.getState().playing).toBe(false);
  });

  it('honors volume, pause-on-hidden, and explicit resume preferences', async () => {
    const { contexts, fakeDocument } = installAudioEnvironment();
    const audio = new AudioController();
    audio.applySettings({ musicEnabled: true, musicVolume: 0.2, autoTrackSwitch: false });
    const context = contexts[0];
    expect(audio.musicBus.gain.value).toBe(0.2);

    audio.applySettings({ musicEnabled: true, musicVolume: 0.65, autoTrackSwitch: false });
    expect(audio.musicBus.gain.value).toBe(0.65);
    fakeDocument.hidden = true;
    audio.handleVisibilityChange();
    expect(audio.getState().playing).toBe(false);
    fakeDocument.hidden = false;
    audio.handleVisibilityChange();
    await Promise.resolve();
    expect(audio.getState().playing).toBe(true);

    audio.applySettings({ musicEnabled: true, musicPaused: true, musicVolume: 0.65 });
    expect(audio.getState().playing).toBe(false);
    await audio.togglePlayback();
    expect(audio.getState().playing).toBe(true);
    expect(context).toBe(contexts[0]);
    audio.pauseMusic('paused');
  });

  it('starts only one track after rapid settings changes during audio resume', async () => {
    let resolveResume;
    const resumeGate = new Promise(resolve => { resolveResume = resolve; });
    const { contexts } = installAudioEnvironment({ resumeGate });
    const audio = new AudioController();

    audio.applySettings({ musicEnabled: true, autoTrackSwitch: false });
    audio.applySettings({ musicEnabled: false, autoTrackSwitch: false });
    audio.applySettings({ musicEnabled: true, autoTrackSwitch: false });
    resolveResume();

    await vi.waitFor(() => expect(audio.getState()).toMatchObject({ playing: true, status: 'playing' }));
    expect(contexts[0].nodes.filter(node => node.startCount > 0)).toHaveLength(3);
    audio.pauseMusic('off');
  });

  it('does not start music if it is disabled while audio resume is pending', async () => {
    let resolveResume;
    const resumeGate = new Promise(resolve => { resolveResume = resolve; });
    const { contexts } = installAudioEnvironment({ resumeGate });
    const audio = new AudioController();

    audio.applySettings({ musicEnabled: true, autoTrackSwitch: false });
    audio.applySettings({ musicEnabled: false, autoTrackSwitch: false });
    resolveResume();

    await vi.waitFor(() => expect(audio.getState()).toMatchObject({ playing: false, status: 'off' }));
    expect(contexts[0].nodes.filter(node => node.startCount > 0)).toHaveLength(0);
  });

  it('reports autoplay blocking and recovers on a later user gesture', async () => {
    const { contexts } = installAudioEnvironment({
      resumeError: Object.assign(new Error('Audio playback requires a user gesture.'), { name: 'NotAllowedError' })
    });
    const audio = new AudioController();
    audio.applySettings({ musicEnabled: true });
    await vi.waitFor(() => expect(audio.getState().status).toBe('blocked'));
    expect(audio.getState().playing).toBe(false);

    contexts[0].resumeError = null;
    contexts[0].state = 'suspended';
    await audio.unlock();
    expect(audio.getState()).toMatchObject({ playing: true, status: 'playing' });
    audio.pauseMusic('paused');
  });

  it('switches tracks on its automatic timer when that preference is enabled', async () => {
    vi.useFakeTimers();
    installAudioEnvironment();
    const audio = new AudioController();
    audio.applySettings({ musicEnabled: true, autoTrackSwitch: true });
    expect(audio.getState().track).toBe('Coding Focus');
    await vi.advanceTimersByTimeAsync(180_000);
    expect(audio.getState().track).toBe('Digital Exploration');
    audio.pauseMusic('paused');
  });

  it('does not create sound when effects are disabled and applies their volume live', () => {
    const { contexts } = installAudioEnvironment();
    const audio = new AudioController();
    audio.playEffect('success', { soundEnabled: false, soundVolume: 0.4 });
    expect(contexts).toHaveLength(0);

    audio.applySettings({ soundEnabled: true, soundVolume: 0.4 });
    audio.playEffect('success');
    const context = contexts[0];
    expect(audio.sfxBus.gain.value).toBe(0.4);
    audio.playEffect('success');
    const scheduledOscillators = context.nodes.filter(node => node.frequency).length;
    expect(scheduledOscillators).toBeGreaterThan(0);
    audio.applySettings({ soundEnabled: true, soundVolume: 0.8 });
    expect(audio.sfxBus.gain.value).toBe(0.8);
  });
});
