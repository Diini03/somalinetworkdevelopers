import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { Masthead } from "@/components/editorial/Masthead";
import { Footer } from "@/components/editorial/Footer";
import { IndexRow } from "@/components/editorial/IndexRow";
import { DevTile } from "@/components/editorial/DevTile";
import { DirectoryFilters } from "@/components/editorial/DirectoryFilters";

const Directory = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeQuals, setActiveQuals] = useState<string[]>([]);
  const [sort, setSort] = useState<"rank" | "newest" | "az">("rank");
  const [view, setView] = useState<"table" | "grid">("table");

  useEffect(() => {
    supabase.rpc("get_public_candidates").then(({ data }) => {
      if (data) {
        setCandidates(
          data.map((c: any) => ({
            id: c.id, name: c.name, title: c.title, photo: c.photo,
            skills: c.skills || [], location: c.location, qualification: c.qualification,
            bio: c.bio, linkedin: c.linkedin, github: c.github, portfolio: c.portfolio,
            experience: Array.isArray(c.experience) ? (c.experience as unknown as ExperienceEntry[]) : [],
            availability: c.availability, certifications: c.certifications || [],
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  const skills = useMemo(() => Array.from(new Set(candidates.flatMap((c) => c.skills))).sort(), [candidates]);
  const quals = useMemo(() => Array.from(new Set(candidates.map((c) => c.qualification).filter(Boolean))).sort(), [candidates]);

  const filtered = useMemo(() => {
    let list = candidates.filter((c) => {
      if (query) {
        const q = query.toLowerCase();
        const hit = c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (activeSkills.length && !activeSkills.every((s) => c.skills.includes(s))) return false;
      if (activeQuals.length && !activeQuals.includes(c.qualification)) return false;
      return true;
    });
    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "newest") list = list; // RPC already returns newest fallback; rank order is default
    return list;
  }, [candidates, query, activeSkills, activeQuals, sort]);

  const toggleSkill = (s: string) =>
    setActiveSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const toggleQual = (q: string) =>
    setActiveQuals((p) => (p.includes(q) ? p.filter((x) => x !== q) : [...p, q]));
  const clearAll = () => { setQuery(""); setActiveSkills([]); setActiveQuals([]); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Masthead />

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="caption mb-6">§ The Directory</div>
        <h1 className="font-display text-[clamp(3rem,9vw,7rem)] leading-[0.92]">
          Every developer,
          <br /><em className="text-primary not-italic">indexed.</em>
        </h1>
      </section>

      <DirectoryFilters
        query={query} onQuery={setQuery}
        skills={skills} activeSkills={activeSkills} onToggleSkill={toggleSkill}
        quals={quals} activeQuals={activeQuals} onToggleQual={toggleQual}
        sort={sort} onSort={setSort}
        view={view} onView={setView}
        count={filtered.length}
        onClear={clearAll}
      />

      <section className="max-w-7xl mx-auto px-6 py-12 min-h-[40vh]">
        {loading ? (
          <div className="caption py-24 text-center">Loading directory…</div>
        ) : filtered.length === 0 ? (
          <div className="caption py-24 text-center">No entries match.</div>
        ) : view === "table" ? (
          <div className="border-t border-border">
            {filtered.map((c, i) => <IndexRow key={c.id} candidate={c} index={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filtered.map((c) => <DevTile key={c.id} candidate={c} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Directory;
