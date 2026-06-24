import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Moon, Sun, LogOut, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: "Failed to log out", variant: "destructive" });
    } else {
      toast({ title: "Logged out", description: "You've been successfully logged out" });
      navigate("/");
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserName(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserName(session.user.id);
      else setUserName("");
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserName = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('name').eq('id', userId).single();
    if (data) setUserName(data.name);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/candidates", label: "Candidates" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <div className="glass-pill px-3 py-2 shadow-soft flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 pl-3 pr-2 group shrink-0">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <span className="font-display text-base text-primary-foreground leading-none">S</span>
          </div>
          <span className="font-display text-xl tracking-tight text-foreground">
            SND<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all text-sm font-medium">
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{userName || "Profile"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-strong rounded-2xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="group flex items-center gap-1 pl-4 pr-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-glow transition-all"
              >
                Get Started
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-strong rounded-3xl p-4 shadow-float animate-fade-in">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-border/50 space-y-1">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5">
                    <User className="w-4 h-4 inline mr-2" /> {userName || "Profile"}
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-2xl text-sm font-semibold bg-primary text-primary-foreground text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
