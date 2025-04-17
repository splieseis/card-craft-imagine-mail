
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// In a production app, you'd want to use environment variables
const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseKey = "your-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
