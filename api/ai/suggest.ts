import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_')) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });
      const systemInstruction = `Bạn là Trợ lý AI chuyên gia về Việt phục (Trang phục truyền thống Việt Nam qua các triều đại Lý, Trần, Lê, Nguyễn và phong cách cách tân hiện đại).
Người dùng sẽ đưa ra yêu cầu (ví dụ: bối cảnh đi dạo phố, đám cưới, lễ hội, dự tiệc, thời tiết, phong cách).
Nhiệm vụ của bạn là phản hồi ĐÚNG ĐỊNH DẠNG JSON sau:
{
  "recommendedTopId": "nhat-binh" | "ngu-than" | "ao-tac" | "giao-linh" | "vien-linh" | "cach-tan" | "ao-yem",
  "recommendedBottomId": "quan-ong-so" | "quan-men-lam" | "vay-xep-ly" | "quan-gam-vang" | "quan-tay-hien-dai",
  "recommendedAccessoryId": "man-ngu-sac" | "khan-dong" | "ngoc-boi" | "quat-lua" | "hai-theu" | "chuoi-ngoc",
  "colorScheme": "string",
  "conceptTitle": "string",
  "characterPersona": "string",
  "aiAdvice": "string",
  "culturalNote": "string"
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
        return res.status(200).json({ success: true, data: parsed });
      }
    } catch (err) {
      console.warn('Gemini Suggest call failed on Vercel, fallback:', err);
    }
  }

  // Authoritative Cultural Fallback
  const lower = (prompt || '').toLowerCase();
  let topId = 'ngu-than';
  let bottomId = 'quan-ong-so';
  let accId = 'khan-dong';
  let title = 'Thu Nhật Dạo Phố';
  let persona = 'Nhã sĩ kinh kỳ phong thái ung dung';
  let advice = `Bản phối Áo Ngũ Thân tay chẽn kết hợp quần ống sớ trắng tạo dáng vẻ tao nhã, thoải mái khi dạo bước. Phù hợp cho yêu cầu: "${prompt}".`;
  let note = 'Ngũ thân tượng trưng cho tứ thân phụ mẫu và đạo hiếu làm người với 5 thân áo và 5 đức tính cao đẹp.';

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
  } else if (lower.includes('cách tân') || lower.includes('hiện đại') || lower.includes('trẻ') || lower.includes('street')) {
    topId = 'cach-tan';
    bottomId = 'vay-xep-ly';
    accId = 'quat-lua';
    title = 'Tân Phong Giao Hòa';
    persona = 'Nhà thiết kế trẻ phong cách Modern Heritage 2026';
    advice = 'Sự kết hợp giữa phom áo cách tân cùng chân váy dập ly mang lại luồng sinh khí hiện đại nhưng vẫn lưu giữ trọn vẹn hồn cốt cổ phong.';
    note = 'Đường cắt may tối giản tôn vinh đường nét cơ thể mà vẫn giữ kín đáo ý nhị.';
  }

  return res.status(200).json({
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
}
