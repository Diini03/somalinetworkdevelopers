import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterSidebarProps {
  filters: {
    name: string;
    skills: string[];
    qualifications: string[];
    salaryMin: number;
    salaryMax: number;
    location: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  availableSkills: string[];
  availableQualifications: string[];
}

export const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableSkills,
  availableQualifications,
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

  const toggleQualification = (q: string) => {
    const next = filters.qualifications.includes(q)
      ? filters.qualifications.filter((x) => x !== q)
      : [...filters.qualifications, q];
    updateFilter("qualifications", next);
  };

  const hasActiveFilters =
    filters.name ||
    filters.skills.length > 0 ||
    filters.qualifications.length > 0 ||
    filters.location;

  const pillCls = (active: boolean) =>
    `cursor-pointer rounded-full text-[11px] font-medium px-3 py-1 border-0 transition-all ${
      active
        ? "bg-primary text-primary-foreground"
        : "bg-foreground/5 hover:bg-foreground/10 text-foreground"
    }`;

  const FilterContent = () => (
    <div className="space-y-7">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h3 className="font-display text-2xl">Filter</h3>
        </div>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-[11px] uppercase tracking-widest text-muted-foreground">Name</Label>
        <Input
          id="name"
          placeholder="Search…"
          value={filters.name}
          onChange={(e) => updateFilter("name", e.target.value)}
          className="bg-foreground/5 border-0 rounded-full px-4"
        />
      </div>

      <Accordion type="single" collapsible defaultValue="skills" className="w-full">
        <AccordionItem value="skills" className="border-border/60">
          <AccordionTrigger className="text-[11px] uppercase tracking-widest hover:no-underline py-2 text-muted-foreground hover:text-foreground">
            Skills
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {availableSkills.map((skill) => (
                <Badge key={skill} className={pillCls(filters.skills.includes(skill))} onClick={() => toggleSkill(skill)}>
                  {skill}
                  {filters.skills.includes(skill) && <X className="w-3 h-3 ml-1 inline" />}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-[11px] uppercase tracking-widest text-muted-foreground">Location</Label>
        <Input
          id="location"
          placeholder="e.g. London"
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          className="bg-foreground/5 border-0 rounded-full px-4"
        />
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="qualifications" className="border-border/60">
          <AccordionTrigger className="text-[11px] uppercase tracking-widest hover:no-underline py-2 text-muted-foreground hover:text-foreground">
            Qualifications
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {availableQualifications.map((q) => (
                <Badge key={q} className={pillCls(filters.qualifications.includes(q))} onClick={() => toggleQualification(q)}>
                  {q}
                  {filters.qualifications.includes(q) && <X className="w-3 h-3 ml-1 inline" />}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {hasActiveFilters && (
        <div className="pt-4 border-t border-border/60">
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full rounded-full bg-transparent border-border hover:bg-foreground/5"
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Button
        className="lg:hidden fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 p-0 bg-primary text-primary-foreground hover:bg-primary-glow shadow-float"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <SlidersHorizontal className="w-5 h-5" />
      </Button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/70 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed lg:sticky top-24 left-0 h-[calc(100vh-7rem)] w-80 z-40 lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="glass rounded-3xl p-6 h-full overflow-y-auto">
          <button
            className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-foreground/5"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
          <FilterContent />
        </div>
      </aside>
    </>
  );
};
