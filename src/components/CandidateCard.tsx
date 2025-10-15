import { Candidate } from "@/types/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Linkedin, Github, Globe } from "lucide-react";
import { Link } from "react-router-dom";

interface CandidateCardProps {
  candidate: Candidate;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  return (
    <div className="glass rounded-2xl p-6 border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 group animate-scale-in">
      <div className="space-y-4 flex flex-col items-center text-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={candidate.photo}
              alt={candidate.name}
              className="w-24 h-24 rounded-xl object-cover ring-2 ring-border/50 group-hover:ring-primary/50 transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {candidate.name}
            </h3>
            <p className="text-sm text-muted-foreground">{candidate.title}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {candidate.skills.slice(0, 4).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors text-xs"
            >
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 4 && (
            <Badge variant="secondary" className="bg-secondary/50 text-xs">
              +{candidate.skills.length - 4}
            </Badge>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{candidate.location}</span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 justify-center pt-2">
          {candidate.linkedin && (
            <a
              href={candidate.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-300 group/social"
            >
              <Linkedin className="w-4 h-4 text-primary group-hover/social:scale-110 transition-transform" />
            </a>
          )}
          {candidate.github && (
            <a
              href={candidate.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-300 group/social"
            >
              <Github className="w-4 h-4 text-primary group-hover/social:scale-110 transition-transform" />
            </a>
          )}
          {candidate.portfolio && (
            <a
              href={candidate.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-300 group/social"
            >
              <Globe className="w-4 h-4 text-primary group-hover/social:scale-110 transition-transform" />
            </a>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full pt-2">
          <Link to={`/profile/${candidate.id}`} className="block">
            <Button
              variant="outline"
              className="w-full font-semibold group/btn transition-all duration-300"
              size="lg"
            >
              View Profile
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
