
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MessageComposerProps {
  onChange: (message: string) => void;
  value: string;
}

const MessageComposer = ({ onChange, value }: MessageComposerProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="message" className="font-medium">Your message</Label>
      <Textarea
        id="message"
        placeholder="Write your heartfelt message here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[150px] resize-none"
        maxLength={500}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Make it personal! Add a warm greeting and close with your name.</span>
        <span>{value.length}/500</span>
      </div>
    </div>
  );
};

export default MessageComposer;
