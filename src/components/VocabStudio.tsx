import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Layers,
  RotateCw,
  Sparkles,
  Star,
  Volume2,
  Zap,
} from 'lucide-react';
import { VOCAB_THEMES, VOCAB_WORDS } from '../data/vocabData';
import { VocabWord } from '../types';
import { randomShuffle } from '../data/examBank';
import {
  playCorrectSound,
  playFinishSound,
  playQuestionAudio,
  playWrongSound,
} from '../utils/sound';

interface Props {
  initialThemeId?: string;
  masteredIds: string[];
  soundEnabled: boolean;
  studentName: string;
  onToggleMastered: (wordId: string) => void;
  onCompleteGame: (minutesAdded: number, totalQ: number, correctQ: number) => void;
}

type VocabMode = 'flashcards' | 'matching' | 'quiz';

export const VocabStudio: React.FC<Props> = ({
  initialThemeId = 'school',
  masteredIds,
  soundEnabled,
  studentName,
  onToggleMastered,
  onCompleteGame,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(initialThemeId);
  const [mode, setMode] = useState<VocabMode>('flashcards');

  // Flashcard state
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Matching game state
  const [matchRound, setMatchRound] = useState(0);
  const [selectedEnId, setSelectedEnId] = useState<string | null>(null);
  const [selectedViId, setSelectedViId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [matchErrors, setMatchErrors] = useState(0);

  // Quick Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPicked, setQuizPicked] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizSeed, setQuizSeed] = useState(0);

  useEffect(() => {
    if (initialThemeId) {
      setSelectedTheme(initialThemeId);
      setCardIdx(0);
      setFlipped(false);
    }
  }, [initialThemeId]);

  const wordsInTheme: VocabWord[] = useMemo(() => {
    if (selectedTheme === 'all') return VOCAB_WORDS;
    if (selectedTheme === 'unmastered') {
      const rem = VOCAB_WORDS.filter((w) => !masteredIds.includes(w.id));
      return rem.length > 0 ? rem : VOCAB_WORDS;
    }
    return VOCAB_WORDS.filter((w) => w.themeId === selectedTheme);
  }, [selectedTheme, masteredIds]);

  const currentCard = wordsInTheme[cardIdx % Math.max(1, wordsInTheme.length)];

  const speakWord = (w: VocabWord) => {
    playQuestionAudio(w.audioUrl, w.word, { rate: 0.95 });
  };

  // Keyboard navigation for desktop flashcards
  useEffect(() => {
    if (mode !== 'flashcards') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setFlipped(false);
        setCardIdx((i) => (i + 1) % wordsInTheme.length);
      } else if (e.key === 'ArrowLeft') {
        setFlipped(false);
        setCardIdx((i) => (i - 1 + wordsInTheme.length) % wordsInTheme.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if ((e.key === 'r' || e.key === 'R') && currentCard) {
        speakWord(currentCard);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, wordsInTheme.length, currentCard]);

  // Matching game pair generation (5 pairs per round)
  const matchingData = useMemo(() => {
    const picked = randomShuffle(wordsInTheme).slice(0, Math.min(5, wordsInTheme.length));
    return {
      enList: randomShuffle(picked),
      viList: randomShuffle(picked),
      total: picked.length,
    };
  }, [wordsInTheme, matchRound]);

  const handleMatchSelect = (side: 'en' | 'vi', word: VocabWord) => {
    if (matchedIds.includes(word.id)) return;
    if (side === 'en') {
      speakWord(word);
      setSelectedEnId(word.id);
      if (selectedViId) {
        evaluatePair(word.id, selectedViId);
      }
    } else {
      setSelectedViId(word.id);
      if (selectedEnId) {
        evaluatePair(selectedEnId, word.id);
      }
    }
  };

  const evaluatePair = (enId: string, viId: string) => {
    if (enId === viId) {
      playCorrectSound(soundEnabled);
      const next = [...matchedIds, enId];
      setMatchedIds(next);
      setSelectedEnId(null);
      setSelectedViId(null);
      if (next.length === matchingData.total) {
        playFinishSound(soundEnabled);
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
        onCompleteGame(2, matchingData.total, matchingData.total);
      }
    } else {
      playWrongSound(soundEnabled);
      setMatchErrors((e) => e + 1);
      setWrongFlash(true);
      setTimeout(() => {
        setWrongFlash(false);
        setSelectedEnId(null);
        setSelectedViId(null);
      }, 420);
    }
  };

  const resetMatching = () => {
    setMatchedIds([]);
    setSelectedEnId(null);
    setSelectedViId(null);
    setMatchErrors(0);
    setMatchRound((r) => r + 1);
  };

  // Quiz round generation (8 questions)
  const quizQuestions = useMemo(() => {
    const chosen = randomShuffle(wordsInTheme).slice(0, Math.min(8, wordsInTheme.length));
    return chosen.map((target) => {
      const distractors = randomShuffle(
        VOCAB_WORDS.filter((w) => w.id !== target.id)
      ).slice(0, 3);
      return {
        target,
        options: randomShuffle([target, ...distractors]),
      };
    });
  }, [wordsInTheme, quizSeed]);

  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizScore(0);
    setQuizPicked(null);
    setQuizFinished(false);
    setQuizSeed((s) => s + 1);
  };

  const handlePickQuiz = (opt: VocabWord) => {
    if (quizPicked) return;
    const q = quizQuestions[quizIdx];
    setQuizPicked(opt.id);
    speakWord(q.target);
    const isRight = opt.id === q.target.id;
    const nextScore = isRight ? quizScore + 1 : quizScore;
    if (isRight) {
      setQuizScore(nextScore);
      playCorrectSound(soundEnabled);
    } else {
      playWrongSound(soundEnabled);
    }
    setTimeout(() => {
      if (quizIdx + 1 >= quizQuestions.length) {
        setQuizFinished(true);
        playFinishSound(soundEnabled);
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        onCompleteGame(2, quizQuestions.length, nextScore);
      } else {
        setQuizIdx((i) => i + 1);
        setQuizPicked(null);
      }
    }, 900);
  };

  const themeMasteredCount = wordsInTheme.filter((w) =>
    masteredIds.includes(w.id)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 lg:p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black flex items-center gap-2">
            🌟 Góc Học Từ Vựng Tiểu Học của {studentName}
          </h1>
          <p className="text-sm text-amber-50 mt-1">
            64 từ vựng trọng tâm hay ra thi IOE Lớp 5 • Có hình minh họa, phát âm MP3 chuẩn & trò chơi ghép từ!
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center border border-white/25">
          <div className="text-xs font-bold uppercase text-amber-100">Đã thuộc</div>
          <div className="text-2xl font-black">
            {masteredIds.length} <span className="text-sm font-bold">/ {VOCAB_WORDS.length} từ</span>
          </div>
        </div>
      </div>

      {/* Theme Selector Pills */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Chọn chủ đề từ vựng:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedTheme('all');
              setCardIdx(0);
              setFlipped(false);
              resetMatching();
              resetQuiz();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              selectedTheme === 'all'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🌈 Tất cả ({VOCAB_WORDS.length})
          </button>
          <button
            onClick={() => {
              setSelectedTheme('unmastered');
              setCardIdx(0);
              setFlipped(false);
              resetMatching();
              resetQuiz();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              selectedTheme === 'unmastered'
                ? 'bg-rose-500 text-white shadow'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            📌 Từ chưa thuộc ({VOCAB_WORDS.length - masteredIds.length})
          </button>
          {VOCAB_THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTheme(t.id);
                setCardIdx(0);
                setFlipped(false);
                resetMatching();
                resetQuiz();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                selectedTheme === t.id
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.emoji} {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setMode('flashcards')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-2 transition cursor-pointer ${
              mode === 'flashcards'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" /> 1. Thẻ Học Từ (Flashcard)
          </button>
          <button
            onClick={() => {
              setMode('matching');
              resetMatching();
            }}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-2 transition cursor-pointer ${
              mode === 'matching'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Gamepad2 className="w-4 h-4" /> 2. Game Ghép Cặp IOE
          </button>
          <button
            onClick={() => {
              setMode('quiz');
              resetQuiz();
            }}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-2 transition cursor-pointer ${
              mode === 'quiz'
                ? 'bg-orange-500 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4" /> 3. Đố Nhanh Từ Vựng
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Chủ đề này: Đã thuộc <strong className="text-emerald-600">{themeMasteredCount}/{wordsInTheme.length}</strong> từ
        </div>
      </div>

      {/* === MODE 1: FLASHCARDS === */}
      {mode === 'flashcards' && currentCard && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Big Interactive Card */}
          <div className="lg:col-span-7 space-y-4">
            <div
              onClick={() => setFlipped((f) => !f)}
              className={`rounded-3xl border-2 p-8 min-h-[340px] flex flex-col items-center justify-center text-center shadow-lg cursor-pointer transition-all select-none animate-pop ${
                flipped
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'
                  : 'bg-white border-blue-200 hover:border-blue-400'
              }`}
            >
              <div className="text-7xl mb-4 animate-float">{currentCard.emoji}</div>

              {!flipped ? (
                <>
                  <div className="text-4xl lg:text-5xl font-black text-blue-900 tracking-tight">
                    {currentCard.word}
                  </div>
                  <div className="text-lg font-mono text-slate-500 mt-2">
                    {currentCard.phonetic}
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentCard);
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm flex items-center gap-2 shadow cursor-pointer"
                    >
                      <Volume2 className="w-5 h-5" /> Nghe phát âm (Phím R)
                    </button>
                  </div>
                  <div className="mt-5 text-xs font-bold text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Bấm vào thẻ (hoặc phím Space) để lật xem nghĩa tiếng Việt
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl lg:text-4xl font-black text-emerald-700">
                    {currentCard.meaningVi}
                  </div>
                  <div className="text-base font-bold text-slate-500 mt-1">
                    {currentCard.word} • {currentCard.phonetic}
                  </div>
                  <div className="mt-5 bg-white/90 border border-emerald-200 rounded-2xl p-4 max-w-lg w-full">
                    <div className="text-sm font-extrabold text-slate-800">
                      💬 "{currentCard.exampleEn}"
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      → {currentCard.exampleVi}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentCard);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Nghe lại từ
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Card Navigation Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200 p-3.5">
              <button
                onClick={() => {
                  setFlipped(false);
                  setCardIdx((i) => (i - 1 + wordsInTheme.length) % wordsInTheme.length);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Từ trước
              </button>

              <button
                onClick={() => {
                  onToggleMastered(currentCard.id);
                  if (!masteredIds.includes(currentCard.id)) {
                    playCorrectSound(soundEnabled);
                  }
                }}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-2 transition cursor-pointer ${
                  masteredIds.includes(currentCard.id)
                    ? 'bg-emerald-500 text-white shadow'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    masteredIds.includes(currentCard.id) ? 'fill-white' : ''
                  }`}
                />
                {masteredIds.includes(currentCard.id)
                  ? 'Em đã thuộc từ này! ✓'
                  : 'Đánh dấu em đã thuộc'}
              </button>

              <button
                onClick={() => {
                  setFlipped(false);
                  setCardIdx((i) => (i + 1) % wordsInTheme.length);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm flex items-center gap-1 cursor-pointer"
              >
                Từ tiếp <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right List: Word List Overview */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-2 max-h-[430px] overflow-y-auto">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-2 pb-1">
              Danh sách từ ({cardIdx + 1} / {wordsInTheme.length})
            </div>
            {wordsInTheme.map((w, i) => {
              const isMastered = masteredIds.includes(w.id);
              const isActive = i === cardIdx % wordsInTheme.length;
              return (
                <div
                  key={w.id}
                  onClick={() => {
                    setCardIdx(i);
                    setFlipped(false);
                    speakWord(w);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition ${
                    isActive
                      ? 'bg-blue-50 border-blue-400'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{w.emoji}</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {w.word}
                      </div>
                      <div className="text-xs text-slate-500">{w.meaningVi}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isMastered && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                    <Volume2 className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === MODE 2: IOE MATCHING GAME === */}
      {mode === 'matching' && (
        <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-md p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                🧩 Trò Chơi Ghép Cặp Từ (Giống dạng bài Ghép Cặp của IOE!)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Chọn 1 ô Tiếng Anh bên trái rồi ghép với nghĩa Tiếng Việt đúng ở bên phải nhé {studentName}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full">
                Đã ghép: {matchedIds.length} / {matchingData.total}
              </span>
              <button
                onClick={resetMatching}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer"
              >
                🔄 Đổi bộ từ mới
              </button>
            </div>
          </div>

          {matchedIds.length === matchingData.total ? (
            <div className="py-10 text-center space-y-3 animate-pop">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-black text-emerald-700">
                Hoan hô {studentName}! Ghép đúng hết cả {matchingData.total} cặp!
              </h3>
              <p className="text-sm text-slate-500">
                {matchErrors === 0
                  ? 'Không sai một nhịp nào luôn! Quá đỉnh! 🌟'
                  : `Nhầm nhẹ ${matchErrors} lần — chơi thêm ván nữa cho nhớ như in nha!`}
              </p>
              <button
                onClick={resetMatching}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md cursor-pointer"
              >
                Chơi tiếp ván mới →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: English Words */}
              <div className="space-y-2.5">
                <div className="text-xs font-extrabold uppercase text-blue-700 px-1">
                  Cột A — Tiếng Anh (Bấm để nghe)
                </div>
                {matchingData.enList.map((w) => {
                  const done = matchedIds.includes(w.id);
                  const selected = selectedEnId === w.id;
                  return (
                    <button
                      key={`en_${w.id}`}
                      disabled={done}
                      onClick={() => handleMatchSelect('en', w)}
                      className={`w-full p-4 rounded-2xl border-2 text-left font-extrabold text-base flex items-center justify-between transition cursor-pointer ${
                        done
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-400 line-through cursor-default'
                          : selected && wrongFlash
                          ? 'bg-red-50 border-red-400 text-red-700'
                          : selected
                          ? 'bg-blue-600 border-blue-700 text-white shadow-md scale-[1.01]'
                          : 'bg-white border-slate-200 hover:border-blue-400 text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-2xl">{w.emoji}</span>
                        <span>{w.word}</span>
                      </span>
                      <Volume2 className="w-4 h-4 opacity-70" />
                    </button>
                  );
                })}
              </div>

              {/* Right: Vietnamese Meanings */}
              <div className="space-y-2.5">
                <div className="text-xs font-extrabold uppercase text-orange-600 px-1">
                  Cột B — Nghĩa Tiếng Việt
                </div>
                {matchingData.viList.map((w) => {
                  const done = matchedIds.includes(w.id);
                  const selected = selectedViId === w.id;
                  return (
                    <button
                      key={`vi_${w.id}`}
                      disabled={done}
                      onClick={() => handleMatchSelect('vi', w)}
                      className={`w-full p-4 rounded-2xl border-2 text-left font-extrabold text-base transition cursor-pointer ${
                        done
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-400 line-through cursor-default'
                          : selected && wrongFlash
                          ? 'bg-red-50 border-red-400 text-red-700'
                          : selected
                          ? 'bg-orange-500 border-orange-600 text-white shadow-md scale-[1.01]'
                          : 'bg-white border-slate-200 hover:border-orange-400 text-slate-800'
                      }`}
                    >
                      {w.meaningVi}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === MODE 3: QUICK VOCAB QUIZ === */}
      {mode === 'quiz' && (
        <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-md p-6 max-w-3xl mx-auto">
          {quizFinished ? (
            <div className="text-center py-8 space-y-4 animate-pop">
              <div className="text-6xl">🏆</div>
              <h3 className="text-2xl font-black text-slate-900">
                {studentName} trả lời đúng {quizScore} / {quizQuestions.length} từ!
              </h3>
              <p className="text-sm text-slate-500">
                Đã cộng thời gian học hôm nay và giữ vững chuỗi Streak 🔥
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow cursor-pointer"
              >
                Chơi lượt mới →
              </button>
            </div>
          ) : (
            quizQuestions[quizIdx] && (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-500">
                  <span>
                    Câu {quizIdx + 1} / {quizQuestions.length}
                  </span>
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> Đúng: {quizScore}
                  </span>
                </div>

                <div className="text-center py-4 bg-orange-50/70 rounded-2xl border border-orange-100 space-y-2">
                  <div className="text-6xl">{quizQuestions[quizIdx].target.emoji}</div>
                  <div className="text-xs font-bold uppercase text-orange-600">
                    Từ nào trong tiếng Anh có nghĩa là:
                  </div>
                  <div className="text-2xl lg:text-3xl font-black text-slate-900">
                    "{quizQuestions[quizIdx].target.meaningVi}"
                  </div>
                  <button
                    onClick={() => speakWord(quizQuestions[quizIdx].target)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-orange-200 text-orange-700 text-xs font-extrabold hover:bg-orange-100 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Gợi ý phát âm
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quizQuestions[quizIdx].options.map((opt) => {
                    const isCorrect = opt.id === quizQuestions[quizIdx].target.id;
                    const isPicked = quizPicked === opt.id;
                    let cls =
                      'border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/50 text-slate-900';
                    if (quizPicked) {
                      if (isCorrect)
                        cls = 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200';
                      else if (isPicked)
                        cls = 'border-red-400 bg-red-50 text-red-700';
                      else cls = 'border-slate-100 bg-slate-50 text-slate-400';
                    }
                    return (
                      <button
                        key={opt.id}
                        disabled={Boolean(quizPicked)}
                        onClick={() => handlePickQuiz(opt)}
                        className={`p-4 rounded-2xl border-2 font-black text-lg transition cursor-pointer ${cls}`}
                      >
                        {opt.word}
                        <div className="text-xs font-mono font-normal opacity-65 mt-0.5">
                          {opt.phonetic}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
