
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Service to handle Text-to-Speech using a dual-provider strategy.
 * 1. Primary: Gemini 2.5 Flash TTS (native GenAI speech generation)
 * 2. Fallback: Google Cloud TTS REST API (v1beta1 Chirp model)
 */
const CLOUD_TTS_API_KEY = "AIzaSyDeHizYHse9gW5yZgUBmZcRUTJfaWx3aKk";

export interface TTSResponse {
  data: string; // Base64 encoded audio
  format: 'pcm' | 'mp3';
}

export const textToSpeech = async (text: string): Promise<TTSResponse> => {
  // 1. Try Gemini 2.5 Flash TTS as the primary high-quality solution
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 'Kore' is a neutral, clear voice excellent for education
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return { data: base64Audio, format: 'pcm' };
    }
  } catch (error: any) {
    // If quota exceeded or any other error, we gracefully fall back
    console.warn("Primary TTS (Gemini) failed or quota exceeded. Falling back to Cloud TTS.", error);
  }

  // 2. Fallback to Google Cloud TTS REST API
  // Using 'text' instead of 'ssml' avoids potential validation issues with the Chirp model
  const response = await fetch(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${CLOUD_TTS_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { 
        text: text 
      },
      voice: { 
        languageCode: 'en-US', 
        name: 'en-US-Chirp-HD-O' 
      },
      audioConfig: { 
        audioEncoding: 'MP3'
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Cloud TTS synthesis failed');
  }

  const data = await response.json();
  if (!data.audioContent) {
    throw new Error('No audio content returned from Cloud TTS');
  }

  return { data: data.audioContent, format: 'mp3' };
};
