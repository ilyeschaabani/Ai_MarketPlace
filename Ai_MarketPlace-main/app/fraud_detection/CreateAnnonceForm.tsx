'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { annonceService } from '@/app/fraud_detection/annonceService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { Annonce, CreateAnnonceData } from '@/types/annonce';

interface CreateAnnonceFormProps {
  voitureId?: number;
}

export function CreateAnnonceForm({ voitureId }: CreateAnnonceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateAnnonceData>({
    id_voiture: voitureId || 0,
    odometer: 0,
    notRepairedDamage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fraudWarning, setFraudWarning] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFraudWarning(null);

    try {
      const result = await annonceService.createAnnonceWithAI(formData);

      if (result.fraud_detection) {
        const { is_fraud, probability, level } = result.fraud_detection;
        
        if (is_fraud || level === 'high') {
          setFraudWarning({
            type: 'error',
            message: `⚠️ FRAUDE DÉTECTÉE! Probabilité: ${(probability * 100).toFixed(1)}%`,
            level,
          });
        } else if (level === 'medium') {
          setFraudWarning({
            type: 'warning',
            message: `⚠️ Risque moyen (${(probability * 100).toFixed(1)}%)`,
            level,
          });
        } else {
          setFraudWarning({
            type: 'success',
            message: `✅ Annonce validée! Risque: ${(probability * 100).toFixed(1)}%`,
            level,
          });
        }
      }

      // Redirect after 2 seconds if not fraud
      if (!result.fraud_detection?.is_fraud) {
        setTimeout(() => router.push('/annonces'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🚗 Créer une annonce</CardTitle>
        <CardDescription>
          Remplissez les informations. Notre IA vérifiera automatiquement les données.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {fraudWarning && (
          <Alert className={`mb-4 ${
            fraudWarning.type === 'error' ? 'border-destructive bg-destructive/10' :
            fraudWarning.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
            'border-green-500 bg-green-50'
          }`}>
            {fraudWarning.type === 'error' && <XCircle className="h-4 w-4" />}
            {fraudWarning.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
            {fraudWarning.type === 'success' && <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{fraudWarning.message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="id_voiture">ID Voiture *</Label>
            <Input
              id="id_voiture"
              type="number"
              value={formData.id_voiture}
              onChange={(e) => setFormData({ ...formData, id_voiture: parseInt(e.target.value) })}
              required
              disabled={!!voitureId}
            />
          </div>

          <div>
            <Label htmlFor="odometer">Kilométrage (km) *</Label>
            <Input
              id="odometer"
              type="number"
              value={formData.odometer}
              onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value) })}
              required
              min="0"
              placeholder="Ex: 50000"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ⚠️ Kilométrage &gt;500 000 km sera détecté comme suspect
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notRepairedDamage"
              checked={formData.notRepairedDamage}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, notRepairedDamage: checked as boolean })
              }
            />
            <Label htmlFor="notRepairedDamage" className="cursor-pointer">
              Dommages non réparés
            </Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              '🔍 Créer et vérifier'
            )}
          </Button>
        </form>

        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">🤖 Détection automatique de fraude</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✓ Kilométrage suspect vérifié</li>
              <li>✓ Année du véhicule validée</li>
              <li>✓ Puissance moteur contrôlée</li>
              <li>✓ Cohérence des données analysée</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}