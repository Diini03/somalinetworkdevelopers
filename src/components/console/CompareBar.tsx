import { GitCompare, X, Trash2 } from "lucide-react";
import { Candidate } from "@/types/candidate";

interface Props {
  selected: Candidate[];
  max: number;
  onOpen: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const CompareBar = ({ selected, max, onOpen, onRemove, onClear }: Props) => {
  if (selected.length === 0) return null;
  return (
    <div data-testid="compare-bar" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl">
      <div className="rounded-xl border border-border bg-surface-elevated shadow-[0_12px_40px_-12px_hsl(var(--foreground)/0.35)] backdrop-blur px-3 py-2.5 flex items-center gap-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">
          Compare <span className="text-foreground">{selected.length}/{max}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-thin">
          {selected.map((c) => (
            <div
              key={c.id}
              data-testid={`compare-chip-${c.id}`}
              className="shrink-0 inline-flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-full bg-surface border border-border hover:border-foreground/20 transition-colors"
            >
              <img src={c.photo} alt="" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs truncate max-w-[100px]">{c.name}</span>
              <button
                onClick={() => onRemove(c.id)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label={`Remove ${c.name}`}
                title={`Remove ${c.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClear}
          className="h-9 px-2.5 rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-foreground/20 inline-flex items-center gap-1.5 text-xs font-medium shrink-0 transition-colors"
          aria-label="Clear all selected candidates"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
        <button
          onClick={onOpen}
          disabled={selected.length < 2}
          className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <GitCompare className="w-4 h-4" /> Compare
        </button>
      </div>
    </div>
  );
};
