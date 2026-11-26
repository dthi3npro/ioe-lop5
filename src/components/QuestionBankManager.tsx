import React, { useMemo, useState } from 'react';
import { BookOpen, PlusCircle, Search, Volume2 } from 'lucide-react';
import { ExamYear, Question, QuestionType } from '../types';
import { BUILTIN_QUESTIONS } from '../data/examBank';
import { playQuestionAudio } from '../utils/sound';

interface Props {
  customQuestions: Question[];
  onAddQuestion: (q: Question) => void;
}

export const QuestionBankManager: React.FC<Props> = ({
  customQuestions,
  onAddQuestion,
}) => {
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form state
  const [newType, setNewType] = useState<QuestionType>('multiple_choice');
  const [newTopic, setNewTopic] = useState('Tự thêm - Cấp Xã');
  const [newPrompt, setNewPrompt] = useState('');
  const [newAudioText, setNewAudioText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newAnswer, setNewAnswer] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const allQuestions = useMemo(
    () => [...customQuestions, ...BUILTIN_QUESTIONS],
    [customQuestions]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allQuestions.filter((item) => {
      if (filterYear !== 'all' && item.year !== filterYear) return false;
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (
        q &&
        !item.prompt.toLowerCase().includes(q) &&
        !item.topic.toLowerCase().includes(q) &&
        !item.answer.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [allQuestions, search, filterYear, filterType]);

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || !newAnswer.trim()) return;

    const cleanOptions = newOptions.map((o) => o.trim()).filter(Boolean);
    const created: Question = {
      id: `custom_${Date.now()}`,
      type: newType,
      year: 'custom' as ExamYear,
      topic: newTopic.trim() || 'Tự thêm',
      prompt: newPrompt.trim(),
      audioText:
        newType === 'listening_mc' || newType === 'listening_fill'
          ? newAudioText.trim() || newPrompt.trim()
          : undefined,
      options:
        newType === 'multiple_choice' ||
        newType === 'odd_one_out' ||
        newType === 'listening_mc'
          ? cleanOptions.length >= 2
            ? cleanOptions
            : [newAnswer.trim(), 'Option B', 'Option C', 'Option D']
          : undefined,
      words:
        newType === 'reorder'
          ? newAnswer.trim().split(/\s+/)
          : undefined,
      answer: newAnswer.trim(),
      explanation: newExplanation.trim() || 'Câu hỏi do anh/chị tự thêm vào ngân hàng đề.',
    };

    onAddQuestion(created);
    setNewPrompt('');
    setNewAudioText('');
    setNewOptions(['', '', '', '']);
    setNewAnswer('');
    setNewExplanation('');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header + Add Button */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Ngân Hàng Đề IOE Lớp 5 ({allQuestions.length} câu hỏi)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tổng hợp các dạng bài Cấp Xã / Cấp Trường từ năm 2022–2025 + câu hỏi tự thêm ({customQuestions.length} câu).
          </p>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-1.5 shadow cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {showAddForm ? 'Đóng khung thêm câu' : 'Tự thêm câu hỏi mới'}
        </button>
      </div>

      {/* Add Custom Question Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveNew}
          className="bg-blue-50/70 rounded-2xl border-2 border-blue-200 p-5 space-y-4 animate-pop"
        >
          <div className="font-extrabold text-blue-900 text-base">
            ➕ Thêm câu hỏi mới vào ngân hàng đề
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dạng câu hỏi</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as QuestionType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
              >
                <option value="multiple_choice">Trắc nghiệm (A, B, C, D)</option>
                <option value="fill_blank">Điền từ vào chỗ trống</option>
                <option value="reorder">Sắp xếp câu</option>
                <option value="listening_mc">Nghe & chọn đáp án</option>
                <option value="listening_fill">Nghe & điền từ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề</label>
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
                placeholder="VD: Ngữ pháp - Cấp Xã"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nội dung câu hỏi *
            </label>
            <input
              type="text"
              required
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
              placeholder="VD: What ____ you do yesterday?"
            />
          </div>

          {(newType === 'listening_mc' || newType === 'listening_fill') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đoạn tiếng Anh để máy đọc (Audio Script)
              </label>
              <input
                type="text"
                value={newAudioText}
                onChange={(e) => setNewAudioText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
                placeholder="VD: Yesterday I went to the zoo with my friends."
              />
            </div>
          )}

          {(newType === 'multiple_choice' || newType === 'listening_mc') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {newOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const copy = [...newOptions];
                    copy[idx] = e.target.value;
                    setNewOptions(copy);
                  }}
                  placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đáp án đúng * {newType === 'multiple_choice' && '(nhập giống hệt 1 trong 4 đáp án trên)'}
              </label>
              <input
                type="text"
                required
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold"
                placeholder="VD: did"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Giải thích tiếng Việt
              </label>
              <input
                type="text"
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
                placeholder="VD: Có 'yesterday' dùng quá khứ đơn."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow cursor-pointer"
            >
              Lưu câu hỏi vào kho
            </button>
            {savedNotice && (
              <span className="text-sm font-bold text-emerald-700">
                ✅ Đã lưu thành công!
              </span>
            )}
          </div>
        </form>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm câu hỏi, từ vựng, chủ đề..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
        >
          <option value="all">Tất cả năm học</option>
          <option value="2024-2025">Năm 2024–2025</option>
          <option value="2023-2024">Năm 2023–2024</option>
          <option value="2022-2023">Năm 2022–2023</option>
          <option value="custom">Tự thêm</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
        >
          <option value="all">Tất cả dạng bài</option>
          <option value="multiple_choice">Trắc nghiệm</option>
          <option value="fill_blank">Điền từ</option>
          <option value="reorder">Sắp xếp câu</option>
          <option value="listening_mc">Nghe chọn đáp án</option>
          <option value="listening_fill">Nghe điền từ</option>
          <option value="odd_one_out">Từ khác loại</option>
          <option value="pronunciation">Phát âm</option>
          <option value="reading">Đọc hiểu</option>
        </select>
      </div>

      {/* Question List (first 50 matching) */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-500 px-1">
          Hiển thị {Math.min(50, filtered.length)} / {filtered.length} câu hỏi khớp bộ lọc
        </div>
        {filtered.slice(0, 50).map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-xl border border-slate-200 p-4 space-y-1.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  #{idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {q.year}
                </span>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {q.topic}
                </span>
              </div>
              {(q.audioUrl || q.audioText) && (
                <button
                  onClick={() => playQuestionAudio(q.audioUrl, q.audioText, { rate: 1.0 })}
                  className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Nghe thử MP3
                </button>
              )}
            </div>
            <div className="font-bold text-slate-900 text-sm">{q.prompt}</div>
            <div className="text-xs text-emerald-700 font-bold">
              ✅ Đáp án: {q.answer.split('|').join(' / ')}
            </div>
            <div className="text-xs text-slate-500">💡 {q.explanation}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
