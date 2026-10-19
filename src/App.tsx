/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BookOpen,
  Check,
  Copy,
  Download,
  Film,
  Mic,
  Sliders,
  Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import { ExportModal } from './components/ExportModal';
import { PhoneSimulator } from './components/PhoneSimulator';
import { ScriptCardsView } from './components/ScriptCardsView';
import { StudyNotesGuide } from './components/StudyNotesGuide';
import { TopNav } from './components/TopNav';
import { VoiceoverRecorder } from './components/VoiceoverRecorder';
import { VoiceSettingsPanel } from './components/VoiceSettingsPanel';
import { BACKGROUND_SCENES, SCRIPT_PRESETS } from './data/defaultScripts';
import { Beat, SubtitleStyle, VoiceConfig } from './types';
import { DEFAULT_VOICE_CONFIG, speakNaturalNarration } from './utils/speechUtils';
import { formatPlainScript } from './utils/textUtils';

export default function App() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('user-exact');
  const [beats, setBeats] = useState<Beat[]>(() => {
    const preset = SCRIPT_PRESETS.find((p) => p.id === 'user-exact') || SCRIPT_PRESETS[0];
    return JSON.parse(JSON.stringify(preset.beats));
  });

  const [activeSection, setActiveSection] = useState<string>('script-beats');
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(0);
  const [activeSceneId, setActiveSceneId] = useState<string>(BACKGROUND_SCENES[0].id);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Warm Conversational Male Voice Configuration
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>(DEFAULT_VOICE_CONFIG);

  // Subtitle styling configuration
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>({
    fontSize: 'base',
    theme: 'yellow',
    position: 'lower',
  });

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = SCRIPT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setBeats(JSON.parse(JSON.stringify(preset.beats)));
    }
  };

  const handleUpdateBeat = (index: number, updated: Partial<Beat>) => {
    setBeats((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const handleResetToDefault = () => {
    const preset = SCRIPT_PRESETS.find((p) => p.id === selectedPresetId) || SCRIPT_PRESETS[0];
    setBeats(JSON.parse(JSON.stringify(preset.beats)));
  };

  const handleSpeakBeat = (text: string) => {
    speakNaturalNarration(text, voiceConfig);
  };

  const handleCopyFormattedScript = () => {
    const plain = formatPlainScript(beats);
    navigator.clipboard.writeText(plain);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* 3-Zone Top Navigation Contract */}
      <TopNav
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onCopyScript={handleCopyFormattedScript}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Editorial Hero Header */}
        <div className="mb-8 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-2">
            <span>Korean Culture Social Video Script</span>
            <span aria-hidden="true">·</span>
            <span>15-Second Format</span>
            <span aria-hidden="true">·</span>
            <span>5s Scene Cuts</span>
            <span aria-hidden="true">·</span>
            <span>Warm Male Narration</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                K-Dramas & Language Immersion
              </h1>
              <p className="text-base text-slate-600 mt-2 max-w-2xl text-balance">
                High-retention 15-second narration with 3 automatically transitioning K-drama scenes and human-like warm male speech.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export SRT & Script</span>
              </button>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Script Angle:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {SCRIPT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedPresetId === preset.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Script Beats, Voice Engine, Voiceover Studio, and Study Guide (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Section 1: Script Beats & Subtitles */}
            <section id="script-beats" className="scroll-mt-24">
              <ScriptCardsView
                beats={beats}
                onUpdateBeat={handleUpdateBeat}
                onResetToDefault={handleResetToDefault}
                activeBeatIndex={activeBeatIndex}
                onSelectBeat={(idx) => setActiveBeatIndex(idx)}
                onSpeakBeat={handleSpeakBeat}
              />
            </section>

            {/* Section 2: Human-Like Warm Male Voice Engine Settings */}
            <section id="voice-settings" className="scroll-mt-24">
              <VoiceSettingsPanel
                config={voiceConfig}
                onChange={(updated) =>
                  setVoiceConfig((prev) => ({ ...prev, ...updated }))
                }
              />
            </section>

            {/* Section 3: Voiceover Recording Studio */}
            <section id="voiceover" className="scroll-mt-24">
              <VoiceoverRecorder
                beats={beats}
                onRecordingComplete={(url) => setRecordedAudioUrl(url)}
                recordedAudioUrl={recordedAudioUrl}
              />
            </section>

            {/* Section 4: French-Korean Cultural Guide */}
            <section id="study-guide" className="scroll-mt-24">
              <StudyNotesGuide />
            </section>
          </div>

          {/* Right Column: 15-Second Mobile Phone Simulator & Customization (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
            <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col items-center">
              <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Video Simulator
                  </h3>
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  9:16 Vertical · Auto 5s Cuts
                </div>
              </div>

              {/* Mobile Phone Mockup */}
              <div id="video-preview" className="scroll-mt-24">
                <PhoneSimulator
                  beats={beats}
                  subtitleStyle={subtitleStyle}
                  voiceConfig={voiceConfig}
                  activeSceneId={activeSceneId}
                  onSceneChange={(id) => setActiveSceneId(id)}
                  recordedAudioUrl={recordedAudioUrl}
                />
              </div>

              {/* Subtitle Appearance Settings */}
              <div className="w-full max-w-[340px] mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Subtitle Appearance</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Theme Selector */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block mb-1">
                      Color Style
                    </label>
                    <select
                      value={subtitleStyle.theme}
                      onChange={(e) =>
                        setSubtitleStyle((prev) => ({
                          ...prev,
                          theme: e.target.value as SubtitleStyle['theme'],
                        }))
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="yellow">Yellow Stroke</option>
                      <option value="white">White Classic</option>
                      <option value="cyan">Neon Cyan</option>
                      <option value="black-box">Black Card Box</option>
                    </select>
                  </div>

                  {/* Size Selector */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block mb-1">
                      Font Size
                    </label>
                    <select
                      value={subtitleStyle.fontSize}
                      onChange={(e) =>
                        setSubtitleStyle((prev) => ({
                          ...prev,
                          fontSize: e.target.value as SubtitleStyle['fontSize'],
                        }))
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="sm">Small</option>
                      <option value="base">Standard</option>
                      <option value="lg">Large / Punchy</option>
                      <option value="xl">Extra Bold</option>
                    </select>
                  </div>
                </div>

                {/* Subtitle Vertical Placement */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-500">Screen Position</span>
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
                    <button
                      onClick={() =>
                        setSubtitleStyle((prev) => ({ ...prev, position: 'lower' }))
                      }
                      className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                        subtitleStyle.position === 'lower'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Lower Third
                    </button>
                    <button
                      onClick={() =>
                        setSubtitleStyle((prev) => ({ ...prev, position: 'middle' }))
                      }
                      className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                        subtitleStyle.position === 'middle'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Center Mid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">K-Drama ScriptStudio</span>
            <span>·</span>
            <span>Short Social Video Narration & Subtitle Engine</span>
          </div>
          <div>
            Built with strict 15-second pacing, maximum 12 words per beat, and 2 subtitle lines per card.
          </div>
        </div>
      </footer>

      {/* Export & Download Modal */}
      <ExportModal
        beats={beats}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
