<template>
  <div class="tour-detail">
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading tour details...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="currentTour" class="max-w-4xl mx-auto">
        <!-- Back button -->
        <router-link to="/" class="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tours
        </router-link>

        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-8">
            <div class="flex items-start justify-between mb-4">
              <h1 class="text-3xl font-bold">{{ currentTour.name }}</h1>
              <span class="inline-block px-[12px] py-[4px] text-sm font-semibold rounded-full" :class="tourTypeBadgeClass">
                {{ tourTypeLabel }}
              </span>
            </div>

            <div class="flex items-center text-gray-600 mb-6">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ currentTour.location }}</span>
            </div>

            <p v-if="currentTour.description" class="text-gray-700 mb-6">
              {{ currentTour.description }}
            </p>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm text-gray-600">Duration</p>
                <p class="font-semibold">{{ currentTour.duration_minutes }} min</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Min Tickets</p>
                <p class="font-semibold">{{ currentTour.min_tickets }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Max Capacity</p>
                <p class="font-semibold">{{ currentTour.max_capacity }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Price</p>
                <p class="font-semibold text-green-600">${{ currentTour.base_price }}</p>
              </div>
            </div>

            <!-- Wine Selection Info for Option 1 -->
            <div v-if="currentTour.tour_type === 'option_1'" class="mb-8">
              <h3 class="text-xl font-semibold mb-4">Wine Selection Required</h3>
              <p class="text-gray-700 mb-4">
                This tour allows you to select your favorite wines from our collection. 
                You'll choose your preferred wines during the booking process.
              </p>
            </div>

            <!-- Group Tour Info for Option 3 -->
            <div v-if="currentTour.tour_type === 'option_3'" class="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 class="text-lg font-semibold text-blue-900 mb-2">Daily Group Tour</h3>
              <p class="text-blue-800">
                This is a shared group experience. You'll join other wine enthusiasts for a memorable tour.
              </p>
            </div>

            <div class="flex justify-center">
              <router-link
                :to="{ name: 'tour-booking', params: { id: currentTour.id } }"
                class="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700 transition-colors"
              >
                Proceed to Booking
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToursStore } from '@/stores/tours'

const route = useRoute()
const toursStore = useToursStore()
const { currentTour, loading, error } = storeToRefs(toursStore)

const tourTypeLabel = computed(() => {
  if (!toursStore.currentTour) return ''
  switch (toursStore.currentTour.tour_type) {
    case 'option_1':
      return 'Wine Selection Tour'
    case 'option_2':
      return 'Standard Tour'
    case 'option_3':
      return 'Group Tour'
    default:
      return ''
  }
})

const tourTypeBadgeClass = computed(() => {
  if (!toursStore.currentTour) return ''
  switch (toursStore.currentTour.tour_type) {
    case 'option_1':
      return 'bg-purple-100 text-purple-700'
    case 'option_2':
      return 'bg-blue-100 text-blue-700'
    case 'option_3':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

onMounted(async () => {
  const tourId = parseInt(route.params.id as string)
  if (tourId) {
    await toursStore.fetchTourById(tourId)
  }
})
</script>
