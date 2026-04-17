import { CITIES } from "@/lib/cities";

interface Props {
  selected: string;
  onSelect: (name: string) => void;
}

const MAINLAND_PATH =
  "M 10 39 L 13 35 L 20 31 L 26 28 L 29 34 L 34 31 L 37 24 L 44 20 L 51 20 L 56 23 L 61 22 L 66 25 L 71 24 L 76 27 L 80 26 L 85 30 L 90 36 L 94 44 L 97 50 L 95 54 L 97 58 L 95 62 L 97 66 L 93 69 L 91 74 L 89 79 L 87 84 L 84 88 L 79 91 L 73 93 L 67 92 L 61 94 L 57 92 L 53 94 L 49 92 L 45 94 L 40 91 L 35 88 L 30 85 L 25 80 L 20 75 L 17 69 L 14 62 L 12 57 L 14 51 L 12 46 Z";

const CORSICA_PATH =
  "M 95 88 L 97 86 L 99 87 L 100 91 L 100 95 L 99 98 L 97 100 L 95 99 L 94 96 L 94 92 Z";

const CITY_POSITIONS: Record<string, { x: number; y: number; labelX?: number; labelY?: number; anchor?: "start" | "end" }> = {
  Paris: { x: 49, y: 38 },
  Rennes: { x: 24, y: 49 },
  Nantes: { x: 24, y: 57 },
  Strasbourg: { x: 92, y: 46, labelX: 90, labelY: 46, anchor: "start" },
  Lyon: { x: 68, y: 66 },
  Bordeaux: { x: 31, y: 76 },
  Toulouse: { x: 43, y: 89 },
  Montpellier: { x: 61, y: 88 },
  Marseille: { x: 72, y: 92 },
  Nice: { x: 81, y: 89 },
};

export function FranceMap({ selected, onSelect }: Props) {
  return (
    <svg viewBox="0 0 104 104" className="h-auto w-full overflow-visible">
      <path
        d={MAINLAND_PATH}
        className="fill-muted/20 stroke-border"
        strokeWidth="0.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={CORSICA_PATH}
        className="fill-muted/20 stroke-border"
        strokeWidth="0.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {CITIES.map((city) => {
        const point = CITY_POSITIONS[city.name];
        const isSelected = city.name === selected;
        const labelX = point.labelX ?? point.x + 3;
        const labelY = point.labelY ?? point.y + 1;

        return (
          <g
            key={city.name}
            onClick={() => onSelect(city.name)}
            className="cursor-pointer"
          >
            <circle
              cx={point.x}
              cy={point.y}
              r={isSelected ? 2.4 : 1.6}
              className={
                isSelected
                  ? "fill-primary stroke-primary-foreground"
                  : "fill-primary/60 stroke-background transition-colors hover:fill-primary"
              }
              strokeWidth="0.5"
            />
            <text
              x={labelX}
              y={labelY}
              fontSize="3.1"
              textAnchor={point.anchor ?? "start"}
              className={isSelected ? "fill-foreground font-semibold" : "fill-muted-foreground"}
            >
              {city.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
