import { GoogleGenAI } from "@google/genai";
import type { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
أنت مساعد ذكاء اصطناعي متخصص في الشؤون الإسلامية. 
مهمتك هي الإجابة على الأسئلة المتعلقة بالدين الإسلامي. 
استخدم البحث على الويب للعثور على إجابات من مصادر إسلامية موثوقة.
عند تقديم الإجابة، يجب عليك ذكر مصادر المعلومات التي استخدمتها. 
إذا طرح المستخدم سؤالاً لا يتعلق بالدين الإسلامي، يجب عليك الرد بلطف واعتذار قائلاً: 'اعتذر، أنا متخصص فقط في الإجابة على الأسئلة الدينية الإسلامية.'. 
لا تجب على أي سؤال غير ديني تحت أي ظرف.
`;


export async function getReligiousAnswer(query: string): Promise<ChatMessage> {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
            systemInstruction: systemInstruction,
            tools: [{googleSearch: {}}],
        },
    });

    const text = response.text;
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const sources = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!(web?.uri && web.title))
      .map(web => ({ uri: web.uri, title: web.title }));

    // FIX: Replaced `Array.from(new Map(...).values())` with a method using a plain object
    // to derive unique sources. This is more robust against TypeScript environments with
    // potential issues in iterator type inference, which was causing `uniqueSources` to be
    // typed as `unknown[]`.
    const uniqueSourcesMap: Record<string, { uri: string; title: string }> = {};
    for (const source of sources) {
      uniqueSourcesMap[source.uri] = source;
    }
    const uniqueSources = Object.values(uniqueSourcesMap);

    return {
      role: 'model',
      content: text,
      sources: uniqueSources,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      role: 'system',
      content: 'حدث خطأ أثناء محاولة الحصول على إجابة. يرجى المحاولة مرة أخرى.',
    };
  }
}
