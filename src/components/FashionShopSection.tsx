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

        <h2 className="text-2xl sm:text-4xl font-serif-vi font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300">
          Bộ Sưu Tập Cổ Phục & May Đo Hoàng Triều
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Mỗi thiết kế là một tác phẩm nghệ thuật gìn giữ hồn cốt nghìn năm. Trải nghiệm mua sắm tiện lợi hoặc thử đồ trực tiếp bằng công nghệ AI 2D.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-[#0C1220]/80 border border-amber-500/20 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-md shadow-xl space-y-4">
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên áo, gấm hoa, triều đại (Nhật Bình, Ngũ Thân, Tơ tằm...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none transition-colors"
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
                className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-8 text-xs text-slate-200 focus:border-amber-400 outline-none cursor-pointer"
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
                className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-8 text-xs text-slate-200 focus:border-amber-400 outline-none cursor-pointer"
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
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
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
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
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
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
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
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
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
                className="group relative bg-[#0D1424] border border-amber-500/20 hover:border-amber-400/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col cursor-pointer"
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
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="text-amber-400/90 font-medium">
                        {prod.era}
                      </span>
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="ml-1 text-[11px] font-semibold text-slate-200">
                          {prod.rating}
                        </span>
                      </div>
                    </div>

                    {/* Garment Title */}
                    <h3 className="font-serif-vi font-bold text-sm text-slate-100 group-hover:text-amber-200 leading-snug transition-colors">
                      {prod.name}
                    </h3>

                    {/* Fabric description */}
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {prod.fabric}
                    </p>
                  </div>

                  {/* Color Swatch Dots */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {prod.colors.map((c, i) => (
                      <span
                        key={i}
                        title={c.name}
                        className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1">
                      {prod.sizes.length} cỡ size
                    </span>
                  </div>

                  {/* Price & CTA Row */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-serif-vi font-bold text-base text-amber-300">
                        {prod.price.toLocaleString('vi-VN')}₫
                      </div>
                      {prod.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {prod.originalPrice.toLocaleString('vi-VN')}₫
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(e, prod)}
                      className="py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-300 hover:text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all"
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
      <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0E1526] to-amber-950/30 border border-amber-500/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Dịch Vụ May Đo Riêng Cho Sự Kiện & Đám Cưới
          </span>
          <h3 className="text-xl sm:text-2xl font-serif-vi font-bold text-slate-100">
            Cần Tư Vấn Phối Đồ Chuẩn Quy Thức Cung Đình?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
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
