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
        <!-- Option 1 Tours -->
        <section v-if="toursByType.option_1.length > 0">
          <h2 class="text-2xl font-semibold mb-4">Premium Wine Selection Tours</h2>
          <p class="text-gray-600 mb-4">Choose your favorite wines from our selection</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TourCard
              v-for="tour in toursByType.option_1"
              :key="tour.id"
              :tour="tour"
            />
          </div>
        </section>

        <!-- Option 2 Tours -->
        <section v-if="toursByType.option_2.length > 0">
          <h2 class="text-2xl font-semibold mb-4">Standard Wine Tours</h2>
          <p class="text-gray-600 mb-4">Pre-selected wine experience</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TourCard
              v-for="tour in toursByType.option_2"
              :key="tour.id"
              :tour="tour"
            />
          </div>
        </section>

        <!-- Option 3 Tours -->
        <section v-if="toursByType.option_3.length > 0">
          <h2 class="text-2xl font-semibold mb-4">Daily Group Tours</h2>
          <p class="text-gray-600 mb-4">Join our daily group wine experience</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TourCard
              v-for="tour in toursByType.option_3"
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
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useToursStore } from '@/stores/tours'
import TourCard from '@/components/TourCard.vue'

const toursStore = useToursStore()

const { loading, error, activeTours, toursByType } = storeToRefs(toursStore)

onMounted(() => {
  toursStore.fetchTours()
})
</script>
