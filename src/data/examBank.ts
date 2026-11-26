import { ExamConfig, ExamYear, Question, QuestionType } from '../types';
import { MC_QUESTIONS } from './mcQuestions';
import { FILL_QUESTIONS } from './fillQuestions';
import { REORDER_QUESTIONS } from './reorderQuestions';
import { LISTENING_QUESTIONS } from './listeningQuestions';
import { READING_QUESTIONS } from './readingQuestions';

export const BUILTIN_QUESTIONS: Question[] = [
  ...MC_QUESTIONS,
  ...FILL_QUESTIONS,
  ...REORDER_QUESTIONS,
  ...LISTENING_QUESTIONS,
  ...READING_QUESTIONS,
];

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function randomShuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Builds an official 200-question / 30-minute IOE Cấp Xã exam set.
 * Prioritizes questions tagged with the selected year first, then fills the remaining
 * slots up to 200 with balanced questions from other years (zero duplicates!).
 */
export function buildOfficialIOEExam(
  year: ExamYear | 'all',
  customQuestions: Question[] = []
): ExamConfig {
  const all = [...customQuestions, ...BUILTIN_QUESTIONS];
  const targetCount = Math.min(200, all.length);

  let selected: Question[];
  let title = '';
  let subtitle = '';

  if (year === 'all') {
    selected = randomShuffle(all).slice(0, targetCount);
    title = 'Đề Thi Thử Tổng Hợp IOE Lớp 5 Cấp Xã (Ngẫu Nhiên)';
    subtitle = 'Trộn ngẫu nhiên từ toàn bộ ngân hàng đề các năm 2022–2025';
  } else {
    const seedMap: Record<ExamYear, number> = {
      '2024-2025': 202505,
      '2023-2024': 202405,
      '2022-2023': 202305,
      custom: 99999,
    };
    const primary = seededShuffle(
      all.filter((q) => q.year === year),
      seedMap[year]
    );
    const secondary = seededShuffle(
      all.filter((q) => q.year !== year),
      seedMap[year] + 77
    );
    selected = seededShuffle(
      [...primary, ...secondary].slice(0, targetCount),
      seedMap[year] + 13
    );
    title = `Đề Thi IOE Lớp 5 Cấp Xã Năm Học ${year}`;
    subtitle = `Bộ đề tổng hợp ${targetCount} câu chuẩn cấu trúc phòng thi IOE (30 phút)`;
  }

  return {
    id: `ioe_${year}_${Date.now()}`,
    title,
    subtitle,
    mode: 'ioe_exam',
    sessionKind: 'ioe_exam',
    year,
    questionCount: selected.length,
    durationSeconds: 30 * 60,
    questions: selected,
  };
}

/**
 * Kid-friendly daily Mini-Test Cấp Xã (30 questions / 10 minutes, authentic IOE exam feel)
 * so Mai Nhi can easily finish 1 test every day without getting tired!
 */
export function buildDailyMiniExam(
  year: ExamYear | 'all' = 'all',
  customQuestions: Question[] = []
): ExamConfig {
  const all = [...customQuestions, ...BUILTIN_QUESTIONS];
  const pool = year === 'all' ? all : all.filter((q) => q.year === year);
  const selected = randomShuffle(pool.length >= 30 ? pool : all).slice(0, 30);
  return {
    id: `mini_ioe_${year}_${Date.now()}`,
    title:
      year === 'all'
        ? 'Bài Test Cấp Xã Hàng Ngày (30 câu)'
        : `Bài Test Nhanh Cấp Xã ${year} (30 câu)`,
    subtitle: '30 câu đủ mọi dạng bài thi IOE • 10 phút • Tính hoàn thành mục tiêu Test ngày',
    mode: 'ioe_exam',
    sessionKind: 'ioe_exam',
    year,
    questionCount: selected.length,
    durationSeconds: 10 * 60,
    questions: selected,
  };
}

export type PracticeCategory =
  | 'all'
  | 'grammar_vocab'
  | 'fill_blank'
  | 'reorder'
  | 'listening'
  | 'odd_pronunciation'
  | 'reading';

export const PRACTICE_CATEGORIES: {
  id: PracticeCategory;
  label: string;
  emoji: string;
  desc: string;
}[] = [
  { id: 'all', label: 'Tổng hợp tất cả', emoji: '🌈', desc: 'Đủ mọi dạng bài thi IOE' },
  { id: 'grammar_vocab', label: 'Trắc nghiệm Ngữ pháp & Từ vựng', emoji: '📝', desc: 'Chọn A, B, C, D' },
  { id: 'fill_blank', label: 'Điền từ & Chữ cái', emoji: '✍️', desc: 'Điền chữ cái / từ còn thiếu' },
  { id: 'reorder', label: 'Sắp xếp câu', emoji: '🧩', desc: 'Ghép từ thành câu đúng' },
  { id: 'listening', label: 'Luyện Nghe (Listening)', emoji: '🎧', desc: 'Nghe giọng đọc tiếng Anh' },
  { id: 'odd_pronunciation', label: 'Khác loại & Phát âm', emoji: '🗣️', desc: 'Odd One Out & Pronunciation' },
  { id: 'reading', label: 'Đọc hiểu', emoji: '📖', desc: 'Đọc đoạn văn & True/False' },
];

export function buildQuickPractice(
  category: PracticeCategory,
  count: number,
  customQuestions: Question[] = []
): ExamConfig {
  const all = [...customQuestions, ...BUILTIN_QUESTIONS];

  const matchCategory = (type: QuestionType): boolean => {
    switch (category) {
      case 'all':
        return true;
      case 'grammar_vocab':
        return type === 'multiple_choice';
      case 'fill_blank':
        return type === 'fill_blank';
      case 'reorder':
        return type === 'reorder';
      case 'listening':
        return type === 'listening_mc' || type === 'listening_fill';
      case 'odd_pronunciation':
        return type === 'odd_one_out' || type === 'pronunciation';
      case 'reading':
        return type === 'reading';
    }
  };

  const pool = all.filter((q) => matchCategory(q.type));
  const selected = randomShuffle(pool).slice(0, Math.min(count, pool.length));
  const catInfo = PRACTICE_CATEGORIES.find((c) => c.id === category);

  return {
    id: `quick_${category}_${Date.now()}`,
    title: `Luyện Nhanh: ${catInfo?.label || 'Tổng hợp'}`,
    subtitle: `${selected.length} câu vui nhộn — có giải thích chi tiết sau mỗi câu`,
    mode: 'quick_practice',
    sessionKind: 'quick_practice',
    questionCount: selected.length,
    durationSeconds: selected.length * 45, // comfortable pace
    questions: selected,
  };
}

export function normalizeAnswer(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[’‘]/g, "'");
}

export function checkAnswer(question: Question, userInput: string): boolean {
  const normUser = normalizeAnswer(userInput);
  if (!normUser) return false;
  const accepted = question.answer.split('|').map(normalizeAnswer);
  return accepted.includes(normUser);
}
