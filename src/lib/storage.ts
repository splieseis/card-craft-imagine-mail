
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads an image from URL to Supabase storage
 * @param imageUrl URL of the image to upload
 * @returns Public URL of the uploaded image
 */
export const uploadImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log("Starting image upload from URL:", imageUrl);
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
    
    console.log(`Uploading image as ${filePath}`);
    
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
      return imageUrl;
    }
    
    // Get public URL
    const publicUrl = supabase.storage
      .from("ecard-images")
      .getPublicUrl(filePath).data.publicUrl;
      
    console.log("Successfully uploaded image. Public URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    
    // Return the original image URL as fallback
    return imageUrl;
  }
};
