import React from 'react';
import { X, Award, Brain, Target, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { ViralAnalysis } from '../types';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ViralAnalysis | null;
  platform: string;
  onApplyHook: (hook: string) => void;
  isLoading: boolean;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  platform,
  onApplyHook,
  isLoading,
}) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    if (score >= 55) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Deep Viral Audit & Reasoning
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  gemini-4-carbon
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Cognitive hook analysis and psychological resonance for {platform}
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-300">
                Running deep cognitive reasoning audit with gemini-4-carbon...
              </p>
              <p className="text-xs text-slate-500">
                Evaluating hook retention, emotional triggers, and audience mental models
              </p>
            </div>
          ) : analysis ? (
            <>
              {/* Scorecard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreColor(analysis.score)}`}>
                  <span className="text-3xl font-black">{analysis.score}/100</span>
                  <span className="text-xs font-semibold uppercase tracking-wider mt-1">Viral Potential</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-bold text-indigo-400">{analysis.hookRating}</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Hook Grade</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-bold text-pink-400">{analysis.psychologicalTriggers?.length || 0} Triggers</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Mental Anchors</span>
                </div>
              </div>

              {/* Hook Critique */}
              {analysis.hookCritique && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-100 block mb-1">💡 Reasoning Critique:</span>
                  <p>{analysis.hookCritique}</p>
                </div>
              )}

              {/* Triggers identified */}
              {analysis.psychologicalTriggers?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-pink-400" />
                    Psychological Hooks & Emotion
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.psychologicalTriggers.map((trig, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-medium"
                      >
                        {trig}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h5 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> High-Impact Strengths
                  </h5>
                  <ul className="text-xs space-y-1.5 text-slate-300">
                    {analysis.strengths?.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h5 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Growth & Refinements
                  </h5>
                  <ul className="text-xs space-y-1.5 text-slate-300">
                    {analysis.improvements?.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3 Alternative A/B Hooks to 1-Click Replace */}
              {analysis.alternativeHooks?.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    A/B Test Alternative Hooks (1-Click Apply)
                  </h4>
                  <div className="space-y-2.5">
                    {analysis.alternativeHooks.map((alt, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-start justify-between gap-3 group"
                      >
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-1.5">
                            {alt.angle}
                          </span>
                          <p className="text-xs text-slate-200 font-medium leading-relaxed">
                            "{alt.hook}"
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            onApplyHook(alt.hook);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap opacity-80 group-hover:opacity-100"
                        >
                          <span>Use</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">
              Click run to perform deep viral audit.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
