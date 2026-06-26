import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const logout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  const isActive = (p: string) => location.pathname === p;
  const link = (p: string) => `caption block py-2 ${isActive(p) ? "text-primary" : "hover:text-foreground"}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r border-border p-6 flex flex-col">
        <Link to="/admin" className="font-display text-3xl mb-1">SND<span className="text-primary">.</span></Link>
        <div className="caption mb-12">Admin · v2</div>
        <nav className="space-y-1 flex-1">
          <Link to="/admin" className={link("/admin")}>→ Dashboard</Link>
          <Link to="/admin/candidates" className={link("/admin/candidates")}>→ Candidates</Link>
        </nav>
        <div className="space-y-1 border-t border-border pt-6">
          <Link to="/" className="caption block py-2 hover:text-foreground">↗ View site</Link>
          <button onClick={logout} className="caption block py-2 hover:text-destructive text-left w-full">↗ Sign out</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-10">{children}</div>
      </main>
    </div>
  );
};
