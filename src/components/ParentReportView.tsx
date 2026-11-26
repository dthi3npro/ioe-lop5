import React, { useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Flame,
  NotebookPen,
  Trophy,
  XCircle,
} from 'lucide-react';
import { AppState } from '../types';
import { VOCAB_WORDS } from '../data/vocabData';
import { didStudyOnLog, getTodayKey, shiftDateKey } from '../utils/storage';

interface Props {
  localState: AppState;
  onBackToApp: () => void;
}

function formatDateTimeVi(iso?: string): string {
  if (!iso) return 'Chưa có';
  const dt = new Date(iso);
  return `${dt.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })} ngày ${dt.toLocaleDateString('vi-VN')}`;
}

export const ParentReportView: React.FC<Props> = ({
  localState,
  onBackToApp,
}) => {
  const today = getTodayKey();
  const todayLog = localState.dailyLogs[today];
  const studiedToday = didStudyOnLog(todayLog);
  const studentName = localState.profile.name || 'Mai Nhi';

  const streakDays = useMemo(() => {
    let count = 0;
    let cursor = studiedToday ? today : shiftDateKey(today, -1);
    while (didStudyOnLog(localState.dailyLogs[cursor])) {
      count++;
      cursor = shiftDateKey(cursor, -1);
    }
    return count;
  }, [localState.dailyLogs, studiedToday, today]);

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const key = shiftDateKey(today, i - 6);
      const [y, m, d] = key.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      const dow = dt.getDay();
      const label = dow === 0 ? 'CN' : `T${dow + 1}`;
      const log = localState.dailyLogs[key];
      return {
        key,
        label,
        dateShort: `${d}/${m}`,
        studied: didStudyOnLog(log),
        minutes: log?.minutesStudied || 0,
        isToday: key === today,
      };
    });
  }, [localState.dailyLogs, today]);

  const activeMistakes = useMemo(
    () =>
      Object.values(localState.mistakes)
        .filter((m) => !m.resolved)
        .sort((a, b) => b.wrongCount - a.wrongCount),
    [localState.mistakes]
  );

  const resolvedMistakesCount = useMemo(
    () => Object.values(localState.mistakes).filter((m) => m.resolved).length,
    [localState.mistakes]
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      <header className="bg-slate-900 text-white sticky top-0 z-20 shadow">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToApp}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
              title="Quay về trang học"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-black text-base sm:text-lg leading-tight">
                📊 Tóm Tắt Học Tập — {studentName}
              </h1>
              <div className="text-[11px] text-slate-300">
                Dữ liệu lưu trực tiếp trên trình duyệt máy của {studentName}
              </div>
            </div>
          </div>

          <button
            onClick={onBackToApp}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold cursor-pointer"
          >
            Về trang học
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-5 space-y-5">
        {/* Today Status Hero Card */}
        <div
          className={`rounded-3xl p-5 text-white shadow-md ${
            studiedToday
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
              : 'bg-gradient-to-r from-slate-700 to-slate-800'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black bg-white/20 px-3 py-1 rounded-full">
                {studiedToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> HÔM NAY ĐÃ HỌC RỒI!
                  </>
                ) : (
                  <>⏳ HÔM NAY CHƯA THẤY HỌC</>
                )}
              </span>
              <h2 className="text-2xl font-black mt-2">
                {studiedToday
                  ? `${studentName} học được ${todayLog?.minutesStudied || 0} phút hôm nay`
                  : `${studentName} chưa làm bài nào hôm nay`}
              </h2>
            </div>

            <div className="bg-white/20 rounded-2xl px-4 py-2.5 text-center backdrop-blur">
              <div className="text-[11px] font-bold uppercase text-white/80">Chuỗi Streak</div>
              <div className="text-2xl font-black flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                {streakDays} ngày
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <div className="text-[11px] font-bold text-white/80">Thời gian</div>
              <div className="text-xl font-black mt-0.5">
                {todayLog?.minutesStudied || 0}
                <span className="text-xs font-semibold">/{localState.profile.dailyMinutesGoal}p</span>
              </div>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <div className="text-[11px] font-bold text-white/80">Bài chủ đề</div>
              <div className="text-xl font-black mt-0.5">
                {todayLog?.lessonsCompleted || 0}
                <span className="text-xs font-semibold">/{localState.profile.dailyLessonsGoal}</span>
              </div>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <div className="text-[11px] font-bold text-white/80">Test Cấp Xã</div>
              <div className="text-xl font-black mt-0.5">
                {todayLog?.examsCompleted || 0}
                <span className="text-xs font-semibold">/{localState.profile.dailyExamGoal}</span>
              </div>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <div className="text-[11px] font-bold text-white/80">Từ vựng thuộc</div>
              <div className="text-xl font-black mt-0.5">
                {localState.masteredVocabIds.length}
                <span className="text-xs font-semibold">/{VOCAB_WORDS.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Activity Strip */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-3">
            📅 Lịch học 7 ngày gần nhất
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((d) => (
              <div
                key={d.key}
                className={`rounded-2xl p-2 text-center border ${
                  d.studied
                    ? 'bg-emerald-50 border-emerald-200'
                    : d.isToday
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="text-[11px] font-extrabold text-slate-600">{d.label}</div>
                <div className="text-[10px] text-slate-400">{d.dateShort}</div>
                <div className="text-lg my-1">{d.studied ? '🔥' : '—'}</div>
                <div className="text-[10px] font-bold text-slate-700">
                  {d.minutes > 0 ? `${d.minutes}p` : 'Nghỉ'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Completed Lessons & Exams */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-600" />
            Các bài {studentName} vừa làm ({localState.history.length})
          </h3>

          {localState.history.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm">
              Chưa có bài học hay bài test nào được ghi nhận.
            </div>
          ) : (
            <div className="space-y-2.5">
              {localState.history.slice(0, 12).map((h) => {
                const pct =
                  h.totalQuestions > 0
                    ? Math.round((h.correctCount / h.totalQuestions) * 100)
                    : 0;
                return (
                  <div
                    key={h.id}
                    className="p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {h.examTitle}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                        <span>🕒 {formatDateTimeVi(h.dateISO)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {Math.floor(h.timeSpentSeconds / 60)}p {h.timeSpentSeconds % 60}s
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-blue-700 text-base">
                        {h.correctCount}/{h.totalQuestions} câu ({pct}%)
                      </div>
                      <div className="text-[11px] font-bold text-slate-500">
                        {h.score}/{h.maxScore} điểm
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Mistakes Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <NotebookPen className="w-4 h-4 text-rose-500" />
              Sổ Lỗi Sai đang chờ sửa ({activeMistakes.length} câu)
            </h3>
            <span className="text-xs font-bold text-emerald-600">
              Đã sửa xong: {resolvedMistakesCount} câu
            </span>
          </div>

          {activeMistakes.length === 0 ? (
            <div className="text-center py-5 text-emerald-600 text-sm font-bold">
              ✅ Hiện không có lỗi sai tồn đọng nào!
            </div>
          ) : (
            <div className="space-y-2">
              {activeMistakes.slice(0, 8).map((m) => (
                <div
                  key={m.question.id}
                  className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs space-y-1"
                >
                  <div className="font-bold text-slate-900">{m.question.prompt}</div>
                  <div className="flex flex-wrap gap-4">
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Sai ({m.wrongCount}x): {m.lastWrongAnswer}
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đúng: {m.question.answer.split('|')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
