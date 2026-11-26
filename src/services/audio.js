const TRACKS = [
  { name: 'Coding Focus', base: 48, chords: [0, 5, 9, 7], notes: [12, 16, 19, 16, 23, 19, 16, 12, 14, 17, 21, 17, 24, 21, 17, 14], tempo: 1700, waveform: 'sine' },
  { name: 'Digital Exploration', base: 45, chords: [0, 7, 10, 5], notes: [12, 19, 22, 19, 26, 22, 19, 14, 17, 24, 27, 24, 29, 24, 19, 17], tempo: 1350, waveform: 'triangle' },
  { name: 'Deep Concentration', base: 43, chords: [0, 3, 8, 5], notes: [12, 15, 20, 15, 22, 20, 15, 12, 13, 17, 20, 17, 24, 20, 17, 13], tempo: 2200, waveform: 'sine' },
  { name: 'Level Up', base: 50, chords: [0, 7, 5, 9], notes: [12, 19, 24, 19, 26, 24, 19, 16, 14, 21, 26, 21, 28, 24, 21, 17], tempo: 1250, waveform: 'triangle' }
];

const EFFECTS = {
  click: [[480, 0.045]],
  select: [[620, 0.06]],
  failure: [[220, 0.11]],
  success: [[523, 0.12], [659, 0.14], [784, 0.2]],
  level: [[440, 0.12], [587, 0.15], [784, 0.18], [988, 0.24]],
  streak: [[587, 0.07], [784, 0.11]],
  'streak-increase': [[523, 0.08], [659, 0.1], [880, 0.16]],
  milestone: [[523, 0.15], [659, 0.18], [784, 0.2], [1047, 0.25], [1319, 0.42]]
};

const INITIAL_SETTINGS = {
  musicEnabled: false,
  musicPaused: false,
  musicMuted: false,
  musicVolume: 0.2,
  autoTrackSwitch: true,
  pauseMusicWhenHidden: true,
  soundEnabled: true,
  soundVolume: 0.4
};

export class AudioController {
  constructor() {
    this.settings = { ...INITIAL_SETTINGS };
    this.listeners = new Set();
    this.context = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.activeTrack = null;
    this.trackIndex = 0;
    this.noteIndex = 0;
    this.playing = false;
    this.startPromise = null;
    this.status = 'off';
    this.lastEffectAt = new Map();
    this.autoSwitchTimer = 0;
    this.duckTimer = 0;
    this.wasPlayingWhenHidden = false;
    this.visibilityHandler = () => this.handleVisibilityChange();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState() {
    return {
      status: this.status,
      track: TRACKS[this.trackIndex].name,
      trackIndex: this.trackIndex,
      trackCount: TRACKS.length,
      playing: this.playing,
      enabled: this.settings.musicEnabled,
      muted: this.settings.musicMuted
    };
  }

  notify() {
    const state = this.getState();
    for (const listener of this.listeners) listener(state);
  }

  applySettings(settings) {
    this.settings = { ...INITIAL_SETTINGS, ...settings };
    this.updateMusicGain();
    this.updateSfxGain();
    if (this.settings.musicEnabled && !this.settings.musicPaused) {
      this.startMusic();
    } else {
      this.pauseMusic(this.settings.musicEnabled ? 'paused' : 'off');
    }
    this.notify();
  }

  ensureContext() {
    if (this.context) return this.context;
    if (typeof window === 'undefined') {
      this.status = 'unavailable';
      return null;
    }
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      this.status = 'unavailable';
      this.notify();
      return null;
    }
    this.context = new AudioContextConstructor();
    this.musicBus = this.context.createGain();
    this.sfxBus = this.context.createGain();
    this.musicBus.gain.value = 0;
    this.sfxBus.gain.value = Math.min(1, Math.max(0, Number(this.settings.soundVolume) || 0));
    this.musicBus.connect(this.context.destination);
    this.sfxBus.connect(this.context.destination);
    document.addEventListener('visibilitychange', this.visibilityHandler);
    return this.context;
  }

  async unlock() {
    if (!this.settings.musicEnabled && !this.settings.soundEnabled) return;
    try {
      const context = this.ensureContext();
      if (context?.state === 'suspended') await context.resume();
      if (this.settings.musicEnabled && !this.settings.musicPaused && !this.playing) await this.startMusic();
    } catch (error) {
      this.handlePlaybackError(error);
    }
  }

