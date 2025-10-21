"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, Sparkles, TrendingUp, Shield, MessageSquare } from "lucide-react"
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trouver Votre Voiture</h1>
          <p className="text-muted-foreground">Parcourez notre sélection de voitures d'occasion vérifiées par IA</p>
        </div>

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
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredListings.length} {filteredListings.length === 1 ? "voiture trouvée" : "voitures trouvées"}
          </p>
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
                {listing.fraudScore !== undefined && listing.fraudScore < 20 && (
                  <Badge className="absolute top-3 left-3 gap-1 bg-chart-3 text-white">
                    <Shield className="h-3 w-3" />
                    Vérifié
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
                {listing.predictedPrice &&
                  Math.abs(listing.price - listing.predictedPrice) / listing.predictedPrice > 0.1 && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="text-muted-foreground">
                        Prix prédit: {listing.predictedPrice.toLocaleString()} TND
                        {listing.price < listing.predictedPrice && (
                          <Badge variant="secondary" className="ml-2 bg-chart-3/10 text-chart-3">
                            Bonne affaire
                          </Badge>
                        )}
                      </span>
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
