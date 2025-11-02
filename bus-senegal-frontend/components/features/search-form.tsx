'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

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
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="departure" className="block text-sm font-medium mb-2">
                Ville de départ
              </label>
              <Input
                id="departure"
                placeholder="Ex: Dakar"
                value={searchParams.departureCity}
                onChange={(e) => setSearchParams({ ...searchParams, departureCity: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label htmlFor="arrival" className="block text-sm font-medium mb-2">
                Ville d'arrivée
              </label>
              <Input
                id="arrival"
                placeholder="Ex: Saint-Louis"
                value={searchParams.arrivalCity}
                onChange={(e) => setSearchParams({ ...searchParams, arrivalCity: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date de départ
              </label>
              <Input
                id="date"
                type="date"
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label htmlFor="passengers" className="block text-sm font-medium mb-2">
                Nombre de passagers
              </label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="10"
                value={searchParams.passengers}
                onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            Rechercher des trajets
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

