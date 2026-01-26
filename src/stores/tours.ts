import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toursApi } from '@/services/api' // Updated import path
import type { Tour } from '@/types'

export const useToursStore = defineStore('tours', () => {
  const tours = ref<Tour[]>([])
  const currentTour = ref<Tour | null>(null)
  const currentSlots = ref<string[]>([]) // Changed from AvailabilityResponse
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeTours = computed(() => 
    tours.value.filter(tour => tour.isActive)
  )

  const toursByType = computed(() => ({
    Standard: tours.value.filter(t => t.tourType === 'Standard' && t.isActive),
    Special: tours.value.filter(t => t.tourType === 'Special' && t.isActive),
  }))

  async function fetchTours() {
    loading.value = true
    error.value = null
    try {
      // Backend returns plain array now
      const data = await toursApi.getAll() 
      tours.value = data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch tours'
      console.error('Error fetching tours:', err)
    } finally {
      loading.value = false
    }
  }

  function getTourById(id: number) {
    // Sync find because we fetch all at once now
    const found = tours.value.find(t => t.id === id) || null
    currentTour.value = found
    return found
  }

  async function fetchSlots(tourId: number, date: string) {
    loading.value = true
    error.value = null
    try {
      const slots = await toursApi.getSlots(tourId, date)
      currentSlots.value = slots
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch slots'
      console.error('Error fetching slots:', err)
      currentSlots.value = []
    } finally {
      loading.value = false
    }
  }

  function resetSlots() {
    currentSlots.value = []
  }

  return {
    tours,
    currentTour,
    currentSlots,
    loading,
    error,
    activeTours,
    toursByType,
    fetchTours,
    getTourById,
    fetchSlots,
    resetSlots
  }
})
