import {
  AlertCircle,
  Check,
  Mic,
  Play,
  RotateCcw,
  Square,
  Volume2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Beat } from '../types';

interface VoiceoverRecorderProps {
  beats: Beat[];
  onRecordingComplete: (audioUrl: string | null) => void;
  recordedAudioUrl: string | null;
}

export const VoiceoverRecorder: React.FC<VoiceoverRecorderProps> = ({
  beats,
  onRecordingComplete,
  recordedAudioUrl,
}) => {
  const [recordingState, setRecordingState] = useState<
    'idle' | 'countdown' | 'recording' | 'finished'
  >('idle');
  const [countdown, setCountdown] = useState(3);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  // Active beat during recording
  const activeBeatIdx = Math.min(
    Math.floor(recordSeconds / 5),
    beats.length - 1
  );
  const activeBeat = beats[activeBeatIdx] || beats[0];

  const startCountdownAndRecord = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        const url = URL.createObjectURL(audioBlob);
        onRecordingComplete(url);
        // stop tracks to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start 3 second countdown
      setRecordingState('countdown');
      setCountdown(3);

      let currentCount = 3;
      const countTimer = window.setInterval(() => {
        currentCount -= 1;
        if (currentCount > 0) {
          setCountdown(currentCount);
        } else {
          clearInterval(countTimer);
          // Start actual 15s recording
          setRecordingState('recording');
          setRecordSeconds(0);
          mediaRecorder.start();

          let elapsed = 0;
          timerIntervalRef.current = window.setInterval(() => {
            elapsed += 0.1;
            setRecordSeconds(parseFloat(elapsed.toFixed(1)));

            if (elapsed >= 15) {
              if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
              if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state === 'recording'
              ) {
                mediaRecorderRef.current.stop();
              }
              setRecordingState('finished');
            }
          }, 100);
        }
      }, 1000);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Microphone access denied or unavailable.';
      setMicError(errorMsg);
      setRecordingState('idle');
    }
  };

  const stopRecordingEarly = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setRecordingState('finished');
  };

  const handleResetRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    onRecordingComplete(null);
    setRecordingState('idle');
    setRecordSeconds(0);
    setIsPlayingRecorded(false);
  };

  const togglePlayRecordedAudio = () => {
    if (!playbackAudioRef.current) return;
    if (isPlayingRecorded) {
      playbackAudioRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      playbackAudioRef.current.currentTime = 0;
      playbackAudioRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-rose-500" />
            <span>15-Second Voiceover Studio</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Practice speaking your narration in real time with timed beat markers
          </p>
        </div>

        {recordedAudioUrl && (
          <button
            onClick={handleResetRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Record Again</span>
          </button>
        )}
      </div>

      {micError && (
        <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Microphone notice: {micError}. You can still use the built-in TTS voice!</span>
        </div>
      )}

      {/* Main Recording Workspace */}
      {recordingState === 'idle' && !recordedAudioUrl && (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <Mic className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900">
              Ready to record your voiceover?
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              You'll get a 3-second countdown, then read the 3 beats as the timer tracks 0-5s, 5-10s, and 10-15s.
            </p>
          </div>
          <button
            onClick={startCountdownAndRecord}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>Start 15s Recording</span>
          </button>
        </div>
      )}

      {recordingState === 'countdown' && (
        <div className="text-center py-12 bg-slate-900 rounded-xl text-white flex flex-col items-center justify-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">
            Get Ready...
          </span>
          <div className="text-6xl font-black text-rose-400 animate-bounce">
            {countdown}
          </div>
          <p className="text-xs text-slate-300 mt-3">
            Read: "{beats[0].narration}"
          </p>
        </div>
      )}

      {recordingState === 'recording' && (
        <div className="bg-slate-950 text-white rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Recording Now
              </span>
            </div>
            <div className="font-mono text-base font-bold text-white">
              {recordSeconds.toFixed(1)}s / 15.0s
            </div>
          </div>

          {/* Active Beat Teleprompter Prominence */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-600 text-white font-semibold">
              Current Beat: {activeBeat.timeRange}
            </span>
            <p className="text-lg sm:text-xl font-bold text-white mt-3">
              "{activeBeat.narration}"
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Next beat starts at {activeBeat.endSecond}s
            </p>
          </div>

          {/* 15s Progress track */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-100"
              style={{ width: `${(recordSeconds / 15) * 100}%` }}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={stopRecordingEarly}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current text-rose-400" />
              <span>Stop Early</span>
            </button>
          </div>
        </div>
      )}

      {recordedAudioUrl && recordingState !== 'recording' && recordingState !== 'countdown' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <audio
            ref={playbackAudioRef}
            src={recordedAudioUrl}
            onEnded={() => setIsPlayingRecorded(false)}
          />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-slate-900">
                Voiceover Recorded Successfully!
              </h5>
              <p className="text-xs text-slate-500">
                Play back your recording or sync it with the video preview.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayRecordedAudio}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {isPlayingRecorded ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
