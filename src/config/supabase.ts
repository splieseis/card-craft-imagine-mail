
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-supabase-url.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Create a bucket for e-card images if it doesn't exist
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
