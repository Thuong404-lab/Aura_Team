import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Check,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Scissors,
  Heart,
  ChevronRight,
  Info,
} from 'lucide-react';
import { FashionProduct } from '../data/fashionShopData';
import { soundEngine } from '../utils/audioSynth';

interface ProductDetailModalProps {
  product: FashionProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: FashionProduct,
    size: string,
    color: { name: string; hex: string },
    measurements?: {
      height?: string;
      weight?: string;
      chest?: string;
      waist?: string;
      notes?: string;
    }
  ) => void;
  onTryInFittingRoom: (product: FashionProduct) => void;
  onInstantBuy: (
    product: FashionProduct,
    size: string,
    color: { name: string; hex: string }
  ) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onTryInFittingRoom,
  onInstantBuy,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!product || !isOpen) return null;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0] || { name: 'Mặc định', hex: '#8B1E1E' }
  );
  const [isCustomMeasureOpen, setIsCustomMeasureOpen] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [measureNotes, setMeasureNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleSizeSelect = (size: string) => {
    soundEngine.playPluck(440);
    setSelectedSize(size);
    if (size === 'May đo riêng') {
      setIsCustomMeasureOpen(true);
    }
  };

  const handleColorSelect = (c: { name: string; hex: string }) => {
    soundEngine.playPluck(523.25);
    setSelectedColor(c);
  };

  const handleAdd = () => {
    soundEngine.playPluck(659.25);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);

    const measurements =
      selectedSize === 'May đo riêng'
        ? {
            height,
            weight,
            chest,
            waist,
            notes: measureNotes,
          }
        : undefined;

    onAddToCart(product, selectedSize, selectedColor, measurements);
  };

  const handleTryOn = () => {
    soundEngine.playPluck(587.33);
    onTryInFittingRoom(product);
    onClose();
  };

  const handleBuyNow = () => {
    soundEngine.playPluck(783.99);
    onInstantBuy(product, selectedSize, selectedColor);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          data-lenis-prevent="true"
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto overscroll-contain bg-[#0E1526] border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/80 z-10 text-slate-100 flex flex-col custom-scrollbar scrollbar-heritage"
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-[#0C1220]/95 backdrop-blur-md border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-amber-400 uppercase bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                {product.era}
              </span>
              <span className="text-xs text-slate-400">• {product.categoryLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-2 rounded-full border transition-all ${
                  isWishlisted
                    ? 'border-red-500/50 bg-red-500/10 text-red-400'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-red-400'
                }`}
                title="Lưu vào danh sách yêu thích"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`}
                />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content: Split layout on Desktop */}
          <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Left: Gallery */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900 border border-amber-500/20 shadow-inner group">
                <img
                  src={product.images[selectedImgIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {product.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 text-xs font-bold tracking-wider rounded uppercase shadow-lg">
                    {product.tag}
                  </span>
                )}

                {/* Quick Try-On Banner overlay at image bottom */}
                <button
                  onClick={handleTryOn}
                  className="absolute bottom-3 left-3 right-3 py-2 px-3 bg-[#0A0E17]/90 hover:bg-amber-600 text-amber-300 hover:text-white text-xs font-semibold rounded-lg border border-amber-500/40 backdrop-blur-md flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Mặc thử ngay trên người mẫu 2D / AI
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundEngine.playPluck(440);
                        setSelectedImgIndex(idx);
                      }}
                      className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImgIndex === idx
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Cultural Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                  <Scissors className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[10px] text-slate-300 font-medium">May Đo Thủ Công</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                  <Truck className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[10px] text-slate-300 font-medium">Freeship từ 1.5M</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                  <RotateCcw className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[10px] text-slate-300 font-medium">Đổi size 7 ngày</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Actions */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif-vi font-bold text-amber-200 leading-tight">
                  {product.name}
                </h2>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="ml-1 text-xs font-bold text-slate-200">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    ({product.reviewCount} đánh giá từ khách hàng)
                  </span>
                  <span className="text-xs text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    Còn hàng
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-4 py-2.5 px-3.5 bg-amber-950/20 rounded-xl border border-amber-500/20">
                  <span className="text-2xl sm:text-3xl font-bold font-serif-vi text-amber-300">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs font-semibold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                      Tiết kiệm{' '}
                      {(product.originalPrice - product.price).toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                {/* Fabric Material Highlight */}
                <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-300">Chất liệu cao cấp: </span>
                    {product.fabric}
                  </div>
                </div>

                {/* Color Swatch Picker */}
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Sắc phục & Gấm: <span className="text-amber-300 normal-case">{selectedColor.name}</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => handleColorSelect(c)}
                        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          selectedColor.name === c.name
                            ? 'border-amber-400 bg-amber-950/40 text-amber-200 ring-1 ring-amber-400/40'
                            : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Kích Thước / Size:
                    </label>
                    <button
                      onClick={() => setIsCustomMeasureOpen(!isCustomMeasureOpen)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Scissors className="w-3 h-3" />
                      {isCustomMeasureOpen ? 'Thu gọn may đo' : 'Hướng dẫn & May đo riêng'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSizeSelect(s)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                          selectedSize === s
                            ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                            : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Custom Measurement Form Drawer */}
                  <AnimatePresence>
                    {isCustomMeasureOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2.5 overflow-hidden text-xs"
                      >
                        <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                          <Scissors className="w-3.5 h-3.5" />
                          Thông số may đo riêng cá nhân (Độc bản tôn dáng)
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div>
                            <span className="text-[11px] text-slate-400 block mb-0.5">Chiều cao (cm)</span>
                            <input
                              type="number"
                              placeholder="165"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:border-amber-400 outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block mb-0.5">Cân nặng (kg)</span>
                            <input
                              type="number"
                              placeholder="52"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:border-amber-400 outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block mb-0.5">Vòng ngực (cm)</span>
                            <input
                              type="number"
                              placeholder="84"
                              value={chest}
                              onChange={(e) => setChest(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:border-amber-400 outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block mb-0.5">Vòng eo (cm)</span>
                            <input
                              type="number"
                              placeholder="66"
                              value={waist}
                              onChange={(e) => setWaist(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:border-amber-400 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Ghi chú thêm: ví dụ tà dài qua đầu gối 5cm, vai xuôi..."
                            value={measureNotes}
                            onChange={(e) => setMeasureNotes(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cultural craft highlights list */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300 block">Đặc điểm chế tác:</span>
                  {product.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Area */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAdd}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                      addedAnimation
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-amber-200'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        Đã thêm vào giỏ!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Thêm vào giỏ hàng
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all font-sans-vi"
                  >
                    Mua Ngay (Thanh toán)
                  </button>
                </div>

                {/* Virtual Fitting Room Highlight Button */}
                <button
                  onClick={handleTryOn}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-[#141E33] hover:bg-[#1B2945] border border-amber-400/30 text-amber-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Mở trang phục trong Phòng Thử Đồ Ảo (Fitting Room)
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
