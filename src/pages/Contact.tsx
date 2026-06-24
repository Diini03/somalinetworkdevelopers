import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent. We'll be in touch soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const inputCls = "bg-foreground/5 border-0 rounded-2xl px-4 h-12";

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative pt-36 pb-12 px-4 overflow-hidden noise">
        <div className="orb animate-float-slow bg-primary/30 w-[380px] h-[380px] -top-20 -left-20" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-6 animate-fade-in">Contact</div>
          <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] tracking-tight animate-fade-in-up">
            Let's <span className="italic">talk.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            Have a question, idea, or want to join the community? Drop us a line.
          </p>
        </div>
      </section>

      <section className="pb-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-3xl p-7 space-y-5">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground mb-2">We're here to help.</p>
                  <a href="mailto:info@somalinetdev.com" className="text-foreground story-link text-sm font-medium">
                    info@somalinetdev.com
                  </a>
                </div>
              </div>

              <div className="glass rounded-3xl p-7 space-y-5">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl mb-1">Live chat</h3>
                  <p className="text-sm text-muted-foreground mb-2">Instant support from the team.</p>
                  <button className="text-foreground story-link text-sm font-medium">
                    Start a conversation
                  </button>
                </div>
              </div>

              <div className="glass rounded-3xl p-7">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Office Hours</div>
                <div className="space-y-1 text-sm text-foreground">
                  <p>Mon–Fri · 9:00 — 18:00</p>
                  <p>Sat · 10:00 — 16:00</p>
                  <p className="text-muted-foreground">Sun · Closed</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 sm:p-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[11px] uppercase tracking-widest text-muted-foreground">Name</Label>
                    <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[11px] uppercase tracking-widest text-muted-foreground">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required className={inputCls} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[11px] uppercase tracking-widest text-muted-foreground">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" value={formData.subject} onChange={handleChange} required className={inputCls} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[11px] uppercase tracking-widest text-muted-foreground">Message</Label>
                  <Textarea id="message" placeholder="Tell us more…" rows={7} value={formData.message} onChange={handleChange} required className="bg-foreground/5 border-0 rounded-2xl p-4 resize-none" />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary-glow font-semibold group h-12">
                  Send message
                  <Send className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
