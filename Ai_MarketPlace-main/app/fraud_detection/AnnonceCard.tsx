'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Annonce } from "@/types/annonce";
import { Calendar, Gauge, Fuel, Settings } from "lucide-react";

interface AnnonceCardProps {
  annonce: Annonce;
  onClick?: () => void;
}

export function AnnonceCard({ annonce, onClick }: AnnonceCardProps) {
  const getFraudBadge = () => {
    if (annonce.fraud_prediction === 1) {
      return <Badge variant="destructive">🚨 Fraude détectée</Badge>;
    }
    if (annonce.fraud_level === 'medium') {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">⚠️ Risque moyen</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-700">✅ Vérifié</Badge>;
  };

  const trustScore = annonce.fraud_probability !== null 
    ? ((1 - annonce.fraud_probability) * 100).toFixed(1)
    : null;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{annonce.marque} {annonce.modele}</h3>
            <p className="text-sm text-muted-foreground">{annonce.matricule}</p>
          </div>
          {getFraudBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{annonce.annee}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span>{annonce.odometer?.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span>{annonce.carburant}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>{annonce.transmission}</span>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="text-2xl font-bold text-primary">
            {annonce.prix?.toLocaleString()} €
          </div>
        </div>

        {/* Trust Score */}
        {trustScore && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Score de confiance</span>
              <span className="font-semibold">{trustScore}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  annonce.fraud_level === 'low' ? 'bg-green-500' :
                  annonce.fraud_level === 'medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${trustScore}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant="outline">
          Voir les détails
        </Button>
      </CardFooter>
    </Card>
  );
}