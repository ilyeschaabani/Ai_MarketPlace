"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { voitureApiClient } from "@/lib/voiture-api-client"
import { Voiture } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { 
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Car
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const matricule = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalMatricule, setOriginalMatricule] = useState("")
  
  const [formData, setFormData] = useState({
    matricule: "",
    marque: "",
    modele: "",
    annee: "",
    puissance: "",
    cylindres: "",
    carburant: "",
    transmission: "",
    traction: "",
    prix: "",
  })

  useEffect(() => {
    if (matricule) {
      loadVoiture()
    }
  }, [matricule])

  const loadVoiture = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await voitureApiClient.getVoitureByMatricule(matricule)
      
      if (response.success && response.data && !Array.isArray(response.data)) {
        const voiture = response.data
        setOriginalMatricule(voiture.matricule)
        setFormData({
          matricule: voiture.matricule,
          marque: voiture.marque,
          modele: voiture.modele,
          annee: voiture.annee?.toString() || "",
          puissance: voiture.puissance?.toString() || "",
          cylindres: voiture.cylindres?.toString() || "",
          carburant: voiture.carburant || "",
          transmission: voiture.transmission || "",
          traction: voiture.traction || "",
          prix: voiture.prix?.toString() || "",
        })
      } else {
        setError("Voiture non trouvée")
      }
    } catch (err) {
      console.error("Erreur:", err)
      setError("Impossible de charger la voiture")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.matricule || !formData.marque || !formData.modele) {
      toast({
        title: "Erreur de validation",
        description: "Le matricule, la marque et le modèle sont obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      // Préparer les données pour l'API
      const voitureData: any = {
        marque: formData.marque,
        modele: formData.modele,
      }

      // Ajouter le matricule seulement s'il a changé
      if (formData.matricule !== originalMatricule) {
        voitureData.matricule = formData.matricule
      }

      // Ajouter les champs optionnels seulement s'ils ont une valeur
      if (formData.annee) voitureData.annee = parseInt(formData.annee)
      if (formData.puissance) voitureData.puissance = parseFloat(formData.puissance)
      if (formData.cylindres) voitureData.cylindres = parseFloat(formData.cylindres)
      if (formData.carburant) voitureData.carburant = formData.carburant
      if (formData.transmission) voitureData.transmission = formData.transmission
      if (formData.traction) voitureData.traction = formData.traction
      if (formData.prix) voitureData.prix = parseFloat(formData.prix)

      const response = await voitureApiClient.updateVoiture(originalMatricule, voitureData)

      if (response.success) {
        toast({
          title: "Succès",
          description: "La voiture a été modifiée avec succès",
        })
        // Si le matricule a changé, rediriger vers le nouveau
        const newMatricule = formData.matricule !== originalMatricule 
          ? formData.matricule 
          : originalMatricule
        router.push(`/cars/${newMatricule}`)
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Impossible de modifier la voiture",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="border-destructive">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erreur</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => router.push("/cars")}>Retour à la liste</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Navigation */}
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/cars/${originalMatricule}`)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux détails
        </Button>

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Modifier la Voiture</h1>
          </div>
          <p className="text-muted-foreground">
            Modifiez les informations de la voiture {formData.marque} {formData.modele}
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informations de la voiture</CardTitle>
              <CardDescription>
                Les champs marqués d'un * sont obligatoires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informations de base</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="matricule">
                      Matricule <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="matricule"
                      placeholder="Ex: AB-123-CD"
                      value={formData.matricule}
                      onChange={(e) => handleChange("matricule", e.target.value)}
                      required
                    />
                    {formData.matricule !== originalMatricule && (
                      <p className="text-xs text-amber-600">
                        ⚠️ Attention: Vous modifiez le matricule
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marque">
                      Marque <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="marque"
                      placeholder="Ex: Renault"
                      value={formData.marque}
                      onChange={(e) => handleChange("marque", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modele">
                      Modèle <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="modele"
                      placeholder="Ex: Clio"
                      value={formData.modele}
                      onChange={(e) => handleChange("modele", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annee">Année</Label>
                    <Input
                      id="annee"
                      type="number"
                      placeholder="Ex: 2020"
                      value={formData.annee}
                      onChange={(e) => handleChange("annee", e.target.value)}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                </div>
              </div>

              {/* Caractéristiques techniques */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Caractéristiques techniques</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="puissance">Puissance (CV)</Label>
                    <Input
                      id="puissance"
                      type="number"
                      placeholder="Ex: 110"
                      value={formData.puissance}
                      onChange={(e) => handleChange("puissance", e.target.value)}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cylindres">Cylindrée (cm³)</Label>
                    <Input
                      id="cylindres"
                      type="number"
                      placeholder="Ex: 1600"
                      value={formData.cylindres}
                      onChange={(e) => handleChange("cylindres", e.target.value)}
                      min="0"
                      step="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carburant">Carburant</Label>
                    <Select
                      value={formData.carburant}
                      onValueChange={(value) => handleChange("carburant", value)}
                    >
                      <SelectTrigger id="carburant">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="essence">Essence</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electrique">Électrique</SelectItem>
                        <SelectItem value="hybride">Hybride</SelectItem>
                        <SelectItem value="gpl">GPL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => handleChange("transmission", value)}
                    >
                      <SelectTrigger id="transmission">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manuelle">Manuelle</SelectItem>
                        <SelectItem value="automatique">Automatique</SelectItem>
                        <SelectItem value="semi-automatique">Semi-automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="traction">Traction</Label>
                    <Select
                      value={formData.traction}
                      onValueChange={(value) => handleChange("traction", value)}
                    >
                      <SelectTrigger id="traction">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="avant">Avant</SelectItem>
                        <SelectItem value="arriere">Arrière</SelectItem>
                        <SelectItem value="integrale">Intégrale (4x4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prix">Prix (€)</Label>
                    <Input
                      id="prix"
                      type="number"
                      placeholder="Ex: 15000"
                      value={formData.prix}
                      onChange={(e) => handleChange("prix", e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/cars/${originalMatricule}`)}
                  disabled={saving}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
