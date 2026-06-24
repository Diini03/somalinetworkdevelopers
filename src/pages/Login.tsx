import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else if (data.user) {
        const { data: roleData } = await supabase
          .from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
        toast({ title: "Welcome back", description: "You've successfully logged in." });
        navigate(roleData ? "/admin" : "/profile");
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "bg-foreground/5 border-0 rounded-2xl px-4 h-12";

  return (
    <div className="min-h-screen relative overflow-hidden noise">
      <Navbar />
      <div className="orb animate-float-slow bg-primary/30 w-[420px] h-[420px] -top-20 -left-32" />
      <div className="orb animate-float-slower bg-foreground/5 w-[400px] h-[400px] bottom-0 -right-20" />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Welcome back</div>
            <h1 className="font-display text-5xl sm:text-6xl leading-tight">Sign <span className="italic">in.</span></h1>
          </div>

          <div className="glass-strong rounded-3xl p-8 shadow-float">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] uppercase tracking-widest text-muted-foreground">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[11px] uppercase tracking-widest text-muted-foreground">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls} />
              </div>
              <Button type="submit" className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow font-semibold" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link to="/signup" className="text-foreground font-semibold story-link">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
