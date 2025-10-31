import apiClient from './client'
import type {
  ApiResponse,
  Order,
  OrderWithDetails,
  CreateOrderRequest,
} from '@/types'

export const ordersApi = {
  // Get all orders (admin)
  getAll: () => {
    return apiClient.get<ApiResponse<Order[]>>('/orders')
  },

  // Get order with full details
  getById: (id: number) => {
    return apiClient.get<ApiResponse<OrderWithDetails>>(`/orders/${id}`)
  },

  // Get order by order number
  getByOrderNumber: (orderNumber: string) => {
    return apiClient.get<ApiResponse<OrderWithDetails>>(`/orders/number/${orderNumber}`)
  },

  // Get all orders for customer email
  getByCustomerEmail: (email: string) => {
    return apiClient.get<ApiResponse<OrderWithDetails[]>>(`/orders/customer/${email}`)
  },

  // Create new order
  create: (data: CreateOrderRequest) => {
    return apiClient.post<ApiResponse<OrderWithDetails>>('/orders', data)
  },

  // Cancel order
  cancel: (id: number) => {
    return apiClient.put<ApiResponse<Order>>(`/orders/${id}/cancel`)
  },
}
