import { Candidate } from "@/types/candidate";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowUpRight, Linkedin, Github, Globe } from "lucide-react";
import { Link } from "react-router-dom";

interface CandidateCardProps {
  candidate: Candidate;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  return (
    <Link
      to={`/profile/${candidate.id}`}
      className="group relative block glass rounded-3xl p-6 hover-lift hover:shadow-float overflow-hidden animate-scale-in"
    >
      {/* Hover accent corner */}
      <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-foreground/5 group-hover:bg-primary flex items-center justify-center transition-all duration-300">
        <ArrowUpRight className="w-4 h-4 text-foreground group-hover:text-primary-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={candidate.photo}
            alt={candidate.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full border-2 border-background" />
        </div>
        <div className="min-w-0 pt-1">
          <h3 className="font-display text-2xl leading-tight text-foreground truncate">
            {candidate.name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {candidate.skills.slice(0, 4).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="bg-foreground/5 hover:bg-foreground/10 text-foreground border-0 rounded-full text-[11px] font-medium px-2.5 py-0.5"
          >
            {skill}
          </Badge>
        ))}
        {candidate.skills.length > 4 && (
          <Badge variant="secondary" className="bg-foreground/5 text-muted-foreground border-0 rounded-full text-[11px] font-medium px-2.5 py-0.5">
            +{candidate.skills.length - 4}
          </Badge>
        )}
      </div>

      <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span>{candidate.location}</span>
        </div>
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {candidate.linkedin && (
            <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          )}
          {candidate.github && (
            <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors" aria-label="GitHub">
              <Github className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          )}
          {candidate.portfolio && (
            <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors" aria-label="Portfolio">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          )}
        </div>
      </div>
    </Link>
  );
};
