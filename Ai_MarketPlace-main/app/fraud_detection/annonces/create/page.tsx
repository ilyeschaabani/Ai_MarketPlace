"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Car, Loader2, Shield, Search } from "lucide-react"
import Link from "next/link"
import { annonceService } from "@/app/fraud_detection/annonceService"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Annonce, CreateAnnonceData } from "@/types/annonce";

interface Voiture {
  id: number
  marque: string
  modele: string
  annee: number
  carburant: string
  matricule: string
}

export default function CreateAnnoncePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingCars, setLoadingCars] = useState(true)
  const [error, setError] = useState("")
  const [fraudAlert, setFraudAlert] = useState<any>(null)
  const [voitures, setVoitures] = useState<Voiture[]>([])
  const [selectedVoiture, setSelectedVoiture] = useState<Voiture | null>(null)

  const [formData, setFormData] = useState({
    id_voiture: "",
    odometer: "",
    prix: "",
    notRepairedDamage: "no",
  })

  // ✅ Fetch available cars from the database
  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        setLoadingCars(true)
        const response = await fetch('http://localhost:5000/api/voitures')
        
        if (!response.ok) {
          throw new Error('Failed to fetch cars')
        }
        
        const data = await response.json()
        
        if (data.success && Array.isArray(data.data)) {
          setVoitures(data.data)
        } else {
          setError("Erreur lors du chargement des voitures")
        }
      } catch (err) {
        console.error('Error fetching cars:', err)
        setError("Impossible de charger les voitures. Vérifiez que le serveur backend est démarré.")
      } finally {
        setLoadingCars(false)
      }
    }

    fetchVoitures()
  }, [])

  // ✅ Update selected voiture details when user selects a car
  const handleVoitureSelect = (voitureId: string) => {
    const voiture = voitures.find(v => v.id.toString() === voitureId)
    setSelectedVoiture(voiture || null)
    setFormData(prev => ({ ...prev, id_voiture: voitureId }))
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFraudAlert(null)

    try {
      // Validate inputs
      if (!formData.id_voiture || !formData.odometer || !formData.prix) {
        setError("Veuillez remplir tous les champs requis")
        setLoading(false)
        return
      }

      // ✅ Prepare data according to backend CreateAnnonceData type
      const annonceData = {
        id_voiture: parseInt(formData.id_voiture),
        odometer: parseInt(formData.odometer),
        prix: parseFloat(formData.prix),
        notRepairedDamage: formData.notRepairedDamage === "yes", // ✅ Correct: boolean
      }

      console.log('Sending annonce data:', annonceData)

      // Call API to create annonce
const response = await annonceService.createAnnonce(annonceData)
      console.log('Response:', response)

      if (response.success) {
        // Check fraud detection result
        if (response.data?.fraud_prediction === 1) {
          setFraudAlert({
            level: response.data.fraud_level,
            probability: response.data.fraud_probability,
            prediction: response.data.fraud_prediction,
          })
        } else {
          // Redirect to seller dashboard on success
          alert('Annonce créée avec succès!')
          router.push("/seller/dashboard")
        }
      } else {
        setError(response.message || response.error || "Erreur lors de la création de l'annonce")
      }
    } catch (err: any) {
      console.error('Error creating annonce:', err)
      setError(err.message || "Une erreur est survenue lors de la création de l'annonce")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/seller/dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Créer une Annonce</h1>
              <p className="text-muted-foreground">
                Sélectionnez une voiture et ajoutez les détails de l'annonce
              </p>
            </div>
          </div>
        </div>

        {/* AI Protection Notice */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Protection Anti-Fraude IA</p>
                <p className="text-xs text-muted-foreground">
                  Votre annonce sera automatiquement vérifiée par notre système d'intelligence artificielle
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Fraud Alert */}
        {fraudAlert && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">⚠️ Alerte Fraude Détectée!</p>
                <p className="text-sm">
                  Notre système IA a détecté que cette annonce pourrait être suspecte:
                </p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Niveau de risque: <strong>{fraudAlert.level}</strong></li>
                  <li>Probabilité de fraude: <strong>{(fraudAlert.probability * 100).toFixed(1)}%</strong></li>
                </ul>
                <p className="text-sm mt-2">
                  Veuillez vérifier les informations ou contactez le support.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => router.push("/seller/dashboard")}>
                    Retour au Dashboard
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFraudAlert(null)}
                  >
                    Modifier l'Annonce
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loadingCars && (
          <Card>
            <CardContent className="py-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        )}

        {/* Form */}
        {!loadingCars && (
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'Annonce</CardTitle>
              <CardDescription>
                Remplissez tous les champs requis avec précision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ✅ SELECT EXISTING CAR */}
                <div className="space-y-2">
                  <Label htmlFor="id_voiture">Sélectionner une Voiture *</Label>
                  <Select
                    value={formData.id_voiture}
                    onValueChange={handleVoitureSelect}
                    required
                  >
                    <SelectTrigger id="id_voiture">
                      <SelectValue placeholder="Choisir une voiture disponible" />
                    </SelectTrigger>
                    <SelectContent>
                      {voitures.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Aucune voiture disponible
                        </SelectItem>
                      ) : (
                        voitures.map((voiture) => (
                          <SelectItem key={voiture.id} value={voiture.id.toString()}>
                            {voiture.marque} {voiture.modele} ({voiture.annee}) - {voiture.matricule}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  
                  {/* Link to add new car if needed */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Search className="h-4 w-4" />
                    <span>
                      Votre voiture n&apos;est pas dans la liste?{" "}
                      <Link href="/fraud_detection/voitures" className="text-primary hover:underline">
                        Ajouter une nouvelle voiture
                      </Link>
                    </span>
                  </div>
                </div>

                {/* ✅ SHOW SELECTED CAR DETAILS */}
                {selectedVoiture && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Marque</p>
                          <p className="font-semibold">{selectedVoiture.marque}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Modèle</p>
                          <p className="font-semibold">{selectedVoiture.modele}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Année</p>
                          <p className="font-semibold">{selectedVoiture.annee}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Carburant</p>
                          <p className="font-semibold">{selectedVoiture.carburant}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground">Matricule</p>
                          <p className="font-semibold">{selectedVoiture.matricule}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ✅ ODOMETER (REQUIRED) */}
                <div className="space-y-2">
                  <Label htmlFor="odometer">Kilométrage Actuel *</Label>
                  <Input
                    id="odometer"
                    type="number"
                    min="0"
                    placeholder="ex: 50000"
                    value={formData.odometer}
                    onChange={(e) => handleChange("odometer", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Le kilométrage actuel de la voiture au moment de l&apos;annonce
                  </p>
                </div>

                {/* ✅ PRICE (REQUIRED) */}
                <div className="space-y-2">
                  <Label htmlFor="prix">Prix Demandé (€) *</Label>
                  <Input
                    id="prix"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="ex: 25000"
                    value={formData.prix}
                    onChange={(e) => handleChange("prix", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Le prix que vous souhaitez pour cette voiture
                  </p>
                </div>

                {/* ✅ NOT REPAIRED DAMAGE (REQUIRED) */}
                <div className="space-y-2">
                  <Label htmlFor="notRepairedDamage">Dommages Non Réparés *</Label>
                  <Select
                    value={formData.notRepairedDamage}
                    onValueChange={(value) => handleChange("notRepairedDamage", value)}
                    required
                  >
                    <SelectTrigger id="notRepairedDamage">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Non - Aucun dommage</SelectItem>
                      <SelectItem value="yes">Oui - Dommages présents</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    La voiture a-t-elle des dommages non réparés? (accidents, rayures importantes, etc.)
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={loading || !formData.id_voiture} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <Car className="h-4 w-4 mr-2" />
                        Créer l&apos;Annonce
                      </>
                    )}
                  </Button>
                  <Link href="/seller/dashboard">
                    <Button type="button" variant="outline">
                      Annuler
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}