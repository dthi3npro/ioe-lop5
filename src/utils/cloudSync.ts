import { AppState, DailyStudyLog, ExamHistoryItem, MistakeEntry, UserProfile } from '../types';
import { VOCAB_WORDS } from '../data/vocabData';

export interface CloudProgressSnapshot {
  profile: UserProfile;
  dailyLogs: Record<string, DailyStudyLog>;
  recentHistory: Array<{
    id: string;
    dateISO: string;
    dateKey: string;
    examTitle: string;
    mode: ExamHistoryItem['mode'];
    score: number;
    maxScore: number;
    correctCount: number;
    totalQuestions: number;
    timeSpentSeconds: number;
  }>;
  activeMistakes: Array<{
    questionId: string;
    topic: string;
    prompt: string;
    lastWrongAnswer: string;
    correctAnswer: string;
    wrongCount: number;
  }>;
  resolvedMistakesCount: number;
  masteredVocabCount: number;
  totalVocabCount: number;
  completedUnitsCount: number;
  lastSyncedISO: string;
}

export function buildCloudSnapshot(state: AppState): CloudProgressSnapshot {
  const mistakeList: MistakeEntry[] = Object.values(state.mistakes);
  const activeMistakes = mistakeList
    .filter((m) => !m.resolved)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 30)
    .map((m) => ({
      questionId: m.question.id,
      topic: m.question.topic,
      prompt: m.question.prompt,
      lastWrongAnswer: m.lastWrongAnswer,
      correctAnswer: m.question.answer.split('|')[0],
      wrongCount: m.wrongCount,
    }));

  return {
    profile: state.profile,
    dailyLogs: state.dailyLogs,
    recentHistory: state.history.slice(0, 25).map((h) => ({
      id: h.id,
      dateISO: h.dateISO,
      dateKey: h.dateKey,
      examTitle: h.examTitle,
      mode: h.mode,
      score: h.score,
      maxScore: h.maxScore,
      correctCount: h.correctCount,
      totalQuestions: h.totalQuestions,
      timeSpentSeconds: h.timeSpentSeconds,
    })),
    activeMistakes,
    resolvedMistakesCount: mistakeList.filter((m) => m.resolved).length,
    masteredVocabCount: state.masteredVocabIds.length,
    totalVocabCount: VOCAB_WORDS.length,
    completedUnitsCount: Object.keys(state.unitProgress).length,
    lastSyncedISO: new Date().toISOString(),
  };
}

export async function pushProgressToCloud(
  state: AppState
): Promise<{ synced: boolean; configured: boolean }> {
  try {
    const snapshot = buildCloudSnapshot(state);
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot),
    });
    if (!res.ok) return { synced: false, configured: true };
    const json = (await res.json()) as { configured?: boolean; ok?: boolean };
    return {
      synced: Boolean(json.configured && json.ok),
      configured: Boolean(json.configured),
    };
  } catch {
    return { synced: false, configured: false };
  }
}

export async function fetchProgressFromCloud(): Promise<{
  configured: boolean;
  data: CloudProgressSnapshot | null;
  error?: string;
}> {
  try {
    const res = await fetch('/api/sync', { cache: 'no-store' });
    if (!res.ok) {
      return {
        configured: false,
        data: null,
        error: `Lỗi máy chủ (${res.status})`,
      };
    }
    const json = (await res.json()) as {
      configured?: boolean;
      data?: CloudProgressSnapshot | null;
      error?: string;
    };
    return {
      configured: Boolean(json.configured),
      data: json.data || null,
      error: json.error,
    };
  } catch {
    return {
      configured: false,
      data: null,
      error: 'Không kết nối được tới máy chủ đồng bộ.',
    };
  }
}
