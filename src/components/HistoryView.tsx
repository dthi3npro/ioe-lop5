import React, { useMemo } from 'react';
import { Award, CheckCircle2, Clock, History, RotateCcw, XCircle } from 'lucide-react';
import { AppState, Question } from '../types';
import { BADGES } from '../utils/storage';

interface Props {
  state: AppState;
  onPracticeQuestions: (questions: Question[], title: string) => void;
}

export const HistoryView: React.FC<Props> = ({ state, onPracticeQuestions }) => {
  // Collect unique wrong questions from recent history
  const wrongBank = useMemo(() => {
    const map = new Map<string, Question>();
    for (const h of state.history) {
      for (const w of h.wrongAnswers) {
        if (!map.has(w.question.id)) {
          map.set(w.question.id, w.question);
        }
      }
    }
    return Array.from(map.values());
  }, [state.history]);

  return (
    <div className="space-y-6">
      {/* Badges Gallery */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Bộ Sưu Tập Huy Hiệu ({state.unlockedBadges.length}/{BADGES.length})
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((badge) => {
            const unlocked = state.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border text-center transition ${
                  unlocked
                    ? 'bg-gradient-to-b from-amber-50/80 to-white border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-55 grayscale'
                }`}
              >
                <div className="text-3xl mb-1.5">{badge.icon}</div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                  {badge.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {badge.description}
                </div>
                <div className="mt-2">
                  {unlocked ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Đã mở khóa ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">
                      Chưa mở khóa
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wrong Answers Review Launcher */}
      {wrongBank.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold">
              🎯 Sổ Tay Câu Làm Sai ({wrongBank.length} câu)
            </h3>
            <p className="text-sm text-rose-50 mt-0.5">
              Ôn lại đúng những câu em từng làm nhầm để đi thi Cấp Xã không bao giờ sai lại!
            </p>
          </div>
          <button
            onClick={() =>
              onPracticeQuestions(
                wrongBank.slice(0, 30),
                `Ôn lại ${Math.min(30, wrongBank.length)} câu từng làm sai`
              )
            }
            className="px-5 py-2.5 rounded-xl bg-white text-rose-600 font-extrabold text-sm shadow hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Ôn ngay
          </button>
        </div>
      )}

      {/* Exam History List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-blue-600" />
          Lịch Sử Thi & Luyện Tập ({state.history.length} lượt)
        </h2>

        {state.history.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            Chưa có lịch sử làm bài nào. Hãy bắt đầu 1 bài luyện tập ở Trang chủ nhé!
          </div>
        ) : (
          <div className="space-y-3">
            {state.history.map((item) => {
              const pct = Math.round((item.correctCount / item.totalQuestions) * 100);
              const dt = new Date(item.dateISO);
              const timeStr = `${dt.toLocaleDateString('vi-VN')} lúc ${dt.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}`;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          item.mode === 'ioe_exam'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {item.mode === 'ioe_exam' ? 'Phòng thi IOE' : 'Luyện nhanh'}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {item.examTitle}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span>📅 {timeStr}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.floor(item.timeSpentSeconds / 60)}p {item.timeSpentSeconds % 60}s
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {item.correctCount} đúng
                      </span>
                      {item.wrongAnswers.length > 0 && (
                        <span className="flex items-center gap-1 text-red-500 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> {item.wrongAnswers.length} sai
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-black text-blue-700">
                        {item.score}{' '}
                        <span className="text-xs font-semibold text-slate-400">
                          / {item.maxScore}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-emerald-600">{pct}% chính xác</div>
                    </div>
                    {item.wrongAnswers.length > 0 && (
                      <button
                        onClick={() =>
                          onPracticeQuestions(
                            item.wrongAnswers.map((w) => w.question),
                            `Sửa lỗi: ${item.examTitle}`
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 text-xs font-bold cursor-pointer"
                      >
                        Làm lại câu sai
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
