import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password mismatch", description: "Passwords don't match.", variant: "destructive" });
      return;
    }
    if (formData.password.length < 6) {
      toast({ title: "Password too short", description: "Min 6 characters.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { emailRedirectTo: `${window.location.origin}/`, data: { name: formData.name } },
      });
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created", description: "Welcome to SND." });
        navigate("/profile");
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const inputCls = "bg-foreground/5 border-0 rounded-2xl px-4 h-12";

  return (
    <div className="min-h-screen relative overflow-hidden noise">
      <Navbar />
      <div className="orb animate-float-slow bg-primary/30 w-[420px] h-[420px] -top-20 -right-32" />
      <div className="orb animate-float-slower bg-foreground/5 w-[400px] h-[400px] bottom-0 -left-20" />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Join SND</div>
            <h1 className="font-display text-5xl sm:text-6xl leading-tight">Create <span className="italic">account.</span></h1>
          </div>

          <div className="glass-strong rounded-3xl p-8 shadow-float">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[11px] uppercase tracking-widest text-muted-foreground">Full name</Label>
                <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] uppercase tracking-widest text-muted-foreground">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[11px] uppercase tracking-widest text-muted-foreground">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[11px] uppercase tracking-widest text-muted-foreground">Confirm</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className={inputCls} />
              </div>
              <Button type="submit" className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow font-semibold" disabled={isLoading}>
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already a member?{" "}
              <Link to="/login" className="text-foreground font-semibold story-link">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
