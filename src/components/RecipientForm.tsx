
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RecipientFormProps {
  onEmailChange: (email: string) => void;
  email: string;
}

const RecipientForm = ({ onEmailChange, email }: RecipientFormProps) => {
  const [error, setError] = useState<string | null>(null);
  
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError(null);
      return;
    }
    
    if (!regex.test(email)) {
      setError("Please enter a valid email address");
    } else {
      setError(null);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onEmailChange(value);
    validateEmail(value);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="recipient-email">Recipient's email</Label>
      <Input
        id="recipient-email"
        type="email"
        placeholder="friend@example.com"
        value={email}
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default RecipientForm;
