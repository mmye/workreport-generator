import Anthropic from '@anthropic-ai/sdk';
import type { Part } from '../store/useReportStore';

// Initialize the client with the API key from environment variables
// Note: In a production environment, this should be handled by a backend proxy to protect the API key.
// For this prototype/local tool, client-side usage is permitted per user requirement.
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

const anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Explicitly allowed for this use case
});

export interface ExtractedPart extends Part {
    [key: string]: any; // Allow dynamic fields
}

export const extractPartsFromImage = async (imageBase64: string): Promise<ExtractedPart[]> => {
    if (!apiKey) {
        throw new Error('Anthropic API Key is missing. Please set VITE_ANTHROPIC_API_KEY in .env');
    }

    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    // Detect media type (simplified)
    const mediaType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

    const systemPrompt = `
You are an expert data extraction assistant. Your task is to analyze the provided image (which contains a table of parts/materials) and extract the data into a structured JSON format.

RULES:
1. Identify columns such as "Part Name", "Quantity", "Model Number", "Manufacturer", "Remarks", etc.
2. Map the "Part Name" (or Description) to the 'name' field.
3. Map the "Quantity" to the 'quantity' field (number).
4. Preserve all other columns as additional keys in the JSON object (use camelCase for keys).
5. Return ONLY the JSON array. Do not include markdown formatting or explanations.
6. If a quantity is missing or not a number, default to 1.
7. If the image does not appear to be a parts table, return an empty array [].
`;

    try {
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4096,
            temperature: 0,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: mediaType as any,
                                data: base64Data,
                            },
                        },
                        {
                            type: "text",
                            text: "Extract the parts table from this image."
                        }
                    ],
                }
            ],
        });

        // Parse the response
        const content = message.content[0];
        if (content.type === 'text') {
            try {
                // regex to find json array just in case
                const jsonMatch = content.text.match(/\[.*\]/s);
                const jsonStr = jsonMatch ? jsonMatch[0] : content.text;
                const data = JSON.parse(jsonStr);

                // Post-process to ensure IDs
                return data.map((item: any) => ({
                    ...item,
                    id: crypto.randomUUID(),
                    quantity: Number(item.quantity) || 1
                }));
            } catch (e) {
                console.error("Failed to parse LLM response:", content.text);
                throw new Error("Failed to parse the extracted data.");
            }
        }

        return [];

    } catch (error) {
        console.error("Anthropic API Error:", error);
        throw error;
    }
};
