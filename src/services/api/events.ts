import apiClient from './client'
import type {
  ApiResponse,
  Event,
  EventWithAvailability,
  CreateEventRequest,
  UpdateEventRequest,
} from '@/types'

export const eventsApi = {
  // Get all active events
  getAll: () => {
    return apiClient.get<ApiResponse<Event[]>>('/events')
  },

  // Get all events with availability info
  getAllWithAvailability: () => {
    return apiClient.get<ApiResponse<EventWithAvailability[]>>('/events/availability')
  },

  // Get single event by ID
  getById: (id: number) => {
    return apiClient.get<ApiResponse<Event>>(`/events/${id}`)
  },

  // Get event with availability info
  getByIdWithAvailability: (id: number) => {
    return apiClient.get<ApiResponse<EventWithAvailability>>(`/events/${id}/availability`)
  },

  // Create new event
  create: (data: CreateEventRequest) => {
    return apiClient.post<ApiResponse<Event>>('/events', data)
  },

  // Update event
  update: (id: number, data: UpdateEventRequest) => {
    return apiClient.put<ApiResponse<Event>>(`/events/${id}`, data)
  },

  // Deactivate event (soft delete)
  delete: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/events/${id}`)
  },
}
