"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react"
import Link from "next/link"
import { getListingById } from "@/lib/mock-data"
import type { CarListing } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ListingDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [listing, setListing] = useState<CarListing | null>(null)

  // Modal + Form state
  const [showInsuranceModal, setShowInsuranceModal] = useState(false)
  const [loadingEstimate, setLoadingEstimate] = useState(false)
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [insuranceCost, setInsuranceCost] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    carYear: 0,
    carValue: 0,
    numberOfAccidents: 0,
    yearsOfExperience: 0,
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "buyer")) {
      router.push("/login")
    }
    if (params.id) {
      const found = getListingById(params.id as string)
      if (found) {
        setListing(found)
        setFormData({
          carYear: found.year,
          carValue: found.price,
          numberOfAccidents: (found as any).numberOfAccidents || 0,
          yearsOfExperience: (found as any).yearsOfExperience || 0,
        })
      }
    }
  }, [user, isLoading, router, params.id])

  if (isLoading || !user || !listing) {
    return <div>Chargement...</div>
  }

  const priceDiff = listing.predictedPrice
    ? ((listing.price - listing.predictedPrice) / listing.predictedPrice) * 100
    : 0

  const handleCalculate = async () => {
    setLoadingEstimate(true)
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setRiskScore(data.riskScore)
      setInsuranceCost(data.insuranceCost)
      setMessage("Estimation générée avec succès !")
      setShowInsuranceModal(false)
    } catch (err) {
      console.error(err)
      setMessage("Erreur lors du calcul de l'assurance.")
    } finally {
      setLoadingEstimate(false)
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/buyer/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la recherche
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={`/.jpg?height=384&width=768&query=${listing.brand} ${listing.model}`}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <p className="text-muted-foreground">
                    {listing.brand} {listing.model} • {listing.year}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{listing.price.toLocaleString()} TND</p>
                  {listing.predictedPrice && (
                    <p className="text-sm text-muted-foreground">
                      Prix prédit: {listing.predictedPrice.toLocaleString()} TND
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contacter le Vendeur
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* AI Analysis Alerts */}
            {listing.predictedPrice && Math.abs(priceDiff) > 10 && (
              <Alert variant={priceDiff < 0 ? "default" : "destructive"}>
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Analyse de Prix IA</AlertTitle>
                <AlertDescription>
                  {priceDiff < 0 ? (
                    <>
                      Ce prix est <strong>{Math.abs(priceDiff).toFixed(1)}% inférieur</strong> au prix prédit.
                    </>
                  ) : (
                    <>
                      Ce prix est <strong>{priceDiff.toFixed(1)}% supérieur</strong> au prix prédit.
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {listing.fraudScore !== undefined && listing.fraudScore < 20 && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Annonce Vérifiée</AlertTitle>
                <AlertDescription>
                  Score de confiance IA: {100 - listing.fraudScore}%
                </AlertDescription>
              </Alert>
            )}

            {listing.fraudScore !== undefined && listing.fraudScore > 30 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Alerte de Sécurité</AlertTitle>
                <AlertDescription>
                  Cette annonce présente des signaux d'alerte.
                  {listing.fraudAlerts && (
                    <ul className="list-disc list-inside mt-2">
                      {listing.fraudAlerts.map((alert, i) => (
                        <li key={i}>{alert}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Year */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Année</p>
                      <p className="font-semibold">{listing.year}</p>
                    </div>
                  </div>
                  {/* Mileage */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Gauge className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kilométrage</p>
                      <p className="font-semibold">{listing.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  {/* Fuel */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Fuel className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carburant</p>
                      <p className="font-semibold capitalize">{listing.fuelType}</p>
                    </div>
                  </div>
                  {/* Transmission */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-semibold capitalize">
                        {listing.transmission === "manual" ? "Manuelle" : "Automatique"}
                      </p>
                    </div>
                  </div>
                  {/* Color */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Palette className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Couleur</p>
                      <p className="font-semibold">{listing.color}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Assistant IA
                </CardTitle>
                <CardDescription>Posez vos questions sur ce véhicule</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Démarrer une Conversation
                </Button>
              </CardContent>
            </Card>

            {/* Insurance Estimate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-3" />
                  Estimation Assurance
                </CardTitle>
                <CardDescription>Calculée par notre IA</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowInsuranceModal(true)}
                  className="w-full mb-4"
                >
                  Ouvrir Estimation
                </Button>

                {riskScore !== null && insuranceCost !== null && (
                  <div className="space-y-2">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Prime Estimée</p>
                      <p className="text-2xl font-bold">{insuranceCost.toFixed(2)} TND/an</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risque</span>
                      <Badge variant="secondary">{riskLabel}</Badge>
                    </div>
                    <Separator />
                    {message && <p className="text-muted-foreground">{message}</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations Vendeur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">FS</span>
                  </div>
                  <div>
                    <p className="font-semibold">Fatima Seller</p>
                    <p className="text-sm text-muted-foreground">Membre depuis 2024</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annonces actives</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taux de réponse</span>
                    <span className="font-semibold">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Insurance Modal */}
      {showInsuranceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              onClick={() => setShowInsuranceModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Informations du véhicule</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-muted-foreground">Année</label>
                <input
                  type="number"
                  className="w-full border rounded p-1"
                  value={formData.carYear}
                  onChange={(e) =>
                    setFormData({ ...formData, carYear: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground">Valeur du véhicule</label>
                <input
                  type="number"
                  className="w-full border rounded p-1"
                  value={formData.carValue}
                  onChange={(e) =>
                    setFormData({ ...formData, carValue: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground">Nombre d'accidents</label>
                <input
                  type="number"
                  className="w-full border rounded p-1"
                  value={formData.numberOfAccidents}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfAccidents: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground">Années d'expérience</label>
                <input
                  type="number"
                  className="w-full border rounded p-1"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })
                  }
                />
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full mt-2"
                disabled={loadingEstimate}
              >
                {loadingEstimate ? "Calcul en cours..." : "Valider et Calculer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
