"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { voitureApiClient } from "@/lib/voiture-api-client"
import { Voiture } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { 
  Car, 
  Plus, 
  Search, 
  Filter, 
  Euro,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Loader2,
  AlertCircle,
  Edit,
  Trash2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

export default function CarsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [voitures, setVoitures] = useState<Voiture[]>([])
  const [filteredVoitures, setFilteredVoitures] = useState<Voiture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("all")
  const [carburantFilter, setCarburantFilter] = useState("all")
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; matricule: string | null }>({
    open: false,
    matricule: null,
  })

  // Charger toutes les voitures au montage
  useEffect(() => {
    loadVoitures()
  }, [])

  // Filtrer les voitures
  useEffect(() => {
    let filtered = voitures

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.marque.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.modele.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtre par marque
    if (marqueFilter !== "all") {
      filtered = filtered.filter((v) => v.marque === marqueFilter)
    }

    // Filtre par carburant
    if (carburantFilter !== "all") {
      filtered = filtered.filter((v) => v.carburant === carburantFilter)
    }

    setFilteredVoitures(filtered)
  }, [searchQuery, marqueFilter, carburantFilter, voitures])

  const loadVoitures = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await voitureApiClient.getAllVoitures()
      
      if (response.success && Array.isArray(response.data)) {
        setVoitures(response.data)
        setFilteredVoitures(response.data)
      } else {
        setError("Impossible de charger les voitures")
      }
    } catch (err) {
      console.error("Erreur:", err)
      setError("Le backend n'est pas disponible. Assurez-vous que le serveur sur le port 5000 est démarré.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (matricule: string) => {
    try {
      const response = await voitureApiClient.deleteVoiture(matricule)
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "La voiture a été supprimée avec succès",
        })
        loadVoitures()
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
      setDeleteDialog({ open: false, matricule: null })
    }
  }

  const marques = Array.from(new Set(voitures.map((v) => v.marque).filter(Boolean)))
  const carburants = Array.from(new Set(voitures.map((v) => v.carburant).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement des voitures...</p>
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
              <h3 className="text-lg font-semibold mb-2">Erreur de connexion</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadVoitures}>Réessayer</Button>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des Voitures</h1>
            <p className="text-muted-foreground">
              Gérez votre inventaire de voitures connecté à MySQL
            </p>
          </div>
          <Button onClick={() => router.push("/cars/new")} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Ajouter une Voiture
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Voitures</CardDescription>
              <CardTitle className="text-3xl">{voitures.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Marques</CardDescription>
              <CardTitle className="text-3xl">{marques.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Résultats</CardDescription>
              <CardTitle className="text-3xl">{filteredVoitures.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Prix Moyen</CardDescription>
              <CardTitle className="text-3xl">
                {voitures.length > 0
                  ? Math.round(
                      voitures.reduce((sum, v) => sum + (v.prix || 0), 0) / voitures.length
                    ).toLocaleString()
                  : 0}€
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par matricule, marque, modèle..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={marqueFilter} onValueChange={setMarqueFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les marques" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les marques</SelectItem>
                  {marques.map((marque) => (
                    <SelectItem key={marque} value={marque}>
                      {marque}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={carburantFilter} onValueChange={setCarburantFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les carburants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les carburants</SelectItem>
                  {carburants.map((carburant) => (
                    <SelectItem key={carburant || 'unknown'} value={carburant || ''}>
                      {carburant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des voitures */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVoitures.map((voiture) => (
            <Card key={voiture.matricule} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {voiture.marque} {voiture.modele}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="outline">{voiture.matricule}</Badge>
                    </CardDescription>
                  </div>
                  <Car className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {voiture.annee && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{voiture.annee}</span>
                  </div>
                )}

                {voiture.puissance && (
                  <div className="flex items-center gap-2 text-sm">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span>{voiture.puissance} CV</span>
                  </div>
                )}

                {voiture.carburant && (
                  <div className="flex items-center gap-2 text-sm">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{voiture.carburant}</span>
                  </div>
                )}

                {voiture.transmission && (
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{voiture.transmission}</span>
                  </div>
                )}

                {voiture.prix && (
                  <div className="flex items-center gap-2 text-lg font-bold text-primary pt-2">
                    <Euro className="h-5 w-5" />
                    <span>{voiture.prix.toLocaleString()} €</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/cars/${voiture.matricule}`)}
                >
                  Détails
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push(`/cars/${voiture.matricule}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteDialog({ open: true, matricule: voiture.matricule })}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Message si aucune voiture */}
        {filteredVoitures.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune voiture trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {voitures.length === 0
                  ? "Commencez par ajouter votre première voiture"
                  : "Essayez de modifier vos critères de recherche"}
              </p>
              {voitures.length === 0 && (
                <Button onClick={() => router.push("/cars/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une Voiture
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, matricule: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la voiture avec le matricule {deleteDialog.matricule} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.matricule && handleDelete(deleteDialog.matricule)}
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
