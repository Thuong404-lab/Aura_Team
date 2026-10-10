import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Award,
  CheckCircle2,
  HelpCircle,
  Trophy,
  Info,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { useAppTheme } from '../context/ThemeContext';

interface QuizQuestion {
  id: number;
  question: string;
  dynastyOrTopic: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

const CULTURAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'Chiếc Áo Ngũ Thân truyền thống có 5 hạt cúc cài mang ý nghĩa biểu trưng cho điều gì?',
    dynastyOrTopic: 'Triều Nguyễn · Triết Lý Đạo Đức',
    options: [
      {
        text: 'Ngũ Thường: Nhân, Nghĩa, Lễ, Trí, Tín',
        isCorrect: true,
        explanation: 'Chính xác! 5 hạt cúc xà cừ tượng trưng cho Ngũ Thường — chuẩn mực đạo đức cốt lõi của người quân tử và phụ nữ Việt Nam xưa.',
      },
      {
        text: 'Ngũ Giác: 5 giác quan của con người',
        isCorrect: false,
        explanation: 'Chưa chính xác. 5 hạt cúc đại diện cho Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín).',
      },
      {
        text: 'Ngũ Cốc: 5 loại hạt lương thực của nền nông nghiệp',
        isCorrect: false,
        explanation: 'Chưa chính xác. Áo ngũ thân thể hiện triết lý Nho học và đạo hiếu qua Ngũ Thường.',
      },
    ],
  },
  {
    id: 2,
    question: 'Tại sao chiếc áo Nhật Bình hoàng gia lại có tên gọi là "Nhật Bình"?',
    dynastyOrTopic: 'Cung Đình Huế · Pháp Phục',
    options: [
      {
        text: 'Vì áo được may chỉ trong đúng một ngày bình thường',
        isCorrect: false,
        explanation: 'Không phải. Áo Nhật Bình may thêu cực kỳ công phu mất hàng tháng trời.',
      },
      {
        text: 'Vì cổ áo có dạng hình chữ nhật vuông vức, hai vạt song song bằng phẳng trước ngực',
        isCorrect: true,
        explanation: 'Rất chính xác! Chữ "Nhật" (日) chỉ cổ áo bản to hình chữ nhật, "Bình" (平) là hai dải vạt áo trước ngực chạy song song phẳng phiu.',
      },
      {
        text: 'Vì áo có nguồn gốc từ Nhật Bản du nhập sang',
        isCorrect: false,
        explanation: 'Hoàn toàn sai. Đây là pháp phục cung đình hoàn toàn do người Việt sáng tạo dưới triều Nguyễn.',
      },
    ],
  },
  {
    id: 3,
    question: 'Hoa văn "Thủy Ba" thường thêu ở gấu áo Nhật Bình và phẩm phục triều đình mang hàm ý gì?',
    dynastyOrTopic: 'Mỹ Thuật Cổ · Hoa Văn Thủy Ba',
    options: [
      {
        text: 'Sóng triều dâng cuộn trào, chúc đất nước thái bình thắm tươi và phúc trạch dồi dào',
        isCorrect: true,
        explanation: 'Đúng vậy! Thủy Ba (sóng nước) kết hợp với núi đá biểu trưng cho "Hải Yến Hà Thanh" — giang sơn thái bình thịnh trị.',
      },
      {
        text: 'Nhắc nhở người mặc biết bơi lội',
        isCorrect: false,
        explanation: 'Không chính xác. Đây là đồ án mỹ thuật cung đình mang ý nghĩa quốc gia thái bình.',
      },
      {
        text: 'Chỉ đơn thuần là đường kẻ trang trí cho đỡ đơn điệu',
        isCorrect: false,
        explanation: 'Mọi họa tiết trong cung đình xưa đều mang hàm ý biểu tượng thiêng liêng sâu sắc.',
      },
    ],
  },
  {
    id: 4,
    question: 'Thời Lý - Trần, thức áo nào thể hiện rõ nhất hào khí Đông A phóng khoáng và độc lập tự chủ?',
    dynastyOrTopic: 'Thời Lý - Trần · Hào Khí Đông A',
    options: [
      {
        text: 'Áo Giao Lĩnh (cổ vạt chéo rộng thênh thang, tà buông thướt tha)',
        isCorrect: true,
        explanation: 'Chính xác! Áo Giao Lĩnh với vạt chéo hữu nhậm, tay thụng rộng thể hiện tinh thần khoáng đạt, tự do tự chủ thời Lý - Trần.',
      },
      {
        text: 'Áo Tây Âu cổ cồn',
        isCorrect: false,
        explanation: 'Áo Tây Âu chỉ du nhập vào Việt Nam từ đầu thế kỷ XX.',
      },
      {
        text: 'Áo Bà Ba',
        isCorrect: false,
        explanation: 'Áo Bà Ba xuất hiện muộn hơn nhiều ở vùng đất phương Nam vào thế kỷ XIX.',
      },
    ],
  },
];

