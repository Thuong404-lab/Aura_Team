import React, { useState } from 'react';
import { X, Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuraLogo } from './VietnameseDecorativeElements';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <AuraLogo className="w-8 h-8" />
          <div>
            <h3 className="font-serif-vi text-xl font-bold text-amber-300">
              Aura-Việt phục Remix
            </h3>
            <p className="text-xs text-slate-400">Đăng nhập tài khoản cá nhân & lưu Lookbook</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-100 font-serif-vi">
              Đăng nhập thành công!
            </h4>
            <p className="text-xs text-slate-400">
              Chào mừng bạn trở lại với không gian sáng tạo Việt phục.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email / Tên đăng nhập
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nguyen.van.a@example.com"
                  className="w-full bg-[#18233C] border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18233C] border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-700 accent-amber-500" />
                <span>Ghi nhớ</span>
              </label>
              <a href="#" className="text-amber-400/90 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>VÀO PHÒNG PHỐI ĐỒ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
