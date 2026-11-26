import { problems } from '../data/curriculum.js?v=2.4.2';

const STORAGE_KEY = 'xpc-progress';
const LEGACY_PROGRESS_KEY = 'pylevel-progress';
const problemRevisions = new Map(problems.map(problem => [problem.id, problem.contentRevision || 0]));
const revisedLevels = new Set(problems.filter(problem => problem.contentRevision).map(problem => problem.level));

export function createDefaultProgress() {
  return {
    profile: { level: 1, xp: 0, streak: 0, lastPracticeDate: '' },
    solved: [],
    solvedRevisions: {},
    historicalSolved: [],
    completedLevels: [],
    historicalCompletedLevels: [],
    submissions: [],
    settings: {
      musicEnabled: false,
      musicPaused: false,
      musicMuted: false,
      musicVolume: 0.2,
      autoTrackSwitch: true,
      pauseMusicWhenHidden: true,
      soundEnabled: true,
      soundVolume: 0.4,
      reduceMotion: false,
      showCelebrations: true,
      unrestrictedPractice: false,
      autoRun: false,
      lineNumbers: true,
      fontSize: 14,
      tabSize: 4,
      wordWrap: true,
      autoSave: true,
      editorTheme: 'dark'
    },
    daily: { date: '', problemId: '', completedDates: [], rewardedDates: [], contentRevision: 0, historicalCompletedDates: [] },
    activeAssessment: null,
    interviewResults: [],
    lastProblemId: ''
  };
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validDateList(value) {
  return Array.isArray(value)
    ? [...new Set(value.filter(date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)))]
    : [];
}

function pickKnownFields(defaults, value) {
  const result = { ...defaults };
  if (!isRecord(value)) return result;
  for (const key of Object.keys(defaults)) {
    if (Object.prototype.hasOwnProperty.call(value, key)) result[key] = value[key];
  }
  return result;
}

