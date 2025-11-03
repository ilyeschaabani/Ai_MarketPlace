import { Navbar } from "@/components/navbar";
import { AnnonceList } from "@/app/fraud_detection/AnnonceList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AnnoncesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">🚗 Annonces Disponibles</h1>
            <p className="text-muted-foreground">
              Toutes les annonces vérifiées par notre IA anti-fraude
            </p>
          </div>
          <Link href="/annonces/create">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Créer une Annonce
            </Button>
          </Link>
        </div>

        <AnnonceList />
      </div>
    </div>
  );
}