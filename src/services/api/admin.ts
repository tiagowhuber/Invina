import apiClient from './client'
import type { ApiResponse } from '@/types'

export const adminApi = {
  // Manually expire old pending orders
  expireOrders: () => {
    return apiClient.post<ApiResponse<{ expired_count: number }>>('/admin/expire-orders')
  },

  // Admin health check
  health: () => {
    return apiClient.get<ApiResponse<any>>('/admin/health')
  },
}
