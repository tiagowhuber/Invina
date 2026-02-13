<template>
  <div class="instances-view p-6">
    <div class="flex justify-between items-center mb-6">
       <h1 class="text-2xl font-bold">Instancias de Tours (Instances)</h1>
       <button @click="loadData" class="text-sm text-blue-600 hover:underline">Refrescar</button>
    </div>
    
    <div v-if="adminStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
    </div>
    
    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
      {{ adminStore.error }}
    </div>
    
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="instance in sortedInstances" :key="instance.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
              #{{ instance.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ instance.instanceDate }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ instance.startTime }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ instance.tour?.name || 'Unknown Tour' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ instance.currentAttendants }} / {{ instance.tour?.maxAttendants || '?' }}
              <div class="w-24 bg-gray-200 rounded-full h-2.5 mt-1">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: Math.min(100, (instance.currentAttendants / (instance.tour?.maxAttendants || 1) * 100)) + '%' }"></div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-xs">
                <span class="px-2 py-1 bg-gray-100 rounded-full">
                    {{ instance.tour?.fixedSchedule ? 'Fixed' : 'Standard' }}
                </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

const sortedInstances = computed(() => {
  return [...adminStore.instances].sort((a, b) => {
    const dateA = new Date(a.instanceDate)
    const dateB = new Date(b.instanceDate)
    return dateA.getTime() - dateB.getTime()
  })
})

function loadData() {
  adminStore.fetchInstances()
}

onMounted(() => {
  loadData()
})
</script>