import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator,
} from "@/components/ui/command";
import { User, Users, GitCompare, Sun, Moon, Shield, Home } from "lucide-react";

interface Item { id: string; name: string; title: string; }

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    (window as any).__sndOpenPalette = () => setOpen(true);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open || items.length) return;
    supabase.rpc("get_public_candidates").then(({ data }) => {
      if (data) setItems((data as any[]).slice(0, 40).map((c) => ({ id: c.id, name: c.name, title: c.title })));
    });
  }, [open, items.length]);

  const go = (path: string) => { setOpen(false); navigate(path); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search candidates, jump anywhere…" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/")}><Home className="w-4 h-4 mr-2" />Home</CommandItem>
          <CommandItem onSelect={() => go("/talent")}><Users className="w-4 h-4 mr-2" />Browse talent</CommandItem>
          <CommandItem onSelect={() => go("/compare")}><GitCompare className="w-4 h-4 mr-2" />Compare workspace</CommandItem>
          <CommandItem onSelect={() => go("/admin/login")}><Shield className="w-4 h-4 mr-2" />Admin sign-in</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Preferences">
          <CommandItem onSelect={() => { setTheme(theme === "dark" ? "light" : "dark"); setOpen(false); }}>
            {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            Toggle theme
          </CommandItem>
        </CommandGroup>
        {items.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Candidates">
              {items.map((c) => (
                <CommandItem key={c.id} value={`${c.name} ${c.title}`} onSelect={() => go(`/talent/${c.id}`)}>
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{c.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground truncate">{c.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};
