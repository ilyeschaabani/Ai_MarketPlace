"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { getListingById } from "@/lib/mock-data"
import type { CarListing } from "@/lib/types"

export default function EditListingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [listing, setListing] = useState<CarListing | null>(null)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "seller")) {
      router.push("/login")
    }
    if (params.id) {
      const found = getListingById(params.id as string)
      if (found) {
        setListing(found)
      }
    }
  }, [user, isLoading, router, params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Update listing
    router.push("/seller/dashboard")
  }

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce?")) {
      // TODO: Delete listing
      router.push("/seller/dashboard")
    }
  }

  if (isLoading || !user || !listing) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/seller/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Modifier l'Annonce</h1>
              <p className="text-muted-foreground">Mettez à jour les détails de votre véhicule</p>
            </div>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de Base</CardTitle>
              <CardDescription>Détails essentiels du véhicule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce</Label>
                <Input id="title" defaultValue={listing.title} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marque</Label>
                  <Select defaultValue={listing.brand}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Peugeot">Peugeot</SelectItem>
                      <SelectItem value="Renault">Renault</SelectItem>
                      <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="Citroën">Citroën</SelectItem>
                      <SelectItem value="Fiat">Fiat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modèle</Label>
                  <Input id="model" defaultValue={listing.model} required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Input id="year" type="number" defaultValue={listing.year} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Kilométrage</Label>
                  <Input id="mileage" type="number" defaultValue={listing.mileage} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix (TND)</Label>
                <Input id="price" type="number" defaultValue={listing.price} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>Décrivez votre véhicule en détail</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea defaultValue={listing.description} rows={6} required />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Link href="/seller/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Annuler
              </Button>
            </Link>
            <Button type="submit" className="flex-1">
              Enregistrer les Modifications
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
