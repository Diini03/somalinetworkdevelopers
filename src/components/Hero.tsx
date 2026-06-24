import { Search, ArrowUpRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroProps {
  onSearch?: (query: string) => void;
  candidatesCount?: number;
  skillsCount?: number;
}

export const Hero = ({ onSearch, candidatesCount = 0, skillsCount = 0 }: HeroProps) => {
  return (
    <section className="relative pt-36 pb-24 px-4 overflow-hidden noise">
      {/* Blur orbs */}
      <div className="orb animate-float-slow bg-primary/40 w-[420px] h-[420px] -top-32 -left-32" />
      <div className="orb animate-float-slower bg-foreground/10 w-[520px] h-[520px] top-20 -right-40" />
      <div className="orb animate-float-slow bg-primary/20 w-[300px] h-[300px] bottom-0 left-1/3" style={{ animationDelay: '-6s' }} />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />

      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Eyebrow */}
        <div className="flex justify-center mb-10 animate-fade-in">
          <div className="glass-pill px-4 py-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Somali Network Developers — 2026</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center font-display text-[clamp(3rem,9vw,8rem)] leading-[0.95] tracking-tight animate-fade-in-up">
          <span className="text-display">The network for</span>
          <br />
          <span className="italic text-foreground">Somali </span>
          <span className="relative inline-block">
            <span className="text-foreground">builders</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/60 -z-10 -skew-y-1" />
          </span>
        </h1>

        <p className="mt-8 text-center text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          Discover the developers, designers, and engineers shaping the next
          generation of tech — from Mogadishu to Minneapolis.
        </p>

        {/* Search */}
        <div className="mt-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '240ms' }}>
          <div className="glass-strong rounded-full p-2 pl-6 flex items-center gap-3 shadow-float">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Search by name, skill, or city…"
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/70 px-0"
              onChange={(e) => onSearch?.(e.target.value)}
            />
            <button className="group shrink-0 flex items-center gap-1 pl-5 pr-4 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Explore
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-3 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '360ms' }}>
          {[
            { value: `${candidatesCount}+`, label: "Developers" },
            { value: `${skillsCount}+`, label: "Skills covered" },
            { value: "100%", label: "Community-driven" },
          ].map((s, i) => (
            <div key={s.label} className={`text-center py-4 ${i < 2 ? 'border-r border-border/60' : ''}`}>
              <div className="font-display text-4xl sm:text-5xl text-foreground">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
