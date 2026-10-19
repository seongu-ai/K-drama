import {
  Check,
  Headphones,
  RotateCcw,
  Sliders,
  Sparkles,
  User,
  Volume2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { VoiceConfig } from '../types';
import {
  DEFAULT_VOICE_CONFIG,
  DetectedVoice,
  getAvailableMaleVoices,
  speakNaturalNarration,
} from '../utils/speechUtils';

interface VoiceSettingsPanelProps {
  config: VoiceConfig;
  onChange: (updated: Partial<VoiceConfig>) => void;
}

export const VoiceSettingsPanel: React.FC<VoiceSettingsPanelProps> = ({
  config,
  onChange,
}) => {
  const [voices, setVoices] = useState<DetectedVoice[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const maleVoices = getAvailableMaleVoices();
      setVoices(maleVoices);

      // Auto-select best natural male voice if none set
      if (!config.voiceURI && maleVoices.length > 0) {
        const topChoice =
          maleVoices.find((v) => v.isMale && v.isNatural) ||
          maleVoices.find((v) => v.isMale) ||
          maleVoices[0];
        if (topChoice) {
          onChange({ voiceURI: topChoice.voice.voiceURI });
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleTestVoice = () => {
    setIsTesting(true);
    const testPhrase =
      "Hey man! K-dramas are Korean TV shows, and they're super fun to watch!";
    speakNaturalNarration(testPhrase, config, () => setIsTesting(false));
  };

  const handleApplyPreset = (style: VoiceConfig['style']) => {
    switch (style) {
      case 'warm-buddy':
        onChange({ style, pitch: 0.94, rate: 1.02 });
        break;
      case 'deep-narrator':
        onChange({ style, pitch: 0.88, rate: 0.98 });
        break;
      case 'chill-conversational':
        onChange({ style, pitch: 0.92, rate: 1.05 });
        break;
    }
  };

  const handleReset = () => {
    onChange(DEFAULT_VOICE_CONFIG);
  };

  const activeVoiceName =
    voices.find((v) => v.voice.voiceURI === config.voiceURI)?.voice.name ||
    'Auto Warm Male Voice';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Warm Male Voice Settings</span>
              <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                Human-Like
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Calibrated natural cadence and warm pitch for a buddy speaking to a friend
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-50 transition-colors cursor-pointer"
          title="Reset to default warm male tone"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Style Preset Selector */}
      <div>
        <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
          Voice Character Preset
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleApplyPreset('warm-buddy')}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              config.style === 'warm-buddy'
                ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="text-xs font-bold text-slate-900">Warm Buddy</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Friendly & natural (Recommended)
            </div>
          </button>

          <button
            onClick={() => handleApplyPreset('deep-narrator')}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              config.style === 'deep-narrator'
                ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="text-xs font-bold text-slate-900">Deep Narrator</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Rich cinematic resonance
            </div>
          </button>

          <button
            onClick={() => handleApplyPreset('chill-conversational')}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              config.style === 'chill-conversational'
                ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="text-xs font-bold text-slate-900">Chill Casual</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Relaxed everyday flow
            </div>
          </button>
        </div>
      </div>

      {/* Voice Selection & Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Voice Selection */}
        <div>
          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
            Male Voice Engine
          </label>
          <select
            value={config.voiceURI || ''}
            onChange={(e) => onChange({ voiceURI: e.target.value })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            {voices.length === 0 && (
              <option value="">Default System Voice</option>
            )}
            {voices.map((v) => (
              <option key={v.voice.voiceURI} value={v.voice.voiceURI}>
                {v.label}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 block mt-1">
            Current: {activeVoiceName}
          </span>
        </div>

        {/* Pitch / Warmth Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-semibold text-slate-700">
              Vocal Warmth / Pitch
            </label>
            <span className="text-[11px] font-mono font-medium text-slate-600">
              {config.pitch.toFixed(2)} ({config.pitch < 1.0 ? 'Warmer Male' : 'Neutral'})
            </span>
          </div>
          <input
            type="range"
            min="0.80"
            max="1.15"
            step="0.02"
            value={config.pitch}
            onChange={(e) => onChange({ pitch: parseFloat(e.target.value) })}
            className="w-full accent-rose-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>Deeper / Baritone</span>
            <span>Default</span>
            <span>Higher</span>
          </div>
        </div>
      </div>

      {/* Test Voice CTA */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="text-xs text-slate-600 flex items-center gap-1.5">
          <Headphones className="w-3.5 h-3.5 text-rose-500" />
          <span>Click to hear the sample sentence with contractions</span>
        </div>

        <button
          onClick={handleTestVoice}
          disabled={isTesting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isTesting
              ? 'bg-rose-100 text-rose-700 animate-pulse'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isTesting ? 'Speaking...' : 'Test Male Voice'}</span>
        </button>
      </div>
    </div>
  );
};
