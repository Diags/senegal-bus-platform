'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

export function useAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier la session dans localStorage
    const session = localStorage.getItem('bus_senegal_session')
    if (session) {
      try {
        const data = JSON.parse(session)
        setIsAuthenticated(data.isAuthenticated || false)
        setUser(data.user || null)
      } catch (error) {
        console.error('Invalid session data:', error)
        localStorage.removeItem('bus_senegal_session')
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = (returnUrl?: string) => {
    const url = returnUrl 
      ? `/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`
      : '/auth/signin'
    router.push(url)
  }

  const signOut = () => {
    localStorage.removeItem('bus_senegal_session')
    setIsAuthenticated(false)
    setUser(null)
    router.push('/')
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  }
}

