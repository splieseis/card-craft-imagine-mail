
import { supabase } from "@/integrations/supabase/client";

// Initialize storage for e-card images
export const initializeStorage = async () => {
  try {
    const { data, error } = await supabase.storage.getBucket("ecard-images");
    
    if (error && error.message.includes("does not exist")) {
      const { data, error: createError } = await supabase.storage.createBucket("ecard-images", {
        public: true,
        allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
      } else {
        console.log("Bucket created successfully:", data);
      }
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};
