import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ShieldOff, UserPlus, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserRow {
  user_id: string;
  email: string;
  name: string;
  created_at: string;
  roles: ("admin" | "user")[];
}

export const RolesManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [grantEmail, setGrantEmail] = useState("");
  const [granting, setGranting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_users_with_roles");
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setUsers((data as UserRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const grantAdmin = async (email: string) => {
    if (!email.trim()) return;
    setGranting(true);
    const { error } = await supabase.rpc("admin_grant_role", { _email: email.trim(), _role: "admin" });
    setGranting(false);
    if (error) {
      toast({ title: "Could not grant", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Admin granted", description: email });
      setGrantEmail("");
      load();
    }
  };

  const revoke = async (userId: string, role: "admin" | "user") => {
    const { error } = await supabase.rpc("admin_revoke_role", { _user_id: userId, _role: role });
    if (error) toast({ title: "Could not revoke", description: error.message, variant: "destructive" });
    else { toast({ title: "Role revoked" }); load(); }
  };

  const adminCount = users.filter((u) => u.roles.includes("admin")).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Access control</div>
          <h1 className="text-3xl font-serif mt-1">Roles</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Grant or revoke admin access. Sign-ups create a user account; promote one to admin here.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-medium mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Grant admin by email
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="user@example.com"
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => grantAdmin(grantEmail)} disabled={!grantEmail.trim() || granting}>
              {granting ? "Granting…" : "Grant admin"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            The user must have signed up first — this creates a profile we can promote.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <div className="text-sm">
              <span className="font-mono">{users.length}</span>
              <span className="text-muted-foreground"> users · </span>
              <span className="font-mono">{adminCount}</span>
              <span className="text-muted-foreground"> admin{adminCount === 1 ? "" : "s"}</span>
            </div>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No users yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-mono uppercase text-[10px] text-muted-foreground bg-surface">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Roles</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isAdmin = u.roles.includes("admin");
                  return (
                    <tr key={u.user_id} className="border-t border-border">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3 text-muted-foreground">{u.email}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {u.roles.length === 0 && (
                            <span className="text-xs text-muted-foreground font-mono">—</span>
                          )}
                          {u.roles.map((r) => (
                            <span
                              key={r}
                              className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                r === "admin"
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : "bg-muted text-muted-foreground border border-border"
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {isAdmin ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                                <ShieldOff className="w-3.5 h-3.5" /> Revoke admin
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke admin access?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {u.name} ({u.email}) will lose access to the admin dashboard.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => revoke(u.user_id, "admin")}>
                                  Revoke
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => grantAdmin(u.email)}>
                            <Shield className="w-3.5 h-3.5" /> Make admin
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RolesManagement;
