import { BookOpen, Check, Heart, Languages, Sparkles, Volume2 } from 'lucide-react';
import React, { useState } from 'react';
import { FRENCH_KOREAN_TIPS } from '../data/defaultScripts';

export const StudyNotesGuide: React.FC = () => {
  const [playingKoreanIndex, setPlayingKoreanIndex] = useState<number | null>(null);

  const speakKorean = (koreanText: string, index: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(koreanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95;

    utterance.onend = () => setPlayingKoreanIndex(null);
    utterance.onerror = () => setPlayingKoreanIndex(null);

    setPlayingKoreanIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <Languages className="w-4 h-4" />
          <span>Cultural & Language Guide</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Why K-Dramas Work for French Speakers
        </h3>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl">
          Contextual linguistic insights for a French friend discovering spoken Korean through short video content.
        </p>
      </div>

      {/* 3 Key Learning Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm mb-3">
            01
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Phonetic Ear Tuning
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            French and Korean both emphasize rhythmic syllable timing. Listening to dialogue naturally builds vowel discrimination before formal grammar study.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
            02
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Real Colloquial Speech
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Textbooks teach stiff formal endings (<span className="font-semibold">~ㅂ니다</span>), whereas modern K-dramas showcase Seoul polite-casual (<span className="font-semibold">~요</span>) and intimate banter.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
            03
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            French Subtitle Anchor
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Keeping French subtitles active prevents cognitive burnout while the ear unconsciously pairs repeated words (<span className="font-semibold">진짜, 대박</span>) with their real meanings.
          </p>
        </div>
      </div>

      {/* Must-Know Drama Vocabulary for the French Friend */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>5 Drama Catchphrases Your Friend Will Hear in Episode 1</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FRENCH_KOREAN_TIPS.map((tip, idx) => (
            <div
              key={tip.korean}
              className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">
                    {tip.korean}
                  </span>
                  <button
                    onClick={() => speakKorean(tip.korean, idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title="Hear Korean pronunciation"
                  >
                    <Volume2
                      className={`w-4 h-4 ${
                        playingKoreanIndex === idx ? 'text-rose-600 animate-pulse' : ''
                      }`}
                    />
                  </button>
                </div>
                <div className="text-xs text-rose-600 font-medium">
                  {tip.romaja}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2 text-xs">
                <div className="font-semibold text-slate-800">
                  🇫🇷 {tip.french}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  🇬🇧 {tip.english}
                </div>
                <p className="text-slate-500 text-[11px] mt-1.5 leading-snug">
                  {tip.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Starter Shows Available with French Subtitles */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Top Starter Dramas on Streaming Platforms (With French Subs)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block">Crash Landing on You</span>
            <span className="text-slate-500 text-[11px] block mt-0.5">
              Romance & accents · Clear enunciation
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block">Hometown Cha-Cha-Cha</span>
            <span className="text-slate-500 text-[11px] block mt-0.5">
              Cozy coastal life · Daily conversational slang
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block">Extraordinary Attorney Woo</span>
            <span className="text-slate-500 text-[11px] block mt-0.5">
              Witty wordplay & polite workplace dialogue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
