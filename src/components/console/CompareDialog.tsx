import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { ScoreRing } from "./ScoreRing";
import { AvailabilityDot } from "./AvailabilityDot";
import { X, MapPin, GraduationCap, ExternalLink } from "lucide-react";

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

export const CompareDialog = ({ ids, open, onOpenChange, onRemove, onOpenProfile }: Props) => {
  const [cands, setCands] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Union of all skills across selected candidates for row alignment
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
              {/* Header cards */}
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
                </div>
              ))}

              {/* Availability */}
              <SectionLabel span={cands.length} label="Availability" />
              {cands.map((c) => (
                <div key={c.id + "-av"} className="px-3 py-2 text-sm">
                  <AvailabilityDot status={c.availability} withLabel />
                </div>
              ))}

              {/* Location */}
              <SectionLabel span={cands.length} label="Location" />
              {cands.map((c) => (
                <div key={c.id + "-loc"} className="px-3 py-2 text-sm inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />{c.location || "—"}
                </div>
              ))}

              {/* Qualification */}
              <SectionLabel span={cands.length} label="Qualification" />
              {cands.map((c) => (
                <div key={c.id + "-q"} className="px-3 py-2 text-sm inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />{c.qualification || "—"}
                </div>
              ))}

              {/* Skill count */}
              <SectionLabel span={cands.length} label="Skills total" />
              {cands.map((c) => (
                <div key={c.id + "-sc"} className="px-3 py-2 text-sm font-mono tabular-nums">{c.skills.length}</div>
              ))}
            </div>

            {/* Skills matrix */}
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
