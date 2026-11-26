import {
  AnswerRecord,
  AppState,
  BadgeDef,
  DailyStudyLog,
  ExamHistoryItem,
  MistakeEntry,
  Question,
  SessionKind,
} from '../types';

const STORAGE_KEY = 'ioe_lop5_app_state_v1';

export const BADGES: BadgeDef[] = [
  {
    id: 'first_step',
    title: 'Khởi Động Thành Công',
    description: 'Mai Nhi hoàn thành bài học hoặc bài test đầu tiên',
    icon: '🚀',
    color: 'from-sky-400 to-blue-500',
  },
  {
    id: 'streak_3',
    title: 'Giữ Lửa 3 Ngày',
    description: 'Học đều đặn 3 ngày liên tiếp không bỏ buổi nào',
    icon: '🔥',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'streak_7',
    title: 'Siêu Nhân 7 Ngày',
    description: 'Duy trì chuỗi học liên tiếp 7 ngày',
    icon: '⚡',
    color: 'from-amber-400 to-orange-600',
  },
  {
    id: 'vocab_star',
    title: 'Kho Từ Vựng Vàng',
    description: 'Thuộc từ 20 từ vựng IOE Lớp 5 trở lên',
    icon: '🌟',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'accuracy_90',
    title: 'Thiện Xạ 90%',
    description: 'Đạt từ 90% câu đúng trở lên trong 1 bài học/thi (từ 10 câu)',
    icon: '🎯',
    color: 'from-emerald-400 to-green-600',
  },
  {
    id: 'ioe_warrior',
    title: 'Chiến Binh Cấp Xã',
    description: 'Hoàn thành 1 đề thi thử IOE Cấp Xã',
    icon: '🏆',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'mistake_fixer',
    title: 'Sửa Sai Siêu Đỉnh',
    description: 'Khắc phục thành công ít nhất 5 lỗi trong Sổ Lỗi Sai',
    icon: '🛠️',
    color: 'from-rose-400 to-pink-600',
  },
  {
    id: 'listening_star',
    title: 'Đôi Tai Vàng',
    description: 'Trả lời đúng câu Luyện Nghe MP3',
    icon: '🎧',
    color: 'from-cyan-400 to-teal-600',
  },
];

export function getTodayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function shiftDateKey(dateKey: string, daysDelta: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + daysDelta);
  return getTodayKey(dt);
}

export const DEFAULT_STATE: AppState = {
  profile: {
    name: 'Mai Nhi',
    className: 'Lớp 5',
    avatar: '🐰',
    dailyGoal: 20,
    dailyLessonsGoal: 2, // 1-5 bài học chủ đề / ngày
    dailyExamGoal: 1, // 0 hoặc 1 bài test Cấp Xã / ngày
    dailyMinutesGoal: 15, // 15 phút / ngày
    soundEnabled: true,
    streakFreezeCount: 1,
  },
  dailyLogs: {},
  history: [],
  unlockedBadges: [],
  customQuestions: [],
  unitProgress: {},
  masteredVocabIds: [],
  mistakes: {},
};

