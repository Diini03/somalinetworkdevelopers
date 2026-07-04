import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  candidateId: string;
  candidateName: string;
}

export const ContactDrawer = ({ open, onOpenChange, candidateId, candidateName }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.length > 100 || form.email.length > 255 || form.subject.length > 150 || form.message.length > 1000) {
      toast({ title: "Too long", description: "Please shorten your inputs.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.functions.invoke("send-candidate-contact-email", {
      body: { candidateId, senderName: form.name, senderEmail: form.email, subject: form.subject, message: form.message },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not send", description: "Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent", description: `${candidateName} will receive it shortly.` });
    setForm({ name: "", email: "", subject: "", message: "" });
    onOpenChange(false);
  };

  const input = "w-full h-9 px-3 rounded-md border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Message {candidateName.split(" ")[0]}</DialogTitle>
          <p className="text-xs text-muted-foreground">They receive your message and email directly.</p>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Your name</label>
              <input required className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Your email</label>
              <input required type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Subject</label>
            <input required className={input} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Opportunity at Acme" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Message</label>
            <textarea
              required rows={5}
              className={`${input} h-auto py-2 resize-none`}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell them about the role, team, and what you're looking for."
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" onClick={() => onOpenChange(false)} className="h-9 px-3 rounded-md text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? "Sending…" : "Send message"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
