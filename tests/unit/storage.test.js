import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearApplicationData, createDefaultProgress, exportBackup, getDraft, progressSnapshot,
  normalizeProgress, saveDraft, validateBackup
} from '../../src/services/storage.js';
import { recordAccepted } from '../../src/services/progression.js';
import { problems } from '../../src/data/curriculum.js';

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
    const currentLevel = problems.filter(problem => problem.level === 1);
    const currentIds = currentLevel.map(problem => problem.id);
    const restored = validateBackup({
      version: 1,
      progress: {
        profile: { level: 10, xp: 25, streak: 3 },
        settings: { fontSize: 16, autoRun: false, editorTheme: 'light', removedFeature: true },
        solved: ['known', 'known', ...currentIds, 'level-20-problem-1', 'level-30-problem-5', 'level-40-problem-1', 'level-45-problem-1', 'level-50-problem-1', 'level-60-problem-1', 'level-70-problem-1'],
        solvedRevisions: Object.fromEntries(currentLevel.map(problem => [problem.id, problem.contentRevision])),
        completedLevels: [1, 20, 30, 40, 45, 50, 60, 70, 1],
        dashboard: { inventedXp: 500 }
      }
    });

    expect(restored.profile).toMatchObject({ level: 10, xp: 25, streak: 3 });
    expect(restored.settings).toMatchObject({ fontSize: 16, autoRun: false, editorTheme: 'light' });
    expect(restored.settings.removedFeature).toBeUndefined();
    expect(restored.dashboard).toBeUndefined();
    expect(restored.solved).toEqual(['known', ...currentIds]);
    expect(restored.historicalSolved).toEqual(['level-20-problem-1', 'level-30-problem-5', 'level-40-problem-1', 'level-45-problem-1', 'level-50-problem-1', 'level-60-problem-1', 'level-70-problem-1']);
    expect(restored.completedLevels).toEqual([1]);
    expect(restored.historicalCompletedLevels).toEqual([20, 30, 40, 45, 50, 60, 70]);
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

  it('archives old completions without losing drafts, unlocks, assessment code, or daily rewards', () => {
    const changed = 'level-01-problem-2';
    const changedFirst = 'level-01-problem-1';
    const unchanged = 'level-01-problem-3';
    const date = '2025-04-10';
    localStorage.setItem('xpc-progress', JSON.stringify({
      profile: { level: 5, xp: 100 },
      solved: [unchanged, changed, changedFirst],
      solvedRevisions: { [unchanged]: 1 },
      completedLevels: [1],
      daily: { date, problemId: changed, completedDates: [date], rewardedDates: [date] },
      activeAssessment: {
        questionIds: [changed], endsAt: Date.now() + 100000,
        answers: { [changed]: true }, submissions: { [changed]: 'old assessment code' }
      }
    }));
    saveDraft(changed, 'old saved code');
    saveDraft(changedFirst, 'print("Hello, World!")');
    const migrated = progressSnapshot();

    expect(migrated.solved).toEqual([unchanged]);
    expect(migrated.historicalSolved).toEqual([changed, changedFirst]);
    expect(migrated.completedLevels).toEqual([]);
    expect(migrated.historicalCompletedLevels).toEqual([1]);
    expect(migrated.profile).toMatchObject({ level: 5, xp: 100 });
    expect(getDraft(changed)).toBe('old saved code');
    expect(getDraft(changedFirst)).toBe('print("Hello, World!")');
    expect(migrated.daily).toMatchObject({ completedDates: [], historicalCompletedDates: [date], rewardedDates: [date] });
    expect(migrated.activeAssessment.answers).toEqual({});
    expect(migrated.activeAssessment.historicalAnswers).toEqual({ [changed]: true });
    expect(migrated.activeAssessment.historicalSubmissions).toEqual({ [changed]: 'old assessment code' });

    const replacement = problems.find(problem => problem.id === changed);
    recordAccepted(migrated, replacement, new Date(2025, 3, 11, 12));
    const restored = validateBackup(exportBackup(migrated));
    expect(restored.solved).toContain(changed);
    expect(restored.solvedRevisions[changed]).toBe(1);
    expect(restored.historicalSolved).toContain(changed);
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
