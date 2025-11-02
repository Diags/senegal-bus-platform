'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Header() {
  const { isAuthenticated, user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">🚌 Bus Sénégal</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/trajets" className="transition-colors hover:text-foreground/80">
              Trajets
            </Link>
            {isAuthenticated && (
              <Link href="/mes-reservations" className="transition-colors hover:text-foreground/80">
                Mes Réservations
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="outline" onClick={() => signOut()}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Inscription</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

