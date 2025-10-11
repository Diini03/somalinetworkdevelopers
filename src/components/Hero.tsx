import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onSearch?: (query: string) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Animated 3D Background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: 'hsl(var(--primary-glow))', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          <g className="animate-[spin_20s_linear_infinite] origin-center" style={{ transformOrigin: '50% 50%' }}>
            <circle cx="20%" cy="30%" r="100" fill="url(#grad1)" opacity="0.3" />
            <circle cx="80%" cy="70%" r="150" fill="url(#grad1)" opacity="0.2" />
          </g>
          <g className="animate-[spin_15s_linear_infinite_reverse] origin-center" style={{ transformOrigin: '50% 50%' }}>
            <polygon points="50,10 90,90 10,90" fill="url(#grad1)" opacity="0.15" transform="translate(200, 100)" />
            <polygon points="50,10 90,90 10,90" fill="url(#grad1)" opacity="0.15" transform="translate(600, 400) scale(1.5)" />
          </g>
        </svg>
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-primary-glow/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-3xl animate-pulse delay-500" />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-4xl text-center space-y-8 animate-fade-in-up">
        <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium text-sm mb-4 glow-accent-sm">
          🚀 Discover Top Developer Talent
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Find & Hire
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            Elite Developers
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Connect with talented junior and mid-level developers ready to bring
          your ideas to life. Filter by skills, location, and experience.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="glass rounded-2xl p-2 border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, skill, or location..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                  onChange={(e) => onSearch?.(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 font-semibold px-8 glow-accent-sm transition-all duration-300 hover:scale-105"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-primary">12+</div>
            <div className="text-sm text-muted-foreground">Developers</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-primary">8+</div>
            <div className="text-sm text-muted-foreground">Tech Stacks</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Quality</div>
          </div>
        </div>
      </div>
    </section>
  );
};
