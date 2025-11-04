"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Gauge, Fuel, Settings, Shield, MapPin, Phone, Mail, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { annonceService } from "@/app/fraud_detection/annonceService"
import type { Annonce, AnnonceResponse, AnnoncesListResponse } from "@/types/annonce"

export default function AnnonceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [annonce, setAnnonce] = useState<Annonce | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      loadAnnonce(Number(params.id))
    }
  }, [params.id])

  const loadAnnonce = async (id: number) => {
    try {
      setLoading(true)
      const response = await annonceService.getAnnonceById(id)
      
      if (response.success && response.data) {
        setAnnonce(response.data)
        setError(null) // ✅ Clear error on success
      } else {
        // The response type doesn't include an 'error' property; provide a generic message and log the full response for debugging.
        console.error("Failed to load annonce:", response)
        setError("Annonce introuvable")
        setAnnonce(null)
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement de l'annonce") // ✅ Fixed format
      setAnnonce(null)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getFraudBadge = () => {
    if (!annonce) return null
    
    if (annonce.fraud_prediction === 1) {
      return (
        <Badge variant="destructive" className="text-base px-4 py-2">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Fraude détectée
        </Badge>
      )
    }
    if (annonce.fraud_level === 'medium') {
      return (
        <Badge variant="secondary" className="text-base px-4 py-2 bg-yellow-500 text-white">
          ⚠️ Risque moyen
        </Badge>
      )
    }
    return (
      <Badge className="text-base px-4 py-2 bg-green-500">
        <CheckCircle className="h-4 w-4 mr-2" />
        Vérifié par IA
      </Badge>
    )
  }

  const trustScore = annonce?.fraud_probability !== null && annonce?.fraud_probability !== undefined
    ? ((1 - annonce.fraud_probability) * 100).toFixed(1)
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !annonce) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-destructive">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Erreur</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Link href="/annonces">
                <Button>Retour aux annonces</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link href="/annonces">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour aux annonces
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {annonce.marque} {annonce.modele}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {annonce.annee} • {annonce.matricule}
                    </CardDescription>
                  </div>
                  {getFraudBadge()}
                </div>
                
                <div className="text-4xl font-bold text-primary">
                  {annonce.prix?.toLocaleString()} €
                </div>
              </CardHeader>
            </Card>

            {/* Image Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="w-full h-96 bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Settings className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Photo de la voiture</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Année</p>
                      <p className="font-semibold">{annonce.annee}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kilométrage</p>
                      <p className="font-semibold">{annonce.odometer?.toLocaleString()} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Fuel className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carburant</p>
                      <p className="font-semibold">{annonce.carburant}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-semibold">Automatique</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dommages</p>
                      <p className="font-semibold">
                        {annonce.notRepairedDamage ? "Oui" : "Non"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Verification */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle>Vérification IA Anti-Fraude</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {trustScore && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Score de confiance</span>
                      <span className="font-semibold text-lg">{trustScore}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          annonce.fraud_level === 'low' ? 'bg-green-500' :
                          annonce.fraud_level === 'medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${trustScore}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Cette annonce a été analysée par notre système d&apos;intelligence artificielle
                    pour détecter d&apos;éventuelles fraudes.
                  </p>
                  {annonce.fraud_prediction === 0 && (
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Aucune anomalie détectée
                    </p>
                  )}
                  {annonce.fraud_level === 'medium' && (
                    <p className="text-sm text-yellow-700 font-medium">
                      ⚠ Vérifications supplémentaires recommandées
                    </p>
                  )}
                  {annonce.fraud_prediction === 1 && (
                    <p className="text-sm text-red-700 font-medium">
                      ⚠ Anomalies détectées - Prudence recommandée
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contacter le vendeur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full gap-2" size="lg">
                  <Phone className="h-4 w-4" />
                  Appeler
                </Button>
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <Mail className="h-4 w-4" />
                  Envoyer un message
                </Button>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Informations de localisation non disponibles
                </p>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Conseils de sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                <p>• Vérifiez toujours le véhicule en personne</p>
                <p>• Demandez l&apos;historique complet</p>
                <p>• Faites inspecter par un mécanicien</p>
                <p>• Méfiez-vous des prix trop bas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}