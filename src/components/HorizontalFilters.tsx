import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface HorizontalFiltersProps {
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

export const HorizontalFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableSkills,
}: HorizontalFiltersProps) => {
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

  return (
    <div className="glass rounded-2xl p-6 border border-border/50 shadow-card mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
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

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            placeholder="e.g. BSc, MSc"
            value={filters.qualification}
            onChange={(e) => updateFilter("qualification", e.target.value)}
            className="glass border-border/50"
          />
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Salary Range (£)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.salaryMin || ""}
              onChange={(e) =>
                updateFilter("salaryMin", parseInt(e.target.value) || 0)
              }
              className="glass border-border/50"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.salaryMax === 200000 ? "" : filters.salaryMax}
              onChange={(e) =>
                updateFilter("salaryMax", parseInt(e.target.value) || 200000)
              }
              className="glass border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Skills Filter - Full Width */}
      <Accordion type="single" collapsible className="w-full mt-6">
        <AccordionItem value="skills" className="border-border/50">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">
            Skills
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pt-2">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
