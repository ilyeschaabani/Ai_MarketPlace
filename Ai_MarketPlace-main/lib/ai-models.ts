// AI Model Integration Layer
// This file provides the interface for all 6 AI models in the system

/**
 * AI Model 1: Car Listing Analyzer (Ahmed Kolsi)
 * Technology: Vision + NLP
 * Purpose: Analyze images and descriptions for quality and completeness
 */
export interface ListingAnalysisInput {
  images: string[]
  description: string
  title: string
}

export interface ListingAnalysisOutput {
  imageQuality: number // 0-100
  detectedFeatures: string[]
  descriptionScore: number // 0-100
  completeness: number // 0-100
  suggestions: string[]
}

export async function analyzeCarListing(input: ListingAnalysisInput): Promise<ListingAnalysisOutput> {
  const response = await fetch("/api/ai/analyze-listing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return response.json()
}

/**
 * AI Model 2: Price Prediction Engine (Motaz ben chikh)
 * Technology: ML/Regression
 * Purpose: Predict fair market price based on vehicle characteristics
 */
export interface PricePredictionInput {
  brand: string
  model: string
  year: number
  mileage: number
  fuelType: string
  transmission: string
  condition?: string
}

export interface PricePredictionOutput {
  predictedPrice: number
  confidence: number // 0-1
  factors: Array<{
    factor: string
    impact: number
  }>
}

export async function predictCarPrice(input: PricePredictionInput): Promise<PricePredictionOutput> {
  const response = await fetch("/api/ai/predict-price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return response.json()
}

/**
 * AI Model 3: Fraud & Authenticity Detection (Mayyara haj yahia)
 * Technology: Anomaly Detection
 * Purpose: Detect fraudulent listings and suspicious patterns
 */
export interface FraudDetectionInput {
  listingId: string
  price: number
  predictedPrice: number
  images: string[]
  description: string
  sellerHistory?: {
    totalListings: number
    rejectedListings: number
    accountAge: number
  }
}

export interface FraudDetectionOutput {
  fraudScore: number // 0-100
  riskLevel: "low" | "medium" | "high"
  alerts: string[]
  imageAuthenticity: number // 0-100
  priceAnomaly: boolean
}

export async function detectFraud(input: FraudDetectionInput): Promise<FraudDetectionOutput> {
  const response = await fetch("/api/ai/detect-fraud", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return response.json()
}

/**
 * AI Model 4: Buyer-Seller Matching & Recommendation (Nour chehida)
 * Technology: Collaborative Filtering + Content-Based
 * Purpose: Match buyers with relevant listings based on preferences
 */
export interface RecommendationInput {
  userId: string
  preferences?: {
    brands?: string[]
    priceRange?: { min: number; max: number }
    fuelTypes?: string[]
    yearRange?: { min: number; max: number }
  }
  searchHistory?: string[]
  favoriteListings?: string[]
}

export interface RecommendationOutput {
  recommendations: Array<{
    listingId: string
    score: number // 0-1
    reasons: string[]
  }>
}

export async function getRecommendations(input: RecommendationInput): Promise<RecommendationOutput> {
  const response = await fetch("/api/ai/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return response.json()
}

/**
 * AI Model 5: Virtual Car Assistant (Adam hachana)
 * Technology: NLP/RAG Chatbot
 * Purpose: Answer user questions about cars and listings
 */
export interface ChatInput {
  message: string
  context?: {
    listingId?: string
    userId?: string
    conversationHistory?: Array<{
      role: "user" | "assistant"
      content: string
    }>
  }
}

export interface ChatOutput {
  response: string
  sources?: string[]
  suggestedActions?: Array<{
    label: string
    action: string
  }>
}

export async function chatWithAssistant(input: ChatInput): Promise<ChatOutput> {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return response.json()
}

/**
 * AI Model 6: Insurance Risk Analyzer (Ilyes chaabani)
 * Technology: Classification & Regression
 * Purpose: Analyze insurance risk and estimate premiums
 */
export interface InsuranceRiskInput {
  brand: string
  model: string
  year: number
  mileage: number
  driverAge?: number
  driverHistory?: {
    yearsLicensed: number
    accidents: number
  }
}

export interface InsuranceRiskOutput {
  riskScore: number // 0-100
  riskCategory: "low" | "medium" | "high"
  estimatedPremium: number
  factors: Array<{
    factor: string
    weight: number
  }>
}

export async function analyzeInsuranceRisk(input: InsuranceRiskInput): Promise<InsuranceRiskOutput> {
  const response = await fetch("/api/ai/insurance-risk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return response.json()
}

// Utility function to run multiple AI analyses in parallel
export async function runFullListingAnalysis(listing: {
  id: string
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  fuelType: string
  transmission: string
  images: string[]
  description: string
  title: string
}) {
  const [listingAnalysis, priceAnalysis] = await Promise.all([
    analyzeCarListing({
      images: listing.images,
      description: listing.description,
      title: listing.title,
    }),
    predictCarPrice({
      brand: listing.brand,
      model: listing.model,
      year: listing.year,
      mileage: listing.mileage,
      fuelType: listing.fuelType,
      transmission: listing.transmission,
    }),
  ])

  // Run fraud detection with predicted price
  const fraudAnalysis = await detectFraud({
    listingId: listing.id,
    price: listing.price,
    predictedPrice: priceAnalysis.predictedPrice,
    images: listing.images,
    description: listing.description,
  })

  return {
    listingAnalysis,
    priceAnalysis,
    fraudAnalysis,
  }
}
