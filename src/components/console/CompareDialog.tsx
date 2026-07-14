import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { ScoreRing } from "./ScoreRing";
import { AvailabilityDot } from "./AvailabilityDot";
import { X, MapPin, GraduationCap, ExternalLink, SlidersHorizontal, Award, Briefcase, Link as LinkIcon } from "lucide-react";

interface Props {
  ids: string[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onRemove: (id: string) => void;
  onOpenProfile?: (id: string) => void;
}

const mapRow = (row: any): Candidate => ({
  id: row.id, name: row.name, title: row.title, photo: row.photo,
  skills: row.skills || [], location: row.location, qualification: row.qualification,
  bio: row.bio, linkedin: row.linkedin, github: row.github, portfolio: row.portfolio,
  experience: Array.isArray(row.experience) ? (row.experience as unknown as ExperienceEntry[]) : [],
  availability: row.availability, certifications: row.certifications || [],
  aiScore: row.ai_score ?? row.aiScore,
});

type FieldKey =
  | "availability"
  | "location"
  | "qualification"
  | "skillsTotal"
  | "experience"
  | "certifications"
  | "links"
  | "bio"
  | "skillsMatrix";

const FIELD_DEFS: { key: FieldKey; label: string }[] = [
  { key: "availability", label: "Availability" },
  { key: "location", label: "Location" },
  { key: "qualification", label: "Qualification" },
  { key: "skillsTotal", label: "Skills total" },
  { key: "experience", label: "Experience" },
  { key: "certifications", label: "Certifications" },
  { key: "links", label: "Links" },
  { key: "bio", label: "Bio" },
  { key: "skillsMatrix", label: "Skills matrix" },
];

const DEFAULT_FIELDS: FieldKey[] = [
  "availability",
  "location",
  "qualification",
  "skillsTotal",
  "skillsMatrix",
];

const STORAGE_KEY = "snd:compareFields";

export const CompareDialog = ({ ids, open, onOpenChange, onRemove, onOpenProfile }: Props) => {
  const [cands, setCands] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<FieldKey[]>(() => {
    if (typeof window === "undefined") return DEFAULT_FIELDS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_FIELDS;
      const parsed = JSON.parse(raw) as FieldKey[];
      const valid = parsed.filter((k) => FIELD_DEFS.some((f) => f.key === k));
      return valid.length ? valid : DEFAULT_FIELDS;
    } catch {
      return DEFAULT_FIELDS;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fields)); } catch {}
  }, [fields]);

  const toggleField = (k: FieldKey) =>
    setFields((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  const has = (k: FieldKey) => fields.includes(k);

  useEffect(() => {
    if (!open || ids.length === 0) return;
    setLoading(true);
    Promise.all(
      ids.map((id) => supabase.rpc("get_public_candidate", { _id: id }).then(({ data }) => {
        const row: any = Array.isArray(data) ? data[0] : data;
        return row ? mapRow(row) : null;
      }))
    ).then((list) => {
      setCands(list.filter(Boolean) as Candidate[]);
      setLoading(false);
    });
  }, [ids, open]);

  const allSkills = Array.from(new Set(cands.flatMap((c) => c.skills))).sort();
  const best = cands.reduce((m, c) => Math.max(m, c.aiScore ?? 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 bg-surface-elevated">
        <div className="sticky top-0 z-10 bg-surface-elevated border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Compare</div>
            <h2 className="text-lg font-semibold">{cands.length} candidate{cands.length !== 1 ? "s" : ""} side by side</h2>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-surface hover:bg-accent text-xs font-medium transition-colors"
                aria-label="Choose fields"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Fields
                <span className="font-mono tabular-nums text-muted-foreground">{fields.length}/{FIELD_DEFS.length}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2">
              <div className="px-2 py-1.5 flex items-center justify-between">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Show fields</div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setFields(FIELD_DEFS.map((f) => f.key))}
                    className="text-[11px] text-muted-foreground hover:text-foreground"
                  >All</button>
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <button
                    onClick={() => setFields(DEFAULT_FIELDS)}
                    className="text-[11px] text-muted-foreground hover:text-foreground"
                  >Reset</button>
                </div>
              </div>
              <div className="flex flex-col">
                {FIELD_DEFS.map((f) => (
                  <label
                    key={f.key}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer text-sm"
                  >
                    <Checkbox checked={has(f.key)} onCheckedChange={() => toggleField(f.key)} />
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {loading ? (
          <div className="p-8 text-sm text-muted-foreground">Loading…</div>
        ) : cands.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">No candidates selected.</div>
        ) : (
          <div className="p-6">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${cands.length}, minmax(0, 1fr))` }}
            >
              {/* Header cards (always shown) */}
              {cands.map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-4 relative">
                  <button
                    onClick={() => onRemove(c.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-md hover:bg-accent inline-flex items-center justify-center text-muted-foreground"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-start gap-3">
                    <img src={c.photo} alt={c.name} className="w-14 h-14 rounded-lg object-cover ring-1 ring-border" />
                    <div className="min-w-0 pr-6">
                      <div className="text-sm font-semibold truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <ScoreRing score={c.aiScore} size={36} />
                    <div>
                      <div className={`text-lg font-mono font-semibold tabular-nums ${((c.aiScore ?? 0) >= best && best > 0) ? "text-primary" : ""}`}>
                        {c.aiScore ?? "—"}
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">AI match</div>
                    </div>
                  </div>
                  {onOpenProfile && (
                    <button
                      onClick={() => { onOpenChange(false); onOpenProfile(c.id); }}
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-md border border-border bg-surface hover:bg-accent text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open profile
                    </button>
                  )}
                </div>
              ))}

              {has("availability") && <>
                <SectionLabel span={cands.length} label="Availability" />
                {cands.map((c) => (
                  <div key={c.id + "-av"} className="px-3 py-2 text-sm">
                    <AvailabilityDot status={c.availability} withLabel />
                  </div>
                ))}
              </>}

              {has("location") && <>
                <SectionLabel span={cands.length} label="Location" />
                {cands.map((c) => (
                  <div key={c.id + "-loc"} className="px-3 py-2 text-sm inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />{c.location || "—"}
                  </div>
                ))}
              </>}

              {has("qualification") && <>
                <SectionLabel span={cands.length} label="Qualification" />
                {cands.map((c) => (
                  <div key={c.id + "-q"} className="px-3 py-2 text-sm inline-flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />{c.qualification || "—"}
                  </div>
                ))}
              </>}

              {has("skillsTotal") && <>
                <SectionLabel span={cands.length} label="Skills total" />
                {cands.map((c) => (
                  <div key={c.id + "-sc"} className="px-3 py-2 text-sm font-mono tabular-nums">{c.skills.length}</div>
                ))}
              </>}

              {has("experience") && <>
                <SectionLabel span={cands.length} label="Experience" />
                {cands.map((c) => (
                  <div key={c.id + "-exp"} className="px-3 py-2 text-sm space-y-1.5">
                    {c.experience && c.experience.length > 0 ? c.experience.slice(0, 3).map((e, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="truncate">{e.company}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {[e.startYear, e.endYear].filter(Boolean).join("–") || ""}
                          </div>
                        </div>
                      </div>
                    )) : <span className="text-muted-foreground">—</span>}
                  </div>
                ))}
              </>}

              {has("certifications") && <>
                <SectionLabel span={cands.length} label="Certifications" />
                {cands.map((c) => (
                  <div key={c.id + "-cert"} className="px-3 py-2 text-sm space-y-1">
                    {c.certifications && c.certifications.length > 0 ? c.certifications.map((cert, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{cert}</span>
                      </div>
                    )) : <span className="text-muted-foreground">—</span>}
                  </div>
                ))}
              </>}

              {has("links") && <>
                <SectionLabel span={cands.length} label="Links" />
                {cands.map((c) => {
                  const links = [
                    c.linkedin && { label: "LinkedIn", href: c.linkedin },
                    c.github && { label: "GitHub", href: c.github },
                    c.portfolio && { label: "Portfolio", href: c.portfolio },
                  ].filter(Boolean) as { label: string; href: string }[];
                  return (
                    <div key={c.id + "-lk"} className="px-3 py-2 text-sm space-y-1">
                      {links.length ? links.map((l) => (
                        <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary truncate">
                          <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> {l.label}
                        </a>
                      )) : <span className="text-muted-foreground">—</span>}
                    </div>
                  );
                })}
              </>}

              {has("bio") && <>
                <SectionLabel span={cands.length} label="Bio" />
                {cands.map((c) => (
                  <div key={c.id + "-bio"} className="px-3 py-2 text-sm text-muted-foreground leading-relaxed">
                    {c.bio || "—"}
                  </div>
                ))}
              </>}
            </div>

            {has("skillsMatrix") && (
              <div className="mt-8">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Skills matrix</div>
                <div className="rounded-xl border border-border overflow-hidden bg-card">
                  <div
                    className="grid text-xs border-b border-border bg-surface"
                    style={{ gridTemplateColumns: `minmax(180px, 1.5fr) repeat(${cands.length}, minmax(0, 1fr))` }}
                  >
                    <div className="px-3 py-2 font-mono uppercase tracking-wider text-muted-foreground">Skill</div>
                    {cands.map((c) => (
                      <div key={c.id + "-h"} className="px-3 py-2 font-medium truncate">{c.name.split(" ")[0]}</div>
                    ))}
                  </div>
                  {allSkills.map((s, i) => (
                    <div
                      key={s}
                      className={`grid text-sm items-center ${i % 2 ? "bg-surface/40" : ""}`}
                      style={{ gridTemplateColumns: `minmax(180px, 1.5fr) repeat(${cands.length}, minmax(0, 1fr))` }}
                    >
                      <div className="px-3 py-2 font-mono text-[12px]">{s}</div>
                      {cands.map((c) => (
                        <div key={c.id + s} className="px-3 py-2">
                          {c.skills.includes(s) ? (
                            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                          ) : (
                            <span className="inline-block w-2 h-2 rounded-full bg-border" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const SectionLabel = ({ span, label }: { span: number; label: string }) => (
  <div
    className="col-span-full mt-4 pt-3 border-t border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
    style={{ gridColumn: `1 / span ${span}` }}
  >
    {label}
  </div>
);
