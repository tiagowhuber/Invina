import axios from 'axios'
import type { Tour, CreateOrderRequest, CreateOrderResponse } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const toursApi = {
  getAll: async () => {
    const { data } = await apiClient.get<Tour[]>('/tours')
    // Parse strings to numbers if needed, though Axios usually handles JSON types well.
    // Backend sends numbers as numbers.
    return data
  },

  getSlots: async (tourId: number, date: string, partySize: number = 1) => {
    const { data } = await apiClient.get<string[]>('/tours/slots', {
      params: { tourId, date, partySize }
    })
    return data
  },

  getInstances: async (tourId: number, type?: 'joinable') => {
    const params: any = {};
    if (type) params.type = type;
    
    const { data } = await apiClient.get<any[]>('/tours/' + tourId + '/instances', { params }) // Need proper typing for instance
    return data
  },

  getAllUpcoming: async () => {
    const { data } = await apiClient.get<any[]>('/tours/upcoming')
    return data
  }
}


export const ordersApi = {
  create: async (payload: CreateOrderRequest) => {
    const { data } = await apiClient.post<CreateOrderResponse>('/orders', payload)
    return data
  }
}

export const adminApi = {
  getAllOrders: async () => {
    const { data } = await apiClient.get<any[]>('/orders/admin/all')
    return data
  },
  getAllPayments: async () => {
    const { data } = await apiClient.get<any[]>('/payments/admin/all')
    return data
  },
  getAllInstances: async () => {
    const { data } = await apiClient.get<any[]>('/tours/admin/instances')
    return data
  },
}
