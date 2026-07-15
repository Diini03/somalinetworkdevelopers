import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CommandPalette } from "@/components/CommandPalette";
import { ScoreRing } from "@/components/console/ScoreRing";
import { AvailabilityDot } from "@/components/console/AvailabilityDot";
import { ContactDrawer } from "@/components/console/ContactDrawer";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, MapPin, GraduationCap, Github, Linkedin, Globe,
  Copy, FileText, Mail, GitCompare, Check, Award, Briefcase,
} from "lucide-react";

const MAX_COMPARE = 3;

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [c, setC] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [cvLoading, setCvLoading] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("snd:compareIds");
      return raw ? (JSON.parse(raw) as string[]).slice(0, MAX_COMPARE) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase.rpc("get_public_candidate", { _id: id }).then(({ data }) => {
      const row: any = Array.isArray(data) ? data[0] : data;
      if (row) {
        setC({
          id: row.id, name: row.name, title: row.title, photo: row.photo,
          skills: row.skills || [], location: row.location, qualification: row.qualification,
          bio: row.bio, linkedin: row.linkedin, github: row.github, portfolio: row.portfolio,
          experience: Array.isArray(row.experience) ? (row.experience as unknown as ExperienceEntry[]) : [],
          availability: row.availability, certifications: row.certifications || [],
          aiScore: row.ai_score ?? row.aiScore,
        });
      }
      setLoading(false);
    });
  }, [id]);

  const inCompare = !!c && compareIds.includes(c.id);
  const compareDisabled = !inCompare && compareIds.length >= MAX_COMPARE;

  const toggleCompare = () => {
    if (!c) return;
    const next = inCompare ? compareIds.filter((x) => x !== c.id) : [...compareIds, c.id].slice(0, MAX_COMPARE);
    setCompareIds(next);
    try { localStorage.setItem("snd:compareIds", JSON.stringify(next)); } catch {}
  };

  const openCv = async () => {
    if (!c) return;
    setCvLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-cv-signed-url", { body: { candidateId: c.id } });
      if (error || !data?.url) {
        toast({ title: "Resume unavailable", description: "No resume on file.", variant: "destructive" });
        return;
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } finally { setCvLoading(false); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied" });
  };

  const openPalette = () => (window as any).__sndOpenPalette?.();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-w-5xl mx-auto px-6 py-12 animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-40" />
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-4xl mb-3">Candidate not found</h1>
          <p className="text-muted-foreground mb-6">This profile may have been removed.</p>
          <Link to="/talent" className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to talent
          </Link>
        </div>
      </div>
    );
  }

  const iconBtn = "w-10 h-10 rounded-md border border-border bg-surface hover:bg-accent inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CommandPalette />
      <SiteHeader onOpenPalette={openPalette} compareCount={compareIds.length} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {/* HEADER */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="relative h-32 bg-surface grid-bg opacity-90 border-b border-border" />
          <div className="px-6 md:px-10 pb-8 -mt-14 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <img
                src={c.photo}
                alt={c.name}
                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-card bg-muted shrink-0"
              />
              <div className="flex-1 min-w-0 md:pb-2">
                <h1 className="font-display text-4xl md:text-5xl leading-tight">{c.name}</h1>
                <div className="text-muted-foreground mt-1">{c.title}</div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{c.location}</span>
                  <span className="inline-flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />{c.qualification}</span>
                  <AvailabilityDot status={c.availability} withLabel />
                </div>
              </div>
              <div className="flex items-center gap-3 md:pb-2">
                <div className="flex flex-col items-center gap-1 pr-4 border-r border-border">
                  <ScoreRing score={c.aiScore} size={48} />
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">AI match</div>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-2 mt-8">
              <button
                onClick={() => setContactOpen(true)}
                className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" /> Contact
              </button>
              <button
                onClick={openCv}
                disabled={cvLoading}
                className="h-10 px-4 rounded-lg border border-border bg-surface hover:bg-accent text-sm inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" /> {cvLoading ? "Opening…" : "Resume"}
              </button>
              <button
                onClick={toggleCompare}
                disabled={compareDisabled}
                className={`h-10 px-4 rounded-lg text-sm inline-flex items-center gap-1.5 border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  inCompare
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border bg-surface hover:bg-accent"
                }`}
              >
                {inCompare ? <><Check className="w-4 h-4" /> In compare</> : <><GitCompare className="w-4 h-4" /> Add to compare</>}
              </button>
              <div className="flex-1" />
              {c.linkedin && <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>}
              {c.github && <a href={c.github} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="GitHub"><Github className="w-4 h-4" /></a>}
              {c.portfolio && <a href={c.portfolio} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="Portfolio"><Globe className="w-4 h-4" /></a>}
              <button onClick={copyLink} className={iconBtn} aria-label="Copy link"><Copy className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <Panel label="About">
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{c.bio}</p>
            </Panel>

            <Panel label="Experience" icon={<Briefcase className="w-3 h-3" />}>
              {c.experience.length === 0 ? (
                <div className="text-sm text-muted-foreground">No experience listed.</div>
              ) : (
                <ol className="relative border-l border-border ml-2 space-y-6">
                  {c.experience.map((e, i) => (
                    <li key={i} className="pl-5 relative">
                      <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-card" />
                      <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                        {e.startYear ?? "—"} – {e.endYear ?? "Present"}
                      </div>
                      <div className="text-sm font-medium">{e.company}</div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{e.description}</p>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>

            {c.certifications && c.certifications.length > 0 && (
              <Panel label="Certifications" icon={<Award className="w-3 h-3" />}>
                <div className="grid grid-cols-2 gap-3">
                  {c.certifications.map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block rounded-md border border-border overflow-hidden hover:border-primary transition-colors">
                      <img src={src} alt={`Certification ${i + 1}`} className="w-full aspect-[4/3] object-cover" />
                    </a>
                  ))}
                </div>
              </Panel>
            )}
          </div>

          <div className="space-y-6">
            <Panel label="Skills">
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <span key={s} className="text-[11px] font-mono px-2 py-1 rounded bg-surface border border-border text-foreground/90">{s}</span>
                ))}
              </div>
            </Panel>

            <Panel label="Details">
              <dl className="text-sm space-y-2.5">
                <Row k="Location" v={c.location} />
                <Row k="Qualification" v={c.qualification} />
                <Row k="Availability" v={c.availability} />
                <Row k="AI match" v={c.aiScore != null ? `${c.aiScore}/100` : "—"} mono />
              </dl>
            </Panel>
          </div>
        </div>
      </div>

      <SiteFooter />

      <ContactDrawer
        open={contactOpen}
        onOpenChange={setContactOpen}
        candidateId={c.id}
        candidateName={c.name}
      />
    </div>
  );
};

const Panel = ({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <section className="rounded-xl border border-border bg-card p-6">
    <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
      {icon} {label}
    </div>
    {children}
  </section>
);

const Row = ({ k, v, mono }: { k: string; v: string; mono?: boolean }) => (
  <div className="flex items-center justify-between gap-4">
    <dt className="text-xs text-muted-foreground">{k}</dt>
    <dd className={`text-sm text-right truncate ${mono ? "font-mono tabular-nums" : ""}`}>{v}</dd>
  </div>
);

export default CandidateProfile;
