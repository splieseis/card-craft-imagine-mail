
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CardPreviewProps {
  imageUrl: string | null;
  message: string;
  className?: string;
}

const CardPreview = ({ imageUrl, message, className }: CardPreviewProps) => {
  return (
    <div className={cn(
      "w-full max-w-md mx-auto overflow-hidden rounded-lg border shadow-md transition-all",
      className
    )}>
      <div className="aspect-[3/2] bg-muted relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Generated card preview" 
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.currentTarget.src = "/placeholder.svg"; // Use local placeholder
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-muted-foreground">
            <Skeleton className="w-full h-full" />
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
