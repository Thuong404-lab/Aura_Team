import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { top, bottom, accessory, fabric, color, era } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_')) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });
      const systemInstruction = `Bạn là Trưởng ban Nghiên cứu Di sản & Trang phục Cổ truyền Việt Nam.
Hãy đánh giá mức độ hài hòa, đúng đắn lịch sử và tính thẩm mỹ thời trang của bộ Việt phục người dùng vừa phối.
Trả về định dạng JSON:
{
  "score": number (từ 85 đến 100),
  "ratingBadge": "string (Ví dụ: 'Xuất sắc', 'Rất hài hòa', 'Chuẩn mực hoàng gia', 'Phá cách tinh tế')",
  "historicalMatchPercent": number (ví dụ: 96),
  "colorHarmonyPercent": number (ví dụ: 94),
  "contextAestheticPercent": number (ví dụ: 95),
  "critiqueTitle": "string (Tiêu đề nhận xét ngắn gọn, ấn tượng)",
  "detailedCritique": "string (3-4 câu nhận xét chi tiết về phom dáng, phối màu và tính trang trọng)",
  "culturalSecret": "string (1 câu tiết lộ thú vị về văn hóa hoặc quy tắc trang phục xưa)",
  "stylingTip": "string (1 lời khuyên thực tế khi mặc chụp ảnh hoặc di chuyển)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Đánh giá bộ phối đồ sau:
- Áo: ${top?.name} (Niên đại: ${era || top?.era})
- Quần/Váy: ${bottom?.name}
- Phụ kiện: ${accessory?.name}
- Chất liệu vải: ${fabric || 'Lụa'}
- Màu sắc: ${color || 'Truyền thống'}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.score) {
        return res.status(200).json({ success: true, data: parsed });
      }
    } catch (err) {
      console.warn('Gemini Harmony call failed on Vercel, fallback:', err);
    }
  }

  // Intelligent fallback calculation
  let score = 94;
  if (top?.era === bottom?.era) score += 2;
  if (top?.id === 'nhat-binh' && accessory?.id === 'man-ngu-sac') score = 98;
  if (top?.id === 'ngu-than' && bottom?.id === 'quan-ong-so') score = 97;
  if (top?.id === 'cach-tan') score = 93;

  return res.status(200).json({
    success: true,
    data: {
      score,
      ratingBadge: score >= 95 ? 'Xuất sắc' : 'Hài Hòa Tinh Tế',
      historicalMatchPercent: score >= 95 ? 97 : 92,
      colorHarmonyPercent: 95,
      contextAestheticPercent: 94,
      critiqueTitle: 'Bản Phối Chuẩn Mực Văn Hóa & Thẩm Mỹ Cổ Phong',
      detailedCritique: `Sự kết hợp giữa ${top?.name || 'Áo ngũ thân'} cùng ${bottom?.name || 'Quần'} và ${accessory?.name || 'Phụ kiện'} tạo nên dáng dấp thanh cao, chuẩn mực lễ giáo cổ phong. Màu ${color || 'truyền thống'} trên chất liệu ${fabric || 'Lụa'} giúp tà áo có độ rủ tự nhiên, tôn vinh vóc dáng.`,
      culturalSecret: top?.cultureInfo?.symbolism || 'Mỗi nếp áo cổ phong Việt Nam đều hàm chứa triết lý Ngũ hành và tinh thần tự cường dân tộc.',
      stylingTip: 'Khi tạo dáng, hãy nhẹ nhàng nâng tà áo hoặc cầm quạt lụa nghiêng 45 độ ngang ngực để khoe trọn hoa văn viền cổ áo.',
    },
  });
}
