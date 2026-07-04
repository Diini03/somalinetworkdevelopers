import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Props {
  skills: string[];
  activeSkills: string[];
  onToggleSkill: (s: string) => void;

  locations: string[];
  activeLocations: string[];
  onToggleLocation: (l: string) => void;

  quals: string[];
  activeQuals: string[];
  onToggleQual: (q: string) => void;

  availability: "all" | "open" | "passive";
  onAvailability: (v: "all" | "open" | "passive") => void;

  minScore: number;
  onMinScore: (n: number) => void;

  onClear: () => void;
  hasFilters: boolean;
}

const Section = ({ label, count, children }: { label: string; count?: number; children: React.ReactNode }) => (
  <div className="py-4 border-b border-border last:border-0">
    <div className="flex items-center justify-between mb-3">
      <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      {typeof count === "number" && count > 0 && (
        <span className="text-[10px] font-mono text-primary bg-primary/10 rounded px-1.5 py-0.5">{count}</span>
      )}
    </div>
    {children}
  </div>
);

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-surface border-border text-foreground hover:border-foreground/30"
    }`}
  >
    {children}
  </button>
);

export const FilterRail = (p: Props) => {
  const seg = "flex-1 text-xs py-1.5 rounded-md transition-colors";
  return (
    <aside className="hidden lg:block w-[260px] shrink-0 border-r border-border bg-surface/50">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto scrollbar-thin px-5">
        <div className="flex items-center justify-between py-4 border-b border-border">
          <div className="text-sm font-medium">Filters</div>
          {p.hasFilters && (
            <button onClick={p.onClear} className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <Section label="Availability">
          <div className="flex gap-1 p-1 bg-background rounded-lg border border-border">
            {(["all", "open", "passive"] as const).map((v) => (
              <button
                key={v}
                onClick={() => p.onAvailability(v)}
                className={`${seg} ${p.availability === v ? "bg-surface-elevated shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {v === "all" ? "All" : v === "open" ? "Open" : "Passive"}
              </button>
            ))}
          </div>
        </Section>

        <Section label="AI match score">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Min score</span>
            <span className="font-mono text-xs tabular-nums text-foreground">{p.minScore}</span>
          </div>
          <Slider value={[p.minScore]} min={0} max={100} step={5} onValueChange={(v) => p.onMinScore(v[0])} />
        </Section>

        {p.skills.length > 0 && (
          <Section label="Skills" count={p.activeSkills.length}>
            <div className="flex flex-wrap gap-1.5">
              {p.skills.slice(0, 40).map((s) => (
                <Chip key={s} active={p.activeSkills.includes(s)} onClick={() => p.onToggleSkill(s)}>{s}</Chip>
              ))}
            </div>
          </Section>
        )}

        {p.locations.length > 0 && (
          <Section label="Location" count={p.activeLocations.length}>
            <div className="flex flex-wrap gap-1.5">
              {p.locations.map((l) => (
                <Chip key={l} active={p.activeLocations.includes(l)} onClick={() => p.onToggleLocation(l)}>{l}</Chip>
              ))}
            </div>
          </Section>
        )}

        {p.quals.length > 0 && (
          <Section label="Qualification" count={p.activeQuals.length}>
            <div className="flex flex-wrap gap-1.5">
              {p.quals.map((q) => (
                <Chip key={q} active={p.activeQuals.includes(q)} onClick={() => p.onToggleQual(q)}>{q}</Chip>
              ))}
            </div>
          </Section>
        )}
      </div>
    </aside>
  );
};
