'use client'

import { use } from 'react'
import { useBooking } from '@/hooks/useBookings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const bookingId = parseInt(resolvedParams.id)
  
  const { data: booking, isLoading } = useBooking(bookingId)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Generate QR code and download as PDF
    alert('Téléchargement du billet en cours...')
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

  if (!booking || booking.status !== 'CONFIRMED') {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Billet non disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ce billet n'est pas disponible ou la réservation n'est pas confirmée.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        {/* Actions (hide on print) */}
        <div className="flex gap-4 mb-8 print:hidden">
          <Button onClick={handlePrint}>
            🖨️ Imprimer
          </Button>
          <Button onClick={handleDownload} variant="outline">
            📥 Télécharger PDF
          </Button>
        </div>

        {/* E-Ticket */}
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Bus Sénégal</h1>
                <p className="text-sm opacity-90">Billet électronique</p>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Réservation</div>
                <div className="text-xl font-mono font-bold">{booking.bookingNumber}</div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Trip Info */}
            <div className="border-b pb-6">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {new Date(booking.trip.departureDateTime).toLocaleTimeString('fr-SN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-lg font-semibold">{booking.trip.departureCity}</div>
                  <div className="text-sm text-muted-foreground">Départ</div>
                </div>

                <div className="text-center">
                  <div className="text-4xl">🚌</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {Math.floor(
                      (new Date(booking.trip.arrivalDateTime).getTime() - 
                       new Date(booking.trip.departureDateTime).getTime()) / 
                      (1000 * 60 * 60)
                    )}h de trajet
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {new Date(booking.trip.arrivalDateTime).toLocaleTimeString('fr-SN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-lg font-semibold">{booking.trip.arrivalCity}</div>
                  <div className="text-sm text-muted-foreground">Arrivée</div>
                </div>
              </div>

              <div className="text-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {new Date(booking.trip.departureDateTime).toLocaleDateString('fr-SN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>

            {/* Passenger & Company Info */}
            <div className="grid grid-cols-2 gap-6 border-b pb-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Passager</div>
                <div className="font-semibold">
                  {booking.user ? `${booking.user.firstName || ''} ${booking.user.lastName || ''}`.trim() || booking.user.email : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">{booking.user?.email}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Compagnie</div>
                <div className="font-semibold">{booking.trip.companyName}</div>
                <div className="text-sm text-muted-foreground">
                  {booking.trip.busBrand} {booking.trip.busModel}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-3 gap-4 text-center border-b pb-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Places</div>
                <div className="text-2xl font-bold">{booking.numberOfSeats}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Prix total</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(booking.trip.price * booking.numberOfSeats)}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Statut</div>
                <div className="text-lg font-semibold text-green-600">✅ Confirmé</div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center py-6">
              <div className="inline-block p-4 bg-white border-2 border-dashed rounded-lg">
                {/* Placeholder for QR code - would use a QR code library in production */}
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📱</div>
                    <div className="text-xs text-muted-foreground">
                      Code QR<br />
                      {booking.bookingNumber}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Présentez ce code QR à l'embarquement
              </p>
            </div>

            {/* Important Info */}
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <div className="font-semibold mb-2">ℹ️ Informations importantes</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Présentez-vous 15 minutes avant le départ</li>
                <li>• Munissez-vous d'une pièce d'identité valide</li>
                <li>• Bagage en soute : 1 valise de 20kg maximum incluse</li>
                <li>• Bagage à main : 1 sac de 5kg maximum</li>
                <li>• Annulation gratuite jusqu'à 24h avant le départ</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>Billet généré le {new Date().toLocaleString('fr-SN')}</p>
              <p className="mt-1">Pour toute question, contactez-nous au +221 33 XXX XX XX</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

