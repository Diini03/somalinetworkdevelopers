import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="caption mb-8 text-center">SND · Staff entrance</div>
        <h1 className="font-display text-6xl text-center mb-12">Admin.</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="caption block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-0 border-b border-border focus:border-primary focus:outline-none py-2 font-mono text-sm"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="caption block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-0 border-b border-border focus:border-primary focus:outline-none py-2 font-mono text-sm"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating…" : "Enter →"}
          </button>
        </form>
        <div className="mt-12 text-center">
          <a href="/" className="caption story-link">← Back to index</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
