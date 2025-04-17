
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads an image from URL to Supabase storage
 * @param imageUrl URL of the image to upload
 * @returns Public URL of the uploaded image
 */
export const uploadImage = async (imageUrl: string): Promise<string> => {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Generate a unique file name with timestamp and random string
    const randomId = Math.random().toString(36).substring(2, 10);
    const fileName = `ecard_${Date.now()}_${randomId}.png`;
    const filePath = `ecards/${fileName}`;
    
    // Upload to Supabase storage with public policy
    const { data, error } = await supabase.storage
      .from("ecard-images")
      .upload(filePath, blob, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });
    
    if (error) {
      console.error("Error uploading image to storage:", error);
      
      // Fallback to just using the original URL if storage fails
      // This ensures the app doesn't break completely
      return imageUrl;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("ecard-images")
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    
    // Return the original image URL as fallback
    return imageUrl;
  }
};
