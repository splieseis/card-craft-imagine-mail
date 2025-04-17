
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import CardPreview from "./CardPreview";
import { uploadImage } from "@/lib/storage";
import { sendEmail } from "@/lib/email";
import { initializeStorage } from "@/config/supabase";
import CreateTabContent from "./ecard/CreateTabContent";
import PreviewActions from "./ecard/PreviewActions";

const ECardCreator = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"image" | "message" | "recipient">("image");

  useEffect(() => {
    initializeStorage().catch(console.error);
  }, []);

  const handleImageGenerated = (url: string) => {
    setImageUrl(url);
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
    return !!imageUrl && message.trim().length >= 10 && validateEmail(recipientEmail);
  };

  const handleSendECard = async () => {
    if (!isFormValid()) return;
    setIsSubmitting(true);

    try {
      toast.info("Preparing your e-card...");
      const uploadedUrl = await uploadImage(imageUrl!);
      
      const emailHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
          <img src="${uploadedUrl}" alt="E-Card" style="width: 100%; border-radius: 8px;" />
          <div style="padding: 20px; border-radius: 0 0 8px 8px; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
        </div>
      `;

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
              <TabsTrigger value="preview" disabled={!imageUrl || !message.trim()}>
                Preview & Send
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <CreateTabContent
                step={step}
                imageUrl={imageUrl}
                message={message}
                recipientEmail={recipientEmail}
                onImageGenerated={handleImageGenerated}
                onMessageChange={handleMessageChange}
                onEmailChange={setRecipientEmail}
                onPreview={() => setActiveTab("preview")}
                isFormValid={isFormValid()}
              />
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-8">
                <CardPreview
                  imageUrl={imageUrl}
                  message={message}
                  className="mx-auto"
                />
                <PreviewActions
                  isSubmitting={isSubmitting}
                  recipientEmail={recipientEmail}
                  onSend={handleSendECard}
                  onBack={() => setActiveTab("create")}
                />
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
