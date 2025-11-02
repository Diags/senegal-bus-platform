'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchForm() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState({
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    passengers: 1,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams({
      from: searchParams.departureCity,
      to: searchParams.arrivalCity,
      date: searchParams.departureDate,
      passengers: searchParams.passengers.toString(),
    })
    
    router.push(`/trajets/recherche?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      {/* Grid responsive et parfaitement alignée */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Départ */}
        <div className="relative">
          <label htmlFor="departure" className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span>Départ</span>
          </label>
          <div className="relative">
            <span className="input-icon">🏙️</span>
            <input
              id="departure"
              type="text"
              placeholder="Ex: Dakar"
              value={searchParams.departureCity}
              onChange={(e) => setSearchParams({ ...searchParams, departureCity: e.target.value })}
              required
              className="input-modern input-with-icon"
              list="cities-departure"
            />
            <datalist id="cities-departure">
              <option value="Dakar" />
              <option value="Thiès" />
              <option value="Saint-Louis" />
              <option value="Kaolack" />
              <option value="Touba" />
              <option value="Ziguinchor" />
              <option value="Tambacounda" />
              <option value="Mbour" />
            </datalist>
          </div>
        </div>
        
        {/* Arrivée */}
        <div className="relative">
          <label htmlFor="arrival" className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span>Arrivée</span>
          </label>
          <div className="relative">
            <span className="input-icon">🏛️</span>
            <input
              id="arrival"
              type="text"
              placeholder="Ex: Saint-Louis"
              value={searchParams.arrivalCity}
              onChange={(e) => setSearchParams({ ...searchParams, arrivalCity: e.target.value })}
              required
              className="input-modern input-with-icon"
              list="cities-arrival"
            />
            <datalist id="cities-arrival">
              <option value="Saint-Louis" />
              <option value="Touba" />
              <option value="Thiès" />
              <option value="Kaolack" />
              <option value="Ziguinchor" />
              <option value="Tambacounda" />
              <option value="Mbour" />
              <option value="Dakar" />
            </datalist>
          </div>
        </div>
        
        {/* Date */}
        <div className="relative">
          <label htmlFor="date" className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span>Date</span>
          </label>
          <div className="relative">
            <span className="input-icon">📆</span>
            <input
              id="date"
              type="date"
              value={searchParams.departureDate}
              onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
              className="input-modern input-with-icon"
            />
          </div>
        </div>
        
        {/* Passagers */}
        <div className="relative">
          <label htmlFor="passengers" className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
            <span className="text-lg">👥</span>
            <span>Passagers</span>
          </label>
          <div className="relative">
            <span className="input-icon">👤</span>
            <input
              id="passengers"
              type="number"
              min="1"
              max="10"
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) || 1 })}
              required
              className="input-modern input-with-icon"
            />
          </div>
        </div>
      </div>
      
      {/* Big Search Button - Parfaitement centré */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="btn-primary ripple text-xl px-16 py-5 shadow-senegal-xl hover-glow w-full md:w-auto"
        >
          <span className="flex items-center justify-center gap-3">
            <span className="text-2xl">🔍</span>
            <span className="font-black">Rechercher des trajets</span>
            <span className="text-2xl">→</span>
          </span>
        </button>
      </div>
      
      {/* Helper text */}
      <p className="text-center text-sm text-gray-500 mt-4">
        💡 <span className="font-semibold">Astuce :</span> Réservez à l'avance pour bénéficier des meilleurs prix
      </p>
    </form>
  )
}

