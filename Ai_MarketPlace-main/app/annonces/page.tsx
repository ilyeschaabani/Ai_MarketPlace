import { Navbar } from "@/components/navbar";
import { AnnonceList } from "@/app/fraud_detection/AnnonceList";

export default function AnnoncesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🚗 Annonces Disponibles</h1>
          <p className="text-muted-foreground">
            Toutes les annonces vérifiées par notre IA anti-fraude
          </p>
        </div>

        <AnnonceList />
      </div>
    </div>
  );
}