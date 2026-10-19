import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

interface TopNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onCopyScript: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeSection,
  onNavigate,
  onCopyScript,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyScript();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:text-rose-600 transition-colors"
        >
          <span className="text-xl">🎬</span>
          <span>K-Drama ScriptStudio</span>
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('script-beats')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeSection === 'script-beats'
                ? 'text-slate-950 font-semibold border-b-2 border-rose-500'
                : 'hover:text-slate-900'
            }`}
          >
            Script Beats
          </button>
          <button
            onClick={() => onNavigate('video-preview')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeSection === 'video-preview'
                ? 'text-slate-950 font-semibold border-b-2 border-rose-500'
                : 'hover:text-slate-900'
            }`}
          >
            Video Preview
          </button>
          <button
            onClick={() => onNavigate('voice-settings')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeSection === 'voice-settings'
                ? 'text-slate-950 font-semibold border-b-2 border-rose-500'
                : 'hover:text-slate-900'
            }`}
          >
            Male Voice
          </button>
          <button
            onClick={() => onNavigate('study-guide')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeSection === 'study-guide'
                ? 'text-slate-950 font-semibold border-b-2 border-rose-500'
                : 'hover:text-slate-900'
            }`}
          >
            Study Guide
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Script Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
