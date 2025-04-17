import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import ImageGenerator from "../ImageGenerator";
import MessageComposer from "../MessageComposer";
import RecipientForm from "../RecipientForm";
import StepIndicator from "./StepIndicator";

interface CreateTabContentProps {
  step: "image" | "message" | "recipient";
  imageUrl: string | null;
  message: string;
  recipientEmail: string;
  onImageGenerated: (url: string) => void;
  onMessageChange: (message: string) => void;
  onEmailChange: (email: string) => void;
  onPreview: () => void;
  isFormValid: boolean;
}

const CreateTabContent = ({
  step,
  imageUrl,
  message,
  recipientEmail,
  onImageGenerated,
  onMessageChange,
  onEmailChange,
  onPreview,
  isFormValid,
}: CreateTabContentProps) => {
  return (
    <div className="space-y-6">
      <StepIndicator step={step} />
      <ImageGenerator onImageGenerated={onImageGenerated} />
      
      {imageUrl && (
        <>
          <div className="mt-4 rounded-lg overflow-hidden border border-muted">
            <img 
              src={imageUrl} 
              alt="Generated e-card image" 
              className="w-full h-auto" 
            />
          </div>
          <Separator />
          <StepIndicator step="message" />
          <MessageComposer value={message} onChange={onMessageChange} />
          
          {message.trim().length >= 10 && (
            <>
              <Separator />
              <StepIndicator step="recipient" />
              <RecipientForm email={recipientEmail} onEmailChange={onEmailChange} />
            </>
          )}
        </>
      )}
      
      {isFormValid && (
        <div className="flex justify-end pt-4">
          <Button onClick={onPreview} className="gap-2">
            Preview E-Card
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateTabContent;
