import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Clock,
  Home,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { BadgeDef, ExamHistoryItem } from '../types';

interface Props {
  result: ExamHistoryItem;
  newlyUnlockedBadges: BadgeDef[];
  currentStreak: number;
  onGoHome: () => void;
  onRetryWrong?: () => void;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m} phút ${s} giây`;
}

export const ResultSummary: React.FC<Props> = ({
  result,
  newlyUnlockedBadges,
  currentStreak,
  onGoHome,
  onRetryWrong,
}) => {
  const accuracy =
    result.totalQuestions > 0
      ? Math.round((result.correctCount / result.totalQuestions) * 100)
      : 0;

  useEffect(() => {
    if (accuracy >= 60) {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    }
  }, [accuracy]);

  const praise =
    accuracy >= 90
      ? 'Xuất sắc tuyệt đối! Em sẵn sàng rinh giải Cấp Xã rồi! 🏆'
      : accuracy >= 75
      ? 'Giỏi lắm! Cố thêm chút nữa là chạm mốc thủ khoa nhé! 🌟'
      : accuracy >= 50
      ? 'Khá tốt! Hãy xem lại những câu làm sai bên dưới để nhớ lâu hơn nha! 💪'
      : 'Không sao đâu! Luyện tập mỗi ngày một chút là em sẽ tiến bộ vù vù! 🦉';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-pop">
      {/* Main Trophy Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 p-6 sm:p-8 text-white text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner mb-3 animate-float">
            <Trophy className="w-11 h-11 text-yellow-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Hoàn Thành Bài Thi!</h1>
          <p className="text-blue-100 text-sm sm:text-base mt-1 font-medium">
            {result.examTitle}
          </p>
          <p className="mt-3 inline-block bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-yellow-100">
            {praise}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
            <div className="text-xs font-bold text-blue-600 uppercase">Điểm số IOE</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-800 mt-1">
              {result.score}
              <span className="text-sm font-bold text-blue-400">/{result.maxScore}</span>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
            <div className="text-xs font-bold text-emerald-600 uppercase">Tỷ lệ đúng</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
              {accuracy}%
            </div>
            <div className="text-xs text-emerald-600 font-semibold">
              {result.correctCount}/{result.totalQuestions} câu
            </div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
            <div className="text-xs font-bold text-amber-600 uppercase flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Thời gian
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-800 mt-2">
              {formatTime(result.timeSpentSeconds)}
            </div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
            <div className="text-xs font-bold text-orange-600 uppercase">Chuỗi học</div>
            <div className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">
              🔥 {currentStreak}
            </div>
            <div className="text-xs text-orange-600 font-semibold">ngày liên tiếp</div>
          </div>
        </div>

        {/* Newly Unlocked Badges */}
        {newlyUnlockedBadges.length > 0 && (
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm mb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Chúc mừng! Em vừa mở khóa huy hiệu mới:
              </div>
              <div className="flex flex-wrap gap-3">
                {newlyUnlockedBadges.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-amber-200 shadow-sm"
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{b.title}</div>
                      <div className="text-xs text-slate-500">{b.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4" /> Về Trang Chủ
          </button>
          {result.wrongAnswers.length > 0 && onRetryWrong && (
            <button
              onClick={onRetryWrong}
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-md cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Luyện lại {result.wrongAnswers.length} câu sai
            </button>
          )}
        </div>
      </div>

      {/* Wrong Answers Review */}
      {result.wrongAnswers.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-red-500" />
            Xem lại các câu cần chú ý ({result.wrongAnswers.length} câu)
          </h2>
          <div className="space-y-3">
            {result.wrongAnswers.map((item, idx) => (
              <div
                key={`${item.questionId}_${idx}`}
                className="p-4 rounded-2xl border border-red-100 bg-red-50/40 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-900 text-sm sm:text-base">
                    {idx + 1}. {item.question.prompt}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shrink-0">
                    {item.question.topic}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Em chọn: {item.userAnswer}
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Đáp án đúng:{' '}
                    {item.question.answer.split('|')[0]}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-600 bg-white/80 rounded-lg px-3 py-2 border border-slate-100">
                  💡 <strong>Giải thích:</strong> {item.question.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 text-center text-emerald-800 font-bold">
          🎉 Tuyệt vời! Không có câu nào làm sai cả!
        </div>
      )}
    </div>
  );
};
