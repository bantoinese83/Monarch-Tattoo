import { GoogleGenAI, Modality, Type } from '@google/genai';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { TattooArtist } from '../types';

// Expo automatically exposes EXPO_PUBLIC_* env vars
const getApiKey = () => {
  const key =
    Constants.expoConfig?.extra?.apiKey ||
    (typeof process !== 'undefined' && 'env' in process && process.env?.EXPO_PUBLIC_API_KEY);

  if (!key) {
    console.error(
      'API Key check - Constants.expoConfig?.extra?.apiKey:',
      Constants.expoConfig?.extra?.apiKey
    );
    console.error(
      'API Key check - process.env?.EXPO_PUBLIC_API_KEY:',
      typeof process !== 'undefined' && 'env' in process
        ? process.env?.EXPO_PUBLIC_API_KEY
        : 'process not available'
    );
    throw new Error(
      'EXPO_PUBLIC_API_KEY environment variable is not set. Add it to your .env file or app.json extra config.'
    );
  }

  return key;
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

const getGeolocation = async (): Promise<{ latitude: number; longitude: number }> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission denied. Defaulting to San Francisco.');
      return { latitude: 37.7749, longitude: -122.4194 };
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.warn('Failed to get location. Defaulting to San Francisco.', error);
    return { latitude: 37.7749, longitude: -122.4194 };
  }
};

export const getTattooIdeas = async (base64Image: string): Promise<string[]> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    const textPart = {
      text: `Task: Analyze the body part in this image and suggest exactly 3 distinct tattoo design ideas that would fit well on this specific area.

Constraints:
- Each suggestion must be a short, descriptive name combining the style and subject
- Names should be 2-5 words maximum
- Suggestions must be visually distinct from each other
- Consider the body part's size, shape, and visibility

Response format: Return a JSON array containing exactly 3 strings.

Examples of good tattoo idea names:
- "Neo-traditional tiger"
- "Minimalist geometric wave"
- "Fine-line botanical branch"
- "American traditional eagle"
- "Abstract watercolor splash"
- "Japanese koi fish"

Body part image:
[Analyze the provided image]

Output: Return only a valid JSON array of exactly 3 strings, no additional text.`,
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      });
    } catch (apiError) {
      console.error('API call failed:', apiError);
      if (apiError instanceof Error) {
        throw new Error(`API call failed: ${apiError.message}`);
      }
      throw new Error('API call failed with unknown error');
    }

    // Access text from response candidates
    const firstCandidate = response.candidates?.[0];

    if (!firstCandidate) {
      console.error('API Response - No candidates:', JSON.stringify(response, null, 2));
      throw new Error('No response candidates from API');
    }

    if (!firstCandidate.content) {
      console.error('API Response - No content:', JSON.stringify(firstCandidate, null, 2));
      throw new Error('No content in API response');
    }

    if (!firstCandidate.content.parts || firstCandidate.content.parts.length === 0) {
      console.error('API Response - No parts:', JSON.stringify(firstCandidate.content, null, 2));
      throw new Error('No response parts from API');
    }

    // Extract text from parts
    let jsonText = '';
    for (const part of firstCandidate.content.parts) {
      if (part.text) {
        jsonText += part.text;
      }
    }

    if (!jsonText.trim()) {
      console.error(
        'API Response - Empty text:',
        JSON.stringify(firstCandidate.content.parts, null, 2)
      );
      throw new Error('No response text from API');
    }

    const ideas = JSON.parse(jsonText.trim());
    if (Array.isArray(ideas) && ideas.every((item) => typeof item === 'string')) {
      return ideas;
    }
    throw new Error('Invalid format for tattoo ideas.');
  } catch (e) {
    console.error('Failed to get tattoo ideas:', e);
    if (e instanceof Error && e.message.includes('API')) {
      throw e;
    }
    // Fallback for parsing errors
    return ['Fine-line botanical', 'American traditional eagle', 'Abstract watercolor splash'];
  }
};

const generateOrEditImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    };
    const textPart = {
      text: prompt,
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
    } catch (apiError) {
      console.error('API call failed:', apiError);
      if (apiError instanceof Error) {
        throw new Error(`API call failed: ${apiError.message}`);
      }
      throw new Error('API call failed with unknown error');
    }

    const firstCandidate = response.candidates?.[0];

    if (!firstCandidate) {
      console.error('API Response - No candidates:', JSON.stringify(response, null, 2));
      throw new Error('No response candidates from API');
    }

    if (!firstCandidate.content?.parts) {
      console.error('API Response - No content/parts:', JSON.stringify(firstCandidate, null, 2));
      throw new Error('No response from API');
    }

    for (const part of firstCandidate.content.parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }

    console.error(
      'API Response - No image data:',
      JSON.stringify(firstCandidate.content.parts, null, 2)
    );
    throw new Error('No image generated by the API.');
  } catch (e) {
    console.error('Failed to generate/edit image:', e);
    throw e;
  }
};

