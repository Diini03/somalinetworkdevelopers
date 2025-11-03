import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Users, Zap, Award, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [skillsCount, setSkillsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("skills");

      if (!error && data) {
        setCandidatesCount(data.length);
        
        // Count unique skills
        const allSkills = new Set<string>();
        data.forEach((candidate) => {
          if (Array.isArray(candidate.skills)) {
            candidate.skills.forEach((skill: string) => allSkills.add(skill));
          }
        });
        setSkillsCount(allSkills.size);
      }
    };

    fetchStats();
  }, []);
  const features = [
    {
      icon: Users,
      title: "Connect Globally",
      description:
        "Unite Somali developers across borders — from Mogadishu to Toronto, from Hargeisa to Nairobi.",
    },
    {
      icon: Zap,
      title: "Learn & Grow",
      description:
        "Knowledge sharing and skill development opportunities to accelerate your tech journey.",
    },
    {
      icon: Target,
      title: "Collaborate",
      description:
        "Find partners for projects, share ideas, and build impactful solutions together.",
    },
    {
      icon: Award,
      title: "Showcase Skills",
      description:
        "Display your projects, skills, and experience to connect with opportunities worldwide.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6 animate-fade-in-up">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium text-sm mb-4">
            About SND
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              About
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Somali Network Developers
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A platform built to connect, support, and inspire developers and tech 
            professionals from Somalia and around the world.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass rounded-2xl p-8 sm:p-12 border border-border/50 shadow-card space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Somali Network Developers (SND) is a platform built to connect, support, and inspire 
                developers and tech professionals from Somalia and around the world. Our mission is to 
                create a space where Somali developers can showcase their skills, find collaboration 
                opportunities, and build impactful projects together.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Whether you're a front-end developer, data analyst, UI/UX designer, or software engineer — 
                SND helps you connect, learn, and grow.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To make Somalia one of Africa's rising tech hubs by empowering the next generation of 
                digital innovators.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Goals</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">•</span>
                  <span>Connect Somali tech talent globally</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">•</span>
                  <span>Promote open-source and collaboration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">•</span>
                  <span>Inspire youth to learn coding and technology</span>
                </li>
              </ul>
            </div>

            <p className="text-muted-foreground font-medium text-lg pt-4">
              Join us — let's shape the digital future of Somalia together. 🇸🇴
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass rounded-2xl p-8 border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass rounded-2xl p-12 border border-border/50 shadow-card">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  {candidatesCount}+
                </div>
                <div className="text-muted-foreground">Network Members</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  {skillsCount}+
                </div>
                <div className="text-muted-foreground">Skills Covered</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-muted-foreground">Community Driven</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass rounded-2xl p-12 border border-border/50 shadow-card text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Join the Network?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Become part of the Somali Network Developers community. Connect with fellow developers,
              showcase your skills, and collaborate on exciting projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/candidates">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 font-semibold px-8 glow-accent-sm transition-all duration-300 hover:scale-105 group"
                >
                  Explore Developers
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/50 hover:bg-secondary/50"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
