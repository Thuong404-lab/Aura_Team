import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CartItem, PROMO_VOUCHERS, PromoVoucher } from '../data/fashionShopData';
import { soundEngine } from '../utils/audioSynth';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedCheckout: (voucherDiscount: number, appliedCode: string) => void;
  onTryCartInFittingRoom?: () => void;
  onExploreShop?: () => void;
}

const FREE_SHIPPING_THRESHOLD = 1500000;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  onTryCartInFittingRoom,
  onExploreShop,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<PromoVoucher | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Voucher discount calculation
  const discountAmount = appliedVoucher
    ? Math.round((subtotal * appliedVoucher.discountPercent) / 100)
    : 0;

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : 40000;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const amountNeededForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShipProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyPromo = () => {
    soundEngine.playPluck(523.25);
    setPromoError(null);
    setPromoSuccess(null);

    const found = PROMO_VOUCHERS.find(
      (v) => v.code.toUpperCase() === promoCodeInput.trim().toUpperCase()
    );

    if (!found) {
      setPromoError('Mã ưu đãi không hợp lệ. Hãy thử: AURA2026 hoặc FREESHIP');
      return;
    }

    if (subtotal < found.minOrderValue) {
      setPromoError(
        `Đơn hàng cần đạt tối thiểu ${found.minOrderValue.toLocaleString('vi-VN')}₫ để dùng mã này.`
      );
      return;
    }

    setAppliedVoucher(found);
    setPromoSuccess(`Đã áp dụng mã ${found.code}: ${found.description}!`);
  };

  const handleCheckoutClick = () => {
    soundEngine.playPluck(659.25);
    onProceedCheckout(discountAmount, appliedVoucher ? appliedVoucher.code : '');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        />

        {/* Slide-out Panel */}
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
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif-vi font-bold text-lg text-amber-200">
                    Túi Mua Sắm
                  </h2>
                  <p className="text-xs text-slate-400">
                    {items.reduce((c, i) => c + i.quantity, 0)} món đồ trong giỏ
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

            {/* Free Shipping Progress bar */}
            <div className="px-5 py-3 bg-amber-950/20 border-b border-amber-500/15">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  {isFreeShipping ? (
                    <span className="text-emerald-400 font-semibold">
                      Chúc mừng! Đơn hàng được MIỄN PHÍ VẬN CHUYỂN
                    </span>
                  ) : (
                    <span>
                      Mua thêm{' '}
                      <strong className="text-amber-300">
                        {amountNeededForFreeShip.toLocaleString('vi-VN')}₫
                      </strong>{' '}
                      để được Freeship
                    </span>
                  )}
                </span>
                <span className="text-amber-400 font-bold text-[11px]">
                  {freeShipProgress}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShipProgress}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3.5 divide-y divide-slate-800/80 custom-scrollbar scrollbar-heritage"
            >
              {items.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <ShoppingBag className="w-8 h-8 opacity-60" />
                  </div>
                  <div>
                    <h3 className="font-serif-vi font-bold text-base text-slate-200">
                      Túi đồ của bạn đang trống
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Hãy dạo quanh cửa hàng và chọn cho mình tà áo cổ phục ưng ý hoặc thử phối đồ trên người mẫu 2D.
                    </p>
                  </div>
                  {onExploreShop && (
                    <button
                      onClick={() => {
                        onClose();
                        onExploreShop();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                    >
                      Khám phá BST Cổ Phục ngay
                    </button>
                  )}
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="pt-3.5 first:pt-0 flex gap-3.5 group"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-900 border border-amber-500/20 flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-semibold text-amber-200 truncate pr-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => {
                              soundEngine.playPluck(300);
                              onRemoveItem(item.cartItemId);
                            }}
                            className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                            title="Xóa món đồ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            Size: {item.selectedSize}
                          </span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/50"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        </div>

                        {item.customMeasurements && (
                          <div className="mt-1 text-[10px] text-amber-400/90 italic">
                            May đo: {item.customMeasurements.height}cm / {item.customMeasurements.weight}kg
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900/60 overflow-hidden">
                          <button
                            onClick={() => {
                              soundEngine.playPluck(400);
                              onUpdateQuantity(item.cartItemId, item.quantity - 1);
                            }}
                            className="p-1 hover:bg-slate-800 text-slate-300 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              soundEngine.playPluck(500);
                              onUpdateQuantity(item.cartItemId, item.quantity + 1);
                            }}
                            className="p-1 hover:bg-slate-800 text-slate-300 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold font-serif-vi text-amber-300">
                          {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions & Summary */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-amber-500/20 bg-[#0A0E17]/95 space-y-3">
                {/* Promo Code Input */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Mã ưu đãi (VD: AURA2026)"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 uppercase placeholder:normal-case placeholder:text-slate-500 focus:border-amber-400 outline-none"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>

                  {promoError && (
                    <div className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {promoError}
                    </div>
                  )}
                  {promoSuccess && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {promoSuccess}
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tạm tính:</span>
                    <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Ưu đãi voucher ({appliedVoucher?.code}):</span>
                      <span>-{discountAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-400">Phí vận chuyển:</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-emerald-400 font-medium">Miễn phí</span>
                      ) : (
                        `${shippingFee.toLocaleString('vi-VN')}₫`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 text-sm font-bold text-amber-200">
                    <span className="font-serif-vi">Tổng thanh toán:</span>
                    <span className="text-base text-amber-300 font-serif-vi">
                      {finalTotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all font-serif-vi"
                >
                  Tiến Hành Thanh Toán ({items.length} sản phẩm)
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onTryCartInFittingRoom && (
                  <button
                    onClick={() => {
                      soundEngine.playPluck(440);
                      onClose();
                      onTryCartInFittingRoom();
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-950/30 border border-amber-500/20 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Thử các trang phục trong giỏ trên người mẫu 2D
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
