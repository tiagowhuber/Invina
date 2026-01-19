<template>
  <div class="tour-booking">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <router-link :to="{ name: 'tour-detail', params: { id: tourId } }" class="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tour Details
        </router-link>

        <h1 class="text-3xl font-bold mb-8">Book Your Tour</h1>

        <div v-if="bookingError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-600">{{ bookingError }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-8">
          <!-- Tour Info -->
          <div v-if="toursStore.currentTour" class="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 class="text-xl font-semibold mb-2">{{ toursStore.currentTour.name }}</h2>
            <p class="text-gray-600">{{ toursStore.currentTour.location }}</p>
            <p class="text-lg font-semibold text-green-600 mt-2">${{ toursStore.currentTour.base_price }} per person</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Date Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                v-model="form.date"
                type="date"
                :min="minDate"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                @change="handleDateChange"
              />
            </div>

            <!-- Time Selection -->
            <div v-if="toursStore.availability">
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
              <div v-if="toursStore.availability.availability.length === 0" class="text-gray-600">
                No available times for this date. Please select another date.
              </div>
              <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  v-for="slot in toursStore.availability.availability"
                  :key="slot.instance_time"
                  type="button"
                  @click="form.time = slot.instance_time"
                  :disabled="slot.tickets_available < form.ticketQuantity"
                  :class="[
                    'px-4 py-3 rounded-md border-2 transition-colors',
                    form.time === slot.instance_time
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-green-400',
                    slot.tickets_available < form.ticketQuantity
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  ]"
                >
                  <div class="font-semibold">{{ slot.instance_time }}</div>
                  <div class="text-xs">{{ slot.tickets_available }} available</div>
                </button>
              </div>
            </div>

            <!-- Ticket Quantity -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets (Min: {{ toursStore.currentTour?.min_tickets || 1 }})
              </label>
              <input
                v-model.number="form.ticketQuantity"
                type="number"
                :min="toursStore.currentTour?.min_tickets || 1"
                :max="toursStore.currentTour?.max_capacity || 20"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                @input="handleQuantityChange"
              />
            </div>

            <!-- Wine Selection (Option 1 only) -->
            <div v-if="toursStore.currentTour?.tour_type === 'option_1'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Select Your Wines *
              </label>
              <div v-if="toursStore.loading" class="text-gray-600">Loading wines...</div>
              <div v-else-if="toursStore.tourWines.length === 0" class="text-gray-600">
                No wines available for this tour.
              </div>
              <div v-else class="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                <label
                  v-for="wine in toursStore.tourWines"
                  :key="wine.id"
                  class="flex items-start p-3 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="wine.id"
                    v-model="form.selectedWines"
                    class="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div class="ml-3">
                    <div class="font-medium">{{ wine.name }}</div>
                    <div class="text-sm text-gray-600">
                      {{ wine.variety }}
                      <span v-if="wine.vintage"> · {{ wine.vintage }}</span>
                    </div>
                    <div v-if="wine.description" class="text-sm text-gray-500 mt-1">
                      {{ wine.description }}
                    </div>
                  </div>
                </label>
              </div>
              <p class="text-sm text-gray-600 mt-2">
                {{ form.selectedWines.length }} wine(s) selected
              </p>
            </div>

            <!-- Customer Information -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold mb-4">Your Information</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    v-model="form.customerName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    v-model="form.customerEmail"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    v-model="form.customerPhone"
                    type="tel"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold mb-4">Booking Summary</h3>
              <div class="space-y-2 text-gray-700">
                <div class="flex justify-between">
                  <span>Tour:</span>
                  <span class="font-medium">{{ toursStore.currentTour?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Date & Time:</span>
                  <span class="font-medium">{{ form.date }} at {{ form.time }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Tickets:</span>
                  <span class="font-medium">{{ form.ticketQuantity }} × ${{ toursStore.currentTour?.base_price }}</span>
                </div>
                <div v-if="toursStore.currentTour?.tour_type === 'option_1' && form.selectedWines.length > 0" class="flex justify-between">
                  <span>Selected Wines:</span>
                  <span class="font-medium">{{ form.selectedWines.length }} wines</span>
                </div>
                <div class="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span class="text-green-600">${{ totalAmount }}</span>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!isFormValid || bookingsStore.loading"
              class="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ bookingsStore.loading ? 'Processing...' : 'Confirm Booking' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToursStore } from '@/stores/tours'
import { useBookingsStore } from '@/stores/bookings'

const route = useRoute()
const router = useRouter()
const toursStore = useToursStore()
const bookingsStore = useBookingsStore()

const tourId = computed(() => parseInt(route.params.id as string))

const form = ref({
  date: '',
  time: '',
  ticketQuantity: 1,
  selectedWines: [] as number[],
  customerName: '',
  customerEmail: '',
  customerPhone: '',
})

const bookingError = ref<string | null>(null)

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const totalAmount = computed(() => {
  if (!toursStore.currentTour) return 0
  return toursStore.currentTour.base_price * form.value.ticketQuantity
})

const isFormValid = computed(() => {
  const baseValid = form.value.date &&
    form.value.time &&
    form.value.ticketQuantity >= (toursStore.currentTour?.min_tickets || 1) &&
    form.value.customerName &&
    form.value.customerEmail

  if (toursStore.currentTour?.tour_type === 'option_1') {
    return baseValid && form.value.selectedWines.length > 0
  }

  return baseValid
})

async function handleDateChange() {
  if (form.value.date && tourId.value) {
    form.value.time = ''
    await toursStore.fetchAvailability(tourId.value, form.value.date)
  }
}

async function handleQuantityChange() {
  // Refetch availability to check if selected time still has enough capacity
  if (form.value.date && tourId.value) {
    await toursStore.fetchAvailability(tourId.value, form.value.date)
  }
}

async function handleSubmit() {
  if (!isFormValid.value || !toursStore.currentTour) return

  bookingError.value = null

  try {
    const bookingData = {
      tour_id: tourId.value,
      instance_date: form.value.date,
      instance_time: form.value.time,
      ticket_quantity: form.value.ticketQuantity,
      customer_name: form.value.customerName,
      customer_email: form.value.customerEmail,
      customer_phone: form.value.customerPhone || undefined,
      wine_ids: toursStore.currentTour.tour_type === 'option_1' ? form.value.selectedWines : undefined,
    }

    const booking = await bookingsStore.createBooking(bookingData)
    
    if (booking) {
      router.push({ name: 'booking-confirmation', params: { orderNumber: booking.order_number } })
    }
  } catch (error: any) {
    bookingError.value = bookingsStore.error || 'Failed to create booking. Please try again.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(async () => {
  if (tourId.value) {
    await toursStore.fetchTourById(tourId.value)
    
    if (toursStore.currentTour?.tour_type === 'option_1') {
      await toursStore.fetchTourWines(tourId.value)
    }

    // Set default quantity to minimum
    if (toursStore.currentTour) {
      form.value.ticketQuantity = toursStore.currentTour.min_tickets
    }
  }
})

watch(() => toursStore.currentTour, (newTour) => {
  if (newTour) {
    form.value.ticketQuantity = newTour.min_tickets
  }
})
</script>
