import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearApplicationData, createDefaultProgress, getDraft, progressSnapshot,
  normalizeProgress, saveDraft, validateBackup
} from '../../src/services/storage.js';

class MemoryStorage {
  values = new Map();
  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

describe('browser progress storage', () => {
  beforeEach(() => vi.stubGlobal('localStorage', new MemoryStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it('migrates the legacy progress key and preserves saved empty drafts', () => {
    localStorage.setItem('pylevel-progress', JSON.stringify({ solved: ['legacy-problem'] }));
    expect(progressSnapshot().solved).toEqual(['legacy-problem']);
    expect(localStorage.getItem('xpc-progress')).not.toBeNull();

    saveDraft('level-01-problem-1', '');
    expect(getDraft('level-01-problem-1')).toBe('');
  });

  it('rejects invalid backups and ignores removed-feature fields during restoration', () => {
    expect(() => validateBackup({ version: 2, progress: {} })).toThrow(/version 1/);
    expect(() => validateBackup({ version: 1, progress: {} })).toThrow(/recognized progress data/);
    const restored = validateBackup({
      version: 1,
      progress: {
        profile: { level: 10, xp: 25, streak: 3 },
        settings: { fontSize: 16, autoRun: false, editorTheme: 'light', removedFeature: true },
        solved: ['known', 'known'],
        completedLevels: [2, 3, 2],
        dashboard: { inventedXp: 500 }
      }
    });

    expect(restored.profile).toMatchObject({ level: 10, xp: 25, streak: 3 });
    expect(restored.settings).toMatchObject({ fontSize: 16, autoRun: false, editorTheme: 'light' });
    expect(restored.settings.removedFeature).toBeUndefined();
    expect(restored.dashboard).toBeUndefined();
    expect(restored.solved).toEqual(['known']);
    expect(restored.completedLevels).toEqual([2, 3]);
    expect(() => validateBackup({
      version: 1,
      progress: { completedLevels: [101] }
    })).toThrow(/invalid completed-level list/);
    expect(() => validateBackup({
      version: 1,
      progress: { solved: ['valid', 42] }
    })).toThrow(/invalid solved-problem list/);
    expect(() => validateBackup({
      version: 1,
      progress: { settings: { autoRun: 'yes' } }
    })).toThrow(/invalid autoRun setting/);

    const locallyNormalized = normalizeProgress({
      profile: { level: 999, xp: -5, streak: 'many' },
      settings: { fontSize: 1000, autoRun: 'yes', editorTheme: 'neon' }
    });
    expect(locallyNormalized.profile).toMatchObject({ level: 100, xp: 0, streak: 0 });
    expect(locallyNormalized.settings).toMatchObject({ fontSize: 14, autoRun: false, editorTheme: 'dark' });
  });

  it('only removes application progress and code drafts on reset', () => {
    localStorage.setItem('xpc-progress', '{}');
    localStorage.setItem('pylevel-draft-level-1', 'print(1)');
    localStorage.setItem('xpc-draft-level-1', 'print(2)');
    localStorage.setItem('unrelated-app-data', 'keep');

    clearApplicationData();

    expect(localStorage.getItem('xpc-progress')).toBeNull();
    expect(localStorage.getItem('pylevel-draft-level-1')).toBeNull();
    expect(localStorage.getItem('xpc-draft-level-1')).toBeNull();
    expect(localStorage.getItem('unrelated-app-data')).toBe('keep');
  });

  it('creates a complete default profile for new visitors', () => {
    expect(progressSnapshot()).toEqual(createDefaultProgress());
  });
});
