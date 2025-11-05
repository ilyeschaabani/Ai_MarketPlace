import { NextResponse } from "next/server"

// AI Model 6: Insurance Risk Analyzer (Ilyes chaabani)
// Integrated with Flask microservice at http://localhost:5002
export async function POST(request: Request) {
  try {
    const { carYear, carValue, numberOfAccidents, yearsOfExperience } = await request.json()

    // Validate required fields
    if (!carYear || !carValue || numberOfAccidents == null || yearsOfExperience == null) {
      return NextResponse.json(
        { error: "Missing required fields: carYear, carValue, numberOfAccidents, yearsOfExperience" },
        { status: 400 }
      )
    }

    // Call the Flask Insurance Risk API
    const INSURANCE_API_URL = process.env.INSURANCE_API_URL || "http://localhost:5002/predict"
    
    const response = await fetch(INSURANCE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carYear: Number(carYear),
        carValue: Number(carValue),
        numberOfAccidents: Number(numberOfAccidents),
        yearsOfExperience: Number(yearsOfExperience),
      }),
    })

    if (!response.ok) {
      console.error("Insurance API error:", response.statusText)
      return NextResponse.json(
        { error: "Insurance risk analysis failed" },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Return the insurance analysis results
    return NextResponse.json({
      success: data.success || true,
      riskScore: data.riskScore,
      insuranceCost: data.insuranceCost,
      riskLevel: data.riskLevel,
      message: data.message,
    })
  } catch (error) {
    console.error("Insurance risk analysis error:", error)
    return NextResponse.json(
      { error: "Risk analysis failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
