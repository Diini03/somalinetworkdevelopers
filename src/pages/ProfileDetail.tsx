import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Candidate } from "@/types/candidate";
import { InlineContactForm } from "@/components/InlineContactForm";
import {
  MapPin,
  Banknote,
  GraduationCap,
  Clock,
  ExternalLink,
  ArrowLeft,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        const transformedData: Candidate = {
          id: data.id,
          name: data.name,
          title: data.title,
          photo: data.photo,
          skills: data.skills,
          expectedSalary: {
            min: data.expected_salary_min,
            max: data.expected_salary_max,
          },
          location: data.location,
          qualification: data.qualification,
          bio: data.bio,
          email: data.email,
          linkedin: data.linkedin,
          github: data.github,
          portfolio: data.portfolio,
          experience: data.experience,
          availability: data.availability,
        };
        setCandidate(transformedData);
      }
      setLoading(false);
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Candidate Not Found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Candidates
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="glass rounded-2xl p-6 border border-border/50 shadow-card text-center space-y-6 animate-scale-in">
              <div className="relative inline-block">
                <img
                  src={candidate.photo}
                  alt={candidate.name}
                  className="w-32 h-32 rounded-2xl mx-auto object-cover ring-4 ring-border/50"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-card" />
              </div>

              <div>
                <h1 className="text-2xl font-bold mb-2">{candidate.name}</h1>
                <p className="text-muted-foreground">{candidate.title}</p>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 font-semibold transition-all duration-300"
                onClick={() => {
                  document.getElementById('contact-form')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
              >
                Contact Me
              </Button>

              <div className="space-y-3 pt-4 border-t border-border/50">
                {candidate.linkedin && (
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm">LinkedIn Profile</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                )}
                {candidate.github && (
                  <a
                    href={candidate.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-sm">GitHub Profile</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                )}
                {candidate.portfolio && (
                  <a
                    href={candidate.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-sm">Portfolio Website</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="glass rounded-2xl p-6 border border-border/50 shadow-card space-y-4">
              <h3 className="font-bold text-lg">Quick Info</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Salary</p>
                    <p className="font-semibold">
                      £{candidate.expectedSalary.min.toLocaleString()}-£
                      {candidate.expectedSalary.max.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{candidate.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Education</p>
                    <p className="font-semibold">{candidate.qualification}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="font-semibold">{candidate.availability}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="glass rounded-2xl p-6 border border-border/50 shadow-card space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold">About</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {candidate.bio}
              </p>
            </div>

            {/* Experience */}
            <div className="glass rounded-2xl p-6 border border-border/50 shadow-card space-y-4">
              <h2 className="text-2xl font-bold">Experience</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{candidate.experience}</p>
                  <p className="text-muted-foreground">Professional Experience</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="glass rounded-2xl p-6 border border-border/50 shadow-card space-y-4">
              <h2 className="text-2xl font-bold">Technical Skills</h2>
              <div className="flex flex-wrap gap-3">
                {candidate.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-base px-4 py-2 cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <InlineContactForm
              candidateEmail={candidate.email}
              candidateName={candidate.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
