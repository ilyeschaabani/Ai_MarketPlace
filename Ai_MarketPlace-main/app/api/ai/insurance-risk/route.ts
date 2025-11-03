import { NextResponse } from "next/server"

// AI Model 6: Insurance Risk Analyzer (Ilyes chaabani)
export async function POST(request: Request) {
  try {
    const { brand, model, year, mileage, driverAge } = await request.json()

    // TODO: Implement actual insurance risk analysis
    // This is a placeholder for the Classification & Regression model
    const baseRisk = 50
    const yearRisk = (2024 - year) * 2
    const mileageRisk = mileage / 10000
    const ageRisk = driverAge < 25 ? 20 : driverAge > 60 ? 10 : 0

    const riskScore = Math.min(baseRisk + yearRisk + mileageRisk + ageRisk, 100)
    const riskCategory = riskScore > 70 ? "high" : riskScore > 40 ? "medium" : "low"
    const estimatedPremium = 500 + riskScore * 10

    return NextResponse.json({
      riskScore: Math.round(riskScore),
      riskCategory,
      estimatedPremium: Math.round(estimatedPremium),
      factors: [
        { factor: "Âge du véhicule", weight: yearRisk },
        { factor: "Kilométrage", weight: mileageRisk },
        { factor: "Âge du conducteur", weight: ageRisk },
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: "Risk analysis failed" }, { status: 500 })
  }
}
