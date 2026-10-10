/**
 * lookbookPosterGenerator.ts
 * Engine xuất Poster Lookbook Di Sản Việt Phục độ nét cao (HD 1200x1800 PNG).
 * ĐỒNG BỘ 100% VỚI UI: Kết xuất trực tiếp chính xác bản vẽ 2D từ SVG của AvatarModel
 * lên Canvas ở độ phân giải siêu nét (1200x1800), căn chỉnh lề chính xác, chữ không bị tràn hay mất.
 */

import { WardrobeItem, FabricOption, ColorOption, BackdropOption } from '../data/vietPhucData';

export interface LookbookPosterOptions {
  top: WardrobeItem;
  bottom: WardrobeItem;
  accessory: WardrobeItem;
  fabric: FabricOption;
  color: ColorOption;
  topCustomColor?: string;
  bottomCustomColor?: string;
  backdrop: BackdropOption;
  harmonyScore: number;
  isAuthentic: boolean;
  editionTitle: string;
  subHeadline: string;
  poetryCouple: string;
  personalNote?: string;
  lightingFilter?: 'sunset' | 'moonlight' | 'royal' | 'vintage';
  showSeal?: boolean;
}

/**
 * Tải ảnh có xử lý CORS để vẽ lên canvas nếu khả dụng
 */
function loadImageWithFallback(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => resolve(null);
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

/**
 * Trích xuất và render chính xác SVG Avatar 2D trên trang web sang Image element
 */
async function getMannequinImageFromDOM(): Promise<HTMLImageElement | null> {
  if (typeof document === 'undefined') return null;

  // Tìm SVG của AvatarModel hiển thị trên UI
  const avatarSvg = document.querySelector('#root svg[viewBox="0 0 380 640"]') as SVGSVGElement | null;
  if (!avatarSvg) return null;

  try {
    const clone = avatarSvg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '760');
    clone.setAttribute('height', '1280');

    const svgXml = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  } catch (err) {
    console.warn('Failed to extract avatar SVG:', err);
    return null;
  }
}

/**
 * Cắt ngắn văn bản nếu vượt quá chiều rộng tối đa
 */
function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 3 && ctx.measureText(truncated + '...').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated.trim() + '...';
}

/**
 * Sinh và tải trực tiếp file Poster HD PNG về máy người dùng
 */
