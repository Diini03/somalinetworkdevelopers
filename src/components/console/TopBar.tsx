import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Search, Moon, Sun } from "lucide-react";
import { forwardRef } from "react";

interface Props {
  query: string;
  onQuery: (v: string) => void;
}

export const TopBar = forwardRef<HTMLInputElement, Props>(({ query, onQuery }, ref) => {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 h-14 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="h-full px-4 md:px-6 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-medium tracking-tight shrink-0">
          <span className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-mono text-[10px] font-semibold">SN</span>
          <span className="hidden sm:inline">SND</span>
          <span className="hidden md:inline text-muted-foreground text-xs font-normal">/ Talent</span>
        </Link>

        <div className="flex-1 max-w-2xl mx-auto relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            ref={ref}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search by name, skill, role, location…"
            className="w-full h-9 pl-9 pr-16 rounded-lg bg-surface border border-border focus:border-primary focus:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-muted-foreground/70 transition-colors"
          />
          <kbd className="kbd absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex">/</kbd>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
});
TopBar.displayName = "TopBar";
