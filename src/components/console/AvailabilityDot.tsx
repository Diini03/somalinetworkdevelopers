interface Props { status?: string; withLabel?: boolean }

const norm = (s?: string) => (s || "").toLowerCase();

export const AvailabilityDot = ({ status, withLabel }: Props) => {
  const n = norm(status);
  const isOpen = n.includes("open") || n.includes("available") || n.includes("immediate");
  const isPassive = n.includes("passive") || n.includes("month") || n.includes("notice");
  const color = isOpen ? "bg-[hsl(var(--success))]" : isPassive ? "bg-[hsl(var(--warning))]" : "bg-muted-foreground/50";
  const label = isOpen ? "Open to work" : isPassive ? "Passively open" : status || "Not available";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${color} ${isOpen ? "shadow-[0_0_0_3px_hsl(var(--success)/0.15)]" : ""}`} />
      {withLabel && <span className="text-xs text-muted-foreground">{label}</span>}
    </span>
  );
};
