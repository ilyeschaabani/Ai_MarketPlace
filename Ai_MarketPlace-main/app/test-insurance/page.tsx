"use client"

import { useEffect, useState } from "react"
import { InsuranceCard } from "@/components/insurance-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus, Car, Shield } from "lucide-react"
import Link from "next/link"

interface Annonce {
  id: number
  marque: string
  modele?: string
  annee: number
  prix: string
  kilometrage?: number
  description?: string
  insurance_risk_score: number | null
  insurance_cost: string | null
  insurance_risk_level: string | null
  number_of_accidents: number
  years_of_experience: number
}

export default function AnnoncesListPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnnonces = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("http://localhost:5000/api/annonces")
      const data = await response.json()
      
      if (data.success) {
        setAnnonces(data.data)
      } else {
        setError("Impossible de charger les annonces")
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnonces()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg text-muted-foreground">Chargement des annonces...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-8">
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-red-800 font-bold text-2xl mb-2">Erreur de connexion</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <Button onClick={fetchAnnonces} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Car className="h-10 w-10 text-primary" />
              Annonces de Voitures
            </h1>
            <p className="text-muted-foreground text-lg">
              {annonces.length} annonce{annonces.length !== 1 ? 's' : ''} disponible{annonces.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchAnnonces} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Link href="/annonces/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Annonce
              </Button>
            </Link>
          </div>
        </div>

        {/* Annonces List */}
        {annonces.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="text-center p-12">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                  <Car className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-3">Aucune annonce</CardTitle>
              <CardDescription className="text-base mb-6">
                Commencez par créer votre première annonce de voiture
              </CardDescription>
              <Link href="/annonces/new">
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Créer une annonce
                </Button>
              </Link>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6">
            {annonces.map((annonce) => (
              <Card key={annonce.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-1">
                        {annonce.marque} {annonce.modele || ''}
                      </CardTitle>
                      <CardDescription className="text-base">
                        Année {annonce.annee} • {annonce.kilometrage?.toLocaleString() || 'N/A'} km
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {parseFloat(annonce.prix).toLocaleString()} TND
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Car Details */}
                    <div>
                      <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        Détails du véhicule
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Marque</span>
                          <span className="font-medium">{annonce.marque}</span>
                        </div>
                        {annonce.modele && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Modèle</span>
                            <span className="font-medium">{annonce.modele}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Année</span>
                          <span className="font-medium">{annonce.annee}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Kilométrage</span>
                          <span className="font-medium">
                            {annonce.kilometrage?.toLocaleString() || 'N/A'} km
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Nombre d'accidents</span>
                          <span className="font-medium">{annonce.number_of_accidents}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Expérience conducteur</span>
                          <span className="font-medium">{annonce.years_of_experience} ans</span>
                        </div>
                      </div>
                    </div>

                    {/* Insurance Analysis */}
                    <div>
                      <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Analyse d'assurance
                      </h3>
                      <InsuranceCard
                        riskScore={annonce.insurance_risk_score}
                        insuranceCost={annonce.insurance_cost ? parseFloat(annonce.insurance_cost) : null}
                        riskLevel={annonce.insurance_risk_level}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  {annonce.description && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-muted-foreground">{annonce.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
