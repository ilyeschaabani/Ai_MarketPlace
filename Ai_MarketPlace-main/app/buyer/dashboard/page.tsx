"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, Sparkles, TrendingUp, Shield, MessageSquare, Eye, List } from "lucide-react"
import { getListings } from "@/lib/mock-data"
import type { CarListing } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function BuyerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState<CarListing[]>([])
  const [filteredListings, setFilteredListings] = useState<CarListing[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [brandFilter, setBrandFilter] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "buyer")) {
      router.push("/login")
    }
    const activeListings = getListings("active")
    setListings(activeListings)
    setFilteredListings(activeListings)
  }, [user, isLoading, router])

  useEffect(() => {
    let filtered = listings

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.model.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Brand filter
    if (brandFilter !== "all") {
      filtered = filtered.filter((l) => l.brand === brandFilter)
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((l) => l.price >= min && (max ? l.price <= max : true))
    }

    setFilteredListings(filtered)
  }, [searchQuery, brandFilter, priceRange, listings])

  if (isLoading || !user) {
    return <div>Chargement...</div>
  }

  const brands = Array.from(new Set(listings.map((l) => l.brand)))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* ✅ NEW: Header with Quick Actions */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Trouver Votre Voiture</h1>
              <p className="text-muted-foreground">
                Bienvenue, {user.name}! Parcourez notre sélection de voitures d'occasion vérifiées par IA
              </p>
            </div>

            {/* ✅ NEW: Quick Action Buttons */}
            <div className="flex gap-3">
              <Link href="/annonces">
                <Button variant="outline" className="gap-2">
                  <List className="h-4 w-4" />
                  Toutes les Annonces
                </Button>
              </Link>
              <Button className="gap-2">
                <Heart className="h-4 w-4" />
                Mes Favoris (8)
              </Button>
            </div>
          </div>
        </div>

        {/* ✅ NEW: AI Protection Notice */}
        <Card className="mb-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-green-800 dark:text-green-200">
                  Protection Anti-Fraude IA Activée
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  🤖 Toutes les annonces sont automatiquement vérifiées par notre intelligence artificielle. 
                  Achetez en toute confiance avec notre système de détection avancé basé sur le Machine Learning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations Banner */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Recommandations IA Personnalisées</h3>
                <p className="text-sm text-muted-foreground">
                  Basées sur vos préférences et votre historique de recherche
                </p>
              </div>
              <Button>Voir les Recommandations</Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par marque, modèle..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les marques" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les marques</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prix</SelectItem>
                  <SelectItem value="0-20000">Moins de 20,000 TND</SelectItem>
                  <SelectItem value="20000-30000">20,000 - 30,000 TND</SelectItem>
                  <SelectItem value="30000-40000">30,000 - 40,000 TND</SelectItem>
                  <SelectItem value="40000-0">Plus de 40,000 TND</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {filteredListings.length} {filteredListings.length === 1 ? "voiture trouvée" : "voitures trouvées"}
          </p>
          {/* ✅ NEW: View All Link */}
          <Link href="/annonces">
            <Button variant="link" className="gap-2">
              <Eye className="h-4 w-4" />
              Voir toutes les annonces
            </Button>
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <img
                  src={`/.jpg?height=192&width=384&query=${listing.brand} ${listing.model}`}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.preventDefault()
                    // TODO: Toggle favorite
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                
                {/* ✅ ENHANCED: AI Verification Badge */}
                {listing.fraudScore !== undefined && listing.fraudScore < 20 && (
                  <Badge className="absolute top-3 left-3 gap-1 bg-green-500 text-white hover:bg-green-600">
                    <Shield className="h-3 w-3" />
                    Vérifié IA
                  </Badge>
                )}
                {listing.fraudScore !== undefined && listing.fraudScore >= 20 && listing.fraudScore < 50 && (
                  <Badge className="absolute top-3 left-3 gap-1 bg-yellow-500 text-white hover:bg-yellow-600">
                    <Shield className="h-3 w-3" />
                    Attention
                  </Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-xl whitespace-nowrap">{listing.price.toLocaleString()} TND</p>
                  </div>
                </div>
                <CardDescription className="line-clamp-1">
                  {listing.year} • {listing.mileage.toLocaleString()} km • {listing.fuelType}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* ✅ ENHANCED: AI Price Analysis */}
                {listing.predictedPrice &&
                  Math.abs(listing.price - listing.predictedPrice) / listing.predictedPrice > 0.1 && (
                    <div className="flex items-center gap-2 text-sm p-2 bg-accent/10 rounded-md">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="text-muted-foreground flex-1">
                        Prix IA: {listing.predictedPrice.toLocaleString()} TND
                      </span>
                      {listing.price < listing.predictedPrice && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                          Bonne affaire
                        </Badge>
                      )}
                    </div>
                  )}

                {/* ✅ ENHANCED: Trust Score */}
                {listing.fraudScore !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Score de confiance:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            listing.fraudScore < 20 ? 'bg-green-500' :
                            listing.fraudScore < 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${100 - listing.fraudScore}%` }}
                        />
                      </div>
                      <span className="font-semibold">
                        {(100 - listing.fraudScore).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/buyer/listings/${listing.id}`} className="flex-1">
                    <Button className="w-full">Voir Détails</Button>
                  </Link>
                  <Button size="icon" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Aucune voiture trouvée</h3>
              <p className="text-muted-foreground mb-4">Essayez de modifier vos filtres de recherche</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setBrandFilter("all")
                  setPriceRange("all")
                }}
              >
                Réinitialiser les Filtres
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}