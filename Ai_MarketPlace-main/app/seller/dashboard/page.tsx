"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Car, Eye, Heart, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getUserListings } from "@/lib/mock-data"
import type { CarListing } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export default function SellerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState<CarListing[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "seller")) {
      router.push("/login")
    }
    if (user) {
      setListings(getUserListings(user.id))
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div>Chargement...</div>
  }

  const activeListings = listings.filter((l) => l.status === "active")
  const pendingListings = listings.filter((l) => l.status === "pending")
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0)
  const totalFavorites = listings.reduce((sum, l) => sum + l.favorites, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord Vendeur</h1>
            <p className="text-muted-foreground">Gérez vos annonces et suivez vos performances</p>
          </div>
          <Link href="/seller/listings/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nouvelle Annonce
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Annonces Actives</CardDescription>
              <CardTitle className="text-3xl">{activeListings.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="h-4 w-4" />
                <span>En ligne</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>En Attente</CardDescription>
              <CardTitle className="text-3xl">{pendingListings.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Modération</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Vues Totales</CardDescription>
              <CardTitle className="text-3xl">{totalViews}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Impressions</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Favoris</CardDescription>
              <CardTitle className="text-3xl">{totalFavorites}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span>Intéressés</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Mes Annonces</CardTitle>
            <CardDescription>Gérez et modifiez vos annonces de voitures</CardDescription>
          </CardHeader>
          <CardContent>
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Aucune annonce</h3>
                <p className="text-muted-foreground mb-4">Commencez par créer votre première annonce</p>
                <Link href="/seller/listings/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une Annonce
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-24 w-32 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={`/.jpg?height=96&width=128&query=${listing.brand} ${listing.model}`}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {listing.year} • {listing.mileage.toLocaleString()} km • {listing.fuelType}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-xl">{listing.price.toLocaleString()} TND</p>
                          {listing.predictedPrice && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Prédit: {listing.predictedPrice.toLocaleString()} TND
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {listing.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {listing.favorites}
                        </span>
                        <Badge
                          variant={
                            listing.status === "active"
                              ? "default"
                              : listing.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {listing.status === "active"
                            ? "Active"
                            : listing.status === "pending"
                              ? "En attente"
                              : listing.status === "sold"
                                ? "Vendue"
                                : "Rejetée"}
                        </Badge>
                        {listing.fraudScore && listing.fraudScore > 30 && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Alerte fraude: {listing.fraudScore}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/seller/listings/${listing.id}`}>
                          <Button size="sm" variant="outline">
                            Modifier
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost">
                          Voir l'annonce
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
