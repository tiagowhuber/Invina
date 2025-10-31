import apiClient from './client'
import type {
  ApiResponse,
  Ticket,
  TicketWithDetails,
  TicketStatistics,
  UpdateAttendeeRequest,
} from '@/types'

export const ticketsApi = {
  // Get all tickets (admin)
  getAll: () => {
    return apiClient.get<ApiResponse<Ticket[]>>('/tickets')
  },

  // Get ticket by ID
  getById: (id: number) => {
    return apiClient.get<ApiResponse<Ticket>>(`/tickets/${id}`)
  },

  // Get ticket with full details by ticket number
  getByTicketNumber: (ticketNumber: string) => {
    return apiClient.get<ApiResponse<TicketWithDetails>>(`/tickets/number/${ticketNumber}`)
  },

  // Get all tickets for an order
  getByOrderId: (orderId: number) => {
    return apiClient.get<ApiResponse<Ticket[]>>(`/tickets/order/${orderId}`)
  },

  // Get all tickets for an event (admin)
  getByEventId: (eventId: number) => {
    return apiClient.get<ApiResponse<Ticket[]>>(`/tickets/event/${eventId}`)
  },

  // Get ticket statistics for event (admin)
  getStatistics: (eventId: number) => {
    return apiClient.get<ApiResponse<TicketStatistics>>(`/tickets/event/${eventId}/statistics`)
  },

  // Mark ticket as used by ID
  markAsUsed: (id: number) => {
    return apiClient.put<ApiResponse<Ticket>>(`/tickets/${id}/use`)
  },

  // Mark ticket as used by ticket number
  markAsUsedByNumber: (ticketNumber: string) => {
    return apiClient.put<ApiResponse<Ticket>>(`/tickets/number/${ticketNumber}/use`)
  },

  // Update attendee name
  updateAttendee: (id: number, data: UpdateAttendeeRequest) => {
    return apiClient.put<ApiResponse<Ticket>>(`/tickets/${id}/attendee`, data)
  },
}
