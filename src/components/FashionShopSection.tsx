import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  Heart,
  Eye,
  Star,
  Check,
  ChevronDown,
  Scissors,
  ArrowRight,
} from 'lucide-react';
import { FASHION_PRODUCTS, FashionProduct } from '../data/fashionShopData';
import { soundEngine } from '../utils/audioSynth';
import { useAppTheme } from '../context/ThemeContext';

interface FashionShopSectionProps {
  onSelectProductDetails: (product: FashionProduct) => void;
  onAddToCart: (
    product: FashionProduct,
    size: string,
    color: { name: string; hex: string }
  ) => void;
  onTryInFittingRoom: (product: FashionProduct) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const FashionShopSection: React.FC<FashionShopSectionProps> = ({
  onSelectProductDetails,
  onAddToCart,
  onTryInFittingRoom,
  wishlistIds,
  onToggleWishlist,
}) => {
  const { theme } = useAppTheme();
  const isCream = theme === 'cream';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'top' | 'bottom' | 'accessory'>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return FASHION_PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Era filter
      if (selectedEra !== 'all' && p.era !== selectedEra) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesFabric = p.fabric.toLowerCase().includes(query);
        const matchesEra = p.era.toLowerCase().includes(query);
        const matchesDesc = p.summary.toLowerCase().includes(query);
        if (!matchesName && !matchesFabric && !matchesEra && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'featured' retains curated order
    });
  }, [searchQuery, selectedCategory, selectedEra, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: FashionProduct) => {
    e.stopPropagation();
    soundEngine.playPluck(659.25);
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || { name: 'Mặc định', hex: '#8B1E1E' };
    onAddToCart(product, defaultSize, defaultColor);

    setAddedItemNotice(`Đã thêm "${product.name}" vào giỏ hàng`);
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  const handleQuickTryOn = (e: React.MouseEvent, product: FashionProduct) => {
    e.stopPropagation();
    soundEngine.playPluck(587.33);
    onTryInFittingRoom(product);
  };

  return (
    <section id="fashion-shop-section" className="w-full py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Toast Notification when item added */}
      <AnimatePresence>
        {addedItemNotice && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0E1526] border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl shadow-black/80 flex items-center gap-2.5 text-xs font-medium"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{addedItemNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Boutique Cổ Phục Cao Cấp
        </div>

        <h2 className={`text-2xl sm:text-4xl font-serif-vi font-bold ${
          isCream
            ? 'text-stone-900'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300'
        }`}>
          Bộ Sưu Tập Cổ Phục & May Đo Hoàng Triều
        </h2>

        <p className={`text-xs sm:text-sm max-w-2xl mx-auto ${
          isCream ? 'text-stone-700' : 'text-slate-300'
        }`}>
          Mỗi thiết kế là một tác phẩm nghệ thuật gìn giữ hồn cốt nghìn năm. Trải nghiệm mua sắm tiện lợi hoặc thử đồ trực tiếp bằng công nghệ AI 2D.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className={`rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-md shadow-xl space-y-4 border ${
        isCream
          ? 'bg-white border-amber-200/90 shadow-[0_4px_24px_rgba(180,130,60,0.08)]'
          : 'bg-[#0C1220]/80 border-amber-500/20'
      }`}>
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isCream ? 'text-stone-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Tìm theo tên áo, gấm hoa, triều đại (Nhật Bình, Ngũ Thân, Tơ tằm...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-colors border ${
                isCream
                  ? 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-amber-400'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:border-amber-400'
              }`}
            />
          </div>

          {/* Sort & Era Dropdowns */}
          <div className="flex items-center gap-2.5">
            {/* Era Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedEra}
                onChange={(e) => {
                  soundEngine.playPluck(440);
                  setSelectedEra(e.target.value);
                }}
                className={`w-full appearance-none rounded-xl px-3.5 py-2.5 pr-8 text-xs outline-none cursor-pointer border ${
                  isCream
                    ? 'bg-stone-50 border-stone-200 text-stone-800 focus:border-amber-400'
                    : 'bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400'
                }`}
              >
                <option value="all">Tất cả triều đại</option>
                <option value="Triều Nguyễn">Triều Nguyễn (Cố Đô)</option>
                <option value="Thời Lê">Thời Hậu Lê</option>
                <option value="Thời Lý - Trần">Thời Lý - Trần</option>
                <option value="Cách Tân 2026">Cách Tân Đương Đại</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => {
                  soundEngine.playPluck(440);
                  setSortBy(e.target.value as any);
                }}
                className={`w-full appearance-none rounded-xl px-3.5 py-2.5 pr-8 text-xs outline-none cursor-pointer border ${
                  isCream
                    ? 'bg-stone-50 border-stone-200 text-stone-800 focus:border-amber-400'
                    : 'bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400'
                }`}
              >
                <option value="featured">Nổi bật nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              soundEngine.playPluck(440);
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? isCream
                  ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold shadow-xs'
                  : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : isCream
                ? 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            Tất Cả ({FASHION_PRODUCTS.length})
          </button>

          <button
            onClick={() => {
              soundEngine.playPluck(440);
              setSelectedCategory('top');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'top'
                ? isCream
                  ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold shadow-xs'
                  : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : isCream
                ? 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            Áo Thượng Y Cung Đình
          </button>

          <button
            onClick={() => {
              soundEngine.playPluck(440);
              setSelectedCategory('bottom');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'bottom'
                ? isCream
                  ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold shadow-xs'
                  : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : isCream
                ? 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            Chân Váy & Quần Lụa
          </button>

          <button
            onClick={() => {
              soundEngine.playPluck(440);
              setSelectedCategory('accessory');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'accessory'
                ? isCream
                  ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold shadow-xs'
                  : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : isCream
                ? 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            Phụ Kiện Hoàng Gia
          </button>

          {/* Active filter count / reset */}
          {(selectedCategory !== 'all' || selectedEra !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                soundEngine.playPluck(350);
                setSelectedCategory('all');
                setSelectedEra('all');
                setSearchQuery('');
              }}
              className="ml-auto text-xs text-amber-400 hover:underline whitespace-nowrap"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-[#0C1220]/50 rounded-2xl border border-slate-800 p-8 space-y-3">
          <p className="text-slate-300 text-sm">
            Không tìm thấy trang phục phù hợp với tiêu chí lọc.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedEra('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/30"
          >
            Xem toàn bộ trang phục
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((prod) => {
            const isWishlisted = wishlistIds.includes(prod.id);

            return (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelectProductDetails(prod)}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer border ${
                  isCream
                    ? 'bg-white border-amber-200/90 hover:border-amber-400 shadow-[0_4px_20px_rgba(180,130,60,0.08)] hover:shadow-[0_12px_36px_rgba(180,130,60,0.16)]'
                    : 'bg-[#0D1424] border-amber-500/20 hover:border-amber-400/60 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10'
                }`}
              >
                {/* Image Container with Editorial Look */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Top Status Tag */}
                  {prod.tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-bold tracking-wider rounded uppercase shadow-md">
                      {prod.tag}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(prod.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      isWishlisted
                        ? 'bg-red-500/90 text-white'
                        : 'bg-black/50 hover:bg-black/80 text-white/80 hover:text-red-400'
                    }`}
                    title="Lưu yêu thích"
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
                    />
                  </button>

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleQuickTryOn(e, prod)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-[#0A0E17]/90 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[11px] font-bold border border-amber-500/40 backdrop-blur-md flex items-center justify-center gap-1.5 shadow-lg transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Thử Đồ AI
                    </button>

                    <button
                      onClick={(e) => handleQuickAdd(e, prod)}
                      className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-all"
                      title="Thêm nhanh vào giỏ"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    {/* Era & Category Pill */}
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className={`font-semibold ${isCream ? 'text-amber-800' : 'text-amber-400/90'}`}>
                        {prod.era}
                      </span>
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span className={`ml-1 text-[11px] font-semibold ${isCream ? 'text-stone-800' : 'text-slate-200'}`}>
                          {prod.rating}
                        </span>
                      </div>
                    </div>

                    {/* Garment Title */}
                    <h3 className={`font-serif-vi font-bold text-sm leading-snug transition-colors ${
                      isCream ? 'text-stone-900 group-hover:text-amber-800' : 'text-slate-100 group-hover:text-amber-200'
                    }`}>
                      {prod.name}
                    </h3>

                    {/* Fabric description */}
                    <p className={`text-[11px] mt-0.5 leading-snug ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
                      {prod.fabric}
                    </p>
                  </div>

                  {/* Color Swatch Dots */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {prod.colors.map((c, i) => (
                      <span
                        key={i}
                        title={c.name}
                        className="w-2.5 h-2.5 rounded-full border border-black/30 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    <span className={`text-[10px] ml-1 ${isCream ? 'text-stone-500 font-medium' : 'text-slate-400'}`}>
                      {prod.sizes.length} cỡ size
                    </span>
                  </div>

                  {/* Price & CTA Row */}
                  <div className={`pt-2 border-t flex items-center justify-between ${isCream ? 'border-stone-200' : 'border-slate-800/80'}`}>
                    <div>
                      <div className={`font-serif-vi font-bold text-base ${isCream ? 'text-amber-900 font-bold' : 'text-amber-300'}`}>
                        {prod.price.toLocaleString('vi-VN')}₫
                      </div>
                      {prod.originalPrice && (
                        <div className={`text-[10px] line-through ${isCream ? 'text-stone-400' : 'text-slate-400'}`}>
                          {prod.originalPrice.toLocaleString('vi-VN')}₫
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(e, prod)}
                      className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCream
                          ? 'bg-amber-100 hover:bg-amber-400 text-amber-950 border-amber-300'
                          : 'bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-300 hover:text-slate-950'
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Mua
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Customer Trust & Craft Banner inside Shop */}
      <div className={`mt-14 p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
        isCream
          ? 'bg-gradient-to-r from-amber-50 via-white to-amber-100/70 border-amber-300/80 shadow-[0_8px_30px_rgba(180,130,60,0.08)]'
          : 'bg-gradient-to-r from-amber-950/40 via-[#0E1526] to-amber-950/30 border-amber-500/25'
      }`}>
        <div className="space-y-2 text-center md:text-left">
          <span className={`text-xs font-semibold uppercase tracking-widest ${isCream ? 'text-amber-800' : 'text-amber-400'}`}>
            Dịch Vụ May Đo Riêng Cho Sự Kiện & Đám Cưới
          </span>
          <h3 className={`text-xl sm:text-2xl font-serif-vi font-bold ${isCream ? 'text-stone-900' : 'text-slate-100'}`}>
            Cần Tư Vấn Phối Đồ Chuẩn Quy Thức Cung Đình?
          </h3>
          <p className={`text-xs sm:text-sm max-w-xl ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
            Đội ngũ nghiên cứu văn hóa và nghệ nhân may đo Cố đô sẵn sàng đồng hành cùng bạn từ chọn màu sắc ngũ hành đến lấy số đo tận nơi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playPluck(523.25);
              const firstProduct = FASHION_PRODUCTS[0];
              onSelectProductDetails(firstProduct);
            }}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 font-serif-vi"
          >
            Đăng Ký May Đo Riêng
          </button>
        </div>
      </div>
    </section>
  );
};
