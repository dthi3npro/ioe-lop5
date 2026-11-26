// Web Audio API sound effects + Reliable HTML5 MP3 Audio Player + Web Speech API fallback

let audioCtx: AudioContext | null = null;
let activeAudioEl: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const refreshVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  refreshVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playCorrectSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, now);
  osc.frequency.setValueAtTime(659.25, now + 0.08);
  osc.frequency.setValueAtTime(783.99, now + 0.16);

  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.36);
}

export function playWrongSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(240, now);
  osc.frequency.linearRampToValueAtTime(175, now + 0.22);

  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.26);
}

export function playFinishSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const now = ctx.currentTime + i * 0.11;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  });
}

export function stopSpeaking() {
  if (activeAudioEl) {
    activeAudioEl.pause();
    activeAudioEl.currentTime = 0;
    activeAudioEl = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakEnglish(
  text: string,
  rate = 0.92,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return false;
  }
  const synth = window.speechSynthesis;
  const wasActive = synth.speaking || synth.pending;
  synth.cancel();

  const startUtterance = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.02;

    const voices = cachedVoices.length ? cachedVoices : synth.getVoices();
    const preferred =
      voices.find(
        (v) =>
          v.lang === 'en-US' &&
          /Google|Samantha|Aria|Jenny|Microsoft|Natural/i.test(v.name)
      ) ||
      voices.find((v) => v.lang.startsWith('en-US')) ||
      voices.find((v) => v.lang.startsWith('en-GB')) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (preferred) {
      utterance.voice = preferred;
    }

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    synth.resume();
    synth.speak(utterance);
  };

  if (wasActive) {
    window.setTimeout(startUtterance, 50);
  } else {
    startUtterance();
  }
  return true;
}

export interface AudioPlayCallbacks {
  rate?: number;
  onStart?: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnd?: () => void;
  onError?: (msg: string) => void;
}

/**
 * Plays real pre-generated MP3 audio first (100% reliable on Windows/macOS/Android/iOS),
 * falling back cleanly to Web Speech API for custom user-added questions.
 */
export function playQuestionAudio(
  audioUrl?: string,
  fallbackText?: string,
  callbacks: AudioPlayCallbacks = {}
) {
  stopSpeaking();
  const rate = callbacks.rate ?? 1.0;

  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.playbackRate = rate;
    activeAudioEl = audio;

    audio.onplay = () => callbacks.onStart?.();
    audio.ontimeupdate = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        callbacks.onProgress?.(audio.currentTime, audio.duration);
      }
    };
    audio.onended = () => {
      if (activeAudioEl === audio) activeAudioEl = null;
      callbacks.onProgress?.(audio.duration || 1, audio.duration || 1);
      callbacks.onEnd?.();
    };
    audio.onerror = () => {
      if (activeAudioEl === audio) activeAudioEl = null;
      if (fallbackText) {
        speakEnglish(fallbackText, rate * 0.92, callbacks.onStart, callbacks.onEnd);
      } else {
        callbacks.onError?.('Không phát được file âm thanh.');
        callbacks.onEnd?.();
      }
    };

    audio.play().catch(() => {
      if (activeAudioEl === audio) activeAudioEl = null;
      if (fallbackText) {
        speakEnglish(fallbackText, rate * 0.92, callbacks.onStart, callbacks.onEnd);
      } else {
        callbacks.onError?.('Trình duyệt chặn tự phát âm thanh. Hãy bấm lại nút loa!');
        callbacks.onEnd?.();
      }
    });
    return;
  }

  if (fallbackText) {
    speakEnglish(fallbackText, rate * 0.92, callbacks.onStart, callbacks.onEnd);
  } else {
    callbacks.onEnd?.();
  }
}
