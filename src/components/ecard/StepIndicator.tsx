
import { Image, MessageSquareText, AtSign } from "lucide-react";

interface StepIndicatorProps {
  step: "image" | "message" | "recipient";
}

const StepIndicator = ({ step }: StepIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-full p-2 ${
        step === "image" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      }`}>
        <Image size={16} />
      </div>
      <span className={step === "image" ? "font-medium" : "text-muted-foreground"}>
        Generate Image
      </span>
    </div>
  );
};

export default StepIndicator;
