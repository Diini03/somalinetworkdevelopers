import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  candidateId: string;
  candidateName: string;
}

export const InlineContactForm = ({ candidateId, candidateName }: Props) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.length > 100 || form.email.length > 255 || form.subject.length > 150 || form.message.length > 1000) {
      toast({ title: "Too long", description: "Please keep inputs within length limits.", variant: "destructive" });
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
    toast({ title: "Sent", description: `${candidateName} will receive your message shortly.` });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const field = "w-full bg-transparent border-0 border-b border-border focus:border-primary focus:outline-none py-3 font-mono text-sm placeholder:text-muted-foreground/50";

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="caption block mb-2">Your name</label>
          <input className={field} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Hodan Ali" />
        </div>
        <div>
          <label className="caption block mb-2">Your email</label>
          <input type="email" className={field} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@studio.com" />
        </div>
      </div>
      <div>
        <label className="caption block mb-2">Subject</label>
        <input className={field} required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="A new project" />
      </div>
      <div>
        <label className="caption block mb-2">Message</label>
        <textarea
          rows={6}
          className={`${field} resize-none`}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell them what you have in mind…"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
};
