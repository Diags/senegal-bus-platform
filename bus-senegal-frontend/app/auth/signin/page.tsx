'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulation connexion (1 seconde)
    setTimeout(() => {
      // Créer la session dans localStorage
      const session = {
        user: {
          id: 1,
          email,
          firstName: email.split('@')[0],
          lastName: 'User',
        },
        isAuthenticated: true,
      }

      localStorage.setItem('bus_senegal_session', JSON.stringify(session))

      // Redirect vers returnUrl ou dashboard
      const params = new URLSearchParams(window.location.search)
      const returnUrl = params.get('returnUrl') || '/dashboard'
      router.push(returnUrl)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Barre tricolore */}
      <div className="gradient-senegal h-2 w-full fixed top-0 z-50"></div>
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background pattern */}
        <div className="pattern-african absolute inset-0 opacity-30"></div>
        
        {/* Form Container */}
        <div className="w-full max-w-md relative z-10">
          {/* Logo & Back */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🚌</span>
            <span className="text-2xl font-bold text-senegal-green">Bus Sénégal</span>
          </Link>

          {/* Welcome */}
          <div className="mb-8 animate-fadeInUp">
            <h1 className="heading-lg text-senegal-green mb-3">
              Nangadef ! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Connectez-vous pour réserver vos trajets
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="input-modern"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-modern"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm animate-shake">
                ❌ {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-senegal-green focus:ring-senegal-green" />
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <Link href="/auth/forgot-password" className="text-senegal-green font-semibold hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary ripple text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading-spinner w-5 h-5"></span>
                  Connexion...
                </span>
              ) : (
                <span>Se connecter 🚀</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-senegal-green hover:bg-gray-50 transition-all"
              >
                <span className="text-xl">🔵</span>
                <span className="font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-senegal-green hover:bg-gray-50 transition-all"
              >
                <span className="text-xl">📘</span>
                <span className="font-medium">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-6">
              Pas encore de compte ?{' '}
              <Link href="/auth/signup" className="text-senegal-green font-bold hover:underline">
                Inscrivez-vous gratuitement →
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Visual (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden"
           style={{background: 'linear-gradient(135deg, var(--senegal-green) 0%, var(--senegal-green-dark) 100%)'}}>
        
        {/* Pattern overlay */}
        <div className="pattern-african absolute inset-0 opacity-10"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white space-y-8 animate-fadeInUp">
          {/* Icon */}
          <div className="text-9xl animate-float">🚌</div>
          
          {/* Title */}
          <h2 className="text-4xl font-bold leading-tight">
            Voyagez à travers<br />
            le Sénégal 🇸🇳
          </h2>
          
          {/* Benefits */}
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3 glass-card-dark p-4 rounded-xl">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="font-bold mb-1">Réservation en 2 minutes</h3>
                <p className="text-white/80 text-sm">Simple, rapide et sécurisé</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 glass-card-dark p-4 rounded-xl">
              <span className="text-2xl">💳</span>
              <div>
                <h3 className="font-bold mb-1">Paiement local</h3>
                <p className="text-white/80 text-sm">Orange Money, Wave, Free Money</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 glass-card-dark p-4 rounded-xl">
              <span className="text-2xl">🎫</span>
              <div>
                <h3 className="font-bold mb-1">E-billet instantané</h3>
                <p className="text-white/80 text-sm">Reçu par SMS, Email et WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">5+</div>
              <div className="text-white/80 text-sm">Compagnies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">15+</div>
              <div className="text-white/80 text-sm">Trajets/jour</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">100%</div>
              <div className="text-white/80 text-sm">Sécurisé</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

