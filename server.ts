import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));

// Shared Gemini Client with required User-Agent
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Unified Cross-Platform Content Generation (gemini-3.8-flash)
app.post('/api/generate-content', async (req, res) => {
  try {
    const { idea, tone, customTone, brandVoice, targetAudience } = req.body;

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a content idea or topic.' });
    }

    const ai = getGeminiClient();
    const effectiveTone = tone === 'custom' && customTone ? customTone : (tone || 'professional');

    const prompt = `You are a world-class social media strategist and viral copywriter.
Generate 3 distinct, high-performing drafted posts based on this idea:
Idea / Topic: "${idea.trim()}"
Tone: ${effectiveTone}
${brandVoice ? `Brand Voice Guidelines: ${brandVoice}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Strict Platform Specifications:
1. LinkedIn Post (Long-form thought leadership):
   - Hook: Scroll-stopping 1-2 punchy opening lines that spark curiosity or state a non-obvious contrarian truth.
   - Body: Well-structured narrative with clean line spacing, short readable paragraphs, and 3-5 crisp bullet points or numbered takeaways.
   - Actionable Takeaway: Clear conclusion or framework.
   - Call to Action: Engaging conversation-starter question inviting insightful comments.
   - Hashtags: 3 to 5 targeted professional hashtags.
   - Visual Prompt: Detailed, studio-level creative art prompt for an optimal 16:9 banner or 4:3 slide graphic illustrating this concept without generic stock photo vibes.

2. Twitter/X Post (Short, punchy & viral):
   - Main Tweet: Under 260 characters! High-impact hook + bold assertion or takeaway + 1-2 high-relevance hashtags.
   - Thread Expansion: 3 follow-up tweet snippets providing nuance, data points, or step-by-step breakdown.
   - Visual Prompt: High-contrast, arresting visual concept formatted for 16:9 widescreen timeline cards.

3. Instagram Post (Visual-centric & aesthetic):
   - Caption Hook: Irresistible first line visible before the "...more" button.
   - Storytelling Body: Relatable, visually evocative caption with aesthetic emoji accents and whitespace.
   - Call to Action: Encourage saves, shares, or saves for reference ("Bookmark this for your next launch").
   - Hashtag Clusters: 15-20 categorized hashtags (split into niche, industry, and high-reach).
   - Carousel Concept: 4 concise slide concepts if published as a multi-slide carousel.
   - Visual Prompt: Photorealistic or bespoke modern 3D composition with lighting, colors, and textures tailored for a 1:1 square or 4:5 vertical feed post.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite multi-channel content director. Always respond with strict JSON strictly conforming to the requested schema. Ensure copy sounds human, sharp, engaging, and devoid of repetitive AI clichés.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaryHeadline: { type: Type.STRING, description: 'Campaign title or hook headline' },
            linkedin: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                body: { type: Type.STRING },
                actionableTakeaway: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedImagePrompt: { type: Type.STRING },
                estimatedReadTime: { type: Type.STRING },
              },
              required: ['hook', 'body', 'actionableTakeaway', 'callToAction', 'hashtags', 'suggestedImagePrompt'],
            },
            twitter: {
              type: Type.OBJECT,
              properties: {
                mainTweet: { type: Type.STRING },
                threadTweets: { type: Type.ARRAY, items: { type: Type.STRING } },
                hook: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedImagePrompt: { type: Type.STRING },
              },
              required: ['mainTweet', 'threadTweets', 'hook', 'hashtags', 'suggestedImagePrompt'],
            },
            instagram: {
              type: Type.OBJECT,
              properties: {
                captionHook: { type: Type.STRING },
                body: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                hashtags: {
                  type: Type.OBJECT,
                  properties: {
                    niche: { type: Type.ARRAY, items: { type: Type.STRING } },
                    industry: { type: Type.ARRAY, items: { type: Type.STRING } },
                    reach: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['niche', 'industry', 'reach'],
                },
                carouselSlides: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedImagePrompt: { type: Type.STRING },
              },
              required: ['captionHook', 'body', 'callToAction', 'hashtags', 'carouselSlides', 'suggestedImagePrompt'],
            },
          },
          required: ['summaryHeadline', 'linkedin', 'twitter', 'instagram'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating content:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate cross-platform content.',
    });
  }
});

