
import { supabase } from "@/integrations/supabase/client";

// Initialize storage for e-card images
export const initializeStorage = async () => {
  try {
    // Check if the bucket exists by trying to get its details
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket("ecard-images");
    
    if (bucketError) {
      console.error("Error checking bucket:", bucketError);
      
      // Only try to create if it doesn't exist
      if (bucketError.message.includes("does not exist")) {
        console.log("Bucket doesn't exist, attempting to create it");
        
        const { data, error: createError } = await supabase
          .storage
          .createBucket("ecard-images", {
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
    } else {
      console.log("Bucket already exists:", bucketData);
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};
