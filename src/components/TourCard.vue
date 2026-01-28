<template>
  <div class="tour-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <!-- Use description as title since name was removed, or a generic title -->
        <h3 class="text-xl font-bold text-gray-900">{{ tour.name }}</h3> 
        <Badge :variant="tour.tourType === 'Special' ? 'default' : 'secondary'">
          {{ tour.tourType }}
        </Badge>
      </div>
      
      <p class="text-gray-600 mb-4 line-clamp-2">{{ tour.description }}</p>
      
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <div class="flex items-center gap-1">
          <!-- Simple icons usage or text if icons fail -->
          <span class="font-bold">⏱</span>
          <span>{{ tour.durationMinutes }} min</span>
        </div>
         <div class="flex items-center gap-1">
          <span class="font-bold">$</span>
          <span>{{ tour.basePrice }}</span>
        </div>
      </div>

      <router-link 
        :to="{ name: 'tour-detail', params: { id: tour.id }}"
        class="block w-full text-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Ver Más
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'
import type { Tour } from '@/types'

defineProps<{
  tour: Tour
}>()
</script>
