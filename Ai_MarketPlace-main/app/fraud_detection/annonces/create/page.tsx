import { Navbar } from "@/components/navbar";
import { CreateAnnonceForm } from "@/app/fraud_detection/CreateAnnonceForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateAnnoncePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/annonces">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux annonces
            </Button>
          </Link>
        </div>

        <CreateAnnonceForm />
      </div>
    </div>
  );
}