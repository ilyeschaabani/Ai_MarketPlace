"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Car, Loader2, Shield, Search, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { annonceService } from "@/app/fraud_detection/annonceService"
import { huggingFaceService } from "@/app/fraud_detection/HuggingFaceService"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CreateAnnonceData } from "@/types/annonce"

interface Voiture {
  id: number
  marque: string
  modele: string
  annee: number
  carburant: string
  matricule: string
}

interface AIAnalysis {
  isSuspicious: boolean
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  sentimentScore: number
  fraudScore: number
  redFlags: string[]
  recommendations: string[]
}

export default function CreateAnnoncePage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [loadingCars, setLoadingCars] = useState(true)
  const [analyzingDescription, setAnalyzingDescription] = useState(false)
  
  // Error and alerts
  const [error, setError] = useState("")
  const [fraudAlert, setFraudAlert] = useState<any>(null)
  
  // Data states
  const [voitures, setVoitures] = useState<Voiture[]>([])
  const [selectedVoiture, setSelectedVoiture] = useState<Voiture | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    id_voiture: "",
    odometer: "",
    prix: "",
    notRepairedDamage: "no",
    description: "",
  })

  // ✅ Use useRef to persist timer across renders
  const descriptionTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // ✅ Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (descriptionTimerRef.current) {
        clearTimeout(descriptionTimerRef.current)
      }
    }
  }, [])

  // ✅ Update selected voiture details
  const handleVoitureSelect = (voitureId: string) => {
    const voiture = voitures.find(v => v.id.toString() === voitureId)
    setSelectedVoiture(voiture || null)
    setFormData(prev => ({ ...prev, id_voiture: voitureId }))
  }

  // ✅ Handle form field changes
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ✅ Handle description change with FIXED debounced AI analysis
  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }))
    
    // ✅ Clear previous timer using ref
    if (descriptionTimerRef.current) {
      clearTimeout(descriptionTimerRef.current)
      descriptionTimerRef.current = null
    }
    
    // Reset analysis if too short
    if (value.length < 50) {
      setAiAnalysis(null)
      setAnalyzingDescription(false)
      return
    }
    
    // Show loading immediately
    setAnalyzingDescription(true)
    
    // ✅ Debounce: analyze after 1 second of no typing
    descriptionTimerRef.current = setTimeout(async () => {
      console.log('🔍 Starting AI analysis for:', value.substring(0, 50) + '...')
      
      try {
        const analysis = await huggingFaceService.analyzeDescription(value)
        
        if (analysis.success) {
          console.log('✅ AI analysis completed:', analysis.data)
          setAiAnalysis(analysis.data)
        } else {
          console.warn('⚠️ AI analysis failed:', analysis.error)
          setAiAnalysis(null)
        }
      } catch (error) {
        console.error('❌ AI analysis error:', error)
        setAiAnalysis(null)
      } finally {
        setAnalyzingDescription(false)
      }
    }, 1000) // 1 second delay
  }

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert("Vous devez être connecté pour créer une annonce")
      return
    }

    // ✅ Check AI warnings before submission
    if (aiAnalysis && aiAnalysis.fraudScore > 0.5) {
      const proceed = confirm(
        `⚠️ Notre IA a détecté des problèmes potentiels dans votre description:\n\n` +
        aiAnalysis.redFlags.join('\n') +
        `\n\nScore de fraude IA: ${(aiAnalysis.fraudScore * 100).toFixed(0)}%` +
        `\n\nVoulez-vous continuer quand même?`
      )
      if (!proceed) return
    }

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

      // ✅ Prepare data
      const annonceData: CreateAnnonceData = {
        id_voiture: parseInt(formData.id_voiture),
        odometer: parseInt(formData.odometer),
        prix: parseFloat(formData.prix),
        notRepairedDamage: formData.notRepairedDamage === "yes",
        description: formData.description || undefined,
      }

      console.log('Sending annonce data:', annonceData)

      // ✅ Call API with AI analysis
      const response = await annonceService.createAnnonceWithAI(
        annonceData,
        formData.description
      )

      console.log('Response:', response)

      if (response.success) {
        // ✅ Build success message with fraud detection results
        let message = '✅ Annonce créée avec succès!\n\n'
        
        // ML Fraud Detection
        if (response.data) {
          message += `🤖 Détection ML:\n`
          message += `  • Fraude détectée: ${response.data.fraud_prediction === 1 ? "Oui ⚠️" : "Non ✓"}\n`
          message += `  • Niveau de risque: ${response.data.fraud_level}\n`
          message += `  • Score de confiance: ${((1 - response.data.fraud_probability) * 100).toFixed(1)}%\n\n`
        }
        
        // AI Description Analysis
        if (response.aiAnalysis) {
          message += `🧠 Analyse IA Description:\n`
          message += `  • Score de fraude: ${(response.aiAnalysis.fraudScore * 100).toFixed(0)}%\n`
          message += `  • Sentiment: ${response.aiAnalysis.sentiment}\n`
          if (response.aiAnalysis.redFlags.length > 0) {
            message += `  • Alertes: ${response.aiAnalysis.redFlags.length}\n`
          }
          message += '\n'
        }
        
        // Combined Score
        if (response.combinedFraudScore !== undefined) {
          message += `📊 Score Combiné: ${((1 - response.combinedFraudScore) * 100).toFixed(1)}%`
        }

        // Check if fraud detected
        if (response.data?.fraud_prediction === 1) {
          setFraudAlert({
            level: response.data.fraud_level,
            probability: response.data.fraud_probability,
            prediction: response.data.fraud_prediction,
            aiAnalysis: response.aiAnalysis,
            combinedScore: response.combinedFraudScore,
          })
        } else {
          alert(message)
          router.push("/fraud_detection/annonces")
        }
      } else {
        setError(response.error || "Erreur lors de la création de l'annonce")
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
          <Link href="/fraud_detection/annonces">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour aux annonces
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Créer une Annonce</h1>
              <p className="text-muted-foreground">
                Sélectionnez une voiture et ajoutez les détails de l&apos;annonce
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
                <p className="text-sm font-medium">Protection Anti-Fraude IA Double</p>
                <p className="text-xs text-muted-foreground">
                  Votre annonce sera vérifiée par notre ML + analyse de description par Hugging Face AI
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
              <div className="space-y-3">
                <p className="font-semibold text-lg">⚠️ Alerte Fraude Détectée!</p>
                
                <div className="space-y-2 text-sm">
                  <p className="font-medium">🤖 Détection ML:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Niveau de risque: <strong>{fraudAlert.level}</strong></li>
                    <li>Probabilité de fraude: <strong>{(fraudAlert.probability * 100).toFixed(1)}%</strong></li>
                  </ul>
                </div>

                {fraudAlert.aiAnalysis && (
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">🧠 Analyse IA Description:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Score de fraude: <strong>{(fraudAlert.aiAnalysis.fraudScore * 100).toFixed(0)}%</strong></li>
                      {fraudAlert.aiAnalysis.redFlags.length > 0 && (
                        <li>Problèmes: <strong>{fraudAlert.aiAnalysis.redFlags.join(', ')}</strong></li>
                      )}
                    </ul>
                  </div>
                )}

                {fraudAlert.combinedScore !== undefined && (
                  <div className="text-sm pt-2 border-t">
                    <p>📊 Score Combiné: <strong>{((1 - fraudAlert.combinedScore) * 100).toFixed(1)}%</strong></p>
                  </div>
                )}

                <p className="text-sm mt-3 font-medium">
                  ⚠️ Cette annonce nécessite une révision manuelle par un administrateur.
                </p>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => router.push("/fraud_detection/annonces")}>
                    Voir mes annonces
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFraudAlert(null)}
                  >
                    Modifier l&apos;annonce
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
              <CardTitle>Informations de l&apos;Annonce</CardTitle>
              <CardDescription>
                Remplissez tous les champs requis avec précision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* SELECT CAR */}
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

                {/* SELECTED CAR DETAILS */}
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

                {/* ODOMETER */}
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
                </div>

                {/* PRICE */}
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
                </div>

                {/* DAMAGE */}
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
                </div>

                {/* DESCRIPTION - AI ANALYZED */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-muted-foreground">(optionnel - analysée par IA en temps réel)</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre voiture: état général, équipements, historique d'entretien, raison de la vente..."
                    value={formData.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formData.description.length} caractères {formData.description.length >= 50 ? '✓' : '(minimum 50 pour analyse IA)'}</span>
                    {analyzingDescription && (
                      <span className="flex items-center gap-2 text-primary">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analyse IA en cours...
                      </span>
                    )}
                  </div>
                </div>

                {/* AI ANALYSIS DISPLAY */}
                {aiAnalysis && (
                  <Card className={`border-2 ${
                    aiAnalysis.fraudScore > 0.7 ? 'border-red-500 bg-red-50 dark:bg-red-950/20' :
                    aiAnalysis.fraudScore > 0.4 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' :
                    'border-green-500 bg-green-50 dark:bg-green-950/20'
                  }`}>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5" />
                        🧠 Analyse IA de la Description (Temps Réel)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Fraud Score */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Score de Fraude</span>
                          <span className="text-sm font-bold">
                            {(aiAnalysis.fraudScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              aiAnalysis.fraudScore > 0.7 ? 'bg-red-500' :
                              aiAnalysis.fraudScore > 0.4 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${aiAnalysis.fraudScore * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Sentiment */}
                      <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <span className="text-sm font-medium">Sentiment</span>
                        <Badge variant={
                          aiAnalysis.sentiment === 'POSITIVE' ? 'default' : 
                          aiAnalysis.sentiment === 'NEGATIVE' ? 'destructive' : 
                          'secondary'
                        }>
                          {aiAnalysis.sentiment}
                        </Badge>
                      </div>

                      {/* Red Flags */}
                      {aiAnalysis.redFlags.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Problèmes Détectés:
                          </p>
                          <ul className="space-y-1">
                            {aiAnalysis.redFlags.map((flag: string, index: number) => (
                              <li key={index} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {aiAnalysis.recommendations.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <p className="text-sm font-medium flex items-center gap-2">
                            💡 Recommandations:
                          </p>
                          <ul className="space-y-1">
                            {aiAnalysis.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* All Clear */}
                      {aiAnalysis.redFlags.length === 0 && (
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 p-3 bg-background rounded-lg">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            ✅ Description semble légitime et bien rédigée
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading || !formData.id_voiture} 
                    className="flex-1"
                    size="lg"
                  >
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
                  <Link href="/fraud_detection/annonces">
                    <Button type="button" variant="outline" size="lg">
                      Annuler
                    </Button>
                  </Link>
                </div>

                {/* Help Text */}
                <p className="text-xs text-center text-muted-foreground pt-2">
                  En créant cette annonce, vous acceptez que vos données soient analysées par nos systèmes IA pour détecter les fraudes
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}