'use client';

import { useState, useEffect } from 'react';
import { annonceService } from '@/app/fraud_detection/annonceService';
import { AnnonceCard } from './AnnonceCard';
import type { Annonce } from '@/types/annonce';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AnnonceList() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnnonces();
  }, []);

  const loadAnnonces = async () => {
    try {
      setLoading(true);
      const result = await annonceService.getAllAnnonces();
      setAnnonces(result.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>❌ {error}</AlertDescription>
      </Alert>
    );
  }

  if (annonces.length === 0) {
    return (
      <div className="text-center py-12 bg-secondary/20 rounded-lg">
        <p className="text-muted-foreground text-lg">Aucune annonce disponible</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {annonces.map((annonce) => (
        <AnnonceCard 
          key={annonce.id} 
          annonce={annonce}
          onClick={() => console.log('View details:', annonce.id)}
        />
      ))}
    </div>
  );
}