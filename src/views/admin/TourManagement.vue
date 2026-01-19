<template>
  <div class="tour-management">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Tour Management</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        + Create New Tour
      </button>
    </div>

    <div v-if="toursStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading tours...</p>
    </div>

    <div v-else-if="toursStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ toursStore.error }}</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="tour in allTours" :key="tour.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ tour.name }}</div>
              <div class="text-sm text-gray-500">{{ tour.location }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getTourTypeBadge(tour.tour_type)">
                {{ formatTourType(tour.tour_type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">
              ${{ tour.base_price }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">
              {{ tour.max_capacity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="tour.is_active ? 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800' : 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'">
                {{ tour.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                @click="editTour(tour)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                @click="toggleTourStatus(tour)"
                class="text-yellow-600 hover:text-yellow-900"
              >
                {{ tour.is_active ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal (placeholder - would need full implementation) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 class="text-xl font-bold mb-4">Create New Tour</h2>
        <p class="text-gray-600 mb-4">Tour creation form would go here...</p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create Tour
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToursStore } from '@/stores/tours'
import type { Tour, TourType } from '@/types'

const toursStore = useToursStore()
const showCreateModal = ref(false)

const allTours = computed(() => toursStore.tours)

function formatTourType(type: TourType): string {
  const typeMap: Record<TourType, string> = {
    'option_1': 'Wine Selection',
    'option_2': 'Standard',
    'option_3': 'Shared Daily'
  }
  return typeMap[type] || type
}

function getTourTypeBadge(type: TourType): string {
  const baseClasses = 'px-2 py-1 text-xs rounded-full'
  const typeColors: Record<TourType, string> = {
    'option_1': 'bg-purple-100 text-purple-800',
    'option_2': 'bg-blue-100 text-blue-800',
    'option_3': 'bg-orange-100 text-orange-800'
  }
  return `${baseClasses} ${typeColors[type]}`
}

function editTour(tour: Tour) {
  // TODO: Implement edit modal
  console.log('Edit tour:', tour)
}

function toggleTourStatus(tour: Tour) {
  // TODO: Implement status toggle API call
  console.log('Toggle status:', tour)
}

onMounted(() => {
  toursStore.fetchTours()
})
</script>