export function normalizeProgress(value) {
  if (!isRecord(value)) throw new TypeError('Progress must be a JSON object.');
  const defaults = createDefaultProgress();
  const progress = { ...defaults };
  for (const key of ['profile', 'solved', 'solvedRevisions', 'historicalSolved', 'completedLevels', 'historicalCompletedLevels', 'submissions', 'settings', 'daily', 'activeAssessment', 'interviewResults', 'lastProblemId']) {
    if (Object.prototype.hasOwnProperty.call(value, key)) progress[key] = value[key];
  }
  progress.profile = pickKnownFields(defaults.profile, value.profile);
  progress.profile.level = Math.min(100, Math.max(1, Math.floor(Number(progress.profile.level) || 1)));
  progress.profile.xp = Math.max(0, Math.floor(Number(progress.profile.xp) || 0));
  progress.profile.streak = Math.max(0, Math.floor(Number(progress.profile.streak) || 0));
  if (typeof progress.profile.lastPracticeDate !== 'string') progress.profile.lastPracticeDate = '';

  progress.settings = pickKnownFields(defaults.settings, value.settings);
  for (const key of ['musicEnabled', 'musicPaused', 'musicMuted', 'autoTrackSwitch', 'pauseMusicWhenHidden', 'soundEnabled', 'reduceMotion', 'showCelebrations', 'unrestrictedPractice', 'autoRun', 'lineNumbers', 'wordWrap', 'autoSave']) {
    if (typeof progress.settings[key] !== 'boolean') progress.settings[key] = defaults.settings[key];
  }
  for (const key of ['musicVolume', 'soundVolume']) {
    progress.settings[key] = Math.min(1, Math.max(0, Number(progress.settings[key]) || 0));
  }
  progress.settings.fontSize = [12, 14, 16, 18, 20].includes(Number(progress.settings.fontSize)) ? Number(progress.settings.fontSize) : defaults.settings.fontSize;
  progress.settings.tabSize = [2, 4, 8].includes(Number(progress.settings.tabSize)) ? Number(progress.settings.tabSize) : defaults.settings.tabSize;
  if (!['dark', 'light'].includes(progress.settings.editorTheme)) progress.settings.editorTheme = defaults.settings.editorTheme;

  progress.solved = Array.isArray(value.solved)
    ? [...new Set(value.solved.filter(id => typeof id === 'string' && id.length <= 120))]
    : [];
  progress.solvedRevisions = isRecord(value.solvedRevisions)
    ? Object.fromEntries(Object.entries(value.solvedRevisions).filter(([id, revision]) =>
      id.length <= 120 && Number.isInteger(revision) && revision >= 0))
    : {};
  progress.historicalSolved = Array.isArray(value.historicalSolved)
    ? [...new Set(value.historicalSolved.filter(id => typeof id === 'string' && id.length <= 120))]
    : [];
  for (const id of progress.solved) {
    if ((progress.solvedRevisions[id] || 0) !== (problemRevisions.get(id) || 0)) {
      progress.historicalSolved.push(id);
    }
  }
  progress.historicalSolved = [...new Set(progress.historicalSolved)];
  progress.solved = progress.solved.filter(id =>
    (progress.solvedRevisions[id] || 0) === (problemRevisions.get(id) || 0));
  progress.completedLevels = Array.isArray(value.completedLevels)
    ? [...new Set(value.completedLevels.map(Number).filter(level => Number.isInteger(level) && level >= 1 && level <= 100))]
    : [];
  progress.historicalCompletedLevels = Array.isArray(value.historicalCompletedLevels)
    ? [...new Set(value.historicalCompletedLevels.filter(level => Number.isInteger(level) && level >= 1 && level <= 100))]
    : [];
  for (const level of progress.completedLevels) {
    if (revisedLevels.has(level) && problems.some(problem => problem.level === level && !progress.solved.includes(problem.id))) {
      progress.historicalCompletedLevels.push(level);
    }
  }
  progress.historicalCompletedLevels = [...new Set(progress.historicalCompletedLevels)];
  progress.completedLevels = progress.completedLevels.filter(level => !revisedLevels.has(level) ||
    problems.filter(problem => problem.level === level).every(problem => progress.solved.includes(problem.id)));
  for (const key of ['submissions', 'interviewResults']) {
    progress[key] = Array.isArray(value[key]) ? value[key].slice(-200) : [];
  }

  progress.daily = pickKnownFields(defaults.daily, value.daily);
  if (typeof progress.daily.date !== 'string') progress.daily.date = '';
  if (typeof progress.daily.problemId !== 'string') progress.daily.problemId = '';
  progress.daily.date = progress.daily.date.slice(0, 10);
  progress.daily.problemId = progress.daily.problemId.slice(0, 120);
  progress.daily.completedDates = validDateList(progress.daily.completedDates);
  progress.daily.rewardedDates = validDateList(progress.daily.rewardedDates);
  progress.daily.historicalCompletedDates = validDateList(progress.daily.historicalCompletedDates);
  progress.daily.contentRevision = Number.isInteger(progress.daily.contentRevision) && progress.daily.contentRevision >= 0
    ? progress.daily.contentRevision : 0;
  const dailyRevision = problemRevisions.get(progress.daily.problemId) || 0;
  if (progress.daily.contentRevision !== dailyRevision && progress.daily.completedDates.includes(progress.daily.date)) {
    progress.daily.historicalCompletedDates = [...new Set([...progress.daily.historicalCompletedDates, progress.daily.date])];
    progress.daily.completedDates = progress.daily.completedDates.filter(date => date !== progress.daily.date);
  }
  progress.daily.contentRevision = dailyRevision;

  const assessment = value.activeAssessment;
  if (isRecord(assessment) &&
      Array.isArray(assessment.questionIds) &&
      assessment.questionIds.length > 0 &&
      assessment.questionIds.length <= 10 &&
      assessment.questionIds.every(id => typeof id === 'string' && id.length <= 120) &&
      Number.isFinite(assessment.endsAt) &&
      isRecord(assessment.answers) &&
      isRecord(assessment.submissions)) {
    progress.activeAssessment = {
      id: typeof assessment.id === 'string' ? assessment.id.slice(0, 100) : '',
      preset: typeof assessment.preset === 'string' ? assessment.preset.slice(0, 100) : 'Practice Assessment',
      questionIds: [...new Set(assessment.questionIds)],
      durationMinutes: Math.min(180, Math.max(1, Math.floor(Number(assessment.durationMinutes) || 15))),
      startedAt: Number.isFinite(assessment.startedAt) ? Number(assessment.startedAt) : Date.now(),
      endsAt: Number(assessment.endsAt),
      currentIndex: Math.min(assessment.questionIds.length - 1, Math.max(0, Math.floor(Number(assessment.currentIndex) || 0))),
      answers: Object.fromEntries(Object.entries(assessment.answers).filter(([id, answer]) => assessment.questionIds.includes(id) && typeof answer === 'boolean')),
      submissions: Object.fromEntries(Object.entries(assessment.submissions).filter(([id, code]) => assessment.questionIds.includes(id) && typeof code === 'string' && code.length <= 50000)),
      questionRevisions: isRecord(assessment.questionRevisions) ? { ...assessment.questionRevisions } : {},
      historicalAnswers: isRecord(assessment.historicalAnswers) ? { ...assessment.historicalAnswers } : {},
      historicalSubmissions: isRecord(assessment.historicalSubmissions) ? { ...assessment.historicalSubmissions } : {}
    };
    for (const id of progress.activeAssessment.questionIds) {
      const currentRevision = problemRevisions.get(id) || 0;
      if ((progress.activeAssessment.questionRevisions[id] || 0) !== currentRevision) {
        if (Object.prototype.hasOwnProperty.call(progress.activeAssessment.answers, id)) {
          progress.activeAssessment.historicalAnswers[id] = progress.activeAssessment.answers[id];
          delete progress.activeAssessment.answers[id];
        }
        if (typeof progress.activeAssessment.submissions[id] === 'string') {
          progress.activeAssessment.historicalSubmissions[id] = progress.activeAssessment.submissions[id];
        }
      }
      progress.activeAssessment.questionRevisions[id] = currentRevision;
    }
  } else {
    progress.activeAssessment = null;
  }
  if (typeof progress.lastProblemId !== 'string') progress.lastProblemId = '';
  progress.lastProblemId = progress.lastProblemId.slice(0, 120);
  return progress;
}

