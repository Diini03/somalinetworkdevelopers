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

  const inputCls = "bg-foreground/5 border-0 rounded-2xl px-4 h-11";
  return (
    <div id="contact-form" className="glass-strong rounded-3xl p-8 shadow-float space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-primary mb-2">Get in touch</div>
        <h2 className="font-display text-3xl leading-tight">Reach out to {candidateName}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[11px] uppercase tracking-widest text-muted-foreground">Your name</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="John Doe" className={inputCls} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[11px] uppercase tracking-widest text-muted-foreground">Your email</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="john@example.com" className={inputCls} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-[11px] uppercase tracking-widest text-muted-foreground">Subject</Label>
          <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required placeholder="Job opportunity" className={inputCls} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-[11px] uppercase tracking-widest text-muted-foreground">Message</Label>
          <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required placeholder="I'd like to discuss…" rows={5} className="bg-foreground/5 border-0 rounded-2xl p-4 resize-none" />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow font-semibold" size="lg">
          <Mail className="w-4 h-4 mr-2" />
          {loading ? "Sending…" : "Send message"}
        </Button>
      </form>
    </div>
  );
};
