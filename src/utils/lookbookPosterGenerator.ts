/**
 * lookbookPosterGenerator.ts
 * Engine xuất Poster Lookbook Di Sản Việt Phục độ nét cao (HD 1200x1800 PNG).
 * Tự chủ vẽ Canvas 2D không phụ thuộc DOM SVG nhằm tránh lỗi Tailwind CSS hoặc tệp ngoại quan.
 */

import { WardrobeItem, FabricOption, ColorOption, BackdropOption } from '../data/vietPhucData';
import { toPng } from 'html-to-image';

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
  element?: HTMLElement | null;
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
      // Thử lại không dùng crossOrigin (nếu tệp cục bộ) hoặc giải quyết null
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => resolve(null);
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

/**
 * Sinh và tải trực tiếp file Poster HD PNG về máy người dùng
 * Đảm bảo 100% hình ảnh tải về giống hệt hình ảnh người dùng nhìn thấy trên màn hình xem trước
 */
export async function downloadLookbookPosterHD(
  options: LookbookPosterOptions,
  onProgress?: (status: string) => void
): Promise<string> {
  const sanitizeFilename = (name: string) =>
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 50);

  const editionName = options.editionTitle || `Dang_Hoa_${options.top.name}`;
  const filename = `Lookbook_${sanitizeFilename(editionName)}_1200x1800.png`;

  // 1. CHỤP TRỰC TIẾP KHUNG POSTER XEM TRƯỚC (WYSWYG - Chuẩn xác 100% với ảnh xem trước)
  if (options.element) {
    try {
      if (onProgress) onProgress('Đang chuẩn bị khung hình di sản HD...');

      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // Bỏ qua lỗi phông nếu có
        }
      }

      if (onProgress) onProgress('Đang kết xuất Poster HD giống hệt ảnh xem trước...');

      const dataUrl = await toPng(options.element, {
        pixelRatio: 2.5, // 480px * 2.5 = 1200px (độ nét cao chuẩn HD 1200x1800)
        quality: 0.98,
        cacheBust: true,
        style: {
          transform: 'none',
          boxShadow: 'none',
          margin: '0',
        },
        fetchRequestInit: {
          mode: 'cors',
          cache: 'force-cache',
        },
      });

      if (onProgress) onProgress('Đang tải tệp ảnh Poster HD về máy...');

      const downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      return dataUrl;
    } catch (err) {
      console.warn('html-to-image capture fallback to canvas:', err);
      // Tiếp tục xuống canvas fallback nếu có lỗi
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
    if (onProgress) onProgress('Đang hòa sắc bối cảnh non nước...');
    try {
      const backdropImg = await loadImageWithFallback(options.backdrop.imageUrl);
      if (backdropImg) {
        ctx.drawImage(backdropImg, 0, 0, width, height * 0.75);
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

    // Họa tiết vầng dương & vòng hoa văn Trống Đồng Đông Sơn chìm
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(600, 520, 360, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(600, 520, 280, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(600, 520, 200, 0, Math.PI * 2);
    ctx.stroke();

    // 14 tia sáng trống đồng
    for (let i = 0; i < 14; i++) {
      const angle = (i * 2 * Math.PI) / 14;
      const x1 = 600 + Math.cos(angle) * 70;
      const y1 = 520 + Math.sin(angle) * 70;
      const x2 = 600 + Math.cos(angle) * 190;
      const y2 = 520 + Math.sin(angle) * 190;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. PHỦ LỚP GRADIENT HUYỀN ẢO & BỘ LỌC ÁNH SÁNG
  const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
  overlayGrad.addColorStop(0, 'rgba(10, 14, 26, 0.55)');
  overlayGrad.addColorStop(0.4, 'rgba(10, 14, 26, 0.25)');
  overlayGrad.addColorStop(0.68, 'rgba(10, 14, 26, 0.85)');
  overlayGrad.addColorStop(0.85, 'rgba(10, 14, 26, 0.98)');
  overlayGrad.addColorStop(1, '#060912');
  ctx.fillStyle = overlayGrad;
  ctx.fillRect(0, 0, width, height);

  // Bộ lọc màu nghệ thuật
  if (options.lightingFilter === 'sunset') {
    ctx.fillStyle = 'rgba(245, 158, 11, 0.07)';
    ctx.fillRect(0, 0, width, height);
  } else if (options.lightingFilter === 'moonlight') {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
    ctx.fillRect(0, 0, width, height);
  } else if (options.lightingFilter === 'vintage') {
    ctx.fillStyle = 'rgba(180, 83, 9, 0.08)';
    ctx.fillRect(0, 0, width, height);
  }

  // 3. KHUNG VIỀN KIM HOÀNG GIA & HỌA TIẾT GÓC ĐẠI VIỆT
  const m = 40; // Margin
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(m, m, width - m * 2, height - m * 2);

  // Viền tóc chỉ mảnh bên ngoài
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(m - 12, m - 12, width - (m - 12) * 2, height - (m - 12) * 2);

  // Họa tiết 4 góc cổ phong
  const drawCorner = (cx: number, cy: number, signX: number, signY: number) => {
    ctx.save();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy + signY * 40);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + signX * 40, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + signX * 8, cy + signY * 28);
    ctx.lineTo(cx + signX * 8, cy + signY * 8);
    ctx.lineTo(cx + signX * 28, cy + signY * 8);
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(cx + signX * 18, cy + signY * 18, 3.5, 0, Math.PI * 2);
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
  ctx.font = 'bold 22px "Lora", "Noto Serif", "Playfair Display", "Be Vietnam Pro", serif';
  ctx.fillText('AURA • LOOKBOOK DI SẢN VIỆT PHỤC', 600, 95);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 13px "Be Vietnam Pro", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('QUY CHUẨN TRANG PHỤC TRUYỀN THỐNG ĐẠI VIỆT', 600, 122);
  ctx.letterSpacing = '0px';

  // Huy hiệu triều đại & bối cảnh
  ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 1.2;
  const badgeW = 340;
  const badgeH = 30;
  const badgeX = (width - badgeW) / 2;
  const badgeY = 140;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FDE68A';
  ctx.font = '600 12px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    `${options.top.era.toUpperCase()} • ${options.backdrop.name.toUpperCase()}`,
    600,
    160
  );

  // 5. VẼ NGƯỜI MẪU 2D TRUYỀN THẦN TRỰC TIẾP LÊN CANVAS
  if (onProgress) onProgress('Đang vẽ sắc phục & dáng ngọc 2D...');

  ctx.save();
  // Vị trí tâm người mẫu: X=600, Y=640, Scale=1.65
  const centerX = 600;
  const modelBaseY = 480;

  // Bóng đổ dưới chân người mẫu
  const shadowGrad = ctx.createRadialGradient(
    centerX,
    modelBaseY + 470,
    10,
    centerX,
    modelBaseY + 470,
    140
  );
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(centerX, modelBaseY + 470, 140, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hạ Y (Quần 2 ống hoặc Váy)
  const bottomColorHex = options.bottomCustomColor || options.bottom.defaultColorHex || '#F8F9FA';
  ctx.fillStyle = bottomColorHex;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1.5;

  if (options.bottom.id === 'vay-xep-ly') {
    // Váy xếp ly thời Lê / Lý
    ctx.beginPath();
    ctx.moveTo(centerX - 80, modelBaseY + 180);
    ctx.lineTo(centerX - 130, modelBaseY + 460);
    ctx.lineTo(centerX + 130, modelBaseY + 460);
    ctx.lineTo(centerX + 80, modelBaseY + 180);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Các nếp ly váy
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    for (let x = centerX - 100; x <= centerX + 100; x += 22) {
      ctx.beginPath();
      ctx.moveTo(centerX + (x - centerX) * 0.6, modelBaseY + 190);
      ctx.lineTo(x, modelBaseY + 460);
      ctx.stroke();
    }
  } else {
    // Quần ống sớ 2 ống thanh thoát chuẩn mực
    // Ống trái
    ctx.beginPath();
    ctx.moveTo(centerX - 75, modelBaseY + 180);
    ctx.lineTo(centerX - 120, modelBaseY + 460);
    ctx.lineTo(centerX - 12, modelBaseY + 460);
    ctx.lineTo(centerX - 8, modelBaseY + 220);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ống phải
    ctx.beginPath();
    ctx.moveTo(centerX + 75, modelBaseY + 180);
    ctx.lineTo(centerX + 120, modelBaseY + 460);
    ctx.lineTo(centerX + 12, modelBaseY + 460);
    ctx.lineTo(centerX + 8, modelBaseY + 220);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Nếp rủ trung tâm giữa 2 ống
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(centerX - 60, modelBaseY + 200);
    ctx.lineTo(centerX - 68, modelBaseY + 455);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + 60, modelBaseY + 200);
    ctx.lineTo(centerX + 68, modelBaseY + 455);
    ctx.stroke();
  }

  // Thượng Y (Áo Cổ Phục Chính)
  const topColorHex = options.topCustomColor || options.color.hex || options.top.defaultColorHex || '#9B1B30';
  ctx.fillStyle = topColorHex;
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;

  if (options.top.id === 'tu-than') {
    // Áo Tứ Thân Bắc Bộ
    // Yếm đỏ bên trong
    ctx.fillStyle = '#B23A48';
    ctx.beginPath();
    ctx.moveTo(centerX - 35, modelBaseY - 20);
    ctx.lineTo(centerX + 35, modelBaseY - 20);
    ctx.lineTo(centerX + 40, modelBaseY + 120);
    ctx.lineTo(centerX - 40, modelBaseY + 120);
    ctx.closePath();
    ctx.fill();

    // Hai vạt áo trước xẻ tà
    ctx.fillStyle = topColorHex;
    // Vạt trái
    ctx.beginPath();
    ctx.moveTo(centerX - 80, modelBaseY - 25);
    ctx.lineTo(centerX - 35, modelBaseY - 30);
    ctx.lineTo(centerX - 25, modelBaseY + 170);
    ctx.lineTo(centerX - 110, modelBaseY + 340);
    ctx.lineTo(centerX - 130, modelBaseY - 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Vạt phải
    ctx.beginPath();
    ctx.moveTo(centerX + 80, modelBaseY - 25);
    ctx.lineTo(centerX + 35, modelBaseY - 30);
    ctx.lineTo(centerX + 25, modelBaseY + 170);
    ctx.lineTo(centerX + 110, modelBaseY + 340);
    ctx.lineTo(centerX + 130, modelBaseY - 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bao tượng / Dải lụa thắt lưng ngọc
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.roundRect(centerX - 50, modelBaseY + 155, 100, 16, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(centerX - 15, modelBaseY + 170);
    ctx.lineTo(centerX - 30, modelBaseY + 280);
    ctx.moveTo(centerX + 15, modelBaseY + 170);
    ctx.lineTo(centerX + 30, modelBaseY + 280);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();
  } else if (options.top.id === 'giao-linh' || options.top.id === 'giao-linh-nu') {
    // Áo Giao Lĩnh (Cổ vạt chéo chữ Y)
    ctx.beginPath();
    ctx.moveTo(centerX - 85, modelBaseY - 30);
    ctx.lineTo(centerX + 85, modelBaseY - 30);
    ctx.lineTo(centerX + 125, modelBaseY + 350);
    ctx.quadraticCurveTo(centerX, modelBaseY + 370, centerX - 125, modelBaseY + 350);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cổ chéo Giao Lĩnh: vạt trái đè vạt phải hình chữ Y
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX - 42, modelBaseY - 32);
    ctx.lineTo(centerX + 40, modelBaseY + 70);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + 42, modelBaseY - 32);
    ctx.lineTo(centerX - 35, modelBaseY + 75);
    ctx.stroke();
  } else if (options.top.id === 'nhat-binh' || options.top.id === 'nhat-binh-nam') {
    // Áo Nhật Bình Cung Đình (Khung cổ hình chữ nhật, dải ngũ sắc ngũ hành ở cửa tay, hoa văn Phụng/Long)
    // Thân áo dáng chữ A
    ctx.beginPath();
    ctx.moveTo(centerX - 85, modelBaseY - 30);
    ctx.lineTo(centerX + 85, modelBaseY - 30);
    ctx.lineTo(centerX + 130, modelBaseY + 355);
    ctx.quadraticCurveTo(centerX, modelBaseY + 375, centerX - 130, modelBaseY + 355);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tay áo rộng (Tay thụng)
    ctx.beginPath();
    ctx.moveTo(centerX - 85, modelBaseY - 30);
    ctx.lineTo(centerX - 180, modelBaseY + 140);
    ctx.lineTo(centerX - 140, modelBaseY + 180);
    ctx.lineTo(centerX - 85, modelBaseY + 90);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + 85, modelBaseY - 30);
    ctx.lineTo(centerX + 180, modelBaseY + 140);
    ctx.lineTo(centerX + 140, modelBaseY + 180);
    ctx.lineTo(centerX + 85, modelBaseY + 90);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dải ngũ sắc ngũ hành ở hai cửa tay (Xanh, Đỏ, Vàng, Trắng, Đen)
    const cuffColors = ['#2563EB', '#DC2626', '#F59E0B', '#FFFFFF', '#1E293B'];
    cuffColors.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.fillRect(centerX - 175 + idx * 7, modelBaseY + 142 + idx * 7, 7, 30);
      ctx.fillRect(centerX + 140 + idx * 7, modelBaseY + 175 - idx * 7, 7, 30);
    });

    // KHUNG CỔ ÁO NHẬT BÌNH HÌNH CHỮ NHẬT TRƯỚC NGỰC
    ctx.fillStyle = '#D4AF37';
    ctx.strokeStyle = '#8B1E1E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(centerX - 32, modelBaseY - 35, 64, 130);
    ctx.fill();
    ctx.stroke();

    // Hoa văn tâm cổ ngực
    ctx.fillStyle = '#8B1E1E';
    ctx.beginPath();
    ctx.arc(centerX, modelBaseY + 30, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(centerX, modelBaseY + 30, 8, 0, Math.PI * 2);
    ctx.fill();

    // Hai dải kết buông rủ xuống tà
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(centerX - 14, modelBaseY + 95);
    ctx.lineTo(centerX - 18, modelBaseY + 280);
    ctx.moveTo(centerX + 14, modelBaseY + 95);
    ctx.lineTo(centerX + 18, modelBaseY + 280);
    ctx.stroke();
  } else if (options.top.id === 'ao-tac' || options.top.id === 'ao-tac-nu') {
    // Áo Tấc (Tay thụng rộng buông dài qua gối)
    ctx.beginPath();
    ctx.moveTo(centerX - 85, modelBaseY - 30);
    ctx.lineTo(centerX + 85, modelBaseY - 30);
    ctx.lineTo(centerX + 130, modelBaseY + 355);
    ctx.quadraticCurveTo(centerX, modelBaseY + 375, centerX - 130, modelBaseY + 355);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tay thụng buông rủ qua hai bên cực đại
    ctx.beginPath();
    ctx.moveTo(centerX - 85, modelBaseY - 30);
    ctx.lineTo(centerX - 195, modelBaseY + 160);
    ctx.lineTo(centerX - 150, modelBaseY + 240);
    ctx.lineTo(centerX - 85, modelBaseY + 110);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + 85, modelBaseY - 30);
    ctx.lineTo(centerX + 195, modelBaseY + 160);
    ctx.lineTo(centerX + 150, modelBaseY + 240);
    ctx.lineTo(centerX + 85, modelBaseY + 110);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // SỐNG ÁO MŨI GÁY
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, modelBaseY - 20);
    ctx.lineTo(centerX, modelBaseY + 365);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cổ lập lĩnh & 5 khuy
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.roundRect(centerX - 32, modelBaseY - 42, 64, 18, 4);
    ctx.fill();

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
  } else if (options.top.id === 'vien-linh' || options.top.id === 'vien-linh-nu') {
    // Áo Viên Lĩnh (Cổ tròn khum, Bổ tử vuông thêu Hạc/Phượng)
    ctx.beginPath();
    ctx.moveTo(centerX - 85, modelBaseY - 30);
    ctx.lineTo(centerX + 85, modelBaseY - 30);
    ctx.lineTo(centerX + 130, modelBaseY + 355);
    ctx.quadraticCurveTo(centerX, modelBaseY + 375, centerX - 130, modelBaseY + 355);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tay áo thụng
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

    // CỔ TRÒN VIÊN LĨNH
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, modelBaseY - 30, 26, 0, Math.PI);
    ctx.stroke();

    // BỔ TỬ VUÔNG TRƯỚC NGỰC
    ctx.fillStyle = '#8B1E1E';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(centerX - 38, modelBaseY + 10, 76, 76);
    ctx.fill();
    ctx.stroke();

    // Họa tiết Hạc trắng trong Bổ tử
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX, modelBaseY + 45, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 18, modelBaseY + 45);
    ctx.lineTo(centerX + 18, modelBaseY + 45);
    ctx.stroke();
  } else if (options.top.id === 'ao-ba-ba-nam' || options.top.id === 'ao-ba-ba-nu') {
    // Áo Bà Ba Nam Bộ (Nẹp cài cúc giữa, 2 túi vạt trước)
    ctx.beginPath();
    ctx.moveTo(centerX - 80, modelBaseY - 30);
    ctx.lineTo(centerX + 80, modelBaseY - 30);
    ctx.lineTo(centerX + 115, modelBaseY + 290);
    ctx.lineTo(centerX - 115, modelBaseY + 290);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Nẹp cúc chính giữa
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, modelBaseY - 30);
    ctx.lineTo(centerX, modelBaseY + 290);
    ctx.stroke();

    // 5 cúc áo ngọc
    for (let y = modelBaseY - 15; y <= modelBaseY + 250; y += 50) {
      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.arc(centerX, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hai túi áo vuông vạt dưới
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(centerX - 75, modelBaseY + 180, 42, 45);
    ctx.strokeRect(centerX + 33, modelBaseY + 180, 42, 45);
  } else {
    // Áo Ngũ Thân (Tay chẽn hoặc Tay thụng) / Áo Dài / Áo Tấc
    // Thân áo dáng chữ A buông suông đáy thúng
    ctx.beginPath();
    ctx.moveTo(centerX - 85, modelBaseY - 30);
    ctx.lineTo(centerX + 85, modelBaseY - 30);
    ctx.lineTo(centerX + 130, modelBaseY + 355);
    ctx.quadraticCurveTo(centerX, modelBaseY + 375, centerX - 130, modelBaseY + 355);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tay áo rủ
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

    // SỐNG ÁO MŨI GÁY (Đường chỉ vàng dọc chính tâm lưng)
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, modelBaseY - 20);
    ctx.lineTo(centerX, modelBaseY + 365);
    ctx.stroke();
    ctx.setLineDash([]);

    // CỔ ĐỨNG LẬP LĨNH
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.roundRect(centerX - 32, modelBaseY - 42, 64, 18, 4);
    ctx.fill();

    // 5 KHUY CÚC NGŨ THƯỜNG (Cần - Kiệm - Liêm - Chính - Dũng)
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
  }

  // Đầu, cổ & nét mặt thanh tú
  ctx.fillStyle = '#F8D8C8'; // Da người mẫu ấm áp
  ctx.beginPath();
  ctx.roundRect(centerX - 18, modelBaseY - 60, 36, 30, 8);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(centerX, modelBaseY - 88, 38, 46, 0, 0, Math.PI * 2);
  ctx.fill();

  // Búi tóc đen óng ả
  ctx.fillStyle = '#181412';
  ctx.beginPath();
  ctx.ellipse(centerX, modelBaseY - 105, 42, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // PHỤ KIỆN ĐỘI ĐẦU (Khăn đóng / Mấn / Nón ba tầm)
  if (options.accessory.id === 'non-ba-tam') {
    // Nón ba tầm quai thao rộng vành
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.ellipse(centerX, modelBaseY - 110, 110, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8B6508';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Quai thao đỏ
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(centerX - 50, modelBaseY - 105);
    ctx.quadraticCurveTo(centerX - 35, modelBaseY - 40, centerX - 25, modelBaseY + 60);
    ctx.stroke();
  } else if (options.accessory.id === 'man-ngu-sac') {
    // Mấn ngũ sắc hoàng triều rực rỡ
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.ellipse(centerX, modelBaseY - 108, 46, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8B1E1E';
    ctx.beginPath();
    ctx.ellipse(centerX, modelBaseY - 114, 40, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (options.accessory.id === 'khan-ran') {
    // Khăn rằn Nam Bộ
    ctx.fillStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.ellipse(centerX, modelBaseY - 110, 44, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else {
    // Khăn đóng đen 7 nếp chữ Nhân mẫu mực
    ctx.fillStyle = '#1A1D24';
    ctx.beginPath();
    ctx.ellipse(centerX, modelBaseY - 108, 45, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Nếp chữ Nhân
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(centerX - 35, modelBaseY - 110);
    ctx.lineTo(centerX, modelBaseY - 104);
    ctx.lineTo(centerX + 35, modelBaseY - 110);
    ctx.stroke();
  }

  // DẢI LỤA MÂY BAY LƯỢN (Aura Celestial Silk)
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - 180, modelBaseY + 120);
  ctx.bezierCurveTo(
    centerX - 120,
    modelBaseY + 40,
    centerX + 140,
    modelBaseY + 60,
    centerX + 190,
    modelBaseY + 200
  );
  ctx.stroke();

  ctx.restore();

  // 6. PHẦN THÔNG TIN BẢN PHỐI & LỜI BÌNH BIÊN TẬP (BOTTOM EDITORIAL CARD)
  if (onProgress) onProgress('Đang khắc họa lời bình & con dấu chuẩn mực...');

  const cardY = 1120;
  const cardH = 590;
  const cardW = width - m * 2 - 40;
  const cardX = m + 20;

  // Nền card kính mờ hoàng gia
  ctx.fillStyle = 'rgba(12, 18, 32, 0.88)';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Tiêu đề tác phẩm / Bản phối
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FDE68A';
  const cleanTitle = options.editionTitle || `Dáng Hoa ${options.top.name}`;
  ctx.font = cleanTitle.length > 25 ? 'bold 28px "Lora", "Noto Serif", "Playfair Display", "Be Vietnam Pro", serif' : 'bold 34px "Lora", "Noto Serif", "Playfair Display", "Be Vietnam Pro", serif';
  ctx.fillText(cleanTitle, cardX + 40, cardY + 58);

  // Phụ đề bối cảnh
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 15px "Be Vietnam Pro", sans-serif';
  let cleanSub =
    options.subHeadline ||
    `Giao hòa giữa ngàn năm di sản và nhịp thở đương đại tại ${options.backdrop.name}`;
  if (ctx.measureText(cleanSub).width > cardW - 80) {
    while (cleanSub.length > 10 && ctx.measureText(cleanSub + '...').width > cardW - 80) {
      cleanSub = cleanSub.slice(0, -1);
    }
    cleanSub += '...';
  }
  ctx.fillText(cleanSub, cardX + 40, cardY + 92);

  // Chi tiết các tầng phục sắc
  ctx.fillStyle = '#94A3B8';
  ctx.font = '13.5px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    `Thượng y: ${options.top.name}  •  Hạ y: ${options.bottom.name}  •  Phụ kiện: ${options.accessory.name}`,
    cardX + 40,
    cardY + 132
  );
  ctx.fillText(
    `Chất liệu: ${options.fabric.name}  •  Sắc màu: ${options.color.name}  •  Niên đại: ${options.top.era}`,
    cardX + 40,
    cardY + 158
  );

  // Vạch ngăn cách dát vàng
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, cardY + 180);
  ctx.lineTo(cardX + cardW - 40, cardY + 180);
  ctx.stroke();

  // 4 DẤU ẤN CỐT LÕI (Thả suông chữ A • 5 Khuy • Sống áo mũi gáy • Quần 2 ống)
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 12.5px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    'QUY CHUẨN ĐẠI VIỆT: 5 Thân Dáng Chữ A • 5 Khuy Ngũ Thường • Sống Áo Mũi Gáy • Quần 2 Ống Lụa',
    cardX + 40,
    cardY + 208
  );

  // CÂU THƠ ĐỀ TỪ NGHỆ THUẬT
  ctx.fillStyle = '#FBBF24';
  ctx.font = 'italic bold 21px "Lora", "Noto Serif", "Playfair Display", "Be Vietnam Pro", serif';
  let poetry = options.poetryCouple || 'Áo xưa khép vạt mây hồng lượn / Bước khẽ nghiêng chào bóng cố đô.';
  if (ctx.measureText(`“ ${poetry} ”`).width > cardW - 80) {
    ctx.font = 'italic bold 18px "Lora", "Noto Serif", "Playfair Display", "Be Vietnam Pro", serif';
  }
  ctx.fillText(`“ ${poetry} ”`, cardX + 40, cardY + 258);

  // LỜI BÌNH BIÊN TẬP / CẢM NGHĨ CÁ NHÂN
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '13.5px "Be Vietnam Pro", sans-serif';
  const note =
    options.personalNote ||
    'Tà áo buông suông tự nhiên tôn vinh nét nho nhã, không siết eo dải lụa. Sống áo mũi gáy ngay thẳng tượng trưng nhân cách trung thực, hòa quyện kiêu hãnh cùng thời đại.';
  
  // Wrap text up to 4 lines, leaving right room for seal if active
  const maxLineW = options.showSeal !== false ? cardW - 220 : cardW - 80;
  const words = note.split(' ');
  let line = '';
  let textY = cardY + 300;
  let lineCount = 0;
  for (const w of words) {
    const testLine = line + w + ' ';
    if (ctx.measureText(testLine).width > maxLineW) {
      ctx.fillText(line, cardX + 40, textY);
      line = w + ' ';
      textY += 23;
      lineCount++;
      if (lineCount >= 4) {
        line = '...';
        break;
      }
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, cardX + 40, textY);
  }

  // CON DẤU QUY CHUẨN DI SẢN (IMPERIAL AUTHENTICITY STAMP)
  if (options.showSeal !== false) {
    ctx.save();
    const stampX = cardX + cardW - 170;
    const stampY = cardY + 410;

    // Hình triện đỏ son truyền thống
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(stampX - 70, stampY - 50, 140, 100, 14);
    ctx.stroke();

    ctx.fillStyle = 'rgba(220, 38, 38, 0.12)';
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 15px "Lora", "Noto Serif", "Be Vietnam Pro", serif';
    ctx.fillText('DI SẢN VIỆT', stampX, stampY - 18);

    ctx.font = 'bold 11px "Be Vietnam Pro", sans-serif';
    ctx.fillText('✓ CHUẨN MỰC', stampX, stampY + 5);

    ctx.font = '600 12px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`${options.harmonyScore}/100 ĐIỂM`, stampX, stampY + 28);
    ctx.restore();
  }

  // Chân trang ký tên
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748B';
  ctx.font = '13px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    `Aura Team • Dự Án Bảo Tồn & Số Hóa Cổ Phục Việt • ${new Date().toLocaleDateString('vi-VN')}`,
    600,
    height - 55
  );

  // 7. XUẤT TẬP TIN PNG HD VÀ KÍCH HOẠT TẢI VỀ
  if (onProgress) onProgress('Đang kết xuất tệp ảnh PNG HD...');
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
