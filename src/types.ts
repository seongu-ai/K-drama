export interface Beat {
  id: string;
  timeRange: string; // e.g., "0-5s"
  startSecond: number;
  endSecond: number;
  narration: string;
  subtitleLines: [string, string];
  learningTip?: string;
  frenchContext?: string;
  imageSrc?: string;
  sceneName?: string;
}

export interface VoiceConfig {
  voiceURI: string | null;
  pitch: number; // e.g. 0.94 for warm male
  rate: number;  // e.g. 1.02 for natural conversation
  volume: number;
  style: 'warm-buddy' | 'deep-narrator' | 'chill-conversational';
}

export interface ScriptPreset {
  id: string;
  title: string;
  tagline: string;
  beats: Beat[];
}

export interface SubtitleStyle {
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  theme: 'yellow' | 'white' | 'cyan' | 'black-box';
  position: 'middle' | 'lower';
}

export interface FrenchKoreanTip {
  korean: string;
  romaja: string;
  french: string;
  english: string;
  context: string;
}
