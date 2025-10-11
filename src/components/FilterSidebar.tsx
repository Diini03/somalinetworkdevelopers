import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  filters: {
    name: string;
    skills: string[];
    qualification: string;
    salaryMin: number;
    salaryMax: number;
    location: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  availableSkills: string[];
}

export const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableSkills,
}: FilterSidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    updateFilter("skills", newSkills);
  };

  const hasActiveFilters =
    filters.name ||
    filters.skills.length > 0 ||
    filters.qualification ||
    filters.location ||
    filters.salaryMin > 0 ||
    filters.salaryMax < 200000;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Name Filter */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold">
          Name
        </Label>
        <Input
          id="name"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => updateFilter("name", e.target.value)}
          className="glass border-border/50"
        />
      </div>

      {/* Skills Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Skills</Label>
        <div className="flex flex-wrap gap-2">
          {availableSkills.map((skill) => (
            <Badge
              key={skill}
              variant={filters.skills.includes(skill) ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                filters.skills.includes(skill)
                  ? "bg-primary text-primary-foreground glow-accent-sm hover:opacity-90"
                  : "hover:bg-secondary border-border/50"
              }`}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
              {filters.skills.includes(skill) && (
                <X className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-semibold">
          Location
        </Label>
        <Input
          id="location"
          placeholder="e.g. London"
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          className="glass border-border/50"
        />
      </div>

      {/* Qualification Filter */}
      <div className="space-y-2">
        <Label htmlFor="qualification" className="text-sm font-semibold">
          Qualification
        </Label>
        <Input
          id="qualification"
          placeholder="e.g. BSc, MSc, Bootcamp"
          value={filters.qualification}
          onChange={(e) => updateFilter("qualification", e.target.value)}
          className="glass border-border/50"
        />
      </div>

      {/* Salary Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          Salary Range (£)
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="salaryMin" className="text-xs text-muted-foreground">
              Min
            </Label>
            <Input
              id="salaryMin"
              type="number"
              placeholder="30,000"
              value={filters.salaryMin || ""}
              onChange={(e) =>
                updateFilter("salaryMin", parseInt(e.target.value) || 0)
              }
              className="glass border-border/50"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="salaryMax" className="text-xs text-muted-foreground">
              Max
            </Label>
            <Input
              id="salaryMax"
              type="number"
              placeholder="70,000"
              value={filters.salaryMax === 200000 ? "" : filters.salaryMax}
              onChange={(e) =>
                updateFilter("salaryMax", parseInt(e.target.value) || 200000)
              }
              className="glass border-border/50"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        className="lg:hidden fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 p-0 bg-gradient-to-r from-primary to-primary-glow glow-accent shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <SlidersHorizontal className="w-6 h-6" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] w-80 z-40
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="glass rounded-2xl p-6 h-full overflow-y-auto shadow-card border border-border/50">
          {/* Close button for mobile */}
          <button
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          <FilterContent />
        </div>
      </aside>
    </>
  );
};
