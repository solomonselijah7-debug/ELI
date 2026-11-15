import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Download,
  RefreshCw,
  Sliders,
  Eye,
  Edit3,
  Image as ImageIcon,
  Brain,
  Wand2,
  Maximize2,
  ChevronDown
} from 'lucide-react';
import {
  PlatformType,
  AspectRatioType,
  ImageSizeType,
  ImageModelType,
  ViralAnalysis
} from '../types';
import {
  LinkedInMockup,
  TwitterMockup,
  InstagramMockup,
  getAspectClass
} from './PlatformMockups';

interface PlatformCardProps {
  platform: PlatformType;
  title: string;
  subtitle: string;
  accentColor: 'blue' | 'sky' | 'pink';

  // Content
  rawContentText: string;
  onUpdateContentText: (newText: string) => void;
  postData: any;

  // Visual
  visualUrl?: string;
  visualPrompt: string;
  onUpdatePrompt: (prompt: string) => void;
  aspectRatio: AspectRatioType;
  onChangeAspectRatio: (ratio: AspectRatioType) => void;
  imageSize: ImageSizeType;
  onChangeImageSize: (size: ImageSizeType) => void;
  imageModel: ImageModelType;
  onChangeImageModel: (model: ImageModelType) => void;
  isGeneratingImage: boolean;
  onRegenerateImage: () => void;
  onOpenLightbox: () => void;

  // AI Actions
  onOpenAnalysis: (platform: string, content: string) => void;
  onOpenRemix: (platform: string, content: string) => void;
  onQuickPolish: (action: string) => Promise<void>;
  isPolishing: boolean;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  title,
  subtitle,
  accentColor,
  rawContentText,
  onUpdateContentText,
  postData,
  visualUrl,
  visualPrompt,
  onUpdatePrompt,
  aspectRatio,
  onChangeAspectRatio,
  imageSize,
  onChangeImageSize,
  imageModel,
  onChangeImageModel,
  isGeneratingImage,
  onRegenerateImage,
  onOpenLightbox,
  onOpenAnalysis,
  onOpenRemix,
  onQuickPolish,
  isPolishing,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'mockup' | 'visual'>('mockup');
  const [copied, setCopied] = useState(false);
  const [showPolishMenu, setShowPolishMenu] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const aspectRatios: AspectRatioType[] = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawContentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const charCount = rawContentText.length;
  const isOverTwitterLimit = platform === 'twitter' && charCount > 280;

  const colorStyles = {
    blue: {
      border: 'border-blue-500/30',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      glow: 'shadow-blue-500/5',
      accent: 'text-blue-400',
    },
    sky: {
      border: 'border-sky-500/30',
      badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      glow: 'shadow-sky-500/5',
      accent: 'text-sky-400',
    },
    pink: {
      border: 'border-pink-500/30',
      badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      glow: 'shadow-pink-500/5',
      accent: 'text-pink-400',
    },
  }[accentColor];

  return (
    <div className={`bg-slate-900/80 border ${colorStyles.border} rounded-2xl flex flex-col shadow-xl ${colorStyles.glow} backdrop-blur-md overflow-hidden transition-all duration-200`}>
      {/* Platform Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${colorStyles.badge}`}>
              {title}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">{subtitle}</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('mockup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'mockup'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mockup</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visual ({aspectRatio})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* TAB 1: REALISTIC MOCKUP */}
        {activeTab === 'mockup' && (
          <div className="flex-1 flex flex-col justify-center">
            {platform === 'linkedin' && (
              <LinkedInMockup
                post={postData}
                image={visualUrl}
                aspectRatio={aspectRatio}
                onOpenImage={onOpenLightbox}
              />
            )}
            {platform === 'twitter' && (
              <TwitterMockup
                post={postData}
                image={visualUrl}
                aspectRatio={aspectRatio}
                onOpenImage={onOpenLightbox}
              />
            )}
            {platform === 'instagram' && (
              <InstagramMockup
                post={postData}
                image={visualUrl}
                aspectRatio={aspectRatio}
                onOpenImage={onOpenLightbox}
              />
            )}
          </div>
        )}

        {/* TAB 2: COPY & RAW EDITOR */}
        {activeTab === 'editor' && (
          <div className="flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Editable Post Copy</span>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs ${isOverTwitterLimit ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                  {charCount} chars {platform === 'twitter' && '/ 280'}
                </span>
                {isOverTwitterLimit && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                    Over limit
                  </span>
                )}
              </div>
            </div>

            <textarea
              rows={12}
              value={rawContentText}
              onChange={(e) => onUpdateContentText(e.target.value)}
              className="w-full flex-1 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-indigo-500 resize-y"
              placeholder="Post copy..."
            />
          </div>
        )}