export const CulturalInteractiveQuiz: React.FC = () => {
  const { theme } = useAppTheme();
  const isCream = theme === 'cream';

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = CULTURAL_QUIZ[currentQuestionIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOptionIdx(index);
    setIsAnswered(true);

    const isCorrect = currentQ.options[index].isCorrect;
    if (isCorrect) {
      soundEngine.playPluck(659.25);
      setScore((prev) => prev + 1);
    } else {
      soundEngine.playPluck(330);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx + 1 < CULTURAL_QUIZ.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
      soundEngine.playPluck(523.25);
    } else {
      setIsFinished(true);
      soundEngine.playPluck(784);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    setIsFinished(false);
    setScore(0);
    soundEngine.playPluck(523.25);
  };

  return (
    <section className="w-full my-16 text-left relative z-10">
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden backdrop-blur-xl ${
        isCream
          ? 'bg-white border-amber-200/90 shadow-[0_8px_30px_rgba(180,130,60,0.08)] text-stone-900'
          : 'bg-gradient-to-br from-[#121E36] to-[#0B101E] border-amber-500/30 text-slate-100'
      }`}>
        {/* Decorative corner glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isCream ? 'bg-amber-300/10' : 'bg-amber-500/10'
        }`} />

        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-6 ${
          isCream ? 'border-stone-200' : 'border-slate-700/70'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className={`text-xs font-bold tracking-[0.2em] uppercase font-sans-vi ${
                isCream ? 'text-amber-800' : 'text-amber-400'
              }`}>
                THỬ TÀI HIỂU BIẾT
              </span>
            </div>
            <h3 className={`font-serif-vi text-2xl sm:text-3xl font-bold ${
              isCream ? 'text-stone-900' : 'text-amber-100'
            }`}>
              Giải Mã Tri Thức Cổ Phục
            </h3>
          </div>

          {!isFinished && (
            <div className="flex items-center gap-3 text-xs">
              <span className={isCream ? 'text-stone-600' : 'text-slate-400'}>Tiến độ câu hỏi:</span>
              <span className={`px-3 py-1 rounded-full font-mono font-bold border ${
                isCream
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {currentQuestionIdx + 1} / {CULTURAL_QUIZ.length}
              </span>
            </div>
          )}
        </div>

        {!isFinished ? (
          <div>
            {/* Topic label */}
            <span className={`text-xs font-mono tracking-wider uppercase block mb-2 ${
              isCream ? 'text-amber-800 font-semibold' : 'text-amber-400/90'
            }`}>
              Chủ đề: {currentQ.dynastyOrTopic}
            </span>

            {/* Question title */}
            <h4 className={`font-serif-vi text-lg sm:text-xl font-bold mb-6 leading-relaxed ${
              isCream ? 'text-stone-900' : 'text-slate-100'
            }`}>
              {currentQ.question}
            </h4>

            {/* Options list */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                let stateClasses = isCream
                  ? 'bg-stone-50 hover:bg-amber-50/70 border-stone-200 hover:border-amber-400 text-stone-800 shadow-xs'
                  : 'bg-[#121A2D]/80 hover:bg-[#18233C] border-slate-700/80 text-slate-200';

                if (isAnswered) {
                  if (option.isCorrect) {
                    stateClasses = isCream
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                      : 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                  } else if (selectedOptionIdx === idx) {
                    stateClasses = isCream
                      ? 'bg-rose-50 border-rose-400 text-rose-950 font-medium'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200';
                  } else {
                    stateClasses = isCream
                      ? 'bg-stone-50/50 border-stone-200 text-stone-400 opacity-60'
                      : 'bg-[#0E1526]/50 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!isAnswered ? { x: 4 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-sans-vi transition-all flex items-start gap-3 cursor-pointer ${stateClasses}`}
                  >
                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCream
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed flex-1">{option.text}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation box when answered */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm mb-6 overflow-hidden ${
                    isCream
                      ? 'bg-amber-50/90 border-amber-300 text-stone-900 shadow-xs'
                      : 'bg-[#090E1A] border-amber-500/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className={`font-bold block mb-1 ${
                        isCream ? 'text-amber-900' : 'text-amber-300'
                      }`}>
                        {currentQ.options[selectedOptionIdx!].isCorrect
                          ? '🎉 Tuyệt vời! Bạn hiểu rất sâu sắc:'
                          : '💡 Lời giải mã di sản:'}
                      </span>
                      <p className={`font-light leading-relaxed ${
                        isCream ? 'text-stone-700' : 'text-slate-300'
                      }`}>
                        {currentQ.options[selectedOptionIdx!].explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next question action */}
            {isAnswered && (
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 flex items-center gap-2 cursor-pointer shadow-md font-sans-vi"
                >
                  <span>
                    {currentQuestionIdx + 1 < CULTURAL_QUIZ.length
                      ? 'Câu Hỏi Tiếp Theo'
                      : 'Xem Kết Quả'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          /* Finished score screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-500 border border-amber-500/50 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-8 h-8" />
            </div>

            <h4 className={`font-serif-vi text-2xl sm:text-3xl font-bold ${
              isCream ? 'text-stone-900' : 'text-amber-200'
            }`}>
              Chúc Mừng Bạn Đã Hoàn Thành!
            </h4>

            <p className={`text-sm max-w-md mx-auto ${
              isCream ? 'text-stone-700' : 'text-slate-300'
            }`}>
              Bạn đã trả lời đúng{' '}
              <strong className={`text-base ${isCream ? 'text-amber-800' : 'text-amber-300'}`}>
                {score} / {CULTURAL_QUIZ.length}
              </strong>{' '}
              câu hỏi. Thật đáng tự hào về tình yêu và hiểu biết dành cho trang phục truyền thống Việt Nam!
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                  isCream
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 shadow-xs'
                    : 'text-slate-300 hover:text-white bg-[#141F36] hover:bg-[#1A2846] border border-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thử Lại Từ Đầu</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
