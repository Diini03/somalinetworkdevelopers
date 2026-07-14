import { Candidate } from "@/types/candidate";
import { ScoreRing } from "./ScoreRing";
import { AvailabilityDot } from "./AvailabilityDot";
import { MapPin, ArrowUpRight, Check } from "lucide-react";

interface Props {
  candidate: Candidate;
  onOpen: (id: string) => void;
  active?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  selectDisabled?: boolean;
}

export const CandidateCard = ({ candidate: c, onOpen, active, selected, onToggleSelect, selectDisabled }: Props) => {
  const shown = c.skills.slice(0, 4);
  const extra = Math.max(0, c.skills.length - shown.length);

  return (
    <button
      onClick={() => onOpen(c.id)}
      className={`group text-left rounded-xl border bg-card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-12px_hsl(var(--foreground)/0.15)] hover:border-foreground/20 ${
        active ? "border-primary ring-2 ring-primary/20" : "border-border"
      }`}
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={c.photo}
          alt={c.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute top-2.5 right-2.5 bg-background/85 backdrop-blur rounded-full p-0.5 border border-border">
          <ScoreRing score={c.aiScore} size={36} />
        </div>
        <div className="absolute bottom-2.5 left-2.5">
          <span className="inline-flex items-center gap-1.5 bg-background/85 backdrop-blur rounded-full pl-2 pr-2.5 py-1 border border-border">
            <AvailabilityDot status={c.availability} />
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-foreground">
              {c.availability?.toLowerCase().includes("open") ? "Open" : c.availability?.toLowerCase().includes("passive") ? "Passive" : "Closed"}
            </span>
          </span>
        </div>
        {onToggleSelect && (
          <div
            data-testid="compare-toggle"
            role="checkbox"
            aria-checked={!!selected}
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); if (!selectDisabled || selected) onToggleSelect(c.id); }}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); e.stopPropagation(); if (!selectDisabled || selected) onToggleSelect(c.id); } }}
            className={`absolute top-2.5 left-2.5 w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
              selected
                ? "bg-primary border-primary text-primary-foreground"
                : `bg-background/85 backdrop-blur border-border ${selectDisabled ? "opacity-40 cursor-not-allowed" : "hover:border-primary"}`
            }`}
          >
            {selected && <Check className="w-3.5 h-3.5" />}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-[15px] leading-tight truncate">{c.name}</h3>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
        </div>
        <div className="text-[13px] text-muted-foreground truncate">{c.title}</div>

        <div className="flex items-center gap-1 mt-2.5 text-[11.5px] text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{c.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {shown.map((s) => (
            <span key={s} className="text-[10.5px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-foreground/80">
              {s}
            </span>
          ))}
          {extra > 0 && (
            <span className="text-[10.5px] font-mono px-1.5 py-0.5 text-muted-foreground">+{extra}</span>
          )}
        </div>
      </div>
    </button>
  );
};
