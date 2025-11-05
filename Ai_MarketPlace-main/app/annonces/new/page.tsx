"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { annonceApiClient } from "@/lib/annonce-api-client"
import { voitureApiClient } from "@/lib/voiture-api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { 
  ArrowLeft,
  Save,
  Loader2,
  Car,
  FileText,
  DollarSign,
  MapPin,
  Gauge,
  Shield,
  AlertTriangle,
  Sparkles
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NewAnnoncePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [voitures, setVoitures] = useState<any[]>([])
  const [selectedVoiture, setSelectedVoiture] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    voiture_id: "",
    vendeur_id: "1", // Default pour les tests - à remplacer par l'ID de l'utilisateur connecté
    prix: "",
    description: "",
    kilometrage: "",
    etat: "bon",
    localisation: "",
    number_of_accidents: "0",
    years_of_experience: "5",
  })

  const [analysisResult, setAnalysisResult] = useState<{
    fraud?: {
      fraud_score: number;
      risk_level: string;
      indicators: string[];
    };
    insurance?: {
      riskScore: number;
      insuranceCost: number;
      riskLevel: string;
    };
  } | null>(null)

  // Charger les voitures disponibles au chargement de la page
  useEffect(() => {
    loadVoitures()
  }, [])

  const loadVoitures = async () => {
    try {
      const response = await voitureApiClient.getAllVoitures()
      if (response.success && response.data) {
        setVoitures(Array.isArray(response.data) ? response.data : [response.data])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des voitures:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des voitures",
        variant: "destructive",
      })
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Si on change la voiture sélectionnée, charger ses détails
    if (field === "voiture_id") {
      const voiture = voitures.find(v => v.id.toString() === value)
      setSelectedVoiture(voiture)
      
      // Pré-remplir certains champs si la voiture a des informations
      if (voiture) {
        setFormData(prev => ({
          ...prev,
          prix: voiture.prix?.toString() || prev.prix,
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.voiture_id || !formData.prix || !formData.kilometrage || !formData.description) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    // Validation du prix
    const prix = parseFloat(formData.prix)
    if (isNaN(prix) || prix <= 0) {
      toast({
        title: "Erreur de validation",
        description: "Le prix doit être un nombre positif",
        variant: "destructive",
      })
      return
    }

    // Validation du kilométrage
    const kilometrage = parseInt(formData.kilometrage)
    if (isNaN(kilometrage) || kilometrage < 0) {
      toast({
        title: "Erreur de validation",
        description: "Le kilométrage doit être un nombre positif",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      setAnalyzing(true)

      // Préparer les données pour l'API
      const annonceData = {
        id_voiture: parseInt(formData.voiture_id),
        id_vendeur: parseInt(formData.vendeur_id),
        prix: prix,
        description: formData.description,
        kilometrage: kilometrage,
        etat: formData.etat,
        localisation: formData.localisation || null,
        number_of_accidents: parseInt(formData.number_of_accidents),
        years_of_experience: parseInt(formData.years_of_experience),
      }

      console.log('Envoi de l\'annonce:', annonceData)

      // Créer l'annonce (déclenche automatiquement fraud detection + insurance risk)
      const response = await annonceApiClient.createAnnonce(annonceData)

      if (response.success) {
        // Stocker les résultats de l'analyse
        setAnalysisResult({
          fraud: response.fraud_analysis,
          insurance: response.insurance_analysis,
        })

        toast({
          title: "✅ Annonce créée avec succès!",
          description: (
            <div className="space-y-1">
              <p>Votre annonce a été créée et analysée par nos IA.</p>
              {response.fraud_analysis && (
                <p className="text-xs">🔍 Score de fraude: {response.fraud_analysis.fraud_score.toFixed(2)} ({response.fraud_analysis.risk_level})</p>
              )}
              {response.insurance_analysis && (
                <p className="text-xs">🛡️ Prime d'assurance: {response.insurance_analysis.insuranceCost.toFixed(2)} TND</p>
              )}
            </div>
          ),
        })

        // Redirection après 3 secondes pour voir les résultats
        setTimeout(() => {
          router.push("/test-insurance")
        }, 3000)
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Impossible de créer l'annonce",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error('Erreur:', err)
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la création de l'annonce",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <Button variant="ghost" onClick={() => router.push("/test-insurance")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Créer une Annonce</h1>
          </div>
          <p className="text-muted-foreground">
            Créez une nouvelle annonce de voiture. L'analyse de fraude et le calcul de l'assurance seront effectués automatiquement.
          </p>
        </div>

        {/* Alerte d'information */}
        <Alert className="mb-6">
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <strong>IA automatique :</strong> Lors de la création, nos systèmes IA analyseront automatiquement votre annonce pour détecter les fraudes et calculer le risque d'assurance.
          </AlertDescription>
        </Alert>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          {/* Sélection de la voiture */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Sélection de la voiture
              </CardTitle>
              <CardDescription>
                Choisissez la voiture pour cette annonce
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voiture_id">
                  Voiture <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.voiture_id}
                  onValueChange={(value) => handleChange("voiture_id", value)}
                >
                  <SelectTrigger id="voiture_id">
                    <SelectValue placeholder="Sélectionnez une voiture" />
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
                {voitures.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Aucune voiture trouvée.{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => router.push("/cars/new")}
                    >
                      Créer une voiture d'abord
                    </Button>
                  </p>
                )}
              </div>

              {/* Aperçu de la voiture sélectionnée */}
              {selectedVoiture && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-semibold">Détails de la voiture</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Marque:</span>{" "}
                      <span className="font-medium">{selectedVoiture.marque}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Modèle:</span>{" "}
                      <span className="font-medium">{selectedVoiture.modele}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Année:</span>{" "}
                      <span className="font-medium">{selectedVoiture.annee}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Prix catalogue:</span>{" "}
                      <span className="font-medium">{selectedVoiture.prix} TND</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Détails de l'annonce */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Détails de l'annonce
              </CardTitle>
              <CardDescription>
                Informations sur le prix et l'état
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prix">
                    Prix de vente (TND) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prix"
                    type="number"
                    placeholder="Ex: 45000"
                    value={formData.prix}
                    onChange={(e) => handleChange("prix", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kilometrage">
                    Kilométrage (km) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="kilometrage"
                    type="number"
                    placeholder="Ex: 75000"
                    value={formData.kilometrage}
                    onChange={(e) => handleChange("kilometrage", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="etat">État du véhicule</Label>
                  <Select
                    value={formData.etat}
                    onValueChange={(value) => handleChange("etat", value)}
                  >
                    <SelectTrigger id="etat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="bon">Bon</SelectItem>
                      <SelectItem value="moyen">Moyen</SelectItem>
                      <SelectItem value="a_renover">À rénover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localisation">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Localisation
                  </Label>
                  <Input
                    id="localisation"
                    placeholder="Ex: Tunis, Sfax, Sousse..."
                    value={formData.localisation}
                    onChange={(e) => handleChange("localisation", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez la voiture, son historique, ses équipements..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={5}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Plus la description est détaillée, plus l'analyse de fraude sera précise
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informations pour l'assurance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Informations pour le calcul d'assurance
              </CardTitle>
              <CardDescription>
                Ces informations permettent à notre IA de calculer le risque d'assurance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number_of_accidents">
                    <AlertTriangle className="inline h-4 w-4 mr-1" />
                    Nombre d'accidents
                  </Label>
                  <Input
                    id="number_of_accidents"
                    type="number"
                    min="0"
                    placeholder="Ex: 0, 1, 2..."
                    value={formData.number_of_accidents}
                    onChange={(e) => handleChange("number_of_accidents", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nombre d'accidents impliquant ce véhicule
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_of_experience">
                    <Gauge className="inline h-4 w-4 mr-1" />
                    Années d'expérience du conducteur
                  </Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    min="0"
                    placeholder="Ex: 5"
                    value={formData.years_of_experience}
                    onChange={(e) => handleChange("years_of_experience", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nombre d'années d'expérience de conduite
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/test-insurance")}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading || voitures.length === 0} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {analyzing ? "Analyse en cours par les IA..." : "Création en cours..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer l'annonce et analyser
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Résultats de l'analyse (affichés après création) */}
        {analysisResult && (
          <Card className="mt-6 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Résultats de l'analyse IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Analyse de fraude */}
              {analysisResult.fraud && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Analyse de fraude
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      Score: <strong>{analysisResult.fraud.fraud_score.toFixed(2)}</strong>
                    </p>
                    <p>
                      Niveau de risque:{" "}
                      <span
                        className={`font-semibold ${
                          analysisResult.fraud.risk_level === "low"
                            ? "text-green-600"
                            : analysisResult.fraud.risk_level === "medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {analysisResult.fraud.risk_level}
                      </span>
                    </p>
                    {analysisResult.fraud.indicators && analysisResult.fraud.indicators.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Indicateurs:</p>
                        <ul className="list-disc list-inside ml-2">
                          {analysisResult.fraud.indicators.map((indicator, idx) => (
                            <li key={idx}>{indicator}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Analyse d'assurance */}
              {analysisResult.insurance && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Analyse d'assurance
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      Score de risque: <strong>{analysisResult.insurance.riskScore.toFixed(3)}</strong>
                    </p>
                    <p>
                      Prime annuelle:{" "}
                      <strong className="text-lg">{analysisResult.insurance.insuranceCost.toFixed(2)} TND</strong>
                    </p>
                    <p>
                      Niveau de risque:{" "}
                      <span
                        className={`font-semibold ${
                          analysisResult.insurance.riskLevel === "low"
                            ? "text-green-600"
                            : analysisResult.insurance.riskLevel === "medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {analysisResult.insurance.riskLevel}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
