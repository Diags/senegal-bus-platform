// Helper pour gérer les réservations en attente (avant connexion)

export interface PendingBooking {
  tripId: number
  numberOfSeats: number
  returnUrl: string
}

const STORAGE_KEY = 'bus_senegal_pending_booking'

export const pendingBooking = {
  // Stocker une réservation en attente
  set: (booking: PendingBooking) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(booking))
    }
  },

  // Récupérer la réservation en attente
  get: (): PendingBooking | null => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        try {
          return JSON.parse(data)
        } catch (error) {
          console.error('Error parsing pending booking:', error)
          return null
        }
      }
    }
    return null
  },

  // Supprimer la réservation en attente
  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  },

  // Vérifier si une réservation est en attente
  exists: (): boolean => {
    return pendingBooking.get() !== null
  },
}

