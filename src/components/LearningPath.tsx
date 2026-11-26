import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Edit3,
  Flame,
  NotebookPen,
  Play,
  Settings2,
  Sparkles,
  Star,
  Target,
  Trophy,
  Volume2,
} from 'lucide-react';
import { AppState, LearningUnit, UserProfile } from '../types';
import { LEARNING_UNITS, getQuestionsForUnit } from '../data/learningPath';
import { VOCAB_WORDS } from '../data/vocabData';
import { computeStreakInfo } from '../utils/storage';
import { playQuestionAudio } from '../utils/sound';

interface Props {
  state: AppState;
  onUpdateProfile: (patch: Partial<UserProfile>) => void;
  onStartUnitLesson: (unit: LearningUnit) => void;
  onOpenVocabTheme: (themeId: string) => void;
  onStartDailyMiniExam: () => void;
  onOpenMistakes: () => void;
  onOpenCalendar: () => void;
}

const AVATARS = ['🐰', '🐱', '🦉', '🐼', '🦊', '🦄', '🌸', '🌟'];

export const LearningPath: React.FC<Props> = ({
  state,
  onUpdateProfile,
  onStartUnitLesson,
  onOpenVocabTheme,
  onStartDailyMiniExam,
  onOpenMistakes,
  onOpenCalendar,
}) => {
  const streak = useMemo(() => computeStreakInfo(state), [state]);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [nameDraft, setNameDraft] = useState(state.profile.name);
  const [testingSpeaker, setTestingSpeaker] = useState(false);

  const activeMistakesCount = useMemo(
    () => Object.values(state.mistakes).filter((m) => !m.resolved).length,
    [state.mistakes]
  );

  // Recommend the first unit that hasn't reached 80%+ yet (or next in rotation)
  const recommendedUnitId = useMemo(() => {
    const unmastered = LEARNING_UNITS.find(
      (u) => (state.unitProgress[u.id]?.bestAccuracy || 0) < 80
    );
    return unmastered ? unmastered.id : LEARNING_UNITS[0].id;
  }, [state.unitProgress]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Chào buổi sáng'
      : hour < 18
      ? 'Chào buổi chiều'
      : 'Chào buổi tối';

  const handleTestSpeaker = () => {
    playQuestionAudio(
      './audio/test_speaker.mp3',
      'Hello Mai Nhi! Welcome to IOE Grade 5. Your speakers are working great!',
      {
        onStart: () => setTestingSpeaker(true),
        onEnd: () => setTestingSpeaker(false),
        onError: () => setTestingSpeaker(false),
      }
    );
  };

  const lessonsDone = streak.todayLessons;
  const lessonsGoal = state.profile.dailyLessonsGoal;
  const examsDone = streak.todayExams;
  const examsGoal = state.profile.dailyExamGoal;
  const minutesDone = streak.todayMinutes;
  const minutesGoal = state.profile.dailyMinutesGoal;

  return (
    <div className="space-y-6">
      {/* Top Personalized Welcome Banner for Mai Nhi */}
      <div className="bg-gradient-to-r from-[#0057a8] via-[#1b75d0] to-[#38bdf8] rounded-3xl p-5 lg:p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl lg:text-5xl shadow-inner animate-float border border-white/30">
              {state.profile.avatar}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-sky-100">
                {greeting}, công chúa học giỏi lớp 5! ✨
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
                  Học Tiếng Anh IOE cùng {state.profile.name}
                </h1>
                <button
                  onClick={() => {
                    setNameDraft(state.profile.name);
                    setShowProfileEditor((v) => !v);
                  }}
                  className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition cursor-pointer"
                  title="Đổi tên / hình đại diện"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-sky-50 mt-1">
                Mỗi ngày học nhẹ nhàng vài bài chủ đề + từ vựng + 1 bài test nhỏ là đi thi Cấp Xã tự tin 100%!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleTestSpeaker}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-sm shadow transition flex items-center gap-2 cursor-pointer ${
                testingSpeaker
                  ? 'bg-emerald-400 text-emerald-950 animate-pulse'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {testingSpeaker ? 'Đang phát loa...' : 'Kiểm tra loa'}
            </button>
            <button
              onClick={() => setShowGoalEditor((v) => !v)}
              className="px-4 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
              Chỉnh mục tiêu ngày
            </button>
          </div>
        </div>

        {/* Inline Profile Editor */}
        {showProfileEditor && (
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-end gap-4 animate-pop">
            <div>
              <label className="block text-xs font-bold text-sky-100 mb-1">
                Tên của bé
              </label>
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && nameDraft.trim()) {
                    onUpdateProfile({ name: nameDraft.trim() });
                    setShowProfileEditor(false);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-sky-100 mb-1">
                Chọn hình dễ thương
              </label>
              <div className="flex gap-1.5">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    onClick={() => onUpdateProfile({ avatar: av })}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl cursor-pointer transition ${
                      state.profile.avatar === av
                        ? 'bg-yellow-400 scale-110 shadow'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (nameDraft.trim()) onUpdateProfile({ name: nameDraft.trim() });
                setShowProfileEditor(false);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold text-sm cursor-pointer"
            >
              Lưu lại
            </button>
          </div>
        )}

        {/* Inline Custom Daily Plan / Streak Goal Picker */}
        {showGoalEditor && (
          <div className="mt-4 pt-4 border-t border-white/20 bg-white/10 rounded-2xl p-4 space-y-4 animate-pop">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-300" />
                Chọn kế hoạch học mỗi ngày để giữ Streak cho {state.profile.name}:
              </div>
              <button
                onClick={() => setShowGoalEditor(false)}
                className="px-3 py-1 rounded-lg bg-white text-blue-900 font-extrabold text-xs cursor-pointer"
              >
                Xong ✓
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1-5 Lessons per day */}
              <div className="bg-white/15 rounded-xl p-3 space-y-2">
                <div className="text-xs font-bold text-sky-100">
                  📚 Số bài học chủ đề / ngày (1 – 5 bài)
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => onUpdateProfile({ dailyLessonsGoal: n })}
                      className={`flex-1 py-2 rounded-xl font-black text-sm transition cursor-pointer ${
                        state.profile.dailyLessonsGoal === n
                          ? 'bg-yellow-400 text-blue-950 shadow'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* 0 or 1 Cấp Xã Test per day */}
              <div className="bg-white/15 rounded-xl p-3 space-y-2">
                <div className="text-xs font-bold text-sky-100">
                  📝 Bài test Cấp Xã / ngày
                </div>
                <div className="flex gap-2">
                  {[
                    { val: 0, label: 'Không bắt buộc' },
                    { val: 1, label: '1 bài test / ngày' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => onUpdateProfile({ dailyExamGoal: opt.val })}
                      className={`flex-1 py-2 px-2 rounded-xl font-extrabold text-xs transition cursor-pointer ${
                        state.profile.dailyExamGoal === opt.val
                          ? 'bg-yellow-400 text-blue-950 shadow'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Minutes Goal per day */}
              <div className="bg-white/15 rounded-xl p-3 space-y-2">
                <div className="text-xs font-bold text-sky-100">
                  ⏱️ Thời gian học mỗi ngày (phút)
                </div>
                <div className="flex gap-1.5">
                  {[10, 15, 20, 30, 45].map((m) => (
                    <button
                      key={m}
                      onClick={() => onUpdateProfile({ dailyMinutesGoal: m })}
                      className={`flex-1 py-2 rounded-xl font-black text-xs transition cursor-pointer ${
                        state.profile.dailyMinutesGoal === m
                          ? 'bg-yellow-400 text-blue-950 shadow'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {m}p
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main 2-Column Desktop Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (8 cols): Duolingo-Style 10-Unit Learning Path */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-500" />
                Lộ Trình Học Theo Chủ Đề (Giống Duolingo)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Mỗi chặng gồm Từ vựng dễ nhớ + Bài luyện 10 câu có giải thích tiếng Việt chi tiết
              </p>
            </div>
            <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full">
              Đã qua {Object.keys(state.unitProgress).length} / {LEARNING_UNITS.length} chặng
            </span>
          </div>

          <div className="space-y-3.5">
            {LEARNING_UNITS.map((unit) => {
              const prog = state.unitProgress[unit.id];
              const stars =
                !prog
                  ? 0
                  : prog.bestAccuracy >= 90
                  ? 3
                  : prog.bestAccuracy >= 70
                  ? 2
                  : 1;
              const isRecommended = unit.id === recommendedUnitId;
              const qCount = getQuestionsForUnit(unit, state.customQuestions).length;

              return (
                <div
                  key={unit.id}
                  className={`bg-white rounded-2xl border-2 p-4 sm:p-5 transition-all hover:shadow-md ${
                    isRecommended
                      ? 'border-emerald-400 ring-4 ring-emerald-100/80 shadow-sm'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Step Icon Circle */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${unit.color} text-white flex items-center justify-center text-3xl shadow-md shrink-0 relative`}
                      >
                        {unit.emoji}
                        <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center border-2 border-white">
                          {unit.order}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                            {unit.title}
                          </h3>
                          {isRecommended && (
                            <span className="text-[11px] font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">
                              🌟 GỢI Ý HÔM NAY
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500">
                          {unit.subtitle}
                        </p>

                        {/* Stars & Completion stats */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= stars
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200 fill-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-slate-500">
                            {prog
                              ? `Đã học ${prog.completions} lần • Tốt nhất ${prog.bestAccuracy}%`
                              : `Chưa học • ${qCount} câu trong kho`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col lg:flex-row items-center gap-2 shrink-0">
                      {unit.vocabThemeId && (
                        <button
                          onClick={() => onOpenVocabTheme(unit.vocabThemeId!)}
                          className="flex-1 sm:w-full lg:w-auto px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          Từ vựng
                        </button>
                      )}
                      <button
                        onClick={() => onStartUnitLesson(unit)}
                        className={`flex-1 sm:w-full lg:w-auto px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-white shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
                          isRecommended
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : 'bg-[#0066c0] hover:bg-[#00509a]'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Học ngay
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR (4 cols): Sticky Daily Streak & Mission Checklist */}
        <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          {/* Streak Flame Card */}
          <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Flame className="w-9 h-9 text-yellow-100 fill-yellow-200" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-orange-100">
                    Chuỗi ngày học của {state.profile.name}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black">{streak.currentStreak}</span>
                    <span className="text-sm font-bold">ngày liên tiếp</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenCalendar}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-extrabold cursor-pointer"
              >
                Xem lịch →
              </button>
            </div>
            <div className="mt-3 text-xs font-semibold text-orange-50 bg-black/15 rounded-xl px-3 py-2">
              {streak.todayAllGoalsMet
                ? '🎉 Quá xuất sắc! Hôm nay Mai Nhi đã hoàn thành 100% kế hoạch!'
                : streak.studiedToday
                ? `🔥 Đã giữ lửa hôm nay (${streak.todayPlanPercent}% kế hoạch). Cố nốt cho đủ 100% nhé!`
                : '✨ Học 1 bài chủ đề hoặc 5 phút từ vựng để thắp lửa hôm nay nào!'}
            </div>
          </div>

          {/* Daily Mission Checklist Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Nhiệm Vụ Hôm Nay
              </h3>
              <button
                onClick={() => setShowGoalEditor((v) => !v)}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Chỉnh mục tiêu
              </button>
            </div>

            {/* Goal 1: Topic Lessons */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  {lessonsDone >= lessonsGoal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <span>📚</span>
                  )}
                  Bài học chủ đề
                </span>
                <span
                  className={
                    lessonsDone >= lessonsGoal ? 'text-emerald-600' : 'text-blue-700'
                  }
                >
                  {lessonsDone} / {lessonsGoal} bài
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((lessonsDone / Math.max(1, lessonsGoal)) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Goal 2: Cấp Xã Test (if enabled) */}
            {examsGoal > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    {examsDone >= examsGoal ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <span>🏆</span>
                    )}
                    Bài Test Cấp Xã
                  </span>
                  <span
                    className={
                      examsDone >= examsGoal ? 'text-emerald-600' : 'text-blue-700'
                    }
                  >
                    {examsDone} / {examsGoal} bài
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((examsDone / examsGoal) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Goal 3: Study Minutes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  {minutesDone >= minutesGoal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                  Thời gian học hôm nay
                </span>
                <span
                  className={
                    minutesDone >= minutesGoal ? 'text-emerald-600' : 'text-amber-600'
                  }
                >
                  {minutesDone} / {minutesGoal} phút
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((minutesDone / Math.max(1, minutesGoal)) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Quick Daily Mini-Test Launcher */}
            <button
              onClick={onStartDailyMiniExam}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0057a8] to-[#0073d6] hover:from-[#004a91] hover:to-[#0060b8] text-white font-extrabold text-sm shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-yellow-300" />
              Làm Bài Test Cấp Xã Ngày (30 câu)
            </button>
          </div>

          {/* Mistake Notebook Quick Card */}
          <div className="bg-white rounded-3xl border border-rose-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <NotebookPen className="w-5 h-5 text-rose-500" />
                Sổ Lỗi Sai
              </h3>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  activeMistakesCount > 0
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {activeMistakesCount > 0 ? `${activeMistakesCount} câu chờ sửa` : 'Sạch bong ✓'}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {activeMistakesCount > 0
                ? `Mai Nhi có ${activeMistakesCount} câu từng làm nhầm. Vào ôn sửa để lần sau không bao giờ sai nữa nhé!`
                : 'Tuyệt quá! Sổ lỗi sai đang trống trơn — Mai Nhi đang làm bài rất chắc chắn!'}
            </p>
            <button
              onClick={onOpenMistakes}
              className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold text-xs sm:text-sm cursor-pointer"
            >
              Mở Sổ Lỗi Sai →
            </button>
          </div>

          {/* Vocab Progress Mini Card */}
          <div className="bg-white rounded-3xl border border-amber-200 shadow-sm p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm">
                🌟 Từ Vựng Đã Thuộc
              </span>
              <span className="text-sm font-black text-amber-600">
                {state.masteredVocabIds.length} / {VOCAB_WORDS.length} từ
              </span>
            </div>
            <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                style={{
                  width: `${Math.round((state.masteredVocabIds.length / VOCAB_WORDS.length) * 100)}%`,
                }}
              />
            </div>
            <button
              onClick={() => onOpenVocabTheme('all')}
              className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-xs cursor-pointer"
            >
              Vào Góc Học Từ Vựng Tiểu Học →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
