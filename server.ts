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
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (ai) {
    try {
      const systemInstruction = `Bạn là Trợ lý AI chuyên gia về Việt phục (Trang phục truyền thống Việt Nam qua các triều đại Lý, Trần, Lê, Nguyễn và phong cách cách tân hiện đại).
Người dùng sẽ đưa ra yêu cầu (ví dụ: bối cảnh đi dạo phố, đám cưới, lễ hội, dự tiệc, thời tiết, phong cách).
Nhiệm vụ của bạn là phản hồi ĐÚNG ĐỊNH DẠNG JSON sau:
{
  "recommendedTopId": "nhat-binh" | "ngu-than" | "ao-tac" | "giao-linh" | "vien-linh" | "cach-tan" | "ao-yem",
  "recommendedBottomId": "quan-ong-so" | "quan-men-lam" | "vay-xep-ly" | "quan-gam-vang" | "quan-tay-hien-dai",
  "recommendedAccessoryId": "man-ngu-sac" | "khan-dong" | "ngoc-boi" | "quat-lua" | "hai-theu" | "chuoi-ngoc",
  "colorScheme": "string (ví dụ: Đỏ điều phối Trắng ngà, Men lam phối Vàng kim)",
  "conceptTitle": "string (Tên gợi cảm hứng, ví dụ: 'Nét Cố Đô Thanh Lịch', 'Thu Hà Nội Di Sản')",
  "characterPersona": "string (Hình mẫu nhân vật, ví dụ: 'Tiểu thư khuê các tại kinh thành Huế những năm 1920')",
  "aiAdvice": "string (Giải thích ngắn gọn 2-3 câu vì sao bộ này hoàn hảo cho ngữ cảnh)",
  "culturalNote": "string (1-2 câu lưu ý văn hóa hoặc ý nghĩa hoa văn)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Yêu cầu của người dùng: "${prompt}". Hãy gợi ý bản phối Việt phục chuẩn xác và đầy cảm hứng.`,
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
  const lower = prompt.toLowerCase();
  let topId = 'ngu-than';
  let bottomId = 'quan-ong-so';
  let accId = 'khan-dong';
  let title = 'Thu Nhật Dạo Phố';
  let persona = 'Nhã sĩ kinh kỳ phong thái ung dung';
  let advice = 'Áo Ngũ Thân tay chẽn bằng lụa mỏng nhẹ kết hợp quần ống sớ trắng tạo dáng vẻ tao nhã, thoải mái khi dạo bước ngắm thu.';
  let note = 'Ngũ thân tượng trưng cho tứ thân phụ mẫu và bản thân người mặc, thể hiện tinh thần khiêm cung đạo hiếu.';

  if (lower.includes('cưới') || lower.includes('hôn') || lower.includes('sang') || lower.includes('cung đình')) {
    topId = 'nhat-binh';
    bottomId = 'quan-men-lam';
    accId = 'man-ngu-sac';
    title = 'Hôn Lễ Vương Triều';
    persona = 'Nữ tử hoàng tộc uy nghi trong ngày đại lễ';
    advice = 'Áo Nhật Bình sắc đỏ chu sa viền cổ thêu ngũ hành kết hợp mấn ngũ sắc tôn vinh tối đa nét đài các trong lễ trọng.';
    note = 'Họa tiết cổ áo hình chữ nhật tượng trưng cho trời đất hòa quyện, gắn liền với chúc phúc trăm năm viên mãn.';
  } else if (lower.includes('lễ') || lower.includes('trang trọng') || lower.includes('chùa') || lower.includes('đền')) {
    topId = 'ao-tac';
    bottomId = 'quan-ong-so';
    accId = 'khan-dong';
    title = 'Nghi Lễ Tôn Nghiêm';
    persona = 'Trưởng tử gia tộc trong tuần tế lễ tổ tiên';
    advice = 'Áo Tấc với tay áo thụ rộng thênh thang mang tính nghi lễ cao nhất của triều Nguyễn, thể hiện sự kính trọng tuyệt đối.';
    note = 'Khi khoanh tay hành lễ, hai vạt tay thụ phủ kín trước ngực biểu trưng cho lòng thành kính vô lượng.';
  } else if (lower.includes('cách tân') || lower.includes('hiện đại') || lower.includes('trẻ')) {
    topId = 'cach-tan';
    bottomId = 'vay-xep-ly';
    accId = 'quat-lua';
    title = 'Tân Phong Giao Hòa';
    persona = 'Nhà thiết kế trẻ phong cách Modern Heritage 2026';
    advice = 'Sự kết hợp giữa phom áo cách tân cùng chân váy dập ly mang lại luồng sinh khí hiện đại nhưng vẫn lưu giữ trọn vẹn hồn cốt cổ phong.';
    note = 'Đường cắt may tối giản tôn vinh đường nét cơ thể mà vẫn giữ kín đáo ý nhị.';
  }

  return res.json({
    success: true,
    data: {
      recommendedTopId: topId,
      recommendedBottomId: bottomId,
      recommendedAccessoryId: accId,
      colorScheme: 'Sắc thắm Cung đình & Lụa bạch tơ tằm',
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
  if (top?.id === 'cach-tan') baseScore = 93;

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
