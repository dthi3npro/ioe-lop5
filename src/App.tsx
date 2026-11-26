import React, { useMemo, useState } from 'react';
import { BookOpen, Flame, History, Home } from 'lucide-react';
import {
  AnswerRecord,
  AppState,
  BadgeDef,
  ExamConfig,
  ExamHistoryItem,
  ExamYear,
  Question,
  UserProfile,
} from './types';
import {
  BUILTIN_QUESTIONS,
  PracticeCategory,
  buildOfficialIOEExam,
  buildQuickPractice,
} from './data/examBank';
import {
  addCustomQuestionToState,
  computeStreakInfo,
  getTodayKey,
  loadAppState,
  recordExamResult,
  saveAppState,
} from './utils/storage';
import { Dashboard } from './components/Dashboard';
import { ExamRoom } from './components/ExamRoom';
import { ResultSummary } from './components/ResultSummary';
import { HistoryView } from './components/HistoryView';
import { QuestionBankManager } from './components/QuestionBankManager';

type Tab = 'home' | 'history' | 'bank';

export function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [tab, setTab] = useState<Tab>('home');
  const [activeExam, setActiveExam] = useState<ExamConfig | null>(null);
  const [lastResult, setLastResult] = useState<{
    item: ExamHistoryItem;
    newBadges: BadgeDef[];
  } | null>(null);

  const streak = useMemo(() => computeStreakInfo(state), [state]);
  const totalBankCount = BUILTIN_QUESTIONS.length + state.customQuestions.length;

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

  const startOfficialExam = (year: ExamYear | 'all') => {
    setLastResult(null);
    setActiveExam(buildOfficialIOEExam(year, state.customQuestions));
  };

  const startQuickPractice = (category: PracticeCategory, count: number) => {
    setLastResult(null);
    setActiveExam(buildQuickPractice(category, count, state.customQuestions));
  };

  const startCustomPracticeList = (questions: Question[], title: string) => {
    if (questions.length === 0) return;
    setLastResult(null);
    setActiveExam({
      id: `review_${Date.now()}`,
      title,
      subtitle: 'Ôn luyện tập trung các câu đã chọn',
      mode: 'quick_practice',
      questionCount: questions.length,
      durationSeconds: questions.length * 45,
      questions,
    });
  };

  const handleFinishExam = (records: AnswerRecord[], timeSpentSeconds: number) => {
    if (!activeExam) return;
    const correctCount = records.filter((r) => r.isCorrect).length;
    const wrongAnswers = records.filter((r) => !r.isCorrect);
    const answeredCount = Math.max(1, records.length);
    const hadListeningCorrect = records.some(
      (r) =>
        r.isCorrect &&
        (r.question.type === 'listening_mc' || r.question.type === 'listening_fill')
    );

    const historyItem: ExamHistoryItem = {
      id: `res_${Date.now()}`,
      dateISO: new Date().toISOString(),
      dateKey: getTodayKey(),
      examTitle: activeExam.title,
      mode: activeExam.mode,
      score: correctCount * 10,
      maxScore: activeExam.questionCount * 10,
      correctCount,
      totalQuestions: answeredCount,
      timeSpentSeconds,
      wrongAnswers,
    };

    const { nextState, newlyUnlocked } = recordExamResult(
      state,
      historyItem,
      hadListeningCorrect
    );
    setState(nextState);
    setActiveExam(null);
    setLastResult({ item: historyItem, newBadges: newlyUnlocked });
  };

  const handleAddCustomQuestion = (q: Question) => {
    setState((prev) => addCustomQuestionToState(prev, q));
  };

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
      <div className="min-h-screen bg-slate-50">
        <ResultSummary
          result={lastResult.item}
          newlyUnlockedBadges={lastResult.newBadges}
          currentStreak={streak.currentStreak}
          onGoHome={() => {
            setLastResult(null);
            setTab('home');
          }}
          onRetryWrong={
            lastResult.item.wrongAnswers.length > 0
              ? () =>
                  startCustomPracticeList(
                    lastResult.item.wrongAnswers.map((w) => w.question),
                    `Luyện lại câu sai (${lastResult.item.wrongAnswers.length} câu)`
                  )
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Main Top Navbar */}
      <header className="ioe-header-bg text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setTab('home')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-blue-700 font-black flex items-center justify-center shadow text-sm">
              IOE
            </div>
            <div className="text-left">
              <div className="font-black text-base sm:text-lg leading-tight">
                IOE Lớp 5 • Cấp Xã
              </div>
              <div className="text-[11px] text-blue-100 hidden sm:block">
                Luyện thi Olympic Tiếng Anh & Giữ chuỗi học tập
              </div>
            </div>
          </button>

          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setTab('home')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                tab === 'home'
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/15'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                tab === 'history'
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/15'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Lịch sử & Huy hiệu</span>
            </button>
            <button
              onClick={() => setTab('bank')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                tab === 'bank'
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/15'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Kho đề</span>
            </button>

            {/* Mini Streak Pill */}
            <div
              className="ml-1 px-3 py-1.5 rounded-full bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-1 shadow"
              title="Chuỗi ngày học liên tiếp"
            >
              <Flame className="w-4 h-4 fill-yellow-200 text-yellow-200" />
              {streak.currentStreak}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {tab === 'home' && (
          <Dashboard
            state={state}
            totalBankCount={totalBankCount}
            onUpdateProfile={updateProfile}
            onStartOfficialExam={startOfficialExam}
            onStartQuickPractice={startQuickPractice}
          />
        )}
        {tab === 'history' && (
          <HistoryView
            state={state}
            onPracticeQuestions={startCustomPracticeList}
          />
        )}
        {tab === 'bank' && (
          <QuestionBankManager
            customQuestions={state.customQuestions}
            onAddQuestion={handleAddCustomQuestion}
          />
        )}
      </main>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200/70">
        IOE Lớp 5 – Web luyện thi Cấp Xã & giữ chuỗi học tập dành cho học sinh tiểu học 🦉
      </footer>
    </div>
  );
}

export default App;
