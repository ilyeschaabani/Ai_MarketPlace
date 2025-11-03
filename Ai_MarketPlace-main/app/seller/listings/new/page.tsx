"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Sparkles, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NewListingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<{
    predictedPrice?: number
    fraudScore?: number
    suggestions?: string[]
  } | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    fuelType: "essence",
    transmission: "manual",
    color: "",
    description: "",
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "seller")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setAiAnalysis({
        predictedPrice: Math.round(formData.price * (0.9 + Math.random() * 0.2)),
        fraudScore: Math.round(Math.random() * 30),
        suggestions: ["Ajouter plus de photos", "Préciser l'historique d'entretien", "Mentionner les équipements"],
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save listing
    router.push("/seller/dashboard")
  }

  if (isLoading || !user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/seller/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Créer une Nouvelle Annonce</h1>
          <p className="text-muted-foreground">Remplissez les détails de votre véhicule</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de Base</CardTitle>
              <CardDescription>Détails essentiels du véhicule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce</Label>
                <Input
                  id="title"
                  placeholder="Ex: Peugeot 208 GTi - Excellent État"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marque</Label>
                  <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Peugeot">Peugeot</SelectItem>
                      <SelectItem value="Renault">Renault</SelectItem>
                      <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="Citroën">Citroën</SelectItem>
                      <SelectItem value="Fiat">Fiat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modèle</Label>
                  <Input
                    id="model"
                    placeholder="Ex: 208 GTi"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Kilométrage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    placeholder="Ex: 45000"
                    value={formData.mileage || ""}
                    onChange={(e) => setFormData({ ...formData, mileage: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Carburant</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essence">Essence</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Électrique</SelectItem>
                      <SelectItem value="hybrid">Hybride</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manuelle</SelectItem>
                      <SelectItem value="automatic">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Couleur</Label>
                  <Input
                    id="color"
                    placeholder="Ex: Rouge"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix (TND)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  placeholder="Ex: 28000"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>Décrivez votre véhicule en détail</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Décrivez l'état du véhicule, son historique, les équipements, etc."
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Ajoutez des photos de qualité de votre véhicule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Cliquez pour télécharger ou glissez-déposez</p>
                <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 10MB</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Analyse IA
              </CardTitle>
              <CardDescription>Obtenez une analyse intelligente de votre annonce</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? "Analyse en cours..." : "Analyser avec l'IA"}
              </Button>

              {aiAnalysis && (
                <div className="space-y-4">
                  {aiAnalysis.predictedPrice && (
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Prix prédit:</strong> {aiAnalysis.predictedPrice.toLocaleString()} TND
                        <br />
                        <span className="text-sm text-muted-foreground">
                          Votre prix: {formData.price.toLocaleString()} TND (
                          {(((formData.price - aiAnalysis.predictedPrice) / aiAnalysis.predictedPrice) * 100).toFixed(
                            1,
                          )}
                          % {formData.price > aiAnalysis.predictedPrice ? "au-dessus" : "en-dessous"})
                        </span>
                      </AlertDescription>
                    </Alert>
                  )}

                  {aiAnalysis.fraudScore !== undefined && (
                    <Alert variant={aiAnalysis.fraudScore > 30 ? "destructive" : "default"}>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Score de fraude:</strong> {aiAnalysis.fraudScore}%
                        <br />
                        <span className="text-sm">
                          {aiAnalysis.fraudScore < 20
                            ? "Risque faible - Annonce semble authentique"
                            : aiAnalysis.fraudScore < 40
                              ? "Risque moyen - Vérifiez les détails"
                              : "Risque élevé - Annonce peut être rejetée"}
                        </span>
                      </AlertDescription>
                    </Alert>
                  )}

                  {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2">Suggestions d'amélioration:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {aiAnalysis.suggestions.map((suggestion, i) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Link href="/seller/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Annuler
              </Button>
            </Link>
            <Button type="submit" className="flex-1">
              Publier l'Annonce
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
