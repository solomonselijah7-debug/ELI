export type PlatformType = 'linkedin' | 'twitter' | 'instagram';

export type AspectRatioType = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export type ImageSizeType = '1K' | '2K' | '4K';

export type ImageModelType = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export type ToneType = 'professional' | 'witty' | 'urgent' | 'inspirational' | 'data-driven' | 'custom';

export interface LinkedInPost {
  hook: string;
  body: string;
  actionableTakeaway: string;
  callToAction: string;
  hashtags: string[];
  suggestedImagePrompt: string;
  estimatedReadTime?: string;
}

export interface TwitterPost {
  mainTweet: string;
  threadTweets: string[];
  hook: string;
  hashtags: string[];
  suggestedImagePrompt: string;
}

export interface InstagramPost {
  captionHook: string;
  body: string;
  callToAction: string;
  hashtags: {
    niche: string[];
    industry: string[];
    reach: string[];
  };
  carouselSlides: string[];
  suggestedImagePrompt: string;
}

export interface GeneratedCampaignData {
  summaryHeadline: string;
  linkedin: LinkedInPost;
  twitter: TwitterPost;
  instagram: InstagramPost;
}

export interface PlatformVisualState {
  imageUrl?: string;
  aspectRatio: AspectRatioType;
  imageSize: ImageSizeType;
  model: ImageModelType;
  prompt: string;
  style: string;
  isLoading: boolean;
  error?: string;
}

export interface ViralAnalysis {
  score: number;
  hookRating: string;
  hookCritique: string;
  psychologicalTriggers: string[];
  strengths: string[];
  improvements: string[];
  alternativeHooks: {
    hook: string;
    angle: string;
  }[];
}

export interface SavedCampaign {
  id: string;
  timestamp: number;
  idea: string;
  tone: string;
  headline: string;
  data: GeneratedCampaignData;
  visuals: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}
