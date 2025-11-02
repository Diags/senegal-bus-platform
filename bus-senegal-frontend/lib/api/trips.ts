import apiClient from './client'
import { Trip, TripSearchParams } from '@/types'

export const tripsApi = {
  search: async (params: TripSearchParams): Promise<Trip[]> => {
    const { data } = await apiClient.get('/trips/search', { params })
    return data
  },

  getById: async (id: number): Promise<Trip> => {
    const { data } = await apiClient.get(`/trips/${id}`)
    return data
  },

  create: async (trip: Partial<Trip>): Promise<Trip> => {
    const { data } = await apiClient.post('/trips', trip)
    return data
  },

  update: async (id: number, trip: Partial<Trip>): Promise<Trip> => {
    const { data } = await apiClient.put(`/trips/${id}`, trip)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/trips/${id}`)
  },

  checkAvailability: async (tripId: number): Promise<{ available: boolean; seats: number }> => {
    const { data } = await apiClient.get(`/trips/${tripId}/availability`)
    return data
  },
}

