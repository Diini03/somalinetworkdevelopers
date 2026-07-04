import { Candidate } from "@/types/candidate";
import { ScoreRing } from "./ScoreRing";
import { AvailabilityDot } from "./AvailabilityDot";

interface Props {
  candidate: Candidate;
  onOpen: (id: string) => void;
  active?: boolean;
}

export const CandidateRow = ({ candidate: c, onOpen, active }: Props) => {
  return (
    <button
      onClick={() => onOpen(c.id)}
      className={`w-full text-left grid grid-cols-12 gap-3 items-center px-4 h-14 border-b border-border transition-colors ${
        active ? "bg-primary/5" : "hover:bg-surface"
      }`}
    >
      <div className="col-span-4 flex items-center gap-3 min-w-0">
        <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-md object-cover shrink-0" />
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{c.name}</div>
          <div className="text-xs text-muted-foreground truncate">{c.title}</div>
        </div>
      </div>
      <div className="col-span-3 flex flex-wrap gap-1 overflow-hidden">
        {c.skills.slice(0, 3).map((s) => (
          <span key={s} className="text-[10.5px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-foreground/80">{s}</span>
        ))}
        {c.skills.length > 3 && <span className="text-[10.5px] font-mono text-muted-foreground">+{c.skills.length - 3}</span>}
      </div>
      <div className="col-span-2 text-xs text-muted-foreground truncate">{c.location}</div>
      <div className="col-span-2 flex items-center gap-1.5">
        <AvailabilityDot status={c.availability} />
        <span className="text-xs text-muted-foreground truncate">
          {c.availability?.toLowerCase().includes("open") ? "Open" : c.availability?.toLowerCase().includes("passive") ? "Passive" : "—"}
        </span>
      </div>
      <div className="col-span-1 flex justify-end">
        <ScoreRing score={c.aiScore} size={30} />
      </div>
    </button>
  );
};
