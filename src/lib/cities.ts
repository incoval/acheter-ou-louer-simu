export interface City {
  name: string;
  pricePerM2: number;
  yield: number; // gross rental yield
  // Approx geographic coords for SVG viewBox 0..100 x 0..100
  // calibrated to the France path below (lon ~ -5..10, lat ~ 41..51)
  x: number;
  y: number;
}

// Coordinates calibrated for the realistic France SVG path (viewBox 0 0 100 100)
// Mapping: x ≈ (lon + 5) * 100/15 ; y ≈ (51 - lat) * 100/10
export const CITIES: City[] = [
  { name: "Paris",       pricePerM2: 10200, yield: 0.042, x: 48, y: 22 },  // 2.35E, 48.85N
  { name: "Lyon",        pricePerM2: 5200,  yield: 0.042, x: 65, y: 50 },  // 4.83E, 45.75N
  { name: "Marseille",   pricePerM2: 3400,  yield: 0.042, x: 69, y: 76 },  // 5.37E, 43.30N
  { name: "Toulouse",    pricePerM2: 3800,  yield: 0.042, x: 43, y: 73 },  // 1.44E, 43.60N
  { name: "Bordeaux",    pricePerM2: 4500,  yield: 0.042, x: 30, y: 60 },  // -0.58E, 44.84N
  { name: "Nantes",      pricePerM2: 4200,  yield: 0.042, x: 23, y: 41 },  // -1.55E, 47.22N
  { name: "Nice",        pricePerM2: 5100,  yield: 0.042, x: 81, y: 73 },  // 7.27E, 43.70N
  { name: "Strasbourg",  pricePerM2: 3600,  yield: 0.042, x: 84, y: 30 },  // 7.75E, 48.58N
  { name: "Rennes",      pricePerM2: 4000,  yield: 0.042, x: 23, y: 33 },  // -1.68E, 48.11N
  { name: "Montpellier", pricePerM2: 3700,  yield: 0.042, x: 59, y: 73 },  // 3.88E, 43.61N
];
