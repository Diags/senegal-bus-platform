'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Header() {
  const { isAuthenticated, user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Barre tricolore du drapeau sénégalais */}
      <div className="gradient-senegal h-1 w-full"></div>
      
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo et Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🚌</span>
            <div className="flex flex-col leading-tight">
              <span className="text-xl md:text-2xl font-bold" style={{color: 'var(--senegal-green)'}}>
                Bus Sénégal
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">La Teranga du voyage</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/trajets" 
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{color: 'var(--foreground)'}}
            >
              🗺️ Trajets
            </Link>
            <Link 
              href="/compagnies" 
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{color: 'var(--foreground)'}}
            >
              🏢 Compagnies
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  href="/profile" 
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{color: 'var(--foreground)'}}
                >
                  👤 Mon Compte
                </Link>
                <Link 
                  href="/mes-reservations" 
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{color: 'var(--foreground)'}}
                >
                  📋 Mes Réservations
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                <span className="text-lg">👤</span>
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {user?.email || user?.name}
                </span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
                className="text-sm"
                style={{borderColor: 'var(--senegal-green)', color: 'var(--senegal-green)'}}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/auth/signin">Connexion</Link>
              </Button>
              <Button 
                asChild 
                className="text-white font-semibold shadow-md hover:shadow-lg"
                style={{backgroundColor: 'var(--senegal-green)'}}
              >
                <Link href="/auth/signup">
                  <span className="hidden sm:inline">Inscription</span>
                  <span className="sm:hidden">S'inscrire</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

