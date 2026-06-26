import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="font-display text-4xl mb-4">SND<span className="text-primary">.</span></div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A working index of Somali developers, designers and engineers — in practice.
            </p>
          </div>

          <div>
            <div className="caption mb-4">Index</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="story-link">Cover</Link></li>
              <li><Link to="/directory" className="story-link">Directory</Link></li>
            </ul>
          </div>

          <div>
            <div className="caption mb-4">Get in touch</div>
            <a href="mailto:hello@snd.so" className="text-sm story-link block mb-2">hello@snd.so</a>
            <div className="flex gap-4 mt-3 caption">
              <a href="#" className="story-link">Twitter</a>
              <a href="#" className="story-link">GitHub</a>
              <a href="#" className="story-link">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 caption">
          <div>© {new Date().getFullYear()} Somali Network Developers</div>
          <div>Set in Instrument Serif & Inter Tight · JetBrains Mono</div>
        </div>
      </div>
    </footer>
  );
};
