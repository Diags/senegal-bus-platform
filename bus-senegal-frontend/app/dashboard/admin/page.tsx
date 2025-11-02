'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.roles?.includes('ADMIN'))) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user?.roles?.includes('ADMIN')) {
    return null
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord - Administrateur</h1>
        <p className="text-muted-foreground">Gérez la plateforme Bus Sénégal</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Compagnies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">+3 ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground mt-1">+124 ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Réservations totales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5,234</div>
            <p className="text-xs text-muted-foreground mt-1">+412 ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Revenus plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.8M CFA</div>
            <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              Compagnies
            </CardTitle>
            <CardDescription>Gérer les compagnies de bus</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/admin/compagnies">Gérer les compagnies</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Utilisateurs
            </CardTitle>
            <CardDescription>Gérer les utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/admin/utilisateurs">Gérer les utilisateurs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Analytics
            </CardTitle>
            <CardDescription>Statistiques globales</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/admin/analytics">Voir les analytics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              Paiements
            </CardTitle>
            <CardDescription>Suivi des transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/admin/paiements">Gérer les paiements</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              Routes
            </CardTitle>
            <CardDescription>Gérer les itinéraires</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/admin/routes">Gérer les routes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Configuration
            </CardTitle>
            <CardDescription>Paramètres système</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/admin/config">Configuration</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nouvelle compagnie inscrite', name: 'Transport Dakar Express', time: 'Il y a 2h' },
                { action: 'Paiement traité', name: '45,000 CFA', time: 'Il y a 3h' },
                { action: 'Trajet créé', name: 'Dakar → Thiès', time: 'Il y a 5h' },
                { action: 'Utilisateur inscrit', name: 'Amadou Diallo', time: 'Il y a 6h' },
                { action: 'Réservation annulée', name: '#BUS000234', time: 'Il y a 8h' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <div className="text-sm font-medium">{item.action}</div>
                    <div className="text-xs text-muted-foreground">{item.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes système</CardTitle>
            <CardDescription>Notifications importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  <div>
                    <div className="text-sm font-medium">Abonnement expirant</div>
                    <div className="text-xs text-muted-foreground">
                      3 compagnies ont un abonnement qui expire dans 7 jours
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">ℹ️</span>
                  <div>
                    <div className="text-sm font-medium">Mise à jour disponible</div>
                    <div className="text-xs text-muted-foreground">
                      Version 2.1.0 disponible avec de nouvelles fonctionnalités
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✅</span>
                  <div>
                    <div className="text-sm font-medium">Sauvegarde réussie</div>
                    <div className="text-xs text-muted-foreground">
                      Dernière sauvegarde effectuée il y a 1 heure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

