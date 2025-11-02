"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { voitureApiClient } from "@/lib/voiture-api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { 
  ArrowLeft,
  Save,
  Loader2,
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

export default function NewCarPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
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
      setLoading(true)

      // Préparer les données pour l'API
      const voitureData = {
        matricule: formData.matricule,
        marque: formData.marque,
        modele: formData.modele,
        annee: formData.annee ? parseInt(formData.annee) : null,
        puissance: formData.puissance ? parseFloat(formData.puissance) : null,
        cylindres: formData.cylindres ? parseFloat(formData.cylindres) : null,
        carburant: formData.carburant || null,
        transmission: formData.transmission || null,
        traction: formData.traction || null,
        prix: formData.prix ? parseFloat(formData.prix) : null,
      }

      const response = await voitureApiClient.createVoiture(voitureData)

      if (response.success) {
        toast({
          title: "Succès",
          description: "La voiture a été ajoutée avec succès",
        })
        router.push("/cars")
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Impossible d'ajouter la voiture",
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
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Navigation */}
        <Button variant="ghost" onClick={() => router.push("/cars")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Ajouter une Voiture</h1>
          </div>
          <p className="text-muted-foreground">
            Remplissez les informations pour ajouter une nouvelle voiture à la base de données
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
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Ajouter la voiture
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/cars")}
                  disabled={loading}
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
