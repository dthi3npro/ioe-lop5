import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  Flame,
  Home,
  NotebookPen,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  AnswerRecord,
  AppState,
  BadgeDef,
  ExamConfig,
  ExamHistoryItem,
  ExamYear,
  LearningUnit,
  Question,
  UserProfile,
} from './types';
import {
  BUILTIN_QUESTIONS,
  PracticeCategory,
  buildDailyMiniExam,
  buildOfficialIOEExam,
  buildQuickPractice,
} from './data/examBank';
import { buildUnitLesson } from './data/learningPath';
import {
  addCustomQuestionToState,
  computeStreakInfo,
  getTodayKey,
  loadAppState,
  markMistakeResolved,
  recordExamResult,
  recordVocabGameComplete,
  saveAppState,
  toggleVocabMastered,
} from './utils/storage';
import { LearningPath } from './components/LearningPath';
import { VocabStudio } from './components/VocabStudio';
import { ExamHub } from './components/ExamHub';
import { MistakeNotebook } from './components/MistakeNotebook';
import { StreakCalendar } from './components/StreakCalendar';
import { HistoryView } from './components/HistoryView';
import { QuestionBankManager } from './components/QuestionBankManager';
import { ExamRoom } from './components/ExamRoom';
import { ResultSummary } from './components/ResultSummary';
import { ParentReportView } from './components/ParentReportView';

type Tab = 'learn' | 'vocab' | 'exam' | 'mistakes' | 'progress' | 'bank';

function isParentReportRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.replace(/\/+$/, '') === '/quan-ly';
}

