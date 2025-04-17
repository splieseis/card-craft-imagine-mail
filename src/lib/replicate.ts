
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "./storage";

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt },
    });

    if (error) throw error;
    
    console.log("Response from generate-image function:", data);
    
    // Handle the response format correctly
    const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
    if (!imageUrl) {
      throw new Error('No image was generated');
    }

    // Upload image to Supabase storage
    const storageUrl = await uploadImage(imageUrl);

    // Store metadata in the database
    const { error: dbError } = await supabase
      .from('generated_images')
      .insert({
        prompt,
        original_url: imageUrl,
        storage_url: storageUrl,
      });

    if (dbError) {
      console.error('Error storing image metadata:', dbError);
      // Continue with the storage URL even if metadata storage fails
    }

    // Return the storage URL for display
    return storageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

