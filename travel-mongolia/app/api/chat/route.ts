import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: 'Серверийн тохиргоо дутуу байна (API түлхүүр алга).' });
    }

    const { message, destination } = await req.json();

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: `Та Монголын аяллын мэргэжлийн дижитал зөвлөх. Хэрэглэгчийн үзэж буй газар: "${destination}". Эелдэг, товч бөгөөд тодорхой, монгол хэлээр аялагчид хэрэгтэй зөвлөгөө өгч хариулна уу.`,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Gemini API алдаа:', error);
    return NextResponse.json({ 
      reply: `Холболтонд алдаа гарлаа: ${error?.message || 'Дахин оролдоно уу'}` 
    });
  }
}