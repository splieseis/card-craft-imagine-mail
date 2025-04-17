
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads an image from URL to Supabase storage
 * @param imageUrl URL of the image to upload
 * @returns Public URL of the uploaded image
 */
export const uploadImage = async (imageUrl: string): Promise<string> => {
  try {
    // If the image is already in Supabase storage, return it as is
    if (imageUrl.includes('supabase.co/storage/v1/object/public/ecard-images')) {
      console.log("Image already in Supabase storage, returning as is:", imageUrl);
      return imageUrl;
    }
    
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
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("ecard-images")
      .upload(filePath, blob, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });
    
    if (error) {
      console.error("Error uploading image to storage:", error);
      
      // Throw error for better handling
      throw new Error(`Storage error: ${error.message}`);
    }
    
    // Get public URL - make sure we're using the right format
    const publicUrl = supabase.storage
      .from("ecard-images")
      .getPublicUrl(filePath).data.publicUrl;
      
    console.log("Successfully uploaded image. Public URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    // Re-throw the error for better error handling upstream
    throw error;
  }
};
