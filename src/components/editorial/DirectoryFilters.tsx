import { Search, X } from "lucide-react";

interface Props {
  query: string;
  onQuery: (v: string) => void;
  skills: string[];
  activeSkills: string[];
  onToggleSkill: (s: string) => void;
  quals: string[];
  activeQuals: string[];
  onToggleQual: (q: string) => void;
  sort: "rank" | "newest" | "az";
  onSort: (s: "rank" | "newest" | "az") => void;
  view: "table" | "grid";
  onView: (v: "table" | "grid") => void;
  count: number;
  onClear: () => void;
}

export const DirectoryFilters = ({
  query, onQuery, skills, activeSkills, onToggleSkill,
  quals, activeQuals, onToggleQual, sort, onSort, view, onView, count, onClear,
}: Props) => {
  const hasFilters = query || activeSkills.length || activeQuals.length;

  return (
    <div className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search name, skill, location…"
              className="w-full bg-transparent border-0 border-b border-border focus:border-primary focus:outline-none pl-6 py-2 font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-1 caption">
            <span className="mr-2">Sort</span>
            {(["rank", "newest", "az"] as const).map((s) => (
              <button
                key={s}
                onClick={() => onSort(s)}
                className={`px-2 py-1 transition-colors ${sort === s ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {s === "rank" ? "Featured" : s === "newest" ? "Newest" : "A–Z"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 caption">
            <span className="mr-2">View</span>
            <button onClick={() => onView("table")} className={`px-2 py-1 ${view === "table" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Index</button>
            <button onClick={() => onView("grid")} className={`px-2 py-1 ${view === "grid" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Grid</button>
          </div>
        </div>

        {(skills.length > 0 || quals.length > 0) && (
          <div className="flex flex-wrap gap-x-3 gap-y-2 caption">
            {skills.map((s) => (
              <button
                key={s}
                onClick={() => onToggleSkill(s)}
                className={`hover:text-foreground transition-colors ${activeSkills.includes(s) ? "text-primary" : "text-muted-foreground"}`}
              >
                {activeSkills.includes(s) ? "● " : "○ "}{s}
              </button>
            ))}
            {quals.length > 0 && <span className="text-muted-foreground/40">|</span>}
            {quals.map((q) => (
              <button
                key={q}
                onClick={() => onToggleQual(q)}
                className={`hover:text-foreground transition-colors ${activeQuals.includes(q) ? "text-primary" : "text-muted-foreground"}`}
              >
                {activeQuals.includes(q) ? "● " : "○ "}{q}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between caption">
          <div>{count} {count === 1 ? "developer" : "developers"}</div>
          {hasFilters && (
            <button onClick={onClear} className="flex items-center gap-1 hover:text-foreground">
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
