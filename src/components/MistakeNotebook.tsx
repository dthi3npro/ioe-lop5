import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  NotebookPen,
  RotateCcw,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import { MistakeEntry, Question } from '../types';
import { playQuestionAudio } from '../utils/sound';

interface Props {
  studentName: string;
  mistakes: Record<string, MistakeEntry>;
  onStartReviewMistakes: (questions: Question[]) => void;
  onMarkResolved: (questionId: string) => void;
}

export const MistakeNotebook: React.FC<Props> = ({
  studentName,
  mistakes,
  onStartReviewMistakes,
  onMarkResolved,
}) => {
  const [filterTab, setFilterTab] = useState<'active' | 'resolved'>('active');
  const [topicFilter, setTopicFilter] = useState<string>('all');

  const allEntries = useMemo(
    () =>
      Object.values(mistakes).sort((a, b) =>
        b.lastSeenISO.localeCompare(a.lastSeenISO)
      ),
    [mistakes]
  );

  const activeEntries = useMemo(
    () => allEntries.filter((m) => !m.resolved),
    [allEntries]
  );
  const resolvedEntries = useMemo(
    () => allEntries.filter((m) => m.resolved),
    [allEntries]
  );

  const shownList = filterTab === 'active' ? activeEntries : resolvedEntries;

  const topics = useMemo(() => {
    const set = new Set(shownList.map((m) => m.question.topic));
    return Array.from(set);
  }, [shownList]);

  const filteredList = useMemo(() => {
    if (topicFilter === 'all') return shownList;
    return shownList.filter((m) => m.question.topic === topicFilter);
  }, [shownList, topicFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 rounded-3xl p-5 lg:p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black flex items-center gap-2">
            <NotebookPen className="w-7 h-7" />
            Sổ Lỗi Sai của {studentName}
          </h1>
          <p className="text-sm text-rose-50 mt-1">
            Mỗi câu làm nhầm đều được ghi vào đây kèm giải thích dễ hiểu. Ôn lại làm đúng là tự động gạch bỏ khỏi sổ!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur rounded-2xl px-4 py-2.5 text-center border border-white/25">
            <div className="text-[11px] font-bold uppercase text-rose-100">Cần sửa</div>
            <div className="text-2xl font-black">{activeEntries.length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl px-4 py-2.5 text-center border border-white/25">
            <div className="text-[11px] font-bold uppercase text-rose-100">Đã sửa xong</div>
            <div className="text-2xl font-black text-yellow-200">
              {resolvedEntries.length}
            </div>
          </div>
        </div>
      </div>

      {/* Big Review CTA when active mistakes exist */}
      {activeEntries.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-rose-200 p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base">
                Sẵn sàng "quét sạch" {activeEntries.length} lỗi sai chưa {studentName}?
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                Làm đúng câu nào trong bài ôn, câu đó sẽ tự động chuyển sang mục <strong>Đã khắc phục ✓</strong>!
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              onStartReviewMistakes(activeEntries.slice(0, 25).map((e) => e.question))
            }
            className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Ôn sửa {Math.min(25, activeEntries.length)} câu ngay!
          </button>
        </div>
      )}

      {/* Tabs + Topic Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => {
              setFilterTab('active');
              setTopicFilter('all');
            }}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm cursor-pointer ${
              filterTab === 'active'
                ? 'bg-rose-500 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📌 Cần ôn sửa ({activeEntries.length})
          </button>
          <button
            onClick={() => {
              setFilterTab('resolved');
              setTopicFilter('all');
            }}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm cursor-pointer ${
              filterTab === 'resolved'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ✅ Đã khắc phục ({resolvedEntries.length})
          </button>
        </div>

        {topics.length > 1 && (
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700"
          >
            <option value="all">Tất cả chủ đề ({shownList.length})</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Mistakes List */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="text-5xl">{filterTab === 'active' ? '🎉' : '📚'}</div>
          <div className="text-lg font-extrabold text-slate-800">
            {filterTab === 'active'
              ? `Tuyệt vời! Sổ lỗi sai của ${studentName} đang trống trơn!`
              : 'Chưa có câu nào trong mục Đã khắc phục.'}
          </div>
          <p className="text-sm text-slate-500">
            {filterTab === 'active'
              ? 'Cứ học bài ở trang Học hôm nay hoặc làm bài Test Cấp Xã — câu nào làm nhầm sẽ tự lưu vào đây nhé.'
              : 'Khi Mai Nhi làm lại đúng các câu từng sai, chúng sẽ xuất hiện ở đây như chiến tích!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredList.map((entry) => {
            const q = entry.question;
            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border-2 p-5 space-y-3 shadow-sm ${
                  entry.resolved
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-100 hover:border-rose-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {q.topic}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Nhầm {entry.wrongCount} lần
                    </span>
                  </div>

                  {(q.audioUrl || q.audioText) && (
                    <button
                      onClick={() => playQuestionAudio(q.audioUrl, q.audioText, { rate: 0.95 })}
                      className="text-xs font-extrabold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Nghe lại
                    </button>
                  )}
                </div>

                <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {q.prompt}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="text-rose-600 font-semibold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 shrink-0" />
                    Từng chọn: <span className="line-through">{entry.lastWrongAnswer}</span>
                  </div>
                  <div className="text-emerald-700 font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Đáp án đúng: {q.answer.split('|').join(' / ')}
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 bg-amber-50/70 border border-amber-100 rounded-xl p-3">
                  💡 <strong>Ghi nhớ:</strong> {q.explanation}
                </div>

                {!entry.resolved ? (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => onMarkResolved(q.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Em đã nhớ kỹ câu này ✓
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Đã sửa xong xuất sắc!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
