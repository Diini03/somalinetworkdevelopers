import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Users, Zap, Target, Award, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [skillsCount, setSkillsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.rpc("get_public_candidates");
      if (!error && data) {
        setCandidatesCount(data.length);
        const allSkills = new Set<string>();
        data.forEach((c) => {
          if (Array.isArray(c.skills)) c.skills.forEach((s: string) => allSkills.add(s));
        });
        setSkillsCount(allSkills.size);
      }
    };
    fetchStats();
  }, []);

  const features = [
    { icon: Users, title: "Connect globally", description: "From Mogadishu to Toronto, from Hargeisa to Nairobi — one network for Somali tech." },
    { icon: Zap, title: "Learn & grow", description: "Knowledge sharing and skill development to accelerate your tech journey." },
    { icon: Target, title: "Collaborate", description: "Find partners, share ideas, ship impactful work together." },
    { icon: Award, title: "Showcase skills", description: "Display your projects and experience to global opportunities." },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 overflow-hidden noise">
        <div className="orb animate-float-slow bg-primary/30 w-[400px] h-[400px] -top-20 -right-20" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-6 animate-fade-in">About</div>
          <h1 className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-tight animate-fade-in-up">
            A network for the next<br />
            <span className="italic">generation</span> of <span className="text-display">Somali tech.</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            SND is a platform built to connect, support, and inspire developers and tech
            professionals from Somalia and around the world.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-widest text-primary">01 — Mission</div>
          </div>
          <div className="md:col-span-8 space-y-6">
            <h2 className="font-display text-4xl sm:text-5xl leading-tight">
              Create the space where Somali developers can showcase, collaborate, and grow.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're a front-end developer, data analyst, UI/UX designer, or software engineer —
              SND helps you connect, learn, and build.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4"><div className="h-px bg-border/60" /></div>

      {/* Vision */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-widest text-primary">02 — Vision</div>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-4xl sm:text-5xl leading-tight">
              Make Somalia <span className="italic">one of Africa's rising tech hubs</span> by empowering the next generation of digital innovators.
            </h2>
          </div>
        </div>
      </section>

      {/* Features bento */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-3xl p-6 hover-lift">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-2xl leading-tight mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="glass rounded-3xl p-10 sm:p-14 grid grid-cols-3 divide-x divide-border/60">
            {[
              { v: `${candidatesCount}+`, l: "Members" },
              { v: `${skillsCount}+`, l: "Skills covered" },
              { v: "100%", l: "Community-driven" },
            ].map((s) => (
              <div key={s.l} className="text-center px-2">
                <div className="font-display text-5xl sm:text-7xl text-foreground">{s.v}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="relative glass-strong rounded-[2.5rem] p-12 sm:p-20 text-center overflow-hidden">
            <div className="orb bg-primary/40 w-[300px] h-[300px] -top-20 left-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="font-display text-5xl sm:text-6xl leading-tight">
                Ready to join <span className="italic">the network?</span>
              </h2>
              <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
                Become part of SND — connect, showcase, collaborate.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/candidates" className="group inline-flex items-center gap-1 pl-6 pr-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition-all">
                  Explore developers
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link to="/contact" className="inline-flex items-center px-6 py-3 rounded-full glass-pill font-medium text-foreground hover:bg-foreground/5 transition-all">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
