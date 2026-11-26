import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Flag,
  HelpCircle,
  RotateCcw,
  SkipForward,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { AnswerRecord, ExamConfig, Question, UserProfile } from '../types';
import { checkAnswer, randomShuffle } from '../data/examBank';
import {
  playCorrectSound,
  playFinishSound,
  playWrongSound,
  speakEnglish,
  stopSpeaking,
} from '../utils/sound';

interface Props {
  exam: ExamConfig;
  profile: UserProfile;
  onToggleSound: () => void;
  onFinish: (records: AnswerRecord[], timeSpentSeconds: number) => void;
  onExit: () => void;
}

const TYPE_LABEL: Record<Question['type'], string> = {
  multiple_choice: 'Trắc nghiệm (A, B, C, D)',
  odd_one_out: 'Chọn từ khác loại (Odd One Out)',
  pronunciation: 'Phát âm (Pronunciation)',
  fill_blank: 'Điền từ vào chỗ trống',
  reorder: 'Sắp xếp từ thành câu hoàn chỉnh',
  listening_mc: 'Nghe và chọn đáp án đúng (Listening)',
  listening_fill: 'Nghe và điền từ (Listening)',
  reading: 'Đọc hiểu (Reading Comprehension)',
};

function formatClock(totalSec: number): string {
  const s = Math.max(0, totalSec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export const ExamRoom: React.FC<Props> = ({
  exam,
  profile,
  onToggleSound,
  onFinish,
  onExit,
}) => {
  const isIOE = exam.mode === 'ioe_exam';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam.durationSeconds);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  // Per-question interaction state
  const [selectedOption, setSelectedOption] = useState('');
  const [textInput, setTextInput] = useState('');
  const [placedWordIndices, setPlacedWordIndices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{
    shown: boolean;
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
  } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const finishedRef = useRef(false);

  const question = exam.questions[currentIndex];

  // Shuffled words for reorder question
  const shuffledWords = useMemo(() => {
    if (question?.type === 'reorder' && question.words) {
      return randomShuffle(
        question.words.map((word, idx) => ({ word, idx }))
      );
    }
    return [];
  }, [question]);

  const finishExam = useCallback(
    (finalRecords: AnswerRecord[]) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      stopSpeaking();
      playFinishSound(profile.soundEnabled);
      const timeSpent = Math.max(1, exam.durationSeconds - timeLeft);
      onFinish(finalRecords, timeSpent);
    },
    [exam.durationSeconds, onFinish, profile.soundEnabled, timeLeft]
  );

  // Countdown timer
  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      window.clearInterval(id);
      stopSpeaking();
    };
  }, []);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && !finishedRef.current) {
      finishExam(records);
    }
  }, [timeLeft, records, finishExam]);

  // Reset per-question inputs when question changes
  useEffect(() => {
    setSelectedOption('');
    setTextInput('');
    setPlacedWordIndices([]);
    setFeedback(null);
    stopSpeaking();
    setIsSpeaking(false);

    if (question?.type === 'fill_blank' || question?.type === 'listening_fill') {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [currentIndex, question?.type]);

  const currentAnswerString = useMemo(() => {
    if (!question) return '';
    if (question.type === 'fill_blank' || question.type === 'listening_fill') {
      return textInput;
    }
    if (question.type === 'reorder') {
      return placedWordIndices.map((i) => shuffledWords[i]?.word || '').join(' ');
    }
    return selectedOption;
  }, [question, textInput, placedWordIndices, shuffledWords, selectedOption]);

  const advanceOrFinish = useCallback(
    (updatedRecords: AnswerRecord[]) => {
      if (currentIndex + 1 >= exam.questions.length) {
        finishExam(updatedRecords);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentIndex, exam.questions.length, finishExam]
  );

  const handleSubmitAnswer = useCallback(
    (overrideAnswer?: string, skipped = false) => {
      if (!question || feedback?.shown) return;
      const ans = overrideAnswer !== undefined ? overrideAnswer : currentAnswerString;
      if (!skipped && !ans.trim()) return;

      const isCorrect = skipped ? false : checkAnswer(question, ans);
      const newRecord: AnswerRecord = {
        questionId: question.id,
        question,
        userAnswer: skipped ? '(Bỏ qua)' : ans.trim(),
        isCorrect,
        skipped,
      };

      const nextRecords = [...records, newRecord];
      setRecords(nextRecords);

      if (isCorrect) {
        setScore((s) => s + 10);
        setCombo((c) => c + 1);
        playCorrectSound(profile.soundEnabled);
      } else {
        setCombo(0);
        playWrongSound(profile.soundEnabled);
      }

      if (isIOE) {
        // Authentic IOE fast-paced flow: brief visual flash then move immediately to next question
        setFeedback({
          shown: true,
          isCorrect,
          correctAnswer: question.answer.split('|')[0],
          explanation: question.explanation,
        });
        window.setTimeout(() => {
          advanceOrFinish(nextRecords);
        }, skipped ? 250 : 650);
      } else {
        // Quick Practice mode: show detailed Vietnamese explanation until user clicks Next
        setFeedback({
          shown: true,
          isCorrect,
          correctAnswer: question.answer.split('|')[0],
          explanation: question.explanation,
        });
      }
    },
    [
      question,
      feedback?.shown,
      currentAnswerString,
      records,
      profile.soundEnabled,
      isIOE,
      advanceOrFinish,
    ]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (confirmExit || confirmSubmit) return;
      if (e.key === 'Enter') {
        if (feedback?.shown && !isIOE) {
          e.preventDefault();
          advanceOrFinish(records);
        } else if (!feedback?.shown && currentAnswerString.trim()) {
          e.preventDefault();
          handleSubmitAnswer();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    confirmExit,
    confirmSubmit,
    feedback?.shown,
    isIOE,
    advanceOrFinish,
    records,
    currentAnswerString,
    handleSubmitAnswer,
  ]);

  const handlePlayAudio = (rate = 0.9) => {
    if (!question?.audioText) return;
    speakEnglish(
      question.audioText,
      rate,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  if (!question) return null;

  const progressPct = Math.round(((currentIndex + 1) / exam.questions.length) * 100);
  const maxScore = exam.questions.length * 10;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Authentic IOE-Style Top Bar */}
      <header
        className={`${
          isIOE
            ? 'ioe-header-bg text-white shadow-md'
            : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white shadow-md'
        } sticky top-0 z-20`}
      >
        <div className="max-w-5xl mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Logo + Student Info */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white text-blue-700 font-black flex items-center justify-center shadow text-sm tracking-tight">
              IOE
            </div>
            <div>
              <div className="text-sm sm:text-base font-extrabold leading-tight flex items-center gap-1.5">
                <span>{profile.avatar} {profile.name}</span>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  Khối 5
                </span>
              </div>
              <div className="text-[11px] text-blue-100 truncate max-w-[200px] sm:max-w-sm">
                {exam.title}
              </div>
            </div>
          </div>

          {/* Right: Timer, Score, Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Score Badge */}
            <div className="bg-white/15 backdrop-blur rounded-xl px-3 py-1.5 text-center border border-white/20">
              <div className="text-[10px] uppercase text-blue-100 font-bold">Điểm</div>
              <div className="text-sm sm:text-base font-black text-yellow-300">
                {score} <span className="text-[11px] font-semibold text-white/80">/ {maxScore}</span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div
              className={`rounded-xl px-3 py-1.5 flex items-center gap-1.5 font-mono font-black text-base sm:text-lg shadow ${
                timeLeft <= 120
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-orange-500 text-white'
              }`}
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              {formatClock(timeLeft)}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition cursor-pointer"
              title={profile.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Submit Early */}
            <button
              onClick={() => setConfirmSubmit(true)}
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center gap-1 shadow cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nộp bài</span>
            </button>

            <button
              onClick={() => setConfirmExit(true)}
              className="px-2.5 py-2 rounded-xl bg-white/15 hover:bg-red-500/80 text-xs font-bold cursor-pointer"
            >
              Thoát
            </button>
          </div>
        </div>

        {/* Thin Progress Bar */}
        <div className="h-1.5 bg-blue-950/30 w-full">
          <div
            className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Main Exam Card Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-5 py-5 sm:py-7">
        {/* Question Meta Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-blue-700 text-white font-black text-sm px-3.5 py-1 rounded-full shadow-sm">
              Câu {currentIndex + 1} / {exam.questions.length}
            </span>
            <span className="bg-white border border-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
              {TYPE_LABEL[question.type]}
            </span>
            <span className="hidden sm:inline-block bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              Đề {question.year}
            </span>
          </div>

          {combo >= 2 && (
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-black px-3 py-1 rounded-full shadow animate-bounce flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              COMBO x{combo}! Quá đỉnh!
            </div>
          )}
        </div>

        {/* Authentic IOE Question Box */}
        <div className="bg-white rounded-2xl border-2 border-blue-200/90 shadow-md overflow-hidden animate-pop">
          {/* Question Header Banner */}
          <div className="bg-blue-50/90 border-b border-blue-100 px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
              Chủ đề: {question.topic}
            </span>
            <span className="text-xs font-bold text-orange-600">+10 điểm</span>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            {/* Reading Passage */}
            {question.passage && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-slate-800 text-sm sm:text-base leading-relaxed">
                <div className="text-xs font-bold uppercase text-amber-700 mb-1.5">
                  📖 Đọc đoạn văn sau:
                </div>
                {question.passage}
              </div>
            )}

            {/* Listening Player */}
            {question.audioText && (
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePlayAudio(0.92)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform active:scale-95 cursor-pointer ${
                      isSpeaking
                        ? 'bg-orange-500 animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <Volume2 className="w-7 h-7" />
                  </button>
                  <div>
                    <div className="font-extrabold text-blue-900 text-sm sm:text-base">
                      {isSpeaking ? 'Đang phát giọng đọc tiếng Anh...' : 'Bấm nút loa để nghe câu hỏi'}
                    </div>
                    <div className="text-xs text-sky-700">
                      Em có thể nghe lại nhiều lần hoặc chọn tốc độ đọc chậm hơn
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(0.92)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                  >
                    🔊 Bình thường
                  </button>
                  <button
                    onClick={() => handlePlayAudio(0.7)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-700 text-xs font-bold hover:bg-blue-50 cursor-pointer"
                  >
                    🐢 Đọc chậm
                  </button>
                </div>
              </div>
            )}

            {/* Question Prompt */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {question.prompt}
            </h2>

            {/* === INPUT AREA BY QUESTION TYPE === */}

            {/* 1. Multiple Choice / Odd One Out / Pronunciation / Listening MC / Reading */}
            {question.options && question.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === opt;
                  let cardStyle =
                    'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 text-slate-800';

                  if (feedback?.shown) {
                    if (opt === feedback.correctAnswer) {
                      cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200';
                    } else if (isSelected && !feedback.isCorrect) {
                      cardStyle = 'border-red-400 bg-red-50 text-red-900';
                    } else {
                      cardStyle = 'border-slate-100 bg-slate-50 text-slate-400';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200';
                  }

                  return (
                    <button
                      key={opt}
                      disabled={feedback?.shown}
                      onClick={() => {
                        setSelectedOption(opt);
                        if (isIOE) {
                          handleSubmitAnswer(opt);
                        }
                      }}
                      className={`p-4 rounded-xl border-2 text-left font-semibold transition-all flex items-center gap-3 cursor-pointer disabled:cursor-default ${cardStyle}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-base">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Fill in the blank / Listening Fill */}
            {(question.type === 'fill_blank' || question.type === 'listening_fill') && (
              <div className="space-y-2.5">
                {question.hint && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                    <HelpCircle className="w-4 h-4" />
                    Gợi ý: {question.hint}
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  disabled={feedback?.shown}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Gõ đáp án tiếng Anh vào đây rồi bấm Enter..."
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-blue-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-lg font-bold text-slate-900 bg-white disabled:bg-slate-100"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            )}

            {/* 3. Reorder Words */}
            {question.type === 'reorder' && (
              <div className="space-y-4">
                {/* Answer Drop Zone */}
                <div className="min-h-[72px] p-3.5 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/40 flex flex-wrap gap-2 items-center">
                  {placedWordIndices.length === 0 ? (
                    <span className="text-sm text-slate-400 italic">
                      Bấm vào từng thẻ từ bên dưới theo đúng thứ tự để ghép câu...
                    </span>
                  ) : (
                    placedWordIndices.map((shuffledIdx, pos) => (
                      <button
                        key={`placed_${pos}_${shuffledIdx}`}
                        disabled={feedback?.shown}
                        onClick={() =>
                          setPlacedWordIndices((prev) => prev.filter((_, i) => i !== pos))
                        }
                        className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm sm:text-base shadow-sm hover:bg-blue-700 transition cursor-pointer"
                      >
                        {shuffledWords[shuffledIdx]?.word}
                      </button>
                    ))
                  )}
                </div>

                {/* Available Word Tiles */}
                <div className="flex flex-wrap gap-2">
                  {shuffledWords.map((item, sIdx) => {
                    const used = placedWordIndices.includes(sIdx);
                    return (
                      <button
                        key={`tile_${sIdx}`}
                        disabled={used || feedback?.shown}
                        onClick={() => setPlacedWordIndices((prev) => [...prev, sIdx])}
                        className={`px-3.5 py-2 rounded-xl border-2 font-bold text-sm sm:text-base transition cursor-pointer ${
                          used
                            ? 'border-slate-200 bg-slate-100 text-slate-300 cursor-default'
                            : 'border-slate-300 bg-white text-slate-800 hover:border-blue-500 hover:bg-blue-50 shadow-sm'
                        }`}
                      >
                        {item.word}
                      </button>
                    );
                  })}
                </div>

                {placedWordIndices.length > 0 && !feedback?.shown && (
                  <button
                    onClick={() => setPlacedWordIndices([])}
                    className="text-xs font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Xếp lại từ đầu
                  </button>
                )}
              </div>
            )}

            {/* Instant Feedback Box */}
            {feedback?.shown && (
              <div
                className={`rounded-xl p-4 border-2 animate-pop ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-extrabold text-base">
                      {feedback.isCorrect
                        ? 'Chính xác! +10 điểm 🎉'
                        : `Chưa đúng rồi! Đáp án đúng là: "${feedback.correctAnswer}"`}
                    </div>
                    {!isIOE && (
                      <div className="text-sm opacity-90">
                        💡 <strong>Giải thích:</strong> {feedback.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              {!feedback?.shown ? (
                <>
                  <button
                    onClick={() => handleSubmitAnswer('', true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" /> Bỏ qua câu này
                  </button>

                  {(!isIOE || !question.options) && (
                    <button
                      disabled={!currentAnswerString.trim()}
                      onClick={() => handleSubmitAnswer()}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 text-white font-extrabold text-sm sm:text-base shadow-md transition cursor-pointer"
                    >
                      Trả lời (Enter) →
                    </button>
                  )}
                </>
              ) : !isIOE ? (
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => advanceOrFinish(records)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-sm sm:text-base shadow-md cursor-pointer"
                  >
                    {currentIndex + 1 >= exam.questions.length
                      ? 'Xem kết quả 🏆'
                      : 'Câu tiếp theo (Enter) →'}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      {/* Confirm Submit Modal */}
      {confirmSubmit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-pop">
            <h3 className="text-lg font-extrabold text-slate-900">Nộp bài thi ngay bây giờ?</h3>
            <p className="text-sm text-slate-600 mt-2">
              Em đã trả lời <strong>{records.length} / {exam.questions.length}</strong> câu và đang đạt{' '}
              <strong className="text-blue-700">{score} điểm</strong>. Nếu nộp bây giờ, kết quả sẽ được lưu vào lịch sử và cộng vào chuỗi ngày học!
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmSubmit(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm cursor-pointer"
              >
                Làm tiếp
              </button>
              <button
                onClick={() => {
                  setConfirmSubmit(false);
                  finishExam(records);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Exit Modal */}
      {confirmExit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-pop">
            <h3 className="text-lg font-extrabold text-slate-900">Thoát khỏi phòng thi?</h3>
            <p className="text-sm text-slate-600 mt-2">
              Bài làm hiện tại sẽ không được lưu nếu em thoát ngang. Em có chắc muốn quay về trang chủ không?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmExit(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm cursor-pointer"
              >
                Ở lại làm bài
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  onExit();
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm cursor-pointer"
              >
                Thoát ra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
