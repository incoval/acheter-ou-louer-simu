export interface SimParams {
  prixBien: number;
  apport: number;
  tauxAnnuel: number; // e.g. 0.037
  dureeAnnees: number;
  chargesAnnuelles: number;
  entretienAnnuel: number;
  revalBien: number; // e.g. 0.015
  revalLoyer: number;
  loyerBaseMensuel: number;
}

export const FRAIS_NOTAIRE_RATE = 0.075;
export const ASSURANCE_RATE = 0.003;

export interface SimResult {
  fraisNotaire: number;
  capital: number;
  mensualiteCredit: number;
  assuranceMensuelle: number;
  mensualiteTotale: number;
  ecartMensuel: number; // mensualite - loyer
  coutTotalAchat: number;
  seuilRentabilite: number | null;
  series: Array<{
    annee: number;
    coutProprietaire: number;
    coutLocataire: number;
    patrimoineNet: number;
  }>;
}

export function simulate(p: SimParams, horizon = 25): SimResult {
  const fraisNotaire = p.prixBien * FRAIS_NOTAIRE_RATE;
  const capital = Math.max(0, p.prixBien + fraisNotaire - p.apport);
  const tauxMensuel = p.tauxAnnuel / 12;
  const n = p.dureeAnnees * 12;

  let mensualiteCredit = 0;
  if (capital > 0 && tauxMensuel > 0) {
    mensualiteCredit = (capital * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -n));
  } else if (capital > 0) {
    mensualiteCredit = capital / n;
  }

  const assuranceMensuelle = (capital * ASSURANCE_RATE) / 12;
  const mensualiteTotale = mensualiteCredit + assuranceMensuelle;
  const ecartMensuel = mensualiteTotale - p.loyerBaseMensuel;
  const coutTotalAchat = p.prixBien + fraisNotaire;

  const crd = (y: number): number => {
    if (y >= p.dureeAnnees) return 0;
    if (capital <= 0) return 0;
    if (tauxMensuel === 0) return capital * (1 - (y * 12) / n);
    const num = Math.pow(1 + tauxMensuel, n) - Math.pow(1 + tauxMensuel, y * 12);
    const den = Math.pow(1 + tauxMensuel, n) - 1;
    return capital * (num / den);
  };

  const series: SimResult["series"] = [];
  let cumProprio = p.apport + fraisNotaire;
  let cumLoyer = 0;

  // Year 0
  series.push({
    annee: 0,
    coutProprietaire: cumProprio,
    coutLocataire: 0,
    patrimoineNet: p.prixBien - capital, // = apport - fraisNotaire effectively
  });

  let seuil: number | null = null;

  for (let y = 1; y <= horizon; y++) {
    const enCredit = y <= p.dureeAnnees;
    const annuiteCredit = enCredit ? mensualiteCredit * 12 + assuranceMensuelle * 12 : 0;
    cumProprio += annuiteCredit + p.chargesAnnuelles + p.entretienAnnuel;

    const loyerAnneeY = p.loyerBaseMensuel * 12 * Math.pow(1 + p.revalLoyer, y - 1);
    cumLoyer += loyerAnneeY;

    const valeur = p.prixBien * Math.pow(1 + p.revalBien, y);
    const patrimoine = valeur - crd(y);

    series.push({
      annee: y,
      coutProprietaire: cumProprio,
      coutLocataire: cumLoyer,
      patrimoineNet: patrimoine,
    });

    if (seuil === null && patrimoine > cumProprio) {
      seuil = y;
    }
  }

  return {
    fraisNotaire,
    capital,
    mensualiteCredit,
    assuranceMensuelle,
    mensualiteTotale,
    ecartMensuel,
    coutTotalAchat,
    seuilRentabilite: seuil,
    series,
  };
}

export const fmtEUR = (n: number): string =>
  `${Math.round(n).toLocaleString("fr-FR")} €`;
