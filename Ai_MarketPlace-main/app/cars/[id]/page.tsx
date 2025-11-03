"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { voitureApiClient } from "@/lib/voiture-api-client"
import { generatePurchaseReasons } from "@/lib/groq-api"
import { findSimilarCars, getExternalRecommendations } from "@/lib/embedding-api-client"
import { Voiture, ExternalCarRecommendation } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Euro,
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
  Zap,
  Activity,
  Sparkles,
  MessageSquare
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function CarDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const matricule = params.id as string
  
  const [voiture, setVoiture] = useState<Voiture | null>(null)
  const [similarCars, setSimilarCars] = useState<Voiture[]>([])
  const [similarityScores, setSimilarityScores] = useState<Map<string, number>>(new Map())
  const [externalCars, setExternalCars] = useState<ExternalCarRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  
  // États pour l'IA Groq
  const [aiRecommendations, setAiRecommendations] = useState<string | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  useEffect(() => {
    if (matricule) {
      loadVoiture()
      loadSimilarCars()
      loadExternalRecommendations()
    }
  }, [matricule])

  const loadVoiture = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await voitureApiClient.getVoitureByMatricule(matricule)
      
      if (response.success && response.data && !Array.isArray(response.data)) {
        setVoiture(response.data)
      } else {
        setError("Voiture non trouvée")
      }
    } catch (err) {
      console.error("Erreur:", err)
      setError("Impossible de charger les détails de la voiture")
    } finally {
      setLoading(false)
    }
  }

  const loadSimilarCars = async () => {
    try {
      // Charger d'abord la voiture actuelle
      const response = await voitureApiClient.getVoitureByMatricule(matricule)
      
      if (response.success && response.data && !Array.isArray(response.data)) {
        const currentCar = response.data
        
        // Vérifier si la voiture a un embedding
        if (!currentCar.embedding) {
          console.warn("Voiture sans embedding, utilisation du fallback par marque")
          // Fallback: rechercher par marque si pas d'embedding
          const searchResponse = await voitureApiClient.searchVoitures({
            marque: currentCar.marque,
          })
          
          if (searchResponse.success && Array.isArray(searchResponse.data)) {
            const similar = searchResponse.data
              .filter((v) => v.matricule !== matricule)
              .slice(0, 3)
            setSimilarCars(similar)
          }
          return
        }

        // Parse l'embedding de la voiture actuelle
        const seedEmbedding = JSON.parse(currentCar.embedding) as number[]
        
        // Charger toutes les voitures pour construire les candidats
        const allCarsResponse = await voitureApiClient.getAllVoitures()
        
        if (allCarsResponse.success && Array.isArray(allCarsResponse.data)) {
          // Filtrer les voitures avec embedding et exclure la voiture actuelle
          const candidates = allCarsResponse.data
            .filter((v) => v.matricule !== matricule && v.embedding)
            .map((v) => ({
              id: v.matricule,
              embedding: JSON.parse(v.embedding!) as number[]
            }))
          
          if (candidates.length === 0) {
            console.warn("Aucun candidat avec embedding trouvé")
            setSimilarCars([])
            return
          }

          console.log("🚀 Calling embedding service with", candidates.length, "candidates")
          
          // Appeler le service d'embedding pour obtenir les voitures similaires
          const similarResults = await findSimilarCars(seedEmbedding, candidates, 3)
          
          // Créer une Map pour stocker les scores de similarité
          const scoresMap = new Map<string, number>()
          similarResults.forEach(result => {
            scoresMap.set(result.id, result.similarity)
          })
          setSimilarityScores(scoresMap)
          
          // Mapper les résultats aux objets Voiture complets
          const allCarsArray = Array.isArray(allCarsResponse.data) ? allCarsResponse.data : []
          const similarCarsData = similarResults
            .map((result) => {
              return allCarsArray.find((v: Voiture) => v.matricule === result.id)
            })
            .filter((v): v is Voiture => v !== undefined)
          
          setSimilarCars(similarCarsData)
        }
      }
    } catch (err) {
      console.error("Erreur lors du chargement des voitures similaires:", err)
      // En cas d'erreur, tenter le fallback par marque
      try {
        const response = await voitureApiClient.getVoitureByMatricule(matricule)
        if (response.success && response.data && !Array.isArray(response.data)) {
          const searchResponse = await voitureApiClient.searchVoitures({
            marque: response.data.marque,
          })
          if (searchResponse.success && Array.isArray(searchResponse.data)) {
            const similar = searchResponse.data
              .filter((v) => v.matricule !== matricule)
              .slice(0, 3)
            setSimilarCars(similar)
          }
        }
      } catch (fallbackErr) {
        console.error("Erreur lors du fallback:", fallbackErr)
      }
    }
  }

  const loadExternalRecommendations = async () => {
    try {
      // Récupérer la voiture actuelle pour obtenir son embedding
      const response = await voitureApiClient.getVoitureByMatricule(matricule)
      
      if (response.success && response.data && !Array.isArray(response.data)) {
        const currentCar = response.data
        
        // Vérifier si la voiture a un embedding
        if (!currentCar.embedding) {
          console.warn("⚠️ La voiture n'a pas d'embedding, impossible de charger les recommandations externes")
          return
        }

        // Parse l'embedding de la voiture actuelle
        const seedEmbedding = JSON.parse(currentCar.embedding) as number[]
        
        console.log("🌐 Fetching external recommendations with embedding of length:", seedEmbedding.length)
        
        // Appeler le service d'embedding pour obtenir les recommandations externes
        const externalResults = await getExternalRecommendations(seedEmbedding)
        
        console.log("✅ External recommendations received:", externalResults.length)
        
        setExternalCars(externalResults)
      }
    } catch (err) {
      console.error("💥 Erreur lors du chargement des recommandations externes:", err)
      // Ne pas afficher d'erreur à l'utilisateur, juste ne pas afficher la section
      setExternalCars([])
    }
  }

  const handleDelete = async () => {
    try {
      const response = await voitureApiClient.deleteVoiture(matricule)
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "La voiture a été supprimée avec succès",
        })
        router.push("/cars")
      } else {
        toast({
          title: "Erreur",
          description: response.message || "Impossible de supprimer la voiture",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setDeleteDialog(false)
    }
  }

  const handleGenerateRecommendations = async () => {
    if (!voiture) return;
    
    try {
      setLoadingAI(true);
      setAiError(null);
      
      const recommendations = await generatePurchaseReasons({
        marque: voiture.marque,
        modele: voiture.modele,
        annee: voiture.annee,
        prix: voiture.prix,
        puissance: voiture.puissance,
        carburant: voiture.carburant,
        transmission: voiture.transmission,
        cylindres: voiture.cylindres,
      });
      
      setAiRecommendations(recommendations);
      
      toast({
        title: "✨ Recommandations générées",
        description: "L'IA a analysé cette voiture avec succès",
      });
    } catch (error) {
      console.error('Erreur génération IA:', error);
      setAiError("Impossible de générer les recommandations. Veuillez réessayer.");
      toast({
        title: "Erreur IA",
        description: "Impossible de générer les recommandations",
        variant: "destructive",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement des détails...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !voiture) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="border-destructive">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Voiture non trouvée</h3>
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

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Button variant="ghost" onClick={() => router.push("/cars")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>

        {/* En-tête */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {voiture.marque} {voiture.modele}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-base">
                {voiture.matricule}
              </Badge>
              {voiture.annee && (
                <Badge variant="secondary">{voiture.annee}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/cars/${matricule}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button variant="outline" onClick={() => setDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prix */}
            {voiture.prix && (
              <Card className="border-primary">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Prix</p>
                      <p className="text-4xl font-bold text-primary">
                        {voiture.prix.toLocaleString()} €
                      </p>
                    </div>
                    <Euro className="h-16 w-16 text-primary/20" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Caractéristiques techniques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Caractéristiques Techniques
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                {voiture.puissance && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Puissance</p>
                      <p className="text-lg font-semibold">{voiture.puissance} CV</p>
                    </div>
                  </div>
                )}

                {voiture.cylindres && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cylindrée</p>
                      <p className="text-lg font-semibold">{voiture.cylindres} cm³</p>
                    </div>
                  </div>
                )}

                {voiture.carburant && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Fuel className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carburant</p>
                      <p className="text-lg font-semibold capitalize">{voiture.carburant}</p>
                    </div>
                  </div>
                )}

                {voiture.transmission && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="text-lg font-semibold capitalize">{voiture.transmission}</p>
                    </div>
                  </div>
                )}

                {voiture.traction && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Traction</p>
                      <p className="text-lg font-semibold capitalize">{voiture.traction}</p>
                    </div>
                  </div>
                )}

                {voiture.annee && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Année</p>
                      <p className="text-lg font-semibold">{voiture.annee}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section IA - Recommandations d'achat */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recommandations IA
                </CardTitle>
                <CardDescription>
                  Pourquoi acheter cette voiture ? Laissez l'IA vous convaincre !
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!aiRecommendations && !loadingAI && (
                  <div className="text-center py-4">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Découvrez des raisons convaincantes d'acheter cette voiture,
                      générées par notre IA
                    </p>
                    <Button 
                      onClick={handleGenerateRecommendations}
                      className="gap-2"
                      size="lg"
                    >
                      <Sparkles className="h-4 w-4" />
                      Générer les recommandations
                    </Button>
                  </div>
                )}

                {loadingAI && (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      L'IA analyse cette voiture...
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Cela peut prendre quelques secondes
                    </p>
                  </div>
                )}

                {aiError && (
                  <div className="text-center py-4">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
                    <p className="text-sm text-destructive mb-4">{aiError}</p>
                    <Button 
                      onClick={handleGenerateRecommendations}
                      variant="outline"
                      size="sm"
                    >
                      Réessayer
                    </Button>
                  </div>
                )}

                {aiRecommendations && !loadingAI && (
                  <div className="space-y-4">
                    <div 
                      className="ai-recommendations-container"
                      dangerouslySetInnerHTML={{ __html: aiRecommendations }}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleGenerateRecommendations}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Régénérer
                      </Button>
                      <Button 
                        onClick={() => setAiRecommendations(null)}
                        variant="ghost"
                        size="sm"
                      >
                        Effacer
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations de la base de données */}
            <Card>
              <CardHeader>
                <CardTitle>Informations système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {voiture.id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Base de données:</span>
                    <span className="font-medium">{voiture.id}</span>
                  </div>
                )}
                {voiture.date_creation && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date de création:</span>
                    <span className="font-medium">
                      {new Date(voiture.date_creation).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                {voiture.date_modification && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dernière modification:</span>
                    <span className="font-medium">
                      {new Date(voiture.date_modification).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Voitures similaires */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Voitures Similaires
                </CardTitle>
                <CardDescription>
                  {similarityScores.size > 0 
                    ? "Basées sur l'IA et les embeddings" 
                    : `Basées sur la marque ${voiture.marque}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarCars.length > 0 ? (
                  similarCars.map((similar) => (
                    <Card
                      key={similar.matricule}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/cars/${similar.matricule}`)}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold">
                              {similar.marque} {similar.modele}
                            </h4>
                            {similarityScores.has(similar.matricule) && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                <Sparkles className="h-3 w-3 mr-1" />
                                {(similarityScores.get(similar.matricule)! * 100).toFixed(1)}%
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{similar.annee || 'N/A'}</span>
                            {similar.prix && (
                              <span className="font-semibold text-primary">
                                {similar.prix.toLocaleString()} €
                              </span>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {similar.matricule}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Car className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune voiture similaire trouvée</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Note sur l'embedding */}
            {similarityScores.size > 0 && (
              <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1 text-foreground">IA Activée ✨</p>
                      <p className="text-muted-foreground">
                        Les voitures similaires sont calculées par intelligence artificielle 
                        en utilisant des embeddings vectoriels pour une correspondance optimale.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Marché Externe - Recommandations */}
            {externalCars.length > 0 && (
              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Marché Externe
                  </CardTitle>
                  <CardDescription>
                    Voitures similaires disponibles sur le marché
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {externalCars.map((car, index) => (
                    <Card
                      key={`${car.matricule}-${index}`}
                      className="border-green-500/10 hover:border-green-500/30 transition-all"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold">
                              {car.marque} {car.modele}
                            </h4>
                            <Badge variant="default" className="text-xs shrink-0 bg-green-600">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {(car.similarity * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {car.annee}
                            </div>
                            <div className="flex items-center gap-1">
                              <Gauge className="h-3 w-3" />
                              {car.puissance} CV
                            </div>
                            <div className="flex items-center gap-1">
                              <Fuel className="h-3 w-3" />
                              {car.carburant}
                            </div>
                            <div className="flex items-center gap-1">
                              <Settings className="h-3 w-3" />
                              {car.transmission}
                            </div>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {car.matricule}
                            </Badge>
                            {car.prix && (
                              <span className="font-bold text-green-600">
                                {car.prix.toLocaleString()} €
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Note sur les recommandations externes */}
                  <Card className="bg-gradient-to-br from-green-500/5 to-background border-green-500/20">
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Activity className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium mb-1 text-foreground">Marché Externe 🌐</p>
                          <p className="text-muted-foreground">
                            Ces recommandations proviennent d'un marché externe et sont calculées 
                            par IA pour vous proposer des alternatives similaires.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la voiture {voiture.marque} {voiture.modele} 
              (matricule: {voiture.matricule}) ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
