import apiClient from './client'
import { Booking, CreateBookingRequest } from '@/types'

export const bookingsApi = {
  create: async (booking: CreateBookingRequest): Promise<Booking> => {
    const { data } = await apiClient.post('/bookings', booking)
    return data
  },

  getById: async (id: number): Promise<Booking> => {
    const { data } = await apiClient.get(`/bookings/${id}`)
    return data
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get('/bookings/my-bookings')
    return data
  },

  confirm: async (id: number): Promise<Booking> => {
    const { data } = await apiClient.put(`/bookings/${id}/confirm`)
    return data
  },

  cancel: async (id: number): Promise<void> => {
    await apiClient.put(`/bookings/${id}/cancel`)
  },
}

