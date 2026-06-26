import { Link } from "react-router-dom";
import { Candidate } from "@/types/candidate";

interface Props { candidates: Candidate[]; }

export const AZIndex = ({ candidates }: Props) => {
  const sorted = [...candidates].sort((a, b) => a.name.localeCompare(b.name));
  const items = [...sorted, ...sorted]; // duplicate for seamless loop

  return (
    <div className="border-y border-border py-8">
      <div className="caption px-6 mb-4 max-w-7xl mx-auto">A–Z · Full roster</div>
      <div className="marquee">
        <div className="marquee-track font-display text-5xl md:text-7xl">
          {items.map((c, i) => (
            <Link key={`${c.id}-${i}`} to={`/dev/${c.id}`} className="hover:text-primary transition-colors">
              {c.name} <span className="text-primary mx-2">·</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
