import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { Masthead } from "@/components/editorial/Masthead";
import { Footer } from "@/components/editorial/Footer";
import { InlineContactForm } from "@/components/InlineContactForm";
import { useToast } from "@/hooks/use-toast";

const DevProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [c, setC] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [cvLoading, setCvLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.rpc("get_public_candidate", { _id: id }).then(({ data }) => {
      const row = Array.isArray(data) ? data[0] : data;
      if (row) {
        setC({
          id: row.id, name: row.name, title: row.title, photo: row.photo,
          skills: row.skills || [], location: row.location, qualification: row.qualification,
          bio: row.bio, linkedin: row.linkedin, github: row.github, portfolio: row.portfolio,
          experience: Array.isArray(row.experience) ? (row.experience as unknown as ExperienceEntry[]) : [],
          availability: row.availability, certifications: row.certifications || [],
        });
      }
      setLoading(false);
    });
  }, [id]);

  const openCv = async () => {
    if (!c) return;
    setCvLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-cv-signed-url", { body: { candidateId: c.id } });
      if (error || !data?.url) {
        toast({ title: "Resume unavailable", description: "No resume on file or sign-in required.", variant: "destructive" });
        return;
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } finally { setCvLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Masthead />
        <div className="caption text-center py-32">Loading entry…</div>
      </div>
    );
  }
  if (!c) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Masthead />
        <div className="caption text-center py-32">Entry not found. <Link to="/directory" className="story-link">Back to directory →</Link></div>
      </div>
    );
  }

  const socials = [
    c.linkedin && { label: "LinkedIn", href: c.linkedin },
    c.github && { label: "GitHub", href: c.github },
    c.portfolio && { label: "Portfolio", href: c.portfolio },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Masthead />

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <Link to="/directory" className="caption story-link">← Back to directory</Link>

        {/* Cover */}
        <div className="mt-10 aspect-[4/3] overflow-hidden bg-muted">
          <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
        </div>

        <header className="mt-10">
          <div className="caption mb-4">{c.title}</div>
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.92]">
            {c.name}<span className="text-primary">.</span>
          </h1>
        </header>

        <div className="rule-gold my-10" />

        {/* Meta strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 caption">
          <div>
            <div className="text-muted-foreground/70 mb-1">Based in</div>
            <div className="text-foreground normal-case tracking-normal">{c.location}</div>
          </div>
          <div>
            <div className="text-muted-foreground/70 mb-1">Available</div>
            <div className="text-foreground normal-case tracking-normal">{c.availability}</div>
          </div>
          <div>
            <div className="text-muted-foreground/70 mb-1">Education</div>
            <div className="text-foreground normal-case tracking-normal">{c.qualification}</div>
          </div>
          <div>
            <div className="text-muted-foreground/70 mb-1">Reach</div>
            <div className="flex gap-3 flex-wrap normal-case tracking-normal text-foreground">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="story-link">{s.label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <section className="mt-16">
          <div className="caption mb-6">§ Biography</div>
          <p className="dropcap text-lg md:text-xl leading-relaxed">{c.bio}</p>
        </section>

        {/* Skills */}
        <section className="mt-16">
          <div className="caption mb-6">§ Practice</div>
          <p className="font-mono text-sm leading-loose">
            {c.skills.map((s, i) => (
              <span key={s}>
                <span>{s}</span>
                {i < c.skills.length - 1 && <span className="text-primary mx-2">·</span>}
              </span>
            ))}
          </p>
        </section>

        {/* Experience */}
        {c.experience.length > 0 && (
          <section className="mt-16">
            <div className="caption mb-6">§ Selected work</div>
            <ol className="space-y-8">
              {c.experience.map((e, i) => (
                <li key={i} className="grid grid-cols-12 gap-4 border-t border-border pt-6">
                  <div className="col-span-3 caption">
                    {e.startYear ?? "—"} <span className="text-primary">—</span> {e.endYear ?? "Present"}
                  </div>
                  <div className="col-span-9">
                    <div className="font-display text-2xl mb-2">{e.company}</div>
                    <p className="text-muted-foreground leading-relaxed">{e.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Certifications */}
        {c.certifications && c.certifications.length > 0 && (
          <section className="mt-16">
            <div className="caption mb-6">§ Certifications</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {c.certifications.map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block border border-border hover:border-primary transition-colors">
                  <img src={src} alt={`Certification ${i + 1}`} className="w-full aspect-[4/3] object-cover" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Resume */}
        <section className="mt-16 border-t border-border pt-8">
          <div className="caption mb-3">§ Resume</div>
          <button onClick={openCv} disabled={cvLoading} className="font-display text-3xl story-link text-left disabled:opacity-50">
            {cvLoading ? "Opening…" : "→ View resume"}
          </button>
        </section>

        {/* Contact */}
        <section className="mt-20 border-t border-border pt-12" id="contact-form">
          <div className="caption mb-6">§ Get in touch</div>
          <h2 className="font-display text-5xl mb-8">
            Write to <em className="text-primary not-italic">{c.name.split(" ")[0]}</em>.
          </h2>
          <InlineContactForm candidateId={c.id} candidateName={c.name} />
        </section>

        <div className="mt-16 text-center">
          <Link to="/directory" className="caption story-link">← Back to directory</Link>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default DevProfile;
