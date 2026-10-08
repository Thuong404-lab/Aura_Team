import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { top, bottom, accessory, backdropTitle } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_')) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });
      const systemInstruction = `Bạn là Giám đốc Sáng tạo và Biên tập viên Trưởng Tạp chí Thời trang Di sản Việt Nam.
Hãy viết một bài giới thiệu nghệ thuật cho bức ảnh Lookbook thời trang của người dùng.
Trả về JSON:
{
  "editionTitle": "string (Ví dụ: 'Nét Cố Đô Thu Sắc', 'Kinh Kỳ Phong Hoa')",
  "subHeadline": "string (1 câu ngắn gợi cảm hứng)",
  "editorialStory": "string (Đoạn văn phân tích văn hóa và thời trang 3-4 câu)",
  "poetryCouple": "string (Hai câu thơ hoặc câu đối mang phong vị cổ điển)",
  "photographerNote": "string (Gợi ý góc chụp và ánh sáng)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Viết bài giới thiệu Lookbook cho:
- Trang phục: ${top?.name} phối cùng ${bottom?.name} và ${accessory?.name}.
- Bối cảnh: ${backdropTitle || 'Hoàng Thành Huế'}.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.editionTitle) {
        return res.status(200).json({ success: true, data: parsed });
      }
    } catch (err) {
      console.warn('Gemini Story call failed on Vercel, fallback:', err);
    }
  }

  return res.status(200).json({
    success: true,
    data: {
      editionTitle: `Dáng Hoa ${top?.name || 'Việt Phục'}`,
      subHeadline: `Bản giao hưởng giữa ngàn năm di sản và nhịp thở đương đại tại ${backdropTitle || 'Cố Đô'}`,
      editorialStory: `Dưới ánh chiều tà phủ bóng trên từng lớp rêu phong, tà ${top?.name || 'áo truyền thống'} nhẹ lay trong gió như đánh thức ký ức vàng son một thuở. Bản phối không đơn thuần là trang phục, mà là tuyên ngôn của người trẻ tìm về căn cước văn hóa với lòng tự hào kiêu hãnh.`,
      poetryCouple: 'Áo xưa khép vạt mây hồng lượn / Bước khẽ nghiêng chào bóng cố đô.',
      photographerNote: 'Ánh sáng vàng hoàng hôn góc 30 độ làm nổi bật chất óng ánh của tơ lụa và đường kim mũi chỉ thêu tay.',
    },
  });
}
