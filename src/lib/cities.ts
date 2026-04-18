export interface City {
  name: string;
  pricePerM2: number;
  yield: number; // gross rental yield
  // approx coords on a 0..100 SVG grid (France)
  x: number;
  y: number;
}

export const CITIES: City[] = [
  { name: "Paris", pricePerM2: 10200, yield: 0.042, x: 52, y: 25 },
  { name: "Lyon", pricePerM2: 5200, yield: 0.042, x: 62, y: 55 },
  { name: "Marseille", pricePerM2: 3400, yield: 0.042, x: 64, y: 82 },
  { name: "Toulouse", pricePerM2: 3800, yield: 0.042, x: 42, y: 80 },
  { name: "Bordeaux", pricePerM2: 4500, yield: 0.042, x: 30, y: 68 },
  { name: "Nantes", pricePerM2: 4200, yield: 0.042, x: 25, y: 47 },
  { name: "Nice", pricePerM2: 5100, yield: 0.042, x: 78, y: 80 },
  { name: "Strasbourg", pricePerM2: 3600, yield: 0.042, x: 82, y: 30 },
  { name: "Rennes", pricePerM2: 4000, yield: 0.042, x: 22, y: 38 },
  { name: "Montpellier", pricePerM2: 3700, yield: 0.042, x: 55, y: 80 },
];
