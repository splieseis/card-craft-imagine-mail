
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateImage } from "@/lib/replicate";
import { AlertCircle, Loader2, RefreshCw, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface ImageGeneratorProps {
  onImageGenerated: (url: string) => void;
}

const ImageGenerator = ({ onImageGenerated }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingFirstImage, setIsGeneratingFirstImage] = useState(true);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    toast.info("Generating your image...");
    
    try {
      const imageUrl = await generateImage(prompt);
      onImageGenerated(imageUrl);
      setIsGeneratingFirstImage(false);
      toast.success("Image generated successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate image";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-prompt" className="font-medium">
            Describe the image you want for your e-card
          </Label>
          <div className="flex gap-2">
            <Input
              id="image-prompt"
              placeholder="E.g., A beautiful sunset over mountains with colorful sky"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : isGeneratingFirstImage ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Detailed prompts create better images. Try mentioning style, mood, colors, etc.
          </p>
        </div>
      </form>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <p className="mt-2 text-sm">
              Note: The application is currently using placeholder images due to API connectivity issues.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ImageGenerator;
