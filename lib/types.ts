// User Types
export type UserRole = "buyer" | "seller" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// Car Listing Types
export type ListingStatus = "pending" | "active" | "sold" | "rejected"
export type FuelType = "essence" | "diesel" | "electric" | "hybrid"
export type Transmission = "manual" | "automatic"

export interface CarListing {
  id: string
  sellerId: string
  title: string
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  predictedPrice?: number
  fuelType: FuelType
  transmission: Transmission
  color: string
  description: string
  images: string[]
  status: ListingStatus
  fraudScore?: number
  fraudAlerts?: string[]
  views: number
  favorites: number
  createdAt: Date
  updatedAt: Date
}

// AI Analysis Types
export interface PriceAnalysis {
  id: string
  listingId: string
  predictedPrice: number
  confidence: number
  factors: {
    factor: string
    impact: number
  }[]
  createdAt: Date
}

export interface FraudAnalysis {
  id: string
  listingId: string
  fraudScore: number
  riskLevel: "low" | "medium" | "high"
  alerts: string[]
  imageAuthenticity: number
  priceAnomaly: boolean
  createdAt: Date
}

export interface InsuranceRisk {
  id: string
  listingId: string
  riskScore: number
  riskCategory: "low" | "medium" | "high"
  estimatedPremium: number
  factors: {
    factor: string
    weight: number
  }[]
  createdAt: Date
}

// Recommendation Types
export interface Recommendation {
  id: string
  userId: string
  listingId: string
  score: number
  reasons: string[]
  createdAt: Date
}

// Message Types
export interface Message {
  id: string
  senderId: string
  receiverId: string
  listingId?: string
  content: string
  read: boolean
  createdAt: Date
}

// Favorite Types
export interface Favorite {
  id: string
  userId: string
  listingId: string
  createdAt: Date
}

// Alert Types
export interface Alert {
  id: string
  userId: string
  listingId: string
  type: "fraud" | "price_drop" | "new_match" | "message"
  message: string
  read: boolean
  createdAt: Date
}

// ========== VOITURE TYPES (Backend MySQL sur port 5000) ==========
// Ces types sont séparés du service Car Listing

export interface Voiture {
  id?: number
  matricule: string
  marque: string
  modele: string
  annee?: number | null
  puissance?: number | null
  cylindres?: number | null
  carburant?: string | null
  transmission?: string | null
  traction?: string | null
  prix?: number | null
  embedding?: string | null // JSON string containing number array
  encoder_version?: string | null
  cleaned_fields?: string | null // JSON string
  date_creation?: Date
  date_modification?: Date
}

export interface VoitureApiResponse {
  success: boolean
  message: string
  data?: Voiture | Voiture[]
  count?: number
  status: number
}

export interface VoitureSearchCriteria {
  marque?: string
  modele?: string
  annee?: number
  prixMin?: number
  prixMax?: number
  carburant?: string
  transmission?: string
}

export interface VoitureWithSimilarity extends Voiture {
  similarity?: number;
}

export interface ExternalCarRecommendation {
  similarity: number;
  matricule: string;
  marque: string;
  modele: string;
  annee: number;
  puissance: number;
  cylindres: number;
  carburant: string;
  transmission: string;
  traction: string;
  prix: number;
}
