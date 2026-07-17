import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const getAIInstance = (attempt: number) => {
  const primaryKey = process.env.GEMINI_API_KEY;
  const backupKey = process.env.GEMINI_API_KEY_BACKUP;
  // Alternate between primary and backup key on retries, if backup is available
  const apiKey = (attempt % 2 === 0 && backupKey) ? backupKey : primaryKey;
  return new GoogleGenAI({ apiKey });
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    html: { 
      type: Type.STRING, 
      description: "The complete, production-ready HTML code for the website body, utilizing Tailwind CSS utility classes. Make it stunning, modern, and fully responsive. Do not include <html>, <head>, or <body> tags, just the inner content. Do not use markdown backticks." 
    },
    themeColor: { 
      type: Type.STRING, 
      description: "A hex color code representing the primary theme. Must be a valid CSS hex code starting with #." 
    }
  },
  required: ["html", "themeColor"]
};

export async function POST(req: Request) {
  try {
    const { userPrompt, currentSiteData } = await req.json();

    const systemInstruction = `You are a frontend engineer and UI/UX designer. The user will provide their current generated HTML code and a requested change (e.g., "make it blue", "add a pricing section"). 
    Apply the necessary design or structural changes to the HTML using Tailwind CSS while preserving sections that don't need to change. Output perfectly valid HTML.`;

    const prompt = `Current Website JSON Data (contains previous HTML and theme color):
    ${JSON.stringify(currentSiteData, null, 2)}
    
    User's Request: "${userPrompt}"
    
    Rewrite and update the HTML and themeColor to perfectly reflect the user's request. Maintain stunning design aesthetics, soft shadows, rounded corners, gradients, and readable typography.
    CRITICAL: If you need to add or replace any images, you MUST use this image service: https://picsum.photos/seed/{unique_word}/800/600
    Example: <img src="https://picsum.photos/seed/office/1200/600" alt="Office" />`;

    let lastError: any = null;
    const fallbackModels = [
      "gemini-2.5-flash",                     // Attempt 1: Google SDK (Primary Key)
      "google/gemini-2.5-flash",              // Attempt 2: OpenRouter (Suggested slug)
      "anthropic/claude-3.5-sonnet",          // Attempt 3: OpenRouter
      "meta-llama/llama-3.3-70b-instruct",    // Attempt 4: OpenRouter
      "gemini-2.5-pro",                       // Attempt 5: Google SDK
    ];
    const maxRetries = fallbackModels.length;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const currentModel = fallbackModels[attempt - 1];
        
        let text = "";
        
        if (currentModel.includes("/")) {
          const openRouterKey = process.env.OPENROUTER_API_KEY;
          if (!openRouterKey) throw new Error("OpenRouter API Key not found");
          
          const combinedPrompt = `${systemInstruction}\n\n${prompt}\n\nIMPORTANT: You must return ONLY a raw, valid JSON object matching the exact schema: { "html": "<html string>", "themeColor": "#hexcode" }. Do not use markdown blocks.`;
          
          const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openRouterKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: currentModel,
              messages: [{ role: "user", content: combinedPrompt }],
              response_format: { type: "json_object" }
            })
          });
          
          const orData = await orRes.json();
          if (orData.error) throw new Error(orData.error.message || "OpenRouter error");
          
          text = orData.choices?.[0]?.message?.content || "";
        } else {
          const ai = getAIInstance(attempt);
          const response = await ai.models.generateContent({
            model: currentModel,
            contents: prompt,
            config: {
              systemInstruction: systemInstruction,
              responseMimeType: "application/json",
              responseSchema: responseSchema,
            }
          });
          text = response.text || "";
        }

        if (!text) {
          throw new Error("No response generated.");
        }
        
        if (text.startsWith("\`\`\`json")) text = text.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "");
        
        const data = JSON.parse(text.trim());
        return NextResponse.json(data);
      } catch (error: any) {
        console.warn(`Attempt ${attempt} failed for website customization:`, error.message);
        lastError = error;
        if (attempt < maxRetries) {
          // Exponential backoff: 2s, then 4s
          await new Promise(res => setTimeout(res, 2000 * attempt));
        }
      }
    }
    
    throw lastError;
  } catch (error: any) {
    console.error("Error customizing website:", error);
    return NextResponse.json({ error: error.message || "Customization failed" }, { status: 500 });
  }
}
