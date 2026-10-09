import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { FASHION_PRODUCTS, FashionProduct } from '../data/fashionShopData';
import { soundEngine } from '../utils/audioSynth';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    product: FashionProduct,
    size: string,
    color: { name: string; hex: string }
  ) => void;
  onTryInFittingRoom: (product: FashionProduct) => void;
  onExploreShop: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onTryInFittingRoom,
  onExploreShop,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = FASHION_PRODUCTS.filter((p) =>
    wishlistIds.includes(p.id)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="w-screen max-w-md bg-[#0C1220] border-l border-amber-500/20 text-slate-100 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between bg-[#0A0E17]/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="font-serif-vi font-bold text-lg text-amber-200">
                    Danh Sách Yêu Thích
                  </h2>
                  <p className="text-xs text-slate-400">
                    {wishlistedProducts.length} trang phục đã lưu
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3.5 divide-y divide-slate-800/80 custom-scrollbar scrollbar-heritage"
            >
              {wishlistedProducts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <Heart className="w-8 h-8 opacity-40" />
                  </div>
                  <div>
                    <h3 className="font-serif-vi font-bold text-base text-slate-200">
                      Chưa có trang phục nào
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Bấm vào biểu tượng trái tim trên các sản phẩm bạn thích để lưu lại và xem sau.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onExploreShop();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    Xem Cửa Hàng Ngay
                  </button>
                </div>
              ) : (
                wishlistedProducts.map((prod) => (
                  <div key={prod.id} className="pt-3.5 first:pt-0 flex gap-3.5">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-900 border border-amber-500/20 flex-shrink-0">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-semibold text-amber-200 truncate pr-1">
                            {prod.name}
                          </h4>
                          <button
                            onClick={() => {
                              soundEngine.playPluck(300);
                              onToggleWishlist(prod.id);
                            }}
                            className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                            title="Xóa khỏi yêu thích"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-amber-400/80 block mt-0.5">
                          {prod.era} • {prod.categoryLabel}
                        </span>
                        <div className="text-xs font-bold font-serif-vi text-amber-300 mt-1">
                          {prod.price.toLocaleString('vi-VN')}₫
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            soundEngine.playPluck(659.25);
                            onAddToCart(prod, prod.sizes[0] || 'M', prod.colors[0]);
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          Thêm giỏ
                        </button>

                        <button
                          onClick={() => {
                            soundEngine.playPluck(587.33);
                            onClose();
                            onTryInFittingRoom(prod);
                          }}
                          className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                          title="Thử đồ AI"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Thử đồ
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
