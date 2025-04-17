
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
    
    // Using ESM module import as specified
    const replicateApi = new Replicate({
      auth: REPLICATE_API_TOKEN,
      fetch: async (url, options) => {
        // Add CORS headers to the request
        options = options || {};
        options.headers = {
          ...options.headers,
          'Content-Type': 'application/json',
        };
        
        console.log("Making fetch request to Replicate API:", url);
        
        // Use actual fetch with custom options
        return fetch(`https://esm.sh/proxy/https://api.replicate.com${url.toString().replace("https://api.replicate.com", "")}`, options);
      }
    });
    
    console.log("Calling Replicate API with prompt:", prompt);
    
    // Define input parameters for the model
    const input = {
      prompt: prompt,
      width: 768,
      height: 512,
      num_outputs: 1,
      guidance_scale: 7.5,
      num_inference_steps: 50,
    };
    
    // Run the model with the input parameters
    const output = await replicateApi.run(modelVersion, { input });
    
    // The API returns an array of image URLs
    const imageUrl = Array.isArray(output) ? output[0] : "";
    
    if (!imageUrl) {
      throw new Error("No image was generated");
    }
    
    console.log("Successfully generated image:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Still provide fallback for complete failure cases
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      console.log("Network error when calling Replicate API, using placeholder");
      return "https://picsum.photos/768/512";
    }
    
    // Re-throw the error so it can be handled by the component
    throw error;
  }
};
