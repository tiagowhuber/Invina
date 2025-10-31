import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ordersApi } from '@/services/api/orders'
import type { Order, OrderWithDetails, CreateOrderRequest } from '@/types'

export const useOrdersStore = defineStore('orders', () => {
  const currentOrder = ref<OrderWithDetails | null>(null)
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function createOrder(orderData: CreateOrderRequest) {
    loading.value = true
    error.value = null
    try {
      const response = await ordersApi.create(orderData)
      if (response.data.success && response.data.data) {
        currentOrder.value = response.data.data
        return response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Failed to create order'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderByNumber(orderNumber: string) {
    loading.value = true
    error.value = null
    try {
      const response = await ordersApi.getByOrderNumber(orderNumber)
      if (response.data.success && response.data.data) {
        currentOrder.value = response.data.data
        return response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Order not found'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchOrdersByEmail(email: string) {
    loading.value = true
    error.value = null
    try {
      const response = await ordersApi.getByCustomerEmail(email)
      if (response.data.success && response.data.data) {
        return response.data.data
      }
      return []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch orders'
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchAllOrders() {
    loading.value = true
    error.value = null
    try {
      const response = await ordersApi.getAll()
      if (response.data.success && response.data.data) {
        orders.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
    } finally {
      loading.value = false
    }
  }

  async function cancelOrder(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await ordersApi.cancel(id)
      if (response.data.success) {
        // Refresh current order if it's the one being cancelled
        if (currentOrder.value?.id === id) {
          await fetchOrderByNumber(currentOrder.value.order_number)
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to cancel order'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCurrentOrder() {
    currentOrder.value = null
  }

  return {
    currentOrder,
    orders,
    loading,
    error,
    createOrder,
    fetchOrderByNumber,
    fetchOrdersByEmail,
    fetchAllOrders,
    cancelOrder,
    clearCurrentOrder,
  }
})
