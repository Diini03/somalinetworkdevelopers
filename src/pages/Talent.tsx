import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CommandPalette } from "@/components/CommandPalette";
import { FilterRail } from "@/components/console/FilterRail";
import { FilterSheet } from "@/components/console/FilterSheet";
import { ResultHeader } from "@/components/console/ResultHeader";
import { CandidateCard } from "@/components/console/CandidateCard";
import { CandidateRow } from "@/components/console/CandidateRow";
import { CompareBar } from "@/components/console/CompareBar";
import { SearchX, Search } from "lucide-react";
import { exportCandidatesCSV, exportCandidatesPDF } from "@/lib/export";

const MAX_COMPARE = 3;
const norm = (s?: string) => (s || "").toLowerCase();

const Talent = () => {
  const navigate = useNavigate();
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
  const [tab, setTab] = useState<"all" | "open" | "top" | "new">("all");

  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("snd:compareIds");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string").slice(0, MAX_COMPARE) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("snd:compareIds", JSON.stringify(compareIds)); } catch {}
  }, [compareIds]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= MAX_COMPARE ? prev : [...prev, id]
    );
  };
  const selectedCandidates = candidates.filter((c) => compareIds.includes(c.id));

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

  const skills = useMemo(() => Array.from(new Set(candidates.flatMap((c) => c.skills))).sort(), [candidates]);
  const locations = useMemo(() => Array.from(new Set(candidates.map((c) => c.location).filter(Boolean))).sort(), [candidates]);
  const quals = useMemo(() => Array.from(new Set(candidates.map((c) => c.qualification).filter(Boolean))).sort(), [candidates]);

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

      // Tabs
      if (tab === "open") {
        const a = norm(c.availability);
        if (!(a.includes("open") || a.includes("available") || a.includes("immediate"))) return false;
      }
      if (tab === "top" && (c.aiScore ?? 0) < 80) return false;
      return true;
    });

    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "rank" || tab === "top") list = [...list].sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));
    if (tab === "new") list = [...list]; // RPC already newest-ish
    return list;
  }, [candidates, query, activeSkills, activeLocations, activeQuals, availability, minScore, sort, tab]);

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

  const openCandidate = (id: string) => navigate(`/talent/${id}`);
  const openPalette = () => (window as any).__sndOpenPalette?.();

  const railProps = {
    skills, activeSkills, onToggleSkill: toggle(setActiveSkills),
    locations, activeLocations, onToggleLocation: toggle(setActiveLocations),
    quals, activeQuals, onToggleQual: toggle(setActiveQuals),
    availability, onAvailability: setAvailability,
    minScore, onMinScore: setMinScore,
    onClear: clearAll, hasFilters,
  };

  const tabs: { id: typeof tab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: candidates.length },
    { id: "open", label: "Open now" },
    { id: "top", label: "Top ranked" },
    { id: "new", label: "Recently added" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <CommandPalette />
      <SiteHeader onOpenPalette={openPalette} compareCount={compareIds.length} />

      {/* Sub-header: search + tabs */}
      <div className="sticky top-14 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="px-4 md:px-8 py-3 flex items-center gap-3">
          <div className="flex-1 max-w-xl relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, skill, role, city…"
              className="w-full h-9 pl-9 pr-14 rounded-lg bg-surface border border-border focus:border-primary focus:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-muted-foreground/70"
            />
            <kbd className="kbd absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex">/</kbd>
          </div>
          <div className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-thin">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`h-8 px-3 rounded-md text-[13px] whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "bg-surface-elevated text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {typeof t.count === "number" && tab === t.id && (
                  <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">{t.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

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

          <div className="px-4 md:px-8 py-6 pb-32">
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
                {filtered.map((c) => {
                  const isSel = compareIds.includes(c.id);
                  return (
                    <CandidateCard
                      key={c.id}
                      candidate={c}
                      onOpen={openCandidate}
                      selected={isSel}
                      onToggleSelect={toggleCompare}
                      selectDisabled={!isSel && compareIds.length >= MAX_COMPARE}
                    />
                  );
                })}
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
                {filtered.map((c) => {
                  const isSel = compareIds.includes(c.id);
                  return (
                    <CandidateRow
                      key={c.id}
                      candidate={c}
                      onOpen={openCandidate}
                      selected={isSel}
                      onToggleSelect={toggleCompare}
                      selectDisabled={!isSel && compareIds.length >= MAX_COMPARE}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <CompareBar
        selected={selectedCandidates}
        max={MAX_COMPARE}
        onOpen={() => navigate("/compare")}
        onRemove={(id) => setCompareIds((p) => p.filter((x) => x !== id))}
        onClear={() => setCompareIds([])}
      />
    </div>
  );
};

export default Talent;
