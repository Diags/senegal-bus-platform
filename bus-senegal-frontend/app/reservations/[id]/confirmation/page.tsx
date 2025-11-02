'use client'

import { use } from 'react'
import { useBooking } from '@/hooks/useBookings'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const bookingId = parseInt(resolvedParams.id)
  
  const { data: booking, isLoading } = useBooking(bookingId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 center-flex">
        <div className="text-center">
          <div className="inline-flex items-center gap-4 glass-card px-8 py-6 rounded-2xl shadow-senegal-lg">
            <div className="w-12 h-12 border-4 border-senegal-green border-t-transparent rounded-full animate-spin"></div>
            <div>
              <div className="font-black text-2xl text-senegal-green mb-1">Bus Sénégal</div>
              <div className="text-gray-600">Chargement...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 center-flex">
        <div className="card-ultra p-12 max-w-2xl shadow-senegal-xl text-center">
          <div className="text-8xl mb-6">❌</div>
          <h2 className="text-3xl font-black mb-4">Réservation introuvable</h2>
          <Link href="/" className="btn-primary px-8 py-4 text-lg">
            🏠 Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const trip = booking.trip
  const total = trip.price * booking.numberOfSeats

  return (
    <div className="min-h-screen bg-gradient-to-br from-senegal-green/10 via-senegal-yellow/10 to-senegal-red/10 relative overflow-hidden">
      {/* Confetti background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {['🎉', '🎊', '✨', '⭐', '🇸🇳'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
      
      {/* Barre tricolore */}
      <div className="gradient-senegal h-2 w-full"></div>
      
      <div className="space-container py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12 animate-scaleIn">
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-senegal-green to-senegal-green-dark center-flex text-6xl shadow-senegal-2xl animate-bounce-in">
                  ✅
                </div>
                <div className="absolute -top-2 -right-2 text-4xl animate-float">🎉</div>
                <div className="absolute -bottom-2 -left-2 text-4xl animate-float" style={{animationDelay: '0.5s'}}>🇸🇳</div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              <span className="gradient-text-senegal">Réservation Confirmée !</span>
            </h1>
            
            <p className="text-2xl text-gray-700 mb-6">
              Nangadef ! Votre voyage est confirmé ! 🚌
            </p>
            
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full shadow-senegal-md">
              <span className="text-2xl">📧</span>
              <span className="font-semibold text-gray-800">
                E-billet envoyé par SMS, Email et WhatsApp
              </span>
            </div>
          </div>
          
          {/* E-Billet */}
          <div className="card-ultra shadow-senegal-2xl p-10 mb-8">
            {/* Header Billet */}
            <div className="text-center mb-8 pb-6 border-b-2 border-dashed border-gray-300">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-5xl">🚌</span>
                <div>
                  <div className="text-3xl font-black text-senegal-green">Bus Sénégal</div>
                  <div className="text-sm text-gray-600">La Teranga du voyage</div>
                </div>
              </div>
              <div className="inline-block bg-senegal-green text-white px-6 py-2 rounded-full font-bold">
                ✅ E-BILLET CONFIRMÉ
              </div>
            </div>
            
            {/* Numéro billet */}
            <div className="text-center mb-8 p-6 bg-gradient-to-br from-senegal-green/10 to-senegal-yellow/10 rounded-2xl">
              <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Numéro de réservation
              </div>
              <div className="text-4xl font-black text-senegal-green tracking-wider">
                {booking.bookingNumber}
              </div>
            </div>
            
            {/* Trajet */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-gray-700 uppercase tracking-wide text-center">
                📍 Informations du Voyage
              </h3>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-senegal-green mb-1">
                    {new Date(trip.departureDateTime).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="font-bold text-gray-900">{trip.departureCity}</div>
                  <div className="text-sm text-gray-500">Départ</div>
                </div>
                
                <div className="flex-1 px-4">
                  <div className="h-1 bg-gradient-to-r from-senegal-green via-senegal-yellow to-senegal-red rounded-full relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-3">
                      <span className="text-2xl">🚌</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-black text-senegal-red mb-1">
                    {new Date(trip.arrivalDateTime).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="font-bold text-gray-900">{trip.arrivalCity}</div>
                  <div className="text-sm text-gray-500">Arrivée</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass-card p-3 rounded-xl text-center">
                  <div className="text-gray-600 mb-1">📅 Date</div>
                  <div className="font-bold">
                    {new Date(trip.departureDateTime).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="glass-card p-3 rounded-xl text-center">
                  <div className="text-gray-600 mb-1">👥 Places</div>
                  <div className="font-bold">{booking.numberOfSeats}</div>
                </div>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="mb-8 text-center">
              <div className="inline-block p-8 bg-white rounded-2xl shadow-md">
                <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl center-flex text-6xl border-4 border-senegal-green">
                  📱
                </div>
                <div className="text-sm text-gray-600 mt-4">
                  QR Code à présenter lors de l'embarquement
                </div>
              </div>
            </div>
            
            {/* Total */}
            <div className="p-6 bg-gradient-to-br from-senegal-green to-senegal-green-dark rounded-2xl text-white text-center mb-6">
              <div className="text-sm uppercase tracking-wide mb-2 opacity-90">
                Montant payé
              </div>
              <div className="text-5xl font-black">
                {formatCurrency(total)}
              </div>
              <div className="text-sm opacity-90 mt-1">
                FCFA • Paiement confirmé
              </div>
            </div>
            
            {/* Instructions */}
            <div className="glass-card p-6 rounded-2xl">
              <h4 className="font-bold text-center mb-4 flex items-center justify-center gap-2">
                <span className="text-2xl">💡</span>
                <span>Prochaines Étapes</span>
              </h4>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-senegal-green text-white center-flex text-xs font-bold">1</span>
                  <span>Consultez votre e-billet reçu par SMS/Email/WhatsApp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-senegal-green text-white center-flex text-xs font-bold">2</span>
                  <span>Présentez-vous 15 minutes avant le départ</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-senegal-green text-white center-flex text-xs font-bold">3</span>
                  <span>Montrez votre QR Code + Carte d'identité</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-senegal-green text-white center-flex text-xs font-bold">4</span>
                  <span>Embarquez et bon voyage ! 🇸🇳</span>
                </li>
              </ol>
            </div>
          </div>
          
          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button className="btn-secondary py-4 text-lg">
              📧 Renvoyer par Email
            </button>
            <button className="btn-secondary py-4 text-lg">
              📱 Envoyer par WhatsApp
            </button>
            <button className="btn-secondary py-4 text-lg">
              🖨️ Imprimer le billet
            </button>
          </div>
          
          {/* Teranga Message */}
          <div className="card-ultra p-8 shadow-senegal-lg text-center mb-8">
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="text-3xl font-black mb-4">
              <span className="gradient-text-senegal">Teranga !</span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Merci d'avoir choisi <span className="font-bold text-senegal-green">Bus Sénégal</span>. 
              Nous vous souhaitons un excellent voyage à travers notre beau pays ! 🇸🇳
            </p>
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mes-reservations" className="btn-primary px-10 py-4 text-lg ripple">
              📋 Mes réservations
            </Link>
            <Link href="/" className="btn-secondary px-10 py-4 text-lg">
              🏠 Retour à l'accueil
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  )
}

