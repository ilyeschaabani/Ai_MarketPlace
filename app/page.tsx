import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Car, TrendingUp, Shield, Users, MessageSquare, BarChart3, Sparkles, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Propulsé par l'Intelligence Artificielle
          </div>
          <h1 className="text-5xl font-bold mb-6 text-balance">La Marketplace Intelligente pour Voitures d'Occasion</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Achetez et vendez des voitures d'occasion en toute confiance avec notre plateforme alimentée par l'IA
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/buyer/dashboard">
              <Button size="lg" className="gap-2">
                <Car className="h-5 w-5" />
                Trouver une Voiture
              </Button>
            </Link>
            <Link href="/seller/dashboard">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <TrendingUp className="h-5 w-5" />
                Vendre ma Voiture
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Fonctionnalités IA Avancées</h2>
          <p className="text-muted-foreground text-lg">Six modèles d'IA pour une expérience optimale</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Analyse Automatique</h3>
              <p className="text-muted-foreground text-sm">
                Analyse intelligente des annonces avec vision par ordinateur et NLP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Prédiction de Prix</h3>
              <p className="text-muted-foreground text-sm">Estimation précise du prix basée sur le machine learning</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Détection de Fraude</h3>
              <p className="text-muted-foreground text-sm">Protection contre les arnaques avec détection d'anomalies</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Matching Intelligent</h3>
              <p className="text-muted-foreground text-sm">Recommandations personnalisées acheteur-vendeur</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Assistant Virtuel</h3>
              <p className="text-muted-foreground text-sm">Chatbot intelligent pour répondre à vos questions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-chart-5/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-chart-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Analyse Assurance</h3>
              <p className="text-muted-foreground text-sm">Évaluation du risque et estimation des primes d'assurance</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à Commencer?</h2>
            <p className="text-lg mb-6 opacity-90">
              Rejoignez des milliers d'utilisateurs qui font confiance à notre plateforme
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Créer un Compte Gratuit
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
