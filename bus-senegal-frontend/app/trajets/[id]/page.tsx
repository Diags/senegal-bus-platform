'use client'

import { use } from 'react'
import { useTrip, useCheckAvailability } from '@/hooks/useTrips'
import { useCreateBooking } from '@/hooks/useBookings'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { pendingBooking } from '@/lib/pendingBooking'
import Link from 'next/link'

export default function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const tripId = parseInt(resolvedParams.id)
  const router = useRouter()
  const { isAuthenticated, signIn } = useAuth()
  
  const { data: trip, isLoading } = useTrip(tripId)
  const { data: availability } = useCheckAvailability(tripId)
  const createBooking = useCreateBooking()
  
  const [numberOfSeats, setNumberOfSeats] = useState(1)

  // Helper to calculate duration
  const calculateDuration = (departure: string, arrival: string) => {
    const diff = new Date(arrival).getTime() - new Date(departure).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h${minutes.toString().padStart(2, '0')}`
  }

  const handleBooking = async () => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      // Stocker l'intention de réservation
      pendingBooking.set({
        tripId,
        numberOfSeats,
        returnUrl: `/trajets/${tripId}`,
      })
      // Rediriger vers connexion
      signIn(`/trajets/${tripId}`)
      return
    }
    
    try {
      const booking = await createBooking.mutateAsync({
        tripId,
        numberOfSeats,
        // seatId est optionnel - le backend auto-sélectionne un siège disponible
      })
      
      router.push(`/reservations/${booking.id}/paiement`)
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Erreur lors de la réservation. Veuillez réessayer.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Barre tricolore */}
        <div className="gradient-senegal h-1 w-full"></div>
        
        <div className="space-container py-12">
          {/* Skeleton Hero */}
          <div className="mb-8 animate-pulse">
            <div className="h-32 bg-white rounded-2xl shadow-md mb-4"></div>
          </div>
          
          {/* Skeleton Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-64 bg-white rounded-2xl shadow-md"></div>
              <div className="h-48 bg-white rounded-2xl shadow-md"></div>
              <div className="h-56 bg-white rounded-2xl shadow-md"></div>
            </div>
            <div className="lg:col-span-4">
              <div className="h-96 bg-white rounded-2xl shadow-md"></div>
            </div>
          </div>
          
          {/* Loading message */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 glass-card px-6 py-4 rounded-full shadow-senegal-md">
              <div className="w-6 h-6 border-3 border-senegal-green border-t-transparent rounded-full animate-spin"></div>
              <span className="font-semibold text-senegal-green text-lg">
                Chargement des détails du trajet...
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Barre tricolore */}
        <div className="gradient-senegal h-1 w-full"></div>
        
        <div className="space-container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card-ultra p-12 shadow-senegal-xl">
              {/* Icon */}
              <div className="text-8xl mb-6">
                <span className="inline-block animate-float">🚌</span>
                <span className="inline-block animate-float" style={{animationDelay: '0.3s'}}>💨</span>
              </div>
              
              {/* Title */}
              <h2 className="text-4xl font-black mb-4 text-gray-900">
                Ce trajet s'est envolé !
              </h2>
              
              {/* Message Teranga */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Avec la <span className="font-bold text-teranga-orange">Teranga</span> sénégalaise, 
                nous vous aidons à trouver un autre trajet ! 🇸🇳
              </p>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="btn-primary px-10 py-4 text-lg ripple">
                  🔍 Nouvelle recherche
                </Link>
                <Link href="/" className="btn-secondary px-10 py-4 text-lg">
                  🏠 Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const duration = calculateDuration(trip.departureDateTime, trip.arrivalDateTime)
  const departTime = new Date(trip.departureDateTime).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const arriveTime = new Date(trip.arrivalDateTime).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const departDate = new Date(trip.departureDateTime).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Badge statut selon disponibilité
  const availabilityPercent = (trip.availableSeats / trip.totalSeats) * 100
  let statusBadge = { text: '🟢 Places disponibles', color: 'bg-green-100 text-green-800' }
  if (availabilityPercent < 10) {
    statusBadge = { text: '🔥 Derniers sièges !', color: 'bg-red-100 text-red-800 animate-pulse' }
  } else if (availabilityPercent < 30) {
    statusBadge = { text: '⏱️ Presque complet', color: 'bg-orange-100 text-orange-800' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Barre tricolore */}
      <div className="gradient-senegal h-1 w-full"></div>
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="space-container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-senegal-green transition-colors">🏠 Accueil</Link>
            <span>›</span>
            <Link href="/trajets/recherche" className="hover:text-senegal-green transition-colors">Recherche</Link>
            <span>›</span>
            <span className="text-senegal-green font-semibold">{trip.departureCity} → {trip.arrivalCity}</span>
          </div>
        </div>
      </div>
      
      {/* HERO SECTION MEGA */}
      <section className="relative overflow-hidden bg-white shadow-lg mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-senegal-green/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-senegal-yellow/5 rounded-full blur-3xl"></div>
        
        <div className="space-container relative z-10 py-12">
          {/* Route MEGA */}
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            <div className="text-center">
              <div className="text-6xl mb-3">📍</div>
              <h1 className="text-4xl md:text-5xl font-black text-senegal-green">
                {trip.departureCity}
              </h1>
              <div className="text-2xl font-bold text-gray-900 mt-2">{departTime}</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <div className="h-1 w-20 md:w-40 bg-gradient-to-r from-senegal-green via-senegal-yellow to-senegal-red rounded-full"></div>
                <span className="text-5xl animate-float">🚌</span>
                <div className="h-1 w-20 md:w-40 bg-gradient-to-r from-senegal-red via-senegal-yellow to-senegal-green rounded-full"></div>
              </div>
              <div className="glass-card px-4 py-2 rounded-full">
                <span className="font-bold text-gray-700">⏱️ {duration}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-3">🎯</div>
              <h1 className="text-4xl md:text-5xl font-black text-senegal-red">
                {trip.arrivalCity}
              </h1>
              <div className="text-2xl font-bold text-gray-900 mt-2">{arriveTime}</div>
            </div>
          </div>
          
          {/* Informations voyage */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="glass-card px-6 py-3 rounded-full shadow-senegal-sm">
              <span className="text-2xl mr-2">📅</span>
              <span className="font-semibold text-gray-800 capitalize">{departDate}</span>
            </div>
            
            <div className={`px-6 py-3 rounded-full shadow-senegal-sm font-bold ${statusBadge.color}`}>
              {statusBadge.text}
            </div>
            
            <div className="glass-card px-6 py-3 rounded-full shadow-senegal-sm">
              <span className="text-2xl mr-2">💺</span>
              <span className="font-semibold text-gray-800">
                {trip.availableSeats} places disponibles
              </span>
            </div>
          </div>
          
          {/* Prix MEGA */}
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Prix par personne
            </div>
            <div className="text-6xl md:text-7xl font-black text-senegal-green mb-2 animate-pulse">
              {formatCurrency(trip.price)}
            </div>
            <div className="text-sm text-gray-500">
              FCFA • Toutes taxes comprises
            </div>
          </div>
        </div>
      </section>
      
      {/* CONTENT SECTION */}
      <div className="space-container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLONNE GAUCHE - Détails */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Compagnie & Bus */}
            <div className="card-ultra hover-lift shadow-senegal-lg p-8">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <span className="text-3xl">🏢</span>
                Compagnie de transport
              </h2>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-senegal-green/10 center-flex text-4xl shadow-md">
                  🚌
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{trip.companyName}</div>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.8/5 • 234 avis)</span>
                  </div>
                  <div className="text-gray-600">
                    {trip.busBrand} {trip.busModel} • {trip.totalSeats} places
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="glass-card p-3 rounded-xl text-center">
                  <div className="text-2xl mb-1">🛡️</div>
                  <div className="text-xs font-semibold text-gray-700">Certifié ARTP</div>
                </div>
                <div className="glass-card p-3 rounded-xl text-center">
                  <div className="text-2xl mb-1">⚙️</div>
                  <div className="text-xs font-semibold text-gray-700">Bien entretenu</div>
                </div>
                <div className="glass-card p-3 rounded-xl text-center">
                  <div className="text-2xl mb-1">👨‍✈️</div>
                  <div className="text-xs font-semibold text-gray-700">Conducteur expérimenté</div>
                </div>
              </div>
            </div>
            
            {/* Équipements */}
            <div className="card-ultra hover-lift shadow-senegal-lg p-8">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <span className="text-3xl">✨</span>
                Équipements & Confort
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trip.hasWifi && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <span className="text-3xl">📶</span>
                    <div>
                      <div className="font-bold text-blue-900">WiFi Gratuit</div>
                      <div className="text-xs text-blue-700">Haut débit</div>
                    </div>
                  </div>
                )}
                
                {trip.hasAC && (
                  <div className="flex items-center gap-3 p-4 bg-cyan-50 rounded-xl border-2 border-cyan-200">
                    <span className="text-3xl">❄️</span>
                    <div>
                      <div className="font-bold text-cyan-900">Climatisation</div>
                      <div className="text-xs text-cyan-700">Température contrôlée</div>
                    </div>
                  </div>
                )}
                
                {trip.hasToilet && (
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                    <span className="text-3xl">🚽</span>
                    <div>
                      <div className="font-bold text-purple-900">Toilettes</div>
                      <div className="text-xs text-purple-700">À bord</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <span className="text-3xl">💺</span>
                  <div>
                    <div className="font-bold text-green-900">Sièges Confortables</div>
                    <div className="text-xs text-green-700">Inclinables</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                  <span className="text-3xl">🧳</span>
                  <div>
                    <div className="font-bold text-orange-900">Bagages 20kg</div>
                    <div className="text-xs text-orange-700">Inclus</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
                  <span className="text-3xl">🔌</span>
                  <div>
                    <div className="font-bold text-pink-900">Prises USB</div>
                    <div className="text-xs text-pink-700">Chaque siège</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Politique */}
            <div className="card-ultra hover-lift shadow-senegal-lg p-8">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                Politique & Conditions
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <span className="text-2xl flex-shrink-0">✅</span>
                  <div>
                    <div className="font-bold text-green-900 mb-1">Annulation gratuite</div>
                    <div className="text-sm text-green-700">Jusqu'à 24 heures avant le départ</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <span className="text-2xl flex-shrink-0">🔄</span>
                  <div>
                    <div className="font-bold text-blue-900 mb-1">Modification possible</div>
                    <div className="text-sm text-blue-700">Changez de date ou d'horaire facilement</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                  <span className="text-2xl flex-shrink-0">🎫</span>
                  <div>
                    <div className="font-bold text-purple-900 mb-1">E-billet instantané</div>
                    <div className="text-sm text-purple-700">Envoyé par SMS, Email et WhatsApp</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl">
                  <span className="text-2xl flex-shrink-0">📱</span>
                  <div>
                    <div className="font-bold text-yellow-900 mb-1">Documents requis</div>
                    <div className="text-sm text-yellow-700">Carte d'identité ou passeport + QR Code du billet</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pourquoi réserver avec nous */}
            <div className="card-ultra shadow-senegal-lg p-8 bg-gradient-to-br from-senegal-green/5 to-senegal-yellow/5">
              <h2 className="text-3xl font-black mb-8 text-center">
                <span className="gradient-text-senegal">Pourquoi réserver avec Bus Sénégal ?</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-2xl hover-lift">
                  <div className="text-5xl mb-4 text-center">🤝</div>
                  <h3 className="font-bold text-xl text-center mb-2 text-senegal-green">Teranga</h3>
                  <p className="text-gray-600 text-center text-sm">
                    L'hospitalité sénégalaise dans chaque trajet
                  </p>
                </div>
                
                <div className="glass-card p-6 rounded-2xl hover-lift">
                  <div className="text-5xl mb-4 text-center">🛡️</div>
                  <h3 className="font-bold text-xl text-center mb-2 text-senegal-green">Sécurité</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Compagnies certifiées et contrôlées
                  </p>
                </div>
                
                <div className="glass-card p-6 rounded-2xl hover-lift">
                  <div className="text-5xl mb-4 text-center">💰</div>
                  <h3 className="font-bold text-xl text-center mb-2 text-senegal-green">Prix Transparents</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Pas de frais cachés, tout est inclus
                  </p>
                </div>
                
                <div className="glass-card p-6 rounded-2xl hover-lift">
                  <div className="text-5xl mb-4 text-center">📞</div>
                  <h3 className="font-bold text-xl text-center mb-2 text-senegal-green">Support 24/7</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Assistance en français et wolof
                  </p>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* COLONNE DROITE - Réservation STICKY */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="card-ultra shadow-senegal-xl p-8 bg-white">
                <h3 className="text-2xl font-black mb-6 text-center">
                  <span className="gradient-text-senegal">Réservez maintenant</span>
                </h3>
                
                {/* Prix récap */}
                <div className="text-center mb-6 p-6 glass-card rounded-2xl">
                  <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">Prix par personne</div>
                  <div className="text-5xl font-black text-senegal-green mb-1">
                    {formatCurrency(trip.price)}
                  </div>
                  <div className="text-xs text-gray-500">FCFA</div>
                </div>
                
                {/* Sélecteur nombre */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-3 text-gray-700">
                    👥 Nombre de places
                  </label>
                  <select
                    value={numberOfSeats}
                    onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                    className="w-full input-modern text-lg font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} place{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Récap prix */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix unitaire</span>
                    <span className="font-semibold">{formatCurrency(trip.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nombre de places</span>
                    <span className="font-semibold">× {numberOfSeats}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-black text-senegal-green">
                      {formatCurrency(trip.price * numberOfSeats)}
                    </span>
                  </div>
                  <div className="text-xs text-center text-gray-500">
                    Toutes taxes comprises
                  </div>
                </div>
                
                {/* Bouton Réserver MEGA */}
                <button
                  onClick={handleBooking}
                  disabled={createBooking.isPending || trip.availableSeats === 0}
                  className="w-full btn-primary text-xl py-5 ripple shadow-senegal-xl hover:shadow-senegal-2xl group disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-3xl">🎫</span>
                    <span className="font-black">
                      {createBooking.isPending ? 'Réservation...' : 'Réserver maintenant'}
                    </span>
                    <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </button>
                
                {/* Trust badges */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>🔒</span>
                    <span>Paiement 100% sécurisé SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>💰</span>
                    <span>Orange Money • Wave • Free Money</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>⚡</span>
                    <span>Confirmation instantanée</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>🇸🇳</span>
                    <span>100% Sénégalais</span>
                  </div>
                </div>
                
                {/* Besoin d'aide */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Besoin d'aide ?</div>
                    <div className="flex flex-col gap-2">
                      <a href="tel:+221338123456" className="text-senegal-green font-semibold hover:underline">
                        📞 +221 33 812 34 56
                      </a>
                      <a href="#" className="text-senegal-green font-semibold hover:underline">
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
