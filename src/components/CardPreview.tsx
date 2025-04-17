
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface CardPreviewProps {
  imageUrl: string | null;
  message: string;
  className?: string;
}

const CardPreview = ({ imageUrl, message, className }: CardPreviewProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(imageUrl);
  const [imgLoading, setImgLoading] = useState(Boolean(imageUrl));
  const [imgError, setImgError] = useState(false);

  // Update image source when imageUrl prop changes
  useEffect(() => {
    if (imageUrl) {
      setImgSrc(imageUrl);
      setImgLoading(true);
      setImgError(false);
    } else {
      setImgSrc(null);
      setImgLoading(false);
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    setImgLoading(false);
    console.log("Image loaded successfully:", imgSrc);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", imgSrc);
    setImgLoading(false);
    setImgError(true);
    // Try with a cache-busting parameter
    if (imgSrc && !imgSrc.includes('?')) {
      const newSrc = `${imgSrc}?t=${new Date().getTime()}`;
      console.log("Retrying with cache-busting:", newSrc);
      setImgSrc(newSrc);
    }
  };

  return (
    <div className={cn(
      "w-full max-w-md mx-auto overflow-hidden rounded-lg border shadow-md transition-all",
      className
    )}>
      <div className="aspect-[3/2] bg-muted relative">
        {imgLoading && (
          <Skeleton className="w-full h-full absolute inset-0" />
        )}
        
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt="Generated card preview" 
            className={cn(
              "w-full h-full object-cover",
              imgLoading ? "opacity-0" : "opacity-100"
            )}
            loading="eager"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-muted-foreground">
            {imgError ? (
              <div className="text-center p-4">
                <p className="text-red-500 mb-2">Failed to load image</p>
                <p className="text-sm text-muted-foreground">Please try generating a new one</p>
              </div>
            ) : (
              <p className="text-center">Your image will appear here</p>
            )}
          </div>
        )}
      </div>
      <div className="p-6 bg-white">
        {message ? (
          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{message}</p>
        ) : (
          <p className="text-muted-foreground italic">Your message will appear here</p>
        )}
      </div>
    </div>
  );
};

export default CardPreview;
