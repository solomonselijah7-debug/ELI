import React from 'react';
import { Sparkles, Layers, History, Lightbulb, Share2 } from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onOpenHistory: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPresets, onOpenHistory, savedCount }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                OmniPost AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Simultaneous cross-platform copy & aspect-ratio tailored visual generator
            </p>
          </div>
        </div>

        {/* Platform Icons & Badges */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            LinkedIn
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 font-medium text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Twitter / X
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 font-medium text-pink-400">
            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
            Instagram
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-all cursor-pointer"
            title="Browse sample campaign ideas"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Idea Sparks</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-all cursor-pointer relative"
            title="View saved campaign history"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">History</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-500 text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
