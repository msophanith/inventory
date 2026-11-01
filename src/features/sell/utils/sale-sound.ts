/**
 * Vocal notification for completed sales in English ('Sale Completed')
 * and Khmer ('ការលក់បានជោគជ័យ').
 */

let enAudio: HTMLAudioElement | null = null;
let kmAudio: HTMLAudioElement | null = null;

function getBaseUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

function getAudio(lang: 'en' | 'km'): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  const base = getBaseUrl();
  if (lang === 'en') {
    if (!enAudio) {
      enAudio = new Audio(`${base}sounds/sale-completed-en.mp3`);
      enAudio.preload = 'auto';
    }
    return enAudio;
  }

  if (!kmAudio) {
    kmAudio = new Audio(`${base}sounds/sale-completed-km.mp3`);
    kmAudio.preload = 'auto';
  }
  return kmAudio;
}

export function preloadSaleSounds() {
  if (typeof window === 'undefined') return;
  try {
    getAudio('en');
    getAudio('km');
  } catch {
    // Silently ignore preloading errors
  }
}

function fallbackSpeechSynthesis(lang: 'en' | 'km') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const isEn = lang === 'en';
    const text = isEn ? 'Sale Completed' : 'ការលក់បានជោគជ័យ';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isEn ? 'en-US' : 'km-KH';
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis failures
  }
}

/**
 * Plays the sale completion announcement in the active language (English or Khmer).
 */
export function playSaleCompletedSound(preferredLang?: 'en' | 'km') {
  if (typeof window === 'undefined') return;

  try {
    const lang: 'en' | 'km' =
      preferredLang ||
      ((localStorage.getItem('app_language') as 'en' | 'km') || 'km');

    const audio = getAudio(lang);
    if (!audio) {
      fallbackSpeechSynthesis(lang);
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {
      fallbackSpeechSynthesis(lang);
    });
  } catch {
    // Graceful degradation
  }
}

