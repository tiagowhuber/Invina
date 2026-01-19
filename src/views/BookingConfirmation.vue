<template>
  <div class="booking-confirmation">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <div v-if="bookingsStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading booking details...</p>
        </div>

        <div v-else-if="bookingsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
          <p class="text-red-600">{{ bookingsStore.error }}</p>
          <router-link :to="{ name: 'tours' }" class="inline-block mt-4 text-green-600 hover:text-green-700">
            Return to Tours
          </router-link>
        </div>

        <div v-else-if="bookingsStore.currentOrder" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Success Header -->
          <div class="bg-green-600 text-white p-8 text-center">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 class="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p class="text-green-100">Your tour has been successfully booked</p>
          </div>

          <div class="p-8">
            <!-- Order Number -->
            <div class="mb-8 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Order Number</p>
              <p class="text-2xl font-bold text-gray-900">{{ bookingsStore.currentOrder.order_number }}</p>
              <p class="text-sm text-gray-600 mt-2">
                Please save this number for your records. You'll need it to view or modify your booking.
              </p>
            </div>

            <!-- Tour Details -->
            <div class="mb-6">
              <h2 class="text-xl font-semibold mb-4">Tour Details</h2>
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Tour:</span>
                  <span class="font-medium">{{ bookingsStore.currentOrder.tour_instance?.tour?.name }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Date:</span>
                  <span class="font-medium">{{ formatDate(bookingsStore.currentOrder.tour_instance?.instance_date) }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Time:</span>
                  <span class="font-medium">{{ bookingsStore.currentOrder.tour_instance?.instance_time }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Number of Tickets:</span>
                  <span class="font-medium">{{ bookingsStore.currentOrder.tickets?.length || 0 }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Status:</span>
                  <span :class="getStatusClass(bookingsStore.currentOrder.status)">
                    {{ formatStatus(bookingsStore.currentOrder.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Selected Wines (Option 1 only) -->
            <div v-if="bookingsStore.currentOrder.wines && bookingsStore.currentOrder.wines.length > 0" class="mb-6">
              <h2 class="text-xl font-semibold mb-4">Selected Wines</h2>
              <div class="space-y-2">
                <div
                  v-for="wine in bookingsStore.currentOrder.wines"
                  :key="wine.id"
                  class="flex justify-between py-2 px-4 bg-gray-50 rounded"
                >
                  <span>{{ wine.name }}</span>
                </div>
              </div>
            </div>

            <!-- Tickets -->
            <div v-if="bookingsStore.currentOrder.tickets && bookingsStore.currentOrder.tickets.length > 0" class="mb-6">
              <h2 class="text-xl font-semibold mb-4">Your Tickets</h2>
              <div class="space-y-3">
                <div
                  v-for="ticket in bookingsStore.currentOrder.tickets"
                  :key="ticket.id"
                  class="p-4 border border-gray-200 rounded-lg"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-medium">{{ ticket.attendee_name || bookingsStore.currentOrder.customer_name }}</p>
                      <p class="text-sm text-gray-600">Ticket #{{ ticket.ticket_number }}</p>
                    </div>
                    <span :class="getStatusClass(ticket.status)">
                      {{ formatStatus(ticket.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Customer Information -->
            <div class="mb-6">
              <h2 class="text-xl font-semibold mb-4">Contact Information</h2>
              <div class="space-y-2">
                <div class="flex justify-between py-2">
                  <span class="text-gray-600">Name:</span>
                  <span class="font-medium">{{ bookingsStore.currentOrder.customer_name }}</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium">{{ bookingsStore.currentOrder.customer_email }}</span>
                </div>
                <div v-if="bookingsStore.currentOrder.customer_phone" class="flex justify-between py-2">
                  <span class="text-gray-600">Phone:</span>
                  <span class="font-medium">{{ bookingsStore.currentOrder.customer_phone }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex justify-between items-center text-lg mb-2">
                <span class="font-semibold">Total Amount:</span>
                <span class="text-2xl font-bold text-green-600">${{ bookingsStore.currentOrder.total_amount }}</span>
              </div>
              <p v-if="bookingsStore.currentOrder.status === 'pending'" class="text-sm text-gray-600 mt-2">
                Payment pending. You will receive a confirmation email once payment is complete.
              </p>
              <p v-else-if="bookingsStore.currentOrder.status === 'paid'" class="text-sm text-green-700 mt-2">
                Payment confirmed. A confirmation email has been sent to {{ bookingsStore.currentOrder.customer_email }}.
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <router-link
                :to="{ name: 'tours' }"
                class="flex-1 py-3 px-6 border-2 border-green-600 text-green-600 font-semibold rounded-md hover:bg-green-50 transition-colors text-center"
              >
                Browse More Tours
              </router-link>
              <button
                @click="handlePrint"
                class="flex-1 py-3 px-6 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors"
              >
                Print Confirmation
              </button>
            </div>

            <!-- Additional Information -->
            <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 class="font-semibold text-blue-900 mb-2">Important Information</h3>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Please arrive 15 minutes before your scheduled tour time</li>
                <li>• Bring a printed or digital copy of this confirmation</li>
                <li>• For questions or changes, contact us with your order number</li>
                <li>• Cancellation policy applies as per our terms and conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import type { OrderStatus, TicketStatus } from '@/types'

const route = useRoute()
const bookingsStore = useBookingsStore()

const orderNumber = route.params.orderNumber as string

function formatDate(date: string | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatStatus(status: OrderStatus | TicketStatus | undefined): string {
  if (!status) return ''
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getStatusClass(status: OrderStatus | TicketStatus | undefined): string {
  if (!status) return ''
  
  const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium'
  
  switch (status) {
    case 'confirmed':
    case 'paid':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'cancelled':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'used':
      return `${baseClasses} bg-blue-100 text-blue-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

function handlePrint() {
  window.print()
}

onMounted(async () => {
  if (orderNumber) {
    await bookingsStore.getBookingByOrderNumber(orderNumber)
  }
})
</script>

<style scoped>
@media print {
  .booking-confirmation button,
  .booking-confirmation a {
    display: none;
  }
}
</style>
