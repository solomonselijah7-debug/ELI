import React from 'react';
import { X, Sparkles, ArrowRight, Zap, Target } from 'lucide-react';
import { ToneType } from '../types';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (idea: string, tone: ToneType) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const presets: {
    category: string;
    title: string;
    idea: string;
    tone: ToneType;
    badge: string;
  }[] = [
    {
      category: 'Tech & AI Launch',
      title: 'Autonomous Support AI Agent Release',
      idea: 'Launching OmniVoice: an enterprise autonomous customer service AI agent that cuts ticket resolution time from 2 hours to 45 seconds using real-time reasoning and zero canned responses.',
      tone: 'urgent',
      badge: 'High Impact',
    },
    {
      category: 'Leadership & Culture',
      title: 'Why RTO Mandates Backfire on Top Engineers',
      idea: 'Why forced Return To Office (RTO) policies cause companies to silently lose their top 5% highest-performing senior engineers to fully asynchronous remote competitors.',
      tone: 'professional',
      badge: 'Contrarian',
    },
    {
      category: 'SaaS & Bootstrapping',
      title: 'Zero to $100k/Month as a Solo Founder',
      idea: '5 brutal lessons learned scaling our micro-SaaS from 0 to $100k MRR with no venture capital, 1 developer, and automated workflows.',
      tone: 'inspirational',
      badge: 'Storytelling',
    },
    {
      category: 'Sustainable Business',
      title: 'Zero-Waste Artisan Coffee Roastery Opening',
      idea: 'We are opening Brooklyn’s first 100% solar-powered, circular zero-waste coffee laboratory where spent coffee grounds are converted into mushroom compost and reusable ceramics.',
      tone: 'witty',
      badge: 'Eco Lifestyle',
    },
    {
      category: 'Engineering Architecture',
      title: 'Killing Microservices in Favor of the Modular Monolith',
      idea: 'How transitioning from 42 Kubernetes microservices back to a clean modular monolith reduced our AWS infrastructure bill by 74% and eliminated 90% of our on-call PagerDuty alerts.',
      tone: 'data-driven',
      badge: 'Tech Deep-Dive',
    },
    {
      category: 'Productivity & Habits',
      title: 'The "No-Meeting Wednesday" Experiment Outcome',
      idea: 'Our entire 80-person company banned internal meetings on Wednesdays for 6 months. Here is the quantitative data on sprint velocity, developer flow state, and employee burnout metrics.',
      tone: 'professional',
      badge: 'Workplace Ops',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-slate-100">Sample Campaign Idea Sparks</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {presets.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectPreset(preset.idea, preset.tone);
                onClose();
              }}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {preset.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {preset.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white mb-1.5">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                  {preset.idea}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Target className="w-3 h-3 text-purple-400" />
                  Tone: <strong className="text-slate-300 capitalize">{preset.tone}</strong>
                </span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-[11px]">
                  Use Spark <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
