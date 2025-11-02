import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsApi } from '@/lib/api/payments'
import { CreatePaymentRequest } from '@/types'

export function useInitiatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payment: CreatePaymentRequest) => paymentsApi.initiate(payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}

export function usePayment(id: number) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => paymentsApi.getById(id),
    enabled: !!id,
  })
}

export function usePaymentStatus(transactionId: string) {
  return useQuery({
    queryKey: ['payments', 'status', transactionId],
    queryFn: () => paymentsApi.checkStatus(transactionId),
    enabled: !!transactionId,
    refetchInterval: 5000, // Check status every 5 seconds
  })
}

export function useBookingPayments(bookingId: number) {
  return useQuery({
    queryKey: ['payments', 'booking', bookingId],
    queryFn: () => paymentsApi.getByBookingId(bookingId),
    enabled: !!bookingId,
  })
}

