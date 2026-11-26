export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function selectDailyProblem(problems, date = new Date()) {
  if (!problems.length) return null;
  const key = localDateKey(date);
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return problems[hash % problems.length];
}

export function currentLevel(progress) {
  return Math.min(100, Math.max(1, Number(progress.profile?.level) || 1));
}

export function isProblemAvailable(problem, progress) {
  return Boolean(problem) && (
    problem.level <= currentLevel(progress) ||
    progress.settings?.unrestrictedPractice ||
    progress.solved?.includes(problem.id)
  );
}

export function recordAccepted(progress, problem, now = new Date()) {
  const result = { firstSolve: false, levelCompleted: false, milestone: false, dailyCompleted: false, finalCompletion: false, streakIncreased: false, streakStarted: false };
  const date = localDateKey(now);
  if (progress.profile.lastPracticeDate !== date) {
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const previousStreak = Number(progress.profile.streak) || 0;
    progress.profile.streak = progress.profile.lastPracticeDate === localDateKey(yesterday)
      ? previousStreak + 1
      : 1;
    result.streakIncreased = progress.profile.streak > previousStreak;
    result.streakStarted = result.streakIncreased && progress.profile.streak === 1;
    progress.profile.lastPracticeDate = date;
  }
  if (progress.daily.problemId === problem.id && progress.daily.date === date) {
    progress.daily.completedDates = [...new Set([...progress.daily.completedDates, date])];
    if (!progress.daily.rewardedDates.includes(date)) {
      progress.daily.rewardedDates.push(date);
      progress.profile.xp += 15;
      result.dailyCompleted = true;
    }
  }

  if (progress.solved.includes(problem.id)) return result;

  progress.solved.push(problem.id);
  progress.profile.xp = (Number(progress.profile.xp) || 0) + (problem.xpReward || 0);
  result.firstSolve = true;

  const levelProblems = progress.problemsByLevel?.[problem.level] || [];
  const completedCount = levelProblems.filter(id => progress.solved.includes(id)).length;
  if (completedCount >= levelProblems.length && levelProblems.length > 0) {
    if (!progress.completedLevels.includes(problem.level)) {
      progress.completedLevels.push(problem.level);
      result.levelCompleted = true;
      result.milestone = [10, 25, 50, 75, 100].includes(problem.level);
      result.finalCompletion = problem.level === 100;
    }
    if (problem.level === currentLevel(progress)) {
      progress.profile.level = Math.min(100, problem.level + 1);
    }
  }
  return result;
}

export function assessmentScore(assessment) {
  const questionIds = assessment?.questionIds || [];
  const answers = assessment?.answers || {};
  const correct = questionIds.filter(id => answers[id] === true).length;
  const incorrect = questionIds.filter(id => answers[id] === false).length;
  return {
    total: questionIds.length,
    correct,
    incorrect,
    unanswered: questionIds.length - correct - incorrect,
    percentage: questionIds.length ? Math.round(correct / questionIds.length * 100) : 0
  };
}
