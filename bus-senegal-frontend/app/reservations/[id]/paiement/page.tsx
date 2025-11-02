'use client'

import { use, useState } from 'react'
import { useBooking } from '@/hooks/useBookings'
import { useInitiatePayment, usePaymentStatus } from '@/hooks/usePayments'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'

type PaymentMethod = 'ORANGE_MONEY' | 'WAVE' | 'FREE_MONEY'

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const bookingId = parseInt(resolvedParams.id)
  const router = useRouter()
  
  const { data: booking, isLoading } = useBooking(bookingId)
  const initiatePayment = useInitiatePayment()
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('ORANGE_MONEY')
  const [paymentInitiated, setPaymentInitiated] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const { data: paymentStatus } = usePaymentStatus(transactionId || '')

  const handlePayment = async () => {
    try {
      const payment = await initiatePayment.mutateAsync({
        bookingId,
        paymentMethod: selectedMethod,
      })
      
      setTransactionId(payment.transactionId)
      setPaymentInitiated(true)
      
      // Redirect to payment URL if provided
      if (payment.paymentUrl) {
        window.open(payment.paymentUrl, '_blank')
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      alert('Erreur lors de l\'initiation du paiement')
    }
  }

  // Check if payment is completed
  if (paymentStatus?.status === 'COMPLETED') {
    router.push(`/reservations/${bookingId}/confirmation`)
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

  if (!booking) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Réservation introuvable</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Paiement</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {!paymentInitiated ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Choisissez votre méthode de paiement</CardTitle>
                    <CardDescription>
                      Paiement 100% sécurisé
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Orange Money */}
                    <button
                      onClick={() => setSelectedMethod('ORANGE_MONEY')}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === 'ORANGE_MONEY'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">🟠</div>
                        <div className="text-left">
                          <div className="font-semibold">Orange Money</div>
                          <div className="text-sm text-muted-foreground">
                            Paiement via Orange Money
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Wave */}
                    <button
                      onClick={() => setSelectedMethod('WAVE')}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === 'WAVE'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">🌊</div>
                        <div className="text-left">
                          <div className="font-semibold">Wave</div>
                          <div className="text-sm text-muted-foreground">
                            Paiement via Wave (QR code ou lien)
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Free Money */}
                    <button
                      onClick={() => setSelectedMethod('FREE_MONEY')}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === 'FREE_MONEY'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">💰</div>
                        <div className="text-left">
                          <div className="font-semibold">Free Money</div>
                          <div className="text-sm text-muted-foreground">
                            Paiement via Free Money
                          </div>
                        </div>
                      </div>
                    </button>
                  </CardContent>
                </Card>

                <Button
                  onClick={handlePayment}
                  disabled={initiatePayment.isPending}
                  className="w-full"
                  size="lg"
                >
                  {initiatePayment.isPending ? 'Traitement...' : 'Procéder au paiement'}
                </Button>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Paiement en cours</CardTitle>
                  <CardDescription>
                    Complétez le paiement sur votre application mobile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <div className="animate-pulse text-6xl mb-4">⏳</div>
                    <p className="text-lg font-medium mb-2">
                      En attente du paiement...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Transaction ID: {transactionId}
                    </p>
                  </div>

                  {paymentStatus?.message && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">{paymentStatus.message}</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground text-center">
                    Le statut se met à jour automatiquement toutes les 5 secondes
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Trajet</div>
                  <div className="font-medium">
                    {booking.trip.departureCity} → {booking.trip.arrivalCity}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Date et heure</div>
                  <div className="font-medium">
                    {formatDateTime(booking.trip.departureDateTime)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Compagnie</div>
                  <div className="font-medium">{booking.trip.companyName}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Places</div>
                  <div className="font-medium">{booking.numberOfSeats}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Numéro de réservation</div>
                  <div className="font-mono text-sm">{booking.bookingNumber}</div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total à payer</span>
                    <span>{formatCurrency(booking.trip.price * booking.numberOfSeats)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

