<template>
  <div class="tour-management">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Gestión de Tours</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        + Crear Nuevo Tour
      </button>
    </div>

    <div v-if="toursStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Cargando tours...</p>
    </div>

    <div v-else-if="toursStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ toursStore.error }}</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre del Tour</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacidad</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="tour in allTours" :key="tour.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">Tour #{{ tour.id }}</div>
              <div class="text-sm text-gray-500">{{ tour.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getTourTypeBadge(tour.tourType)">
                {{ tour.tourType }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">
              ${{ tour.basePrice }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">
              {{ tour.maxAttendants }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="tour.isActive ? 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800' : 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'">
                {{ tour.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                @click="editTour(tour)"
                class="text-blue-600 hover:text-blue-900"
              >
                Editar
              </button>
              <button
                @click="toggleTourStatus(tour)"
                class="text-yellow-600 hover:text-yellow-900"
              >
                {{ tour.isActive ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal (placeholder - would need full implementation) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 class="text-xl font-bold mb-4">Crear Nuevo Tour</h2>
        <p class="text-gray-600 mb-4">El formulario de creación iría aquí...</p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Crear Tour
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

function getTourTypeBadge(type: TourType): string {
  const baseClasses = 'px-2 py-1 text-xs rounded-full'
  const typeColors: Record<TourType, string> = {
    'Standard': 'bg-blue-100 text-blue-800',
    'Special': 'bg-purple-100 text-purple-800'
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
