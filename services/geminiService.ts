
import { GoogleGenAI, Type } from "@google/genai";
import { SpeakingAnalysis, Difficulty } from "../types";
import { textToSpeech, TTSResponse } from "./ttsService";

// The platform-provided Gemini key for GenAI tasks
export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

let currentAudioSource: AudioBufferSourceNode | null = null;
let currentAudioContext: AudioContext | null = null;
const audioCache = new Map<string, Promise<AudioBuffer>>();

// Track if we've hit a hard quota limit to prevent redundant calls (Gemini only)
let isQuotaExceeded = false;

/**
 * Helper to retry failed API calls with exponential backoff.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 3000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = JSON.stringify(error).toLowerCase();
    const isRateLimit = errorStr.includes('429') || errorStr.includes('resource_exhausted');
    const isDailyLimit = errorStr.includes('quota exceeded') || errorStr.includes('limit: 0');
    
    if (isDailyLimit) {
      isQuotaExceeded = true;
      throw new Error("QUOTA_EXCEEDED");
    }

    if (retries > 0 && (isRateLimit || errorStr.includes('fetch'))) {
      console.warn(`API issue. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

const getAudioContext = () => {
  if (!currentAudioContext || currentAudioContext.state === 'closed') {
    currentAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return currentAudioContext;
};

/**
 * Decodes base64 string to Uint8Array
 */
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM data returned by Gemini TTS.
 * Gemini native audio uses raw 16-bit PCM at 24000Hz.
 */
async function decodePCM(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const stopTextToSpeech = () => {
  if (currentAudioSource) {
    try {
      currentAudioSource.stop();
      currentAudioSource.disconnect();
    } catch (e) {}
    currentAudioSource = null;
  }
};

/**
 * Fetches audio using the dual-provider textToSpeech service.
 * Handles both raw PCM (GenAI) and compressed MP3 (Cloud TTS).
 */
const fetchAudioBuffer = async (text: string): Promise<AudioBuffer> => {
  return await withRetry(async () => {
    const response: TTSResponse = await textToSpeech(text);
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
    
    const binary = decode(response.data);
    
    if (response.format === 'pcm') {
      // Gemini native audio is raw PCM
      return await decodePCM(binary, ctx, 24000, 1);
    } else {
      // Cloud TTS returns standard MP3 files
      return await ctx.decodeAudioData(binary.buffer.slice(0));
    }
  });
};

export const prefetchAudio = (text: string): Promise<AudioBuffer> | undefined => {
  if (!text) return;
  let promise = audioCache.get(text);
  if (!promise) {
    promise = fetchAudioBuffer(text);
    audioCache.set(text, promise);
  }
  return promise;
};

export const playTextToSpeech = async (text: string, onEnded?: () => void): Promise<void> => {
  stopTextToSpeech();

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') await ctx.resume();

    let audioBufferPromise = audioCache.get(text);
    if (!audioBufferPromise) {
        audioBufferPromise = fetchAudioBuffer(text);
        audioCache.set(text, audioBufferPromise);
    }

    const audioBuffer = await audioBufferPromise;
    const outputNode = ctx.createGain();
    outputNode.connect(ctx.destination);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputNode);
    currentAudioSource = source;

    source.onended = () => {
      if (currentAudioSource === source) currentAudioSource = null;
      if (onEnded) onEnded();
    };

    source.start(0);
  } catch (error: any) {
    console.error("TTS Playback Error:", error);
    audioCache.delete(text);
    throw error;
  }
};

export const generateStoryImage = async (prompt: string): Promise<string | null> => {
  return withRetry(async () => {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: `A vibrant, high-quality children's book illustration for: ${prompt}. Soft cinematic lighting, storybook style, no text, neutral aesthetic.` },
          ],
        },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    } catch (error) {
      console.error("Image generation error:", error);
      return null;
    }
  });
};

// Fixed: changed 'Holiday' to 'Blob' as the expected type for audio data
export const analyzeAudio = async (
  audioBlob: Blob, 
  originalText: string, 
  studentName: string,
  studentAge: number
): Promise<SpeakingAnalysis> => {
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const base64Audio = await blobToBase64(audioBlob);
  return withRetry(async () => {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
            { text: `Professional Speech Analysis Task:
            Target Text: "${originalText}"
            Student: ${studentName}, Age: ${studentAge}
            Evaluate against native fluency.
            Return JSON only:
            {
              "score": integer (0-100),
              "feedback": "One short, accurate sentence.",
              "improvements": ["Specific technical focus point."]
            }` }
          ]
        },
        config: {
          thinkingConfig: { thinkingBudget: 16384 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              feedback: { type: Type.STRING },
              improvements: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                maxItems: 2
              }
            },
            required: ["score", "feedback", "improvements"]
          }
        }
      });
      return JSON.parse(response.text) as SpeakingAnalysis;
    } catch (error) {
      console.error("Analysis Error:", error);
      return {
        score: 0,
        feedback: "Analysis failed. Please try again.",
        improvements: ["Check your microphone.", "Speak clearly."]
      };
    }
  });
};
