"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [showInsuranceEstimate, setShowInsuranceEstimate] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "buyer")) {
      router.push("/login")
    }
    if (params.id) {
      const found = getListingById(params.id as string)
      if (found) {
        setListing(found)
      }
    }
  }, [user, isLoading, router, params.id])

  if (isLoading || !user || !listing) {
    return <div>Chargement...</div>
  }

  const priceDiff = listing.predictedPrice
    ? ((listing.price - listing.predictedPrice) / listing.predictedPrice) * 100
    : 0

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
                      Ce prix est <strong>{Math.abs(priceDiff).toFixed(1)}% inférieur</strong> au prix prédit. C'est
                      potentiellement une bonne affaire!
                    </>
                  ) : (
                    <>
                      Ce prix est <strong>{priceDiff.toFixed(1)}% supérieur</strong> au prix prédit. Vous pourriez
                      négocier.
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
                  Cette annonce a passé nos contrôles de sécurité IA avec un score de confiance de{" "}
                  {100 - listing.fraudScore}%.
                </AlertDescription>
              </Alert>
            )}

            {listing.fraudScore !== undefined && listing.fraudScore > 30 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Alerte de Sécurité</AlertTitle>
                <AlertDescription>
                  Cette annonce présente des signaux d'alerte. Soyez prudent et vérifiez tous les détails avant de
                  procéder.
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
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Année</p>
                      <p className="font-semibold">{listing.year}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Gauge className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kilométrage</p>
                      <p className="font-semibold">{listing.mileage.toLocaleString()} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Fuel className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carburant</p>
                      <p className="font-semibold capitalize">{listing.fuelType}</p>
                    </div>
                  </div>

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
              <CardContent className="space-y-4">
                {!showInsuranceEstimate ? (
                  <Button onClick={() => setShowInsuranceEstimate(true)} className="w-full">
                    Calculer l'Assurance
                  </Button>
                ) : (
                  <>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Prime Estimée</p>
                      <p className="text-2xl font-bold">850 TND/an</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risque</span>
                        <Badge variant="secondary">Moyen</Badge>
                      </div>
                      <Separator />
                      <div className="space-y-1 text-muted-foreground">
                        <p>• Âge du véhicule: Impact moyen</p>
                        <p>• Kilométrage: Impact faible</p>
                        <p>• Historique: Bon</p>
                      </div>
                    </div>
                  </>
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
    </div>
  )
}
