import {
  Camera,
  Heart,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { BACKGROUND_SCENES } from '../data/defaultScripts';
import { Beat, SubtitleStyle, VoiceConfig } from '../types';
import { speakNaturalNarration } from '../utils/speechUtils';

interface PhoneSimulatorProps {
  beats: Beat[];
  subtitleStyle: SubtitleStyle;
  voiceConfig: VoiceConfig;
  activeSceneId: string;
  onSceneChange: (sceneId: string) => void;
  recordedAudioUrl?: string | null;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  beats,
  subtitleStyle,
  voiceConfig,
  activeSceneId,
  onSceneChange,
  recordedAudioUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [useTts, setUseTts] = useState(true);
  const [useRecordedAudio, setUseRecordedAudio] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [autoSwitchScenes, setAutoSwitchScenes] = useState(true);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const currentSpokenBeatRef = useRef<number>(-1);

  // Active beat index based on current playback time: 0 (0-5s), 1 (5-10s), 2 (10-15s)
  const currentBeatIndex = Math.min(
    Math.floor(currentTime / 5),
    beats.length - 1
  );
  const currentBeat = beats[currentBeatIndex] || beats[0];

  // Stop playback cleanly
  const stopPlayback = () => {
    setIsPlaying(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentSpokenBeatRef.current = -1;
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      if (currentTime >= 15) {
        setCurrentTime(0);
        currentSpokenBeatRef.current = -1;
      }
      setIsPlaying(true);
      lastTimeRef.current = performance.now();
    }
  };

  const handleReset = () => {
    stopPlayback();
    setCurrentTime(0);
    currentSpokenBeatRef.current = -1;
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = 0;
    }
  };

  // Synchronized Human-like Male Voice Narration
  const speakCurrentBeat = (beatIdx: number) => {
    if (!useTts || useRecordedAudio) return;

    const textToSpeak = beats[beatIdx]?.narration;
    if (!textToSpeak) return;

    speakNaturalNarration(textToSpeak, voiceConfig);
  };

  // Main high-precision animation loop
  useEffect(() => {
    if (!isPlaying) return;

    if (useRecordedAudio && audioElementRef.current) {
      audioElementRef.current.currentTime = currentTime;
      audioElementRef.current.play().catch(() => {});
    }

    const animate = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const deltaSec = ((now - lastTimeRef.current) / 1000) * voiceConfig.rate;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const nextTime = prev + deltaSec;
        if (nextTime >= 15) {
          stopPlayback();
          return 15;
        }

        // Check 5-second beat transition
        const newBeatIdx = Math.floor(nextTime / 5);
        if (newBeatIdx !== currentSpokenBeatRef.current && newBeatIdx < beats.length) {
          currentSpokenBeatRef.current = newBeatIdx;
          speakCurrentBeat(newBeatIdx);
        }

        return nextTime;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    // Trigger initial beat if at 0s
    const initialBeatIdx = Math.floor(currentTime / 5);
    if (initialBeatIdx !== currentSpokenBeatRef.current && initialBeatIdx < beats.length) {
      currentSpokenBeatRef.current = initialBeatIdx;
      speakCurrentBeat(initialBeatIdx);
    }

    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, useTts, useRecordedAudio, beats, voiceConfig]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Jump to specific beat
  const jumpToBeat = (beatIndex: number) => {
    const targetSec = beatIndex * 5;
    setCurrentTime(targetSec);
    currentSpokenBeatRef.current = beatIndex;
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = targetSec;
    }
    if (isPlaying) {
      speakCurrentBeat(beatIndex);
    }
  };

  // Subtitle theme classes
  const getSubtitleThemeClass = () => {
    switch (subtitleStyle.theme) {
      case 'yellow':
        return 'text-amber-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]';
      case 'cyan':
        return 'text-cyan-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]';
      case 'black-box':
        return 'text-white bg-black/75 px-4 py-2 rounded-lg backdrop-blur-sm shadow-xl';
      case 'white':
      default:
        return 'text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]';
    }
  };

  const getFontSizeClass = () => {
    switch (subtitleStyle.fontSize) {
      case 'sm':
        return 'text-xs sm:text-sm';
      case 'lg':
        return 'text-base sm:text-lg';
      case 'xl':
        return 'text-lg sm:text-xl';
      case 'base':
      default:
        return 'text-sm sm:text-base';
    }
  };

  // 3 distinct K-drama scene images mapped to each 5-second beat
  const sceneImages = [
    {
      beat: 0,
      name: beats[0]?.sceneName || 'Seoul Rain Romance',
      src: beats[0]?.imageSrc || BACKGROUND_SCENES[0].imageSrc,
      badge: '0-5s Hook',
    },
    {
      beat: 1,
      name: beats[1]?.sceneName || 'Yeonnam Cafe & Study',
      src: beats[1]?.imageSrc || BACKGROUND_SCENES[1].imageSrc,
      badge: '5-10s Slang & Life',
    },
    {
      beat: 2,
      name: beats[2]?.sceneName || 'Han River Sunset',
      src: beats[2]?.imageSrc || BACKGROUND_SCENES[2].imageSrc,
      badge: '10-15s Action',
    },
  ];

  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Backup public URLs in case of CDN or static hosting asset path differences
  const backupPublicUrls: Record<number, string> = {
    0: '/images/kdrama_reply_1988_1792393777516.jpg',
    1: '/images/kdrama_hospital_playlist_1792393777759.jpg',
    2: '/images/kdrama_attorney_woo_1792393778107.jpg',
  };

  // Preload poster images in the browser cache on mount
  useEffect(() => {
    sceneImages.forEach((scene, idx) => {
      if (scene.src) {
        const img = new Image();
        img.src = scene.src;
      }
      const backup = backupPublicUrls[idx];
      if (backup) {
        const bImg = new Image();
        bImg.src = backup;
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Hidden audio element for user recording */}
      {recordedAudioUrl && (
        <audio
          ref={audioElementRef}
          src={recordedAudioUrl}
          onEnded={() => stopPlayback()}
        />
      )}

      {/* 9:16 Phone Device Mockup */}
      <div className="relative w-[310px] sm:w-[340px] h-[600px] sm:h-[650px] bg-slate-950 rounded-[42px] p-3 shadow-2xl ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden">
        {/* Phone Notch / Speaker Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-3" />
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Video Screen Content */}
        <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-slate-950 select-none">
          {/* Automatic 5-Second Cross-fading K-Drama Scene Images with Fallbacks */}
          {sceneImages.map((scene, idx) => {
            const isVisible = autoSwitchScenes
              ? currentBeatIndex === idx
              : activeSceneId === BACKGROUND_SCENES[idx]?.id;

            const imageSrc = failedImages[idx]
              ? backupPublicUrls[idx]
              : (scene.src || backupPublicUrls[idx]);

            return (
              <div
                key={`scene-layer-${idx}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Visual Fallback Container with Drama Color Gradients (Prevents Black Screen) */}
                <div
                  className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center select-none ${
                    idx === 0
                      ? 'bg-gradient-to-b from-amber-950 via-stone-900 to-amber-900'
                      : idx === 1
                      ? 'bg-gradient-to-b from-sky-950 via-slate-900 to-teal-950'
                      : 'bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl mb-3 shadow-inner">
                    {idx === 0 ? '📻' : idx === 1 ? '🩺' : '🐳'}
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    {scene.name}
                  </h4>
                  <p className="text-xs text-white/70 mt-1 max-w-[200px]">
                    {idx === 0
                      ? '쌍문동 레트로 골목길 가족 & 청춘 이야기'
                      : idx === 1
                      ? '평범한 우리들의 조금 특별한 매일'
                      : '세상의 모든 편견을 깨는 천재 변호사'}
                  </p>
                </div>

                {/* Primary Drama Poster Image */}
                <img
                  src={imageSrc}
                  alt={scene.name}
                  onError={() => {
                    if (!failedImages[idx]) {
                      setFailedImages((prev) => ({ ...prev, [idx]: true }));
                    }
                  }}
                  className={`absolute inset-0 w-full h-full object-cover brightness-95 contrast-105 transition-transform duration-[4000ms] ease-out ${
                    isPlaying && isVisible ? 'scale-105' : 'scale-100'
                  }`}
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              </div>
            );
          })}

          {/* Gradients for subtitle & UI legibility (leaving top area clean and unobstructed) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none z-15" />

          {/* Center Play Overlay Trigger when paused */}
          {!isPlaying && (
            <button
              onClick={handleTogglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-25 group cursor-pointer"
              aria-label="Play video preview"
            >
              <div className="w-16 h-16 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
            </button>
          )}

          {/* Right Floating Social Engagement Column (TikTok/Reels style) positioned safely above subtitles */}
          <div className="absolute right-2.5 bottom-32 flex flex-col items-center gap-3.5 z-25">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex flex-col items-center gap-1 group cursor-pointer"
              aria-label="Like video"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                  isLiked
                    ? 'bg-rose-600 text-white'
                    : 'bg-black/50 text-white group-hover:bg-black/70'
                }`}
              >
                <Heart
                  className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`}
                />
              </div>
              <span className="text-[10px] font-medium text-white/90">24.5k</span>
            </button>

            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                <MessageCircle className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-medium text-white/90">842</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                <Share2 className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-medium text-white/90">Share</span>
            </div>
          </div>

          {/* Live Subtitle Card Overlay (All lines 100% visible, synchronized to voice narration) */}
          {(() => {
            // In a 5-second beat: line 1 is spoken during 0.0s - 2.4s, line 2 is spoken during 2.4s - 5.0s
            const beatElapsed = currentTime - currentBeatIndex * 5;
            const isFirstLineActive = beatElapsed < 2.4;
            const line1 = currentBeat.subtitleLines[0];
            const line2 = currentBeat.subtitleLines[1];

            const getHighlightClass = (isActive: boolean) => {
              if (!isActive || !isPlaying) {
                return 'text-white/80 font-medium';
              }
              switch (subtitleStyle.theme) {
                case 'yellow':
                  return 'text-amber-300 font-extrabold drop-shadow-[0_2px_12px_rgba(251,191,36,0.95)]';
                case 'cyan':
                  return 'text-cyan-300 font-extrabold drop-shadow-[0_2px_12px_rgba(103,232,249,0.95)]';
                case 'white':
                case 'black-box':
                default:
                  return 'text-white font-extrabold drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)]';
              }
            };

            return (
              <div
                className={`absolute left-3 right-3 z-25 text-center transition-all duration-300 pointer-events-none ${
                  subtitleStyle.position === 'middle' ? 'bottom-52' : 'bottom-6'
                }`}
              >
                <div
                  className={`inline-block w-full max-w-[295px] px-3.5 py-2.5 rounded-2xl transition-all duration-200 pointer-events-auto ${
                    subtitleStyle.theme === 'black-box'
                      ? 'bg-black/90 backdrop-blur-md shadow-2xl border border-white/20'
                      : 'bg-black/70 backdrop-blur-sm shadow-xl border border-white/10'
                  }`}
                >
                  {/* Line 1 - Full text visible with no truncation */}
                  <p
                    className={`leading-snug break-words transition-colors duration-200 ${getFontSizeClass()} ${getHighlightClass(
                      isFirstLineActive
                    )}`}
                  >
                    {line1}
                  </p>

                  {/* Line 2 - Full text visible with no truncation */}
                  {line2 && (
                    <p
                      className={`mt-1.5 leading-snug break-words transition-colors duration-200 ${getFontSizeClass()} ${getHighlightClass(
                        !isFirstLineActive
                      )}`}
                    >
                      {line2}
                    </p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Bottom Progress Bar (0 to 15s) */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30 cursor-pointer">
            <div
              className="h-full bg-rose-500 transition-all duration-100 relative"
              style={{ width: `${(currentTime / 15) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Video Controls Bar */}
      <div className="w-full max-w-[340px] mt-4 flex flex-col gap-2.5">
        {/* Timeline & Beat Jump Bar (Positioned outside the video screen to keep phone clear) */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900 rounded-xl text-white shadow-xs">
          <div className="flex items-center gap-1.5 font-mono text-[12px]">
            <span className="font-bold text-rose-400">{currentTime.toFixed(1)}s</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">15.0s</span>
          </div>

          <div className="flex items-center gap-1">
            {beats.map((b, idx) => {
              const isActive = idx === currentBeatIndex;
              return (
                <button
                  key={b.id}
                  onClick={() => jumpToBeat(idx)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`Jump to ${b.timeRange}`}
                >
                  {b.timeRange}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Playback Bar */}
        <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-900 rounded-xl text-white">
          <button
            onClick={handleTogglePlay}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{currentTime >= 15 ? 'Replay' : 'Play Video'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Reset to 0:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Voice Narration Audio Toggle */}
          <button
            onClick={() => setUseTts(!useTts)}
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
              useTts ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400 hover:text-white'
            }`}
            title={useTts ? 'Warm Male Narration ON' : 'Narration Muted'}
          >
            {useTts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Voice</span>
          </button>
        </div>

        {/* 5-Second Automatic Image Transitions Toggle */}
        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-xl text-xs">
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-semibold text-slate-800">5s Image Transition:</span>
          </div>

          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setAutoSwitchScenes(true)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                autoSwitchScenes
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Auto (3 Scenes)
            </button>
            <button
              onClick={() => setAutoSwitchScenes(false)}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                !autoSwitchScenes
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manual Lock
            </button>
          </div>
        </div>

        {/* Manual Scene Switcher if Auto is disabled */}
        {!autoSwitchScenes && (
          <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-lg">
            {BACKGROUND_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => onSceneChange(scene.id)}
                className={`flex-1 py-1 px-1.5 text-[11px] font-medium rounded-md truncate transition-colors cursor-pointer ${
                  activeSceneId === scene.id
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Scene {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
