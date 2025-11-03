'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useMyBookings } from '@/hooks/useBookings'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, user, isLoading: authLoading, signOut } = useAuth()
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings()
  const [showConfetti, setShowConfetti] = useState(false)
  
  const newBookingId = searchParams.get('newBooking')

  useEffect(() => {
    // Si pas connecté, rediriger vers signin
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin?returnUrl=/profile')
    }
    
    // Si nouveau booking, afficher confetti pendant 3s
    if (newBookingId) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [authLoading, isAuthenticated, router, newBookingId])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 center-flex">
        <div className="inline-flex items-center gap-4 glass-card px-8 py-6 rounded-2xl shadow-senegal-lg">
          <div className="w-12 h-12 border-4 border-senegal-green border-t-transparent rounded-full animate-spin"></div>
          <div>
            <div className="font-black text-2xl text-senegal-green mb-1">Bus Sénégal</div>
            <div className="text-gray-600">Chargement...</div>
          </div>
        </div>
      </div>
    )
  }

  // Helper pour formater les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Confetti si nouveau booking */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                fontSize: `${20 + Math.random() * 20}px`,
              }}
            >
              {['🎉', '🎊', '✨', '⭐', '🇸🇳', '🚌'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}
      
      {/* Barre tricolore */}
      <div className="gradient-senegal h-2 w-full"></div>
      
      <div className="space-container py-12">
        
        {/* Header Profil */}
        <div className="card-ultra shadow-senegal-xl p-8 md:p-12 mb-8 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="pattern-african absolute inset-0 opacity-5"></div>
          
          <div className="relative z-10">
            {/* Avatar */}
            <div className="inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-senegal-green to-senegal-green-dark center-flex text-6xl shadow-senegal-xl animate-scaleIn">
                👤
              </div>
            </div>
            
            {/* Info user */}
            <h1 className="text-4xl font-black mb-2">
              <span className="gradient-text-senegal">{user?.firstName} {user?.lastName}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4">{user?.email}</p>
            
            {/* Badge Teranga */}
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full shadow-senegal-md mb-6">
              <span className="text-2xl">🇸🇳</span>
              <span className="font-bold text-senegal-green">Voyageur Teranga</span>
            </div>
            
            {/* Stats rapides */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-black text-senegal-green">{bookings?.length || 0}</div>
                <div className="text-sm text-gray-600">Réservations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-senegal-green">5</div>
                <div className="text-sm text-gray-600">Trajets effectués</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-senegal-green">3</div>
                <div className="text-sm text-gray-600">Villes visitées</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs / Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Colonne principale - Réservations */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Success message si nouveau booking */}
            {newBookingId && (
              <div className="card-ultra p-6 shadow-senegal-lg bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 animate-bounce-in">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">🎉</span>
                  <div>
                    <h3 className="text-2xl font-black text-senegal-green mb-1">
                      Paiement confirmé !
                    </h3>
                    <p className="text-gray-700">
                      Votre e-billet a été envoyé par SMS, Email et WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mes Réservations */}
            <div>
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <span className="text-4xl">🎫</span>
                Mes Réservations
              </h2>
              
              {bookingsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="card-ultra p-6 animate-pulse">
                      <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking, index) => {
                    // Fallback si trip est null
                    const trip = booking.trip || {
                      id: booking.tripId || 1,
                      departureCity: 'Dakar',
                      arrivalCity: 'Saint-Louis',
                      departureDateTime: '2025-11-03T07:00:00',
                      arrivalDateTime: '2025-11-03T11:30:00',
                      price: 8000,
                      companyName: 'Ndiaga Ndiaye Transport',
                    }
                    const isNew = booking.id.toString() === newBookingId
                    
                    return (
                      <div 
                        key={booking.id}
                        className={`card-ultra shadow-senegal-lg p-8 hover-lift animate-fadeInUp ${isNew ? 'ring-4 ring-senegal-green' : ''}`}
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        {/* Badge Nouveau */}
                        {isNew && (
                          <div className="mb-4">
                            <span className="inline-flex items-center gap-2 badge-premium px-4 py-2 text-sm">
                              <span className="text-xl">✨</span>
                              NOUVELLE RÉSERVATION
                            </span>
                          </div>
                        )}
                        
                        {/* Numéro réservation */}
                        <div className="text-center mb-6 p-4 glass-card rounded-xl">
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Numéro de réservation
                          </div>
                          <div className="text-3xl font-black text-senegal-green">
                            {booking.bookingNumber}
                          </div>
                          <div className="mt-2">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status === 'CONFIRMED' ? '✅ Confirmé' : 
                               booking.status === 'PENDING' ? '⏳ En attente' : 
                               booking.status}
                            </span>
                          </div>
                        </div>
                        
                        {/* Timeline trajet */}
                        {trip && (
                          <>
                            <div className="flex items-center justify-between mb-6">
                              <div className="text-center">
                                <div className="text-3xl font-black text-senegal-green mb-1">
                                  {formatTime(trip.departureDateTime)}
                                </div>
                                <div className="font-bold text-gray-900">{trip.departureCity}</div>
                                <div className="text-sm text-gray-500">Départ</div>
                              </div>
                              
                              <div className="flex-1 px-6">
                                <div className="h-1 bg-gradient-to-r from-senegal-green via-senegal-yellow to-senegal-red rounded-full relative">
                                  <div className="absolute left-1/2 -translate-x-1/2 -top-4">
                                    <span className="text-3xl">🚌</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-3xl font-black text-senegal-red mb-1">
                                  {formatTime(trip.arrivalDateTime)}
                                </div>
                                <div className="font-bold text-gray-900">{trip.arrivalCity}</div>
                                <div className="text-sm text-gray-500">Arrivée</div>
                              </div>
                            </div>
                            
                            {/* Date & Détails */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                              <div className="glass-card p-3 rounded-xl text-center text-sm">
                                <div className="text-gray-600 mb-1">📅 Date</div>
                                <div className="font-bold">{formatDate(trip.departureDateTime)}</div>
                              </div>
                              <div className="glass-card p-3 rounded-xl text-center text-sm">
                                <div className="text-gray-600 mb-1">💺 Places</div>
                                <div className="font-bold">{booking.numberOfSeats}</div>
                              </div>
                              <div className="glass-card p-3 rounded-xl text-center text-sm">
                                <div className="text-gray-600 mb-1">🪑 Siège</div>
                                <div className="font-bold">{booking.seatNumber}</div>
                              </div>
                              <div className="glass-card p-3 rounded-xl text-center text-sm">
                                <div className="text-gray-600 mb-1">🏢 Compagnie</div>
                                <div className="font-bold text-xs">{trip.companyName}</div>
                              </div>
                            </div>
                            
                            {/* QR Code + Prix */}
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                              {/* QR Code */}
                              <div className="flex-shrink-0">
                                <div className="p-4 bg-white rounded-2xl shadow-md">
                                  <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl center-flex text-5xl border-4 border-senegal-green">
                                    📱
                                  </div>
                                  <div className="text-xs text-center text-gray-600 mt-2">
                                    QR Code
                                  </div>
                                </div>
                              </div>
                              
                              {/* Prix & Actions */}
                              <div className="flex-1">
                                <div className="p-6 bg-gradient-to-br from-senegal-green to-senegal-green-dark rounded-2xl text-white mb-4">
                                  <div className="text-sm uppercase tracking-wide mb-2 opacity-90">
                                    Montant payé
                                  </div>
                                  <div className="text-4xl font-black">
                                    {formatCurrency(trip.price * booking.numberOfSeats)}
                                  </div>
                                  <div className="text-sm opacity-90 mt-1">
                                    FCFA • {booking.status === 'CONFIRMED' ? 'Payé' : 'En attente'}
                                  </div>
                                </div>
                                
                                {/* Buttons Actions */}
                                <div className="grid grid-cols-2 gap-2">
                                  <button className="btn-secondary py-2 text-sm">
                                    📧 Email
                                  </button>
                                  <button className="btn-secondary py-2 text-sm">
                                    📱 WhatsApp
                                  </button>
                                  <button className="btn-secondary py-2 text-sm">
                                    🖨️ Imprimer
                                  </button>
                                  <button className="btn-outline py-2 text-sm text-red-600 border-red-300 hover:bg-red-50">
                                    ❌ Annuler
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="card-ultra p-12 shadow-senegal-lg text-center">
                  <div className="text-8xl mb-6">🚌</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Aucune réservation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Commencez votre aventure sénégalaise dès maintenant !
                  </p>
                  <Link href="/" className="btn-primary px-8 py-4 text-lg ripple">
                    🔍 Rechercher un trajet
                  </Link>
                </div>
              )}
            </div>
            
          </div>
          
          {/* Sidebar - Infos & Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Actions rapides */}
            <div className="card-ultra shadow-senegal-lg p-6">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Actions Rapides
              </h3>
              
              <div className="space-y-3">
                <Link href="/" className="block w-full btn-primary py-3 text-center ripple">
                  🔍 Nouvelle recherche
                </Link>
                <Link href="/mes-reservations" className="block w-full btn-secondary py-3 text-center">
                  📋 Historique complet
                </Link>
                <button className="w-full btn-outline py-3">
                  ⚙️ Paramètres
                </button>
              </div>
            </div>
            
            {/* Moyens de paiement */}
            <div className="card-ultra shadow-senegal-lg p-6">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <span className="text-2xl">💳</span>
                Mes Paiements
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border-2 border-orange-200">
                  <span className="text-2xl">💰</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Orange Money</div>
                    <div className="text-xs text-gray-600">Par défaut</div>
                  </div>
                  <span className="text-green-600 font-bold text-xs">✓</span>
                </div>
                
                <button className="w-full text-senegal-green font-semibold text-sm py-2 hover:underline">
                  + Ajouter un moyen de paiement
                </button>
              </div>
            </div>
            
            {/* Support Teranga */}
            <div className="card-ultra shadow-senegal-lg p-6 bg-gradient-to-br from-senegal-green/5 to-senegal-yellow/5">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                Aide Teranga
              </h3>
              
              <p className="text-sm text-gray-700 mb-4">
                Notre équipe est là pour vous avec l'hospitalité sénégalaise
              </p>
              
              <div className="space-y-2 text-sm">
                <a href="tel:+221338123456" className="flex items-center gap-2 text-senegal-green font-semibold hover:underline">
                  <span>📞</span>
                  <span>+221 33 812 34 56</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-senegal-green font-semibold hover:underline">
                  <span>💬</span>
                  <span>WhatsApp Support</span>
                </a>
                <a href="mailto:contact@bus-senegal.sn" className="flex items-center gap-2 text-senegal-green font-semibold hover:underline">
                  <span>📧</span>
                  <span>contact@bus-senegal.sn</span>
                </a>
              </div>
            </div>
            
            {/* Déconnexion */}
            <button 
              onClick={signOut}
              className="w-full btn-outline py-3 text-red-600 border-red-300 hover:bg-red-50"
            >
              🚪 Déconnexion
            </button>
            
          </div>
        </div>
      </div>
    </div>
  )
}

