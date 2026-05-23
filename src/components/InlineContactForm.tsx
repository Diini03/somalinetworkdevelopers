import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InlineContactFormProps {
  candidateId: string;
  candidateName: string;
}

export const InlineContactForm = ({ candidateId, candidateName }: InlineContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        formData.name.length > 100 ||
        formData.email.length > 255 ||
        formData.subject.length > 150 ||
        formData.message.length > 1000
      ) {
        toast({
          title: "Validation error",
          description: "Please keep inputs within allowed length limits.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Note: candidateEmail is NOT sent from the client anymore.
      // The edge function looks it up via service role to prevent PII leakage.
      const { error } = await supabase.functions.invoke("send-candidate-contact-email", {
        body: {
          candidateId,
          senderName: formData.name,
          senderEmail: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      });

      if (error) {
        toast({
          title: "Could not send message",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message sent!",
        description: `${candidateName} will receive your email shortly.`,
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-form" className="glass rounded-2xl p-6 border border-primary/30 shadow-card bg-gradient-to-br from-primary/5 to-transparent space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
        <p className="text-muted-foreground">
          Fill out the form below to contact {candidateName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Your Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            placeholder="Job Opportunity"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            placeholder="I'd like to discuss..."
            rows={5}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 font-semibold"
          size="lg"
        >
          <Mail className="w-5 h-5 mr-2" />
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};
