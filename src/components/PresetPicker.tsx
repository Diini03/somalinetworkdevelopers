import { useMemo } from "react";
import {
  Code2, Database, Cloud, Palette, Smartphone, Braces, Terminal,
  Boxes, Cpu, Shield, LineChart, Wrench, GraduationCap, BookOpen,
  Rocket, Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Preset = { label: string; Icon: React.ComponentType<{ className?: string }> };

export const SKILL_PRESETS: Preset[] = [
  { label: "React", Icon: Code2 },
  { label: "TypeScript", Icon: Braces },
  { label: "Next.js", Icon: Code2 },
  { label: "Vue", Icon: Code2 },
  { label: "Node.js", Icon: Terminal },
  { label: "Python", Icon: Terminal },
  { label: "Go", Icon: Terminal },
  { label: "Rust", Icon: Cpu },
  { label: "PostgreSQL", Icon: Database },
  { label: "MongoDB", Icon: Database },
  { label: "Redis", Icon: Database },
  { label: "GraphQL", Icon: Boxes },
  { label: "Docker", Icon: Boxes },
  { label: "Kubernetes", Icon: Cloud },
  { label: "AWS", Icon: Cloud },
  { label: "GCP", Icon: Cloud },
  { label: "Tailwind", Icon: Palette },
  { label: "Figma", Icon: Palette },
  { label: "React Native", Icon: Smartphone },
  { label: "Swift", Icon: Smartphone },
  { label: "Kotlin", Icon: Smartphone },
  { label: "Django", Icon: Terminal },
  { label: "Security", Icon: Shield },
  { label: "Data Analysis", Icon: LineChart },
  { label: "DevOps", Icon: Wrench },
];

export const QUALIFICATION_PRESETS: Preset[] = [
  { label: "BSc Computer Science", Icon: GraduationCap },
  { label: "BSc Software Engineering", Icon: GraduationCap },
  { label: "BSc Information Technology", Icon: GraduationCap },
  { label: "MSc Computer Science", Icon: Award },
  { label: "PhD Computer Science", Icon: Award },
  { label: "Bootcamp Graduate", Icon: Rocket },
  { label: "Self-taught", Icon: BookOpen },
];

interface PresetPickerProps {
  presets: Preset[];
  selected: string[];
  onToggle: (label: string) => void;
  mode?: "multi" | "single";
}

export const PresetPicker = ({ presets, selected, onToggle, mode = "multi" }: PresetPickerProps) => {
  const set = useMemo(() => new Set(selected.map((s) => s.toLowerCase().trim())), [selected]);
  return (
    <div className="flex flex-wrap gap-1.5 rounded-md border border-border/60 bg-muted/30 p-2">
      {presets.map(({ label, Icon }) => {
        const active = set.has(label.toLowerCase());
        return (
          <button
            key={label}
            type="button"
            onClick={() => onToggle(label)}
            className="focus:outline-none focus:ring-2 focus:ring-ring rounded-full"
          >
            <Badge
              variant={active ? "default" : "outline"}
              className={cn(
                "cursor-pointer gap-1 py-1 px-2.5 text-xs font-normal transition-colors",
                active ? "" : "hover:bg-accent"
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
            </Badge>
          </button>
        );
      })}
    </div>
  );
};
