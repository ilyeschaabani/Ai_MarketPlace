"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Car, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Shield, Eye, MessageSquare } from "lucide-react"
import { getListings, mockUsers } from "@/lib/mock-data"
import type { CarListing } from "@/lib/types"
import { AdminFraudDashboard } from "@/app/fraud_detection/AdminFraudDashboard"

export default function AdminDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState<CarListing[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
    setListings(getListings())
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div>Chargement...</div>
  }

  const pendingListings = listings.filter((l) => l.status === "pending")
  const activeListings = listings.filter((l) => l.status === "active")
  const highRiskListings = listings.filter((l) => l.fraudScore && l.fraudScore > 30)
  const totalUsers = mockUsers.length

  const handleApprove = (listingId: string) => {
    // TODO: Approve listing
    console.log("[v0] Approving listing:", listingId)
  }

  const handleReject = (listingId: string) => {
    // TODO: Reject listing
    console.log("[v0] Rejecting listing:", listingId)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panneau d'Administration</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs, modérez les annonces et surveillez la plateforme
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Utilisateurs Totaux</CardDescription>
              <CardTitle className="text-3xl">{totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Actifs</span>
              </div>
            </CardContent>
          </Card>

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
                <span>À modérer</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Alertes Fraude</CardDescription>
              <CardTitle className="text-3xl">{highRiskListings.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Risque élevé</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fraud-detection" className="space-y-6">
          <TabsList>
            {/* ✅ NEW: AI Fraud Detection Tab */}
            <TabsTrigger value="fraud-detection" className="gap-2">
              <Shield className="h-4 w-4" />
              Détection IA
            </TabsTrigger>

            <TabsTrigger value="pending">
              En Attente
              {pendingListings.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="fraud">
              Alertes Fraude
              {highRiskListings.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {highRiskListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">Annonces Actives</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

          {/* ✅ NEW: AI Fraud Detection Tab Content */}
          <TabsContent value="fraud-detection">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Détection de Fraude avec Intelligence Artificielle
                </CardTitle>
                <CardDescription>
                  Système automatisé de détection basé sur l'apprentissage automatique (Machine Learning) pour identifier les annonces frauduleuses en temps réel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminFraudDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Listings */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Annonces en Attente de Modération</CardTitle>
                <CardDescription>Approuvez ou rejetez les nouvelles annonces</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingListings.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Aucune annonce en attente</h3>
                    <p className="text-muted-foreground">Toutes les annonces ont été modérées</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingListings.map((listing) => (
                      <div key={listing.id} className="flex gap-4 p-4 border rounded-lg">
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

                          {/* AI Analysis */}
                          <div className="flex items-center gap-4 mb-3">
                            {listing.fraudScore !== undefined && (
                              <Badge
                                variant={
                                  listing.fraudScore > 50
                                    ? "destructive"
                                    : listing.fraudScore > 25
                                      ? "secondary"
                                      : "default"
                                }
                                className="gap-1"
                              >
                                <Shield className="h-3 w-3" />
                                Fraude: {listing.fraudScore}%
                              </Badge>
                            )}
                            {listing.predictedPrice && (
                              <Badge variant="outline" className="gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Prix:{" "}
                                {(((listing.price - listing.predictedPrice) / listing.predictedPrice) * 100).toFixed(0)}
                                %
                              </Badge>
                            )}
                          </div>

                          {listing.fraudAlerts && listing.fraudAlerts.length > 0 && (
                            <div className="bg-destructive/10 p-3 rounded-md mb-3">
                              <p className="text-sm font-semibold text-destructive mb-1">Alertes:</p>
                              <ul className="text-sm text-destructive/80 space-y-1">
                                {listing.fraudAlerts.map((alert, i) => (
                                  <li key={i}>• {alert}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApprove(listing.id)} className="gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(listing.id)}
                              className="gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Rejeter
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                              <Eye className="h-4 w-4" />
                              Détails
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fraud Alerts */}
          <TabsContent value="fraud">
            <Card>
              <CardHeader>
                <CardTitle>Alertes de Fraude</CardTitle>
                <CardDescription>Annonces avec score de fraude élevé détecté par l'IA</CardDescription>
              </CardHeader>
              <CardContent>
                {highRiskListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Aucune alerte de fraude</h3>
                    <p className="text-muted-foreground">Toutes les annonces semblent authentiques</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {highRiskListings.map((listing) => (
                      <div key={listing.id} className="flex gap-4 p-4 border border-destructive/20 rounded-lg">
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
                                {listing.year} • {listing.mileage.toLocaleString()} km
                              </p>
                            </div>
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Risque: {listing.fraudScore}%
                            </Badge>
                          </div>

                          {listing.fraudAlerts && (
                            <div className="bg-destructive/10 p-3 rounded-md mb-3">
                              <p className="text-sm font-semibold text-destructive mb-1">Raisons:</p>
                              <ul className="text-sm text-destructive/80 space-y-1">
                                {listing.fraudAlerts.map((alert, i) => (
                                  <li key={i}>• {alert}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                              <Eye className="h-4 w-4" />
                              Examiner
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                              <MessageSquare className="h-4 w-4" />
                              Contacter Vendeur
                            </Button>
                            {listing.status === "pending" && (
                              <Button size="sm" variant="destructive" onClick={() => handleReject(listing.id)}>
                                Rejeter
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Listings */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Annonces Actives</CardTitle>
                <CardDescription>Toutes les annonces publiées sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeListings.map((listing) => (
                    <div key={listing.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="h-20 w-28 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={`/.jpg?height=80&width=112&query=${listing.brand} ${listing.model}`}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold mb-1">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {listing.price.toLocaleString()} TND • {listing.views} vues • {listing.favorites} favoris
                            </p>
                          </div>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Gérer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
                <CardDescription>Tous les utilisateurs de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {u.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{u.name}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={u.role === "admin" ? "default" : "secondary"} className="capitalize">
                          {u.role === "buyer" ? "Acheteur" : u.role === "seller" ? "Vendeur" : "Admin"}
                        </Badge>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Gérer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}