export const generateTattoo = async (
  base64BodyPartImage: string,
  prompt: string,
  referenceImage?: string
): Promise<string> => {
  const fullPrompt = referenceImage
    ? `Task: Generate a realistic tattoo design on the body part shown in the second image, using the first image as a style reference.

Tattoo design: "${prompt}"

Reference image: Use the first image as inspiration for style, composition, or visual elements. Adapt and integrate these elements into the tattoo design.

Requirements:
- The tattoo must look realistic and appear naturally integrated into the skin
- Follow the natural contours and curves of the body part
- Maintain proper proportions relative to the body part size
- Use appropriate shading and detail matching the reference style when applicable
- Ensure the tattoo appears as if it was actually inked on the skin
- Match the lighting and perspective of the original body part image
- Incorporate elements from the reference image while adapting to the body part's shape

Output: Generate a high-quality image showing the tattoo design placed naturally on the body part, inspired by the reference image.`
    : `Task: Generate a realistic tattoo design on the body part shown in this image.

Tattoo design: "${prompt}"

Requirements:
- The tattoo must look realistic and appear naturally integrated into the skin
- Follow the natural contours and curves of the body part
- Maintain proper proportions relative to the body part size
- Use appropriate shading and detail for the style
- Ensure the tattoo appears as if it was actually inked on the skin
- Match the lighting and perspective of the original image

Output: Generate a high-quality image showing the tattoo design placed naturally on the body part.`;

  try {
    const bodyPartImagePart = {
      inlineData: {
        data: base64BodyPartImage,
        mimeType: 'image/jpeg',
      },
    };
    const textPart = {
      text: fullPrompt,
    };

    // Build content parts array - include reference image first if provided
    const contentParts = referenceImage
      ? [
          {
            inlineData: {
              data: referenceImage,
              mimeType: 'image/jpeg',
            },
          },
          { text: 'Reference image for style guidance:' },
          bodyPartImagePart,
          textPart,
        ]
      : [bodyPartImagePart, textPart];

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: contentParts },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
    } catch (apiError) {
      console.error('API call failed:', apiError);
      if (apiError instanceof Error) {
        throw new Error(`API call failed: ${apiError.message}`);
      }
      throw new Error('API call failed with unknown error');
    }

    const firstCandidate = response.candidates?.[0];

    if (!firstCandidate) {
      console.error('API Response - No candidates:', JSON.stringify(response, null, 2));
      throw new Error('No response candidates from API');
    }

    if (!firstCandidate.content?.parts) {
      console.error('API Response - No content/parts:', JSON.stringify(firstCandidate, null, 2));
      throw new Error('No response from API');
    }

    for (const part of firstCandidate.content.parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }

    console.error(
      'API Response - No image data:',
      JSON.stringify(firstCandidate.content.parts, null, 2)
    );
    throw new Error('No image generated by the API.');
  } catch (e) {
    console.error('Failed to generate tattoo:', e);
    throw e;
  }
};

export const editTattoo = async (base64TattooImage: string, prompt: string): Promise<string> => {
  return generateOrEditImage(
    base64TattooImage,
    `Task: Edit the existing tattoo in this image according to the user's request.

User request: "${prompt}"

Requirements:
- Maintain the realistic appearance of the tattoo on skin
- Preserve the natural integration with the body part
- Keep the same lighting and perspective
- Apply the requested changes while maintaining tattoo quality

Output: Generate a high-quality edited image of the tattoo.`
  );
};

export const findTattooArtists = async (tattooStyle: string): Promise<TattooArtist[]> => {
  const userLocation = await getGeolocation();

  // More specific, location-aware prompt that triggers Maps Grounding
  const prompt = `Find tattoo shops and tattoo parlors near me that specialize in ${tattooStyle} style tattoos. Show me the best rated tattoo studios and artists in this area.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
          },
        },
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks || [];

    if (chunks.length === 0) {
      console.warn(
        'No Maps Grounding chunks found. Response:',
        JSON.stringify(response.candidates?.[0], null, 2)
      );

      // Fallback: try a more direct query
      const fallbackPrompt = `Show me tattoo shops near this location`;
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fallbackPrompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
            },
          },
        },
      });

      const fallbackChunks =
        fallbackResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      if (fallbackChunks.length > 0) {
        return extractArtistsFromChunks(fallbackChunks);
      }

      return [];
    }

    return extractArtistsFromChunks(chunks);
  } catch (error) {
    console.error('Failed to find tattoo artists:', error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractArtistsFromChunks = (chunks: any[]): TattooArtist[] => {
  return chunks
    .filter((chunk) => chunk.maps?.uri && chunk.maps?.title)
    .map((chunk) => {
      const place = chunk.maps!;
      const sources = Array.isArray(place.placeAnswerSources)
        ? place.placeAnswerSources
        : place.placeAnswerSources
          ? [place.placeAnswerSources]
          : [];

      // Extract coordinates from URI if available
      let latitude: number | undefined;
      let longitude: number | undefined;

      // Try multiple URI patterns to extract coordinates
      if (place.uri) {
        // Pattern 1: ?q=lat,lng
        let coordMatch = place.uri.match(/[?&]q=([0-9.-]+),([0-9.-]+)/);
        if (coordMatch) {
          latitude = parseFloat(coordMatch[1]);
          longitude = parseFloat(coordMatch[2]);
        } else {
          // Pattern 2: @lat,lng
          coordMatch = place.uri.match(/@([0-9.-]+),([0-9.-]+)/);
          if (coordMatch) {
            latitude = parseFloat(coordMatch[1]);
            longitude = parseFloat(coordMatch[2]);
          } else {
            // Pattern 3: ll=lat,lng
            coordMatch = place.uri.match(/ll=([0-9.-]+),([0-9.-]+)/);
            if (coordMatch) {
              latitude = parseFloat(coordMatch[1]);
              longitude = parseFloat(coordMatch[2]);
            }
          }
        }
      }

      return {
        title: place.title!,
        uri: place.uri!,
        placeId: place.placeId,
        rating: sources[0]?.rating,
        reviewCount: sources[0]?.reviewCount,
        latitude,
        longitude,
      };
    });
};
