"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, List, Eye, TrendingUp, Car, DollarSign, MessageSquare, Shield } from "lucide-react"
import Link from "next/link"

export default function SellerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "seller")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header with Quick Actions */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de Bord Vendeur</h1>
              <p className="text-muted-foreground">
                Bienvenue, {user.name}! Gérez vos annonces et suivez vos performances
              </p>
            </div>

            {/* ✅ NEW: Quick Action Buttons for Seller */}
            <div className="flex gap-3">
              <Link href="/annonces">
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Voir le Marché
                </Button>
              </Link>
              <Link href="/annonces/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Créer une Annonce
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Mes Annonces</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="h-4 w-4" />
                <span>Actives</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Vues Totales</CardDescription>
              <CardTitle className="text-3xl">2,543</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Messages</CardDescription>
              <CardTitle className="text-3xl">18</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>+5 aujourd'hui</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ventes Potentielles</CardDescription>
              <CardTitle className="text-3xl">45,000 TND</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Valeur totale</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/annonces/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Créer une Annonce</CardTitle>
                    <CardDescription>Publier une nouvelle voiture</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/annonces">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20 hover:border-secondary h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <List className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mes Annonces</CardTitle>
                    <CardDescription>Gérer vos publications</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/annonces">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-muted hover:border-muted-foreground/30 h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <Eye className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Voir le Marché</CardTitle>
                    <CardDescription>Explorer toutes les annonces</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* AI Fraud Detection Notice */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Intelligence Artificielle
            </CardTitle>
            <CardDescription>
              🤖 Toutes vos annonces sont automatiquement vérifiées par notre système IA pour détecter les fraudes et garantir la qualité du marché.
              <br />
              ✅ Vos annonces légitimes bénéficient d'une meilleure visibilité grâce à notre score de confiance.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Vos dernières annonces et interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Car className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">BMW Série 3 2020</p>
                  <p className="text-sm text-muted-foreground">Publiée il y a 2 jours • 45 vues</p>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">3 nouveaux messages</p>
                  <p className="text-sm text-muted-foreground">Pour votre Audi A4 2019</p>
                </div>
                <Button variant="outline" size="sm">Voir</Button>
              </div>
              <div className="flex items-center// filepath: d:\mmm\mmm\2025-2026 5SAE1\AI\Pojet AI\Ai_MarketPlace-main\app\seller\dashboard\page.tsx
"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, List, Eye, TrendingUp, Car, DollarSign, MessageSquare, Shield } from "lucide-react"
import Link from "next/link"

export default function SellerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "seller")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header with Quick Actions */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de Bord Vendeur</h1>
              <p className="text-muted-foreground">
                Bienvenue, {user.name}! Gérez vos annonces et suivez vos performances
              </p>
            </div>

            {/* ✅ NEW: Quick Action Buttons for Seller */}
            <div className="flex gap-3">
              <Link href="/annonces">
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Voir le Marché
                </Button>
              </Link>
              <Link href="/annonces/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Créer une Annonce
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Mes Annonces</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="h-4 w-4" />
                <span>Actives</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Vues Totales</CardDescription>
              <CardTitle className="text-3xl">2,543</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Messages</CardDescription>
              <CardTitle className="text-3xl">18</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>+5 aujourd'hui</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ventes Potentielles</CardDescription>
              <CardTitle className="text-3xl">45,000 TND</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Valeur totale</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/annonces/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Créer une Annonce</CardTitle>
                    <CardDescription>Publier une nouvelle voiture</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/annonces">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20 hover:border-secondary h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <List className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mes Annonces</CardTitle>
                    <CardDescription>Gérer vos publications</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/annonces">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-muted hover:border-muted-foreground/30 h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <Eye className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Voir le Marché</CardTitle>
                    <CardDescription>Explorer toutes les annonces</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* AI Fraud Detection Notice */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Intelligence Artificielle
            </CardTitle>
            <CardDescription>
              🤖 Toutes vos annonces sont automatiquement vérifiées par notre système IA pour détecter les fraudes et garantir la qualité du marché.
              <br />
              ✅ Vos annonces légitimes bénéficient d'une meilleure visibilité grâce à notre score de confiance.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Vos dernières annonces et interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Car className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">BMW Série 3 2020</p>
                  <p className="text-sm text-muted-foreground">Publiée il y a 2 jours • 45 vues</p>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">3 nouveaux messages</p>
                  <p className="text-sm text-muted-foreground">Pour votre Audi A4 2019</p>
                </div>
                <Button variant="outline" size="sm">Voir</Button>
              </div>
              <div className="flex items-center