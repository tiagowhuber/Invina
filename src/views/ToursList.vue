<template>
  <div class="tours-list">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">Wine Tours</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading tours...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else class="space-y-8">
        <!-- Standard Tours -->
        <section v-if="toursByType.Standard.length > 0">
          <h2 class="text-2xl font-semibold mb-4">Standard Tours</h2>
          <p class="text-gray-600 mb-4">Experience our classic wine selection (Mon-Sat).</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TourCard
              v-for="tour in toursByType.Standard"
              :key="tour.id"
              :tour="tour"
            />
          </div>
        </section>

        <!-- Special Tours -->
        <section v-if="toursByType.Special.length > 0">
          <h2 class="text-2xl font-semibold mb-4">Special Tours</h2>
          <p class="text-gray-600 mb-4">Exclusive experiences available every day.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TourCard
              v-for="tour in toursByType.Special"
              :key="tour.id"
              :tour="tour"
            />
          </div>
        </section>

        <div v-if="activeTours.length === 0" class="text-center py-12">
          <p class="text-gray-600">No tours available at the moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToursStore } from '@/stores/tours'
import TourCard from '@/components/TourCard.vue'

const toursStore = useToursStore()

const { loading, error, activeTours, toursByType } = storeToRefs(toursStore)

onMounted(() => {
  toursStore.fetchTours()
})
</script>
