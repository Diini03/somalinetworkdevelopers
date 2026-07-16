import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Users, Sparkles, MapPin, Briefcase, ArrowUpRight } from "lucide-react";

interface Stats {
  total: number;
  scored: number;
  cities: number;
  openToWork: number;
}

interface RecentCandidate {
  id: string;
  name: string;
  title: string;
  location: string;
  ai_score: number | null;
  created_at: string;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, scored: 0, cities: 0, openToWork: 0 });
  const [recent, setRecent] = useState<RecentCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("candidates")
        .select("id, name, title, location, availability, ai_score, created_at")
        .order("created_at", { ascending: false });

      if (data) {
        const cities = new Set(data.map((c) => c.location).filter(Boolean));
        setStats({
          total: data.length,
          scored: data.filter((c) => c.ai_score != null).length,
          cities: cities.size,
          openToWork: data.filter((c) => /open/i.test(c.availability || "")).length,
        });
        setRecent(data.slice(0, 6));
      }
      setLoading(false);
    };
    load();
  }, []);

  const metric = (label: string, value: number | string, Icon: typeof Users) => (
    <div className="rounded-lg border border-border bg-surface/50 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">live</span>
      </div>
      <div className="font-serif text-4xl leading-none tracking-tight">{value}</div>
      <div className="mt-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
              · Admin console
            </div>
            <h1 className="font-serif text-4xl tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              A quick read on the network — who's in, where they are, and what's been scored.
            </p>
          </div>
          <Link
            to="/admin/candidates"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Manage candidates <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-xs font-mono text-muted-foreground">loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metric("Candidates", stats.total, Users)}
              {metric("AI Scored", stats.scored, Sparkles)}
              {metric("Cities", stats.cities, MapPin)}
              {metric("Open to Work", stats.openToWork, Briefcase)}
            </div>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Recent additions
                </h2>
                <Link to="/admin/candidates" className="text-xs text-muted-foreground hover:text-foreground">
                  View all →
                </Link>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                {recent.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground">No candidates yet.</div>
                ) : (
                  <ul className="divide-y divide-border">
                    {recent.map((c) => (
                      <li key={c.id} className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                          {c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{c.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {c.title} · {c.location}
                          </div>
                        </div>
                        <div className="text-right">
                          {c.ai_score != null ? (
                            <div className="font-mono text-sm text-primary">{c.ai_score}<span className="text-muted-foreground">/100</span></div>
                          ) : (
                            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">unscored</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
