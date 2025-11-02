'use client'

import { use, useState } from 'react'
import { useBooking } from '@/hooks/useBookings'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const bookingId = parseInt(resolvedParams.id)
  const router = useRouter()
  
  const { data: booking, isLoading } = useBooking(bookingId)
  const [selectedMethod, setSelectedMethod] = useState<'ORANGE_MONEY' | 'WAVE' | 'FREE_MONEY' | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    if (!selectedMethod || !phoneNumber) {
      alert('Veuillez sélectionner un mode de paiement et entrer votre numéro')
      return
    }

    setIsProcessing(true)
    
    // Simulation du paiement (2 secondes)
    setTimeout(() => {
      setIsProcessing(false)
      router.push(`/reservations/${bookingId}/confirmation`)
    }, 2000)
  }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Barre tricolore */}
      <div className="gradient-senegal h-1 w-full"></div>
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="space-container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-senegal-green transition-colors">🏠 Accueil</Link>
            <span>›</span>
            <Link href={`/trajets/${trip.id}`} className="hover:text-senegal-green transition-colors">Détails</Link>
            <span>›</span>
            <span className="text-senegal-green font-semibold">💳 Paiement</span>
          </div>
        </div>
      </div>
      
      <div className="space-container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-7xl">💳</span>
            </div>
            <h1 className="heading-lg mb-4">
              Finalisez votre <span className="gradient-text-senegal">Réservation</span>
            </h1>
            <p className="text-xl text-gray-600">
              Plus qu'une étape et c'est réglé ! 🎉
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* COLONNE GAUCHE - Paiement */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Choix mode de paiement */}
              <div className="card-ultra shadow-senegal-lg p-8">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <span className="text-3xl">💰</span>
                  Choisissez votre mode de paiement
                </h2>
                
                <div className="space-y-4">
                  {/* Orange Money */}
                  <div 
                    onClick={() => setSelectedMethod('ORANGE_MONEY')}
                    className={`p-6 rounded-2xl border-3 cursor-pointer transition-all ${
                      selectedMethod === 'ORANGE_MONEY' 
                        ? 'border-orange-500 bg-orange-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-orange-500 center-flex text-3xl shadow-md">
                        💰
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xl text-gray-900">Orange Money</div>
                        <div className="text-sm text-gray-600">Le plus populaire au Sénégal</div>
                      </div>
                      {selectedMethod === 'ORANGE_MONEY' && (
                        <div className="w-8 h-8 rounded-full bg-orange-500 center-flex text-white font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Wave */}
                  <div 
                    onClick={() => setSelectedMethod('WAVE')}
                    className={`p-6 rounded-2xl border-3 cursor-pointer transition-all ${
                      selectedMethod === 'WAVE' 
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-blue-500 center-flex text-3xl shadow-md">
                        📱
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xl text-gray-900">Wave</div>
                        <div className="text-sm text-gray-600">Rapide et sans frais</div>
                      </div>
                      {selectedMethod === 'WAVE' && (
                        <div className="w-8 h-8 rounded-full bg-blue-500 center-flex text-white font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Free Money */}
                  <div 
                    onClick={() => setSelectedMethod('FREE_MONEY')}
                    className={`p-6 rounded-2xl border-3 cursor-pointer transition-all ${
                      selectedMethod === 'FREE_MONEY' 
                        ? 'border-cyan-500 bg-cyan-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-cyan-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 center-flex text-3xl shadow-md">
                        💙
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-xl text-gray-900">Free Money</div>
                        <div className="text-sm text-gray-600">Simple et sécurisé</div>
                      </div>
                      {selectedMethod === 'FREE_MONEY' && (
                        <div className="w-8 h-8 rounded-full bg-cyan-500 center-flex text-white font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Formulaire paiement */}
              {selectedMethod && (
                <div className="card-ultra shadow-senegal-lg p-8 animate-scaleIn">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    Informations de paiement
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-3 text-gray-700">
                        📞 Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        placeholder="+221 77 123 45 67"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="input-modern w-full text-lg"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Le numéro associé à votre compte {selectedMethod === 'ORANGE_MONEY' ? 'Orange Money' : selectedMethod === 'WAVE' ? 'Wave' : 'Free Money'}
                      </p>
                    </div>
                    
                    <div className="glass-card p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">💡</span>
                        <div className="text-sm text-gray-700">
                          <strong>Comment ça marche ?</strong>
                          <ol className="mt-2 space-y-1 ml-4 list-decimal">
                            <li>Entrez votre numéro de téléphone</li>
                            <li>Cliquez sur "Payer"</li>
                            <li>Validez la transaction sur votre téléphone</li>
                            <li>Recevez votre e-billet instantanément</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Sécurité */}
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🔒</span>
                  <h3 className="font-bold text-lg">Paiement 100% Sécurisé</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Cryptage SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Données protégées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Conforme PCI-DSS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Certifié 🇸🇳</span>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* COLONNE DROITE - Récap */}
            <div className="lg:col-span-5">
              <div className="card-ultra shadow-senegal-xl p-8 sticky top-24">
                <h3 className="text-2xl font-black mb-6 text-center">
                  <span className="gradient-text-senegal">Récapitulatif</span>
                </h3>
                
                {/* Numéro réservation */}
                <div className="text-center mb-6 p-4 glass-card rounded-xl">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Numéro de réservation
                  </div>
                  <div className="text-2xl font-black text-senegal-green">
                    {booking.bookingNumber}
                  </div>
                </div>
                
                {/* Trajet */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-black text-senegal-green">{trip.departureCity}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(trip.departureDateTime).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="text-3xl">→</div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-senegal-red">{trip.arrivalCity}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(trip.arrivalDateTime).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600 mb-4">
                    {new Date(trip.departureDateTime).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  
                  <div className="glass-card p-3 rounded-xl text-sm">
                    <div className="font-semibold text-gray-900">{trip.companyName}</div>
                    <div className="text-gray-600">{trip.busBrand} {trip.busModel}</div>
                  </div>
                </div>
                
                {/* Détails prix */}
                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix par place</span>
                    <span className="font-semibold">{formatCurrency(trip.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nombre de places</span>
                    <span className="font-semibold">× {booking.numberOfSeats}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">Total à payer</span>
                    <span className="text-4xl font-black text-senegal-green">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div className="text-xs text-center text-gray-500 mt-2">
                    FCFA • Toutes taxes comprises
                  </div>
                </div>
                
                {/* Bouton Payer */}
                <button
                  onClick={handlePayment}
                  disabled={!selectedMethod || !phoneNumber || isProcessing}
                  className="w-full btn-primary text-xl py-5 ripple shadow-senegal-xl hover:shadow-senegal-2xl group disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                  <span className="flex items-center justify-center gap-3">
                    {isProcessing ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-black">Traitement en cours...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl">💳</span>
                        <span className="font-black">Payer {formatCurrency(total)}</span>
                        <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </span>
                </button>
                
                {/* Trust */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>Connexion sécurisée SSL 256-bit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>Confirmation instantanée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🇸🇳</span>
                    <span>Conforme aux normes sénégalaises</span>
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
