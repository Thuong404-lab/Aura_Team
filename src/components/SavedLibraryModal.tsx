import React from 'react';
import { SavedLookbookItem } from './LookbookScreen';
import { Bookmark, Trash2, ArrowRight, X, Calendar, Crown } from 'lucide-react';
import { AuraLogo } from './VietnameseDecorativeElements';

interface SavedLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedLookbookItem[];
  onDelete: (id: string) => void;
  onLoadItem: (item: SavedLookbookItem) => void;
}

export const SavedLibraryModal: React.FC<SavedLibraryModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  onDelete,
  onLoadItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl max-h-[85vh] rounded-3xl bg-[#0E1526] text-slate-100 p-6 shadow-2xl border border-amber-500/30 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-xs">
              <Bookmark className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-left">
              <h3 className="font-serif-vi text-xl font-bold text-amber-300">
                Thư Viện Lookbook Đã Lưu
              </h3>
              <p className="text-xs text-slate-400">
                Các bản phối di sản trong bộ sưu tập cá nhân của bạn ({savedItems.length})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Saved Lookbooks */}
        <div className="my-4 overflow-y-auto flex-1 pr-1 space-y-3">
          {savedItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
              <p className="font-serif-vi text-base font-bold text-slate-300">
                Chưa có bản phối nào được lưu
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Hãy vào màn hình Lookbook và nhấn &quot;Lưu lại&quot; để lưu bộ đồ vào đây nhé!
              </p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#131C2E] border border-slate-700/70 hover:border-amber-400/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif-vi font-bold text-base text-slate-100">
                      {item.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5 text-amber-400" />
                      {item.score} Điểm
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong className="text-amber-400 font-medium">{item.topName}</strong> + {item.bottomName} + {item.accessoryName}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {item.date}
                    </span>
                    <span>• Bối cảnh: {item.backdropName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onLoadItem(item);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all flex items-center gap-1 shadow-md hover:brightness-105"
                  >
                    <span>Xem lại</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-700/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Đóng Thư Viện
          </button>
        </div>
      </div>
    </div>
  );
};
