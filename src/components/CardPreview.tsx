
import { cn } from "@/lib/utils";

interface CardPreviewProps {
  imageUrl: string | null;
  message: string;
  className?: string;
}

const CardPreview = ({ imageUrl, message, className }: CardPreviewProps) => {
  return (
    <div className={cn(
      "w-full max-w-md mx-auto overflow-hidden rounded-lg border shadow-sm",
      className
    )}>
      <div className="aspect-[3/2] bg-muted relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Generated card preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Image preview will appear here
          </div>
        )}
      </div>
      <div className="p-4 bg-white">
        {message ? (
          <p className="whitespace-pre-wrap">{message}</p>
        ) : (
          <p className="text-muted-foreground italic">Your message will appear here</p>
        )}
      </div>
    </div>
  );
};

export default CardPreview;
