import { Candidate } from "@/types/candidate";
import { CandidateCard } from "./CandidateCard";

interface CandidateGridProps {
  candidates: Candidate[];
}

export const CandidateGrid = ({ candidates }: CandidateGridProps) => {
  if (candidates.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center border border-border/50">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold">No candidates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="text-primary font-semibold">{candidates.length}</span>{" "}
          candidate{candidates.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {candidates.map((candidate, index) => (
          <div
            key={candidate.id}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <CandidateCard candidate={candidate} />
          </div>
        ))}
      </div>
    </div>
  );
};
