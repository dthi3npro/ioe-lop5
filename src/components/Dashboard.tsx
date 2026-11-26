import React, { useState } from 'react';
import {
  Edit3,
  Flame,
  Play,
  Sparkles,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react';
import { AppState, ExamYear, UserProfile } from '../types';
import {
  PRACTICE_CATEGORIES,
  PracticeCategory,
} from '../data/examBank';
import { StreakCalendar } from './StreakCalendar';

interface Props {
  state: AppState;
  totalBankCount: number;
  onUpdateProfile: (patch: Partial<UserProfile>) => void;
  onStartOfficialExam: (year: ExamYear | 'all') => void;
  onStartQuickPractice: (category: PracticeCategory, count: number) => void;
}

const AVATARS = ['🦉', '🦊', '🐼', '🐱', '🐶', '🦁', '🚀', '🌟'];

const OFFICIAL_SETS: {
  year: ExamYear | 'all';
  badge: string;
  title: string;
  desc: string;
  gradient: string;
}[] = [
  {
    year: '2024-2025',
    badge: 'MỚI NHẤT',
    title: 'Đề IOE Lớp 5 Cấp Xã 2024–2025',
    desc: '200 câu / 30 phút • Đủ 8 dạng bài thi thật',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    year: '2023-2024',
    badge: 'NĂM NGOÁI',
    title: 'Đề IOE Lớp 5 Cấp Xã 2023–2024',
    desc: '200 câu / 30 phút • Từ vựng, Nghe, Sắp xếp',
    gradient: 'from-sky-600 to-blue-700',
  },
  {
    year: '2022-2023',
    badge: 'KINH ĐIỂN',
    title: 'Đề IOE Lớp 5 Cấp Trường–Xã 2022–2023',
    desc: '200 câu / 30 phút • Sát chương trình Lớp 5',
    gradient: 'from-cyan-600 to-teal-700',
  },
  {
    year: 'all',
    badge: 'TRỘN ĐỀ',
    title: 'Đề Thi Thử Ngẫu Nhiên 200 Câu',
    desc: '200 câu / 30 phút • Trộn từ toàn bộ kho đề',
    gradient: 'from-orange-500 to-rose-600',
  },
];

export const Dashboard: React.FC<Props> = ({
  state,
  totalBankCount,
  onUpdateProfile,
  onStartOfficialExam,
  onStartQuickPractice,
}) => {
  const [quickCount, setQuickCount] = useState<number>(20);
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameDraft, setNameDraft] = useState(state.profile.name);

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Chào buổi sáng'
      : hour < 18
      ? 'Chào buổi chiều'
      : 'Chào buổi tối';

  const saveProfileName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed) onUpdateProfile({ name: trimmed });
    setEditingProfile(false);
  };

  return (
    <div className="space-y-6">
      {/* Mascot Welcome Card */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl sm:text-5xl shadow-inner animate-float">
              {state.profile.avatar}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-blue-100">
                {greeting}, chiến binh IOE Lớp 5!
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <h1 className="text-2xl sm:text-3xl font-black">
                  {state.profile.name}
                </h1>
                <button
                  onClick={() => {
                    setNameDraft(state.profile.name);
                    setEditingProfile((v) => !v);
                  }}
                  className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition cursor-pointer"
                  title="Đổi tên / avatar"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-blue-50 mt-1">
                Kho đề hiện có <strong>{totalBankCount} câu hỏi</strong> chuẩn IOE Cấp Xã • Có bài nghe tự động!
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartQuickPractice('all', 20)}
            className="px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm sm:text-base shadow-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-blue-950" />
            Luyện ngay 20 câu giữ lửa!
          </button>
        </div>

        {/* Inline Profile Customizer */}
        {editingProfile && (
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-end gap-4 animate-pop">
            <div>
              <label className="block text-xs font-bold text-blue-100 mb-1">
                Tên của em
              </label>
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveProfileName()}
                className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-100 mb-1">
                Chọn nhân vật
              </label>
              <div className="flex gap-1.5">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    onClick={() => onUpdateProfile({ avatar: av })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg cursor-pointer ${
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
            <div>
              <label className="block text-xs font-bold text-blue-100 mb-1">
                Mục tiêu mỗi ngày
              </label>
              <select
                value={state.profile.dailyGoal}
                onChange={(e) =>
                  onUpdateProfile({ dailyGoal: Number(e.target.value) })
                }
                className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-sm"
              >
                <option value={10}>10 câu / ngày (Nhẹ nhàng)</option>
                <option value={20}>20 câu / ngày (Chuẩn)</option>
                <option value={30}>30 câu / ngày (Chăm chỉ)</option>
                <option value={50}>50 câu / ngày (Siêu nhân)</option>
              </select>
            </div>
            <button
              onClick={saveProfileName}
              className="px-4 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold text-sm cursor-pointer"
            >
              Lưu xong
            </button>
          </div>
        )}
      </div>

      {/* Streak & Study Calendar */}
      <StreakCalendar state={state} />

      {/* Section 1: Authentic IOE Exam Room (200 questions / 30 min) */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-blue-600" />
              Phòng Thi Thật IOE Cấp Xã (Giao diện chuẩn ioe.vn)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              200 câu hỏi • 30 phút đếm ngược • Tối đa 2000 điểm • Rèn tốc độ y như thi thật!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OFFICIAL_SETS.map((set) => (
            <div
              key={set.year}
              className={`bg-gradient-to-br ${set.gradient} rounded-2xl p-5 text-white shadow-md hover:shadow-xl transition flex flex-col justify-between gap-4`}
            >
              <div>
                <span className="inline-block text-[10px] font-black tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                  {set.badge}
                </span>
                <h3 className="text-lg font-extrabold mt-2">{set.title}</h3>
                <p className="text-xs sm:text-sm text-white/85 mt-1">{set.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/15">
                <span className="text-xs font-bold flex items-center gap-1 text-yellow-200">
                  <Timer className="w-4 h-4" /> 30 phút • 2000 điểm
                </span>
                <button
                  onClick={() => onStartOfficialExam(set.year)}
                  className="px-4 py-2 rounded-xl bg-white text-blue-800 hover:bg-yellow-300 hover:text-blue-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> Vào phòng thi
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Fun Quick Practice */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-500" />
              Luyện Nhanh Vui Nhộn (Có giải thích từng câu)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chọn số câu và chuyên đề muốn ôn — cực hợp để học mỗi ngày và giữ chuỗi 🔥!
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[10, 20, 30].map((n) => (
              <button
                key={n}
                onClick={() => setQuickCount(n)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                  quickCount === n
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {n} câu
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRACTICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onStartQuickPractice(cat.id, quickCount)}
              className="group p-4 rounded-2xl border-2 border-slate-100 hover:border-orange-400 hover:bg-orange-50/40 text-left transition flex items-start gap-3 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center text-2xl shrink-0 transition">
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-slate-900 text-sm group-hover:text-orange-700">
                  {cat.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{cat.desc}</div>
                <div className="text-[11px] font-bold text-orange-600 mt-1.5 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Luyện {quickCount} câu →
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
