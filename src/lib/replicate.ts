
import Replicate from "replicate";

// Initialize Replicate client
// In a production app, you'd want to use environment variables
const REPLICATE_API_TOKEN = "your-replicate-api-token";

export const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt,
          width: 768,
          height: 512,
          num_outputs: 1,
        },
      }
    );
    
    // The API returns an array of image URLs
    return Array.isArray(output) ? output[0] : "";
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};