export async function downloadLookbookPosterHD(
  options: LookbookPosterOptions,
  onProgress?: (status: string) => void
): Promise<string> {
  if (onProgress) onProgress('Đang chuẩn bị khung hình di sản HD 1200x1800...');

  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue drawing if font loading promise errors
    }
  }

  const width = 1200;
  const height = 1800;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. NỀN BỐI CẢNH (BACKDROP HOẶC HOÀNG CUNG SAPPHIRE)
  let backdropDrawn = false;
  if (options.backdrop.imageUrl) {
    if (onProgress) onProgress('Đang tải và hòa sắc bối cảnh danh thắng...');
    try {
      const backdropImg = await loadImageWithFallback(options.backdrop.imageUrl);
      if (backdropImg) {
        // Vẽ toàn bộ chiều cao với aspect ratio phù hợp
        ctx.drawImage(backdropImg, 0, 0, width, height * 0.76);
        backdropDrawn = true;
      }
    } catch {
      backdropDrawn = false;
    }
  }

  if (!backdropDrawn) {
    // Nền Dạ Lam Hoàng Triều sâu thẳm
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0F1829');
    bgGrad.addColorStop(0.35, '#0A0E1A');
    bgGrad.addColorStop(0.7, '#070A12');
    bgGrad.addColorStop(1, '#04060A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. PHỦ LỚP GRADIENT HUYỀN ẢO & BỘ LỌC ÁNH SÁNG
  const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
  overlayGrad.addColorStop(0, 'rgba(10, 14, 26, 0.65)');
  overlayGrad.addColorStop(0.35, 'rgba(10, 14, 26, 0.28)');
  overlayGrad.addColorStop(0.62, 'rgba(10, 14, 26, 0.85)');
  overlayGrad.addColorStop(0.75, 'rgba(10, 14, 26, 0.98)');
  overlayGrad.addColorStop(1, '#050811');
  ctx.fillStyle = overlayGrad;
  ctx.fillRect(0, 0, width, height);

  // Bộ lọc màu nghệ thuật (đồng bộ với UI)
  if (options.lightingFilter === 'sunset') {
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.fillRect(0, 0, width, height);
  } else if (options.lightingFilter === 'moonlight') {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.fillRect(0, 0, width, height);
  } else if (options.lightingFilter === 'royal') {
    ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.fillRect(0, 0, width, height);
  } else if (options.lightingFilter === 'vintage') {
    ctx.fillStyle = 'rgba(180, 83, 9, 0.14)';
    ctx.fillRect(0, 0, width, height);
  }

  // 3. KHUNG VIỀN KIM HOÀNG GIA & HỌA TIẾT CỔ PHONG
  const m = 44; // Margin
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(m, m, width - m * 2, height - m * 2);

  // Viền tóc chỉ mảnh bên ngoài
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(m - 12, m - 12, width - (m - 12) * 2, height - (m - 12) * 2);

  // Họa tiết 4 góc cổ phong
  const drawCorner = (cx: number, cy: number, signX: number, signY: number) => {
    ctx.save();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy + signY * 42);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + signX * 42, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + signX * 9, cy + signY * 30);
    ctx.lineTo(cx + signX * 9, cy + signY * 9);
    ctx.lineTo(cx + signX * 30, cy + signY * 9);
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(cx + signX * 20, cy + signY * 20, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawCorner(m + 4, m + 4, 1, 1);
  drawCorner(width - m - 4, m + 4, -1, 1);
  drawCorner(m + 4, height - m - 4, 1, -1);
  drawCorner(width - m - 4, height - m - 4, -1, -1);

  // 4. TIÊU ĐỀ TRANG TRỌNG TRÊN ĐỈNH POSTER
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 24px "Lora", "Noto Serif", "Playfair Display", "Be Vietnam Pro", serif';
  ctx.fillText('AURA • LOOKBOOK DI SẢN VIỆT PHỤC', 600, 92);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 13px "Be Vietnam Pro", sans-serif';
  ctx.fillText('QUY CHUẨN TRANG PHỤC TRUYỀN THỐNG ĐẠI VIỆT', 600, 118);

  // Huy hiệu triều đại & bối cảnh
  ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 1.2;
  const badgeW = 380;
  const badgeH = 30;
  const badgeX = (width - badgeW) / 2;
  const badgeY = 135;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FDE68A';
  ctx.font = '600 12.5px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    `${options.top.era.toUpperCase()} • ${options.backdrop.name.toUpperCase()}`,
    600,
    155
  );

  // 5. VẼ NGƯỜI MẪU 2D TRUYỀN THẦN (ĐỒNG BỘ 100% VỚI UI)
  if (onProgress) onProgress('Đang đồng bộ chính xác người mẫu 2D từ UI...');

  const centerX = 600;
  const modelBaseY = 460;

  // Bóng đổ dưới chân người mẫu
  const shadowGrad = ctx.createRadialGradient(
    centerX,
    modelBaseY + 460,
    10,
    centerX,
    modelBaseY + 460,
    160
  );
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(centerX, modelBaseY + 460, 160, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // THỬ LẤY ẢNH CHÍNH XÁC TỪ SVG CỦA AVATAR TRÊN UI
  const mannequinImg = await getMannequinImageFromDOM();
  if (mannequinImg) {
    // Vẽ chính xác 1:1 hình mẫu từ UI với độ nét cao
    // SVG viewBox là 380x640 -> scale lên phù hợp khung poster
    const mw = 440;
    const mh = (440 * 640) / 380; // ~741px
    const mx = centerX - mw / 2;
    const my = modelBaseY - 260;
    ctx.drawImage(mannequinImg, mx, my, mw, mh);
  } else {
    // FALLBACK CANVAS RENDER NẾU KHÔNG CÓ DOM SVG
    ctx.save();
    const bottomColorHex = options.bottomCustomColor || options.bottom.defaultColorHex || '#FAF7F0';
    ctx.fillStyle = bottomColorHex;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 1.5;

    // Quần 2 ống
    ctx.beginPath();
    ctx.moveTo(centerX - 75, modelBaseY + 180);
    ctx.lineTo(centerX - 120, modelBaseY + 460);
    ctx.lineTo(centerX - 12, modelBaseY + 460);
    ctx.lineTo(centerX - 8, modelBaseY + 220);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + 75, modelBaseY + 180);
    ctx.lineTo(centerX + 120, modelBaseY + 460);
    ctx.lineTo(centerX + 12, modelBaseY + 460);
    ctx.lineTo(centerX + 8, modelBaseY + 220);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Áo ngũ thân / Cổ phục
    const topColorHex = options.topCustomColor || options.color.hex || options.top.defaultColorHex || '#162544';
    ctx.fillStyle = topColorHex;
    ctx.beginPath();
    ctx.moveTo(centerX - 85, modelBaseY - 30);
    ctx.lineTo(centerX + 85, modelBaseY - 30);
    ctx.lineTo(centerX + 130, modelBaseY + 355);
    ctx.quadraticCurveTo(centerX, modelBaseY + 375, centerX - 130, modelBaseY + 355);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tay áo
    ctx.beginPath();
    ctx.moveTo(centerX - 85, modelBaseY - 30);
    ctx.lineTo(centerX - 170, modelBaseY + 130);
    ctx.lineTo(centerX - 135, modelBaseY + 155);
    ctx.lineTo(centerX - 85, modelBaseY + 90);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + 85, modelBaseY - 30);
    ctx.lineTo(centerX + 170, modelBaseY + 130);
    ctx.lineTo(centerX + 135, modelBaseY + 155);
    ctx.lineTo(centerX + 85, modelBaseY + 90);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sống áo mũi gáy
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, modelBaseY - 20);
    ctx.lineTo(centerX, modelBaseY + 365);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cổ áo & Khuy
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.roundRect(centerX - 32, modelBaseY - 42, 64, 18, 4);
    ctx.fill();

    // 5 khuy
    const buttonPositions = [
      { x: centerX + 20, y: modelBaseY - 34 },
      { x: centerX + 28, y: modelBaseY + 5 },
      { x: centerX + 36, y: modelBaseY + 45 },
      { x: centerX + 42, y: modelBaseY + 85 },
      { x: centerX + 46, y: modelBaseY + 128 },
    ];
    buttonPositions.forEach((pos) => {
      ctx.fillStyle = '#FFFBEB';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Đầu & khuôn mặt
    ctx.fillStyle = '#FDF0E6';
    ctx.beginPath();
    ctx.ellipse(centerX, modelBaseY - 88, 36, 44, 0, 0, Math.PI * 2);
    ctx.fill();

    // Khăn đóng / Mũ
    ctx.fillStyle = '#141110';
    ctx.beginPath();
    ctx.ellipse(centerX, modelBaseY - 110, 44, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.restore();
  }

  // 6. PHẦN THÔNG TIN BẢN PHỐI & LỜI BÌNH BIÊN TẬP (BOTTOM EDITORIAL CARD)
  // Tính toán layout tỉ mỉ để chữ hoàn toàn nằm gọn bên trong card, KHÔNG BỊ TRÀN!
  if (onProgress) onProgress('Đang căn chỉnh chữ và con dấu di sản...');

  const cardY = 1130;
  const cardH = 585;
  const cardW = width - m * 2 - 36;
  const cardX = m + 18;

  // Nền card kính mờ hoàng gia
  ctx.fillStyle = 'rgba(12, 18, 32, 0.92)';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Khung nội dung bên trong card (padding an toàn 36px)
  const contentLeft = cardX + 36;
  const maxContentW = cardW - 72;

  // 6.1 Tiêu đề tác phẩm
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FDE68A';
  const rawTitle = options.editionTitle || `Dáng Hoa ${options.top.name}`;
  ctx.font = 'bold 28px "Lora", "Noto Serif", "Playfair Display", "Be Vietnam Pro", serif';
  const cleanTitle = truncateText(ctx, rawTitle, maxContentW);
  ctx.fillText(cleanTitle, contentLeft, cardY + 52);

  // 6.2 Phụ đề bối cảnh
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 14.5px "Be Vietnam Pro", sans-serif';
  const rawSub =
    options.subHeadline ||
    `Giao hòa giữa ngàn năm di sản và nhịp thở đương đại tại ${options.backdrop.name}`;
  const cleanSub = truncateText(ctx, rawSub, maxContentW);
  ctx.fillText(cleanSub, contentLeft, cardY + 84);

  // 6.3 Chi tiết các tầng phục sắc
  ctx.fillStyle = '#94A3B8';
  ctx.font = '13px "Be Vietnam Pro", sans-serif';
  const garmentsDetail = `Thượng y: ${options.top.name}  •  Hạ y: ${options.bottom.name}  •  Phụ kiện: ${options.accessory.name}`;
  ctx.fillText(truncateText(ctx, garmentsDetail, maxContentW), contentLeft, cardY + 120);

  const fabricDetail = `Chất liệu: ${options.fabric.name}  •  Sắc màu: ${options.color.name}  •  Niên đại: ${options.top.era}`;
  ctx.fillText(truncateText(ctx, fabricDetail, maxContentW), contentLeft, cardY + 144);

  // Vạch ngăn cách dát vàng
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(contentLeft, cardY + 164);
  ctx.lineTo(cardX + cardW - 36, cardY + 164);
  ctx.stroke();

  // 6.4 4 Dấu ấn cốt lõi
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 12px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    'QUY CHUẨN ĐẠI VIỆT: 5 Thân Dáng Chữ A • 5 Khuy Ngũ Thường • Sống Áo Mũi Gáy • Quần 2 Ống Lụa',
    contentLeft,
    cardY + 190
  );

  // 6.5 Câu thơ đề từ nghệ thuật (khung nền vàng nhẹ)
  const poetryW = maxContentW;
  const poetryH = 50;
  const poetryY = cardY + 212;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(contentLeft, poetryY, poetryW, poetryH, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FDE68A';
  ctx.font = 'italic bold 17px "Lora", "Noto Serif", "Playfair Display", "Be Vietnam Pro", serif';
  ctx.textAlign = 'center';
  const poetryText = `“ ${options.poetryCouple || 'Áo xưa khép vạt mây hồng lượn / Bước khẽ nghiêng chào bóng cố đô.'} ”`;
  ctx.fillText(truncateText(ctx, poetryText, poetryW - 24), contentLeft + poetryW / 2, poetryY + 32);

  // 6.6 Lời bình biên tập & Con dấu di sản
  ctx.textAlign = 'left';
  const hasSeal = options.showSeal !== false;
  const textBlockWidth = hasSeal ? maxContentW - 190 : maxContentW;

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 13px "Be Vietnam Pro", sans-serif';
  ctx.fillText('Lời bình di sản:', contentLeft, cardY + 292);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '13px "Be Vietnam Pro", sans-serif';
  const note =
    options.personalNote ||
    'Tà áo buông suông tự nhiên tôn vinh nét nho nhã, không siết eo dải lụa. Sống áo mũi gáy ngay thẳng tượng trưng nhân cách trung thực, hòa quyện kiêu hãnh cùng thời đại.';

  // Tách dòng an toàn cho lời bình (tối đa 4 dòng)
  const words = note.split(' ');
  let currentLine = '';
  let lineY = cardY + 318;
  let lineCount = 0;

  for (const w of words) {
    const testLine = currentLine + w + ' ';
    if (ctx.measureText(testLine).width > textBlockWidth) {
      ctx.fillText(currentLine.trim(), contentLeft, lineY);
      currentLine = w + ' ';
      lineY += 24;
      lineCount++;
      if (lineCount >= 4) {
        currentLine = '...';
        break;
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    ctx.fillText(currentLine.trim(), contentLeft, lineY);
  }

  // 6.7 Con dấu triện đỏ di sản Việt (Seal Stamp)
  if (hasSeal) {
    ctx.save();
    const stampX = cardX + cardW - 105;
    const stampY = cardY + 345;

    // Viền triện đỏ son truyền thống
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(stampX - 70, stampY - 55, 140, 110, 12);
    ctx.stroke();

    ctx.fillStyle = 'rgba(220, 38, 38, 0.12)';
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 15px "Lora", "Noto Serif", "Be Vietnam Pro", serif';
    ctx.fillText('DI SẢN VIỆT', stampX, stampY - 20);

    ctx.font = 'bold 11px "Be Vietnam Pro", sans-serif';
    ctx.fillText('✓ CHUẨN MỰC', stampX, stampY + 5);

    ctx.font = '600 12px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`${options.harmonyScore}/100 ĐIỂM`, stampX, stampY + 30);
    ctx.restore();
  }

  // Chân trang ký tên
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748B';
  ctx.font = '12.5px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    `Aura Team • Dự Án Bảo Tồn & Số Hóa Cổ Phục Việt • ${new Date().toLocaleDateString('vi-VN')}`,
    600,
    cardY + cardH - 22
  );

  // 7. XUẤT TẬP TIN PNG HD VÀ KÍCH HOẠT TẢI VỀ
  if (onProgress) onProgress('Đang hoàn thiện tập tin PNG HD...');
  const dataUrl = canvas.toDataURL('image/png', 1.0);

  const link = document.createElement('a');
  const safeTitle = options.top.name.replace(/\s+/g, '_');
  link.download = `Aura_Poster_Lookbook_${safeTitle}_${Date.now()}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return dataUrl;
}

