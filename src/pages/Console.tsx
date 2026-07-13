import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { TopBar } from "@/components/console/TopBar";
import { FilterRail } from "@/components/console/FilterRail";
import { FilterSheet } from "@/components/console/FilterSheet";
import { ResultHeader } from "@/components/console/ResultHeader";
import { CandidateCard } from "@/components/console/CandidateCard";
import { CandidateRow } from "@/components/console/CandidateRow";
import { CandidateSheet } from "@/components/console/CandidateSheet";
import { CompareBar } from "@/components/console/CompareBar";
import { CompareDialog } from "@/components/console/CompareDialog";
import { SearchX } from "lucide-react";

const MAX_COMPARE = 3;

const norm = (s?: string) => (s || "").toLowerCase();

const Console = () => {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeLocations, setActiveLocations] = useState<string[]>([]);
  const [activeQuals, setActiveQuals] = useState<string[]>([]);
  const [availability, setAvailability] = useState<"all" | "open" | "passive">("all");
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<"rank" | "newest" | "az">("rank");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    supabase.rpc("get_public_candidates").then(({ data }) => {
      if (data) {
        setCandidates(
          (data as any[]).map((c) => ({
            id: c.id, name: c.name, title: c.title, photo: c.photo,
            skills: c.skills || [], location: c.location, qualification: c.qualification,
            bio: c.bio, linkedin: c.linkedin, github: c.github, portfolio: c.portfolio,
            experience: Array.isArray(c.experience) ? (c.experience as unknown as ExperienceEntry[]) : [],
            availability: c.availability, certifications: c.certifications || [],
            aiScore: c.ai_score ?? c.aiScore,
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  // Keyboard: `/` to focus search, Esc closes sheet
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const skills = useMemo(
    () => Array.from(new Set(candidates.flatMap((c) => c.skills))).sort(),
    [candidates]
  );
  const locations = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.location).filter(Boolean))).sort(),
    [candidates]
  );
  const quals = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.qualification).filter(Boolean))).sort(),
    [candidates]
  );

  const filtered = useMemo(() => {
    let list = candidates.filter((c) => {
      if (query) {
        const q = query.toLowerCase();
        const hit =
          norm(c.name).includes(q) ||
          norm(c.title).includes(q) ||
          norm(c.location).includes(q) ||
          norm(c.bio).includes(q) ||
          c.skills.some((s) => norm(s).includes(q));
        if (!hit) return false;
      }
      if (activeSkills.length && !activeSkills.every((s) => c.skills.includes(s))) return false;
      if (activeLocations.length && !activeLocations.includes(c.location)) return false;
      if (activeQuals.length && !activeQuals.includes(c.qualification)) return false;
      if (availability !== "all") {
        const a = norm(c.availability);
        const isOpen = a.includes("open") || a.includes("available") || a.includes("immediate");
        const isPassive = a.includes("passive") || a.includes("month") || a.includes("notice");
        if (availability === "open" && !isOpen) return false;
        if (availability === "passive" && !isPassive) return false;
      }
      if (minScore > 0 && (c.aiScore ?? 0) < minScore) return false;
      return true;
    });

    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "rank") list = [...list].sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));
    // newest = RPC default order
    return list;
  }, [candidates, query, activeSkills, activeLocations, activeQuals, availability, minScore, sort]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    setter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const clearAll = () => {
    setQuery(""); setActiveSkills([]); setActiveLocations([]); setActiveQuals([]);
    setAvailability("all"); setMinScore(0);
  };

  const hasFilters =
    !!query || activeSkills.length > 0 || activeLocations.length > 0 || activeQuals.length > 0 ||
    availability !== "all" || minScore > 0;
  const activeFilterCount =
    activeSkills.length + activeLocations.length + activeQuals.length +
    (availability !== "all" ? 1 : 0) + (minScore > 0 ? 1 : 0);

  const openCandidate = (id: string) => navigate(`/dev/${id}`);
  const closeCandidate = () => navigate("/");

  const railProps = {
    skills, activeSkills, onToggleSkill: toggle(setActiveSkills),
    locations, activeLocations, onToggleLocation: toggle(setActiveLocations),
    quals, activeQuals, onToggleQual: toggle(setActiveQuals),
    availability, onAvailability: setAvailability,
    minScore, onMinScore: setMinScore,
    onClear: clearAll, hasFilters,
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar query={query} onQuery={setQuery} ref={searchRef} />

      <div className="flex flex-1 min-h-0">
        <FilterRail {...railProps} />
        <FilterSheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen} {...railProps} />

        <main className="flex-1 min-w-0">
          <ResultHeader
            count={filtered.length}
            total={candidates.length}
            sort={sort} onSort={setSort}
            view={view} onView={setView}
            onOpenFilters={() => setMobileFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          <div className="px-4 md:px-8 py-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground mb-3">
                  <SearchX className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium">No candidates match your filters</div>
                <div className="text-xs text-muted-foreground mt-1">Try broadening the search or removing filters.</div>
                {hasFilters && (
                  <button onClick={clearAll} className="mt-4 text-xs h-8 px-3 rounded-md border border-border bg-surface hover:bg-accent">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 animate-fade-in">
                {filtered.map((c) => (
                  <CandidateCard key={c.id} candidate={c} onOpen={openCandidate} active={routeId === c.id} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden bg-card animate-fade-in">
                <div className="grid grid-cols-12 gap-3 items-center px-4 h-9 border-b border-border bg-surface text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <div className="col-span-4">Candidate</div>
                  <div className="col-span-3">Skills</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Availability</div>
                  <div className="col-span-1 text-right">Match</div>
                </div>
                {filtered.map((c) => (
                  <CandidateRow key={c.id} candidate={c} onOpen={openCandidate} active={routeId === c.id} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <CandidateSheet candidateId={routeId || null} onClose={closeCandidate} />
    </div>
  );
};

export default Console;
