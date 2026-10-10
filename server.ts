import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini if valid API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_')) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Suggest Outfit API
app.post('/api/ai/suggest', async (req, res) => {
  const {
    prompt,
    currentTop,
    currentBottom,
    currentAccessory,
    stylingMode = 'auto',
    targetAction = 'full_outfit',
    topCustomColor,
    bottomCustomColor,
  } = req.body;

  if (!prompt && !currentTop && !currentBottom) {
    return res.status(400).json({ error: 'Prompt or current items required' });
  }

  const promptText = prompt || 'Gợi ý bản phối trang phục di sản hài hòa và thời thượng';

  if (ai) {
    try {
      const systemInstruction = `Bạn là Trợ lý AI Cấp cao chuyên gia Thẩm mỹ & Di sản Cổ phục Việt Nam (qua các triều đại Lý, Trần, Lê, Nguyễn và xu hướng thời trang cách tân hiện đại Neo-Vietnamese Heritage).
Nhiệm vụ của bạn là PHÂN TÍCH SỰ KẾT HỢP GIỮA CÁC ITEM CỤ THỂ DỰA TRÊN Ý NGHĨA VĂN HÓA VÀ XU HƯỚNG PHỐI ĐỒ HIỆN ĐẠI, thay vì chỉ trả về các gợi ý tĩnh.

Hãy phân tích mối tương quan giữa Áo (Top), Hạ Y / Quần / Váy (Bottom), và Phụ Kiện (Accessory) cùng Hòa sắc:
1. Ý NGHĨA VĂN HÓA (Cultural Synergy): Phân tích chi tiết tại sao các item này đi với nhau lại mang ý nghĩa sâu sắc (ví dụ: vạt áo ngũ thân đáy thúng kết hợp quần ống sớ trắng tượng trưng thế trực lập đoan chính; cổ chữ nhật Nhật Bình phối mấn ngũ sắc tượng trưng đất trời vuông tròn và ngũ hành tương sinh; cổ giao lĩnh chữ Y kết hợp váy Thủy Ba tạo thế phóng khoáng Đông A).
2. XU HƯỚNG PHỐI ĐỒ HIỆN ĐẠI (Modern Trend Factor): Phân tích cách giới trẻ, nhà thiết kế thời trang hiện đại ứng dụng bản phối này (ví dụ: phong cách Neo-Heritage Minimalist dạo phố, Streetwear kết hợp quần tây cạp cao, chụp ảnh cưới di sản Hoàng gia, trang phục biểu diễn folk-core nghệ thuật đương đại).

Phản hồi ĐÚNG ĐỊNH DẠNG JSON sau:
{
  "recommendedTopId": "nhat-binh" | "ngu-than" | "ngu-than-nu" | "ao-tac" | "ao-tac-nu" | "giao-linh" | "giao-linh-nu" | "vien-linh" | "vien-linh-nu" | "doi-kham" | "tu-than" | "ao-ba-ba-nu" | "ao-ba-ba-nam" | "dong-son",
  "recommendedBottomId": "quan-ong-so" | "quan-men-lam" | "vay-xep-ly" | "quan-gam-vang" | "quan-do-dieu-nu" | "vay-den-kinh-bac-nu" | "quan-ba-ba-den-nu" | "quan-ba-ba-den-nam" | "quan-linh-dai-viet-nam" | "thuong-dai-viet-nu" | "quan-tay-hien-dai" | "kho-dong-son-nam" | "vay-quan-dong-son-nu",
  "recommendedAccessoryId": "man-ngu-sac" | "khan-dong" | "khan-vanh-day-nu" | "ngoc-boi" | "quat-lua" | "hai-theu" | "chuoi-ngoc" | "non-ba-tam-nu" | "khan-mo-qua-nu" | "khan-ran-nam-bo" | "non-la-nam-bo" | "mu-phoc-dau-nam" | "tram-cai-diem-thuy-nu" | "mu-long-chim-dong-son",
  "colorScheme": "string (ví dụ: Đỏ Chu Sa phối Men Lam Cố Đô)",
  "conceptTitle": "string (Tên chủ đề giàu cảm hứng)",
  "characterPersona": "string (Hình tượng nhân vật)",
  "aiAdvice": "string (Lời khuyên phối đồ chi tiết)",
  "culturalNote": "string (Lưu ý hoặc ý nghĩa văn hóa hoa văn)",
  "combinationAnalysis": {
    "synergyScore": number (88 - 99),
    "culturalSynergyTitle": "string",
    "culturalMeaningDetails": "string (Phân tích sâu sắc sự tương hỗ giữa các item cụ thể về mặt văn hóa)",
    "modernTrendDetails": "string (Phân tích xu hướng thời trang đương đại và tính ứng dụng)",
    "colorHarmonyDetails": "string (Phân tích hòa sắc ngũ hành và thị giác)",
    "stylingDirection": "authentic_heritage" | "modern_fusion" | "festive_ceremony" | "daily_casual",
    "stylingDirectionLabel": "string",
    "itemRoles": {
      "heroPiece": { "name": "string", "role": "string", "highlight": "string" },
      "anchorPiece": { "name": "string", "role": "string", "highlight": "string" },
      "accentPiece": { "name": "string", "role": "string", "highlight": "string" }
    },
    "modernOutfitTip": "string (Gợi ý mix phụ kiện hiện đại như kính râm, sneaker, túi mây tre...)"
  },
  "alternatives": {
    "classic": {
      "title": "string",
      "topId": "string",
      "bottomId": "string",
      "accessoryId": "string",
      "vibe": "string",
      "tagline": "string"
    },
    "modernFusion": {
      "title": "string",
      "topId": "string",
      "bottomId": "string",
      "accessoryId": "string",
      "vibe": "string",
      "tagline": "string"
    }
  }
}`;

      const contents = `Ngữ cảnh yêu cầu: "${promptText}".
Đồ người dùng đang chọn:
- Áo: ${currentTop?.name || 'Chưa chọn'}
- Hạ y: ${currentBottom?.name || 'Chưa chọn'}
- Phụ kiện: ${currentAccessory?.name || 'Chưa chọn'}
- Định hướng phong cách: ${stylingMode}
- Hành động mong muốn: ${targetAction}
Hãy phân tích sự kết hợp giữa các item cụ thể dựa trên ý nghĩa văn hóa và xu hướng phối đồ hiện đại.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.recommendedTopId) {
        return res.json({ success: true, data: parsed });
      }
    } catch (err) {
      console.warn('Gemini Suggest call failed or key inactive, using rich cultural fallback:', err);
    }
  }

  // Fallback if no Gemini API key configured or call failed
  const lower = promptText.toLowerCase();
  let topId = 'ngu-than';
  let bottomId = 'quan-ong-so';
  let accId = 'khan-dong';
  let title = 'Thu Nhật Dạo Phố: Áo Ngũ Thân & Quần Ống Sớ';
  let persona = 'Nhã sĩ kinh kỳ phong thái ung dung';
  let advice =
    'Áo Ngũ Thân tay chẽn bằng lụa mỏng nhẹ kết hợp quần ống sớ trắng tạo dáng vẻ tao nhã, thoải mái khi dạo bước ngắm thu.';
  let note =
    'Ngũ thân tượng trưng cho tứ thân phụ mẫu và bản thân người mặc, thể hiện tinh thần khiêm cung đạo hiếu.';
  let colors = 'Sắc chàm nho nhã & Lụa bạch tơ tằm';

  if (stylingMode === 'modern_fusion' || lower.includes('cách tân') || lower.includes('hiện đại')) {
    topId = 'ngu-than';
    bottomId = 'quan-tay-hien-dai';
    accId = 'quat-lua';
    title = 'Neo-Heritage Urban: Áo Ngũ Thân & Quần Tây Cách Tân';
    persona = 'Người trẻ sáng tạo yêu di sản giữa đô thị hiện đại';
    advice =
      'Bản phối kết hợp tà áo năm thân lập lĩnh cổ điển với quần tây cạp cao ống đứng tạo nên phong cách Neo-Vietnamese thời thượng, thích hợp đi làm và dạo phố.';
    note =
      'Sự cách tân tôn trọng cấu trúc 5 thân nguyên bản nhưng giải phóng hạ y giúp người mặc sải bước tự tin năng động.';
    colors = 'Chàm Đêm Than Chì & Lụa Hoàng Kim';
  } else if (lower.includes('cưới') || lower.includes('hôn') || lower.includes('sang') || lower.includes('cung đình')) {
    topId = 'nhat-binh';
    bottomId = 'quan-men-lam';
    accId = 'man-ngu-sac';
    title = 'Hôn Lễ Vương Triều: Áo Nhật Bình Phẩm Phục';
    persona = 'Nữ tử hoàng tộc uy nghi trong ngày đại lễ';
    advice =
      'Áo Nhật Bình sắc đỏ chu sa viền cổ thêu ngũ hành kết hợp mấn ngũ sắc tôn vinh tối đa nét đài các trong lễ trọng.';
    note =
      'Họa tiết cổ áo hình chữ nhật tượng trưng cho trời đất hòa quyện, gắn liền với chúc phúc trăm năm viên mãn.';
    colors = 'Đỏ Chu Sa Cung Đình & Men Lam Cố Đô';
  } else if (lower.includes('lễ') || lower.includes('trang trọng') || lower.includes('chùa') || lower.includes('đền')) {
    topId = 'ao-tac';
    bottomId = 'quan-ong-so';
    accId = 'khan-dong';
    title = 'Nghi Lễ Tôn Nghiêm Chốn Cổ Tự';
    persona = 'Trưởng tử gia tộc trong tuần tế lễ tổ tiên';
    advice =
      'Áo Tấc với tay áo thụ rộng thênh thang mang tính nghi lễ cao nhất của triều Nguyễn, thể hiện sự kính trọng tuyệt đối.';
    note =
      'Khi khoanh tay hành lễ, hai vạt tay thụ phủ kín trước ngực biểu trưng cho lòng thành kính vô lượng.';
    colors = 'Xanh Chàm Mực Thước & Lụa Bạch';
  } else if (lower.includes('trẻ') || lower.includes('nữ') || lower.includes('thơ') || lower.includes('dạo phố')) {
    topId = 'giao-linh-nu';
    bottomId = 'vay-xep-ly';
    accId = 'quat-lua';
    title = 'Thanh Phong Giao Lĩnh & Chân Váy Thủy Ba';
    persona = 'Tiểu thư đài các phong thái nhẹ nhàng tao nhã';
    advice =
      'Sự kết hợp giữa phom Áo Giao Lĩnh cổ chéo chữ Y cùng chân váy xếp ly mang lại nét thanh tao, thoát tục chuẩn mực mỹ học Đại Việt.';
    note =
      'Đường cổ chéo chữ Y vạt trái đè vạt phải tượng trưng cho sự giao hòa âm dương, đoan trang mà phóng khoáng.';
    colors = 'Xanh Lam Ngọc & Chân Váy Đỏ Trầm';
  }

  return res.json({
    success: true,
    data: {
      recommendedTopId: topId,
      recommendedBottomId: bottomId,
      recommendedAccessoryId: accId,
      colorScheme: colors,
      conceptTitle: title,
      characterPersona: persona,
      aiAdvice: advice,
      culturalNote: note,
    },
  });
});

// 2. Check Harmony API
app.post('/api/ai/harmony', async (req, res) => {
  const { top, bottom, accessory, fabric, color, era } = req.body;

  if (ai) {
    try {
      const prompt = `Đánh giá sự hài hòa của bộ Việt phục sau:
- Áo: ${top?.name || 'Chưa chọn'} (${top?.era || ''})
- Quần/Váy: ${bottom?.name || 'Chưa chọn'}
- Phụ kiện: ${accessory?.name || 'Chưa chọn'}
- Chất liệu vải: ${fabric || 'Lụa Hà Đông'}
- Tông màu chủ đạo: ${color || 'Đỏ Điều'}
- Định hướng phong cách: ${era || 'Truyền thống'}

Hãy trả về JSON:
{
  "score": number (từ 88 đến 99),
  "ratingBadge": "Xuất sắc" | "Tuyệt hảo" | "Đậm đà phong vị" | "Đột phá cách tân",
  "historicalMatchPercent": number (85 - 100),
  "colorHarmonyPercent": number (88 - 100),
  "contextAestheticPercent": number (90 - 100),
  "critiqueTitle": "string",
  "detailedCritique": "string (3-4 câu phân tích sự ăn khớp lịch sử, chất liệu vải và hiệu ứng thẩm mỹ)",
  "culturalSecret": "string (1 phát hiện thú vị về ý nghĩa chi tiết hoa văn hoặc tích xưa liên quan)",
  "stylingTip": "string (1 gợi ý nhỏ để bộ trang phục hoàn hảo hơn nữa khi chụp ảnh)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.score) {
        return res.json({ success: true, data: parsed });
      }
    } catch (err) {
      console.warn('Gemini Harmony call failed or key inactive, using rich fallback:', err);
    }
  }

  // High fidelity fallback scoring logic
  let baseScore = 95;
  if (top?.era === 'Triều Nguyễn' && accessory?.id === 'man-ngu-sac') baseScore = 98;
  if (top?.id === 'giao-linh-nu' || top?.id === 'tu-than') baseScore = 96;

  return res.json({
    success: true,
    data: {
      score: baseScore,
      ratingBadge: baseScore >= 95 ? 'Xuất sắc' : 'Hài Hòa Tinh Tế',
      historicalMatchPercent: 96,
      colorHarmonyPercent: 95,
      contextAestheticPercent: 94,
      critiqueTitle: 'Bản Phối Đậm Nét Vương Triều & Cân Bằng Ngũ Hành',
      detailedCritique: `Sự kết hợp giữa ${top?.name || 'Áo Ngũ Thân'} cùng ${bottom?.name || 'Quần Ống Sớ'} và ${accessory?.name || 'Mấn'} tạo nên bố cục thị giác mẫu mực. Chất liệu ${fabric || 'Lụa tơ tằm'} tăng cường độ rủ tự nhiên, tôn vinh phong thái ung dung đoan trang của người mặc.`,
      culturalSecret: 'Đường may vạt con bên trong tượng trưng cho lòng khiêm nhu che chở; 5 chiếc cúc cài đại diện cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín.',
      stylingTip: 'Khi tạo dáng, hãy nhẹ nhàng nâng tà áo hoặc cầm quạt lụa nghiêng 45 độ ngang ngực để khoe trọn hoa văn viền cổ áo.',
    },
  });
});