export function progressSnapshot() {
  let progress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (!raw) return createDefaultProgress();
    progress = normalizeProgress(JSON.parse(raw));
  } catch (error) {
    console.error('Could not restore saved progress. Starting with a clean local profile.', error);
    return createDefaultProgress();
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    localStorage.setItem(LEGACY_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Restored progress, but could not save its migration to browser storage.', error);
  }
  return progress;
}

export function saveProgress(progress) {
  const serialized = JSON.stringify(progress);
  localStorage.setItem(STORAGE_KEY, serialized);
  localStorage.setItem(LEGACY_PROGRESS_KEY, serialized);
}

export function getDraft(problemId) {
  const key = `pylevel-draft-${problemId}`;
  try {
    return localStorage.getItem(`xpc-draft-${problemId}`) ?? localStorage.getItem(key);
  } catch (error) {
    console.error('Could not restore the saved code draft.', error);
    return null;
  }
}

export function saveDraft(problemId, code) {
  try {
    localStorage.setItem(`xpc-draft-${problemId}`, code);
    localStorage.setItem(`pylevel-draft-${problemId}`, code);
  } catch (error) {
    console.error('Could not save the code draft.', error);
    throw error;
  }
}

export function validateBackup(input) {
  if (!isRecord(input) || input.version !== 1 || !isRecord(input.progress)) {
    throw new TypeError('Backup must have version 1 and a progress object.');
  }
  const progress = input.progress;
  const knownFields = ['profile', 'solved', 'completedLevels', 'submissions', 'settings', 'daily', 'activeAssessment', 'interviewResults', 'lastProblemId'];
  if (!knownFields.some(key => Object.prototype.hasOwnProperty.call(progress, key))) {
    throw new TypeError('Backup has no recognized progress data.');
  }
  if (progress.solved !== undefined && (!Array.isArray(progress.solved) || !progress.solved.every(id => typeof id === 'string'))) {
    throw new TypeError('Backup has an invalid solved-problem list.');
  }
  if (progress.historicalSolved !== undefined &&
      (!Array.isArray(progress.historicalSolved) || !progress.historicalSolved.every(id => typeof id === 'string'))) {
    throw new TypeError('Backup has an invalid historical solved-problem list.');
  }
  if (progress.solvedRevisions !== undefined && (!isRecord(progress.solvedRevisions) ||
      !Object.values(progress.solvedRevisions).every(revision => Number.isInteger(revision) && revision >= 0))) {
    throw new TypeError('Backup has invalid solved-problem revisions.');
  }
  if (progress.completedLevels !== undefined &&
      (!Array.isArray(progress.completedLevels) || !progress.completedLevels.every(level => Number.isInteger(level) && level >= 1 && level <= 100))) {
    throw new TypeError('Backup has an invalid completed-level list.');
  }
  if (progress.historicalCompletedLevels !== undefined &&
      (!Array.isArray(progress.historicalCompletedLevels) ||
       !progress.historicalCompletedLevels.every(level => Number.isInteger(level) && level >= 1 && level <= 100))) {
    throw new TypeError('Backup has an invalid historical completed-level list.');
  }
  if (progress.submissions !== undefined && !Array.isArray(progress.submissions)) {
    throw new TypeError('Backup has an invalid submission history.');
  }
  if (progress.profile !== undefined && !isRecord(progress.profile)) {
    throw new TypeError('Backup has invalid profile settings.');
  }
  if (progress.profile) {
    const { level, xp, streak, lastPracticeDate } = progress.profile;
    if (level !== undefined && (!Number.isInteger(level) || level < 1 || level > 100)) throw new TypeError('Backup has an invalid current level.');
    if (xp !== undefined && (!Number.isFinite(xp) || xp < 0)) throw new TypeError('Backup has invalid experience points.');
    if (streak !== undefined && (!Number.isInteger(streak) || streak < 0)) throw new TypeError('Backup has an invalid daily streak.');
    if (lastPracticeDate !== undefined && typeof lastPracticeDate !== 'string') throw new TypeError('Backup has an invalid practice date.');
  }
  if (progress.settings !== undefined && !isRecord(progress.settings)) {
    throw new TypeError('Backup has invalid app settings.');
  }
  if (progress.settings) {
    for (const key of ['musicEnabled', 'musicPaused', 'musicMuted', 'autoTrackSwitch', 'pauseMusicWhenHidden', 'soundEnabled', 'reduceMotion', 'showCelebrations', 'unrestrictedPractice', 'autoRun', 'lineNumbers', 'wordWrap', 'autoSave']) {
      if (progress.settings[key] !== undefined && typeof progress.settings[key] !== 'boolean') throw new TypeError(`Backup has an invalid ${key} setting.`);
    }
    for (const key of ['musicVolume', 'soundVolume']) {
      if (progress.settings[key] !== undefined && (!Number.isFinite(progress.settings[key]) || progress.settings[key] < 0 || progress.settings[key] > 1)) {
        throw new TypeError(`Backup has an invalid ${key.replace('Volume', ' volume')}.`);
      }
    }
    if (progress.settings.fontSize !== undefined && ![12, 14, 16, 18, 20].includes(progress.settings.fontSize)) {
      throw new TypeError('Backup has an invalid editor font size.');
    }
    if (progress.settings.tabSize !== undefined && ![2, 4, 8].includes(progress.settings.tabSize)) {
      throw new TypeError('Backup has an invalid editor tab size.');
    }
    if (progress.settings.editorTheme !== undefined && !['dark', 'light'].includes(progress.settings.editorTheme)) {
      throw new TypeError('Backup has an invalid editor theme.');
    }
  }
  if (progress.daily !== undefined && !isRecord(progress.daily)) throw new TypeError('Backup has invalid daily challenge progress.');
  if (progress.daily) {
    if (progress.daily.date !== undefined && typeof progress.daily.date !== 'string') throw new TypeError('Backup has an invalid daily challenge date.');
    if (progress.daily.problemId !== undefined && typeof progress.daily.problemId !== 'string') throw new TypeError('Backup has an invalid daily problem.');
    for (const key of ['completedDates', 'rewardedDates', 'historicalCompletedDates']) {
      if (progress.daily[key] !== undefined &&
          (!Array.isArray(progress.daily[key]) || !progress.daily[key].every(date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)))) {
        throw new TypeError(`Backup has an invalid daily ${key} list.`);
      }
      if (progress.daily.contentRevision !== undefined &&
          (!Number.isInteger(progress.daily.contentRevision) || progress.daily.contentRevision < 0)) {
        throw new TypeError('Backup has an invalid daily content revision.');
      }
    }
  }
  if (progress.interviewResults !== undefined && !Array.isArray(progress.interviewResults)) throw new TypeError('Backup has invalid interview results.');
  if (progress.activeAssessment !== undefined && progress.activeAssessment !== null && !isRecord(progress.activeAssessment)) {
    throw new TypeError('Backup has invalid active assessment data.');
  }
  if (isRecord(progress.activeAssessment)) {
    const assessment = progress.activeAssessment;
    if (!Array.isArray(assessment.questionIds) || assessment.questionIds.length < 1 || assessment.questionIds.length > 10 ||
        !assessment.questionIds.every(id => typeof id === 'string') ||
        !Number.isFinite(assessment.endsAt) ||
        !isRecord(assessment.answers) ||
        !isRecord(assessment.submissions)) {
      throw new TypeError('Backup has invalid active assessment data.');
    }
  }
  if (progress.lastProblemId !== undefined && typeof progress.lastProblemId !== 'string') throw new TypeError('Backup has an invalid last problem.');
  return normalizeProgress(progress);
}

export function exportBackup(progress) {
  return { version: 1, exportedAt: new Date().toISOString(), progress };
}

export function clearApplicationData() {
  const keysToRemove = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key === STORAGE_KEY || key === LEGACY_PROGRESS_KEY || key.startsWith('pylevel-draft-') || key.startsWith('xpc-draft-')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
