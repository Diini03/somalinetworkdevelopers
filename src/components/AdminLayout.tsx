import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Users, LogOut, ExternalLink, Upload, ShieldCheck } from "lucide-react";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const logout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  const item = (p: string, active: boolean) =>
    `flex items-center gap-2 h-9 px-3 rounded-md text-sm transition-colors ${
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-56 border-r border-border bg-surface/50 p-3 flex flex-col shrink-0">
        <Link to="/admin" className="flex items-center gap-2 h-12 px-2 mb-2">
          <span className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-mono text-[11px] font-semibold">SN</span>
          <div>
            <div className="text-sm font-medium leading-tight">SND</div>
            <div className="text-[10.5px] font-mono text-muted-foreground uppercase tracking-wider">Admin</div>
          </div>
        </Link>
        <nav className="space-y-0.5 flex-1">
          <Link to="/admin" className={item("/admin", location.pathname === "/admin")}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/admin/candidates" className={item("/admin/candidates", location.pathname === "/admin/candidates")}>
            <Users className="w-4 h-4" /> Candidates
          </Link>
          <Link to="/admin/candidates/import" className={item("/admin/candidates/import", location.pathname === "/admin/candidates/import")}>
            <Upload className="w-4 h-4" /> CSV import
          </Link>
          <Link to="/admin/roles" className={item("/admin/roles", location.pathname === "/admin/roles")}>
            <ShieldCheck className="w-4 h-4" /> Roles
          </Link>
        </nav>
        <div className="pt-3 border-t border-border space-y-0.5">
          <Link to="/" className="flex items-center gap-2 h-9 px-3 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
            <ExternalLink className="w-4 h-4" /> View site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-2 h-9 px-3 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-destructive">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
};
