'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { pendingBooking } from '@/lib/pendingBooking'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (pass: string) => {
    let strength = 0
    if (pass.length >= 8) strength++
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++
    if (/\d/.test(pass)) strength++
    if (/[^a-zA-Z\d]/.test(pass)) strength++
    setPasswordStrength(strength)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordStrength < 2) {
      setError('Mot de passe trop faible. Utilisez au moins 8 caractères avec majuscules et chiffres.')
      return
    }

    setIsLoading(true)

    // Simulation inscription (1 seconde)
    setTimeout(async () => {
      // Créer la session directement (pour démo)
      const session = {
        user: {
          id: 1,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        isAuthenticated: true,
      }

      localStorage.setItem('bus_senegal_session', JSON.stringify(session))

      // Vérifier si une réservation est en attente
      const pending = pendingBooking.get()
      
      if (pending) {
        // Créer la réservation automatiquement
        try {
          const response = await fetch('http://localhost:8080/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tripId: pending.tripId,
              numberOfSeats: pending.numberOfSeats,
            }),
          })

          if (response.ok) {
            const booking = await response.json()
            // Clear pending booking
            pendingBooking.clear()
            // Redirect direct vers paiement !
            router.push(`/reservations/${booking.id}/paiement`)
            setIsLoading(false)
            return
          }
        } catch (error) {
          console.error('Auto-booking failed:', error)
        }
      }

      // Pas de pending booking - redirect normal
      const params = new URLSearchParams(window.location.search)
      const returnUrl = params.get('returnUrl') || '/dashboard'
      router.push(returnUrl)
      setIsLoading(false)
    }, 1000)
  }

  const strengthColors = ['#EF4444', '#F59E0B', '#FBBF24', '#10B981']
  const strengthLabels = ['Faible', 'Moyen', 'Bon', 'Excellent']

  return (
    <div className="min-h-screen flex">
      {/* Barre tricolore */}
      <div className="gradient-senegal h-2 w-full fixed top-0 z-50"></div>

      {/* Right Side - Visual (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden gradient-hero">
        {/* Pattern */}
        <div className="pattern-african absolute inset-0 opacity-20"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center space-y-8">
          {/* Illustration */}
          <div className="relative">
            <div className="text-9xl animate-float">🚌</div>
            <div className="absolute -top-4 -right-4 text-4xl animate-bounce-in" style={{animationDelay: '0.3s'}}>
              🇸🇳
            </div>
          </div>
          
          {/* Title */}
          <div className="space-y-3">
            <h2 className="heading-xl gradient-text-senegal">
              Bienvenue !
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Rejoignez des milliers de voyageurs satisfaits
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="card-ultra text-center p-6 hover-lift">
              <div className="text-4xl mb-3">⚡</div>
              <div className="font-bold text-senegal-green">Réservation</div>
              <div className="text-sm text-gray-600">En 2 minutes</div>
            </div>
            <div className="card-ultra text-center p-6 hover-lift">
              <div className="text-4xl mb-3">💰</div>
              <div className="font-bold text-senegal-green">Meilleurs Prix</div>
              <div className="text-sm text-gray-600">Garantis</div>
            </div>
            <div className="card-ultra text-center p-6 hover-lift">
              <div className="text-4xl mb-3">🎁</div>
              <div className="font-bold text-senegal-green">Offres</div>
              <div className="text-sm text-gray-600">Exclusives</div>
            </div>
            <div className="card-ultra text-center p-6 hover-lift">
              <div className="text-4xl mb-3">🤝</div>
              <div className="font-bold text-senegal-green">Teranga</div>
              <div className="text-sm text-gray-600">Service 24/7</div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-8 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🚌</span>
            <span className="text-2xl font-bold text-senegal-green">Bus Sénégal</span>
          </Link>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left animate-fadeInUp">
            <h1 className="text-3xl md:text-4xl font-bold text-senegal-green mb-3">
              Créer votre compte
            </h1>
            <p className="text-gray-600">
              Commencez à voyager avec la Teranga
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            {/* Names Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Amadou"
                  required
                  className="input-modern"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Diallo"
                  required
                  className="input-modern"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="amadou@example.com"
                required
                className="input-modern"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+221 77 123 45 67"
                required
                className="input-modern"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input-modern"
              />
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="h-1.5 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor: passwordStrength > level ? strengthColors[passwordStrength - 1] : '#E5E7EB'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{color: strengthColors[passwordStrength - 1] || '#6B7280'}}>
                    Force : {strengthLabels[passwordStrength - 1] || 'Très faible'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input-modern"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠️ Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm animate-shake">
                ❌ {error}
              </div>
            )}

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-senegal-green focus:ring-senegal-green" />
              <span className="text-sm text-gray-600">
                J'accepte les{' '}
                <Link href="/terms" className="text-senegal-green font-semibold hover:underline">
                  conditions d'utilisation
                </Link>
                {' '}et la{' '}
                <Link href="/privacy" className="text-senegal-green font-semibold hover:underline">
                  politique de confidentialité
                </Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary ripple text-lg py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading-spinner w-5 h-5"></span>
                  Création du compte...
                </span>
              ) : (
                <span>Créer mon compte 🚀</span>
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-gray-600 mt-6">
              Déjà un compte ?{' '}
              <Link href="/auth/signin" className="text-senegal-green font-bold hover:underline">
                Connectez-vous →
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

