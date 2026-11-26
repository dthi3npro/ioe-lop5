import { AppState, BadgeDef, ExamHistoryItem, Question } from '../types';

const STORAGE_KEY = 'ioe_lop5_app_state_v1';

export const BADGES: BadgeDef[] = [
  {
    id: 'first_step',
    title: 'Khởi Động Thành Công',
    description: 'Hoàn thành bài luyện tập hoặc bài thi đầu tiên',
    icon: '🚀',
    color: 'from-sky-400 to-blue-500',
  },
  {
    id: 'streak_3',
    title: 'Giữ Lửa 3 Ngày',
    description: 'Học liên tiếp 3 ngày không nghỉ',
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
    id: 'accuracy_90',
    title: 'Thiện Xạ 90%',
    description: 'Đạt từ 90% câu đúng trở lên trong 1 bài làm (từ 10 câu)',
    icon: '🎯',
    color: 'from-emerald-400 to-green-600',
  },
  {
    id: 'ioe_warrior',
    title: 'Chiến Binh 200 Câu',
    description: 'Hoàn thành 1 đề thi thật IOE 200 câu',
    icon: '🏆',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'questions_100',
    title: 'Chăm Chỉ 100 Câu',
    description: 'Tổng cộng đã giải từ 100 câu hỏi trở lên',
    icon: '📚',
    color: 'from-indigo-400 to-purple-600',
  },
  {
    id: 'questions_500',
    title: 'Bậc Thầy IOE',
    description: 'Tổng cộng đã giải từ 500 câu hỏi trở lên',
    icon: '👑',
    color: 'from-fuchsia-500 to-pink-600',
  },
  {
    id: 'listening_star',
    title: 'Đôi Tai Vàng',
    description: 'Hoàn thành bài luyện Nghe hoặc đạt điểm cao có câu nghe',
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
    name: 'Bé Chăm Chỉ',
    className: 'Lớp 5A',
    avatar: '🦉',
    dailyGoal: 20,
    soundEnabled: true,
    streakFreezeCount: 1,
  },
  dailyLogs: {},
  history: [],
  unlockedBadges: [],
  customQuestions: [],
};

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
      dailyLogs: parsed.dailyLogs || {},
      history: parsed.history || [],
      unlockedBadges: parsed.unlockedBadges || [],
      customQuestions: parsed.customQuestions || [],
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

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  studiedToday: boolean;
  todayQuestions: number;
  todayGoalMet: boolean;
  totalQuestionsAllTime: number;
}

export function computeStreakInfo(state: AppState): StreakInfo {
  const today = getTodayKey();
  const logs = state.dailyLogs;
  const activeDates = Object.keys(logs)
    .filter((k) => logs[k].questionsDone > 0)
    .sort();

  const totalStudyDays = activeDates.length;
  const totalQuestionsAllTime = activeDates.reduce(
    (sum, k) => sum + logs[k].questionsDone,
    0
  );

  const todayLog = logs[today];
  const todayQuestions = todayLog?.questionsDone || 0;
  const studiedToday = todayQuestions > 0;
  const todayGoalMet = todayQuestions >= state.profile.dailyGoal;

  // Current streak: count backwards from today (or yesterday if not studied yet today)
  let currentStreak = 0;
  let cursor = studiedToday ? today : shiftDateKey(today, -1);
  while (logs[cursor] && logs[cursor].questionsDone > 0) {
    currentStreak++;
    cursor = shiftDateKey(cursor, -1);
  }

  // Longest streak
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
    todayQuestions,
    todayGoalMet,
    totalQuestionsAllTime,
  };
}

export function recordExamResult(
  prevState: AppState,
  item: ExamHistoryItem,
  hadListeningCorrect: boolean
): { nextState: AppState; newlyUnlocked: BadgeDef[] } {
  const today = item.dateKey;
  const prevLog = prevState.dailyLogs[today] || {
    dateKey: today,
    questionsDone: 0,
    correctCount: 0,
    examsCompleted: 0,
    minutesStudied: 0,
  };

  const addedMinutes = Math.max(1, Math.round(item.timeSpentSeconds / 60));

  const nextDailyLogs = {
    ...prevState.dailyLogs,
    [today]: {
      dateKey: today,
      questionsDone: prevLog.questionsDone + item.totalQuestions,
      correctCount: prevLog.correctCount + item.correctCount,
      examsCompleted: prevLog.examsCompleted + 1,
      minutesStudied: prevLog.minutesStudied + addedMinutes,
    },
  };

  const nextHistory = [item, ...prevState.history].slice(0, 60);

  const tempState: AppState = {
    ...prevState,
    dailyLogs: nextDailyLogs,
    history: nextHistory,
  };

  const streak = computeStreakInfo(tempState);
  const unlocked = new Set(prevState.unlockedBadges);
  const newlyUnlocked: BadgeDef[] = [];

  const tryUnlock = (id: string, cond: boolean) => {
    if (cond && !unlocked.has(id)) {
      unlocked.add(id);
      const found = BADGES.find((b) => b.id === id);
      if (found) newlyUnlocked.push(found);
    }
  };

  tryUnlock('first_step', nextHistory.length >= 1);
  tryUnlock('streak_3', streak.currentStreak >= 3);
  tryUnlock('streak_7', streak.currentStreak >= 7);
  tryUnlock(
    'accuracy_90',
    item.totalQuestions >= 10 && item.correctCount / item.totalQuestions >= 0.9
  );
  tryUnlock(
    'ioe_warrior',
    item.mode === 'ioe_exam' && item.totalQuestions >= 200
  );
  tryUnlock('questions_100', streak.totalQuestionsAllTime >= 100);
  tryUnlock('questions_500', streak.totalQuestionsAllTime >= 500);
  tryUnlock('listening_star', hadListeningCorrect);

  const nextState: AppState = {
    ...tempState,
    unlockedBadges: Array.from(unlocked),
  };

  saveAppState(nextState);
  return { nextState, newlyUnlocked };
}

export function addCustomQuestionToState(prevState: AppState, q: Question): AppState {
  const nextState: AppState = {
    ...prevState,
    customQuestions: [q, ...prevState.customQuestions],
  };
  saveAppState(nextState);
  return nextState;
}
