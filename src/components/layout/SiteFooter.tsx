import { Link } from "react-router-dom";

export const SiteFooter = () => (
  <footer className="border-t border-border mt-24">
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-md bg-primary/15 text-primary flex items-center justify-center font-mono text-[11px] font-semibold border border-primary/30">S/</span>
          <span className="font-mono text-[13px]">snd<span className="text-muted-foreground">.dev</span></span>
        </div>
        <p className="text-muted-foreground text-[13px] leading-relaxed max-w-sm">
          A working index of Somali engineers, designers and data people — vetted, ranked, and reachable.
        </p>
      </div>

      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Product</div>
        <ul className="space-y-2">
          <li><Link to="/talent" className="hover:text-primary text-muted-foreground">Browse talent</Link></li>
          <li><Link to="/compare" className="hover:text-primary text-muted-foreground">Compare</Link></li>
          <li><Link to="/admin/login" className="hover:text-primary text-muted-foreground">Sign in</Link></li>
        </ul>
      </div>

      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Network</div>
        <ul className="space-y-2 text-muted-foreground">
          <li>Mogadishu · Hargeisa</li>
          <li>Nairobi · Addis Ababa</li>
          <li>Remote worldwide</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span>© {new Date().getFullYear()} Somali Network Developers</span>
        <span>v3.0 · Issue 03</span>
      </div>
    </div>
  </footer>
);
