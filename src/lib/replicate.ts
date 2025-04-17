
import { supabase } from "@/integrations/supabase/client";

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt },
    });

    if (error) throw error;
    
    const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
    if (!imageUrl) {
      throw new Error('No image was generated');
    }

    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
