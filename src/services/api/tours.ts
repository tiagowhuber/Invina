import apiClient from './client'
import type {
  ApiResponse,
  Tour,
  Wine,
  TourAvailabilityResponse,
} from '@/types'

export const toursApi = {
  // Get all active tours
  getAll: () => {
    return apiClient.get<ApiResponse<Tour[]>>('/tours')
  },

  // Get single tour by ID
  getById: (id: number) => {
    return apiClient.get<ApiResponse<Tour>>(`/tours/${id}`)
  },

  // Get available wines for a tour
  getWines: (tourId: number) => {
    return apiClient.get<ApiResponse<Wine[]>>(`/tours/${tourId}/wines`)
  },

  // Get availability for a tour on a specific date
  getAvailability: (tourId: number, date: string) => {
    return apiClient.get<ApiResponse<TourAvailabilityResponse>>(`/tours/${tourId}/availability`, {
      params: { date }
    })
  },
}
