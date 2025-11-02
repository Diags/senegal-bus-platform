'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSearchTrips } from '@/hooks/useTrips'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency, formatDateTime } from '@/lib/utils'

function SearchResults() {
  const searchParams = useSearchParams()
  
  const params = {
    departureCity: searchParams.get('from') || '',
    arrivalCity: searchParams.get('to') || '',
    departureDate: searchParams.get('date') || '',
    passengers: parseInt(searchParams.get('passengers') || '1'),
  }

  const { data: trips, isLoading, error } = useSearchTrips(params)

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Recherche en cours...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>
              Une erreur est survenue lors de la recherche
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      {/* Search Summary */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {params.departureCity} → {params.arrivalCity}
        </h1>
        <p className="text-muted-foreground">
          {new Date(params.departureDate).toLocaleDateString('fr-SN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })} • {params.passengers} passager{params.passengers > 1 ? 's' : ''}
        </p>
      </div>

      {/* Results */}
      {trips && trips.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {trips.length} trajet{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}
          </p>
          
          {trips.map((trip) => (
            <Card key={trip.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  {/* Time & Route */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {new Date(trip.departureDateTime).toLocaleTimeString('fr-SN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trip.departureCity}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="border-t-2 border-dashed relative">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
                            🚌
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {new Date(trip.arrivalDateTime).toLocaleTimeString('fr-SN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trip.arrivalCity}
                        </div>
                      </div>
                    </div>
                    
                    {/* Company & Bus Info */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{trip.companyName}</span>
                      <span>•</span>
                      <span>{trip.busBrand} {trip.busModel}</span>
                      {trip.hasWifi && <span>• 📶 WiFi</span>}
                      {trip.hasAC && <span>• ❄️ Climatisé</span>}
                      {trip.hasToilet && <span>• 🚽 Toilettes</span>}
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Places disponibles</div>
                    <div className="text-2xl font-bold text-primary">
                      {trip.availableSeats}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      sur {trip.totalSeats}
                    </div>
                  </div>
                  
                  {/* Price & Action */}
                  <div className="text-center md:text-right">
                    <div className="text-3xl font-bold mb-2">
                      {formatCurrency(trip.price)}
                    </div>
                    <Button asChild className="w-full md:w-auto">
                      <Link href={`/trajets/${trip.id}`}>
                        Réserver
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-xl font-semibold mb-2">Aucun trajet trouvé</h3>
            <p className="text-muted-foreground mb-6">
              Essayez de modifier vos critères de recherche ou choisissez une autre date
            </p>
            <Button asChild>
              <Link href="/">Nouvelle recherche</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}

