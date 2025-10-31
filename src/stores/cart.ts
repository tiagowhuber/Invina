import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, EventWithAvailability } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalAmount = computed(() =>
    items.value.reduce((sum, item) => sum + (item.event.price * item.quantity), 0)
  )

  function addToCart(event: EventWithAvailability, quantity: number = 1) {
    const existingItem = items.value.find(item => item.event.id === event.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.attendeeNames.push(...Array(quantity).fill(''))
    } else {
      items.value.push({
        event,
        quantity,
        attendeeNames: Array(quantity).fill(''),
      })
    }
  }

  function removeFromCart(eventId: number) {
    items.value = items.value.filter(item => item.event.id !== eventId)
  }

  function updateQuantity(eventId: number, quantity: number) {
    const item = items.value.find(item => item.event.id === eventId)
    if (item) {
      item.quantity = quantity
      // Adjust attendee names array
      if (item.attendeeNames.length > quantity) {
        item.attendeeNames = item.attendeeNames.slice(0, quantity)
      } else {
        item.attendeeNames.push(...Array(quantity - item.attendeeNames.length).fill(''))
      }
    }
  }

  function updateAttendeeName(eventId: number, index: number, name: string) {
    const item = items.value.find(item => item.event.id === eventId)
    if (item && item.attendeeNames[index] !== undefined) {
      item.attendeeNames[index] = name
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateAttendeeName,
    clearCart,
  }
})
