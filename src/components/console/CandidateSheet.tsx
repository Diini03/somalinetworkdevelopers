import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { AvailabilityDot } from "./AvailabilityDot";
import { ScoreRing } from "./ScoreRing";
import { ContactDrawer } from "./ContactDrawer";
import { useToast } from "@/hooks/use-toast";
import { MapPin, GraduationCap, Github, Linkedin, Globe, Copy, FileText, Mail, X } from "lucide-react";

interface Props {
  candidateId: string | null;
  onClose: () => void;
}

export const CandidateSheet = ({ candidateId, onClose }: Props) => {
  const { toast } = useToast();
  const [c, setC] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (!candidateId) { setC(null); return; }
    setLoading(true);
    supabase.rpc("get_public_candidate", { _id: candidateId }).then(({ data }) => {
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
      } else {
        setC(null);
      }
      setLoading(false);
    });
  }, [candidateId]);

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
    if (!c) return;
    navigator.clipboard.writeText(`${window.location.origin}/dev/${c.id}`);
    toast({ title: "Link copied" });
  };

  const iconBtn = "w-9 h-9 rounded-md border border-border bg-surface hover:bg-accent inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors";

  return (
    <>
      <Sheet open={!!candidateId} onOpenChange={(v) => !v && onClose()}>
        <SheetContent side="right" className="p-0 w-full sm:max-w-[640px] overflow-y-auto scrollbar-thin border-l bg-surface-elevated">
          {loading || !c ? (
            <div className="p-8 space-y-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2 pt-2">
                  <div className="h-5 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
              <div className="h-24 bg-muted rounded" />
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="p-6 pb-5 border-b border-border">
                <div className="flex items-start gap-4">
                  <img src={c.photo} alt={c.name} className="w-20 h-20 rounded-xl object-cover ring-1 ring-border" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold leading-tight">{c.name}</h2>
                    <div className="text-sm text-muted-foreground mt-0.5">{c.title}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                      <span className="inline-flex items-center gap-1"><GraduationCap className="w-3 h-3" />{c.qualification}</span>
                    </div>
                    <div className="mt-2"><AvailabilityDot status={c.availability} withLabel /></div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-accent inline-flex items-center justify-center text-muted-foreground" aria-label="Close">
                      <X className="w-4 h-4" />
                    </button>
                    <ScoreRing score={c.aiScore} size={44} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-5">
                  <button
                    onClick={() => setContactOpen(true)}
                    className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-1.5 flex-1 justify-center sm:flex-none"
                  >
                    <Mail className="w-4 h-4" /> Contact
                  </button>
                  <button
                    onClick={openCv}
                    disabled={cvLoading}
                    className="h-9 px-3 rounded-md border border-border bg-surface hover:bg-accent text-sm inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" /> {cvLoading ? "Opening…" : "Resume"}
                  </button>
                  <div className="flex-1" />
                  {c.linkedin && <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>}
                  {c.github && <a href={c.github} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="GitHub"><Github className="w-4 h-4" /></a>}
                  {c.portfolio && <a href={c.portfolio} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="Portfolio"><Globe className="w-4 h-4" /></a>}
                  <button onClick={copyLink} className={iconBtn} aria-label="Copy profile link"><Copy className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-11 px-6">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none h-11">Overview</TabsTrigger>
                  <TabsTrigger value="experience" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none h-11">Experience</TabsTrigger>
                  <TabsTrigger value="skills" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none h-11">Skills</TabsTrigger>
                  {c.certifications && c.certifications.length > 0 && (
                    <TabsTrigger value="certs" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none h-11">Certifications</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="overview" className="p-6 space-y-6 mt-0">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">About</div>
                    <p className="text-sm leading-relaxed text-foreground/90">{c.bio}</p>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Top skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.skills.slice(0, 10).map((s) => (
                        <span key={s} className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{s}</span>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="p-6 mt-0">
                  {c.experience.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No experience listed.</div>
                  ) : (
                    <ol className="relative border-l border-border ml-2 space-y-6">
                      {c.experience.map((e, i) => (
                        <li key={i} className="pl-5 relative">
                          <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                          <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                            {e.startYear ?? "—"} – {e.endYear ?? "Present"}
                          </div>
                          <div className="text-sm font-medium">{e.company}</div>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{e.description}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </TabsContent>

                <TabsContent value="skills" className="p-6 mt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.map((s) => (
                      <span key={s} className="text-xs font-mono px-2 py-1 rounded bg-surface border border-border">{s}</span>
                    ))}
                  </div>
                </TabsContent>

                {c.certifications && c.certifications.length > 0 && (
                  <TabsContent value="certs" className="p-6 mt-0">
                    <div className="grid grid-cols-2 gap-3">
                      {c.certifications.map((src, i) => (
                        <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block rounded-md border border-border overflow-hidden hover:border-primary transition-colors">
                          <img src={src} alt={`Certification ${i + 1}`} className="w-full aspect-[4/3] object-cover" />
                        </a>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {c && (
        <ContactDrawer
          open={contactOpen}
          onOpenChange={setContactOpen}
          candidateId={c.id}
          candidateName={c.name}
        />
      )}
    </>
  );
};
