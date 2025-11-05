"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Car, LogOut, User, LayoutDashboard, Database, FileText, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, logout } = useAuth()

  const getDashboardLink = () => {
    if (!user) return "/login"
    switch (user.role) {
      case "buyer":
        return "/buyer/dashboard"
      case "seller":
        return "/seller/dashboard"
      case "admin":
        return "/admin/dashboard"
      default:
        return "/login"
    }
  }

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Car className="h-6 w-6 text-primary" />
            <span>AI Car Market</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/cars">
                  <Button variant="ghost" size="sm">
                    <Database className="h-4 w-4 mr-2" />
                    Voitures
                  </Button>
                </Link>
                <Link href="/test-insurance">
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Annonces
                  </Button>
                </Link>
                <Link href="/annonces/new">
                  <Button variant="default" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Annonce
                  </Button>
                </Link>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Inscription</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
