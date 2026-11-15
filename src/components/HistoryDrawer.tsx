import React from 'react';
import { X, Trash2, Clock, ArrowRight, Download, Layers } from 'lucide-react';
import { SavedCampaign } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCampaigns: SavedCampaign[];
  onRestoreCampaign: (campaign: SavedCampaign) => void;
  onDeleteCampaign: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedCampaigns,
  onRestoreCampaign,
  onDeleteCampaign,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-100">Campaign History</h3>
            <span className="text-xs px-2 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {savedCampaigns.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {savedCampaigns.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedCampaigns.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No saved campaigns yet.</p>
              <p className="mt-1">Generated campaigns are automatically cached here.</p>
            </div>
          ) : (
            savedCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>{new Date(camp.timestamp).toLocaleString()}</span>
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {camp.tone}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-2">
                    {camp.headline || camp.idea}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {camp.idea}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <button
                    onClick={() => onDeleteCampaign(camp.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onRestoreCampaign(camp);
                      onClose();
                    }}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Load Campaign</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
