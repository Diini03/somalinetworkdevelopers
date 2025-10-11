import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Users, Zap, Award, ArrowRight } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "Connecting talented developers with companies that value their skills and potential.",
    },
    {
      icon: Users,
      title: "Quality First",
      description:
        "Every developer profile is carefully vetted to ensure high-quality matches.",
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description:
        "Advanced filtering and search capabilities to find the perfect candidate quickly.",
    },
    {
      icon: Award,
      title: "Trusted Platform",
      description:
        "Built by developers, for developers. We understand what makes great talent.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6 animate-fade-in-up">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium text-sm mb-4">
            About DevDirectory
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Building Bridges Between
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Talent & Opportunity
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make hiring developers simple, transparent, and
            effective. Our platform showcases talented developers ready to make an
            impact.
          </p>
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
                  12+
                </div>
                <div className="text-muted-foreground">Active Developers</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-muted-foreground">Skills Covered</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-muted-foreground">Satisfaction</div>
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
              Ready to Find Your Next Developer?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Browse our directory of talented developers and find the perfect match
              for your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/candidates">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 font-semibold px-8 glow-accent-sm transition-all duration-300 hover:scale-105 group"
                >
                  Browse Candidates
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
