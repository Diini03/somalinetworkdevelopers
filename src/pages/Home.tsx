import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { Masthead } from "@/components/editorial/Masthead";
import { Footer } from "@/components/editorial/Footer";
import { AZIndex } from "@/components/editorial/AZIndex";

const Home = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    supabase.rpc("get_public_candidates").then(({ data }) => {
      if (!data) return;
      setCandidates(
        data.map((c: any) => ({
          id: c.id,
          name: c.name,
          title: c.title,
          photo: c.photo,
          skills: c.skills || [],
          location: c.location,
          qualification: c.qualification,
          bio: c.bio,
          linkedin: c.linkedin,
          github: c.github,
          portfolio: c.portfolio,
          experience: Array.isArray(c.experience) ? (c.experience as unknown as ExperienceEntry[]) : [],
          availability: c.availability,
          certifications: c.certifications || [],
        }))
      );
    });
  }, []);

  const featured = candidates.slice(0, 3);
  const disciplineCount = new Set(candidates.flatMap((c) => c.skills)).size;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Masthead />

      {/* COVER */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        <div className="caption mb-8">Volume I · Edition 02</div>
        <h1 className="font-display text-[clamp(3rem,11vw,9rem)] leading-[0.92] tracking-tight">
          A working <em className="text-primary not-italic">index</em>
          <br />
          of Somali developers,
          <br />
          <span className="italic">in practice.</span>
        </h1>

        <div className="mt-12 grid md:grid-cols-3 gap-8 items-end">
          <p className="md:col-span-2 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            SND is an editorial directory of engineers, designers and builders across the Somali diaspora. Browse, read, reach out — no accounts, no algorithms.
          </p>
          <Link
            to="/directory"
            className="caption story-link justify-self-end self-end text-base"
          >
            Open the directory →
          </Link>
        </div>
      </section>

      <div className="rule-gold" />

      {/* STAT RIBBON */}
      <section className="max-w-7xl mx-auto px-6 py-6 caption flex flex-wrap gap-x-8 gap-y-2 justify-between">
        <span>{String(candidates.length).padStart(2, "0")} Developers</span>
        <span>{String(disciplineCount).padStart(2, "0")} Disciplines</span>
        <span>Est. 2024</span>
        <span>Mogadishu · Nairobi · Diaspora</span>
      </section>

      <div className="rule" />

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <div className="caption mb-2">§ 01 — Featured</div>
            <h2 className="font-display text-5xl md:text-6xl">In this issue.</h2>
          </div>
          <Link to="/directory" className="caption story-link hidden md:inline">See all →</Link>
        </div>

        <div className="space-y-0">
          {featured.length === 0 && (
            <div className="caption py-12 text-center text-muted-foreground">
              The directory is being prepared.
            </div>
          )}
          {featured.map((c, i) => (
            <Link
              key={c.id}
              to={`/dev/${c.id}`}
              className="group grid grid-cols-12 gap-6 py-10 border-b border-border items-center"
            >
              <div className="col-span-1 caption">№ 0{i + 1}</div>
              <div className="col-span-3">
                <img
                  src={c.photo}
                  alt={c.name}
                  className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="col-span-6">
                <div className="caption mb-3">{c.title}</div>
                <h3 className="font-display text-5xl md:text-6xl mb-4 group-hover:text-primary transition-colors">
                  {c.name}
                </h3>
                <p className="text-muted-foreground max-w-xl line-clamp-2">{c.bio}</p>
              </div>
              <div className="col-span-2 text-right caption">
                {c.location}
                <div className="mt-2 text-primary">Read →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3 caption">§ 02 — Colophon</div>
          <div className="md:col-span-9 space-y-8">
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95]">
              We're cataloguing the people building the future of Somali tech — without the noise of yet another platform.
            </h2>
            <div className="grid md:grid-cols-2 gap-12 text-base md:text-lg leading-relaxed">
              <p className="dropcap text-muted-foreground">
                Somali Network Developers is a quiet, curated index. Every entry is hand-reviewed. There are no accounts to make, no feeds to scroll, no ads. Just an honest record of practitioners — what they make, where they're based, how to reach them.
              </p>
              <p className="text-muted-foreground">
                If you're hiring, collaborating or simply curious, the directory is the entire product. Profiles are written like editorial entries, not LinkedIn pages. Contact happens by email, directly, with no middle layer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A–Z */}
      {candidates.length > 0 && <AZIndex candidates={candidates} />}

      <Footer />
    </div>
  );
};

export default Home;
