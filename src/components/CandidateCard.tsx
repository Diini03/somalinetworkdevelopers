import { Candidate } from "@/types/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Banknote, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CandidateCardProps {
  candidate: Candidate;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  return (
    <div className="glass rounded-2xl p-6 border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 group animate-scale-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={candidate.photo}
              alt={candidate.name}
              className="w-20 h-20 rounded-xl object-cover ring-2 ring-border/50 group-hover:ring-primary/50 transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {candidate.name}
            </h3>
            <p className="text-sm text-muted-foreground">{candidate.title}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
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

        {/* Info Grid */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Banknote className="w-4 h-4 text-primary" />
            <span>
              £{candidate.expectedSalary.min.toLocaleString()}-£
              {candidate.expectedSalary.max.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>{candidate.qualification}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-muted-foreground font-medium">{candidate.availability}</span>
        </div>

        {/* Action Button */}
        <Link to={`/profile/${candidate.id}`}>
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 font-semibold group/btn transition-all duration-300"
            size="lg"
          >
            View Profile
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
