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
    const { domain, websiteName, features, targetAudience, mainGoal, designStyle } = await req.json();

    const systemInstruction = `You are an expert frontend engineer and UI/UX designer. Your goal is to generate beautiful, modern, conversion-optimized HTML code.
    IMPORTANT RULES:
    1. Output MUST be perfectly valid HTML using inline Tailwind CSS classes.
    2. Do NOT output a full HTML document (no <html>, <head>, <body>). Only output the inner contents (like a <main> tag containing sections).
    3. Use stunning design aesthetics: soft shadows (shadow-xl, shadow-2xl), rounded corners (rounded-2xl, rounded-3xl), gradients (bg-gradient-to-r, from-*, to-*), and readable typography.
    4. Implement ALL the specific sections/features the user requests (e.g., if they ask for Gallery, include a gallery section).
    5. Output the results strictly according to the provided JSON schema.`;

    const prompt = `Generate a complete, beautiful HTML layout for a ${domain} business named "${websiteName}". 
    Key Sections/Features requested: ${features || "None specified. Include a Hero, Features, and Footer section."}.
    Target Audience: ${targetAudience || "General"}.
    Main Goal: ${mainGoal || "Provide Information"}.
    Design Style Preference: ${designStyle || "Modern & Clean"}.
    Make sure to write out the actual HTML with text, stunning images, and fully styled Tailwind elements.
    CRITICAL: For all images, you MUST use this image service: https://picsum.photos/seed/{unique_word}/800/600
    Example: <img src="https://picsum.photos/seed/burger/800/600" alt="Burger" />
    Provide a truly impressive, premium result!`;

    let lastError: any = null;
    const fallbackModels = [
      "gemini-2.5-flash",                                     // Attempt 1: Google SDK
      "google/gemini-2.0-pro-exp-02-05:free",                 // Attempt 2: OpenRouter Free
      "google/gemini-2.0-flash-lite-preview-02-05:free",      // Attempt 3: OpenRouter Free
      "meta-llama/llama-3.3-70b-instruct:free",               // Attempt 4: OpenRouter Free
      "qwen/qwen-2.5-coder-32b-instruct:free",                // Attempt 5: OpenRouter Free
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
        
        // Ensure no markdown backticks wrap the OpenRouter output
        if (text.startsWith("\`\`\`json")) text = text.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "");
        
        const data = JSON.parse(text.trim());
        return NextResponse.json(data);
      } catch (error: any) {
        console.warn(`Attempt ${attempt} failed for website generation:`, error.message);
        lastError = error;
        if (attempt < maxRetries) {
          // Exponential backoff: 2s, then 4s
          await new Promise(res => setTimeout(res, 2000 * attempt));
        }
      }
    }
    
    throw lastError;
  } catch (error: any) {
    console.error("Error generating website:", error);
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
