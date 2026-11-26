import { ExamConfig, LearningUnit, Question } from '../types';
import { BUILTIN_QUESTIONS, randomShuffle } from './examBank';

export const LEARNING_UNITS: LearningUnit[] = [
  {
    id: 'unit_1_school',
    order: 1,
    title: 'Trường Học & Môn Học',
    subtitle: 'Môn học, thói quen đến trường & cách luyện Tiếng Anh',
    emoji: '🏫',
    color: 'from-blue-500 to-indigo-600',
    vocabThemeId: 'school',
    filterFnKey: 'school',
  },
  {
    id: 'unit_2_family',
    order: 2,
    title: 'Gia Đình, Quê Hương & Nghề Nghiệp',
    subtitle: 'Người thân, địa chỉ nhà, quê hương & ước mơ tương lai',
    emoji: '👨‍👩‍👧‍👦',
    color: 'from-pink-500 to-rose-500',
    vocabThemeId: 'family_jobs',
    filterFnKey: 'family_home',
  },
  {
    id: 'unit_3_tenses',
    order: 3,
    title: 'Thì Hiện Tại & Quá Khứ Đơn',
    subtitle: 'Chia động từ chuẩn IOE: everyday, now, yesterday, last week',
    emoji: '⏰',
    color: 'from-amber-500 to-orange-500',
    vocabThemeId: 'past_verbs',
    filterFnKey: 'tenses',
  },
  {
    id: 'unit_4_places',
    order: 4,
    title: 'Chỉ Đường, Địa Điểm & Giới Từ',
    subtitle: 'in, on, at, between, opposite & cách hỏi đường',
    emoji: '🗺️',
    color: 'from-teal-500 to-emerald-600',
    vocabThemeId: 'places_directions',
    filterFnKey: 'places_prepositions',
  },
  {
    id: 'unit_5_health',
    order: 5,
    title: 'Sức Khỏe & An Toàn Hàng Ngày',
    subtitle: 'What\'s the matter?, should/shouldn\'t & cảnh báo Don\'t...',
    emoji: '🩺',
    color: 'from-emerald-500 to-green-600',
    vocabThemeId: 'health_safety',
    filterFnKey: 'health_safety',
  },
  {
    id: 'unit_6_weather',
    order: 6,
    title: 'Thời Tiết, Các Mùa & Du Lịch',
    subtitle: '4 mùa, thời tiết tương lai (will) & kỳ nghỉ lễ hội',
    emoji: '🌤️',
    color: 'from-sky-500 to-cyan-600',
    vocabThemeId: 'weather_seasons',
    filterFnKey: 'weather_travel',
  },
  {
    id: 'unit_7_animals',
    order: 7,
    title: 'Động Vật, Đồ Ăn & Thức Uống',
    subtitle: 'Thú cưng, sở thú, món ăn & How much / How many',
    emoji: '🐼',
    color: 'from-lime-500 to-emerald-600',
    vocabThemeId: 'animals_food',
    filterFnKey: 'animals_food',
  },
  {
    id: 'unit_8_listening',
    order: 8,
    title: 'Luyện Nghe Siêu Đỉnh (File MP3)',
    subtitle: 'Nghe giọng đọc tiếng Anh chọn đáp án & điền từ chuẩn IOE',
    emoji: '🎧',
    color: 'from-cyan-500 to-blue-600',
    vocabThemeId: 'travel_holidays',
    filterFnKey: 'listening',
  },
  {
    id: 'unit_9_reorder',
    order: 9,
    title: 'Sắp Xếp Câu & Điền Từ IOE',
    subtitle: 'Luyện phản xạ ghép câu đúng ngữ pháp & đánh vần không sai chữ',
    emoji: '🧩',
    color: 'from-violet-500 to-purple-600',
    vocabThemeId: 'past_verbs',
    filterFnKey: 'reorder_fill',
  },
  {
    id: 'unit_10_pron',
    order: 10,
    title: 'Phát Âm, Từ Khác Loại & Liên Môn',
    subtitle: 'Odd One Out, Pronunciation & Toán – Khoa học – Địa lý bằng tiếng Anh',
    emoji: '🗣️',
    color: 'from-fuchsia-500 to-pink-600',
    vocabThemeId: 'school',
    filterFnKey: 'pron_odd_stem',
  },
];

function matchesUnit(q: Question, key: LearningUnit['filterFnKey']): boolean {
  const txt = `${q.topic} ${q.prompt}`.toLowerCase();
  switch (key) {
    case 'school':
      return /trường|môn học|học tập|subject|school|english|library|classroom|cartoon|homework|book/.test(txt);
    case 'family_home':
      return /gia đình|nghề|quê|nhà cửa|bạn bè|quốc gia|địa chỉ|pilot|architect|engineer|nurse|farmer|aunt|village|hometown|mother|father|sister/.test(txt);
    case 'tenses':
      return /quá khứ|hiện tại|tương lai|yesterday|last |tomorrow|every day|listen!|look!|did you/.test(txt);
    case 'places_prepositions':
      return /giới từ|địa điểm|chỉ đường|post office|museum|opposite|between|turn right|turn left|street|corner/.test(txt);
    case 'health_safety':
      return /sức khỏe|an toàn|should|mệnh lệnh|matter|toothache|fever|stomachache|throat|knife|burn|fall|stairs/.test(txt);
    case 'weather_travel':
      return /thời tiết|mùa|du lịch|lễ hội|biển|weather|season|spring|summer|autumn|winter|holiday|beach|island|ha long|da nang/.test(txt);
    case 'animals_food':
      return /động vật|đồ ăn|đồ uống|bữa ăn|sở thú|ăn uống|puppy|kitten|giraffe|elephant|zoo|rice|chocolate|juice|water|hungry|biscuits/.test(txt);
    case 'listening':
      return q.type === 'listening_mc' || q.type === 'listening_fill';
    case 'reorder_fill':
      return q.type === 'reorder' || q.type === 'fill_blank';
    case 'pron_odd_stem':
      return q.type === 'odd_one_out' || q.type === 'pronunciation' || /liên môn|trái nghĩa|so sánh/.test(txt);
  }
}

export function getQuestionsForUnit(
  unit: LearningUnit,
  customQuestions: Question[] = []
): Question[] {
  const all = [...customQuestions, ...BUILTIN_QUESTIONS];
  const matched = all.filter((q) => matchesUnit(q, unit.filterFnKey));
  return matched.length >= 8 ? matched : all;
}

export function buildUnitLesson(
  unit: LearningUnit,
  customQuestions: Question[] = [],
  count = 10
): ExamConfig {
  const pool = getQuestionsForUnit(unit, customQuestions);
  const selected = randomShuffle(pool).slice(0, Math.min(count, pool.length));
  return {
    id: `lesson_${unit.id}_${Date.now()}`,
    title: `Bài học Chặng ${unit.order}: ${unit.title}`,
    subtitle: `${selected.length} câu ngắn gọn — có giải thích dễ hiểu cho Mai Nhi`,
    mode: 'quick_practice',
    sessionKind: 'unit_lesson',
    unitId: unit.id,
    questionCount: selected.length,
    durationSeconds: selected.length * 60,
    questions: selected,
  };
}
