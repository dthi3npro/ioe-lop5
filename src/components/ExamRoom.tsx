import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  Gauge,
  HelpCircle,
  Keyboard,
  Play,
  RotateCcw,
  SkipForward,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { AnswerRecord, ExamConfig, Question, UserProfile } from '../types';
import { checkAnswer, randomShuffle } from '../data/examBank';
import {
  playCorrectSound,
  playFinishSound,
  playQuestionAudio,
  playWrongSound,
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
  const s = Math.max(0, Math.floor(totalSec));
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

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioRate, setAudioRate] = useState<number>(1.0);
  const [audioCurrent, setAudioCurrent] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [audioError, setAudioError] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);

  const [confirmExit, setConfirmExit] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const finishedRef = useRef(false);

  const question = exam.questions[currentIndex];
  const hasAudio = Boolean(question?.audioUrl || question?.audioText);

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

  useEffect(() => {
    if (timeLeft === 0 && !finishedRef.current) {
      finishExam(records);
    }
  }, [timeLeft, records, finishExam]);

  const handlePlayAudio = useCallback(
    (customRate?: number) => {
      if (!question || (!question.audioUrl && !question.audioText)) return;
      const rateToUse = customRate ?? audioRate;
      if (customRate !== undefined) setAudioRate(customRate);
      setAudioError('');
      setPlayCount((c) => c + 1);

      playQuestionAudio(question.audioUrl, question.audioText, {
        rate: rateToUse,
        onStart: () => setIsPlayingAudio(true),
        onProgress: (cur, dur) => {
          setAudioCurrent(cur);
          setAudioDuration(dur);
        },
        onEnd: () => setIsPlayingAudio(false),
        onError: (msg) => {
          setAudioError(msg);
          setIsPlayingAudio(false);
        },
      });
    },
    [question, audioRate]
  );

  const handleStopAudio = useCallback(() => {
    stopSpeaking();
    setIsPlayingAudio(false);
  }, []);

  // Reset per-question inputs & auto-play audio when moving to a listening question
  useEffect(() => {
    setSelectedOption('');
    setTextInput('');
    setPlacedWordIndices([]);
    setFeedback(null);
    stopSpeaking();
    setIsPlayingAudio(false);
    setAudioCurrent(0);
    setAudioDuration(0);
    setPlayCount(0);
    setAudioError('');
    setShowTranscript(false);

    if (question?.type === 'fill_blank' || question?.type === 'listening_fill') {
      setTimeout(() => inputRef.current?.focus(), 60);
    }

    if (question?.audioUrl || question?.audioText) {
      const timer = window.setTimeout(() => {
        playQuestionAudio(question.audioUrl, question.audioText, {
          rate: 1.0,
          onStart: () => {
            setIsPlayingAudio(true);
            setPlayCount(1);
          },
          onProgress: (cur, dur) => {
            setAudioCurrent(cur);
            setAudioDuration(dur);
          },
          onEnd: () => setIsPlayingAudio(false),
          onError: () => setIsPlayingAudio(false),
        });
      }, 220);
      return () => window.clearTimeout(timer);
    }
  }, [currentIndex, question]);

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

      stopSpeaking();
      setIsPlayingAudio(false);

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

      setFeedback({
        shown: true,
        isCorrect,
        correctAnswer: question.answer.split('|')[0],
        explanation: question.explanation,
      });

      if (isIOE) {
        window.setTimeout(() => {
          advanceOrFinish(nextRecords);
        }, skipped ? 220 : 600);
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

  // Desktop Keyboard Shortcuts: 1-4 / A-D for options, Enter to submit/next, R to replay audio
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (confirmExit || confirmSubmit || !question) return;
      const tag = (e.target as HTMLElement)?.tagName;
      const typingInInput = tag === 'INPUT' || tag === 'TEXTAREA';

      if (e.key === 'Enter') {
        if (feedback?.shown && !isIOE) {
          e.preventDefault();
          advanceOrFinish(records);
        } else if (!feedback?.shown && currentAnswerString.trim()) {
          e.preventDefault();
          handleSubmitAnswer();
        }
        return;
      }

      if (typingInInput) return;

      // R to replay audio on listening questions
      if ((e.key === 'r' || e.key === 'R') && hasAudio) {
        e.preventDefault();
        handlePlayAudio();
        return;
      }

      // 1-4 or A-D to select option on MC questions
      if (!feedback?.shown && question.options && question.options.length > 0) {
        const keyMap: Record<string, number> = {
          '1': 0, a: 0, A: 0,
          '2': 1, b: 1, B: 1,
          '3': 2, c: 2, C: 2,
          '4': 3, d: 3, D: 3,
        };
        const idx = keyMap[e.key];
        if (idx !== undefined && idx < question.options.length) {
          e.preventDefault();
          const chosen = question.options[idx];
          setSelectedOption(chosen);
          if (isIOE) {
            handleSubmitAnswer(chosen);
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    confirmExit,
    confirmSubmit,
    question,
    feedback?.shown,
    isIOE,
    advanceOrFinish,
    records,
    currentAnswerString,
    handleSubmitAnswer,
    hasAudio,
    handlePlayAudio,
  ]);

  if (!question) return null;

  const progressPct = Math.round(((currentIndex + 1) / exam.questions.length) * 100);
  const maxScore = exam.questions.length * 10;
  const elapsedSec = Math.max(1, exam.durationSeconds - timeLeft);
  const avgSecPerQ = records.length > 0 ? (elapsedSec / records.length).toFixed(1) : '—';
  const correctCount = records.filter((r) => r.isCorrect).length;
  const wrongCount = records.filter((r) => !r.isCorrect && !r.skipped).length;
  const skippedCount = records.filter((r) => r.skipped).length;
  const audioProgressPct =
    audioDuration > 0 ? Math.min(100, Math.round((audioCurrent / audioDuration) * 100)) : 0;

  return (
    <div className="min-h-screen bg-[#eef3f9] flex flex-col">
      {/* Authentic Desktop IOE.vn Top Bar */}
      <header
        className={`${
          isIOE
            ? 'ioe-header-bg text-white shadow-md'
            : 'bg-gradient-to-r from-indigo-700 via-blue-600 to-sky-500 text-white shadow-md'
        } sticky top-0 z-20`}
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Official IOE Brand + Candidate */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white text-blue-800 font-black flex items-center justify-center shadow text-base tracking-tight border-2 border-yellow-300">
              IOE
            </div>
            <div>
              <div className="text-base font-black leading-tight flex items-center gap-2">
                <span>{exam.title}</span>
                <span className="text-[11px] bg-yellow-400 text-blue-950 px-2 py-0.5 rounded-full font-black">
                  KHỐI 5
                </span>
              </div>
              <div className="text-xs text-blue-100 mt-0.5">
                Thí sinh: <strong className="text-white">{profile.avatar} {profile.name}</strong> • {profile.className}
              </div>
            </div>
          </div>

          {/* Right: Live Score, Digital Countdown, Actions */}
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-950/35 rounded-xl px-4 py-1.5 text-center border border-white/20">
              <div className="text-[10px] uppercase tracking-wider text-blue-100 font-bold">
                Điểm IOE
              </div>
              <div className="text-lg font-black text-yellow-300 leading-tight">
                {score}{' '}
                <span className="text-xs font-semibold text-white/75">/ {maxScore}</span>
              </div>
            </div>

            <div
              className={`rounded-xl px-4 py-2 flex items-center gap-2 font-mono font-black text-xl shadow-md border border-white/20 ${
                timeLeft <= 120
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-orange-500 text-white'
              }`}
            >
              <Clock className="w-5 h-5" />
              {formatClock(timeLeft)}
            </div>

            <button
              onClick={onToggleSound}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition cursor-pointer"
              title={profile.soundEnabled ? 'Tắt hiệu ứng âm thanh' : 'Bật hiệu ứng âm thanh'}
            >
              {profile.soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setConfirmSubmit(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-extrabold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Flag className="w-4 h-4" />
              Nộp bài
            </button>

            <button
              onClick={() => setConfirmExit(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-red-500/90 text-sm font-bold cursor-pointer"
            >
              Thoát
            </button>
          </div>
        </div>

        <div className="h-1.5 bg-blue-950/30 w-full">
          <div
            className="h-full bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Main 2-Column Desktop Exam Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 cols on Desktop): Active Question Card */}
        <div className="lg:col-span-8 space-y-4">
          {/* Meta Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#0057a8] text-white font-black text-sm px-4 py-1.5 rounded-full shadow-sm">
                Câu {currentIndex + 1} / {exam.questions.length}
              </span>
              <span className="bg-white border border-blue-200 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">
                {TYPE_LABEL[question.type]}
              </span>
              <span className="bg-slate-200/80 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full">
                Đề {question.year}
              </span>
            </div>

            {combo >= 2 && (
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow animate-bounce flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                COMBO x{combo}! Quá đỉnh!
              </div>
            )}
          </div>

          {/* Authentic IOE Question Frame */}
          <div className="bg-white rounded-2xl border-2 border-[#b8d4f2] shadow-md overflow-hidden animate-pop">
            <div className="bg-gradient-to-r from-[#e8f2fc] to-[#f4f9ff] border-b border-[#cde0f5] px-6 py-3 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#00529b] uppercase tracking-wider">
                Chủ đề: {question.topic}
              </span>
              <span className="text-xs font-black text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                +10 điểm
              </span>
            </div>

            <div className="p-6 lg:p-8 space-y-6">
              {/* Reading Passage */}
              {question.passage && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 text-slate-800 text-base leading-relaxed">
                  <div className="text-xs font-extrabold uppercase text-amber-800 mb-2">
                    📖 Đọc đoạn văn sau và trả lời câu hỏi:
                  </div>
                  {question.passage}
                </div>
              )}

              {/* REAL MP3 AUDIO PLAYER (IOE Desktop Style) */}
              {hasAudio && (
                <div className="bg-[#f0f7ff] border-2 border-[#9ec5f0] rounded-2xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() =>
                          isPlayingAudio ? handleStopAudio() : handlePlayAudio()
                        }
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition active:scale-95 cursor-pointer ${
                          isPlayingAudio
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-[#0066c0] hover:bg-[#004f96]'
                        }`}
                        title="Phát / Dừng file nghe (Phím R)"
                      >
                        {isPlayingAudio ? (
                          <Square className="w-6 h-6 fill-current" />
                        ) : (
                          <Play className="w-7 h-7 fill-current ml-0.5" />
                        )}
                      </button>
                      <div>
                        <div className="font-extrabold text-[#003c75] text-base flex items-center gap-2">
                          <span>
                            {isPlayingAudio
                              ? '🔊 Đang phát file nghe tiếng Anh...'
                              : '🎧 Bấm nút Phát (hoặc phím R) để nghe'}
                          </span>
                          {playCount > 0 && (
                            <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                              Đã nghe {playCount} lần
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          File MP3 chuẩn giọng Anh — hỗ trợ nghe lại không giới hạn và chỉnh tốc độ chậm
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(1.0)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                          audioRate === 1.0
                            ? 'bg-[#0066c0] text-white shadow-sm'
                            : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        1.0x Chuẩn
                      </button>
                      <button
                        onClick={() => handlePlayAudio(0.8)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                          audioRate === 0.8
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        🐢 0.8x Chậm
                      </button>
                    </div>
                  </div>

                  {/* Real Audio Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-blue-900 w-10">
                      {formatClock(audioCurrent)}
                    </span>
                    <div className="flex-1 h-2.5 bg-blue-200/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-150 ${
                          isPlayingAudio
                            ? 'bg-gradient-to-r from-blue-600 to-sky-400'
                            : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${
                            audioDuration > 0
                              ? audioProgressPct
                              : isPlayingAudio
                              ? 60
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 w-10 text-right">
                      {audioDuration > 0 ? formatClock(audioDuration) : '--:--'}
                    </span>
                  </div>

                  {audioError && (
                    <div className="text-xs font-bold text-red-600">{audioError}</div>
                  )}

                  {/* Transcript helper in Quick Practice (or after answering) */}
                  {(!isIOE || feedback?.shown) && question.audioText && (
                    <div className="pt-1">
                      <button
                        onClick={() => setShowTranscript((v) => !v)}
                        className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {showTranscript
                          ? 'Ẩn lời thoại tiếng Anh'
                          : 'Xem lời thoại tiếng Anh (Transcript) để học từ mới'}
                      </button>
                      {showTranscript && (
                        <div className="mt-2 p-3 rounded-xl bg-white border border-blue-200 text-sm text-slate-700 italic">
                          "{question.audioText}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Question Prompt */}
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900 leading-snug">
                {question.prompt}
              </h2>

              {/* === INPUT AREAS === */}

              {/* 1. Multiple Choice / Odd One Out / Pronunciation / Listening MC / Reading */}
              {question.options && question.options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {question.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = selectedOption === opt;
                    let cardStyle =
                      'border-slate-200 bg-white hover:border-[#0066c0] hover:bg-blue-50/60 text-slate-800';

                    if (feedback?.shown) {
                      if (opt === feedback.correctAnswer) {
                        cardStyle =
                          'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200';
                      } else if (isSelected && !feedback.isCorrect) {
                        cardStyle = 'border-red-400 bg-red-50 text-red-900';
                      } else {
                        cardStyle = 'border-slate-100 bg-slate-50 text-slate-400';
                      }
                    } else if (isSelected) {
                      cardStyle =
                        'border-[#0066c0] bg-blue-50 text-blue-950 ring-2 ring-blue-200';
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
                        className={`p-4 rounded-xl border-2 text-left font-semibold transition-all flex items-center gap-3.5 cursor-pointer disabled:cursor-default ${cardStyle}`}
                      >
                        <span
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${
                            isSelected
                              ? 'bg-[#0066c0] text-white'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="text-base lg:text-lg flex-1">{opt}</span>
                        <span className="hidden lg:inline text-[11px] font-mono text-slate-400">
                          [{idx + 1}]
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. Fill in the blank / Listening Fill */}
              {(question.type === 'fill_blank' ||
                question.type === 'listening_fill') && (
                <div className="space-y-3">
                  {question.hint && (
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-800 bg-blue-50 px-3.5 py-2 rounded-xl w-fit border border-blue-100">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      Gợi ý: {question.hint}
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    disabled={feedback?.shown}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Gõ đáp án tiếng Anh trên bàn phím rồi nhấn Enter..."
                    className="w-full px-5 py-4 rounded-xl border-2 border-[#7eb3e8] focus:border-[#0066c0] focus:ring-4 focus:ring-blue-100 outline-none text-xl font-bold text-slate-900 bg-white disabled:bg-slate-100"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              )}

              {/* 3. Reorder Words */}
              {question.type === 'reorder' && (
                <div className="space-y-4">
                  <div className="min-h-[80px] p-4 rounded-xl border-2 border-dashed border-[#7eb3e8] bg-blue-50/40 flex flex-wrap gap-2.5 items-center">
                    {placedWordIndices.length === 0 ? (
                      <span className="text-sm text-slate-400 italic">
                        Nhấp chuột vào từng thẻ từ bên dưới theo đúng thứ tự câu...
                      </span>
                    ) : (
                      placedWordIndices.map((shuffledIdx, pos) => (
                        <button
                          key={`placed_${pos}_${shuffledIdx}`}
                          disabled={feedback?.shown}
                          onClick={() =>
                            setPlacedWordIndices((prev) =>
                              prev.filter((_, i) => i !== pos)
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-[#0066c0] text-white font-bold text-base shadow-sm hover:bg-[#004f96] transition cursor-pointer"
                        >
                          {shuffledWords[shuffledIdx]?.word}
                        </button>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {shuffledWords.map((item, sIdx) => {
                      const used = placedWordIndices.includes(sIdx);
                      return (
                        <button
                          key={`tile_${sIdx}`}
                          disabled={used || feedback?.shown}
                          onClick={() =>
                            setPlacedWordIndices((prev) => [...prev, sIdx])
                          }
                          className={`px-4 py-2 rounded-xl border-2 font-bold text-base transition cursor-pointer ${
                            used
                              ? 'border-slate-200 bg-slate-100 text-slate-300 cursor-default'
                              : 'border-slate-300 bg-white text-slate-800 hover:border-[#0066c0] hover:bg-blue-50 shadow-sm'
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

              {/* Feedback Banner */}
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
                          : `Chưa đúng! Đáp án đúng là: "${feedback.correctAnswer}"`}
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

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
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
                        className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#0066c0] to-[#004f96] hover:from-[#0055a5] hover:to-[#003f7a] disabled:opacity-40 text-white font-extrabold text-base shadow-md transition cursor-pointer"
                      >
                        Trả lời (Enter) →
                      </button>
                    )}
                  </>
                ) : !isIOE ? (
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => advanceOrFinish(records)}
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-base shadow-md cursor-pointer"
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
        </div>

        {/* RIGHT SIDEBAR (4 cols on Desktop): Classic PC Exam Monitor Panel */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Live Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Bảng theo dõi bài làm
              </span>
              <span className="text-xs font-bold text-blue-700">
                {progressPct}% hoàn thành
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5">
                <div className="text-[11px] font-bold text-emerald-700">Đúng</div>
                <div className="text-xl font-black text-emerald-700">{correctCount}</div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-2.5">
                <div className="text-[11px] font-bold text-red-600">Sai</div>
                <div className="text-xl font-black text-red-600">{wrongCount}</div>
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-2.5">
                <div className="text-[11px] font-bold text-slate-600">Bỏ qua</div>
                <div className="text-xl font-black text-slate-700">{skippedCount}</div>
              </div>
            </div>

            <div className="bg-blue-50/70 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs border border-blue-100">
              <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-600" />
                Tốc độ trung bình:
              </span>
              <span className="font-black text-blue-800">
                {avgSecPerQ === '—' ? '—' : `${avgSecPerQ} giây / câu`}
              </span>
            </div>
          </div>

          {/* Question Mini-Map Grid (Authentic Computer Exam Look) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Bản đồ câu hỏi ({exam.questions.length} câu)
              </span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Đúng
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-red-500 inline-block" /> Sai
                </span>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {exam.questions.map((q, idx) => {
                const rec = records[idx];
                let boxClass = 'bg-slate-100 text-slate-500 border-slate-200';
                if (rec) {
                  if (rec.isCorrect) {
                    boxClass = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                  } else if (rec.skipped) {
                    boxClass = 'bg-slate-300 text-slate-700 border-slate-400';
                  } else {
                    boxClass = 'bg-red-500 text-white border-red-600 font-bold';
                  }
                } else if (idx === currentIndex) {
                  boxClass =
                    'bg-[#0066c0] text-white border-blue-800 font-black ring-2 ring-blue-300';
                }

                return (
                  <div
                    key={q.id}
                    className={`h-7 rounded-md border text-[11px] flex items-center justify-center select-none ${boxClass}`}
                    title={`Câu ${idx + 1}: ${q.topic}`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Keyboard Shortcuts Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2 hidden lg:block">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-blue-600" />
              Phím tắt máy tính (Làm bài cực nhanh)
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
              <li className="flex justify-between">
                <span>Chọn đáp án A, B, C, D</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800">
                  1-4 / A-D
                </kbd>
              </li>
              <li className="flex justify-between">
                <span>Gửi đáp án / Sang câu tiếp</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800">
                  Enter
                </kbd>
              </li>
              <li className="flex justify-between">
                <span>Nghe lại file âm thanh</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-slate-800">
                  R
                </kbd>
              </li>
            </ul>
          </div>
        </aside>
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
