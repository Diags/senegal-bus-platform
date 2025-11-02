import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripsApi } from '@/lib/api/trips'
import { TripSearchParams } from '@/types'

export function useSearchTrips(params: TripSearchParams) {
  return useQuery({
    queryKey: ['trips', 'search', params],
    queryFn: () => tripsApi.search(params),
    enabled: !!params.departureCity && !!params.arrivalCity && !!params.departureDate,
  })
}

export function useTrip(id: number) {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: () => tripsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tripsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useCheckAvailability(tripId: number) {
  return useQuery({
    queryKey: ['trips', tripId, 'availability'],
    queryFn: () => tripsApi.checkAvailability(tripId),
    enabled: !!tripId,
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

