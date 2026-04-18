import { CITIES } from "@/lib/cities";

interface Props {
  selected: string;
  onSelect: (name: string) => void;
}

export function FranceMap({ selected, onSelect }: Props) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-auto">
      {/* Schematic France hexagon */}
      <path
        d="M 30 12 L 70 14 L 88 30 L 86 55 L 78 78 L 60 92 L 38 90 L 18 70 L 12 45 L 18 22 Z"
        fill="hsl(var(--muted) / 0.4)"
        stroke="hsl(var(--border))"
        strokeWidth="0.4"
        className="fill-muted/40 stroke-border"
      />
      {CITIES.map((c) => {
        const isSel = c.name === selected;
        return (
          <g
            key={c.name}
            onClick={() => onSelect(c.name)}
            className="cursor-pointer"
          >
            <circle
              cx={c.x}
              cy={c.y}
              r={isSel ? 2.4 : 1.6}
              className={
                isSel
                  ? "fill-primary stroke-primary-foreground"
                  : "fill-primary/60 hover:fill-primary stroke-background"
              }
              strokeWidth="0.4"
            />
            <text
              x={c.x + 3}
              y={c.y + 1}
              fontSize="2.6"
              className={isSel ? "fill-foreground font-semibold" : "fill-muted-foreground"}
            >
              {c.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
