import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bookingsApi } from '@/services/api/bookings'
import type { OrderWithDetails, CreateBookingRequest } from '@/types'

export const useBookingsStore = defineStore('bookings', () => {
  const currentBooking = ref<OrderWithDetails | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function createBooking(data: CreateBookingRequest) {
    loading.value = true
    error.value = null
    try {
      const response = await bookingsApi.create(data)
      if (response.data.success && response.data.data) {
        currentBooking.value = response.data.data
        return response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || err.response?.data?.message || 'Failed to create booking'
      console.error('Error creating booking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchBookingByOrderNumber(orderNumber: string) {
    loading.value = true
    error.value = null
    try {
      const response = await bookingsApi.getByOrderNumber(orderNumber)
      if (response.data.success && response.data.data) {
        currentBooking.value = response.data.data
        return response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch booking'
      console.error('Error fetching booking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function resetBooking() {
    currentBooking.value = null
    error.value = null
  }

  return {
    currentBooking,
    currentOrder: currentBooking, // Alias for backward compatibility
    loading,
    error,
    createBooking,
    fetchBookingByOrderNumber,
    getBookingByOrderNumber: fetchBookingByOrderNumber, // Alias for backward compatibility
    resetBooking,
  }
})
