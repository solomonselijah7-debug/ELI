import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Heart,
  Bookmark,
  MoreHorizontal,
  Share,
  BadgeCheck,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { LinkedInPost, TwitterPost, InstagramPost, AspectRatioType } from '../types';

interface MockupProps {
  image?: string;
  aspectRatio: AspectRatioType;
  onOpenImage?: () => void;
}

// Convert aspect ratio string to Tailwind style / aspect class
export const getAspectClass = (ratio: AspectRatioType): string => {
  switch (ratio) {
    case '1:1': return 'aspect-square';
    case '16:9': return 'aspect-video';
    case '4:3': return 'aspect-[4/3]';
    case '3:4': return 'aspect-[3/4]';
    case '9:16': return 'aspect-[9/16]';
    case '2:3': return 'aspect-[2/3]';
    case '3:2': return 'aspect-[3/2]';
    case '21:9': return 'aspect-[21/9]';
    default: return 'aspect-video';
  }
};

// 1. LinkedIn Mockup
export const LinkedInMockup: React.FC<MockupProps & { post: LinkedInPost }> = ({
  post,
  image,
  aspectRatio,
  onOpenImage,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-slate-100 shadow-xl max-w-xl mx-auto font-sans">
      {/* Header */}
      <div className="p-4 pb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow ring-2 ring-slate-800">
            AR
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                Alex Rivera
              </span>
              <span className="text-slate-400 text-xs">• 1st</span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">
              Building AI Systems • Ex-Founder • Tech Strategy
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              2h • Edited • 🌐
            </p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Text */}
      <div className="px-4 py-2 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
        <p className="font-semibold text-slate-100 text-sm mb-2">{post.hook}</p>
        
        <div className={expanded ? '' : 'line-clamp-4'}>
          <p className="text-slate-300">{post.body}</p>
          
          {post.actionableTakeaway && (
            <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
              <span className="font-bold text-blue-400 block mb-1">Key Takeaway:</span>
              <p className="text-slate-300">{post.actionableTakeaway}</p>
            </div>
          )}

          {post.callToAction && (
            <p className="mt-3 font-medium text-slate-200">{post.callToAction}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.hashtags?.map((tag, idx) => (
              <span key={idx} className="text-xs text-blue-400 font-semibold hover:underline cursor-pointer">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-slate-400 hover:text-blue-400 mt-2 block cursor-pointer"
        >
          {expanded ? '...see less' : '...see more'}
        </button>
      </div>

      {/* Visual Asset Container */}
      {image ? (
        <div className="relative group cursor-pointer overflow-hidden bg-slate-950 mt-2" onClick={onOpenImage}>
          <div className={`w-full ${getAspectClass(aspectRatio)} overflow-hidden flex items-center justify-center`}>
            <img
              src={image}
              alt="LinkedIn visual asset"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-700/60">
            {aspectRatio}
          </div>
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-lg">
              <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
            </span>
          </div>
        </div>
      ) : (
        <div className={`w-full ${getAspectClass(aspectRatio)} bg-slate-950/60 border-y border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500`}>
          <Sparkles className="w-8 h-8 text-blue-400/50 mb-2" />
          <p className="text-xs">LinkedIn Visual ({aspectRatio})</p>
        </div>
      )}

      {/* Stats Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80">
        <div className="flex items-center gap-1">
          <span className="flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px]">👍</span>
            <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[10px]">💡</span>
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px]">❤️</span>
          </span>
          <span className="ml-1 text-[11px]">{liked ? 143 : 142}</span>
        </div>
        <div className="text-[11px] space-x-2">
          <span>28 comments</span>
          <span>•</span>
          <span>14 reposts</span>
        </div>
      </div>

      {/* LinkedIn Actions */}
      <div className="px-2 py-1 flex items-center justify-between text-slate-400 text-xs">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 py-2 px-3 rounded hover:bg-slate-800/60 transition-colors cursor-pointer flex-1 justify-center ${
            liked ? 'text-blue-400 font-bold' : ''
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 py-2 px-3 rounded hover:bg-slate-800/60 transition-colors cursor-pointer flex-1 justify-center">
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 py-2 px-3 rounded hover:bg-slate-800/60 transition-colors cursor-pointer flex-1 justify-center">
          <Repeat2 className="w-4 h-4" />
          <span>Repost</span>
        </button>
        <button className="flex items-center gap-1.5 py-2 px-3 rounded hover:bg-slate-800/60 transition-colors cursor-pointer flex-1 justify-center">
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

// 2. Twitter / X Mockup
export const TwitterMockup: React.FC<MockupProps & { post: TwitterPost }> = ({
  post,
  image,
  aspectRatio,
  onOpenImage,
}) => {
  const [showThread, setShowThread] = useState(false);
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-slate-100 shadow-xl max-w-xl mx-auto font-sans">
      <div className="p-4">
        {/* Author Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
              AR
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                  Alex Rivera
                </span>
                <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                <span className="text-slate-400 text-xs">@alexrivera</span>
                <span className="text-slate-500 text-xs">· 42m</span>
              </div>
              <p className="text-[11px] text-slate-500">Tech & Systems</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Main Tweet Body */}
        <div className="mt-3 text-sm text-slate-100 leading-relaxed whitespace-pre-line">
          <p>{post.mainTweet}</p>
          {post.hashtags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.hashtags.map((tag, idx) => (
                <span key={idx} className="text-sky-400 hover:underline cursor-pointer text-xs">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Visual Media Container */}
        {image && (
          <div
            className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative group cursor-pointer"
            onClick={onOpenImage}
          >
            <div className={`w-full ${getAspectClass(aspectRatio)} overflow-hidden flex items-center justify-center`}>
              <img
                src={image}
                alt="Twitter card visual"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-700/60">
              {aspectRatio}
            </div>
          </div>
        )}

        {/* Tweet Metrics and Actions */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs px-1">
          <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>24</span>
          </button>

          <button
            onClick={() => setRetweeted(!retweeted)}
            className={`flex items-center gap-1.5 hover:text-emerald-400 transition-colors ${
              retweeted ? 'text-emerald-400' : ''
            }`}
          >
            <Repeat2 className="w-4 h-4" />
            <span>{retweeted ? 89 : 88}</span>
          </button>

          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 hover:text-pink-500 transition-colors ${
              liked ? 'text-pink-500 fill-pink-500' : ''
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{liked ? 413 : 412}</span>
          </button>

          <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
            <Bookmark className="w-4 h-4" />
            <span>67</span>
          </button>

          <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
            <Share className="w-4 h-4" />
          </button>
        </div>

        {/* Thread expansion affordance */}
        {post.threadTweets && post.threadTweets.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => setShowThread(!showThread)}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-sky-400 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{showThread ? 'Collapse Thread' : `View Full Thread (${post.threadTweets.length + 1} tweets)`}</span>
            </button>

            {showThread && (
              <div className="mt-3 space-y-3 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {post.threadTweets.map((tweet, i) => (
                  <div key={i} className="pl-9 relative">
                    <div className="absolute left-3.5 top-1.5 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-slate-900" />
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                      <span className="font-bold text-slate-400 block mb-1">Tweet {i + 2}/{post.threadTweets.length + 1}:</span>
                      {tweet}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Instagram Mockup
export const InstagramMockup: React.FC<MockupProps & { post: InstagramPost }> = ({
  post,
  image,
  aspectRatio,
  onOpenImage,
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-slate-100 shadow-xl max-w-xl mx-auto font-sans">
      {/* IG Header */}
      <div className="p-3 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          {/* Gradient Story Ring */}
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600">
            <div className="p-[1.5px] rounded-full bg-slate-900">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                AR
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs text-white">alexrivera.tech</span>
              <span className="text-[10px] text-pink-400 font-semibold">• Follow</span>
            </div>
            <p className="text-[10px] text-slate-400">Audio / Original Audio</p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white p-1">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Visual in Optimal Container */}
      {image ? (
        <div className="relative group cursor-pointer bg-slate-950" onClick={onOpenImage}>
          <div className={`w-full ${getAspectClass(aspectRatio)} overflow-hidden flex items-center justify-center`}>
            <img
              src={image}
              alt="Instagram visual post"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>
          <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-300 border border-slate-700/60">
            {aspectRatio}
          </div>
        </div>
      ) : (
        <div className={`w-full ${getAspectClass(aspectRatio)} bg-slate-950/70 flex flex-col items-center justify-center p-6 text-center text-slate-500`}>
          <Sparkles className="w-8 h-8 text-pink-400/50 mb-2" />
          <p className="text-xs">Instagram Visual Asset ({aspectRatio})</p>
        </div>
      )}

      {/* Action Bar */}
      <div className="p-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-slate-200">
            <button
              onClick={() => setLiked(!liked)}
              className={`transition-colors cursor-pointer ${liked ? 'text-pink-500' : 'hover:text-pink-400'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button className="hover:text-slate-400 cursor-pointer">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="hover:text-slate-400 cursor-pointer">
              <Send className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setSaved(!saved)}
            className={`transition-colors cursor-pointer ${saved ? 'text-amber-400' : 'hover:text-slate-400'}`}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Likes */}
        <p className="text-xs font-bold text-slate-200 mb-1">
          {liked ? '1,843 likes' : '1,842 likes'}
        </p>

        {/* Caption */}
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white mr-1.5">alexrivera.tech</span>
          <span className="font-medium text-slate-200">{post.captionHook}</span>

          <div className={showMore ? 'mt-2 space-y-2' : 'hidden'}>
            <p className="whitespace-pre-line text-slate-300">{post.body}</p>
            {post.callToAction && (
              <p className="font-semibold text-slate-200 pt-1">{post.callToAction}</p>
            )}

            {/* Categorized Hashtags */}
            <div className="pt-2 space-y-1">
              {post.hashtags?.niche?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.niche.map((tag, i) => (
                    <span key={i} className="text-pink-400 hover:underline cursor-pointer">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              )}
              {post.hashtags?.industry?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.industry.map((tag, i) => (
                    <span key={i} className="text-slate-400 hover:underline cursor-pointer">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowMore(!showMore)}
            className="text-slate-500 hover:text-slate-400 font-semibold ml-1 cursor-pointer"
          >
            {showMore ? 'less' : '... more'}
          </button>
        </div>

        {/* Carousel slide ideas preview */}
        {post.carouselSlides && post.carouselSlides.length > 0 && (
          <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px]">
            <span className="font-bold text-pink-400 block mb-1">📸 Carousel Slide Breakdown:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
              {post.carouselSlides.map((slide, idx) => (
                <li key={idx}>Slide {idx + 1}: {slide}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-2 text-[10px] text-slate-500 uppercase tracking-wider">
          3 hours ago
        </div>
      </div>
    </div>
  );
};
