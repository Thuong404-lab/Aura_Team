import React, { useState, useMemo } from 'react';
import { SavedLookbookItem } from './LookbookScreen';
import {
  Bookmark,
  Trash2,
  ArrowRight,
  X,
  Calendar,
  Crown,
  Search,
  Clock,
  Tag,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface SavedLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedLookbookItem[];
  onDelete: (id: string) => void;
  onLoadItem: (item: SavedLookbookItem) => void;
}

function getItemTimestamp(item: SavedLookbookItem): number {
  if (item.timestamp && item.timestamp > 0) return item.timestamp;
  try {
    const parts = item.date.split('/');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      return d.getTime();
    }
  } catch {
    // fallback
  }
  return 0;
}

function getItemCategory(item: SavedLookbookItem): string {
  if (item.category && item.category !== 'all') return item.category;
  if (item.era) return item.era;
  const name = (item.topName || '').toLowerCase();
  if (name.includes('nhật bình') || name.includes('ngũ thân') || name.includes('áo tấc') || name.includes('tấc')) {
    return 'Triều Nguyễn';
  }
  if (name.includes('đối khâm')) {
    return 'Thời Lê';
  }
  if (name.includes('giao lĩnh') || name.includes('viên lĩnh')) {
    return 'Thời Lý - Trần';
  }
  if (name.includes('tứ thân') || name.includes('bà ba') || name.includes('yếm')) {
    return 'Dân Gian';
  }
  if (name.includes('cách tân') || name.includes('hiện đại')) {
    return 'Cách Tân';
  }
  return 'Triều Nguyễn';
}

