import { Link } from "react-router-dom";
import { Candidate } from "@/types/candidate";

interface Props {
  candidate: Candidate;
}

export const DevTile = ({ candidate }: Props) => {
  return (
    <Link to={`/dev/${candidate.id}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-muted mb-4">
        <img
          src={candidate.photo}
          alt={candidate.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      <div className="font-display text-3xl leading-none mb-2 group-hover:text-primary transition-colors">
        {candidate.name}
      </div>
      <div className="caption">{candidate.title}</div>
    </Link>
  );
};
