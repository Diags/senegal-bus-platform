'use client'

import { use } from 'react'
import { useTrip, useCheckAvailability } from '@/hooks/useTrips'
import { useCreateBooking } from '@/hooks/useBookings'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const tripId = parseInt(resolvedParams.id)
  const router = useRouter()
  const { isAuthenticated, signIn } = useAuth()
  
  const { data: trip, isLoading } = useTrip(tripId)
  const { data: availability } = useCheckAvailability(tripId)
  const createBooking = useCreateBooking()
  
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null)
  const [numberOfSeats, setNumberOfSeats] = useState(1)

  const handleBooking = async () => {
    if (!isAuthenticated) {
      signIn()
      return
    }

    if (!selectedSeatId) {
      alert('Veuillez sélectionner un siège')
      return
    }

    try {
      const booking = await createBooking.mutateAsync({
        tripId,
        seatId: selectedSeatId,
        numberOfSeats,
      })
      
      router.push(`/reservations/${booking.id}/paiement`)
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Erreur lors de la réservation')
    }
  }

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

  if (!trip) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Trajet introuvable</CardTitle>
            <CardDescription>Ce trajet n'existe pas ou n'est plus disponible</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {trip.departureCity} → {trip.arrivalCity}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {formatDateTime(trip.departureDateTime)}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{formatCurrency(trip.price)}</div>
                  <div className="text-sm text-muted-foreground">par personne</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Départ:</span>
                  <div className="font-medium">
                    {new Date(trip.departureDateTime).toLocaleTimeString('fr-SN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Arrivée:</span>
                  <div className="font-medium">
                    {new Date(trip.arrivalDateTime).toLocaleTimeString('fr-SN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Places disponibles:</span>
                  <div className="font-medium text-primary">
                    {availability?.seats || trip.availableSeats} / {trip.totalSeats}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Statut:</span>
                  <div className="font-medium">
                    {trip.status === 'SCHEDULED' && '✅ Confirmé'}
                    {trip.status === 'BOARDING' && '🚌 Embarquement'}
                    {trip.status === 'IN_TRANSIT' && '🛣️ En route'}
                    {trip.status === 'COMPLETED' && '✔️ Terminé'}
                    {trip.status === 'CANCELLED' && '❌ Annulé'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Compagnie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {trip.companyLogoUrl && (
                  <img 
                    src={trip.companyLogoUrl} 
                    alt={trip.companyName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold text-lg">{trip.companyName}</div>
                  <div className="text-sm text-muted-foreground">
                    {trip.busBrand} {trip.busModel}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bus Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Équipements du bus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trip.hasWifi && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📶</span>
                    <span>WiFi gratuit</span>
                  </div>
                )}
                {trip.hasAC && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">❄️</span>
                    <span>Climatisation</span>
                  </div>
                )}
                {trip.hasToilet && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚽</span>
                    <span>Toilettes</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💺</span>
                  <span>Sièges confortables</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧳</span>
                  <span>Bagages inclus</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Réserver ce trajet</CardTitle>
              <CardDescription>
                {availability?.available ? 'Places disponibles' : 'Complet'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre de places
                </label>
                <select
                  value={numberOfSeats}
                  onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} place{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Prix unitaire</span>
                  <span className="font-medium">{formatCurrency(trip.price)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Quantité</span>
                  <span className="font-medium">× {numberOfSeats}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(trip.price * numberOfSeats)}</span>
                </div>
              </div>

              <Button 
                onClick={handleBooking}
                disabled={!availability?.available || createBooking.isPending}
                className="w-full"
                size="lg"
              >
                {createBooking.isPending ? 'Réservation...' : 'Réserver maintenant'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Paiement sécurisé par Orange Money, Wave ou Free Money
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