        {/* TAB 3: VISUAL & ASPECT RATIO STUDIO */}
        {activeTab === 'visual' && (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Visual Display */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden flex flex-col items-center justify-center relative min-h-[220px]">
              {isGeneratingImage ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-center">
                  <div className="w-8 h-8 border-3 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                  <p className="text-xs font-semibold text-slate-300">
                    Generating studio visual ({aspectRatio} • {imageSize})...
                  </p>
                  <p className="text-[11px] text-slate-500">Using {imageModel}</p>
                </div>
              ) : visualUrl ? (
                <div
                  className={`w-full ${getAspectClass(aspectRatio)} max-h-[340px] rounded-lg overflow-hidden relative group cursor-pointer`}
                  onClick={onOpenLightbox}
                >
                  <img
                    src={visualUrl}
                    alt={visualPrompt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-semibold flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" /> Fullscreen View
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-center text-slate-500">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                  <p className="text-xs">No image generated yet</p>
                </div>
              )}
            </div>

            {/* Affordance: Aspect Ratio Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Aspect Ratio Affordance:</span>
                <span className="text-[11px] text-slate-400 font-mono">Current: {aspectRatio}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => onChangeAspectRatio(ratio)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono border transition-all cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Affordance: Resolution (1K, 2K, 4K) & Model */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Resolution Affordance:</span>
                <div className="flex gap-1">
                  {(['1K', '2K', '4K'] as ImageSizeType[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onChangeImageSize(sz)}
                      className={`flex-1 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        imageSize === sz
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Model Affordance:</span>
                <select
                  value={imageModel}
                  onChange={(e) => onChangeImageModel(e.target.value as ImageModelType)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded p-1 outline-none"
                >
                  <option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview</option>
                  <option value="gemini-nano-banana-2.1">gemini-nano-banana-2.1</option>
                </select>
              </div>
            </div>

            {/* Prompt Editor */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Visual Prompt</span>
                <button
                  type="button"
                  onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                >
                  {isEditingPrompt ? 'Done' : 'Edit Prompt'}
                </button>
              </div>

              {isEditingPrompt ? (
                <textarea
                  rows={3}
                  value={visualPrompt}
                  onChange={(e) => onUpdatePrompt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              ) : (
                <p className="text-slate-400 line-clamp-3 italic">"{visualPrompt}"</p>
              )}

              <button
                type="button"
                onClick={onRegenerateImage}
                disabled={isGeneratingImage}
                className="w-full py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                <span>Regenerate Image with current settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Controls Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Gemini AI Superpowers */}
          <div className="flex items-center gap-1.5 relative">
            {/* Quick Polish (gemini-3.1-flash-lite) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPolishMenu(!showPolishMenu)}
                disabled={isPolishing}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Fast 1-click edits with gemini-3.1-flash-lite"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Polish</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showPolishMenu && (
                <div className="absolute bottom-full mb-1.5 left-0 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-30 space-y-1 text-xs">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    gemini-3.1-flash-lite
                  </div>
                  <button
                    onClick={() => {
                      onQuickPolish('punch-hook');
                      setShowPolishMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                  >
                    🔥 Punch up hook
                  </button>
                  {platform === 'twitter' && (
                    <button
                      onClick={() => {
                        onQuickPolish('shorten-twitter');
                        setShowPolishMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                    >
                      ✂️ Trim under 260 chars
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onQuickPolish('bulletize');
                      setShowPolishMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                  >
                    📋 Convert to crisp bullets
                  </button>
                  <button
                    onClick={() => {
                      onQuickPolish('fix-grammar');
                      setShowPolishMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                  >
                    ✨ Polish flow & tone
                  </button>
                  <button
                    onClick={() => {
                      onQuickPolish('add-cta');
                      setShowPolishMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                  >
                    🎯 Boost CTA question
                  </button>
                </div>
              )}
            </div>

            {/* Deep Reasoning Viral Audit (gemini-4-carbon) */}
            <button
              type="button"
              onClick={() => onOpenAnalysis(title, rawContentText)}
              className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Deep viral reasoning with gemini-4-carbon"
            >
              <Brain className="w-3 h-3 text-purple-400" />
              <span>Audit</span>
            </button>

            {/* Creative Remix (gemini-4-argon) */}
            <button
              type="button"
              onClick={() => onOpenRemix(title, rawContentText)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Creative angle remix with gemini-4-argon"
            >
              <Wand2 className="w-3 h-3 text-indigo-400" />
              <span>Remix</span>
            </button>
          </div>

          {/* Right: Copy & Download Actions */}
          <div className="flex items-center gap-2">
            {visualUrl && (
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = visualUrl;
                  link.download = `${platform}-post-${aspectRatio.replace(':', 'x')}.png`;
                  link.click();
                }}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Download visual"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Post</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
