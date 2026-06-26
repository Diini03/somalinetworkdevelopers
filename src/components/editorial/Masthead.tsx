import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

export const Masthead = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isHome = location.pathname === "/";

  return (
    <header className="w-full border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-2xl leading-none tracking-tight">
          SND<span className="text-primary">.</span>
        </Link>
        <div className="hidden sm:block caption text-center flex-1">
          Issue 02 · {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()}
        </div>
        <nav className="flex items-center gap-6">
          {!isHome && (
            <Link to="/" className="caption story-link">Index</Link>
          )}
          <Link to="/directory" className="caption story-link">
            Directory →
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="caption story-link"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "[ light ]" : "[ dark ]"}
          </button>
        </nav>
      </div>
    </header>
  );
};
