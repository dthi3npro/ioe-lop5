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
  /** Audio script spoken by Web Speech API (for listening questions) */
  audioText?: string;
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

export interface ExamConfig {
  id: string;
  title: string;
  subtitle: string;
  mode: 'ioe_exam' | 'quick_practice';
  year?: ExamYear | 'all';
  questionCount: number;
  durationSeconds: number; // 1800 for 30 min IOE exam
  questions: Question[];
}

export interface AnswerRecord {
  questionId: string;
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  skipped?: boolean;
}

export interface ExamHistoryItem {
  id: string;
  dateISO: string;
  dateKey: string; // YYYY-MM-DD
  examTitle: string;
  mode: 'ioe_exam' | 'quick_practice';
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
  examsCompleted: number;
  minutesStudied: number;
}

export interface UserProfile {
  name: string;
  className: string;
  avatar: string;
  dailyGoal: number; // default 20 questions/day to keep streak
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
}
