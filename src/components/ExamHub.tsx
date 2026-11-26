import React, { useState } from 'react';
import { Flame, Play, Sparkles, Timer, Trophy, Zap } from 'lucide-react';
import { ExamYear } from '../types';
import { PRACTICE_CATEGORIES, PracticeCategory } from '../data/examBank';

interface Props {
  studentName: string;
  totalBankCount: number;
  onStartOfficialExam: (year: ExamYear | 'all') => void;
  onStartDailyMiniExam: (year: ExamYear | 'all') => void;
  onStartQuickPractice: (category: PracticeCategory, count: number) => void;
}

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
    desc: '200 câu / 30 phút • Đủ 8 dạng bài thi thật + File nghe MP3',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    year: '2023-2024',
    badge: 'NĂM NGOÁI',
    title: 'Đề IOE Lớp 5 Cấp Xã 2023–2024',
    desc: '200 câu / 30 phút • Từ vựng, Nghe, Sắp xếp, Điền từ',
    gradient: 'from-sky-600 to-blue-700',
  },
  {
    year: '2022-2023',
    badge: 'KINH ĐIỂN',
    title: 'Đề IOE Lớp 5 Cấp Trường–Xã 2022–2023',
    desc: '200 câu / 30 phút • Sát chương trình Lớp 5 Bộ GD&ĐT',
    gradient: 'from-cyan-600 to-teal-700',
  },
  {
    year: 'all',
    badge: 'TRỘN TỔNG HỢP',
    title: 'Đề Thi Thử Ngẫu Nhiên 200 Câu',
    desc: '200 câu / 30 phút • Trộn từ toàn bộ kho đề các năm',
    gradient: 'from-orange-500 to-rose-600',
  },
];

export const ExamHub: React.FC<Props> = ({
  studentName,
  totalBankCount,
  onStartOfficialExam,
  onStartDailyMiniExam,
  onStartQuickPractice,
}) => {
  const [quickCount, setQuickCount] = useState(20);

  return (
    <div className="space-y-6">
      {/* Daily Mini-Test Banner (Recommended for school nights) */}
      <div className="bg-gradient-to-r from-[#00529b] via-[#0066c0] to-[#0284c7] rounded-3xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-black bg-yellow-400 text-blue-950 px-3 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5 fill-current" /> KHUYÊN DÙNG MỖI TỐI CHO {studentName.toUpperCase()}
          </span>
          <h1 className="text-2xl lg:text-3xl font-black">
            Bài Test Cấp Xã Hàng Ngày (30 câu / 10 phút)
          </h1>
          <p className="text-sm text-sky-100">
            Giao diện y hệt phòng thi IOE thật trên máy tính, làm vừa sức 10 phút mỗi tối (đủ mọi dạng bài nghe – đọc – điền từ – sắp xếp) để hoàn thành mục tiêu 1 bài test/ngày!
          </p>
        </div>
        <button
          onClick={() => onStartDailyMiniExam('all')}
          className="px-6 py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-base shadow-lg flex items-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          Bắt đầu Test 30 câu ngay
        </button>
      </div>

      {/* Full 200-Question Official IOE Exam Room */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            Phòng Thi Thật IOE Cấp Xã (Full 200 câu / 30 phút / 2000 điểm)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Rèn phản xạ tốc độ cao trên máy tính y như phòng thi chính thức • Ngân hàng hiện có {totalBankCount} câu hỏi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/15">
                <span className="text-xs font-bold flex items-center gap-1 text-yellow-200">
                  <Timer className="w-4 h-4" /> 30 phút • 2000 điểm
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartDailyMiniExam(set.year)}
                    className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer"
                  >
                    Bản nhanh 30 câu
                  </button>
                  <button
                    onClick={() => onStartOfficialExam(set.year)}
                    className="px-4 py-2 rounded-xl bg-white text-blue-800 hover:bg-yellow-300 hover:text-blue-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" /> Thi 200 câu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice by Skill */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Luyện Theo Từng Dạng Bài Thi IOE (Có giải thích sau mỗi câu)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Muốn luyện kỹ riêng bài Nghe, Sắp xếp câu hay Điền từ thì chọn ở đây nhé!
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
              <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center text-2xl shrink-0">
                {cat.emoji}
              </div>
              <div className="flex-1">
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
