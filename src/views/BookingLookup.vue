<template>
  <div class="booking-lookup">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Find Your Booking</h1>

        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p class="text-gray-600 mb-6">
            Enter your order number to view your booking details. You can find this in your confirmation email.
          </p>

          <form @submit.prevent="handleSearch" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <input
                v-model="orderNumber"
                type="text"
                placeholder="e.g., ORD-20240101-ABC123"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>

            <button
              type="submit"
              :disabled="!orderNumber || bookingsStore.loading"
              class="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ bookingsStore.loading ? 'Searching...' : 'Find Booking' }}
            </button>
          </form>

          <div v-if="bookingsStore.error" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-600">{{ bookingsStore.error }}</p>
          </div>
        </div>

        <!-- Booking Details -->
        <div v-if="bookingsStore.currentOrder && !bookingsStore.loading" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-green-600 text-white p-6">
            <h2 class="text-2xl font-bold mb-2">Booking Found</h2>
            <p class="text-green-100">Order #{{ bookingsStore.currentOrder.order_number }}</p>
          </div>

          <div class="p-6">
            <!-- Tour Details -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">Tour Details</h3>
              <div class="space-y-2">
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
                  <span class="text-gray-600">Tickets:</span>
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

            <!-- Selected Wines -->
            <div v-if="bookingsStore.currentOrder.wines && bookingsStore.currentOrder.wines.length > 0" class="mb-6">
              <h3 class="text-lg font-semibold mb-3">Selected Wines</h3>
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
              <h3 class="text-lg font-semibold mb-3">Tickets</h3>
              <div class="space-y-2">
                <div
                  v-for="ticket in bookingsStore.currentOrder.tickets"
                  :key="ticket.id"
                  class="p-3 border border-gray-200 rounded-lg"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-medium">{{ ticket.attendee_name || bookingsStore.currentOrder.customer_name }}</p>
                      <p class="text-sm text-gray-600">Ticket #{{ ticket.ticket_number }}</p>
                    </div>
                    <span :class="getStatusClass(ticket.status)" class="text-xs">
                      {{ formatStatus(ticket.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">Contact Information</h3>
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

            <!-- Total Amount -->
            <div class="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <div class="flex justify-between items-center">
                <span class="font-semibold">Total Amount:</span>
                <span class="text-xl font-bold text-green-600">${{ bookingsStore.currentOrder.total_amount }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="handlePrint"
                class="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Print Details
              </button>
              <button
                @click="resetSearch"
                class="flex-1 py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Search Another Booking
              </button>
            </div>

            <!-- Help Section -->
            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-900">
                <strong>Need help?</strong> If you need to modify or cancel your booking, please contact our support team with your order number.
              </p>
            </div>
          </div>
        </div>

        <!-- Help Section (when no booking shown) -->
        <div v-if="!bookingsStore.currentOrder && !bookingsStore.loading" class="mt-8">
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="font-semibold text-gray-900 mb-3">Can't find your order number?</h3>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>• Check your email inbox for the confirmation email</li>
              <li>• Look in your spam/junk folder</li>
              <li>• Order numbers are in the format: ORD-YYYYMMDD-XXXXXX</li>
              <li>• Contact support if you still can't locate your booking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBookingsStore } from '@/stores/bookings'
import type { OrderStatus, TicketStatus } from '@/types'

const bookingsStore = useBookingsStore()

const orderNumber = ref('')

async function handleSearch() {
  if (!orderNumber.value.trim()) return
  
  await bookingsStore.getBookingByOrderNumber(orderNumber.value.trim())
}

function resetSearch() {
  orderNumber.value = ''
  bookingsStore.currentOrder = null
  bookingsStore.error = null
}

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
  
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium inline-block'
  
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
</script>

<style scoped>
@media print {
  .booking-lookup button,
  .booking-lookup form {
    display: none;
  }
}
</style>
