import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Zap,
  Wand2,
  Maximize2,
  Cpu,
  Palette,
  Target
} from 'lucide-react';
import { ToneType, AspectRatioType, ImageSizeType, ImageModelType } from '../types';

interface IdeaInputSectionProps {
  idea: string;
  setIdea: (val: string) => void;
  tone: ToneType;
  setTone: (val: ToneType) => void;
  customTone: string;
  setCustomTone: (val: string) => void;
  
  // Image Generation Settings
  imageSize: ImageSizeType;
  setImageSize: (val: ImageSizeType) => void;
  imageModel: ImageModelType;
  setImageModel: (val: ImageModelType) => void;
  imageStyle: string;
  setImageStyle: (val: string) => void;
  
  // Custom aspect ratio overrides
  linkedinRatio: AspectRatioType;
  setLinkedinRatio: (val: AspectRatioType) => void;
  twitterRatio: AspectRatioType;
  setTwitterRatio: (val: AspectRatioType) => void;
  instagramRatio: AspectRatioType;
  setInstagramRatio: (val: AspectRatioType) => void;

  onGenerate: () => void;
  isGenerating: boolean;
  onSelectPrompt: (promptText: string) => void;
}

export const IdeaInputSection: React.FC<IdeaInputSectionProps> = ({
  idea,
  setIdea,
  tone,
  setTone,
  customTone,
  setCustomTone,
  imageSize,
  setImageSize,
  imageModel,
  setImageModel,
  imageStyle,
  setImageStyle,
  linkedinRatio,
  setLinkedinRatio,
  twitterRatio,
  setTwitterRatio,
  instagramRatio,
  setInstagramRatio,
  onGenerate,
  isGenerating,
  onSelectPrompt,
}) => {
  const [showAdvancedVisuals, setShowAdvancedVisuals] = useState(false);

  const toneOptions: { id: ToneType; label: string; desc: string; icon: string }[] = [
    {
      id: 'professional',
      label: 'Professional',
      desc: 'Authoritative, insightful, structured thought-leadership',
      icon: '👔',
    },
    {
      id: 'witty',
      label: 'Witty & Punchy',
      desc: 'Clever, humorous, hook-driven with viral meme-literacy',
      icon: '⚡',
    },
    {
      id: 'urgent',
      label: 'Urgent & Bold',
      desc: 'High-stakes, time-sensitive, breakthrough announcement',
      icon: '🔥',
    },
    {
      id: 'inspirational',
      label: 'Inspirational',
      desc: 'Emotional vulnerability, personal growth, storytelling',
      icon: '💡',
    },
    {
      id: 'data-driven',
      label: 'Data-Driven',
      desc: 'Frameworks, bulleted insights, metrics and tactical breakdowns',
      icon: '📊',
    },
    {
      id: 'custom',
      label: 'Custom Persona',
      desc: 'Define your exact tone or brand voice',
      icon: '🎯',
    },
  ];

  const aspectRatios: AspectRatioType[] = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];

  const quickSparks = [
    { label: '🚀 AI Product Launch', text: 'Launching a new autonomous customer service AI agent that cuts ticket resolution time from 2 hours to 45 seconds.' },
    { label: '💡 Remote Work Lesson', text: 'Why forcing employees back to physical offices is causing tech companies to lose their highest-performing engineers.' },
    { label: '📈 Bootstrapped to $100k MRR', text: 'Behind the scenes: The 5 hardest lessons going from zero to $100k/month as a solo software developer.' },
    { label: '☕ Zero-Waste Café', text: 'Opening our flagship solar-powered, zero-plastic artisan coffee shop in downtown Brooklyn.' },
  ];

  const visualStyles = [
    { id: 'minimal-3d', label: 'Minimalist 3D Studio' },
    { id: 'editorial-photo', label: 'Editorial Photography' },
    { id: 'tech-gradient', label: 'Modern Dark Tech' },
    { id: 'cyberpunk-neon', label: 'Cyberpunk Neon' },
    { id: 'vector-flat', label: 'Vector Graphic' },
    { id: 'cinematic', label: 'Cinematic Anamorphic' },
    { id: 'none', label: 'Photorealistic / Organic' },
  ];

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Idea Textarea */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="idea-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            What is your core idea, announcement, or story?
          </label>
          <span className="text-xs text-slate-400">
            Simultaneously drafted for LinkedIn, Twitter & Instagram
          </span>
        </div>

        <div className="relative">
          <textarea
            id="idea-input"
            rows={3}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g. We just open-sourced our real-time collaboration engine. It handles 50,000 concurrent edits with sub-10ms conflict resolution..."
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-4 text-slate-100 placeholder-slate-500 text-sm sm:text-base leading-relaxed transition-all resize-y outline-none"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                if (idea.trim() && !isGenerating) onGenerate();
              }
            }}
          />
        </div>

        {/* Quick Sparks */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-medium">Quick Sparks:</span>
          {quickSparks.map((spark, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(spark.text)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            >
              {spark.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            Select Desired Tone
          </label>
          <span className="text-xs text-slate-400">Sets the emotional cadence across all 3 platforms</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {toneOptions.map((opt) => {
            const isSelected = tone === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTone(opt.id)}
                className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/40 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{opt.icon}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 tracking-tight">{opt.label}</h4>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">{opt.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Custom Tone Input */}
        {tone === 'custom' && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/30 flex items-center gap-3">
            <span className="text-xs font-semibold text-indigo-400 whitespace-nowrap">Custom Tone:</span>
            <input
              type="text"
              value={customTone}
              onChange={(e) => setCustomTone(e.target.value)}
              placeholder="e.g., Cynical Silicon Valley engineer with dry British humor and actionable metrics"
              className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Visual & Image Controls (Affordances for Aspect Ratio & Size) */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-semibold text-slate-200">
              Visual Studio & Aspect Ratios
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20 font-medium">
              3 Unique Visuals
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedVisuals(!showAdvancedVisuals)}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvancedVisuals ? 'Hide Details' : 'Configure Sizes & Models'}</span>
            {showAdvancedVisuals ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Summary Badges of current settings */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-blue-400 font-semibold">LinkedIn:</span>
            <span className="font-mono text-slate-200">{linkedinRatio}</span>
            <span className="text-[10px] text-slate-500">(Landscape)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-sky-400 font-semibold">Twitter/X:</span>
            <span className="font-mono text-slate-200">{twitterRatio}</span>
            <span className="text-[10px] text-slate-500">(Timeline)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-pink-400 font-semibold">Instagram:</span>
            <span className="font-mono text-slate-200">{instagramRatio}</span>
            <span className="text-[10px] text-slate-500">(Feed Square)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 ml-auto">
            <Maximize2 className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-400">Resolution:</span>
            <span className="font-bold text-emerald-400">{imageSize}</span>
            <span className="text-slate-500">|</span>
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span className="text-slate-300 truncate max-w-[130px]">{imageModel === 'gemini-3-pro-image-preview' ? 'Pro Image Studio' : 'Nano Banana 2.1'}</span>
          </div>
        </div>

        {/* Expandable Advanced Visual Affordances */}
        {showAdvancedVisuals && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
            {/* Resolution Affordance (1K, 2K, 4K) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  Image Size / Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageSizeType[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSize(size)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                        imageSize === size
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {size}
                      <span className="block text-[9px] font-normal text-slate-500">
                        {size === '1K' ? '1024px' : size === '2K' ? '2048px' : '4096px Ultra'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  Image Generation Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageModel('gemini-3-pro-image-preview')}
                    className={`p-2 rounded-lg text-xs font-semibold border text-left transition-all cursor-pointer ${
                      imageModel === 'gemini-3-pro-image-preview'
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold">gemini-3-pro-image-preview</div>
                    <div className="text-[10px] text-slate-500">Studio Quality Photorealism</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageModel('gemini-nano-banana-2.1')}
                    className={`p-2 rounded-lg text-xs font-semibold border text-left transition-all cursor-pointer ${
                      imageModel === 'gemini-nano-banana-2.1'
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold">gemini-nano-banana-2.1</div>
                    <div className="text-[10px] text-slate-500">Fast High-Resolution Generation</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Aspect Ratio Customizers */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Customize Aspect Ratio Per Platform (Supported: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* LinkedIn */}
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-400">LinkedIn Post</span>
                    <span className="text-[10px] text-slate-500">Recommended: 16:9 / 4:3</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setLinkedinRatio(ratio)}
                        className={`text-[11px] px-2 py-0.5 rounded font-mono cursor-pointer transition-colors ${
                          linkedinRatio === ratio
                            ? 'bg-blue-500 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Twitter / X */}
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-400">Twitter / X</span>
                    <span className="text-[10px] text-slate-500">Recommended: 16:9</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setTwitterRatio(ratio)}
                        className={`text-[11px] px-2 py-0.5 rounded font-mono cursor-pointer transition-colors ${
                          twitterRatio === ratio
                            ? 'bg-sky-500 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instagram */}
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-pink-400">Instagram</span>
                    <span className="text-[10px] text-slate-500">Recommended: 1:1 / 4:3 / 9:16</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setInstagramRatio(ratio)}
                        className={`text-[11px] px-2 py-0.5 rounded font-mono cursor-pointer transition-colors ${
                          instagramRatio === ratio
                            ? 'bg-pink-500 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Style Preset */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Artistic Style:
              </span>
              {visualStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setImageStyle(style.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    imageStyle === style.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Action Bar */}
      <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>
            Generates 3 full drafts with <strong className="text-slate-200">gemini-3.8-flash</strong> & 3 visuals simultaneously
          </span>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!idea.trim() || isGenerating}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            !idea.trim() || isGenerating
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white shadow-indigo-500/25 ring-1 ring-white/20 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Cross-Platform Studio...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate Cross-Platform Campaign</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
