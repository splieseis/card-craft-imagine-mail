
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RecipientFormProps {
  onEmailChange: (email: string) => void;
  email: string;
}

const RecipientForm = ({ onEmailChange, email }: RecipientFormProps) => {
  const [error, setError] = useState<string | null>(null);
  
  const validateEmail = (email: string) => {
    if (!email) {
      setError(null);
      return;
    }
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    } else {
      setError(null);
      return true;
    }
  };
  
  useEffect(() => {
    if (email) {
      validateEmail(email);
    }
  }, [email]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onEmailChange(value);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="recipient-email" className="font-medium">Recipient's email</Label>
      <Input
        id="recipient-email"
        type="email"
        placeholder="friend@example.com"
        value={email}
        onChange={handleChange}
        onBlur={() => validateEmail(email)}
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground">
        This is where your e-card will be sent. Double-check for typos!
      </p>
    </div>
  );
};

export default RecipientForm;
