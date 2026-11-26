import React, { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Flame, Shield, Target, Trophy } from 'lucide-react';
import { AppState } from '../types';
import { computeStreakInfo, getTodayKey, shiftDateKey } from '../utils/storage';

interface Props {
  state: AppState;
}

const WEEKDAYS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function formatDateVi(dateKey: string): string {
  const [y, m, d] = dateKey.split('-');
  return `${d}/${m}/${y}`;
}

export const StreakCalendar: React.FC<Props> = ({ state }) => {
  const streak = useMemo(() => computeStreakInfo(state), [state]);
  const today = getTodayKey();
  const [selectedDay, setSelectedDay] = useState<string>(today);
  const [monthOffset, setMonthOffset] = useState<number>(0);

  // Last 7 days strip
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const key = shiftDateKey(today, i - 6);
      const [y, m, d] = key.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      const dow = dt.getDay(); // 0=Sun..6=Sat
      const label = dow === 0 ? 'CN' : `T${dow + 1}`;
      const log = state.dailyLogs[key];
      return {
        key,
        dayNum: d,
        label,
        done: (log?.questionsDone || 0) > 0,
        goalMet: (log?.questionsDone || 0) >= state.profile.dailyGoal,
        questions: log?.questionsDone || 0,
        isToday: key === today,
      };
    });
  }, [state.dailyLogs, state.profile.dailyGoal, today]);

  // Monthly calendar grid
  const calendarMonth = useMemo(() => {
    const now = new Date();
    const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth(); // 0..11
    const firstDow = viewDate.getDay(); // 0=Sun..6=Sat
    const leadingBlanks = firstDow === 0 ? 6 : firstDow - 1; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{
      key: string | null;
      dayNum?: number;
      questions?: number;
      goalMet?: boolean;
      isToday?: boolean;
    }> = [];

    for (let i = 0; i < leadingBlanks; i++) {
      cells.push({ key: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const log = state.dailyLogs[key];
      const q = log?.questionsDone || 0;
      cells.push({
        key,
        dayNum: d,
        questions: q,
        goalMet: q >= state.profile.dailyGoal,
        isToday: key === today,
      });
    }

    return {
      label: `Tháng ${month + 1} / ${year}`,
      cells,
    };
  }, [monthOffset, state.dailyLogs, state.profile.dailyGoal, today]);

  const selectedLog = state.dailyLogs[selectedDay];
  const goalPct = Math.min(100, Math.round((streak.todayQuestions / state.profile.dailyGoal) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Streak Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-4 sm:p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
              <Flame className={`w-9 h-9 ${streak.studiedToday ? 'text-yellow-100 fill-yellow-200' : 'text-white/80'}`} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-orange-100">
                Chuỗi ngày học liên tiếp
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black">{streak.currentStreak}</span>
                <span className="text-sm font-semibold">ngày liên tiếp</span>
              </div>
              <div className="text-xs text-orange-50 mt-0.5">
                {streak.studiedToday
                  ? 'Tuyệt vời! Hôm nay em đã giữ lửa thành công 🔥'
                  : 'Làm ngay 1 bài hôm nay để thắp lửa chuỗi học nhé!'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-center">
            <div className="bg-white/20 rounded-xl px-3 py-2 backdrop-blur">
              <div className="flex items-center justify-center gap-1 text-xs text-orange-100">
                <Trophy className="w-3.5 h-3.5" /> Kỷ lục
              </div>
              <div className="text-lg font-extrabold">{streak.longestStreak} ngày</div>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 backdrop-blur">
              <div className="flex items-center justify-center gap-1 text-xs text-orange-100">
                <Calendar className="w-3.5 h-3.5" /> Tổng ngày
              </div>
              <div className="text-lg font-extrabold">{streak.totalStudyDays} ngày</div>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 backdrop-blur hidden sm:block">
              <div className="flex items-center justify-center gap-1 text-xs text-orange-100">
                <Shield className="w-3.5 h-3.5" /> Khiên
              </div>
              <div className="text-lg font-extrabold">{state.profile.streakFreezeCount}</div>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="mt-4 bg-white/15 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Mục tiêu hôm nay: {streak.todayQuestions} / {state.profile.dailyGoal} câu
            </span>
            <span>{goalPct}%</span>
          </div>
          <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${goalPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 7-Day Flame Strip */}
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          7 ngày gần nhất
        </div>
        <div className="grid grid-cols-7 gap-2">
          {last7Days.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl border transition-all cursor-pointer ${
                selectedDay === d.key
                  ? 'border-orange-400 bg-orange-50 shadow-sm'
                  : 'border-slate-100 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[11px] font-bold ${d.isToday ? 'text-orange-600' : 'text-slate-500'}`}>
                {d.label}
              </span>
              <div
                className={`w-8 h-8 mt-1 rounded-full flex items-center justify-center text-sm font-bold ${
                  d.goalMet
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow'
                    : d.done
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {d.done ? '🔥' : d.dayNum}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-medium">
                {d.questions > 0 ? `${d.questions} câu` : '—'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Study Heatmap */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-800">{calendarMonth.label}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMonthOffset((m) => m - 1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMonthOffset(0)}
                className="px-2 py-1 text-xs font-semibold rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
              >
                Hôm nay
              </button>
              <button
                onClick={() => setMonthOffset((m) => m + 1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                aria-label="Tháng sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-1">
            {WEEKDAYS_VI.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarMonth.cells.map((cell, idx) => {
              if (!cell.key) {
                return <div key={`empty_${idx}`} className="h-8" />;
              }
              const q = cell.questions || 0;
              let bgClass = 'bg-slate-100 text-slate-500 hover:bg-slate-200';
              if (q >= 100) bgClass = 'bg-emerald-600 text-white font-bold';
              else if (q >= state.profile.dailyGoal) bgClass = 'bg-emerald-400 text-white font-bold';
              else if (q > 0) bgClass = 'bg-amber-200 text-amber-900 font-semibold';

              return (
                <button
                  key={cell.key}
                  onClick={() => setSelectedDay(cell.key!)}
                  className={`h-8 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${bgClass} ${
                    selectedDay === cell.key ? 'ring-2 ring-blue-600 ring-offset-1' : ''
                  } ${cell.isToday ? 'underline decoration-2' : ''}`}
                  title={`${formatDateVi(cell.key)}: ${q} câu`}
                >
                  {cell.dayNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="md:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Chi tiết ngày {formatDateVi(selectedDay)}
          </div>
          {selectedLog && selectedLog.questionsDone > 0 ? (
            <div className="mt-3 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Số câu đã làm:</span>
                <span className="font-bold text-blue-700">{selectedLog.questionsDone} câu</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Số câu đúng:</span>
                <span className="font-bold text-emerald-600">
                  {selectedLog.correctCount} ({Math.round((selectedLog.correctCount / selectedLog.questionsDone) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Số lượt thi/luyện:</span>
                <span className="font-bold text-slate-800">{selectedLog.examsCompleted} lượt</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Thời gian học:</span>
                <span className="font-bold text-amber-600">~{selectedLog.minutesStudied} phút</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-xs font-semibold text-emerald-700">
                {selectedLog.questionsDone >= state.profile.dailyGoal
                  ? '✅ Đã hoàn thành mục tiêu ngày!'
                  : '⭐ Có học tập! Làm thêm để đạt mục tiêu ngày.'}
              </div>
            </div>
          ) : (
            <div className="mt-4 text-center py-4 text-slate-400 text-sm">
              Chưa có dữ liệu học tập trong ngày này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
