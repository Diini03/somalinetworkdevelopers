import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Moon, Sun, Command as CommandIcon, GitCompare } from "lucide-react";

interface Props {
  onOpenPalette?: () => void;
  compareCount?: number;
}

export const SiteHeader = ({ onOpenPalette, compareCount = 0 }: Props) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const navItem = ({ isActive }: { isActive: boolean }) =>
    `text-[13px] px-2.5 py-1 rounded-md transition-colors ${
      isActive ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40 h-14 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="h-full px-4 md:px-6 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="w-7 h-7 rounded-md bg-primary/15 text-primary flex items-center justify-center font-mono text-[11px] font-semibold border border-primary/30 group-hover:bg-primary/25 transition-colors">
            S/
          </span>
          <span className="font-mono text-[13px] tracking-tight">
            snd<span className="text-muted-foreground">.dev</span>
          </span>
          <span className="hidden md:inline text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 ml-1">v3.0</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/talent" className={navItem}>Talent</NavLink>
          <NavLink to="/compare" className={navItem}>
            Compare
            {compareCount > 0 && (
              <span className="ml-1.5 text-[10px] font-mono bg-primary text-primary-foreground rounded px-1">{compareCount}</span>
            )}
          </NavLink>
          <a href="#about" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="text-[13px] px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>

        <div className="flex-1" />

        {onOpenPalette && (
          <button
            onClick={onOpenPalette}
            className="hidden sm:inline-flex items-center gap-2 h-8 pl-2.5 pr-1.5 rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors text-xs"
          >
            <CommandIcon className="w-3.5 h-3.5" />
            <span>Search & jump</span>
            <kbd className="kbd">⌘K</kbd>
          </button>
        )}

        <Link
          to="/compare"
          className="md:hidden inline-flex items-center gap-1 h-8 px-2 rounded-md border border-border text-muted-foreground hover:text-foreground"
          aria-label="Compare"
        >
          <GitCompare className="w-4 h-4" />
          {compareCount > 0 && <span className="text-[10px] font-mono">{compareCount}</span>}
        </Link>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-8 h-8 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <Link
          to="/admin/login"
          className="hidden sm:inline-flex h-8 px-3 items-center rounded-md text-xs font-medium text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-colors"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
};
