import { VoiceConfig } from '../types';

export interface DetectedVoice {
  voice: SpeechSynthesisVoice;
  isMale: boolean;
  isNatural: boolean;
  label: string;
}

export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  voiceURI: null,
  pitch: 0.94, // slightly warmer, deeper than 1.0 for relaxed male tone
  rate: 1.02,  // relaxed natural conversational flow
  volume: 1.0,
  style: 'warm-buddy',
};

// Heuristic keyword matcher for natural male voices
const MALE_VOICE_KEYWORDS = [
  'guy',
  'christopher',
  'david',
  'daniel',
  'alex',
  'arthur',
  'fred',
  'aaron',
  'male',
  'google us english male',
  'microsoft guy',
  'microsoft mark',
  'en-us-guy',
  'en-gb-ryan',
];

const NATURAL_QUALITY_KEYWORDS = [
  'natural',
  'online',
  'neural',
  'enhanced',
  'premium',
  'google',
];

/**
 * Detect and prioritize English male voices that sound human-like and conversational
 */
export function getAvailableMaleVoices(): DetectedVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  const allVoices = window.speechSynthesis.getVoices();
  const englishVoices = allVoices.filter((v) => v.lang.startsWith('en'));

  const detected: DetectedVoice[] = englishVoices.map((v) => {
    const nameLower = v.name.toLowerCase();
    const isExplicitMale = MALE_VOICE_KEYWORDS.some((kw) => nameLower.includes(kw));
    const isNatural = NATURAL_QUALITY_KEYWORDS.some((kw) => nameLower.includes(kw));

    // Fallback detection if not explicitly marked
    const isLikelyMale = isExplicitMale || (!nameLower.includes('female') && !nameLower.includes('samantha') && !nameLower.includes('victoria') && !nameLower.includes('zira'));

    let label = v.name;
    if (isNatural) label += ' ★ Natural';

    return {
      voice: v,
      isMale: isLikelyMale,
      isNatural,
      label,
    };
  });

  // Sort: First natural male, then other male, then natural any, then remaining
  return detected.sort((a, b) => {
    if (a.isMale && a.isNatural && (!b.isMale || !b.isNatural)) return -1;
    if (b.isMale && b.isNatural && (!a.isMale || !a.isNatural)) return 1;
    if (a.isMale && !b.isMale) return -1;
    if (b.isMale && !a.isMale) return 1;
    if (a.isNatural && !b.isNatural) return -1;
    if (b.isNatural && !a.isNatural) return 1;
    return 0;
  });
}

/**
 * Pre-process text to make spoken delivery sound natural and human
 */
export function formatSpeechTextForNaturalDelivery(text: string): string {
  if (!text) return '';
  return text
    .replace(/[—–]/g, ', ') // replace dashes with gentle comma pauses
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Speak text with warm human-like male voice settings
 */
export function speakNaturalNarration(
  text: string,
  config: VoiceConfig,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  window.speechSynthesis.cancel();

  const formattedText = formatSpeechTextForNaturalDelivery(text);
  const utterance = new SpeechSynthesisUtterance(formattedText);

  // Dynamically calibrate rate based on word count to fit neatly within 5 seconds
  const wordCount = formattedText.split(/\s+/).length;
  let dynamicRate = config.rate;
  if (wordCount >= 14) {
    dynamicRate = Math.max(config.rate * 1.08, 1.1);
  } else if (wordCount >= 12) {
    dynamicRate = Math.max(config.rate * 1.04, 1.05);
  }

  // Apply voice prosody
  utterance.pitch = config.pitch;
  utterance.rate = dynamicRate;
  utterance.volume = config.volume;

  const voices = getAvailableMaleVoices();
  let selectedVoice = config.voiceURI
    ? voices.find((v) => v.voice.voiceURI === config.voiceURI)?.voice
    : null;

  // If no specific voice configured, pick the highest ranked natural male voice
  if (!selectedVoice) {
    const bestMale = voices.find((v) => v.isMale && v.isNatural) || voices.find((v) => v.isMale) || voices[0];
    if (bestMale) selectedVoice = bestMale.voice;
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}
