import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { eventsApi } from '@/services/api/events'
import type { EventWithAvailability } from '@/types'

export const useEventsStore = defineStore('events', () => {
  const events = ref<EventWithAvailability[]>([])
  const currentEvent = ref<EventWithAvailability | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeEvents = computed(() => 
    events.value.filter(event => event.is_active)
  )

  const availableEvents = computed(() =>
    activeEvents.value.filter(event => event.tickets_available > 0)
  )

  async function fetchEvents() {
    loading.value = true
    error.value = null
    try {
      const response = await eventsApi.getAllWithAvailability()
      if (response.data.success && response.data.data) {
        events.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch events'
      console.error('Error fetching events:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchEventById(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await eventsApi.getByIdWithAvailability(id)
      if (response.data.success && response.data.data) {
        currentEvent.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch event'
      console.error('Error fetching event:', err)
    } finally {
      loading.value = false
    }
  }

  async function createEvent(eventData: any) {
    loading.value = true
    error.value = null
    try {
      const response = await eventsApi.create(eventData)
      if (response.data.success) {
        await fetchEvents()
        return response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create event'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateEvent(id: number, eventData: any) {
    loading.value = true
    error.value = null
    try {
      const response = await eventsApi.update(id, eventData)
      if (response.data.success) {
        await fetchEvents()
        return response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update event'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteEvent(id: number) {
    loading.value = true
    error.value = null
    try {
      await eventsApi.delete(id)
      await fetchEvents()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete event'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    events,
    currentEvent,
    loading,
    error,
    activeEvents,
    availableEvents,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
  }
})
