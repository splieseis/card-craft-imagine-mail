
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MessageComposerProps {
  onChange: (message: string) => void;
  value: string;
}

const MessageComposer = ({ onChange, value }: MessageComposerProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea
        id="message"
        placeholder="Write your heartfelt message here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px]"
      />
    </div>
  );
};

export default MessageComposer;
