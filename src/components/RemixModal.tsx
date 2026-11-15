import React, { useState } from 'react';
import { X, Sparkles, Wand2, RefreshCw } from 'lucide-react';

interface RemixModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
  originalText: string;
  onApplyRemix: (remixedText: string) => void;
}

export const RemixModal: React.FC<RemixModalProps> = ({
  isOpen,
  onClose,
  platform,
  originalText,
  onApplyRemix,
}) => {
  const [selectedAngle, setSelectedAngle] = useState('Contrarian & Debated');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isRemixing, setIsRemixing] = useState(false);
  const [remixedResult, setRemixedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const angles = [
    { label: 'Contrarian & Debated', desc: 'Challenges conventional wisdom with a bold stance' },
    { label: 'Vulnerable Founder Story', desc: 'Raw, honest confession of failures leading to revelation' },
    { label: 'C-Suite Executive Memo', desc: 'High-level strategic briefing with crisp business implications' },
    { label: 'Standup Comedian Humor', desc: 'Self-aware, witty, and playfully irreverent' },
    { label: 'Urgent Breaking Launch', desc: 'Hyped, high-energy countdown with intense FOMO' },
    { label: 'Step-by-Step Tactical Playbook', desc: 'Zero fluff, numbered masterclass execution steps' },
  ];

  const handleRunRemix = async () => {
    setIsRemixing(true);
    setError(null);
    try {
      const res = await fetch('/api/remix-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalText,
          platform,
          remixStyle: selectedAngle,
          instructions: customPrompt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remix');
      setRemixedResult(data.remixedText);
    } catch (err: any) {
      setError(err.message || 'Error occurred while remixing');
    } finally {
      setIsRemixing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Creative Remix & Angle Shift
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  gemini-4-argon
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Transform tone and narrative for {platform}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Creative Angle
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {angles.map((ang) => (
                <button
                  key={ang.label}
                  type="button"
                  onClick={() => setSelectedAngle(ang.label)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedAngle === ang.label
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-200">{ang.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ang.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Custom instructions (optional)
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Focus on lessons learned the hard way, mention our 3-week sprint"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
              {error}
            </p>
          )}

          {remixedResult && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
              <span className="text-xs font-bold text-indigo-400 block">✨ Remixed Draft Preview:</span>
              <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                {remixedResult}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            {!remixedResult ? (
              <button
                type="button"
                onClick={handleRunRemix}
                disabled={isRemixing}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isRemixing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Remixing with gemini-4-argon...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Interactive Remix</span>
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRunRemix}
                  disabled={isRemixing}
                  className="py-2 px-3 rounded-lg border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApplyRemix(remixedResult);
                    onClose();
                  }}
                  className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  Apply to Draft
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
