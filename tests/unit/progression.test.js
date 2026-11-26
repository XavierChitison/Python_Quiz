import { describe, expect, it } from 'vitest';
import { createDefaultProgress } from '../../src/services/storage.js';
import { assessmentScore, localDateKey, recordAccepted, selectDailyProblem } from '../../src/services/progression.js';

describe('challenge progression', () => {
  it('selects a stable daily challenge for a given local date', () => {
    const problems = [{ id: 'one' }, { id: 'two' }, { id: 'three' }];
    const date = new Date(2025, 3, 10, 12);

    expect(selectDailyProblem(problems, date)).toEqual(selectDailyProblem(problems, date));
    expect(localDateKey(date)).toBe('2025-04-10');
  });

  it('awards a daily bonus once and advances only after the current level is complete', () => {
    const progress = createDefaultProgress();
    const date = new Date(2025, 3, 10, 12);
    const first = { id: 'one', level: 1, xpReward: 10 };
    const second = { id: 'two', level: 1, xpReward: 10 };
    progress.problemsByLevel = { 1: ['one', 'two'] };
    progress.daily = { date: localDateKey(date), problemId: first.id, completedDates: [], rewardedDates: [] };

    const firstResult = recordAccepted(progress, first, date);
    expect(firstResult).toMatchObject({ firstSolve: true, dailyCompleted: true, levelCompleted: false });
    expect(progress.profile).toMatchObject({ level: 1, xp: 25 });

    expect(recordAccepted(progress, first, date).dailyCompleted).toBe(false);
    const secondResult = recordAccepted(progress, second, date);
    expect(secondResult).toMatchObject({ firstSolve: true, levelCompleted: true });
    expect(progress.profile).toMatchObject({ level: 2, xp: 35 });
  });

  it('increments a daily streak only on a consecutive local calendar day', () => {
    const progress = createDefaultProgress();
    const yesterday = new Date(2025, 3, 9, 12);
    const today = new Date(2025, 3, 10, 12);
    progress.profile.lastPracticeDate = localDateKey(yesterday);
    progress.profile.streak = 4;

    recordAccepted(progress, { id: 'one', level: 1, xpReward: 10 }, today);
    expect(progress.profile.streak).toBe(5);
    recordAccepted(progress, { id: 'one', level: 1, xpReward: 10 }, today);
    expect(progress.profile.streak).toBe(5);
  });

  it('scores correct, incorrect, and unanswered assessment questions', () => {
    expect(assessmentScore({
      questionIds: ['one', 'two', 'three'],
      answers: { one: true, two: false }
    })).toEqual({ total: 3, correct: 1, incorrect: 1, unanswered: 1, percentage: 33 });
  });
});
