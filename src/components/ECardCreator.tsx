
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, Loader2, ArrowRight, Image, MessageSquareText, AtSign } from "lucide-react";
import ImageGenerator from "./ImageGenerator";
import MessageComposer from "./MessageComposer";
import RecipientForm from "./RecipientForm";
import CardPreview from "./CardPreview";
import { uploadImage } from "@/lib/storage";
import { sendEmail } from "@/lib/email";
import { initializeStorage } from "@/config/supabase";

const ECardCreator = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"image" | "message" | "recipient">("image");
  
  useEffect(() => {
    // Initialize storage bucket when component mounts
    initializeStorage().catch(console.error);
  }, []);
  
  const handleImageGenerated = (url: string) => {
    setImageUrl(url);
    // Automatically move to message step after generating image
    if (step === "image") setStep("message");
  };
  
  const handleMessageChange = (value: string) => {
    setMessage(value);
    if (value.trim().length > 10 && step === "message") {
      setStep("recipient");
    }
  };
  
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const isFormValid = () => {
    return !!imageUrl && 
           message.trim().length >= 10 && 
           validateEmail(recipientEmail);
  };
  
  const handlePreview = () => {
    setActiveTab("preview");
  };
  
  const handleSendECard = async () => {
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    try {
      // First, upload the image to Supabase
      toast.info("Preparing your e-card...");
      const uploadedUrl = await uploadImage(imageUrl!);
      
      // Create HTML content for the email
      const emailHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
          <img src="${uploadedUrl}" alt="E-Card" style="width: 100%; border-radius: 8px;" />
          <div style="padding: 20px; border-radius: 0 0 8px 8px; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
        </div>
      `;
      
      // Send the email
      await sendEmail({
        to: recipientEmail,
        subject: "You received an e-card!",
        html: emailHtml,
      });
      
      toast.success("Your e-card has been sent successfully!");
      
      // Reset form
      setImageUrl(null);
      setMessage("");
      setRecipientEmail("");
      setActiveTab("create");
      setStep("image");
      
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to send e-card");
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
              <TabsTrigger value="preview" disabled={!imageUrl || !message.trim()}>Preview & Send</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full p-2 ${step === "image" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Image size={16} />
                  </div>
                  <span className={step === "image" ? "font-medium" : "text-muted-foreground"}>Generate Image</span>
                </div>
                
                <ImageGenerator onImageGenerated={handleImageGenerated} />
                
                {imageUrl && (
                  <>
                    <Separator />
                    
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full p-2 ${step === "message" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <MessageSquareText size={16} />
                      </div>
                      <span className={step === "message" ? "font-medium" : "text-muted-foreground"}>Write Message</span>
                    </div>
                    
                    <MessageComposer value={message} onChange={handleMessageChange} />
                    
                    {message.trim().length >= 10 && (
                      <>
                        <Separator />
                        
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-2 ${step === "recipient" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            <AtSign size={16} />
                          </div>
                          <span className={step === "recipient" ? "font-medium" : "text-muted-foreground"}>Add Recipient</span>
                        </div>
                        
                        <RecipientForm email={recipientEmail} onEmailChange={setRecipientEmail} />
                      </>
                    )}
                  </>
                )}
              </div>
              
              {isFormValid() && (
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handlePreview}
                    className="gap-2"
                  >
                    Preview E-Card
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
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
            Created with Stable Diffusion AI & React Email
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ECardCreator;