// 2. High-Quality Image Generation (supports gemini-3-pro-image-preview & gemini-nano-banana-2.1)
// Affordance for aspect ratio (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9) and image size (1K, 2K, 4K)
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      platform,
      aspectRatio = '1:1',
      imageSize = '1K',
      model = 'gemini-3-pro-image-preview',
      stylePreset,
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }

    const ai = getGeminiClient();

    // Enforce valid aspect ratio from supported options
    const allowedRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9', '1:4', '1:8', '4:1', '8:1'];
    const validAspectRatio = allowedRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    // Enforce valid image size (1K, 2K, 4K)
    const allowedSizes = ['1K', '2K', '4K'];
    const validSize = allowedSizes.includes(imageSize) ? imageSize : '1K';

    // Model selection: allow gemini-3-pro-image-preview, gemini-nano-banana-2.1, gemini-3-pro-image
    let targetModel = model;
    if (model === 'gemini-3-pro-image-preview' || model === 'gemini-3-pro-image') {
      targetModel = 'gemini-3-pro-image';
    } else if (model === 'gemini-nano-banana-2.1') {
      targetModel = 'gemini-nano-banana-2.1';
    } else {
      targetModel = 'gemini-nano-banana-2.1';
    }

    // Enhance prompt with style preset if selected
    let enhancedPrompt = prompt.trim();
    if (stylePreset && stylePreset !== 'none') {
      const styles: Record<string, string> = {
        'minimal-3d': 'Clean modern 3D isometric render, soft studio illumination, premium matte clay & glass materials, elegant minimalist background, subtle depth of field',
        'editorial-photo': 'Award-winning editorial photography, 35mm portrait lens, authentic lighting, subtle film grain, natural tones, high aesthetic detail',
        'tech-gradient': 'Futuristic dark mode tech aesthetic, glowing neon accents, deep obsidian and electric indigo gradients, sleek corporate modernism',
        'cyberpunk-neon': 'Cinematic cyberpunk visual, hyper-detailed reflections, vibrant neon glow, atmospheric volumetric fog, high contrast drama',
        'vector-flat': 'Bold contemporary vector graphic illustration, refined color palette, clean geometric lines, flat art with stylish drop shadows',
        'cinematic': 'Wide anamorphic cinema frame, moody volumetric lighting, dramatic cinematic color grading, hyper-realistic depth and texture',
      };
      if (styles[stylePreset]) {
        enhancedPrompt = `${enhancedPrompt}. Style details: ${styles[stylePreset]}`;
      }
    }

    console.log(`Generating image with model: ${targetModel}, aspect: ${validAspectRatio}, size: ${validSize}`);

    const generateWithFallback = async (modelToUse: string) => {
      return await ai.models.generateContent({
        model: modelToUse,
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: validAspectRatio as any,
            imageSize: validSize as any,
          },
        },
      });
    };

    let response;
    let modelUsed = targetModel;
    try {
      response = await generateWithFallback(targetModel);
    } catch (primaryErr: any) {
      console.warn(`Primary model ${targetModel} error, trying gemini-nano-banana-2.1 or gemini-3-pro-image fallback:`, primaryErr?.message);
      const fallbackModel = targetModel === 'gemini-nano-banana-2.1' ? 'gemini-3-pro-image' : 'gemini-nano-banana-2.1';
      modelUsed = fallbackModel;
      response = await generateWithFallback(fallbackModel);
    }

    let imageUrl: string | null = null;
    let mimeType = 'image/png';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const base64Data = part.inlineData.data;
        mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${base64Data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'No image data returned from Gemini API. The prompt may have triggered a safety filter or model response issue.',
      });
    }

    return res.json({
      success: true,
      imageUrl,
      mimeType,
      aspectRatio: validAspectRatio,
      imageSize: validSize,
      modelUsed,
      enhancedPrompt,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      error: error.message || 'Image generation failed.',
    });
  }
});

