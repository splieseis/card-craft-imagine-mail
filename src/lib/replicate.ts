
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
    // Define the model and input parameters
    const modelVersion = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";
    const input = {
      prompt: prompt,
      width: 768,
      height: 512,
      num_outputs: 1,
      guidance_scale: 7.5,
      num_inference_steps: 50,
    };
    
    // Use a mock image URL for development/testing purposes
    // This helps bypass CORS issues in development environments
    if (import.meta.env.DEV) {
      console.log("DEV mode: Using mock image instead of calling Replicate API");
      // Return a placeholder image URL
      return "https://picsum.photos/768/512";
    }
    
    // In production, we would implement a backend proxy or serverless function
    // that makes the API call to Replicate on behalf of the client
    // For now, we're still trying with direct call but with more logging
    console.log("Calling Replicate API with prompt:", prompt);
    
    const output = await replicate.run(modelVersion, { input });
    
    // The API returns an array of image URLs
    const imageUrl = Array.isArray(output) ? output[0] : "";
    
    if (!imageUrl) {
      throw new Error("No image was generated");
    }
    
    console.log("Successfully generated image:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    
    // For testing purposes, return a placeholder image when the API fails
    console.log("Falling back to placeholder image");
    return "https://picsum.photos/768/512";
  }
};
