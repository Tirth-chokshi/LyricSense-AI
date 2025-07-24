import { analysisgetGroqChatCompletion } from "./action";

export default async function analyzeThemes(lyrics) {
  try {
    const prompt = `Analyze the themes in these song lyrics and return the result as a JSON array of theme objects. Each theme object should have a 'name' and 'description' property:

${lyrics}

Example response format:
[
  {
    "name": "Love",
    "description": "The song explores themes of romantic love and heartbreak."
  },
  {
    "name": "Identity",
    "description": "The lyrics touch on the struggle of self-discovery and personal growth."
  }
]`;

    const chatCompletion = await analysisgetGroqChatCompletion(prompt);
    const responseContent = chatCompletion.choices[0].message.content;

    // Try to parse the response as JSON
    try {
      return JSON.parse(responseContent);
    } catch (parseError) {
      // If parsing fails, return the raw text as a single theme
      return [{
        name: "Analysis",
        description: responseContent
      }];
    }
  } catch (error) {
    console.error('Error in analyzeThemes:', error);
    return [{ name: "Error", description: "An error occurred while analyzing themes." }];
  }
}