// 3. Fast Edit & Polish (gemini-3.1-flash-lite)
// For tasks that should happen fast: instant grammar, punch up hook, trim under 280 chars
app.post('/api/quick-edit', async (req, res) => {
  try {
    const { text, action, platform } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for quick edit.' });
    }

    const ai = getGeminiClient();
    const actionPrompts: Record<string, string> = {
      'punch-hook': 'Make the opening hook 2x more punchy, scroll-stopping, and curiosity-inducing while maintaining credibility.',
      'shorten-twitter': 'Strictly condense this text to under 260 characters while keeping the main punchline and essential takeaway intact.',
      'bulletize': 'Transform the body into clean, crisp bullet points that are effortless to skim and read.',
      'fix-grammar': 'Polish the grammar, flow, and cadence without losing the original tone or voice.',
      'add-cta': 'Append a compelling, natural call-to-action that encourages comments and saves.',
    };

    const instruction = actionPrompts[action] || 'Improve and polish this post text for maximum engagement.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Platform: ${platform || 'General'}\nInstruction: ${instruction}\n\nOriginal Text:\n"""\n${text}\n"""\n\nReturn ONLY the revised text. Do not include commentary, explanations, or quotes.`,
    });

    return res.json({ success: true, revisedText: response.text?.trim() });
  } catch (error: any) {
    console.error('Error in quick-edit:', error);
    return res.status(500).json({ error: error.message || 'Quick edit failed.' });
  }
});

// 4. Interactive Creative Remix (gemini-4-argon)
// For complex interactive tasks: tone morphing, perspective shift, contrarian twist
app.post('/api/remix-post', async (req, res) => {
  try {
    const { text, platform, remixStyle, instructions } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required to remix.' });
    }

    const ai = getGeminiClient();
    const prompt = `You are a top-tier creative director and copywriter.
Platform: ${platform}
Desired Remix Angle: ${remixStyle || 'Creative overhaul'}
${instructions ? `User Specific Instructions: ${instructions}` : ''}

Original Text:
"""
${text}
"""

Rewrite this post completely tailored for ${platform}.
Make it exceptionally captivating, distinctive, and authentic.
Return ONLY the final rewritten post text ready to publish. No conversational preamble.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: prompt,
    });

    return res.json({ success: true, remixedText: response.text?.trim() });
  } catch (error: any) {
    console.error('Error in remix-post:', error);
    return res.status(500).json({ error: error.message || 'Remix failed.' });
  }
});

// 5. Deep Reasoning Analysis & Viral Scoring (gemini-4-carbon)
// Deep reasoning for hook strength, cognitive friction, retention rate, and alternative hooks
app.post('/api/analyze-post', async (req, res) => {
  try {
    const { platform, content, idea } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required for deep analysis.' });
    }

    const ai = getGeminiClient();
    const prompt = `Perform a deep reasoning viral audit on this ${platform} post draft.
Core Idea: "${idea || 'Not specified'}"

Post Content:
"""
${content}
"""

Evaluate across these dimensions:
1. Viral Hook Score (1-100) and Why
2. Retention & Read-through probability
3. Emotional Triggers & Psychological Hooks identified
4. Potential Blindspots or Clichés
5. 3 Alternative High-Impact Opening Hooks to A/B test
6. Estimated Audience Reaction`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-carbon',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Overall viral & engagement score between 1 and 100' },
            hookRating: { type: Type.STRING, description: 'E.g. Strong, S-Tier, Moderate, Needs Punch' },
            hookCritique: { type: Type.STRING },
            psychologicalTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            alternativeHooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  angle: { type: Type.STRING, description: 'E.g. Contrarian, Story-driven, Data-backed' },
                },
                required: ['hook', 'angle'],
              },
            },
          },
          required: ['score', 'hookRating', 'hookCritique', 'psychologicalTriggers', 'strengths', 'improvements', 'alternativeHooks'],
        },
      },
    });

    const analysis = JSON.parse(response.text || '{}');
    return res.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Error analyzing post:', error);
    return res.status(500).json({ error: error.message || 'Analysis failed.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Development vs Production serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
