'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSearchTrips } from '@/hooks/useTrips'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

function SearchResults() {
  const searchParams = useSearchParams()
  
  const params = {
    departureCity: searchParams.get('from') || '',
    arrivalCity: searchParams.get('to') || '',
    departureDate: searchParams.get('date') || '',
    passengers: parseInt(searchParams.get('passengers') || '1'),
  }

  const { data: trips, isLoading, error } = useSearchTrips(params)

  // Helper function to calculate duration
  const calculateDuration = (departure: string, arrival: string) => {
    const diff = new Date(arrival).getTime() - new Date(departure).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h${minutes.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Barre tricolore */}
        <div className="gradient-senegal h-1 w-full"></div>
        
        <div className="space-container py-12">
          {/* Skeleton Header */}
          <div className="mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          
          {/* Skeleton Cards with shimmer */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-ultra p-6 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Loading message */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 glass-card px-6 py-4 rounded-full shadow-senegal-md">
              <div className="w-6 h-6 border-3 border-senegal-green border-t-transparent rounded-full animate-spin"></div>
              <span className="font-semibold text-senegal-green text-lg">
                Recherche des meilleurs trajets pour vous...
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Barre tricolore */}
        <div className="gradient-senegal h-1 w-full"></div>
        
        <div className="space-container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card-ultra p-12 shadow-senegal-xl">
              {/* Icon */}
              <div className="text-8xl mb-6 animate-float">😔</div>
              
              {/* Title */}
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Oups ! Un petit problème...
              </h2>
              
              {/* Message Teranga */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Avec la <span className="font-bold text-teranga-orange">Teranga</span> sénégalaise, 
                nous allons arranger ça tout de suite ! 🇸🇳
              </p>
              
              {/* Error details */}
              <div className="glass-card p-4 rounded-xl mb-8 text-sm text-gray-500">
                Une erreur est survenue lors de la recherche
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-primary px-8 py-4 text-lg ripple"
                >
                  🔄 Réessayer
                </button>
                <Link href="/" className="btn-secondary px-8 py-4 text-lg">
                  🏠 Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Barre tricolore */}
      <div className="gradient-senegal h-1 w-full"></div>
      
      {/* Hero Section - Search Summary ULTRA */}
      <section className="relative overflow-hidden bg-white shadow-md mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-senegal-green/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-senegal-yellow/5 rounded-full blur-3xl"></div>
        
        <div className="space-container relative z-10 py-8">
          {/* Route avec icônes */}
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <div className="text-center">
              <div className="text-5xl mb-2">📍</div>
              <h1 className="text-3xl md:text-4xl font-black text-senegal-green">
                {params.departureCity}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-1 w-16 md:w-32 bg-gradient-to-r from-senegal-green via-senegal-yellow to-senegal-red rounded-full"></div>
              <span className="text-4xl animate-float">🚌</span>
              <div className="h-1 w-16 md:w-32 bg-gradient-to-r from-senegal-red via-senegal-yellow to-senegal-green rounded-full"></div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-2">🎯</div>
              <h1 className="text-3xl md:text-4xl font-black text-senegal-green">
                {params.arrivalCity}
              </h1>
            </div>
          </div>
          
          {/* Informations voyage */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="glass-card px-5 py-3 rounded-full shadow-senegal-sm">
              <span className="text-2xl mr-2">📅</span>
              <span className="font-semibold text-gray-800">
                {new Date(params.departureDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            
            <div className="glass-card px-5 py-3 rounded-full shadow-senegal-sm">
              <span className="text-2xl mr-2">👥</span>
              <span className="font-semibold text-gray-800">
                {params.passengers} passager{params.passengers > 1 ? 's' : ''}
              </span>
            </div>
            
            <Link 
              href="/" 
              className="glass-card px-5 py-3 rounded-full shadow-senegal-sm hover-lift cursor-pointer group"
            >
              <span className="text-2xl mr-2 group-hover:rotate-180 transition-transform inline-block">🔄</span>
              <span className="font-semibold text-senegal-green">
                Modifier la recherche
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      <div className="space-container pb-12">

      {/* Results Counter */}
      {trips && trips.length > 0 ? (
        <div className="space-y-6">
          {/* Header avec nombre de résultats */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full shadow-senegal-sm">
              <span className="text-3xl">✅</span>
              <span className="font-bold text-lg text-senegal-green">
                {trips.length} trajet{trips.length > 1 ? 's' : ''} disponible{trips.length > 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Tri (optionnel pour plus tard) */}
            <div className="text-sm text-gray-500">
              Triés par heure de départ
            </div>
          </div>
          
          {/* Cards Trajets ULTRA MODERNES */}
          <div className="space-y-4">
          {trips.map((trip, index) => {
            const duration = calculateDuration(trip.departureDateTime, trip.arrivalDateTime)
            const departTime = new Date(trip.departureDateTime).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })
            const arriveTime = new Date(trip.arrivalDateTime).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })
            
            // Badge statut selon disponibilité
            const availabilityPercent = (trip.availableSeats / trip.totalSeats) * 100
            let statusBadge = { text: '🟢 Disponible', color: 'bg-green-100 text-green-800' }
            if (availabilityPercent < 20) {
              statusBadge = { text: '⏱️ Derniers sièges', color: 'bg-orange-100 text-orange-800' }
            } else if (availabilityPercent < 50) {
              statusBadge = { text: '🔥 Populaire', color: 'bg-yellow-100 text-yellow-800' }
            }
            
            return (
            <div 
              key={trip.id} 
              className="card-ultra hover-lift group cursor-pointer animate-fadeInUp relative overflow-hidden"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              {/* Gradient overlay au hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-senegal-green/0 to-senegal-green/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative z-10 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Colonne 1: Horaires & Timeline (5 cols) */}
                  <div className="lg:col-span-5">
                    {/* Badge statut */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                    
                    {/* Timeline moderne */}
                    <div className="flex items-center gap-4">
                      {/* Départ */}
                      <div className="text-center">
                        <div className="text-3xl font-black text-senegal-green mb-1">
                          {departTime}
                        </div>
                        <div className="text-sm font-semibold text-gray-600">
                          {trip.departureCity}
                        </div>
                      </div>
                      
                      {/* Timeline */}
                      <div className="flex-1 relative">
                        <div className="h-0.5 bg-gradient-to-r from-senegal-green via-senegal-yellow to-senegal-red relative">
                          {/* Point départ */}
                          <div className="absolute -left-2 -top-2 w-5 h-5 rounded-full bg-senegal-green border-2 border-white shadow-md"></div>
                          {/* Bus icon */}
                          <div className="absolute left-1/2 -translate-x-1/2 -top-4">
                            <span className="text-2xl">🚌</span>
                          </div>
                          {/* Point arrivée */}
                          <div className="absolute -right-2 -top-2 w-5 h-5 rounded-full bg-senegal-red border-2 border-white shadow-md"></div>
                        </div>
                        {/* Durée */}
                        <div className="text-center mt-2">
                          <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                            ⏱️ {duration}
                          </span>
                        </div>
                      </div>
                      
                      {/* Arrivée */}
                      <div className="text-center">
                        <div className="text-3xl font-black text-senegal-red mb-1">
                          {arriveTime}
                        </div>
                        <div className="text-sm font-semibold text-gray-600">
                          {trip.arrivalCity}
                        </div>
                      </div>
                    </div>
                    
                    {/* Compagnie & Bus */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-senegal-green/10 center-flex text-xl">
                          🏢
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{trip.companyName}</div>
                          <div className="text-sm text-gray-500">{trip.busBrand} {trip.busModel}</div>
                        </div>
                      </div>
                      
                      {/* Équipements */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {trip.hasWifi && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                            <span>📶</span> WiFi
                          </span>
                        )}
                        {trip.hasAC && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-semibold">
                            <span>❄️</span> Climatisé
                          </span>
                        )}
                        {trip.hasToilet && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
                            <span>🚽</span> Toilettes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Colonne 2: Disponibilité (3 cols) */}
                  <div className="lg:col-span-3 center-flex flex-col">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Places disponibles
                      </div>
                      <div className="text-5xl font-black text-senegal-green mb-1">
                        {trip.availableSeats}
                      </div>
                      <div className="text-sm text-gray-500">
                        sur <span className="font-semibold">{trip.totalSeats}</span> places
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-senegal-green to-senegal-yellow transition-all"
                          style={{width: `${availabilityPercent}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Colonne 3: Prix & Action (4 cols) */}
                  <div className="lg:col-span-4 center-flex flex-col gap-4">
                    {/* Prix MEGA */}
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Prix par personne
                      </div>
                      <div className="text-5xl font-black text-senegal-green mb-1">
                        {formatCurrency(trip.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        FCFA • Toutes taxes comprises
                      </div>
                    </div>
                    
                    {/* Bouton Réserver MEGA */}
                    <Link 
                      href={`/trajets/${trip.id}`}
                      className="w-full"
                    >
                      <button className="w-full btn-primary text-lg py-4 ripple shadow-senegal-lg hover:shadow-senegal-xl group">
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-2xl">🎫</span>
                          <span className="font-black">Réserver maintenant</span>
                          <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </button>
                    </Link>
                    
                    {/* Info prix total */}
                    {params.passengers > 1 && (
                      <div className="text-center text-sm text-gray-600">
                        Total pour {params.passengers} passagers: <span className="font-bold text-senegal-green">{formatCurrency(trip.price * params.passengers)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            )
          })}
          </div>
        </div>
      ) : (
        /* Empty State ULTRA Sénégalais */
        <div className="max-w-3xl mx-auto text-center py-12">
          <div className="card-ultra p-12 shadow-senegal-xl">
            {/* Illustration */}
            <div className="flex justify-center gap-4 mb-8">
              <span className="text-8xl animate-float">🚌</span>
              <span className="text-8xl animate-float" style={{animationDelay: '0.5s'}}>🇸🇳</span>
            </div>
            
            {/* Titre */}
            <h2 className="text-4xl font-black mb-4">
              <span className="gradient-text-senegal">Aucun trajet trouvé</span>
            </h2>
            
            {/* Message Teranga */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Avec la <span className="font-bold text-teranga-orange">Teranga</span> sénégalaise, 
              nous cherchons toujours la meilleure solution pour vous ! 
            </p>
            
            {/* Suggestions */}
            <div className="glass-card p-6 rounded-2xl mb-8 text-left">
              <h3 className="font-bold text-lg mb-4 text-center">💡 Suggestions :</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">📅</span>
                  <span>Essayez une autre date (le lendemain ou le jour précédent)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🔄</span>
                  <span>Inversez les villes de départ et d'arrivée</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🗺️</span>
                  <span>Explorez d'autres destinations populaires</span>
                </li>
              </ul>
            </div>
            
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
          
          {/* Destinations populaires suggestion */}
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              🗺️ Destinations populaires depuis {params.departureCity}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Saint-Louis', 'Touba', 'Thiès', 'Ziguinchor'].map((city) => (
                <Link
                  key={city}
                  href={`/trajets/recherche?from=${params.departureCity}&to=${city}&date=${params.departureDate}&passengers=${params.passengers}`}
                  className="card-ultra hover-lift p-4 text-center group"
                >
                  <div className="text-3xl mb-2">🏛️</div>
                  <div className="font-bold text-senegal-green group-hover:scale-110 transition-transform">
                    {city}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Footer Section - Support */}
      <div className="mt-16 pt-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="card-ultra p-8 shadow-senegal-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">
                <span className="gradient-text-senegal">Besoin d'aide ?</span>
              </h3>
              <p className="text-gray-600">
                Notre équipe est là pour vous accompagner avec la Teranga sénégalaise 🇸🇳
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Téléphone */}
              <div className="text-center p-4 glass-card rounded-xl hover-lift">
                <div className="text-4xl mb-3">📞</div>
                <div className="font-bold text-senegal-green mb-1">+221 33 812 34 56</div>
                <div className="text-sm text-gray-500">Lun-Dim 7h-22h</div>
              </div>
              
              {/* WhatsApp */}
              <div className="text-center p-4 glass-card rounded-xl hover-lift">
                <div className="text-4xl mb-3">💬</div>
                <div className="font-bold text-senegal-green mb-1">WhatsApp</div>
                <div className="text-sm text-gray-500">Réponse rapide</div>
              </div>
              
              {/* Email */}
              <div className="text-center p-4 glass-card rounded-xl hover-lift">
                <div className="text-4xl mb-3">📧</div>
                <div className="font-bold text-senegal-green mb-1">contact@bus-senegal.sn</div>
                <div className="text-sm text-gray-500">24h/24</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      </div>
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
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
    }>
      <SearchResults />
    </Suspense>
  )
}

