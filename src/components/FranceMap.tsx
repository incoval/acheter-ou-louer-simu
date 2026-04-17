import { CITIES } from "@/lib/cities";

interface Props {
  selected: string;
  onSelect: (name: string) => void;
}

// Simplified but recognizable outline of metropolitan France.
// viewBox 0 0 100 100, oriented North-up.
const FRANCE_PATH = `
M 36 8
L 44 7
L 50 10
L 55 9
L 60 12
L 64 11
L 70 14
L 74 13
L 78 16
L 82 20
L 86 25
L 88 30
L 86 34
L 88 38
L 86 42
L 88 46
L 86 50
L 88 54
L 84 56
L 82 60
L 80 64
L 78 68
L 82 70
L 84 72
L 82 75
L 78 74
L 74 76
L 70 78
L 66 80
L 62 78
L 58 80
L 54 78
L 50 80
L 46 78
L 42 80
L 38 78
L 34 76
L 30 74
L 26 72
L 22 68
L 18 64
L 16 60
L 14 56
L 12 52
L 14 48
L 12 44
L 10 40
L 8 36
L 12 34
L 14 30
L 10 28
L 12 24
L 16 22
L 20 20
L 24 18
L 26 22
L 30 20
L 32 16
L 34 12
Z
`;

export function FranceMap({ selected, onSelect }: Props) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-auto">
      <path
        d={FRANCE_PATH}
        className="fill-muted/40 stroke-border"
        strokeWidth="0.5"
        strokeLinejoin="round"
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
              r={isSel ? 2.2 : 1.5}
              className={
                isSel
                  ? "fill-primary stroke-primary-foreground"
                  : "fill-primary/60 hover:fill-primary stroke-background"
              }
              strokeWidth="0.4"
            />
            <text
              x={c.x + 2.5}
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