export const SavedLibraryModal: React.FC<SavedLibraryModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  onDelete,
  onLoadItem,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_score'>('newest');

  const categoryOptions = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Triều Nguyễn', label: 'Triều Nguyễn' },
    { id: 'Thời Lê', label: 'Thời Lê' },
    { id: 'Thời Lý - Trần', label: 'Thời Lý - Trần' },
    { id: 'Dân Gian', label: 'Dân Gian' },
    { id: 'Cách Tân', label: 'Cách Tân' },
  ];

  const timeOptions = [
    { id: 'all', label: 'Toàn bộ thời gian' },
    { id: 'today', label: 'Hôm nay' },
    { id: 'week', label: '7 ngày qua' },
    { id: 'month', label: 'Tháng này' },
  ];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: savedItems.length };
    categoryOptions.forEach((opt) => {
      if (opt.id !== 'all') counts[opt.id] = 0;
    });
    savedItems.forEach((item) => {
      const cat = getItemCategory(item);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [savedItems]);

  const timeCounts = useMemo(() => {
    const now = Date.now();
    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;
    savedItems.forEach((item) => {
      const t = getItemTimestamp(item);
      if (t > 0) {
        const diff = now - t;
        const itemDate = new Date(t);
        const nowDate = new Date(now);
        if (
          itemDate.getDate() === nowDate.getDate() &&
          itemDate.getMonth() === nowDate.getMonth() &&
          itemDate.getFullYear() === nowDate.getFullYear()
        ) {
          todayCount++;
        }
        if (diff <= 7 * 24 * 60 * 60 * 1000) weekCount++;
        if (diff <= 30 * 24 * 60 * 60 * 1000) monthCount++;
      }
    });
    return { all: savedItems.length, today: todayCount, week: weekCount, month: monthCount };
  }, [savedItems]);

  const filteredItems = useMemo(() => {
    const now = Date.now();
    return savedItems
      .filter((item) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (item.title || '').toLowerCase().includes(q);
          const matchTop = (item.topName || '').toLowerCase().includes(q);
          const matchBottom = (item.bottomName || '').toLowerCase().includes(q);
          const matchAcc = (item.accessoryName || '').toLowerCase().includes(q);
          const matchBackdrop = (item.backdropName || '').toLowerCase().includes(q);
          if (!matchTitle && !matchTop && !matchBottom && !matchAcc && !matchBackdrop) {
            return false;
          }
        }

        if (categoryFilter !== 'all') {
          const cat = getItemCategory(item);
          if (cat !== categoryFilter) {
            return false;
          }
        }

        if (timeFilter !== 'all') {
          const itemTime = getItemTimestamp(item);
          if (itemTime > 0) {
            const diffMs = now - itemTime;
            if (timeFilter === 'today') {
              const itemDate = new Date(itemTime);
              const nowDate = new Date(now);
              if (
                itemDate.getDate() !== nowDate.getDate() ||
                itemDate.getMonth() !== nowDate.getMonth() ||
                itemDate.getFullYear() !== nowDate.getFullYear()
              ) {
                return false;
              }
            } else if (timeFilter === 'week') {
              if (diffMs > 7 * 24 * 60 * 60 * 1000) return false;
            } else if (timeFilter === 'month') {
              if (diffMs > 30 * 24 * 60 * 60 * 1000) return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest_score') {
          return b.score - a.score;
        }
        const timeA = getItemTimestamp(a);
        const timeB = getItemTimestamp(b);
        if (sortBy === 'oldest') {
          return timeA - timeB;
        }
        return timeB - timeA;
      });
  }, [savedItems, searchQuery, categoryFilter, timeFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'all' ||
    timeFilter !== 'all' ||
    sortBy !== 'newest';

  const handleResetFilters = () => {
    soundEngine.playPluck(440);
    setSearchQuery('');
    setCategoryFilter('all');
    setTimeFilter('all');
    setSortBy('newest');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-[#0E1526] text-slate-100 p-5 sm:p-6 shadow-2xl border border-amber-500/30 flex flex-col justify-between overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-xs">
              <Bookmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-serif-vi text-xl font-bold text-amber-300 flex items-center gap-2">
                <span>Thư Viện Lookbook Đã Lưu</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-sans-vi font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {savedItems.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Lọc theo danh mục triều đại hoặc thời gian lưu trữ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Area */}
        <div className="pt-3 pb-2 space-y-3 border-b border-slate-800/80">
          {/* Row 1: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên áo, bối cảnh, phụ kiện..."
                className="w-full bg-[#131C2E] border border-slate-700/70 focus:border-amber-400/80 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 bg-[#131C2E] border border-slate-700/70 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] text-slate-400 hidden sm:inline">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-amber-300 font-semibold focus:outline-none text-xs cursor-pointer"
              >
                <option value="newest" className="bg-[#0E1526] text-slate-200">
                  Mới nhất trước
                </option>
                <option value="oldest" className="bg-[#0E1526] text-slate-200">
                  Cũ nhất trước
                </option>
                <option value="highest_score" className="bg-[#0E1526] text-slate-200">
                  Điểm cao nhất
                </option>
              </select>
            </div>
          </div>

          {/* Row 2: Categories */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1 text-amber-400/90 uppercase tracking-wider">
                <Tag className="w-3 h-3 text-amber-400" /> Danh mục / Triều đại:
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-normal text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" /> Đặt lại bộ lọc
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {categoryOptions.map((cat) => {
                const isSelected = categoryFilter === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategoryFilter(cat.id);
                      soundEngine.playPluck(440);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap font-medium transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-400/70 shadow-xs'
                        : 'bg-[#131C2E] text-slate-400 hover:text-slate-200 border border-slate-700/60'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Time Filters */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-semibold uppercase tracking-wider">
              <Clock className="w-3 h-3 text-amber-400" /> Thời gian lưu:
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {timeOptions.map((timeOpt) => {
                const isSelected = timeFilter === timeOpt.id;
                const count = timeCounts[timeOpt.id as keyof typeof timeCounts] || 0;
                return (
                  <button
                    key={timeOpt.id}
                    onClick={() => {
                      setTimeFilter(timeOpt.id as any);
                      soundEngine.playPluck(493.88);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap font-medium transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-400/70 shadow-xs'
                        : 'bg-[#131C2E] text-slate-400 hover:text-slate-200 border border-slate-700/60'
                    }`}
                  >
                    <span>{timeOpt.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* List of Saved Lookbooks */}
        <div className="my-3 overflow-y-auto flex-1 pr-1 space-y-2.5 custom-scrollbar min-h-[220px]">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 flex flex-col items-center justify-center">
              <Bookmark className="w-10 h-10 mb-2 opacity-30 text-amber-400" />
              <p className="font-serif-vi text-sm font-bold text-slate-200">
                Không tìm thấy bản phối nào phù hợp
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                {hasActiveFilters
                  ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn lại danh mục / thời gian.'
                  : 'Hãy vào màn hình Lookbook và nhấn "Lưu lại" để lưu bộ đồ vào đây nhé!'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-[#131C2E] hover:bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại bộ lọc</span>
                </button>
              )}
            </div>
          ) : (
            filteredItems.map((item) => {
              const itemCategory = getItemCategory(item);
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#131C2E] border border-slate-700/70 hover:border-amber-400/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-serif-vi font-bold text-sm sm:text-base text-slate-100">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {itemCategory}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5 text-emerald-400" />
                        {item.score} Điểm
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong className="text-amber-400 font-semibold">{item.topName}</strong> • {item.bottomName} • {item.accessoryName}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {item.date}
                      </span>
                      <span>• Bối cảnh: <strong className="text-slate-300 font-normal">{item.backdropName}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button
                      onClick={() => {
                        onLoadItem(item);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all flex items-center gap-1 shadow-md hover:brightness-105 cursor-pointer"
                    >
                      <span>Xem lại</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Hiển thị <strong className="text-amber-300">{filteredItems.length}</strong> / {savedItems.length} bản phối
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Đóng Thư Viện
          </button>
        </div>
      </div>
    </div>
  );
};
