
import { supabase } from "@/config/supabase";

export const uploadImage = async (imageUrl: string): Promise<string> => {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Generate a unique file name
    const fileName = `ecard_${Date.now()}.png`;
    const filePath = `ecards/${fileName}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("ecard-images")
      .upload(filePath, blob, {
        contentType: "image/png",
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("ecard-images")
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};
