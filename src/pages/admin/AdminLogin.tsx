import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: role } = await supabase.from("user_roles")
        .select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
      if (role) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      toast({ title: "Access denied", description: error?.message || "Invalid credentials", variant: "destructive" });
      setLoading(false);
      return;
    }
    const { data: role } = await supabase.from("user_roles")
      .select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
    if (!role) {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "Admins only.", variant: "destructive" });
      setLoading(false);
      return;
    }
    navigate("/admin", { replace: true });
  };

  const input = "w-full h-10 px-3 rounded-md border border-border bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-card p-6 shadow-[0_10px_40px_-12px_hsl(var(--foreground)/0.1)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium leading-tight">SND Admin</div>
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Staff sign-in</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 mb-5">Restricted access. Admin credentials required.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} autoComplete="email" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} autoComplete="current-password" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? "Authenticating…" : "Sign in"}
            </button>
          </form>
        </div>
        <div className="mt-4 text-center">
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
