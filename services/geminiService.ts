import { GoogleGenAI, Type } from "@google/genai";
import { Track } from "../types";

export const GEMINI_API_KEY_ERROR = "Gemini API key not configured. Please set the API_KEY environment variable.";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have a more robust way of handling this,
  // but for this example, we'll throw an error to make it clear.
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateTrackDescription = async (track: Track): Promise<string> => {
  if (!API_KEY) {
    return GEMINI_API_KEY_ERROR;
  }
  
  try {
    const prompt = `You are a creative music journalist. Write a short, evocative description for a song titled "${track.title}" by an artist named "${track.artist}". Imagine the mood and atmosphere of the song. Keep it under 40 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating track description:", error);
    return "Could not generate AI insights for this track at the moment.";
  }
};

export const generatePlaylist = async (prompt: string, tracks: Track[]): Promise<number[]> => {
    if (!API_KEY) {
        throw new Error(GEMINI_API_KEY_ERROR);
    }

    const availableTracks = tracks.map(t => `id: ${t.id}, title: "${t.title}", artist: "${t.artist}"`).join('\n');
    const systemInstruction = `You are a world-class DJ and music curator. Your task is to create a playlist from a list of available tracks based on a user's request. Only use the tracks provided. Return a JSON array of track IDs that best fit the user's prompt.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User request: "${prompt}".\n\nAvailable tracks:\n${availableTracks}\n\nSelect the track IDs that best fit the request.`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        playlist: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    trackId: {
                                        type: Type.NUMBER,
                                        description: 'The ID of the track to add to the playlist.'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        const trackIds = jsonResponse.playlist.map((item: { trackId: number }) => item.trackId);
        return trackIds;

    } catch (error) {
        console.error("Error generating playlist:", error);
        throw new Error("Could not create an AI playlist at this time.");
    }
};
