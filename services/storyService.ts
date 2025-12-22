
import { Type } from "@google/genai";
import { StoryData, Difficulty } from "../types";
import { getAI, withRetry } from "./geminiService";

/**
 * Generates reading material tailored to the child's difficulty level
 * and chosen topic, following the rules in STORY_GUIDELINES.md.
 */
export const generateReadingMaterial = async (topicContext: string, difficulty: Difficulty): Promise<StoryData> => {
  return withRetry(async () => {
    const ai = getAI();
    
    // Core instructions strictly derived from STORY_GUIDELINES.md
    const baseSystemInstruction = `
      You are a children’s storytelling assistant. Use standard, neutral English suitable for international children.
      - Strictly follow the STORY_GUIDELINES for sentence counts and paragraphing.
      - Do not use slang, idioms, colloquial expressions, or regional language.
      - Use short paragraphs and insert a blank line between them (\n\n).
      - Do not include headings, labels, bullet points, or metadata.
      - Output ONLY the story content in the JSON text field.
      - Tone: Warm, calm, and encouraging.
    `;

    let levelSpecifics = "";
    if (difficulty === 'easy') {
      levelSpecifics = `
        Difficulty: Easy (Age ~6).
        Constraint: EXACTLY 6 to 8 sentences total. 
        Sentence Length: 6 to 10 words each.
        Vocabulary: Common, everyday words. One main character. Simple actions.
        Paragraphs: 1 to 2 sentences per paragraph.
      `;
    } else if (difficulty === 'medium') {
      levelSpecifics = `
        Difficulty: Medium (Age ~8-10).
        Constraint: EXACTLY 10 to 12 sentences total.
        Sentence Length: Natural for speaking practice. Use simple connectors (because, when, after, then).
        Content: Include a simple problem and a clear solution. One main and one supporting character.
        Paragraphs: 2 to 3 sentences per paragraph.
      `;
    } else { // challenge
      levelSpecifics = `
        Difficulty: Challenge (Age ~10, confident reader).
        Constraint: EXACTLY 14 to 18 sentences total.
        Sentence Length: Mix of short and medium. Richer vocabulary (must be easy to pronounce).
        Content: Include clear thoughts or feelings. Realistic and grounded. Include a small lesson or reflection.
        Paragraphs: Up to 3 sentences per paragraph.
      `;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Theme: ${topicContext}
        Instructions: ${baseSystemInstruction}
        ${levelSpecifics}
        Return ONLY a JSON object: { "text": "..." }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { text: { type: Type.STRING } },
            required: ["text"]
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text) as StoryData;
        return data;
      }
      throw new Error("No text generated");
    } catch (error) {
      console.error("Story generation failed, returning fallback:", error);
      return { text: "The garden is full of bright flowers.\n\nThey grow tall in the warm sun.\n\nA small bird flies to the tree.\n\nIt sings a very happy song.\n\nThe cat watches from the grass.\n\nIt is a peaceful morning." };
    }
  });
};