function normalizeLog(dateKey: string, raw?: Partial<DailyStudyLog>): DailyStudyLog {
  return {
    dateKey,
    questionsDone: raw?.questionsDone || 0,
    correctCount: raw?.correctCount || 0,
    examsCompleted: raw?.examsCompleted || 0,
    lessonsCompleted: raw?.lessonsCompleted || 0,
    vocabSessions: raw?.vocabSessions || 0,
    minutesStudied: raw?.minutesStudied || 0,
  };
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;

    const mergedProfile = {
      ...DEFAULT_STATE.profile,
      ...(parsed.profile || {}),
    };
    // Upgrade legacy default placeholder name to Mai Nhi automatically
    if (mergedProfile.name === 'Bé Chăm Chỉ') {
      mergedProfile.name = 'Mai Nhi';
      mergedProfile.avatar = '🐰';
    }

    const normalizedLogs: Record<string, DailyStudyLog> = {};
    if (parsed.dailyLogs) {
      for (const [k, v] of Object.entries(parsed.dailyLogs)) {
        normalizedLogs[k] = normalizeLog(k, v);
      }
    }

    // Backfill mistakes from history if mistakes map didn't exist yet
    const mistakes: Record<string, MistakeEntry> = { ...(parsed.mistakes || {}) };
    if (Object.keys(mistakes).length === 0 && parsed.history) {
      for (const h of parsed.history) {
        for (const w of h.wrongAnswers || []) {
          if (!mistakes[w.question.id]) {
            mistakes[w.question.id] = {
              question: w.question,
              lastWrongAnswer: w.userAnswer,
              wrongCount: 1,
              lastSeenISO: h.dateISO,
              resolved: false,
            };
          }
        }
      }
    }

    return {
      profile: mergedProfile,
      dailyLogs: normalizedLogs,
      history: parsed.history || [],
      unlockedBadges: parsed.unlockedBadges || [],
      customQuestions: parsed.customQuestions || [],
      unitProgress: parsed.unitProgress || {},
      masteredVocabIds: parsed.masteredVocabIds || [],
      mistakes,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveAppState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function didStudyOnLog(log?: DailyStudyLog): boolean {
  if (!log) return false;
  return (
    log.questionsDone > 0 ||
    log.lessonsCompleted > 0 ||
    log.examsCompleted > 0 ||
    log.vocabSessions > 0 ||
    log.minutesStudied > 0
  );
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  studiedToday: boolean;
  todayQuestions: number;
  todayLessons: number;
  todayExams: number;
  todayMinutes: number;
  todayVocabSessions: number;
  todayPlanPercent: number;
  todayAllGoalsMet: boolean;
  totalQuestionsAllTime: number;
}

export function computeStreakInfo(state: AppState): StreakInfo {
  const today = getTodayKey();
  const logs = state.dailyLogs;
  const activeDates = Object.keys(logs)
    .filter((k) => didStudyOnLog(logs[k]))
    .sort();

  const totalStudyDays = activeDates.length;
  const totalQuestionsAllTime = activeDates.reduce(
    (sum, k) => sum + (logs[k]?.questionsDone || 0),
    0
  );

  const todayLog = normalizeLog(today, logs[today]);
  const studiedToday = didStudyOnLog(todayLog);

  // Calculate daily plan completion percentage across chosen goals:
  // 1) Lessons goal (1..5), 2) Exam goal (0..1), 3) Minutes goal (10..45)
  const parts: number[] = [];
  if (state.profile.dailyLessonsGoal > 0) {
    parts.push(Math.min(1, todayLog.lessonsCompleted / state.profile.dailyLessonsGoal));
  }
  if (state.profile.dailyExamGoal > 0) {
    parts.push(Math.min(1, todayLog.examsCompleted / state.profile.dailyExamGoal));
  }
  if (state.profile.dailyMinutesGoal > 0) {
    parts.push(Math.min(1, todayLog.minutesStudied / state.profile.dailyMinutesGoal));
  }
  const todayPlanPercent =
    parts.length > 0
      ? Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100)
      : studiedToday
      ? 100
      : 0;
  const todayAllGoalsMet = todayPlanPercent >= 100;

  let currentStreak = 0;
  let cursor = studiedToday ? today : shiftDateKey(today, -1);
  while (didStudyOnLog(logs[cursor])) {
    currentStreak++;
    cursor = shiftDateKey(cursor, -1);
  }

  let longestStreak = 0;
  let run = 0;
  for (let i = 0; i < activeDates.length; i++) {
    if (i === 0) {
      run = 1;
    } else {
      const prevExpected = shiftDateKey(activeDates[i], -1);
      if (activeDates[i - 1] === prevExpected) {
        run++;
      } else {
        run = 1;
      }
    }
    if (run > longestStreak) longestStreak = run;
  }

  return {
    currentStreak,
    longestStreak,
    totalStudyDays,
    studiedToday,
    todayQuestions: todayLog.questionsDone,
    todayLessons: todayLog.lessonsCompleted,
    todayExams: todayLog.examsCompleted,
    todayMinutes: todayLog.minutesStudied,
    todayVocabSessions: todayLog.vocabSessions,
    todayPlanPercent,
    todayAllGoalsMet,
    totalQuestionsAllTime,
  };
}

function evaluateBadges(
  state: AppState,
  lastItem?: ExamHistoryItem,
  hadListeningCorrect = false
): { nextBadges: string[]; newlyUnlocked: BadgeDef[] } {
  const streak = computeStreakInfo(state);
  const unlocked = new Set(state.unlockedBadges);
  const newlyUnlocked: BadgeDef[] = [];

  const tryUnlock = (id: string, cond: boolean) => {
    if (cond && !unlocked.has(id)) {
      unlocked.add(id);
      const found = BADGES.find((b) => b.id === id);
      if (found) newlyUnlocked.push(found);
    }
  };

  const resolvedMistakesCount = Object.values(state.mistakes).filter(
    (m) => m.resolved
  ).length;

  tryUnlock('first_step', state.history.length >= 1 || streak.studiedToday);
  tryUnlock('streak_3', streak.currentStreak >= 3);
  tryUnlock('streak_7', streak.currentStreak >= 7);
  tryUnlock('vocab_star', state.masteredVocabIds.length >= 20);
  tryUnlock(
    'accuracy_90',
    Boolean(
      lastItem &&
        lastItem.totalQuestions >= 10 &&
        lastItem.correctCount / lastItem.totalQuestions >= 0.9
    )
  );
  tryUnlock(
    'ioe_warrior',
    Boolean(lastItem && lastItem.mode === 'ioe_exam') ||
      state.history.some((h) => h.mode === 'ioe_exam')
  );
  tryUnlock('mistake_fixer', resolvedMistakesCount >= 5);
  tryUnlock('listening_star', hadListeningCorrect);

  return { nextBadges: Array.from(unlocked), newlyUnlocked };
}

export function recordExamResult(
  prevState: AppState,
  item: ExamHistoryItem,
  records: AnswerRecord[],
  sessionKind: SessionKind,
  unitId?: string
): { nextState: AppState; newlyUnlocked: BadgeDef[]; resolvedCountInSession: number } {
  const today = item.dateKey;
  const prevLog = normalizeLog(today, prevState.dailyLogs[today]);
  const addedMinutes = Math.max(1, Math.round(item.timeSpentSeconds / 60));

  const isLesson = sessionKind === 'unit_lesson' || sessionKind === 'quick_practice';
  const isExam = sessionKind === 'ioe_exam';

  const nextDailyLogs: Record<string, DailyStudyLog> = {
    ...prevState.dailyLogs,
    [today]: {
      ...prevLog,
      questionsDone: prevLog.questionsDone + item.totalQuestions,
      correctCount: prevLog.correctCount + item.correctCount,
      examsCompleted: prevLog.examsCompleted + (isExam ? 1 : 0),
      lessonsCompleted: prevLog.lessonsCompleted + (isLesson ? 1 : 0),
      minutesStudied: prevLog.minutesStudied + addedMinutes,
    },
  };

  // Update Mistake Notebook automatically!
  const nextMistakes: Record<string, MistakeEntry> = { ...prevState.mistakes };
  let resolvedCountInSession = 0;

  for (const rec of records) {
    const qid = rec.question.id;
    if (!rec.isCorrect) {
      const existing = nextMistakes[qid];
      nextMistakes[qid] = {
        question: rec.question,
        lastWrongAnswer: rec.userAnswer,
        wrongCount: (existing?.wrongCount || 0) + 1,
        lastSeenISO: item.dateISO,
        resolved: false,
      };
    } else if (nextMistakes[qid] && !nextMistakes[qid].resolved) {
      nextMistakes[qid] = {
        ...nextMistakes[qid],
        resolved: true,
        lastSeenISO: item.dateISO,
      };
      resolvedCountInSession++;
    }
  }

  // Update Learning Unit Progress if this was a Duolingo-style unit lesson
  const nextUnitProgress = { ...prevState.unitProgress };
  if (unitId) {
    const acc =
      item.totalQuestions > 0
        ? Math.round((item.correctCount / item.totalQuestions) * 100)
        : 0;
    const prev = nextUnitProgress[unitId];
    nextUnitProgress[unitId] = {
      completions: (prev?.completions || 0) + 1,
      bestAccuracy: Math.max(prev?.bestAccuracy || 0, acc),
    };
  }

  const hadListeningCorrect = records.some(
    (r) =>
      r.isCorrect &&
      (r.question.type === 'listening_mc' || r.question.type === 'listening_fill')
  );

  const nextHistory = [item, ...prevState.history].slice(0, 80);

  const tempState: AppState = {
    ...prevState,
    dailyLogs: nextDailyLogs,
    history: nextHistory,
    mistakes: nextMistakes,
    unitProgress: nextUnitProgress,
  };

  const { nextBadges, newlyUnlocked } = evaluateBadges(
    tempState,
    item,
    hadListeningCorrect
  );

  const nextState: AppState = {
    ...tempState,
    unlockedBadges: nextBadges,
  };

  saveAppState(nextState);
  return { nextState, newlyUnlocked, resolvedCountInSession };
}

export function toggleVocabMastered(prevState: AppState, wordId: string): AppState {
  const exists = prevState.masteredVocabIds.includes(wordId);
  const masteredVocabIds = exists
    ? prevState.masteredVocabIds.filter((id) => id !== wordId)
    : [...prevState.masteredVocabIds, wordId];

  const today = getTodayKey();
  const prevLog = normalizeLog(today, prevState.dailyLogs[today]);
  const nextDailyLogs = exists
    ? prevState.dailyLogs
    : {
        ...prevState.dailyLogs,
        [today]: {
          ...prevLog,
          minutesStudied: prevLog.minutesStudied + 1,
          vocabSessions: Math.max(1, prevLog.vocabSessions),
        },
      };

  const tempState: AppState = {
    ...prevState,
    masteredVocabIds,
    dailyLogs: nextDailyLogs,
  };
  const { nextBadges } = evaluateBadges(tempState);
  const nextState: AppState = { ...tempState, unlockedBadges: nextBadges };
  saveAppState(nextState);
  return nextState;
}

export function recordVocabGameComplete(
  prevState: AppState,
  minutesAdded: number,
  questionsCount: number,
  correctCount: number
): AppState {
  const today = getTodayKey();
  const prevLog = normalizeLog(today, prevState.dailyLogs[today]);
  const tempState: AppState = {
    ...prevState,
    dailyLogs: {
      ...prevState.dailyLogs,
      [today]: {
        ...prevLog,
        questionsDone: prevLog.questionsDone + questionsCount,
        correctCount: prevLog.correctCount + correctCount,
        vocabSessions: prevLog.vocabSessions + 1,
        minutesStudied: prevLog.minutesStudied + Math.max(1, minutesAdded),
      },
    },
  };
  const { nextBadges } = evaluateBadges(tempState);
  const nextState: AppState = { ...tempState, unlockedBadges: nextBadges };
  saveAppState(nextState);
  return nextState;
}

export function markMistakeResolved(prevState: AppState, questionId: string): AppState {
  const entry = prevState.mistakes[questionId];
  if (!entry) return prevState;
  const tempState: AppState = {
    ...prevState,
    mistakes: {
      ...prevState.mistakes,
      [questionId]: { ...entry, resolved: true },
    },
  };
  const { nextBadges } = evaluateBadges(tempState);
  const nextState: AppState = { ...tempState, unlockedBadges: nextBadges };
  saveAppState(nextState);
  return nextState;
}

export function addCustomQuestionToState(prevState: AppState, q: Question): AppState {
  const nextState: AppState = {
    ...prevState,
    customQuestions: [q, ...prevState.customQuestions],
  };
  saveAppState(nextState);
  return nextState;
}
