import React from 'react';
import { SavedLookbookItem } from './LookbookScreen';
import { Bookmark, Trash2, ArrowRight, X, Calendar, Crown } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl max-h-[85vh] rounded-[36px] bg-white text-stone-900 p-6 shadow-2xl border border-stone-200 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#8B1E1E] text-white flex items-center justify-center shadow-sm">
              <Bookmark className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif-vi text-xl font-bold text-stone-900">
                Thư Viện Lookbook Đã Lưu
              </h3>
              <p className="text-xs text-stone-500">
                Các bản phối di sản trong bộ sưu tập cá nhân của bạn ({savedItems.length})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Saved Lookbooks */}
        <div className="my-4 overflow-y-auto flex-1 pr-1 space-y-3">
          {savedItems.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#D4AF37]" />
              <p className="font-serif-vi text-base font-bold text-stone-600">
                Chưa có bản phối nào được lưu
              </p>
              <p className="text-xs mt-1">
                Hãy vào màn hình Lookbook và nhấn &quot;Lưu lại&quot; để lưu bộ đồ vào đây nhé!
              </p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 hover:border-[#D4AF37] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif-vi font-bold text-base text-stone-900">
                      {item.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B1E1E] text-white flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5 text-[#D4AF37]" />
                      {item.score} Điểm
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    <strong className="text-[#8B1E1E]">{item.topName}</strong> + {item.bottomName} + {item.accessoryName}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.date}
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
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#8B1E1E] text-white hover:bg-black transition-all flex items-center gap-1"
                  >
                    <span>Xem lại</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all"
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
        <div className="pt-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
          >
            Đóng Thư Viện
          </button>
        </div>
      </div>
    </div>
  );
};
