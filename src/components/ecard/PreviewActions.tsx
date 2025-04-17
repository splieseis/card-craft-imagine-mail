
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";

interface PreviewActionsProps {
  isSubmitting: boolean;
  recipientEmail: string;
  onSend: () => void;
  onBack: () => void;
}

const PreviewActions = ({ isSubmitting, recipientEmail, onSend, onBack }: PreviewActionsProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-sm text-muted-foreground">
        Ready to send your e-card to {recipientEmail || "your recipient"}?
      </p>
      <Button
        onClick={onSend}
        disabled={isSubmitting}
        className="w-full max-w-xs"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send E-Card
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isSubmitting}
        className="mt-2"
      >
        Back to Edit
      </Button>
    </div>
  );
};

export default PreviewActions;
