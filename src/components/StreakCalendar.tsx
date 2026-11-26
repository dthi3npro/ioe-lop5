import React, { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Flame, Shield, Target, Trophy } from 'lucide-react';
import { AppState } from '../types';
import { computeStreakInfo, didStudyOnLog, getTodayKey, shiftDateKey } from '../utils/storage';

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

  const isLogFullGoal = (key: string) => {
    const log = state.dailyLogs[key];
    if (!log) return false;
    const lessonsOk = log.lessonsCompleted >= state.profile.dailyLessonsGoal;
    const examOk = state.profile.dailyExamGoal === 0 || log.examsCompleted >= state.profile.dailyExamGoal;
    const minOk = log.minutesStudied >= state.profile.dailyMinutesGoal;
    return lessonsOk && examOk && minOk;
  };

  // Last 7 days strip
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const key = shiftDateKey(today, i - 6);
      const [y, m, d] = key.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      const dow = dt.getDay();
      const label = dow === 0 ? 'CN' : `T${dow + 1}`;
      const log = state.dailyLogs[key];
      const studied = didStudyOnLog(log);
      return {
        key,
        dayNum: d,
        label,
        done: studied,
        goalMet: isLogFullGoal(key),
        minutes: log?.minutesStudied || 0,
        isToday: key === today,
      };
    });
  }, [state.dailyLogs, state.profile, today]);

  // Monthly calendar grid
  const calendarMonth = useMemo(() => {
    const now = new Date();
    const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDow = viewDate.getDay();
    const leadingBlanks = firstDow === 0 ? 6 : firstDow - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{
      key: string | null;
      dayNum?: number;
      studied?: boolean;
      goalMet?: boolean;
      minutes?: number;
      isToday?: boolean;
    }> = [];

    for (let i = 0; i < leadingBlanks; i++) {
      cells.push({ key: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const log = state.dailyLogs[key];
      cells.push({
        key,
        dayNum: d,
        studied: didStudyOnLog(log),
        goalMet: isLogFullGoal(key),
        minutes: log?.minutesStudied || 0,
        isToday: key === today,
      });
    }

    return {
      label: `Tháng ${month + 1} / ${year}`,
      cells,
    };
  }, [monthOffset, state.dailyLogs, state.profile, today]);

  const selectedLog = state.dailyLogs[selectedDay];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Streak Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
              <Flame
                className={`w-10 h-10 ${
                  streak.studiedToday ? 'text-yellow-100 fill-yellow-200' : 'text-white/80'
                }`}
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-orange-100">
                Chuỗi ngày học liên tiếp của {state.profile.name}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">{streak.currentStreak}</span>
                <span className="text-sm font-bold">ngày liên tiếp</span>
              </div>
              <div className="text-xs text-orange-50 mt-0.5">
                {streak.todayAllGoalsMet
                  ? `Xuất sắc! Hôm nay ${state.profile.name} đã đạt 100% kế hoạch ngày 🔥`
                  : streak.studiedToday
                  ? `Hôm nay đã giữ lửa (${streak.todayPlanPercent}% mục tiêu ngày) 🔥`
                  : `Làm ngay 1 bài học chủ đề hoặc 5 phút từ vựng để giữ lửa hôm nay nhé!`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-center">
            <div className="bg-white/20 rounded-xl px-3.5 py-2 backdrop-blur">
              <div className="flex items-center justify-center gap-1 text-xs text-orange-100">
                <Trophy className="w-3.5 h-3.5" /> Kỷ lục
              </div>
              <div className="text-lg font-extrabold">{streak.longestStreak} ngày</div>
            </div>
            <div className="bg-white/20 rounded-xl px-3.5 py-2 backdrop-blur">
              <div className="flex items-center justify-center gap-1 text-xs text-orange-100">
                <Calendar className="w-3.5 h-3.5" /> Tổng ngày
              </div>
              <div className="text-lg font-extrabold">{streak.totalStudyDays} ngày</div>
            </div>
            <div className="bg-white/20 rounded-xl px-3.5 py-2 backdrop-blur hidden sm:block">
              <div className="flex items-center justify-center gap-1 text-xs text-orange-100">
                <Shield className="w-3.5 h-3.5" /> Khiên
              </div>
              <div className="text-lg font-extrabold">{state.profile.streakFreezeCount}</div>
            </div>
          </div>
        </div>

        {/* Daily Plan Progress Bar */}
        <div className="mt-4 bg-white/15 rounded-xl p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Hôm nay: {streak.todayLessons}/{state.profile.dailyLessonsGoal} bài học
              {state.profile.dailyExamGoal > 0
                ? ` • ${streak.todayExams}/${state.profile.dailyExamGoal} test Cấp Xã`
                : ''}
              {' • '}
              {streak.todayMinutes}/{state.profile.dailyMinutesGoal} phút
            </span>
            <span>{streak.todayPlanPercent}%</span>
          </div>
          <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${streak.todayPlanPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 7-Day Flame Strip */}
      <div className="p-5 border-b border-slate-100">
        <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
          7 ngày gần nhất
        </div>
        <div className="grid grid-cols-7 gap-2">
          {last7Days.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl border transition-all cursor-pointer ${
                selectedDay === d.key
                  ? 'border-orange-400 bg-orange-50 shadow-sm'
                  : 'border-slate-100 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[11px] font-bold ${d.isToday ? 'text-orange-600' : 'text-slate-500'}`}>
                {d.label}
              </span>
              <div
                className={`w-9 h-9 mt-1 rounded-full flex items-center justify-center text-sm font-bold ${
                  d.goalMet
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow'
                    : d.done
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {d.done ? '🔥' : d.dayNum}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-semibold">
                {d.minutes > 0 ? `${d.minutes} phút` : '—'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Study Heatmap */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-5 gap-5 items-start">
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-extrabold text-slate-800">{calendarMonth.label}</span>
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
                className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
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

          <div className="grid grid-cols-7 gap-1.5">
            {calendarMonth.cells.map((cell, idx) => {
              if (!cell.key) {
                return <div key={`empty_${idx}`} className="h-9" />;
              }
              let bgClass = 'bg-slate-100 text-slate-500 hover:bg-slate-200';
              if (cell.goalMet) bgClass = 'bg-emerald-500 text-white font-black shadow-xs';
              else if (cell.studied) bgClass = 'bg-amber-200 text-amber-900 font-bold';

              return (
                <button
                  key={cell.key}
                  onClick={() => setSelectedDay(cell.key!)}
                  className={`h-9 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${bgClass} ${
                    selectedDay === cell.key ? 'ring-2 ring-blue-600 ring-offset-1' : ''
                  } ${cell.isToday ? 'underline decoration-2' : ''}`}
                  title={`${formatDateVi(cell.key)}: ${cell.minutes || 0} phút`}
                >
                  {cell.dayNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Nhật ký ngày {formatDateVi(selectedDay)}
          </div>
          {selectedLog && didStudyOnLog(selectedLog) ? (
            <div className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">📚 Bài học chủ đề:</span>
                <span className="font-extrabold text-emerald-700">
                  {selectedLog.lessonsCompleted} bài
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">🏆 Bài Test Cấp Xã:</span>
                <span className="font-extrabold text-blue-700">
                  {selectedLog.examsCompleted} bài
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">🌟 Lượt học Từ vựng:</span>
                <span className="font-extrabold text-amber-600">
                  {selectedLog.vocabSessions} lượt
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">⏱️ Thời gian học:</span>
                <span className="font-extrabold text-orange-600">
                  ~{selectedLog.minutesStudied} phút
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">✅ Câu đúng / Tổng:</span>
                <span className="font-extrabold text-slate-800">
                  {selectedLog.correctCount} / {selectedLog.questionsDone} câu
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-xs font-bold text-emerald-700">
                {isLogFullGoal(selectedDay)
                  ? '🏆 Đạt 100% mục tiêu ngày!'
                  : '🔥 Đã học giữ lửa thành công!'}
              </div>
            </div>
          ) : (
            <div className="mt-4 text-center py-6 text-slate-400 text-sm">
              Chưa có dữ liệu học tập trong ngày này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
