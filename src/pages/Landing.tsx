import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CommandPalette } from "@/components/CommandPalette";
import { ArrowRight, Search, GitCompare, Send, Sparkles } from "lucide-react";
import { ScoreRing } from "@/components/console/ScoreRing";
import { AvailabilityDot } from "@/components/console/AvailabilityDot";

interface Row { id: string; name: string; title: string; photo: string; location: string; skills: string[]; availability: string; ai_score: number | null; }

const Landing = () => {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    supabase.rpc("get_public_candidates").then(({ data }) => {
      if (data) setRows(data as any);
    });
  }, []);

  const featured = rows.slice(0, 4);
  const stackSet = new Set<string>();
  rows.forEach((r) => r.skills?.forEach((s) => stackSet.add(s)));
  const citySet = new Set(rows.map((r) => r.location).filter(Boolean));
  const openNow = rows.filter((r) => (r.availability || "").toLowerCase().includes("open")).length;

  const openPalette = () => (window as any).__sndOpenPalette?.();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <CommandPalette />
      <SiteHeader onOpenPalette={openPalette} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="absolute inset-0 radial-hero pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="inline-flex items-center gap-2 h-7 px-2.5 rounded-full border border-border bg-surface/70 text-[11px] font-mono text-muted-foreground mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
            v3.0 · Now with AI ranking
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl">
            Engineering talent
            <br />
            <span className="italic text-primary">from the Horn.</span>
          </h1>

          <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
            A working index of Somali software engineers, designers and data people.
            Vetted, ranked by fit, and reachable in a single click.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/talent"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Browse talent <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={openPalette}
              className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-border bg-surface hover:bg-accent text-sm"
            >
              <Search className="w-4 h-4" /> Search anyone <kbd className="kbd ml-1">⌘K</kbd>
            </button>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            <Stat label="Candidates" value={rows.length} />
            <Stat label="Stacks tracked" value={stackSet.size} />
            <Stat label="Cities" value={citySet.size} />
            <Stat label="Open to work" value={openNow} accent />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-12">
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">How it works</div>
          <h2 className="font-display text-4xl md:text-5xl">Hire without the noise.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Step n="01" icon={<Search className="w-4 h-4" />} title="Search & filter"
            body="Narrow by stack, city, seniority, availability. AI ranks the shortlist by fit for your role." />
          <Step n="02" icon={<GitCompare className="w-4 h-4" />} title="Compare side by side"
            body="Pin up to three candidates. Toggle the fields you care about. Decide fast." />
          <Step n="03" icon={<Send className="w-4 h-4" />} title="Reach out directly"
            body="One click messages the candidate. No middle-man, no gatekeeping, no ghost recruiters." />
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" /> Top ranked this week
              </div>
              <h2 className="font-display text-4xl">Featured talent.</h2>
            </div>
            <Link to="/talent" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((c) => (
              <Link
                key={c.id}
                to={`/talent/${c.id}`}
                className="group rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <img src={c.photo} alt={c.name} className="w-12 h-12 rounded-lg object-cover ring-1 ring-border bg-muted" />
                  <ScoreRing score={c.ai_score ?? undefined} size={34} />
                </div>
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.title}</div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="truncate">{c.location}</span>
                  <AvailabilityDot status={c.availability} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-border bg-surface overflow-hidden relative">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-display text-3xl md:text-4xl mb-2">Ready to hire?</h3>
              <p className="text-muted-foreground max-w-md text-sm">
                Start with the full directory. Filters and compare are one tap away.
              </p>
            </div>
            <Link
              to="/talent"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 self-start md:self-auto"
            >
              Open the console <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: number; accent?: boolean }) => (
  <div>
    <div className={`font-display text-4xl md:text-5xl tabular-nums ${accent ? "text-primary" : ""}`}>{value}</div>
    <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
  </div>
);

const Step = ({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) => (
  <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
    <div className="absolute top-4 right-4 font-mono text-[11px] text-muted-foreground">{n}</div>
    <div className="w-9 h-9 rounded-md bg-primary/10 text-primary border border-primary/25 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
  </div>
);

export default Landing;
