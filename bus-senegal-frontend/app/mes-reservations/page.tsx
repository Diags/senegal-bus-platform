'use client'

import { useMyBookings } from '@/hooks/useBookings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function MyBookingsPage() {
  const { data: bookings, isLoading, error } = useMyBookings()

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
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
              Impossible de charger vos réservations
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mes Réservations</h1>
          <Button asChild>
            <Link href="/">Nouvelle réservation</Link>
          </Button>
        </div>

        {bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Trip Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'CONFIRMED' && '✅ Confirmé'}
                          {booking.status === 'PENDING' && '⏳ En attente'}
                          {booking.status === 'CANCELLED' && '❌ Annulé'}
                          {booking.status === 'EXPIRED' && '⌛ Expiré'}
                        </span>
                      </div>
                      
                      <div className="text-xl font-bold mb-1">
                        {booking.trip.departureCity} → {booking.trip.arrivalCity}
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        {formatDateTime(booking.trip.departureDateTime)}
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Compagnie:</span>{' '}
                        <span className="font-medium">{booking.trip.companyName}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Réservation:</span>{' '}
                        <span className="font-mono">{booking.bookingNumber}</span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Places</div>
                      <div className="text-2xl font-bold">{booking.numberOfSeats}</div>
                      
                      <div className="text-sm text-muted-foreground mt-3 mb-1">Prix total</div>
                      <div className="text-lg font-bold">
                        {formatCurrency(booking.trip.price * booking.numberOfSeats)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {booking.status === 'CONFIRMED' && (
                        <>
                          <Button asChild size="sm">
                            <Link href={`/reservations/${booking.id}/billet`}>
                              📱 Voir le billet
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/reservations/${booking.id}`}>
                              Détails
                            </Link>
                          </Button>
                        </>
                      )}
                      
                      {booking.status === 'PENDING' && (
                        <Button asChild size="sm">
                          <Link href={`/reservations/${booking.id}/paiement`}>
                            💳 Payer maintenant
                          </Link>
                        </Button>
                      )}
                      
                      {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                        <Button variant="destructive" size="sm">
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold mb-2">Aucune réservation</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore effectué de réservation
              </p>
              <Button asChild>
                <Link href="/">Rechercher un trajet</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

