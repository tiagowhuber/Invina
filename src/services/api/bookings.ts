import apiClient from './client'
import type {
  ApiResponse,
  OrderWithDetails,
  CreateBookingRequest,
} from '@/types'

export const bookingsApi = {
  // Create new booking
  create: (data: CreateBookingRequest) => {
    return apiClient.post<ApiResponse<OrderWithDetails>>('/bookings', data)
  },

  // Get booking by order number
  getByOrderNumber: (orderNumber: string) => {
    return apiClient.get<ApiResponse<OrderWithDetails>>(`/bookings/${orderNumber}`)
  },
}
