import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CandidateGrid } from "@/components/CandidateGrid";
import { candidates } from "@/data/candidates";

const Home = () => {
  const [filters, setFilters] = useState({
    name: "",
    skills: [] as string[],
    qualification: "",
    salaryMin: 0,
    salaryMax: 200000,
    location: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Get all unique skills
  const availableSkills = useMemo(() => {
    const skillSet = new Set<string>();
    candidates.forEach((candidate) => {
      candidate.skills.forEach((skill) => skillSet.add(skill));
    });
    return Array.from(skillSet).sort();
  }, []);

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

      // Qualification filter
      if (filters.qualification) {
        if (
          !candidate.qualification
            .toLowerCase()
            .includes(filters.qualification.toLowerCase())
        )
          return false;
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
  }, [filters, searchQuery]);

  const clearFilters = () => {
    setFilters({
      name: "",
      skills: [],
      qualification: "",
      salaryMin: 0,
      salaryMax: 200000,
      location: "",
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero onSearch={setSearchQuery} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearFilters}
            availableSkills={availableSkills}
          />

          {/* Main Content */}
          <main className="flex-1 lg:pl-8">
            <CandidateGrid candidates={filteredCandidates} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
