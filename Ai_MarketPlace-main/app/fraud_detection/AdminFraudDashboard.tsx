'use client';

import { useState, useEffect } from 'react';
import { annonceService } from '@/app/fraud_detection/annonceService';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { Annonce } from '@/types/annonce';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';

export function AdminFraudDashboard() {
  const [fraudulentAnnonces, setFraudulentAnnonces] = useState<Annonce[]>([]);
  const [allAnnonces, setAllAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fraudResult, allResult] = await Promise.all([
        annonceService.getFraudulentAnnonces(),
        annonceService.getAdminAnnonces(),
      ]);
      setFraudulentAnnonces(fraudResult.data || []);
      setAllAnnonces(allResult.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: allAnnonces.length,
    fraudulent: fraudulentAnnonces.length,
    legitimate: allAnnonces.length - fraudulentAnnonces.length,
    fraudRate: allAnnonces.length > 0 
      ? ((fraudulentAnnonces.length / allAnnonces.length) * 100).toFixed(1)
      : '0',
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Annonces" value={stats.total} icon={<TrendingUp />} />
        <StatCard title="Frauduleuses" value={stats.fraudulent} variant="destructive" icon={<AlertTriangle />} />
        <StatCard title="Légitimes" value={stats.legitimate} variant="success" icon={<CheckCircle />} />
        <StatCard title="Taux de Fraude" value={`${stats.fraudRate}%`} variant="warning" icon={<Shield />} />
      </div>

      {/* Table */}
      <Tabs defaultValue="fraudulent">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fraudulent">
            🚨 Frauduleuses ({fraudulentAnnonces.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            📋 Toutes ({allAnnonces.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fraudulent">
          <AnnonceTable annonces={fraudulentAnnonces} />
        </TabsContent>

        <TabsContent value="all">
          <AnnonceTable annonces={allAnnonces} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ✅ FIXED: Properly typed StatCard component
type StatCardVariant = 'default' | 'destructive' | 'success' | 'warning';

interface StatCardProps {
  title: string;
  value: string | number;
  variant?: StatCardVariant;
  icon: React.ReactNode;
}

function StatCard({ title, value, variant = 'default', icon }: StatCardProps) {
  const variants: Record<StatCardVariant, string> = {
    default: 'bg-primary/10 text-primary',
    destructive: 'bg-destructive/10 text-destructive',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className={`${variants[variant]} p-3 rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnnonceTable({ annonces }: { annonces: Annonce[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Voiture</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Km</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Fraude</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Probabilité</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Niveau</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {annonces.map((annonce) => (
                <tr key={annonce.id} className={annonce.fraud_prediction === 1 ? 'bg-destructive/5' : ''}>
                  <td className="px-4 py-3 text-sm">{annonce.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{annonce.marque} {annonce.modele}</div>
                    <div className="text-xs text-muted-foreground">{annonce.matricule}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{annonce.odometer?.toLocaleString()} km</td>
                  <td className="px-4 py-3">
                    {annonce.fraud_prediction === 1 ? (
                      <Badge variant="destructive">OUI 🚨</Badge>
                    ) : (
                      <Badge variant="outline">NON ✅</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {annonce.fraud_probability ? `${(annonce.fraud_probability * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      annonce.fraud_level === 'high' ? 'destructive' :
                      annonce.fraud_level === 'medium' ? 'outline' : 'secondary'
                    }>
                      {annonce.fraud_level}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}