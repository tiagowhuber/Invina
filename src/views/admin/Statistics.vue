<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToursStore } from '@/stores/tours'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

const toursStore = useToursStore()
const loading = ref(false)

onMounted(async () => {
  await loadStatistics()
})

const loadStatistics = async () => {
  loading.value = true
  
  try {
    // Load tours
    await toursStore.fetchTours()
    
    // TODO: Load booking statistics from API
  } catch (error) {
    console.error('Failed to load statistics:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Statistics & Reports</h1>
      <Button @click="loadStatistics" variant="outline" :disabled="loading">
        {{ loading ? 'Loading...' : 'Refresh' }}
      </Button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tours Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="toursStore.tours.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold">{{ toursStore.tours.length }}</p>
              <p class="text-sm text-gray-600">Total Tours</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-700">{{ toursStore.tours.filter(t => t.is_active).length }}</p>
              <p class="text-sm text-gray-600">Active Tours</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-2xl font-bold text-gray-700">{{ toursStore.tours.filter(t => !t.is_active).length }}</p>
              <p class="text-sm text-gray-600">Inactive Tours</p>
            </div>
          </div>
          <div v-else class="text-center text-gray-600 py-8">
            No tours available
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tours</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="toursStore.tours.length > 0" class="space-y-4">
            <div 
              v-for="tour in toursStore.tours" 
              :key="tour.id"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-semibold text-lg">{{ tour.name }}</h3>
                  <p class="text-sm text-gray-600">{{ tour.location }}</p>
                  <p class="text-sm text-gray-600">{{ formatPrice(tour.base_price) }} per person</p>
                </div>
                <span :class="tour.is_active ? 'px-2 py-1 bg-green-100 text-green-800 text-xs rounded' : 'px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded'">
                  {{ tour.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Type:</p>
                  <p class="font-medium">{{ tour.tour_type }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Duration:</p>
                  <p class="font-medium">{{ tour.duration_hours }}h</p>
                </div>
                <div>
                  <p class="text-gray-600">Max Capacity:</p>
                  <p class="font-medium">{{ tour.max_capacity }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Min Tickets:</p>
                  <p class="font-medium">{{ tour.min_tickets }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-600 py-8">
            No tours available
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
