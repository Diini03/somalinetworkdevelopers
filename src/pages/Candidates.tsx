import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HorizontalFilters } from "@/components/HorizontalFilters";
import { CandidateGrid } from "@/components/CandidateGrid";
import { supabase } from "@/integrations/supabase/client";
import { Candidate } from "@/types/candidate";

const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    skills: [] as string[],
    qualifications: [] as string[],
    salaryMin: 0,
    salaryMax: 200000,
    location: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase.rpc("get_public_candidates");

      if (!error && data) {
        const transformedData: Candidate[] = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          title: c.title,
          photo: c.photo,
          skills: c.skills || [],
          location: c.location,
          qualification: c.qualification,
          bio: c.bio,
          linkedin: c.linkedin,
          github: c.github,
          portfolio: c.portfolio,
          experience: Array.isArray(c.experience) ? (c.experience as any[]) : [],
          availability: c.availability,
          certifications: c.certifications || [],
        }));
        setCandidates(transformedData);
      }
      setLoading(false);
    };

    fetchCandidates();
  }, []);

  // Get all unique skills
  const availableSkills = useMemo(() => {
    const skillSet = new Set<string>();
    candidates.forEach((candidate) => {
      candidate.skills.forEach((skill) => skillSet.add(skill));
    });
    return Array.from(skillSet).sort();
  }, [candidates]);

  // Get all unique qualifications
  const availableQualifications = useMemo(() => {
    const qualificationSet = new Set<string>();
    candidates.forEach((candidate) => {
      if (candidate.qualification) {
        qualificationSet.add(candidate.qualification);
      }
    });
    return Array.from(qualificationSet).sort();
  }, [candidates]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      // Combined search (name, skills, location)
      const combinedSearch = searchQuery || filters.name;
      if (combinedSearch) {
        const query = combinedSearch.toLowerCase();
        const matchesName = candidate.name.toLowerCase().includes(query);
        const matchesSkill = candidate.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        );
        const matchesLocation = candidate.location.toLowerCase().includes(query);
        if (!matchesName && !matchesSkill && !matchesLocation) return false;
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const hasAllSkills = filters.skills.every((skill) =>
          candidate.skills.includes(skill)
        );
        if (!hasAllSkills) return false;
      }

      // Qualifications filter
      if (filters.qualifications.length > 0) {
        if (!filters.qualifications.includes(candidate.qualification)) {
          return false;
        }
      }

      // Location filter
      if (filters.location) {
        if (
          !candidate.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())
        )
          return false;
      }

      // Salary filter removed from public view (PII)



      return true;
    });
  }, [candidates, filters, searchQuery]);

  const clearFilters = () => {
    setFilters({
      name: "",
      skills: [],
      qualifications: [],
      salaryMin: 0,
      salaryMax: 200000,
      location: "",
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="relative pt-32 pb-10 px-4 overflow-hidden noise">
        <div className="orb animate-float-slow bg-primary/25 w-[360px] h-[360px] -top-20 -right-20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Directory</div>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight">
            All <span className="italic">candidates.</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-xl">
            Browse our network of Somali developers, designers, and engineers.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <HorizontalFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
          availableSkills={availableSkills}
          availableQualifications={availableQualifications}
        />

        <main className="mt-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <CandidateGrid candidates={filteredCandidates} variant="large" />
          )}
        </main>
      </div>
    </div>
  );
};

export default Candidates;
