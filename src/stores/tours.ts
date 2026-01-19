import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toursApi } from '@/services/api/tours'
import type { Tour, Wine, TourAvailabilityResponse } from '@/types'

export const useToursStore = defineStore('tours', () => {
  const tours = ref<Tour[]>([])
  const currentTour = ref<Tour | null>(null)
  const tourWines = ref<Wine[]>([])
  const availability = ref<TourAvailabilityResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeTours = computed(() => 
    tours.value.filter(tour => tour.is_active)
  )

  const toursByType = computed(() => ({
    option_1: tours.value.filter(t => t.tour_type === 'option_1' && t.is_active),
    option_2: tours.value.filter(t => t.tour_type === 'option_2' && t.is_active),
    option_3: tours.value.filter(t => t.tour_type === 'option_3' && t.is_active),
  }))

  async function fetchTours() {
    loading.value = true
    error.value = null
    try {
      const response = await toursApi.getAll()
      if (response.data.success && response.data.data) {
        tours.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch tours'
      console.error('Error fetching tours:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTourById(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await toursApi.getById(id)
      if (response.data.success && response.data.data) {
        currentTour.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch tour'
      console.error('Error fetching tour:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTourWines(tourId: number) {
    loading.value = true
    error.value = null
    try {
      const response = await toursApi.getWines(tourId)
      if (response.data.success && response.data.data) {
        tourWines.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch wines'
      console.error('Error fetching wines:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailability(tourId: number, date: string) {
    loading.value = true
    error.value = null
    try {
      const response = await toursApi.getAvailability(tourId, date)
      if (response.data.success && response.data.data) {
        availability.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch availability'
      console.error('Error fetching availability:', err)
    } finally {
      loading.value = false
    }
  }

  function resetAvailability() {
    availability.value = null
  }

  function resetWines() {
    tourWines.value = []
  }

  return {
    tours,
    currentTour,
    tourWines,
    availability,
    loading,
    error,
    activeTours,
    toursByType,
    fetchTours,
    fetchTourById,
    fetchTourWines,
    fetchAvailability,
    resetAvailability,
    resetWines,
  }
})
