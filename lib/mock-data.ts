import type { CarListing, User } from "./types"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "buyer@example.com",
    name: "Ahmed Buyer",
    role: "buyer",
    phone: "+216 20 123 456",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    email: "seller@example.com",
    name: "Fatima Seller",
    role: "seller",
    phone: "+216 20 234 567",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

// Mock Car Listings
export const mockListings: CarListing[] = [
  {
    id: "1",
    sellerId: "2",
    title: "Peugeot 208 GTi - Excellent État",
    brand: "Peugeot",
    model: "208 GTi",
    year: 2019,
    mileage: 45000,
    price: 28000,
    predictedPrice: 27500,
    fuelType: "essence",
    transmission: "manual",
    color: "Rouge",
    description: "Voiture en excellent état, entretien régulier, carnet à jour",
    images: ["/red-peugeot-208.jpg"],
    status: "active",
    fraudScore: 15,
    views: 234,
    favorites: 12,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "2",
    sellerId: "2",
    title: "Renault Clio 4 - Diesel Économique",
    brand: "Renault",
    model: "Clio 4",
    year: 2018,
    mileage: 68000,
    price: 22000,
    predictedPrice: 23000,
    fuelType: "diesel",
    transmission: "manual",
    color: "Blanc",
    description: "Très économique, parfait pour la ville",
    images: ["/white-renault-clio.jpg"],
    status: "active",
    fraudScore: 8,
    views: 156,
    favorites: 8,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "3",
    sellerId: "2",
    title: "Volkswagen Golf 7 GTD",
    brand: "Volkswagen",
    model: "Golf 7 GTD",
    year: 2017,
    mileage: 95000,
    price: 35000,
    predictedPrice: 33000,
    fuelType: "diesel",
    transmission: "automatic",
    color: "Gris",
    description: "Sportive et confortable, toutes options",
    images: ["/grey-volkswagen-golf.jpg"],
    status: "pending",
    fraudScore: 45,
    fraudAlerts: ["Prix supérieur à la moyenne", "Images de faible qualité"],
    views: 89,
    favorites: 3,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
]

// Local Storage Keys
const STORAGE_KEYS = {
  USER: "car_marketplace_user",
  LISTINGS: "car_marketplace_listings",
  FAVORITES: "car_marketplace_favorites",
}

// Mock Auth Functions
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  return userStr ? JSON.parse(userStr) : null
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER)
  }
}

export function mockLogin(email: string, password: string): User | null {
  const user = mockUsers.find((u) => u.email === email)
  if (user) {
    setCurrentUser(user)
    return user
  }
  return null
}

export function mockLogout() {
  setCurrentUser(null)
}

// Mock Data Functions
export function getListings(status?: string): CarListing[] {
  if (status) {
    return mockListings.filter((l) => l.status === status)
  }
  return mockListings
}

export function getListingById(id: string): CarListing | undefined {
  return mockListings.find((l) => l.id === id)
}

export function getUserListings(userId: string): CarListing[] {
  return mockListings.filter((l) => l.sellerId === userId)
}
