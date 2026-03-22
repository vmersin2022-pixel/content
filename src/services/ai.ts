import { GoogleGenAI, Type } from "@google/genai";
import { ChannelSettings } from "../store/useContentStore";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateIdeaContent(topic: string): Promise<{title: string, description: string, tags: string[]}[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Сгенерируй 3 креативные идеи для контента на тему: "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Короткий заголовок идеи",
              },
              description: {
                type: Type.STRING,
                description: "Описание идеи в 1-2 предложения",
              },
              tags: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "2-3 тега для идеи",
              },
            },
            required: ["title", "description", "tags"],
          },
        },
      },
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Error generating ideas:", error);
    throw error;
  }
}

export async function generatePostContent(title: string, platform: string, settings?: ChannelSettings): Promise<string> {
  try {
    let prompt = `Напиши текст для поста в ${platform} на тему: "${title}".`;
    
    if (settings) {
      prompt += `\n\nУчитывай следующие правила платформы:
      - Тон общения (Tone of Voice): ${settings.toneOfVoice}
      - Ограничение по символам: около ${settings.characterLimit} символов
      - Правила SEO: ${settings.seoRules}
      - Хэштеги: ${settings.hashtags.join(', ')}
      - Возможные призывы к действию (CTA): ${settings.ctaTemplates.join(' ИЛИ ')}`;
    } else {
      prompt += `\n\nСделай текст вовлекающим, добавь подходящие эмодзи и призыв к действию в конце. 
      Если это Pinterest, сделай упор на SEO-описание и ключевые слова. 
      Если это VK, сделай упор на вовлечение аудитории и обсуждение.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Не удалось сгенерировать текст поста.";
  } catch (error) {
    console.error("Error generating post content:", error);
    return "Произошла ошибка при генерации текста. Попробуйте позже.";
  }
}

export async function improveText(text: string, platform: string, settings?: ChannelSettings): Promise<string> {
  try {
    let prompt = `Улучши следующий текст для публикации в ${platform}. 
    Сделай его более читаемым, исправь ошибки, добавь структуру (абзацы, списки, если нужно) и эмодзи.`;

    if (settings) {
      prompt += `\n\nПри улучшении учитывай следующие правила платформы:
      - Тон общения (Tone of Voice): ${settings.toneOfVoice}
      - Ограничение по символам: около ${settings.characterLimit} символов
      - Правила SEO: ${settings.seoRules}
      - Хэштеги: ${settings.hashtags.join(', ')}`;
    }

    prompt += `\n\nИсходный текст:\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || text;
  } catch (error) {
    console.error("Error improving text:", error);
    return text;
  }
}

export interface PinVariant {
  title: string;
  description: string;
  keywords: string[];
  angle: string;
  search_intent: string;
  cta: string;
  visual_hook: string;
  board_suggestion: string;
}

export async function generatePinPack(
  idea: { title: string; description: string },
  aiInputs: any,
  settings: ChannelSettings,
  amount: number,
  generationBias?: any
): Promise<PinVariant[]> {
  try {
    let prompt = `Generate a Pinterest Pin Pack based on the following idea.
Idea Title: "${idea.title}"
Idea Description: "${idea.description}"

Global Context & AI Inputs:
- Target Audience: ${aiInputs.targetAudience}
- Funnel Stage: ${aiInputs.funnelStage}
- Tone of Voice: ${aiInputs.toneOfVoice}
- Core Keywords: ${aiInputs.keywords}
- Forbidden Words: ${aiInputs.forbiddenWords}
- CTA Style: ${aiInputs.ctaStyle}
- Content Goal: ${aiInputs.contentGoal}

Channel Rules (Pinterest):
- SEO Rules: ${settings.seoRules}
- Character Limit: ${settings.characterLimit}
- Tone: ${settings.toneOfVoice}

Task:
Generate exactly ${amount} unique Pinterest pins. 
CRITICAL INSTRUCTION: Each pin must represent a distinct search angle and must not repeat the same phrasing.
Use angles like: how_to, mistakes, tips, checklist, inspiration, comparison, benefits, beginner_guide.`;

    if (generationBias) {
      prompt += `\n\nAI Optimization Feedback (CRITICAL):
- Preferred Angles: ${generationBias.preferredAngles.join(', ')}
- Avoid Angles: ${generationBias.avoidAngles.join(', ')}
- Best CTA Style: ${generationBias.bestCTA}
Please strictly follow these optimization rules to maximize engagement based on past analytics.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  angle: { type: Type.STRING },
                  search_intent: { type: Type.STRING },
                  cta: { type: Type.STRING },
                  visual_hook: { type: Type.STRING },
                  board_suggestion: { type: Type.STRING },
                },
                required: ["title", "description", "keywords", "angle", "search_intent", "cta", "visual_hook", "board_suggestion"],
              },
            },
          },
          required: ["pins"],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return parsed.pins || [];
    }
    return [];
  } catch (error) {
    console.error("Error generating Pin Pack:", error);
    throw error;
  }
}

export async function generateContentPlanBlueprint(
  idea: { title: string; description: string },
  channelsConfig: any,
  aiInputs: any,
  generationBias?: any
): Promise<any[]> {
  try {
    let prompt = `Create a content plan blueprint for the following idea.
Idea Title: "${idea.title}"
Idea Description: "${idea.description}"

AI Inputs:
- Target Audience: ${aiInputs.targetAudience}
- Funnel Stage: ${aiInputs.funnelStage}

Requested Channels:
${Object.entries(channelsConfig)
  .filter(([_, config]: [string, any]) => config.enabled)
  .map(([platform, config]: [string, any]) => `- ${platform}: ${config.amount} items (${config.contentType})`)
  .join('\n')}

Task:
Generate a preview of the planned output. For each requested channel, provide the specified number of content items with a proposed title and angle.`;

    if (generationBias) {
      prompt += `\n\nAI Optimization Feedback (CRITICAL):
- Preferred Angles: ${generationBias.preferredAngles.join(', ')}
- Avoid Angles: ${generationBias.avoidAngles.join(', ')}
- Best CTA Style: ${generationBias.bestCTA}
Please strictly follow these optimization rules to maximize engagement based on past analytics.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              channel: { type: Type.STRING },
              format: { type: Type.STRING },
              quantity: { type: Type.NUMBER },
              template: { type: Type.STRING },
              audienceStage: { type: Type.STRING },
              status: { type: Type.STRING },
              previews: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    angle: { type: Type.STRING },
                  },
                  required: ["title", "angle"],
                },
              },
            },
            required: ["channel", "format", "quantity", "template", "audienceStage", "status", "previews"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Error generating Content Plan Blueprint:", error);
    throw error;
  }
}
export async function generateVkPost(
  idea: { title: string; description: string },
  aiInputs: any,
  settings: ChannelSettings,
  preview: { title: string; angle: string },
  generationBias?: any
): Promise<{ content: string }> {
  try {
    let prompt = `Generate a VK post based on the following idea and angle.
Idea Title: "${idea.title}"
Idea Description: "${idea.description}"

Global Context & AI Inputs:
- Target Audience: ${aiInputs.targetAudience}
- Funnel Stage: ${aiInputs.funnelStage}
- Tone of Voice: ${aiInputs.toneOfVoice}
- Core Keywords: ${aiInputs.keywords}
- Forbidden Words: ${aiInputs.forbiddenWords}
- CTA Style: ${aiInputs.ctaStyle}
- Content Goal: ${aiInputs.contentGoal}

Channel Rules (VK):
- Tone: ${settings.toneOfVoice}
- Character Limit: ${settings.characterLimit}
- SEO Rules: ${settings.seoRules}
- Hashtags: ${settings.hashtags.join(', ')}
- CTA Templates: ${settings.ctaTemplates.join(' OR ')}

Task Context:
- Post Angle: ${preview.angle}
- Proposed Title: ${preview.title}

Task:
Write the full text for this VK post. Make it engaging, structure it with paragraphs, and include the CTA at the end.`;

    if (generationBias) {
      prompt += `\n\nAI Optimization Feedback (CRITICAL):
- Preferred Angles: ${generationBias.preferredAngles.join(', ')}
- Avoid Angles: ${generationBias.avoidAngles.join(', ')}
- Best CTA Style: ${generationBias.bestCTA}
Please strictly follow these optimization rules to maximize engagement based on past analytics.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
          },
          required: ["content"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { content: "Failed to generate content." };
  } catch (error) {
    console.error("Error generating VK post:", error);
    throw error;
  }
}
