<template>
  <div class="tour-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div class="p-6">
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-xl font-semibold">{{ tour.name }}</h3>
        <span class="inline-block px-[8px] py-[4px] text-xs font-semibold rounded-full" :class="tourTypeBadgeClass">
          {{ tourTypeLabel }}
        </span>
      </div>
      
      <p class="text-gray-600 text-sm mb-4">{{ tour.location }}</p>
      
      <p v-if="tour.description" class="text-gray-700 mb-4 line-clamp-2">
        {{ tour.description }}
      </p>

      <div class="space-y-2 mb-4">
        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ tour.duration_minutes }} minutes</span>
        </div>

        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Min {{ tour.min_tickets }} tickets · Max {{ tour.max_capacity }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <span class="text-2xl font-bold text-green-600">${{ tour.base_price }}</span>
          <span class="text-sm text-gray-600">/person</span>
        </div>
        <router-link
          :to="{ name: 'tour-detail', params: { id: tour.id } }"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Book Now
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tour } from '@/types'

const props = defineProps<{
  tour: Tour
}>()

const tourTypeLabel = computed(() => {
  switch (props.tour.tour_type) {
    case 'option_1':
      return 'Wine Selection'
    case 'option_2':
      return 'Standard'
    case 'option_3':
      return 'Group Tour'
    default:
      return ''
  }
})

const tourTypeBadgeClass = computed(() => {
  switch (props.tour.tour_type) {
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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
