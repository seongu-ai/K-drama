import { Check, Copy, Download, FileText, X } from 'lucide-react';
import React, { useState } from 'react';
import { downloadFile, formatPlainScript, generateSrt } from '../utils/textUtils';
import { Beat } from '../types';

interface ExportModalProps {
  beats: Beat[];
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  beats,
  isOpen,
  onClose,
}) => {
  const [copiedType, setCopiedType] = useState<'plain' | 'srt' | null>(null);

  if (!isOpen) return null;

  const plainScript = formatPlainScript(beats);
  const srtContent = generateSrt(beats);

  const handleCopy = (text: string, type: 'plain' | 'srt') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Export 15-Second Narration & Subtitles
            </h3>
            <p className="text-xs text-slate-500">
              Ready for social media captioning, video editors, or sharing with your friend
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formatted Script Box */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Standard Narration & Subtitle Cards
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(plainScript, 'plain')}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                {copiedType === 'plain' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadFile('kdrama_15s_script.txt', plainScript)}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .TXT</span>
              </button>
            </div>
          </div>

          <pre className="p-3.5 bg-slate-900 text-slate-200 text-xs font-mono rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 border border-slate-800">
            {plainScript}
          </pre>
        </div>

        {/* SRT Subtitle Box */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              SRT Subtitle File (CapCut / Premiere / Reels / Shorts)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(srtContent, 'srt')}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                {copiedType === 'srt' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SRT</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadFile('kdrama_15s_subtitles.srt', srtContent, 'text/plain')}
                className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .SRT</span>
              </button>
            </div>
          </div>

          <pre className="p-3.5 bg-slate-950 text-emerald-400 text-xs font-mono rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-36 border border-slate-800">
            {srtContent}
          </pre>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