// 3. Cultural Lookbook Storytelling API
app.post('/api/ai/lookbook-story', async (req, res) => {
  const { top, bottom, accessory, backdropTitle } = req.body;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Hãy viết lời bình Lookbook nghệ thuật phong cách tạp chí thời trang di sản cao cấp cho bức ảnh:
- Trang phục: ${top?.name} phối cùng ${bottom?.name} và ${accessory?.name}.
- Bối cảnh: ${backdropTitle || 'Hoàng Thành Huế'}.
LƯU Ý QUY CHUẨN VĂN HÓA VIỆT PHỤC:
- Tôn vinh cấu trúc 5 thân, tà áo lượn cong dáng chữ A (đáy thúng), đường sống áo "mũi gáy" trung chính giữa lưng và đường may nối ngang ống tay do khổ vải dệt xưa 35-40cm.
- Cổ đứng lập lĩnh 5 khuy cài tượng trưng Ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín) hoặc Ngũ hành.
- Nếu là Áo Nhật Bình: nhấn mạnh cổ đóng khung chữ nhật, 2 dải buộc ngực và viền dải ngũ sắc ngũ hành ở cửa tay.
- Nếu là Áo Giao Lĩnh: nhấn mạnh vạt trái đè vạt phải tạo hình chữ Y, không siết thắt lưng ôm eo kiểu Hán phục.
- Mặc cùng quần 2 ống thanh thoát, mực thước.
Trả về JSON:
{
  "editionTitle": "string (Ví dụ: 'Nét Cố Đô Thu Sắc', 'Kinh Kỳ Phong Hoa')",
  "subHeadline": "string (1 câu ngắn gợi cảm hứng)",
  "editorialStory": "string (Đoạn văn phân tích văn hóa và thời trang 3-4 câu)",
  "poetryCouple": "string (Hai câu thơ hoặc câu đối mang phong vị cổ điển)",
  "photographerNote": "string (Gợi ý góc chụp và ánh sáng)"
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.editionTitle) {
        return res.json({ success: true, data: parsed });
      }
    } catch (err) {
      console.warn('Gemini Story call failed, using rich fallback:', err);
    }
  }

  // Authentic cultural fallback reflecting user's document
  const isNhatBinh = top?.id === 'nhat-binh';
  const isGiaoLinh = top?.id === 'giao-linh';
  const isAoTac = top?.id === 'ao-tac';

  let customStory = `Dưới bóng tường thành rêu phong, tà ${top?.name || 'Áo Ngũ Thân'} buông suông dáng chữ A đáy thúng thanh thoát, tôn vinh đường sống áo mũi gáy trung chính và năm cúc cài ngũ thường mẫu mực. Bản phối cùng ${bottom?.name || 'Quần Ống Sớ'} giữ vẹn nguyên quy cách quần hai ống thanh tao, hòa quyện kiêu hãnh giữa dòng chảy đương đại.`;
  let customCouplet = 'Áo xưa khép vạt mây hồng lượn / Bước khẽ nghiêng chào bóng cố đô.';

  if (isNhatBinh) {
    customStory = `Áo Nhật Bình sắc son quyền quý với khung cổ chữ nhật uy nghi và dải ngũ sắc ngũ hành rực rỡ nơi cửa tay bừng sáng tại ${backdropTitle || 'Hoàng Thành'}. Từng đường kim mũi chỉ thêu phượng hoàng và hoa sen tái hiện đỉnh cao phẩm phục cung đình triều Nguyễn.`;
    customCouplet = 'Cổ Nhật đóng khung nghìn thu sáng / Tay dải ngũ hành rực bóng hoa.';
  } else if (isGiaoLinh) {
    customStory = `Áo Giao Lĩnh với vạt trái đè vạt phải kết chữ Y tự nhiên, tà áo buông lơi thênh thang mang đậm hào khí Đông A và phong vị thiền định thời Lý - Trần. Bản phối mộc mạc kín đáo, hoàn toàn thoát khỏi sự gò bó siết eo ngoại lai.`;
    customCouplet = 'Cổ chéo chữ Y khai chính đạo / Tà buông lơi gió thoảng kinh kỳ.';
  } else if (isAoTac) {
    customStory = `Áo Tấc tay thụng rộng thênh thang biểu trưng cho đạo lý Tứ thân phụ mẫu che chở vạt con khiêm nhu. Khi hai tay chắp trang nghiêm trước ngực, hai tà tay thụng phủ kín đoan trang, thể hiện trọn vẹn lòng thành kính tôn ti trật tự gia tộc.`;
    customCouplet = 'Tay thụng nâng tà nghiêng kính tổ / Ngũ thân trọn vẹn đức khiêm cung.';
  }

  return res.json({
    success: true,
    data: {
      editionTitle: `Dáng Hoa ${top?.name || 'Việt Phục'}`,
      subHeadline: `Bản giao hưởng giữa ngàn năm di sản và nhịp thở đương đại tại ${backdropTitle || 'Cố Đô'}`,
      editorialStory: customStory,
      poetryCouple: customCouplet,
      photographerNote: 'Ánh sáng vàng hoàng hôn góc 30 độ làm nổi bật chất óng ánh của tơ lụa, đường sống áo mũi gáy và hoa văn thêu tay.',
    },
  });
});

// Mount Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
