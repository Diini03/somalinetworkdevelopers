interface Props {
  score?: number | null;
  size?: number;
}

export const ScoreRing = ({ score, size = 36 }: Props) => {
  const s = typeof score === "number" ? Math.max(0, Math.min(100, score)) : null;
  const stroke = 2.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = s === null ? c : c - (s / 100) * c;

  const color =
    s === null ? "hsl(var(--muted-foreground) / 0.4)"
    : s >= 80 ? "hsl(var(--primary))"
    : s >= 60 ? "hsl(var(--foreground) / 0.7)"
    : "hsl(var(--muted-foreground))";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 400ms ease" }}
        />
      </svg>
      <span className="absolute font-mono text-[10px] font-medium tabular-nums" style={{ color }}>
        {s === null ? "–" : Math.round(s)}
      </span>
    </div>
  );
};
