import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  CreditCard,
  QrCode,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { CartItem } from '../data/fashionShopData';
import { soundEngine } from '../utils/audioSynth';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  voucherDiscount: number;
  appliedVoucherCode: string;
  onClearCart: () => void;
  onGoHome: () => void;
  onGoFittingRoom?: () => void;
}

type PaymentMethod = 'cod' | 'vietqr' | 'card';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  voucherDiscount,
  appliedVoucherCode,
  onClearCart,
  onGoHome,
  onGoFittingRoom,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const isFreeShipping = subtotal >= 1500000;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : 40000;
  const finalTotal = Math.max(0, subtotal - voucherDiscount + shippingFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.');
      return;
    }

    setIsSubmitting(true);
    soundEngine.playPluck(523.25);

    setTimeout(() => {
      const generatedId = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsSubmitting(false);
      setIsSuccess(true);
      soundEngine.playPluck(783.99);
      onClearCart();
    }, 1200);
  };

  const copyBankInfo = () => {
    navigator.clipboard?.writeText?.('0123456789 - MB Bank - AURA VIET PHUC');
    setCopiedBank(true);
    soundEngine.playPluck(880);
    setTimeout(() => setCopiedBank(false), 2000);
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          data-lenis-prevent="true"
          className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto overscroll-contain bg-[#0C1220] border border-amber-500/30 rounded-2xl shadow-2xl z-10 text-slate-100 flex flex-col custom-scrollbar scrollbar-heritage"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0A0E17]/95 border-b border-amber-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-serif-vi font-bold text-amber-200">
                {isSuccess ? 'Đặt Hàng Thành Công!' : 'Thanh Toán & Đặt May Cổ Phục'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen */}
          {isSuccess ? (
            <div className="p-7 sm:p-10 flex flex-col items-center text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Mã đơn hàng: {orderId}
                </span>
                <h3 className="text-2xl font-serif-vi font-bold text-amber-200 mt-1">
                  Cảm Ơn Quý Khách Đã Đồng Hành Cùng Di Sản!
                </h3>
                <p className="text-sm text-slate-300 max-w-lg mt-2">
                  Đơn hàng của bạn đã được chuyển tới xưởng may đo nghệ nhân. Chúng tôi sẽ liên hệ qua số điện thoại{' '}
                  <strong className="text-amber-300">{phone}</strong> để xác nhận số đo và thời gian giao hàng.
                </p>
              </div>

              {/* Order summary pill */}
              <div className="w-full max-w-md p-4 bg-slate-900/80 border border-amber-500/20 rounded-xl text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Khách hàng:</span>
                  <span className="font-semibold text-slate-100">{fullName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Địa chỉ:</span>
                  <span className="font-semibold text-slate-100 text-right">{address}, {city}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Phương thức:</span>
                  <span className="font-semibold text-amber-300 uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800">
                  <span className="font-semibold">Tổng thanh toán:</span>
                  <span className="font-bold text-amber-400 text-sm font-serif-vi">
                    {finalTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <button
                  onClick={() => {
                    onClose();
                    onGoHome();
                  }}
                  className="flex-1 py-3 px-5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 font-sans-vi"
                >
                  Về Trang Chủ Boutique
                </button>

                {onGoFittingRoom && (
                  <button
                    onClick={() => {
                      onClose();
                      onGoFittingRoom();
                    }}
                    className="flex-1 py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-sm border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Vào Phòng Thử Đồ AI
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {/* Left: Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> 1. Thông Tin Nhận Hàng & May Đo
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">
                        Họ và tên người nhận <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Thị Mai Lan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          Số điện thoại <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0912 345 678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          Email (nhận hóa đơn)
                        </label>
                        <input
                          type="email"
                          placeholder="mailan@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          Tỉnh / Thành phố
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-400 outline-none"
                        >
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Hải Phòng">Hải Phòng</option>
                          <option value="Khác">Tỉnh thành khác</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium">
                          Địa chỉ nhà cụ thể <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Số 18 Phố Tràng Tiền..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">
                        Ghi chú đặc biệt cho nghệ nhân may đo
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ví dụ: Cần gấp trước ngày cưới 20/11, may thêm tà trong..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Payment & Summary */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> 2. Hình Thức Thanh Toán
                  </h3>

                  <div className="space-y-2 text-xs">
                    {/* VietQR Option */}
                    <div
                      onClick={() => setPaymentMethod('vietqr')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'vietqr'
                          ? 'border-amber-400 bg-amber-950/30'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-slate-200">
                          <QrCode className="w-4 h-4 text-amber-400" />
                          <span>Chuyển khoản VietQR (Khuyên dùng)</span>
                        </div>
                        <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          Quét mã 5s
                        </span>
                      </div>

                      {paymentMethod === 'vietqr' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-amber-500/20 text-slate-300 space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center">
                              {/* Simulated QR Code */}
                              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded flex flex-col items-center justify-center text-[8px] text-amber-400 font-mono text-center p-1">
                                <QrCode className="w-8 h-8 text-amber-300" />
                                VietQR 24/7
                              </div>
                            </div>
                            <div className="text-[11px] space-y-1">
                              <p className="font-semibold text-amber-200">
                                MB Bank (Ngân hàng Quân Đội)
                              </p>
                              <p className="text-slate-300 font-mono">STK: 0888 686 888</p>
                              <p className="text-slate-400">Chủ TK: AURA VIET PHUC COUTURE</p>
                              <button
                                type="button"
                                onClick={copyBankInfo}
                                className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300"
                              >
                                {copiedBank ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copiedBank ? 'Đã sao chép!' : 'Sao chép thông tin'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* COD Option */}
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-amber-400 bg-amber-950/30'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-slate-200">
                          <Truck className="w-4 h-4 text-amber-400" />
                          <span>Thanh toán khi nhận hàng (COD)</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Được kiểm tra hàng</span>
                      </div>
                    </div>

                    {/* Credit Card Option */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-amber-400 bg-amber-950/30'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-slate-200">
                          <CreditCard className="w-4 h-4 text-amber-400" />
                          <span>Thẻ Tín Dụng / Ghi Nợ (Visa, Mastercard)</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Bảo mật SSL 256-bit</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Total Overview */}
                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tổng sản phẩm ({items.length}):</span>
                      <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                    </div>

                    {voucherDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Giảm giá ({appliedVoucherCode}):</span>
                        <span>-{voucherDiscount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-slate-400">Vận chuyển:</span>
                      <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`}</span>
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 font-bold text-amber-200 text-sm">
                      <span className="font-sans-vi">Cần thanh toán:</span>
                      <span className="text-base text-amber-300 font-sans-vi">
                        {finalTotal.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Cam kết bảo hành đường may trọn đời & hỗ trợ may đo chỉnh sửa miễn phí.</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all font-sans-vi disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Đang xử lý đơn hàng...'
                  ) : (
                    <>
                      Xác Nhận Đặt Hàng ({finalTotal.toLocaleString('vi-VN')}₫)
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
