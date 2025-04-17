
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

    try {
      // Upload image to Supabase storage
      const storageUrl = await uploadImage(imageUrl);
      
      try {
        // Store metadata in the database, but don't fail if this doesn't work
        await supabase
          .from('generated_images')
          .insert({
            prompt,
            original_url: imageUrl,
            storage_url: storageUrl,
          });
      } catch (dbError) {
        console.error('Error storing image metadata:', dbError);
        // Continue even if metadata storage fails
      }
      
      // Return the storage URL for display
      return storageUrl;
    } catch (storageError) {
      console.error('Storage error, falling back to original URL:', storageError);
      // Fallback to the original URL if storage fails
      return imageUrl;
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
