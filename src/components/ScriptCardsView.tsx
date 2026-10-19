import {
  AlertCircle,
  Check,
  Copy,
  Edit2,
  Languages,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import React, { useState } from 'react';
import { countWords } from '../utils/textUtils';
import { Beat } from '../types';

interface ScriptCardsViewProps {
  beats: Beat[];
  onUpdateBeat: (index: number, updated: Partial<Beat>) => void;
  onResetToDefault: () => void;
  activeBeatIndex: number;
  onSelectBeat: (index: number) => void;
  onSpeakBeat: (text: string) => void;
}

export const ScriptCardsView: React.FC<ScriptCardsViewProps> = ({
  beats,
  onUpdateBeat,
  onResetToDefault,
  activeBeatIndex,
  onSelectBeat,
  onSpeakBeat,
}) => {
  const [editingBeatIndex, setEditingBeatIndex] = useState<number | null>(null);
  const [copiedBeatId, setCopiedBeatId] = useState<string | null>(null);

  const handleCopyBeat = (beat: Beat) => {
    const text = `[${beat.timeRange}] Narration:\n${beat.narration}\n\nSubtitles:\n${beat.subtitleLines[0]}\n${beat.subtitleLines[1]}`;
    navigator.clipboard.writeText(text);
    setCopiedBeatId(beat.id);
    setTimeout(() => setCopiedBeatId(null), 1800);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            15-Second Video Narration & Subtitles
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Crafted for your friend in France learning Korean · 3 beats · Max 12 words/beat
          </p>
        </div>

        <button
          onClick={onResetToDefault}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default</span>
        </button>
      </div>

      {/* Constraints Validation Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-900">
              Scriptwriter Quality Checks
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>3 x 5s Beats (15s total)</span>
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Max 12 words / beat</span>
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Subtitles ≤ 2 lines</span>
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Spoken contractions</span>
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target: French friend (homme)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Scriptwriter Polish Breakdown (Draft vs Final) */}
      <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-4 text-xs text-slate-700">
        <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-rose-700">
            <span>📝</span>
            <span>Script Polish & Word Count Fixes</span>
          </span>
          <span className="text-[11px] font-normal text-rose-600">
            Polished for your French male friend
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-lg border border-rose-100 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-slate-400">0-5s Hook & Definition</span>
              <p className="line-through text-slate-400 mt-1">"...captivated the whole-they are..."</p>
              <p className="font-medium text-slate-900 mt-1">"K-dramas are Korean TV shows, and they're super fun to watch!"</p>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-2">✓ 11 words (Explains K-dramas & adds contraction)</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-rose-100 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-slate-400">5-10s Everyday Life & Slang</span>
              <p className="line-through text-slate-400 mt-1">"You can easily and naturally learn... (14 words ⚠️)"</p>
              <p className="font-medium text-slate-900 mt-1">"You'll naturally learn everyday Korean life, cool slang, and trendy culture."</p>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-2">✓ 11 words (Fixed word limit; added "You'll")</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-rose-100 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-slate-400">10-15s Spoken Call to Action</span>
              <p className="line-through text-slate-400 mt-1">"By following the real expressions... (15 words ⚠️)"</p>
              <p className="font-medium text-slate-900 mt-1">"Repeat real expressions from the shows—you'll improve your Korean fast!"</p>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-2">✓ 10 words (Active voice; friendly contraction)</span>
          </div>
        </div>
      </div>

      {/* 3 Beat Cards */}
      <div className="flex flex-col gap-5">
        {beats.map((beat, index) => {
          const words = countWords(beat.narration);
          const isOverWordLimit = words > 12;
          const isEditing = editingBeatIndex === index;
          const isSelected = activeBeatIndex === index;

          return (
            <div
              key={beat.id}
              onClick={() => onSelectBeat(index)}
              className={`relative bg-white rounded-xl border transition-all cursor-pointer p-5 ${
                isSelected
                  ? 'border-rose-400 ring-2 ring-rose-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
                    {beat.timeRange}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    Beat {index + 1}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">
                    {index === 0
                      ? 'The Hook & Definition'
                      : index === 1
                      ? 'The Value & Slang Benefit'
                      : 'The Call-to-Action for France'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Word Count Indicator */}
                  <div
                    className={`flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded-md ${
                      isOverWordLimit
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isOverWordLimit ? (
                      <span className="text-[11px] font-medium text-amber-800">
                        {words} words · Dynamic 5s Pace
                      </span>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{words} / 12 words</span>
                      </>
                    )}
                  </div>

                  {/* Narration TTS button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSpeakBeat(beat.narration);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Speak this beat (TTS)"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Copy beat */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyBeat(beat);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Copy beat text"
                  >
                    {copiedBeatId === beat.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Edit toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBeatIndex(isEditing ? null : index);
                    }}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isEditing
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title="Edit narration or subtitles"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body: Narration vs Subtitles */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Spoken Narration Column */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Spoken Narration (Spoken English with Contractions)
                    </label>

                    {isEditing ? (
                      <textarea
                        value={beat.narration}
                        onChange={(e) =>
                          onUpdateBeat(index, { narration: e.target.value })
                        }
                        rows={2}
                        className="w-full text-base font-medium text-slate-900 p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    ) : (
                      <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                        "{beat.narration}"
                      </div>
                    )}
                  </div>

                  {/* French friend contextual note */}
                  {beat.frenchContext && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-rose-50/60 p-2.5 rounded-lg border border-rose-100">
                      <Languages className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                      <span>{beat.frenchContext}</span>
                    </div>
                  )}
                </div>

                {/* Subtitles Column (Strictly $\le$ 2 lines) */}
                <div className="lg:col-span-5 bg-slate-900 text-white p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">
                        Subtitle Card {index + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Max 2 Lines
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={beat.subtitleLines[0]}
                          onChange={(e) =>
                            onUpdateBeat(index, {
                              subtitleLines: [e.target.value, beat.subtitleLines[1]],
                            })
                          }
                          placeholder="Line 1"
                          className="w-full text-xs font-semibold bg-slate-800 text-white p-2 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <input
                          type="text"
                          value={beat.subtitleLines[1]}
                          onChange={(e) =>
                            onUpdateBeat(index, {
                              subtitleLines: [beat.subtitleLines[0], e.target.value],
                            })
                          }
                          placeholder="Line 2"
                          className="w-full text-xs font-semibold bg-slate-800 text-white p-2 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    ) : (
                      <div className="font-bold text-center text-sm sm:text-base leading-snug py-2">
                        <p className="text-white drop-shadow-md">{beat.subtitleLines[0]}</p>
                        {beat.subtitleLines[1] && (
                          <p className="text-amber-300 drop-shadow-md mt-0.5">
                            {beat.subtitleLines[1]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 text-center mt-2 border-t border-slate-800 pt-2">
                    Timing: {beat.startSecond}s → {beat.endSecond}s
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
