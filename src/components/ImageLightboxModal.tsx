import React from 'react';
import { X, Download, Copy, Check, Maximize2, Cpu } from 'lucide-react';
import { AspectRatioType, ImageSizeType } from '../types';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  prompt: string;
  platform: string;
  aspectRatio: AspectRatioType;
  imageSize: ImageSizeType;
  model: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  prompt,
  platform,
  aspectRatio,
  imageSize,
  model,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${platform.toLowerCase()}-visual-${aspectRatio.replace(':', 'x')}-${imageSize.toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-white capitalize">{platform} Visual Master</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono border border-slate-700">
              {aspectRatio}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {imageSize} Resolution
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Image</span>
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy Data URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center image canvas */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/90 min-h-[360px]">
          <img
            src={imageUrl}
            alt={prompt}
            className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
          />
        </div>

        {/* Prompt & Metadata footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Model: {model}
            </span>
            <span>Right-click or tap download to save high-fidelity file</span>
          </div>
          <p className="text-slate-300 line-clamp-2">
            <strong className="text-slate-200">Creative Prompt:</strong> {prompt}
          </p>
        </div>
      </div>
    </div>
  );
};
