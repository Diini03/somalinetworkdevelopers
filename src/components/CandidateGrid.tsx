import { Candidate } from "@/types/candidate";
import { CandidateCard } from "./CandidateCard";

interface CandidateGridProps {
  candidates: Candidate[];
  variant?: "default" | "large";
}

export const CandidateGrid = ({ candidates, variant = "default" }: CandidateGridProps) => {
  if (candidates.length === 0) {
    return (
      <div className="glass rounded-3xl p-16 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-foreground/5 flex items-center justify-center">
            <span className="text-2xl">○</span>
          </div>
          <h3 className="font-display text-3xl">No matches</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters to broaden the search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          <span className="text-foreground font-semibold">{candidates.length}</span>{" "}
          {candidates.length === 1 ? "result" : "results"}
        </p>
      </div>

      <div className={`grid gap-5 ${variant === "large" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
        {candidates.map((candidate, index) => (
          <div key={candidate.id} style={{ animationDelay: `${index * 40}ms` }}>
            <CandidateCard candidate={candidate} />
          </div>
        ))}
      </div>
    </div>
  );
};
