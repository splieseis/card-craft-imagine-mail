
import Replicate from "replicate";

// Initialize Replicate client
// Replace this with your actual Replicate API token
const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN || "your-replicate-api-token";

export const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

/**
 * Generates an image using Stability AI's Stable Diffusion model
 * @param prompt The text prompt to generate an image from
 * @returns URL of the generated image
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: prompt,
          width: 768,
          height: 512,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        },
      }
    );
    
    // The API returns an array of image URLs
    const imageUrl = Array.isArray(output) ? output[0] : "";
    
    if (!imageUrl) {
      throw new Error("No image was generated");
    }
    
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};
