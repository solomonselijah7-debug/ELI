/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Download,
  Copy,
  Check,
  AlertCircle,
  Share2,
  FileText,
  RefreshCw,
  FolderDown,
  LayoutGrid,
  Columns
} from 'lucide-react';
import { Header } from './components/Header';
import { IdeaInputSection } from './components/IdeaInputSection';
import { PlatformCard } from './components/PlatformCard';
import { AnalysisModal } from './components/AnalysisModal';
import { RemixModal } from './components/RemixModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { PresetsModal } from './components/PresetsModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  PlatformType,
  ToneType,
  AspectRatioType,
  ImageSizeType,
  ImageModelType,
  GeneratedCampaignData,
  PlatformVisualState,
  ViralAnalysis,
  SavedCampaign
} from './types';

export default function App() {
  // Input State
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [customTone, setCustomTone] = useState('');

  // Image Settings (Affordances for Size, Model, Aspect Ratio)
  const [imageSize, setImageSize] = useState<ImageSizeType>('1K');
  const [imageModel, setImageModel] = useState<ImageModelType>('gemini-3-pro-image-preview');
  const [imageStyle, setImageStyle] = useState('none');

  // Platform Aspect Ratios (Defaults to optimal platform aspect ratio, with full customization affordance)
  const [linkedinRatio, setLinkedinRatio] = useState<AspectRatioType>('16:9');
  const [twitterRatio, setTwitterRatio] = useState<AspectRatioType>('16:9');
  const [instagramRatio, setInstagramRatio] = useState<AspectRatioType>('1:1');

  // Campaign Output State
  const [campaignData, setCampaignData] = useState<GeneratedCampaignData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Raw Content editable strings for 1-click copy & in-place tweaks
  const [linkedinText, setLinkedinText] = useState('');
  const [twitterText, setTwitterText] = useState('');
  const [instagramText, setInstagramText] = useState('');

  // Visuals per platform
  const [visuals, setVisuals] = useState<Record<PlatformType, PlatformVisualState>>({
    linkedin: {
      aspectRatio: '16:9',
      imageSize: '1K',
      model: 'gemini-3-pro-image-preview',
      prompt: '',
      style: 'none',
      isLoading: false,
    },
    twitter: {
      aspectRatio: '16:9',
      imageSize: '1K',
      model: 'gemini-3-pro-image-preview',
      prompt: '',
      style: 'none',
      isLoading: false,
    },
    instagram: {
      aspectRatio: '1:1',
      imageSize: '1K',
      model: 'gemini-3-pro-image-preview',
      prompt: '',
      style: 'none',
      isLoading: false,
    },
  });

  // Intelligence Modals State
  const [analysisModal, setAnalysisModal] = useState<{
    isOpen: boolean;
    platform: string;
    analysis: ViralAnalysis | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    platform: '',
    analysis: null,
    isLoading: false,
  });

  const [remixModal, setRemixModal] = useState<{
    isOpen: boolean;
    platform: string;
    originalText: string;
  }>({
    isOpen: false,
    platform: '',
    originalText: '',
  });

  const [lightboxModal, setLightboxModal] = useState<{
    isOpen: boolean;
    imageUrl?: string;
    prompt: string;
    platform: string;
    aspectRatio: AspectRatioType;
    imageSize: ImageSizeType;
    model: string;
  }>({
    isOpen: false,
    prompt: '',
    platform: '',
    aspectRatio: '1:1',
    imageSize: '1K',
    model: '',
  });

  const [polishingPlatform, setPolishingPlatform] = useState<string | null>(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState<SavedCampaign[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);

  // Load saved campaigns from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('omnipost_saved_campaigns');
      if (stored) {
        setSavedCampaigns(JSON.parse(stored));
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Update localStorage when savedCampaigns changes
  const saveCampaignToStorage = (newCamp: SavedCampaign) => {
    setSavedCampaigns((prev) => {
      const updated = [newCamp, ...prev.filter((c) => c.id !== newCamp.id)].slice(0, 15);
      try {
        localStorage.setItem('omnipost_saved_campaigns', JSON.stringify(updated));
      } catch {
        // quota exceeded
      }
      return updated;
    });
  };

  // Format LinkedIn raw text
  const formatLinkedInText = (li: GeneratedCampaignData['linkedin']) => {
    return `${li.hook}\n\n${li.body}\n\nTakeaway: ${li.actionableTakeaway}\n\n${li.callToAction}\n\n${li.hashtags?.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}`;
  };

  // Format Twitter raw text
  const formatTwitterText = (tw: GeneratedCampaignData['twitter']) => {
    const main = `${tw.mainTweet} ${tw.hashtags?.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}`;
    return main;
  };

  // Format Instagram raw text
  const formatInstagramText = (ig: GeneratedCampaignData['instagram']) => {
    const allTags = [
      ...(ig.hashtags?.niche || []),
      ...(ig.hashtags?.industry || []),
      ...(ig.hashtags?.reach || []),
    ];
    return `${ig.captionHook}\n\n${ig.body}\n\n${ig.callToAction}\n\n.\n.\n.\n${allTags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}`;
  };

  // Individual Image Generation Worker
  const generatePlatformImage = async (
    platform: PlatformType,
    prompt: string,
    aspectRatio: AspectRatioType,
    size: ImageSizeType,
    model: ImageModelType,
    style: string
  ) => {
    setVisuals((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        isLoading: true,
        error: undefined,
        prompt,
        aspectRatio,
        imageSize: size,
        model,
        style,
      },
    }));

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          platform,
          aspectRatio,
          imageSize: size,
          model,
          stylePreset: style,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate visual');
      }

      setVisuals((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          imageUrl: data.imageUrl,
          isLoading: false,
          aspectRatio: data.aspectRatio,
          imageSize: data.imageSize,
          model: data.modelUsed,
        },
      }));
    } catch (err: any) {
      console.error(`Error generating visual for ${platform}:`, err);
      setVisuals((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          isLoading: false,
          error: err.message || 'Image generation failed',
        },
      }));
    }
  };

  // Main Unified Cross-Platform Generator
  const handleGenerateCampaign = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    setGlobalError(null);

    try {
      // 1. Generate all 3 platform drafts simultaneously with gemini-3.8-flash
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          tone,
          customTone,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to generate social media content.');
      }

      const generated: GeneratedCampaignData = resData.data;
      setCampaignData(generated);

      // Set editable text strings
      setLinkedinText(formatLinkedInText(generated.linkedin));
      setTwitterText(formatTwitterText(generated.twitter));
      setInstagramText(formatInstagramText(generated.instagram));

      // 2. Simultaneously generate unique platform visuals tailored to each optimal aspect ratio!
      // LinkedIn: 16:9 (or user custom ratio)
      generatePlatformImage(
        'linkedin',
        generated.linkedin.suggestedImagePrompt,
        linkedinRatio,
        imageSize,
        imageModel,
        imageStyle
      );

      // Twitter/X: 16:9 (or user custom ratio)
      generatePlatformImage(
        'twitter',
        generated.twitter.suggestedImagePrompt,
        twitterRatio,
        imageSize,
        imageModel,
        imageStyle
      );

      // Instagram: 1:1 (or user custom ratio)
      generatePlatformImage(
        'instagram',
        generated.instagram.suggestedImagePrompt,
        instagramRatio,
        imageSize,
        imageModel,
        imageStyle
      );

      // Save campaign to local history
      const newCamp: SavedCampaign = {
        id: `camp_${Date.now()}`,
        timestamp: Date.now(),
        idea,
        tone: tone === 'custom' ? customTone : tone,
        headline: generated.summaryHeadline,
        data: generated,
        visuals: {},
      };
      saveCampaignToStorage(newCamp);
    } catch (err: any) {
      console.error('Campaign generation failed:', err);
      setGlobalError(err.message || 'An error occurred during campaign generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick Polish Worker (gemini-3.1-flash-lite)
  const handleQuickPolish = async (platform: PlatformType, action: string) => {
    const currentText =
      platform === 'linkedin'
        ? linkedinText
        : platform === 'twitter'
        ? twitterText
        : instagramText;

    setPolishingPlatform(platform);
    try {
      const res = await fetch('/api/quick-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          action,
          platform,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Quick polish failed');

      if (platform === 'linkedin') setLinkedinText(data.revisedText);
      if (platform === 'twitter') setTwitterText(data.revisedText);
      if (platform === 'instagram') setInstagramText(data.revisedText);
    } catch (err: any) {
      alert(`Polish failed: ${err.message}`);
    } finally {
      setPolishingPlatform(null);
    }
  };

  // Deep Viral Audit (gemini-4-carbon)
  const handleOpenAnalysis = async (platformTitle: string, content: string) => {
    setAnalysisModal({
      isOpen: true,
      platform: platformTitle,
      analysis: null,
      isLoading: true,
    });

    try {
      const res = await fetch('/api/analyze-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platformTitle,
          content,
          idea,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      setAnalysisModal((prev) => ({
        ...prev,
        analysis: data.analysis,
        isLoading: false,
      }));
    } catch (err: any) {
      console.error('Audit failed:', err);
      setAnalysisModal((prev) => ({
        ...prev,
        isLoading: false,
      }));
      alert(`Audit failed: ${err.message}`);
    }
  };

  // Creative Remix (gemini-4-argon)
  const handleOpenRemix = (platformTitle: string, content: string) => {
    setRemixModal({
      isOpen: true,
      platform: platformTitle,
      originalText: content,
    });
  };

  // Copy full campaign markdown bundle
  const handleCopyAll = async () => {
    const bundle = `# ${campaignData?.summaryHeadline || 'Social Media Campaign'}\nIdea: ${idea}\nTone: ${tone}\n\n====================\n💼 LINKEDIN POST:\n====================\n${linkedinText}\n\n====================\n🐦 TWITTER / X POST:\n====================\n${twitterText}\n\n====================\n📸 INSTAGRAM CAPTION:\n====================\n${instagramText}\n`;
    try {
      await navigator.clipboard.writeText(bundle);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Download full campaign markdown file
  const handleDownloadBundle = () => {
    const bundle = `# ${campaignData?.summaryHeadline || 'Social Media Campaign'}\nGenerated via OmniPost AI Studio\nDate: ${new Date().toLocaleString()}\nIdea: ${idea}\nTone: ${tone}\n\n--------------------\n## 💼 LINKEDIN POST (Optimal Aspect Ratio: ${visuals.linkedin.aspectRatio})\n--------------------\n${linkedinText}\n\nVisual Prompt: ${visuals.linkedin.prompt}\n\n--------------------\n## 🐦 TWITTER / X POST (Optimal Aspect Ratio: ${visuals.twitter.aspectRatio})\n--------------------\n${twitterText}\n\nVisual Prompt: ${visuals.twitter.prompt}\n\n--------------------\n## 📸 INSTAGRAM POST (Optimal Aspect Ratio: ${visuals.instagram.aspectRatio})\n--------------------\n${instagramText}\n\nVisual Prompt: ${visuals.instagram.prompt}\n`;

    const blob = new Blob([bundle], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `omnipost-campaign-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans bg-mesh-glow selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedCampaigns.length}
      />

      {/* Hero & Subhead */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cross-Platform Social Studio & Aspect-Ratio Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            One Idea.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-pink-500 bg-clip-text text-transparent">
              Three Perfectly Tailored Channels.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Input an idea, pick your tone, and instantly receive long-form thought-leadership for LinkedIn, punchy viral tweets for Twitter/X, and aesthetic visual storytelling for Instagram—each accompanied by unique visuals crafted in optimal aspect ratios.
          </p>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="text-xs text-rose-300 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input & Visual Config Studio */}
        <IdeaInputSection
          idea={idea}
          setIdea={setIdea}
          tone={tone}
          setTone={setTone}
          customTone={customTone}
          setCustomTone={setCustomTone}
          imageSize={imageSize}
          setImageSize={setImageSize}
          imageModel={imageModel}
          setImageModel={setImageModel}
          imageStyle={imageStyle}
          setImageStyle={setImageStyle}
          linkedinRatio={linkedinRatio}
          setLinkedinRatio={setLinkedinRatio}
          twitterRatio={twitterRatio}
          setTwitterRatio={setTwitterRatio}
          instagramRatio={instagramRatio}
          setInstagramRatio={setInstagramRatio}
          onGenerate={handleGenerateCampaign}
          isGenerating={isGenerating}
          onSelectPrompt={(sparkText) => setIdea(sparkText)}
        />

        {/* Generated Campaign Showcase */}
        {campaignData ? (
          <div className="space-y-6 pt-4 animate-fade-in">
            {/* Campaign Headline & Batch Export Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base sm:text-lg">
                    {campaignData.summaryHeadline || 'Generated Cross-Platform Campaign'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tone: <span className="capitalize font-semibold text-slate-300">{tone === 'custom' ? customTone : tone}</span> • Generated with Gemini 3.8 Flash, Gemini 3 Pro / Nano Banana
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={handleCopyAll}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'All Copied!' : 'Copy All 3 Posts'}</span>
                </button>

                <button
                  onClick={handleDownloadBundle}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>Export Campaign (.md)</span>
                </button>
              </div>
            </div>

            {/* 3-Platform Studio Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* 1. LinkedIn Card */}
              <PlatformCard
                platform="linkedin"
                title="LinkedIn"
                subtitle="Long-Form Thought Leadership"
                accentColor="blue"
                rawContentText={linkedinText}
                onUpdateContentText={setLinkedinText}
                postData={campaignData.linkedin}
                visualUrl={visuals.linkedin.imageUrl}
                visualPrompt={visuals.linkedin.prompt}
                onUpdatePrompt={(p) =>
                  setVisuals((prev) => ({
                    ...prev,
                    linkedin: { ...prev.linkedin, prompt: p },
                  }))
                }
                aspectRatio={visuals.linkedin.aspectRatio}
                onChangeAspectRatio={(r) => {
                  setLinkedinRatio(r);
                  setVisuals((prev) => ({
                    ...prev,
                    linkedin: { ...prev.linkedin, aspectRatio: r },
                  }));
                }}
                imageSize={visuals.linkedin.imageSize}
                onChangeImageSize={(s) =>
                  setVisuals((prev) => ({
                    ...prev,
                    linkedin: { ...prev.linkedin, imageSize: s },
                  }))
                }
                imageModel={visuals.linkedin.model}
                onChangeImageModel={(m) =>
                  setVisuals((prev) => ({
                    ...prev,
                    linkedin: { ...prev.linkedin, model: m },
                  }))
                }
                isGeneratingImage={visuals.linkedin.isLoading}
                onRegenerateImage={() =>
                  generatePlatformImage(
                    'linkedin',
                    visuals.linkedin.prompt || campaignData.linkedin.suggestedImagePrompt,
                    visuals.linkedin.aspectRatio,
                    visuals.linkedin.imageSize,
                    visuals.linkedin.model,
                    imageStyle
                  )
                }
                onOpenLightbox={() =>
                  setLightboxModal({
                    isOpen: true,
                    imageUrl: visuals.linkedin.imageUrl,
                    prompt: visuals.linkedin.prompt,
                    platform: 'LinkedIn',
                    aspectRatio: visuals.linkedin.aspectRatio,
                    imageSize: visuals.linkedin.imageSize,
                    model: visuals.linkedin.model,
                  })
                }
                onOpenAnalysis={handleOpenAnalysis}
                onOpenRemix={handleOpenRemix}
                onQuickPolish={(act) => handleQuickPolish('linkedin', act)}
                isPolishing={polishingPlatform === 'linkedin'}
              />

              {/* 2. Twitter / X Card */}
              <PlatformCard
                platform="twitter"
                title="Twitter / X"
                subtitle="Short, Punchy & Threaded"
                accentColor="sky"
                rawContentText={twitterText}
                onUpdateContentText={setTwitterText}
                postData={campaignData.twitter}
                visualUrl={visuals.twitter.imageUrl}
                visualPrompt={visuals.twitter.prompt}
                onUpdatePrompt={(p) =>
                  setVisuals((prev) => ({
                    ...prev,
                    twitter: { ...prev.twitter, prompt: p },
                  }))
                }
                aspectRatio={visuals.twitter.aspectRatio}
                onChangeAspectRatio={(r) => {
                  setTwitterRatio(r);
                  setVisuals((prev) => ({
                    ...prev,
                    twitter: { ...prev.twitter, aspectRatio: r },
                  }));
                }}
                imageSize={visuals.twitter.imageSize}
                onChangeImageSize={(s) =>
                  setVisuals((prev) => ({
                    ...prev,
                    twitter: { ...prev.twitter, imageSize: s },
                  }))
                }
                imageModel={visuals.twitter.model}
                onChangeImageModel={(m) =>
                  setVisuals((prev) => ({
                    ...prev,
                    twitter: { ...prev.twitter, model: m },
                  }))
                }
                isGeneratingImage={visuals.twitter.isLoading}
                onRegenerateImage={() =>
                  generatePlatformImage(
                    'twitter',
                    visuals.twitter.prompt || campaignData.twitter.suggestedImagePrompt,
                    visuals.twitter.aspectRatio,
                    visuals.twitter.imageSize,
                    visuals.twitter.model,
                    imageStyle
                  )
                }
                onOpenLightbox={() =>
                  setLightboxModal({
                    isOpen: true,
                    imageUrl: visuals.twitter.imageUrl,
                    prompt: visuals.twitter.prompt,
                    platform: 'Twitter / X',
                    aspectRatio: visuals.twitter.aspectRatio,
                    imageSize: visuals.twitter.imageSize,
                    model: visuals.twitter.model,
                  })
                }
                onOpenAnalysis={handleOpenAnalysis}
                onOpenRemix={handleOpenRemix}
                onQuickPolish={(act) => handleQuickPolish('twitter', act)}
                isPolishing={polishingPlatform === 'twitter'}
              />

              {/* 3. Instagram Card */}
              <PlatformCard
                platform="instagram"
                title="Instagram"
                subtitle="Visual-First Story & Hashtags"
                accentColor="pink"
                rawContentText={instagramText}
                onUpdateContentText={setInstagramText}
                postData={campaignData.instagram}
                visualUrl={visuals.instagram.imageUrl}
                visualPrompt={visuals.instagram.prompt}
                onUpdatePrompt={(p) =>
                  setVisuals((prev) => ({
                    ...prev,
                    instagram: { ...prev.instagram, prompt: p },
                  }))
                }
                aspectRatio={visuals.instagram.aspectRatio}
                onChangeAspectRatio={(r) => {
                  setInstagramRatio(r);
                  setVisuals((prev) => ({
                    ...prev,
                    instagram: { ...prev.instagram, aspectRatio: r },
                  }));
                }}
                imageSize={visuals.instagram.imageSize}
                onChangeImageSize={(s) =>
                  setVisuals((prev) => ({
                    ...prev,
                    instagram: { ...prev.instagram, imageSize: s },
                  }))
                }
                imageModel={visuals.instagram.model}
                onChangeImageModel={(m) =>
                  setVisuals((prev) => ({
                    ...prev,
                    instagram: { ...prev.instagram, model: m },
                  }))
                }
                isGeneratingImage={visuals.instagram.isLoading}
                onRegenerateImage={() =>
                  generatePlatformImage(
                    'instagram',
                    visuals.instagram.prompt || campaignData.instagram.suggestedImagePrompt,
                    visuals.instagram.aspectRatio,
                    visuals.instagram.imageSize,
                    visuals.instagram.model,
                    imageStyle
                  )
                }
                onOpenLightbox={() =>
                  setLightboxModal({
                    isOpen: true,
                    imageUrl: visuals.instagram.imageUrl,
                    prompt: visuals.instagram.prompt,
                    platform: 'Instagram',
                    aspectRatio: visuals.instagram.aspectRatio,
                    imageSize: visuals.instagram.imageSize,
                    model: visuals.instagram.model,
                  })
                }
                onOpenAnalysis={handleOpenAnalysis}
                onOpenRemix={handleOpenRemix}
                onQuickPolish={(act) => handleQuickPolish('instagram', act)}
                isPolishing={polishingPlatform === 'instagram'}
              />
            </div>
          </div>
        ) : (
          /* Empty State / Feature Highlights */
          <div className="py-14 border border-dashed border-slate-800 rounded-3xl p-8 text-center max-w-4xl mx-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-200">
                Ready to generate your synchronized cross-platform campaign?
              </h3>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Type an idea above or pick an inspiration spark, select your tone, and generate 3 custom posts with studio visuals tailored to each platform's optimal aspect ratio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-blue-400 font-bold text-sm block mb-1">💼 LinkedIn Master</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Scroll-stopping hook, body insights with clean line-breaks, key takeaways, and a 16:9 widescreen or 4:3 slide visual.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-sky-400 font-bold text-sm block mb-1">🐦 Twitter / X Punch</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sub-280 character viral tweet, optional thread expansion breakdown, and high-contrast 16:9 timeline visual.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-pink-400 font-bold text-sm block mb-1">📸 Instagram Carousel</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aesthetic first-line hook, storytelling body, categorized hashtag clusters, and 1:1 or 4:5 visual artwork.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Intelligence Modals */}
      <AnalysisModal
        isOpen={analysisModal.isOpen}
        onClose={() => setAnalysisModal((prev) => ({ ...prev, isOpen: false }))}
        analysis={analysisModal.analysis}
        platform={analysisModal.platform}
        isLoading={analysisModal.isLoading}
        onApplyHook={(hook) => {
          if (analysisModal.platform.toLowerCase().includes('linkedin')) {
            setLinkedinText((prev) => `${hook}\n\n${prev.split('\n\n').slice(1).join('\n\n')}`);
          } else if (analysisModal.platform.toLowerCase().includes('twitter')) {
            setTwitterText((prev) => `${hook} ${prev.split(' ').slice(4).join(' ')}`);
          } else {
            setInstagramText((prev) => `${hook}\n\n${prev.split('\n\n').slice(1).join('\n\n')}`);
          }
        }}
      />

      <RemixModal
        isOpen={remixModal.isOpen}
        onClose={() => setRemixModal((prev) => ({ ...prev, isOpen: false }))}
        platform={remixModal.platform}
        originalText={remixModal.originalText}
        onApplyRemix={(remixed) => {
          if (remixModal.platform.toLowerCase().includes('linkedin')) {
            setLinkedinText(remixed);
          } else if (remixModal.platform.toLowerCase().includes('twitter')) {
            setTwitterText(remixed);
          } else {
            setInstagramText(remixed);
          }
        }}
      />

      <ImageLightboxModal
        isOpen={lightboxModal.isOpen}
        onClose={() => setLightboxModal((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={lightboxModal.imageUrl}
        prompt={lightboxModal.prompt}
        platform={lightboxModal.platform}
        aspectRatio={lightboxModal.aspectRatio}
        imageSize={lightboxModal.imageSize}
        model={lightboxModal.model}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={(pIdea, pTone) => {
          setIdea(pIdea);
          setTone(pTone);
        }}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedCampaigns={savedCampaigns}
        onRestoreCampaign={(camp) => {
          setIdea(camp.idea);
          setCampaignData(camp.data);
          setLinkedinText(formatLinkedInText(camp.data.linkedin));
          setTwitterText(formatTwitterText(camp.data.twitter));
          setInstagramText(formatInstagramText(camp.data.instagram));
        }}
        onDeleteCampaign={(id) => {
          setSavedCampaigns((prev) => {
            const updated = prev.filter((c) => c.id !== id);
            localStorage.setItem('omnipost_saved_campaigns', JSON.stringify(updated));
            return updated;
          });
        }}
        onClearAll={() => {
          setSavedCampaigns([]);
          localStorage.removeItem('omnipost_saved_campaigns');
        }}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>OmniPost AI Studio • Powered by Gemini Models (@google/genai)</span>
          <span className="flex items-center gap-2">
            <span>gemini-3.8-flash</span>
            <span>•</span>
            <span>gemini-3-pro-image-preview</span>
            <span>•</span>
            <span>gemini-4-carbon</span>
            <span>•</span>
            <span>gemini-4-argon</span>
            <span>•</span>
            <span>gemini-3.1-flash-lite</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
