import { Link } from "react-router-dom";
import { Candidate } from "@/types/candidate";

interface Props {
  candidate: Candidate;
  index: number;
}

export const IndexRow = ({ candidate, index }: Props) => {
  return (
    <Link
      to={`/dev/${candidate.id}`}
      className="group grid grid-cols-12 gap-4 items-center py-6 border-b border-border transition-colors hover:bg-foreground/[0.02] relative"
    >
      <div className="col-span-1 caption">№ {String(index + 1).padStart(2, "0")}</div>

      <div className="col-span-1">
        <img
          src={candidate.photo}
          alt=""
          className="w-12 h-12 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
      </div>

      <div className="col-span-3 font-display text-2xl group-hover:text-primary transition-colors">
        {candidate.name}
      </div>

      <div className="col-span-3 caption truncate">{candidate.title}</div>

      <div className="col-span-2 caption truncate">{candidate.location}</div>

      <div className="col-span-2 caption truncate text-right">
        {candidate.skills.slice(0, 3).join(" · ")}
      </div>
    </Link>
  );
};
