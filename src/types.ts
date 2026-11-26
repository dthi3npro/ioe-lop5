export type QuestionType =
  | 'multiple_choice'
  | 'odd_one_out'
  | 'pronunciation'
  | 'fill_blank'
  | 'reorder'
  | 'listening_mc'
  | 'listening_fill'
  | 'reading';

export type ExamYear = '2024-2025' | '2023-2024' | '2022-2023' | 'custom';

export interface Question {
  id: string;
  type: QuestionType;
  year: ExamYear;
  topic: string;
  prompt: string;
  /** Reading passage (for reading questions) */
  passage?: string;
  /** Audio script spoken by Web Speech API (fallback for custom listening questions) */
  audioText?: string;
  /** Pre-generated static MP3 URL in /public/audio/ for reliable playback */
  audioUrl?: string;
  /** Choices for MC / Odd one out / Pronunciation / Listening MC / Reading */
  options?: string[];
  /** Word chunks for reorder questions (will be shuffled at runtime) */
  words?: string[];
  /** Hint pattern for fill_blank (e.g. "p _ _ _" or "1 từ") */
  hint?: string;
  /** Exact correct answer (or pipe-separated accepted answers for fill_blank, e.g. "at|on") */
  answer: string;
  /** Vietnamese explanation */
  explanation: string;
}

export interface VocabWord {
  id: string;
  themeId: string;
  word: string;
  phonetic: string;
  meaningVi: string;
  emoji: string;
  exampleEn: string;
  exampleVi: string;
  audioUrl: string;
}

export interface VocabTheme {
  id: string;
  title: string;
  emoji: string;
  color: string;
  desc: string;
}

export interface LearningUnit {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  vocabThemeId?: string;
  questionIds?: string[];
  filterFnKey:
    | 'school'
    | 'family_home'
    | 'tenses'
    | 'places_prepositions'
    | 'health_safety'
    | 'weather_travel'
    | 'animals_food'
    | 'listening'
    | 'reorder_fill'
    | 'pron_odd_stem';
}

export type SessionKind = 'ioe_exam' | 'unit_lesson' | 'mistake_review' | 'quick_practice';

export interface ExamConfig {
  id: string;
  title: string;
  subtitle: string;
  mode: 'ioe_exam' | 'quick_practice';
  sessionKind: SessionKind;
  unitId?: string;
  year?: ExamYear | 'all';
  questionCount: number;
  durationSeconds: number;
  questions: Question[];
}

export interface AnswerRecord {
  questionId: string;
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  skipped?: boolean;
}

export interface MistakeEntry {
  question: Question;
  lastWrongAnswer: string;
  wrongCount: number;
  lastSeenISO: string;
  resolved: boolean;
}

export interface ExamHistoryItem {
  id: string;
  dateISO: string;
  dateKey: string; // YYYY-MM-DD
  examTitle: string;
  mode: 'ioe_exam' | 'quick_practice';
  sessionKind?: SessionKind;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  wrongAnswers: AnswerRecord[];
}

export interface DailyStudyLog {
  dateKey: string; // YYYY-MM-DD
  questionsDone: number;
  correctCount: number;
  examsCompleted: number; // Bài test Cấp Xã đã làm
  lessonsCompleted: number; // Bài học chủ đề kiểu Duolingo đã làm
  vocabSessions: number; // Lượt học từ vựng
  minutesStudied: number; // Tổng phút học trong ngày
}

export interface UserProfile {
  name: string;
  className: string;
  avatar: string;
  /** Legacy compatibility + general count */
  dailyGoal: number;
  /** 1-5 bài học chủ đề mỗi ngày */
  dailyLessonsGoal: number;
  /** 0 hoặc 1 bài test Cấp Xã mỗi ngày */
  dailyExamGoal: number;
  /** Mục tiêu số phút học mỗi ngày (10, 15, 20, 30, 45) */
  dailyMinutesGoal: number;
  soundEnabled: boolean;
  streakFreezeCount: number;
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface AppState {
  profile: UserProfile;
  dailyLogs: Record<string, DailyStudyLog>;
  history: ExamHistoryItem[];
  unlockedBadges: string[];
  customQuestions: Question[];
  /** UnitId -> best stars (1..3) */
  unitProgress: Record<string, { completions: number; bestAccuracy: number }>;
  /** Mastered vocabulary word IDs */
  masteredVocabIds: string[];
  /** Persistent mistake notebook keyed by question.id */
  mistakes: Record<string, MistakeEntry>;
}