  async startMusic() {
    if (!this.settings.musicEnabled || this.settings.musicPaused || this.playing) return;
    if (this.startPromise) return this.startPromise;
    const attempt = this.startMusicAttempt();
    if (this.playing) return;
    this.startPromise = attempt;
    try {
      await attempt;
    } finally {
      if (this.startPromise === attempt) this.startPromise = null;
    }
  }

  async startMusicAttempt() {
    try {
      const context = this.ensureContext();
      if (!context) return;
      if (context.state !== 'running') await context.resume();
      if (!this.settings.musicEnabled || this.settings.musicPaused) return;
      if (context.state !== 'running') throw new Error('Audio playback is waiting for a user gesture.');
      this.playing = true;
      this.status = 'playing';
      this.startTrack();
      this.updateMusicGain(0.7);
      this.scheduleTrackSwitch();
      this.notify();
    } catch (error) {
      if (!this.settings.musicEnabled || this.settings.musicPaused) return;
      this.playing = false;
      this.status = error.name === 'NotAllowedError' ? 'blocked' : 'unavailable';
      this.handlePlaybackError(error);
    }
  }

  handlePlaybackError(error) {
    if (error?.name === 'NotAllowedError' || this.context?.state === 'suspended') {
      this.status = 'blocked';
    } else if (this.status !== 'unavailable') {
      this.status = 'unavailable';
    }
    console.warn('Audio playback could not start.', error);
    this.notify();
  }

  updateMusicGain(ramp = 0.18) {
    if (!this.context || !this.musicBus) return;
    const volume = this.settings.musicEnabled && !this.settings.musicMuted
      ? Math.min(1, Math.max(0, Number(this.settings.musicVolume) || 0)) * (this.duckTimer ? 0.3 : 1)
      : 0;
    const gain = this.musicBus.gain;
    gain.cancelScheduledValues(this.context.currentTime);
    gain.setTargetAtTime(volume, this.context.currentTime, Math.max(0.015, ramp / 4));
  }

  updateSfxGain(ramp = 0.08) {
    if (!this.context || !this.sfxBus) return;
    const gain = this.sfxBus.gain;
    gain.cancelScheduledValues(this.context.currentTime);
    gain.setTargetAtTime(Math.min(1, Math.max(0, Number(this.settings.soundVolume) || 0)), this.context.currentTime, Math.max(0.015, ramp / 4));
  }

  startTrack() {
    const context = this.context;
    const track = TRACKS[this.trackIndex];
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.setTargetAtTime(0.7, context.currentTime, 0.65);
    gain.connect(this.musicBus);
    const voices = [];
    const oscillators = [];
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1250;
    filter.Q.value = 0.35;
    filter.connect(gain);
    for (const [offset, volume] of [[0, 0.013], [7, 0.007], [12, 0.004]]) {
      const oscillator = context.createOscillator();
      const voiceGain = context.createGain();
      oscillator.type = track.waveform;
      oscillator.frequency.value = this.midiFrequency(track.base + offset);
      voiceGain.gain.value = volume;
      oscillator.connect(voiceGain);
      voiceGain.connect(filter);
      oscillator.start();
      oscillators.push(oscillator);
      voices.push(oscillator, voiceGain);
    }
    const node = { gain, filter, voices, oscillators, interval: 0, cleanupTimer: 0 };
    const scheduleNote = () => {
      if (!this.playing || this.activeTrack !== node) return;
      const chord = track.chords[Math.floor(this.noteIndex / 8) % track.chords.length];
      const offset = track.notes[this.noteIndex % track.notes.length];
      this.noteIndex += 1;
      if (this.noteIndex % 32 === 0) this.noteIndex = 0;
      if (offset === undefined) return;
      const note = context.createOscillator();
      const envelope = context.createGain();
      const now = context.currentTime;
      note.type = track.waveform;
      note.frequency.setValueAtTime(this.midiFrequency(track.base + chord + offset), now);
      envelope.gain.setValueAtTime(0.0001, now);
      envelope.gain.exponentialRampToValueAtTime(0.012, now + 0.18);
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
      note.connect(envelope);
      envelope.connect(gain);
      note.start(now);
      note.stop(now + 2.85);
      oscillators.push(note);
      voices.push(note, envelope);
      window.setTimeout(() => {
        const index = voices.indexOf(note);
        if (index >= 0) voices.splice(index, 2);
        const oscillatorIndex = oscillators.indexOf(note);
        if (oscillatorIndex >= 0) oscillators.splice(oscillatorIndex, 1);
      }, 3000);
    };
    node.interval = window.setInterval(scheduleNote, track.tempo);
    this.activeTrack = node;
  }

  midiFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  retireTrack(node, fadeSeconds = 1.8) {
    if (!node) return;
    window.clearInterval(node.interval);
    if (!this.context) return;
    const now = this.context.currentTime;
    node.gain.gain.cancelScheduledValues(now);
    node.gain.gain.setTargetAtTime(0.0001, now, fadeSeconds / 4);
    node.cleanupTimer = window.setTimeout(() => {
      for (const oscillator of node.oscillators) {
        try { oscillator.stop(); } catch { /* An already-ended voice needs no cleanup. */ }
      }
      for (const voice of node.voices) voice.disconnect();
      node.filter.disconnect();
      node.gain.disconnect();
    }, fadeSeconds * 1000 + 100);
  }

  switchTrack(index) {
    this.trackIndex = (index + TRACKS.length) % TRACKS.length;
    this.noteIndex = 0;
    window.clearTimeout(this.autoSwitchTimer);
    this.retireTrack(this.activeTrack);
    this.activeTrack = null;
    if (this.playing) this.startTrack();
    this.scheduleTrackSwitch();
    this.notify();
  }

  nextTrack() {
    this.switchTrack(this.trackIndex + 1);
  }

  scheduleTrackSwitch() {
    window.clearTimeout(this.autoSwitchTimer);
    if (!this.playing || !this.settings.autoTrackSwitch) return;
    this.autoSwitchTimer = window.setTimeout(() => this.nextTrack(), 180_000);
  }

  pauseMusic(status = 'paused') {
    this.playing = false;
    window.clearTimeout(this.autoSwitchTimer);
    const track = this.activeTrack;
    this.activeTrack = null;
    this.retireTrack(track, 0.7);
    this.status = status;
    this.updateMusicGain(0.5);
    this.notify();
  }

  async togglePlayback() {
    if (this.playing) {
      this.settings.musicPaused = true;
      this.pauseMusic('paused');
      return;
    }
    this.settings.musicPaused = false;
    await this.startMusic();
  }

  toggleMute() {
    this.settings.musicMuted = !this.settings.musicMuted;
    this.updateMusicGain();
    this.notify();
    return this.settings.musicMuted;
  }

  handleVisibilityChange() {
    if (document.hidden && this.settings.pauseMusicWhenHidden && this.playing) {
      this.wasPlayingWhenHidden = true;
      this.pauseMusic('paused');
    } else if (!document.hidden && this.wasPlayingWhenHidden) {
      this.wasPlayingWhenHidden = false;
      if (this.settings.musicEnabled && !this.settings.musicPaused) this.startMusic();
    }
  }

  duckMusic(duration = 2400) {
    if (!this.playing) return;
    window.clearTimeout(this.duckTimer);
    this.duckTimer = window.setTimeout(() => {
      this.duckTimer = 0;
      this.updateMusicGain(0.6);
    }, duration);
    this.updateMusicGain(0.25);
  }

  playEffect(kind, settings = this.settings, force = false) {
    if (!force && !settings.soundEnabled) return;
    const now = Date.now();
    if (now - (this.lastEffectAt.get(kind) || 0) < 180) return;
    this.lastEffectAt.set(kind, now);
    try {
      const context = this.ensureContext();
      if (!context || !this.sfxBus) return;
      if (context.state === 'suspended') context.resume().catch(error => this.handlePlaybackError(error));
      const pattern = EFFECTS[kind] || EFFECTS.click;
      const volume = 0.12;
      let offset = 0;
      for (const [frequency, duration] of pattern) {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const start = context.currentTime + offset;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        envelope.gain.setValueAtTime(0.0001, start);
        envelope.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), start + 0.018);
        envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(envelope);
        envelope.connect(this.sfxBus);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
        oscillator.addEventListener('ended', () => {
          oscillator.disconnect();
          envelope.disconnect();
        }, { once: true });
        offset += duration * 0.72;
      }
      if (kind === 'level' || kind === 'milestone') this.duckMusic(kind === 'milestone' ? 3600 : 2400);
    } catch (error) {
      this.status = 'unavailable';
      console.warn('Sound effects are unavailable in this browser.', error);
      this.notify();
    }
  }
}

export const audioController = new AudioController();

export function playSound(kind, settings = {}, force = false) {
  audioController.playEffect(kind, settings, force);
}
