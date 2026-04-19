import { useState, useMemo } from "react";
import { CITIES } from "@/lib/cities";
import { simulate, fmtEUR, FRAIS_NOTAIRE_RATE } from "@/lib/simulation";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DEFAULT_SURFACE = 45;
const DEFAULT_APPORT = 30000;
const DEFAULT_TAUX = 0.037;
const DEFAULT_DUREE = 20;
const DEFAULT_CHARGES = 2500;
const DEFAULT_REVAL_BIEN = 0.015;
const DEFAULT_REVAL_LOYER = 0.015;

export const simulatorHead = {
  title: "Acheter ou louer ? Le simulateur",
  description: "Comparez l'achat et la location de votre résidence principale dans les 10 plus grandes villes françaises.",
};

export function BuyVsRentSimulator() {
  const [cityIdx, setCityIdx] = useState(0);
  const [surface, setSurface] = useState(DEFAULT_SURFACE);
  const [apport, setApport] = useState(DEFAULT_APPORT);
  const [taux, setTaux] = useState(DEFAULT_TAUX);
  const [duree, setDuree] = useState(DEFAULT_DUREE);
  const [charges, setCharges] = useState(DEFAULT_CHARGES);
  const [revalBien, setRevalBien] = useState(DEFAULT_REVAL_BIEN);
  const [revalLoyer, setRevalLoyer] = useState(DEFAULT_REVAL_LOYER);

  const city = CITIES[cityIdx];
  const prixBien = city.pricePerM2 * surface;
  const entretien = Math.round(prixBien * 0.005);
  const loyerBaseMensuel = Math.round((prixBien * city.yield) / 12);

  const result = useMemo(() => simulate({
    prixBien, apport, tauxAnnuel: taux, dureeAnnees: duree,
    chargesAnnuelles: charges, entretienAnnuel: entretien,
    revalBien, revalLoyer, loyerBaseMensuel,
  }), [prixBien, apport, taux, duree, charges, entretien, revalBien, revalLoyer, loyerBaseMensuel]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">
          Acheter ou louer ? <span className="text-blue-600">Le simulateur</span>
        </h1>
        <p className="text-gray-500 mb-8">Comparez l'achat et la location de votre résidence principale dans les 10 plus grandes villes françaises.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h2 className="font-semibold mb-3">Choisir une ville</h2>
              <div className="grid grid-cols-2 gap-2">
                {CITIES.map((c, i) => (
                  <button key={c.name} onClick={() => setCityIdx(i)}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${i === cityIdx ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.pricePerM2.toLocaleString("fr-FR")} €/m²</div>
                  </button>
                ))}
              </div>
              <button onClick={() => { setCityIdx(0); setSurface(DEFAULT_SURFACE); setApport(DEFAULT_APPORT); setTaux(DEFAULT_TAUX); setDuree(DEFAULT_DUREE); setCharges(DEFAULT_CHARGES); setRevalBien(DEFAULT_REVAL_BIEN); setRevalLoyer(DEFAULT_REVAL_LOYER); }}
                className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
                ↺ Réinitialiser ({CITIES[0].name})
              </button>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h2 className="font-semibold mb-3">Le bien</h2>
              <Slider label="Surface" value={surface} min={20} max={150} step={1} unit="m²" onChange={setSurface} />
              <div className="mt-3 flex justify-between text-sm text-gray-500">
                <span>Prix au m² ({city.name})</span>
                <span className="font-medium text-gray-700">{city.pricePerM2.toLocaleString("fr-FR")} €</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Prix total estimé</span>
                <span className="font-medium text-gray-700">{fmtEUR(prixBien)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Loyer estimé</span>
                <span className="font-medium text-gray-700">{fmtEUR(loyerBaseMensuel)}/mois</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h2 className="font-semibold mb-3">Financement</h2>
              <Slider label="Apport" value={apport} min={0} max={200000} step={1000} unit="€" onChange={setApport} />
              <Slider label="Taux d'intérêt" value={taux * 100} min={0.5} max={7} step={0.1} unit="%" onChange={v => setTaux(v / 100)} />
              <Slider label="Durée du prêt" value={duree} min={5} max={30} step={1} unit="ans" onChange={setDuree} />
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h2 className="font-semibold mb-3">Charges & hypothèses</h2>
              <Slider label="Charges annuelles" value={charges} min={0} max={10000} step={100} unit="€" onChange={setCharges} />
              <div className="flex justify-between text-sm text-gray-500 mt-3 mb-1">
                <span>Entretien annuel</span>
                <span className="font-medium text-gray-700">{fmtEUR(entretien)} <span className="text-xs bg-gray-100 rounded px-1">auto</span></span>
              </div>
              <Slider label="Revalorisation bien" value={revalBien * 100} min={0} max={5} step={0.1} unit="% / an" onChange={v => setRevalBien(v / 100)} />
              <Slider label="Revalorisation loyer" value={revalLoyer * 100} min={0} max={5} step={0.1} unit="% / an" onChange={v => setRevalLoyer(v / 100)} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Coût total achat" value={fmtEUR(result.coutTotalAchat)} sub={`prix + ${(FRAIS_NOTAIRE_RATE * 100).toFixed(1)}% notaire`} />
              <StatCard label="Mensualité totale" value={fmtEUR(result.mensualiteTotale)} sub="crédit + assurance" />
              <StatCard label="Écart vs loyer / mois"
                value={`${result.ecartMensuel > 0 ? "+" : ""}${fmtEUR(result.ecartMensuel)}`}
                sub={result.ecartMensuel > 0 ? "achat plus cher" : "achat moins cher"}
                color={result.ecartMensuel > 0 ? "text-red-500" : "text-green-600"} />
              <StatCard label="Seuil de rentabilité"
                value={result.seuilRentabilite ? `${result.seuilRentabilite} ans` : "—"}
                sub={result.seuilRentabilite ? "patrimoine > coût total" : "non atteint sur 25 ans"} />
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h2 className="font-semibold mb-3">Évolution sur 25 ans</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={result.series}>
                  <XAxis dataKey="annee" tickFormatter={v => `${v}a`} tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${Math.round(v / 1000)}k€`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => fmtEUR(v)} labelFormatter={l => `Année ${l}`} />
                  <Legend />
                  <Line type="monotone" dataKey="coutProprietaire" name="Coût propriétaire" stroke="#3b82f6" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="coutLocataire" name="Coût locataire" stroke="#10b981" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="patrimoineNet" name="Patrimoine net" stroke="#f59e0b" dot={false} strokeWidth={2} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void;
}) {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{unit === "€" ? fmtEUR(value) : unit === "%" || unit === "% / an" ? `${value.toFixed(1)} %` : `${value} ${unit}`}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-blue-500" />
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-xl font-bold ${color || "text-gray-800"}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{sub}</div>
    </div>
  );
}
