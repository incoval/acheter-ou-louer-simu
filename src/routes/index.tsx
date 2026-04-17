import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, RotateCcw } from "lucide-react";
import { CITIES } from "@/lib/cities";
import { simulate, fmtEUR, FRAIS_NOTAIRE_RATE, ASSURANCE_RATE } from "@/lib/simulation";
import { FranceMap } from "@/components/FranceMap";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Simulateur Achat vs Location — 10 villes françaises" },
      {
        name: "description",
        content:
          "Comparez l'achat et la location de votre résidence principale dans les 10 plus grandes villes françaises. Calcul du seuil de rentabilité, mensualité et patrimoine net.",
      },
    ],
  }),
});

function Index() {
  const [cityName, setCityName] = useState("Paris");
  const city = CITIES.find((c) => c.name === cityName)!;

  const [pricePerM2, setPricePerM2] = useState(city.pricePerM2);
  const [surface, setSurface] = useState(45);
  const [apport, setApport] = useState(30000);
  const [taux, setTaux] = useState(3.7);
  const [duree, setDuree] = useState(20);
  const [charges, setCharges] = useState(2500);
  const [entretien, setEntretien] = useState(0);
  const [entretienAuto, setEntretienAuto] = useState(true);
  const [revalBien, setRevalBien] = useState(1.5);
  const [revalLoyer, setRevalLoyer] = useState(1.5);

  // When city changes, reset price/m² to default
  useEffect(() => {
    setPricePerM2(city.pricePerM2);
  }, [cityName]); // eslint-disable-line react-hooks/exhaustive-deps

  const prixBien = pricePerM2 * surface;
  const entretienEffectif = entretienAuto ? prixBien * 0.005 : entretien;
  const loyerBase = (prixBien * city.yield) / 12;

  const sim = useMemo(
    () =>
      simulate({
        prixBien,
        apport,
        tauxAnnuel: taux / 100,
        dureeAnnees: duree,
        chargesAnnuelles: charges,
        entretienAnnuel: entretienEffectif,
        revalBien: revalBien / 100,
        revalLoyer: revalLoyer / 100,
        loyerBaseMensuel: loyerBase,
      }),
    [prixBien, apport, taux, duree, charges, entretienEffectif, revalBien, revalLoyer, loyerBase]
  );

  const reset = () => {
    setPricePerM2(city.pricePerM2);
    setSurface(45);
    setApport(30000);
    setTaux(3.7);
    setDuree(20);
    setCharges(2500);
    setEntretienAuto(true);
    setRevalBien(1.5);
    setRevalLoyer(1.5);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Acheter ou louer&nbsp;? <span className="text-primary">Le simulateur</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comparez l'achat et la location de votre résidence principale dans les 10 plus grandes
            villes françaises.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel 1 - City & property */}
        <aside className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Choisir une ville</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FranceMap selected={cityName} onSelect={setCityName} />

              <div className="grid grid-cols-2 gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCityName(c.name)}
                    className={`text-left rounded-md border px-2.5 py-2 transition-colors ${
                      c.name === cityName
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="text-xs font-medium">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {c.pricePerM2.toLocaleString("fr-FR")} €/m²
                    </div>
                  </button>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full" onClick={reset}>
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                Réinitialiser ({cityName})
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Le bien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Surface</Label>
                  <span className="text-sm font-medium">{surface} m²</span>
                </div>
                <Slider
                  min={30}
                  max={80}
                  step={1}
                  value={[surface]}
                  onValueChange={(v) => setSurface(v[0])}
                />
              </div>

              <div>
                <Label className="text-sm">Prix au m² (€)</Label>
                <Input
                  type="number"
                  value={pricePerM2}
                  onChange={(e) => setPricePerM2(Number(e.target.value) || 0)}
                  className="mt-1.5"
                />
              </div>

              <div className="rounded-md bg-muted/50 p-3">
                <div className="text-xs text-muted-foreground">Prix du bien</div>
                <div className="text-lg font-bold text-primary">{fmtEUR(prixBien)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Loyer équivalent estimé : {fmtEUR(loyerBase)} / mois
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Panel 2 - Loan params */}
        <section className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Financement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <SliderRow
                label="Apport"
                value={apport}
                unit="€"
                min={0}
                max={100000}
                step={1000}
                onChange={setApport}
              />
              <SliderRow
                label="Taux d'intérêt"
                value={taux}
                unit="%"
                min={2}
                max={6}
                step={0.1}
                decimals={1}
                onChange={setTaux}
              />
              <SliderRow
                label="Durée du prêt"
                value={duree}
                unit="ans"
                min={10}
                max={25}
                step={1}
                onChange={setDuree}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Charges & hypothèses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <SliderRow
                label="Charges annuelles"
                value={charges}
                unit="€"
                min={1000}
                max={6000}
                step={100}
                onChange={setCharges}
              />
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Entretien annuel</Label>
                  <span className="text-sm font-medium">
                    {Math.round(entretienEffectif).toLocaleString("fr-FR")} €
                    {entretienAuto && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        auto
                      </Badge>
                    )}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={3000}
                  step={50}
                  value={[entretienAuto ? Math.round(prixBien * 0.005) : entretien]}
                  onValueChange={(v) => {
                    setEntretienAuto(false);
                    setEntretien(v[0]);
                  }}
                />
              </div>
              <SliderRow
                label="Revalorisation bien"
                value={revalBien}
                unit="% / an"
                min={0}
                max={5}
                step={0.1}
                decimals={1}
                onChange={setRevalBien}
              />
              <SliderRow
                label="Revalorisation loyer"
                value={revalLoyer}
                unit="% / an"
                min={0}
                max={3}
                step={0.1}
                decimals={1}
                onChange={setRevalLoyer}
              />
            </CardContent>
          </Card>
        </section>

        {/* Panel 3 - Results */}
        <section className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <KPI label="Coût total achat" value={fmtEUR(sim.coutTotalAchat)} hint="prix + 7,5% notaire" />
            <KPI
              label="Mensualité totale"
              value={fmtEUR(sim.mensualiteTotale)}
              hint="crédit + assurance"
            />
            <KPI
              label="Écart vs loyer / mois"
              value={`${sim.ecartMensuel >= 0 ? "+" : ""}${fmtEUR(sim.ecartMensuel)}`}
              tone={sim.ecartMensuel > 0 ? "negative" : "positive"}
              hint={sim.ecartMensuel > 0 ? "achat plus cher" : "achat moins cher"}
            />
            <KPI
              label="Seuil de rentabilité"
              value={sim.seuilRentabilite ? `Année ${sim.seuilRentabilite}` : "—"}
              tone={sim.seuilRentabilite ? "positive" : "neutral"}
              hint={sim.seuilRentabilite ? "patrimoine net > coûts" : "non atteint sur 25 ans"}
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Évolution sur 25 ans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sim.series} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis
                      dataKey="annee"
                      tick={{ fontSize: 12 }}
                      label={{ value: "Années", position: "insideBottom", offset: -2, fontSize: 11 }}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${Math.round(v / 1000)} k€`}
                    />
                    <Tooltip
                      formatter={(v: number) => fmtEUR(v)}
                      labelFormatter={(l) => `Année ${l}`}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {sim.seuilRentabilite && (
                      <ReferenceLine
                        x={sim.seuilRentabilite}
                        stroke="hsl(var(--primary))"
                        strokeDasharray="4 4"
                        label={{
                          value: `Seuil rentabilité — Année ${sim.seuilRentabilite}`,
                          position: "top",
                          fontSize: 11,
                          fill: "hsl(var(--primary))",
                        }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="coutProprietaire"
                      name="Cumul coûts propriétaire"
                      stroke="#dc2626"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="coutLocataire"
                      name="Cumul loyers locataire"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="patrimoineNet"
                      name="Patrimoine net"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Collapsible>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Hypothèses du calcul</CardTitle>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="text-sm text-muted-foreground space-y-1.5">
                  <p>• Frais de notaire (ancien) : {(FRAIS_NOTAIRE_RATE * 100).toFixed(1)} %</p>
                  <p>• Assurance emprunteur : {(ASSURANCE_RATE * 100).toFixed(2)} % / an du capital</p>
                  <p>• Mensualité calculée par amortissement constant</p>
                  <p>
                    • Loyer équivalent : rendement brut {(city.yield * 100).toFixed(1)} % / an du
                    prix du bien
                  </p>
                  <p>• Entretien automatique : 0,5 % du prix du bien / an</p>
                  <p>
                    • Patrimoine net = valeur revalorisée du bien − capital restant dû (hors
                    fiscalité de revente)
                  </p>
                  <p>
                    • Données prix/m² : MeilleursAgents 2024 (estimations, modifiables).
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </section>
      </main>
    </div>
  );
}

function SliderRow({
  label,
  value,
  unit,
  min,
  max,
  step,
  decimals = 0,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  decimals?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <Label>{label}</Label>
        <span className="text-sm font-medium">
          {value.toLocaleString("fr-FR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}{" "}
          {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}

function KPI({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-red-600"
        : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`text-xl font-bold mt-1 ${toneClass}`}>{value}</div>
        {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      </CardContent>
    </Card>
  );
}
