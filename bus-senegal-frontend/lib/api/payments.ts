import apiClient from './client'
import { Payment, CreatePaymentRequest } from '@/types'

export const paymentsApi = {
  initiate: async (payment: CreatePaymentRequest): Promise<Payment> => {
    const { data } = await apiClient.post('/payments', payment)
    return data
  },

  getById: async (id: number): Promise<Payment> => {
    const { data } = await apiClient.get(`/payments/${id}`)
    return data
  },

  getByBookingId: async (bookingId: number): Promise<Payment[]> => {
    const { data } = await apiClient.get(`/payments/booking/${bookingId}`)
    return data
  },

  checkStatus: async (transactionId: string): Promise<Payment> => {
    const { data } = await apiClient.get(`/payments/status/${transactionId}`)
    return data
  },
}

