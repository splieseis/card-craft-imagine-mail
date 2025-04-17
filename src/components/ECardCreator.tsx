
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Mail, Loader2 } from "lucide-react";
import ImageGenerator from "./ImageGenerator";
import MessageComposer from "./MessageComposer";
import RecipientForm from "./RecipientForm";
import CardPreview from "./CardPreview";
import { uploadImage } from "@/lib/storage";
import { sendEmail } from "@/lib/email";

const ECardCreator = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleImageGenerated = (url: string) => {
    setImageUrl(url);
  };
  
  const isFormValid = () => {
    return !!imageUrl && !!message.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail);
  };
  
  const handleSendECard = async () => {
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    try {
      // Upload the image to Supabase
      const uploadedUrl = await uploadImage(imageUrl!);
      
      // Create HTML content for the email
      const emailHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
          <img src="${uploadedUrl}" alt="E-Card" style="width: 100%; border-radius: 8px;" />
          <div style="padding: 20px;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `;
      
      // Send the email
      await sendEmail({
        to: recipientEmail,
        subject: "You received an e-card!",
        html: emailHtml,
      });
      
      toast({
        title: "Success!",
        description: "Your e-card has been sent successfully.",
      });
      
      // Reset form
      setImageUrl(null);
      setMessage("");
      setRecipientEmail("");
      setActiveTab("create");
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send e-card",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-4xl py-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create & Send E-Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="create">Create Card</TabsTrigger>
              <TabsTrigger value="preview">Preview & Send</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-6">
              <ImageGenerator onImageGenerated={handleImageGenerated} />
              
              <Separator />
              
              <MessageComposer value={message} onChange={setMessage} />
              
              <Separator />
              
              <RecipientForm email={recipientEmail} onEmailChange={setRecipientEmail} />
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setActiveTab("preview")}
                  disabled={!imageUrl || !message.trim()}
                >
                  Preview E-Card
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="space-y-8">
                <CardPreview
                  imageUrl={imageUrl}
                  message={message}
                  className="mx-auto"
                />
                
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Ready to send your e-card to {recipientEmail || "your recipient"}?
                  </p>
                  <Button
                    onClick={handleSendECard}
                    disabled={isSubmitting || !isFormValid()}
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
                    onClick={() => setActiveTab("create")}
                    disabled={isSubmitting}
                    className="mt-2"
                  >
                    Back to Edit
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-xs text-muted-foreground">
            Created with Replicate AI & React Email
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ECardCreator;
