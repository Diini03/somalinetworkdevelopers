import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Candidate, ExperienceEntry } from "@/types/candidate";
import { InlineContactForm } from "@/components/InlineContactForm";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  GraduationCap,
  Clock,
  ExternalLink,
  ArrowLeft,
  Linkedin,
  Github,
  Globe,
  FileText,
} from "lucide-react";

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCv, setHasCv] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;

      const { data, error } = await supabase.rpc("get_public_candidate", { _id: id });
      const row = Array.isArray(data) ? data[0] : data;

      if (!error && row) {
        const transformedData: Candidate = {
          id: row.id,
          name: row.name,
          title: row.title,
          photo: row.photo,
          skills: row.skills || [],
          location: row.location,
          qualification: row.qualification,
          bio: row.bio,
          linkedin: row.linkedin,
          github: row.github,
          portfolio: row.portfolio,
          experience: Array.isArray(row.experience) ? (row.experience as unknown as ExperienceEntry[]) : [],
          availability: row.availability,
          certifications: row.certifications || [],
        };
        setCandidate(transformedData);
      }
      setLoading(false);
    };

    fetchCandidate();
  }, [id]);

  // Separately check (admin-only direct query allowed by RLS) whether a CV exists,
  // without exposing its URL. We just probe the public-safe metadata via a head request
  // — here we infer presence by trying to request a signed URL on demand.
  useEffect(() => {
    if (!id) return;
    // Optimistically assume a CV may exist; the button handler will report if it doesn't.
    setHasCv(true);
  }, [id]);

  const openCv = async () => {
    if (!candidate) return;
    setCvLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-cv-signed-url", {
        body: { candidateId: candidate.id },
      });
      if (error || !data?.url) {
        toast({
          title: "CV unavailable",
          description: "You need to be signed in, or this candidate has no CV uploaded.",
          variant: "destructive",
        });
        setHasCv(false);
        return;
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } finally {
      setCvLoading(false);
    }
  };

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

            {/* Resume/CV Section — requires authentication; URL is short-lived signed link */}
            {hasCv && (
              <div className="glass rounded-2xl p-6 border border-border/50 shadow-card space-y-4">
                <h3 className="font-bold text-lg">Resume</h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    View the resume of {candidate.name.split(' ')[0]} (sign-in required)
                  </p>
                  <Button
                    onClick={openCv}
                    disabled={cvLoading}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 font-semibold transition-all duration-300"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {cvLoading ? "Opening..." : "View CV"}
                  </Button>
                </div>
              </div>
            )}
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
            <div className="glass rounded-2xl p-6 border border-border/50 shadow-card space-y-6">
              <h2 className="text-2xl font-bold">Professional Experience</h2>
              {candidate.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary pl-4 space-y-2">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {exp.startYear && (
                      <span className="text-lg font-semibold text-primary">
                        {exp.startYear} - {exp.endYear || "Present"}
                      </span>
                    )}
                    {exp.company && (
                      <span className="text-lg font-semibold">{exp.company}</span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
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

            {/* Certifications */}
            {candidate.certifications && candidate.certifications.length > 0 && (
              <div className="glass rounded-2xl p-6 border border-border/50 shadow-card space-y-4">
                <h2 className="text-2xl font-bold">Certifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {candidate.certifications.map((cert, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-lg border border-border/50 hover:border-primary/50 transition-all">
                      <img
                        src={cert}
                        alt={`Certification ${index + 1}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Form */}
            {/* Contact Form — candidate email looked up server-side */}
            <InlineContactForm
              candidateId={candidate.id}
              candidateName={candidate.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
