"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface InsuranceEstimatorProps {
  car: {
    year: number
    price: number
    numberOfAccidents?: number
    yearsOfExperience?: number
  }
}

export default function InsuranceEstimator({ car }: InsuranceEstimatorProps) {
  const [loading, setLoading] = useState(false)
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [insuranceCost, setInsuranceCost] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleCalculate = async () => {
    setLoading(true)
    // Reset previous results/messages to avoid stale UI while loading
    setMessage(null)
    setRiskScore(null)
    setInsuranceCost(null)
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carYear: car.year,
          carValue: car.price,
          numberOfAccidents: car.numberOfAccidents || 0,
          yearsOfExperience: car.yearsOfExperience || 0,
        }),
      })
      if (!response.ok) {
        const txt = await response.text().catch(() => "")
        throw new Error(`HTTP ${response.status} ${txt}`)
      }
      const data = await response.json()
      if (
        typeof data?.riskScore !== "number" ||
        typeof data?.insuranceCost !== "number"
      ) {
        throw new Error("Réponse du modèle invalide")
      }
      setRiskScore(data.riskScore)
      setInsuranceCost(data.insuranceCost)
      setMessage("Estimation générée avec succès !")
    } catch (err) {
      console.error(err)
      setMessage("Erreur lors du calcul de l'assurance.")
    } finally {
      setLoading(false)
    }
  }

  const riskLabel =
    riskScore !== null
      ? riskScore < 0.3
        ? "Faible"
        : riskScore < 0.6
        ? "Moyen"
        : "Élevé"
      : null

  return (
    <div className="space-y-4">
      {riskScore === null ? (
        <>
          <Button onClick={handleCalculate} className="w-full" disabled={loading}>
            {loading ? "Calcul en cours..." : "Calculer l'Assurance"}
          </Button>
          {message && <p className="text-muted-foreground text-sm">{message}</p>}
        </>
      ) : (
        <>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Prime Estimée</p>
            <p className="text-2xl font-bold">
              {insuranceCost !== null ? insuranceCost.toFixed(2) : "—"} TND/an
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risque</span>
              <Badge variant="secondary">{riskLabel}</Badge>
            </div>
            <Separator />
            {message && <p className="text-muted-foreground">{message}</p>}
          </div>
        </>
      )}
    </div>
  )
}
