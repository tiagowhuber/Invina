<template>
  <div class="tour-booking">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <router-link :to="{ name: 'home' }" class="inline-flex items-center text-green-600 hover:text-green-700 mb-6 font-semibold">
          &larr; Back to Tours
        </router-link>

        <h1 class="text-3xl font-bold mb-8 text-gray-800">Book Your Tour</h1>

        <div v-if="localError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-600">{{ localError }}</p>
        </div>

        <div v-if="!currentTour" class="text-center py-12 text-gray-500">
           Loading Tour Information...
        </div>

        <div v-else class="bg-white rounded-lg shadow-lg p-8">
          <!-- Tour Info -->
          <div class="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <h2 class="text-xl font-bold mb-2 break-words">{{ currentTour.description }}</h2>
            <div class="text-gray-600 flex gap-4 text-sm mt-3">
               <span>⏱ {{ currentTour.durationMinutes }} Minutes</span>
               <span>🏷 {{ currentTour.tourType }}</span>
               <span class="font-bold text-green-700">${{ currentTour.basePrice }} / person</span>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Date Selection -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
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
            <div v-if="form.date">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Select Time</label>
              <div v-if="loading" class="text-gray-500 text-sm">Checking availability...</div>
              
              <div v-else-if="currentSlots.length === 0" class="text-amber-600 text-sm italic">
                No available times for this date. Please select another date.
              </div>
              
              <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  v-for="timeStr in currentSlots"
                  :key="timeStr"
                  type="button"
                  @click="form.time = timeStr"
                  :class="[
                    'px-4 py-2 rounded-md border text-center transition-all',
                    form.time === timeStr
                      ? 'border-green-600 bg-green-100 text-green-800 font-bold shadow-sm'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  ]"
                >
                  {{ timeStr.substring(0, 5) }}
                </button>
              </div>
            </div>

            <!-- Ticket Quantity -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Number of Attendees (Min: {{ currentTour.minAttendants || 1 }})
              </label>
              <input
                v-model.number="form.attendeesCount"
                type="number"
                :min="currentTour.minAttendants || 1"
                :max="currentTour.maxAttendants"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <!-- Customer Information -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-bold mb-4 text-gray-800">Your Information</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    v-model="form.customerName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    v-model="form.customerEmail"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    v-model="form.customerPhone"
                    type="tel"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="border-t pt-6 bg-gray-50 p-4 rounded-md">
              <h3 class="text-lg font-bold mb-3">Booking Summary</h3>
              <div class="space-y-2 text-gray-700 text-sm">
                <div class="flex justify-between">
                   <span>Tour:</span>
                   <span class="font-medium text-right">{{ currentTour.description }}</span>
                </div>
                <div class="flex justify-between">
                   <span>Date & Time:</span>
                   <span class="font-medium" v-if="form.date && form.time">{{ form.date }} at {{ form.time.substring(0,5) }}</span>
                   <span class="text-gray-400 italic" v-else>Incomplete</span>
                </div>
                <div class="flex justify-between border-t border-gray-200 mt-2 pt-2 text-base font-bold text-green-700">
                  <span>Total (Approx):</span>
                  <span>${{ totalApprox }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1 italic">* Final calculation may include discounts at checkout.</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!isFormValid || submitting"
              class="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
            >
              {{ submitting ? 'Redirecting to Payment...' : 'Proceed to Payment' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToursStore } from '@/stores/tours'
import { storeToRefs } from 'pinia'
import { ordersApi } from '@/services/api' 

const route = useRoute()
const toursStore = useToursStore()
const { currentTour, currentSlots, loading } = storeToRefs(toursStore)

const tourId = parseInt(route.params.id as string)

const submitting = ref(false)
const localError = ref<string | null>(null)

const form = ref({
  date: '',
  time: '',
  attendeesCount: 1,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
})

// Validation
const isFormValid = computed(() => {
  return (
    form.value.date &&
    form.value.time &&
    form.value.attendeesCount > 0 &&
    form.value.customerName.length > 2 &&
    form.value.customerEmail.includes('@')
  )
})

const totalApprox = computed(() => {
   if (!currentTour.value) return 0
   return currentTour.value.basePrice * form.value.attendeesCount
})

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Actions
async function handleDateChange() {
  if (form.value.date && tourId) {
    form.value.time = ''
    await toursStore.fetchSlots(tourId, form.value.date)
  }
}

async function handleSubmit() {
  if (!isFormValid.value || !currentTour.value) return
  
  submitting.value = true
  localError.value = null

  try {
     const response = await ordersApi.create({
       tourId,
       date: form.value.date,
       time: form.value.time,
       attendeesCount: form.value.attendeesCount,
       customerName: form.value.customerName,
       customerEmail: form.value.customerEmail,
       customerPhone: form.value.customerPhone
     })

     if (response.paymentUrl && response.token) {
        // Redirection to Transbank WebPay
        // We must construct a form and submit it, or if it's GET, just window.location
        // WebPay usually uses POST or GET depending on integration. 
        // SDK v1.x used POST forms. Newer returns a URL + token to GET?
        // Standard Webpay Plus creates a URL like: https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions
        // The service returns `url` and `token`. The user must POST token to url.
        
        // Auto-submit form creation
        const form = document.createElement('form');
        form.method = 'POST'; // Usually POST for WebPay
        form.action = response.paymentUrl;

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'token_ws';
        tokenInput.value = response.token;
        
        form.appendChild(tokenInput);
        document.body.appendChild(form);
        form.submit();
     }

  } catch (err: any) {
     console.error(err)
     localError.value = err.response?.data?.error || 'Failed to initiate booking.'
     submitting.value = false
  }
}

// Init
onMounted(async () => {
   // Ensure tours are loaded to find current
   if (toursStore.tours.length === 0) {
      await toursStore.fetchTours()
   }
   const tour = toursStore.getTourById(tourId)
   if (tour) {
     form.value.attendeesCount = tour.minAttendants
   }
})
</script>
