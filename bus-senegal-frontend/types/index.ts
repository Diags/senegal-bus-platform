// User & Auth Types
export interface User {
  id: number
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  role: 'CLIENT' | 'COMPAGNIE' | 'ADMIN'
  companyId?: number
}

// Company Types
export interface Company {
  id: number
  name: string
  email: string
  phone: string
  address?: string
  logoUrl?: string
  description?: string
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED'
  subdomain?: string
  createdAt: string
  updatedAt: string
}

// Trip Types
export interface Trip {
  id: number
  routeId: number
  departureCity: string
  arrivalCity: string
  departureDateTime: string
  arrivalDateTime: string
  price: number
  availableSeats: number
  totalSeats: number
  status: 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
  busId: number
  busBrand: string
  busModel: string
  hasWifi: boolean
  hasAC: boolean
  hasToilet: boolean
  companyName: string
  companyLogoUrl?: string
}

export interface TripSearchParams {
  departureCity: string
  arrivalCity: string
  departureDate: string
  passengers?: number
}

// Booking Types
export interface Booking {
  id: number
  bookingNumber: string
  userId: number
  tripId: number
  seatId: number
  numberOfSeats: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'
  trip: Trip
  user?: User
  createdAt: string
  updatedAt: string
}

export interface CreateBookingRequest {
  tripId: number
  seatId?: number
  numberOfSeats: number
}

// Payment Types
export interface Payment {
  id: number
  transactionId: string
  bookingId: number
  bookingNumber: string
  paymentMethod: 'ORANGE_MONEY' | 'WAVE' | 'FREE_MONEY' | 'PAYTECH' | 'CASH'
  amount: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
  provider?: string
  paymentUrl?: string
  qrCode?: string
  message?: string
  paidAt?: string
  createdAt: string
}

export interface CreatePaymentRequest {
  bookingId: number
  paymentMethod: 'ORANGE_MONEY' | 'WAVE' | 'FREE_MONEY' | 'PAYTECH'
}

// Analytics Types
export interface Analytics {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  pendingBookings: number
  totalRevenue: number
  monthlyRevenue: number
  averageBookingValue: number
  totalTrips: number
  activeTrips: number
  completedTrips: number
  averageOccupancyRate: number
  topRoutes: Record<string, number>
  bookingsTrend: Record<string, number>
}

// API Response Types
export interface ApiError {
  message: string
  status: number
  timestamp: string
  validationErrors?: Record<string, string>
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