export function App() {
  const [isParentView, setIsParentView] = useState<boolean>(() =>
    isParentReportRoute()
  );
  const [state, setState] = useState<AppState>(() => loadAppState());

  useEffect(() => {
    const onPop = () => setIsParentView(isParentReportRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openParentView = () => {
    window.history.pushState({}, '', '/quan-ly');
    setIsParentView(true);
  };

  const closeParentView = () => {
    window.history.pushState({}, '', '/');
    setIsParentView(false);
  };
  const [tab, setTab] = useState<Tab>('learn');
  const [vocabThemeId, setVocabThemeId] = useState<string>('school');
  const [activeExam, setActiveExam] = useState<ExamConfig | null>(null);
  const [lastResult, setLastResult] = useState<{
    item: ExamHistoryItem;
    newBadges: BadgeDef[];
    resolvedCount: number;
  } | null>(null);

  const streak = useMemo(() => computeStreakInfo(state), [state]);
  const totalBankCount = BUILTIN_QUESTIONS.length + state.customQuestions.length;
  const activeMistakesCount = useMemo(
    () => Object.values(state.mistakes).filter((m) => !m.resolved).length,
    [state.mistakes]
  );

  const updateProfile = (patch: Partial<UserProfile>) => {
    setState((prev) => {
      const next: AppState = {
        ...prev,
        profile: { ...prev.profile, ...patch },
      };
      saveAppState(next);
      return next;
    });
  };

  const startUnitLesson = (unit: LearningUnit) => {
    setLastResult(null);
    setActiveExam(buildUnitLesson(unit, state.customQuestions, 10));
  };

  const startOfficialExam = (year: ExamYear | 'all') => {
    setLastResult(null);
    setActiveExam(buildOfficialIOEExam(year, state.customQuestions));
  };

  const startDailyMiniExam = (year: ExamYear | 'all' = 'all') => {
    setLastResult(null);
    setActiveExam(buildDailyMiniExam(year, state.customQuestions));
  };

  const startQuickPractice = (category: PracticeCategory, count: number) => {
    setLastResult(null);
    setActiveExam(buildQuickPractice(category, count, state.customQuestions));
  };

  const startMistakeReview = (questions: Question[], title?: string) => {
    if (questions.length === 0) return;
    setLastResult(null);
    setActiveExam({
      id: `mistakes_${Date.now()}`,
      title: title || `Ôn Sửa Lỗi Sai của ${state.profile.name} (${questions.length} câu)`,
      subtitle: 'Làm đúng câu nào sẽ tự động đánh dấu Đã khắc phục ✓ trong Sổ Lỗi Sai!',
      mode: 'quick_practice',
      sessionKind: 'mistake_review',
      questionCount: questions.length,
      durationSeconds: questions.length * 60,
      questions,
    });
  };

  const handleFinishExam = (records: AnswerRecord[], timeSpentSeconds: number) => {
    if (!activeExam) return;
    const correctCount = records.filter((r) => r.isCorrect).length;
    const wrongAnswers = records.filter((r) => !r.isCorrect);
    const answeredCount = Math.max(1, records.length);

    const historyItem: ExamHistoryItem = {
      id: `res_${Date.now()}`,
      dateISO: new Date().toISOString(),
      dateKey: getTodayKey(),
      examTitle: activeExam.title,
      mode: activeExam.mode,
      sessionKind: activeExam.sessionKind,
      score: correctCount * 10,
      maxScore: activeExam.questionCount * 10,
      correctCount,
      totalQuestions: answeredCount,
      timeSpentSeconds,
      wrongAnswers,
    };

    const { nextState, newlyUnlocked, resolvedCountInSession } = recordExamResult(
      state,
      historyItem,
      records,
      activeExam.sessionKind,
      activeExam.unitId
    );
    setState(nextState);
    setActiveExam(null);
    setLastResult({
      item: historyItem,
      newBadges: newlyUnlocked,
      resolvedCount: resolvedCountInSession,
    });
  };

  // Dedicated Parent/Sibling Report Page (/quan-ly)
  if (isParentView) {
    return (
      <ParentReportView localState={state} onBackToApp={closeParentView} />
    );
  }

  // Fullscreen Exam Room View
  if (activeExam) {
    return (
      <ExamRoom
        exam={activeExam}
        profile={state.profile}
        onToggleSound={() =>
          updateProfile({ soundEnabled: !state.profile.soundEnabled })
        }
        onFinish={handleFinishExam}
        onExit={() => setActiveExam(null)}
      />
    );
  }

  // Result Summary View
  if (lastResult) {
    return (
      <div className="min-h-screen bg-[#f4f8fd]">
        <ResultSummary
          studentName={state.profile.name}
          result={lastResult.item}
          newlyUnlockedBadges={lastResult.newBadges}
          resolvedMistakesCount={lastResult.resolvedCount}
          currentStreak={streak.currentStreak}
          onGoHome={() => {
            setLastResult(null);
            setTab('learn');
          }}
          onRetryWrong={
            lastResult.item.wrongAnswers.length > 0
              ? () =>
                  startMistakeReview(
                    lastResult.item.wrongAnswers.map((w) => w.question),
                    `Sửa ngay ${lastResult.item.wrongAnswers.length} câu vừa nhầm`
                  )
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8fd] flex flex-col">
      {/* Kid-Friendly Desktop Navbar personalized for Mai Nhi */}
      <header className="ioe-header-bg text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setTab('learn')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-blue-700 font-black flex items-center justify-center shadow text-xl border-2 border-yellow-300">
              {state.profile.avatar}
            </div>
            <div className="text-left">
              <div className="font-black text-base lg:text-lg leading-tight flex items-center gap-1.5">
                <span>IOE Lớp 5 • {state.profile.name}</span>
              </div>
              <div className="text-[11px] text-sky-100 hidden sm:block">
                Ôn tập mỗi ngày kiểu Duolingo & Luyện thi Cấp Xã
              </div>
            </div>
          </button>

          <nav className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setTab('learn')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                tab === 'learn'
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/15'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Học hôm nay</span>
            </button>

            <button
              onClick={() => setTab('vocab')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                tab === 'vocab'
                  ? 'bg-white text-orange-600 shadow'
                  : 'text-blue-100 hover:bg-white/15'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Từ vựng</span>
            </button>

            <button
              onClick={() => setTab('exam')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                tab === 'exam'
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/15'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Thi Cấp Xã</span>
            </button>

            <button
              onClick={() => setTab('mistakes')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition cursor-pointer relative ${
                tab === 'mistakes'
                  ? 'bg-white text-rose-600 shadow'
                  : 'text-blue-100 hover:bg-white/15'
              }`}
            >
              <NotebookPen className="w-4 h-4" />
              <span>Sổ lỗi sai</span>
              {activeMistakesCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black leading-tight">
                  {activeMistakesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setTab('progress')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                tab === 'progress'
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/15'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden md:inline">Lịch & Huy hiệu</span>
            </button>

            <button
              onClick={() => setTab('bank')}
              className={`px-2.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 transition cursor-pointer ${
                tab === 'bank'
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/15'
              }`}
              title="Kho đề & Thêm câu hỏi mới"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden xl:inline">Kho đề</span>
            </button>

            {/* Streak Flame Pill */}
            <button
              onClick={() => setTab('progress')}
              className="ml-1 px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-black text-xs sm:text-sm flex items-center gap-1 shadow cursor-pointer"
              title="Chuỗi ngày học liên tiếp"
            >
              <Flame className="w-4 h-4 fill-yellow-200 text-yellow-200" />
              {streak.currentStreak}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-6 py-6">
        {tab === 'learn' && (
          <LearningPath
            state={state}
            onUpdateProfile={updateProfile}
            onStartUnitLesson={startUnitLesson}
            onOpenVocabTheme={(themeId) => {
              setVocabThemeId(themeId);
              setTab('vocab');
            }}
            onStartDailyMiniExam={() => startDailyMiniExam('all')}
            onOpenMistakes={() => setTab('mistakes')}
            onOpenCalendar={() => setTab('progress')}
          />
        )}

        {tab === 'vocab' && (
          <VocabStudio
            initialThemeId={vocabThemeId}
            masteredIds={state.masteredVocabIds}
            soundEnabled={state.profile.soundEnabled}
            studentName={state.profile.name}
            onToggleMastered={(wordId) =>
              setState((prev) => toggleVocabMastered(prev, wordId))
            }
            onCompleteGame={(minutes, totalQ, correctQ) =>
              setState((prev) =>
                recordVocabGameComplete(prev, minutes, totalQ, correctQ)
              )
            }
          />
        )}

        {tab === 'exam' && (
          <ExamHub
            studentName={state.profile.name}
            totalBankCount={totalBankCount}
            onStartOfficialExam={startOfficialExam}
            onStartDailyMiniExam={startDailyMiniExam}
            onStartQuickPractice={startQuickPractice}
          />
        )}

        {tab === 'mistakes' && (
          <MistakeNotebook
            studentName={state.profile.name}
            mistakes={state.mistakes}
            onStartReviewMistakes={(qs) => startMistakeReview(qs)}
            onMarkResolved={(qid) =>
              setState((prev) => markMistakeResolved(prev, qid))
            }
          />
        )}

        {tab === 'progress' && (
          <div className="space-y-6">
            <StreakCalendar state={state} />
            <HistoryView
              state={state}
              onPracticeQuestions={(qs, title) => startMistakeReview(qs, title)}
            />
          </div>
        )}

        {tab === 'bank' && (
          <QuestionBankManager
            customQuestions={state.customQuestions}
            onAddQuestion={(q) =>
              setState((prev) => addCustomQuestionToState(prev, q))
            }
          />
        )}
      </main>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200/70 space-x-3">
        <span>
          Góc học Tiếng Anh IOE Lớp 5 dành riêng cho {state.profile.name} 🐰 • Chúc {state.profile.name} thi Cấp Xã thật tự tin & rinh giải cao! 🏆
        </span>
        <button
          onClick={openParentView}
          className="text-slate-400 hover:text-blue-600 underline cursor-pointer"
        >
          📊 Báo cáo phụ huynh
        </button>
      </footer>
    </div>
  );
}

export default App;
