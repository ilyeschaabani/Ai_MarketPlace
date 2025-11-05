import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, DollarSign, AlertTriangle } from "lucide-react"

interface InsuranceCardProps {
  riskScore?: number | null
  insuranceCost?: number | null
  riskLevel?: string | null
  className?: string
}

export function InsuranceCard({ riskScore, insuranceCost, riskLevel, className }: InsuranceCardProps) {
  // If no insurance data available
  if (riskScore == null || insuranceCost == null) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Estimation d'Assurance
          </CardTitle>
          <CardDescription>Données non disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            L'analyse du risque d'assurance n'est pas disponible pour cette annonce.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Determine badge color based on risk level
  const getRiskBadgeVariant = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "default" // green
      case "medium":
        return "secondary" // yellow
      case "high":
        return "destructive" // red
      default:
        return "outline"
    }
  }

  const getRiskIcon = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case "low":
        return <Shield className="h-4 w-4 text-green-600" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Estimation d'Assurance
        </CardTitle>
        <CardDescription>Analyse basée sur l'IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Score */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Score de Risque</p>
            <p className="text-2xl font-bold">{riskScore.toFixed(3)}</p>
          </div>
          <Badge variant={getRiskBadgeVariant(riskLevel)} className="gap-1">
            {getRiskIcon(riskLevel)}
            {riskLevel ? riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1) : "N/A"}
          </Badge>
        </div>

        {/* Insurance Cost */}
        <div className="space-y-1 border-t pt-4">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Prime Estimée
          </p>
          <p className="text-2xl font-bold text-primary">
            {insuranceCost.toFixed(2)} TND
            <span className="text-sm font-normal text-muted-foreground">/an</span>
          </p>
        </div>

        {/* Info Text */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
          💡 Cette estimation est calculée par intelligence artificielle et peut varier selon votre assureur.
        </div>
      </CardContent>
    </Card>
  )
}
