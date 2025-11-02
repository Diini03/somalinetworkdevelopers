import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CandidateGrid } from "@/components/CandidateGrid";
import { supabase } from "@/integrations/supabase/client";
import { Candidate } from "@/types/candidate";

const Home = () => {
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
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const transformedData: Candidate[] = data.map((c) => ({
          id: c.id,
          name: c.name,
          title: c.title,
          photo: c.photo,
          skills: c.skills,
          expectedSalary: {
            min: c.expected_salary_min,
            max: c.expected_salary_max,
          },
          location: c.location,
          qualification: c.qualification,
          bio: c.bio,
          email: c.email,
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

      // Salary filter
      if (
        candidate.expectedSalary.max < filters.salaryMin ||
        candidate.expectedSalary.min > filters.salaryMax
      ) {
        return false;
      }

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
      <Hero 
        onSearch={setSearchQuery} 
        candidatesCount={candidates.length}
        skillsCount={availableSkills.length}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearFilters}
            availableSkills={availableSkills}
            availableQualifications={availableQualifications}
          />

          {/* Main Content */}
          <main className="flex-1 lg:pl-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <CandidateGrid candidates={filteredCandidates} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
