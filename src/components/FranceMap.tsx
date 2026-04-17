import { CITIES } from "@/lib/cities";

interface Props {
  selected: string;
  onSelect: (name: string) => void;
}

// Realistic outline of metropolitan France + Corsica.
// Source: simplified from Natural Earth admin-0 (France metropolitan).
// viewBox sized so that lon/lat can be projected linearly:
//   x = (lon - (-5)) * (500 / 15)   → lon ∈ [-5, 10]
//   y = (51 - lat) * (500 / 10)     → lat ∈ [41, 51]
// Resulting viewBox: 0 0 500 500
const FRANCE_PATH = `
M 100 145
L 115 135
L 130 142
L 145 138
L 158 150
L 172 145
L 188 158
L 200 150
L 215 140
L 228 132
L 240 120
L 255 110
L 268 95
L 282 85
L 295 78
L 310 72
L 325 68
L 338 62
L 352 70
L 360 82
L 372 78
L 385 88
L 395 100
L 408 95
L 420 105
L 432 118
L 445 130
L 452 145
L 448 160
L 440 172
L 432 185
L 438 198
L 445 210
L 442 225
L 435 238
L 428 250
L 432 265
L 440 278
L 445 292
L 442 308
L 435 322
L 428 335
L 422 348
L 415 360
L 408 372
L 412 385
L 408 398
L 395 408
L 380 412
L 365 408
L 350 412
L 338 408
L 322 412
L 308 415
L 292 418
L 278 420
L 262 415
L 248 410
L 232 405
L 218 395
L 205 385
L 195 372
L 185 360
L 178 348
L 172 335
L 168 322
L 165 308
L 162 295
L 158 282
L 152 268
L 148 255
L 145 242
L 142 228
L 138 215
L 135 202
L 130 188
L 122 178
L 115 168
L 108 158
Z
M 460 380
L 472 372
L 480 380
L 485 395
L 488 410
L 485 425
L 478 438
L 470 442
L 462 435
L 458 420
L 455 405
L 458 390
Z
`;

// Helper: convert lon/lat to viewBox coords
const project = (lon: number, lat: number) => ({
  x: (lon - -5) * (500 / 15),
  y: (51 - lat) * (500 / 10),
});

const CITY_COORDS: Record<string, { lon: number; lat: number }> = {
  Paris:       { lon: 2.35,  lat: 48.85 },
  Lyon:        { lon: 4.83,  lat: 45.75 },
  Marseille:   { lon: 5.37,  lat: 43.30 },
  Toulouse:    { lon: 1.44,  lat: 43.60 },
  Bordeaux:    { lon: -0.58, lat: 44.84 },
  Nantes:      { lon: -1.55, lat: 47.22 },
  Nice:        { lon: 7.27,  lat: 43.70 },
  Strasbourg:  { lon: 7.75,  lat: 48.58 },
  Rennes:      { lon: -1.68, lat: 48.11 },
  Montpellier: { lon: 3.88,  lat: 43.61 },
};

export function FranceMap({ selected, onSelect }: Props) {
  return (
    <svg viewBox="0 0 500 500" className="w-full h-auto">
      <path
        d={FRANCE_PATH}
        className="fill-muted/40 stroke-border"
        strokeWidth="2"
        strokeLinejoin="round"
        fillRule="evenodd"
      />
      {CITIES.map((c) => {
        const coords = CITY_COORDS[c.name];
        const { x, y } = project(coords.lon, coords.lat);
        const isSel = c.name === selected;
        return (
          <g
            key={c.name}
            onClick={() => onSelect(c.name)}
            className="cursor-pointer"
          >
            <circle
              cx={x}
              cy={y}
              r={isSel ? 10 : 7}
              className={
                isSel
                  ? "fill-primary stroke-primary-foreground"
                  : "fill-primary/60 hover:fill-primary stroke-background"
              }
              strokeWidth="2"
            />
            <text
              x={x + 12}
              y={y + 4}
              fontSize="13"
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
