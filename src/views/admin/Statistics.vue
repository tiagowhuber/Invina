<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useEventsStore } from '@/stores/events'
import { ticketsApi } from '@/services/api/tickets'
import { webpayApi } from '@/services/api/webpay'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import type { TicketStatistics, TransactionStatistics } from '@/types'

const eventsStore = useEventsStore()
const transactionStats = ref<TransactionStatistics | null>(null)
const eventStats = ref<Map<number, TicketStatistics>>(new Map())
const loading = ref(false)

onMounted(async () => {
  await loadStatistics()
})

const loadStatistics = async () => {
  loading.value = true
  
  try {
    // Load events
    await eventsStore.fetchEvents()
    
    // Load transaction statistics
    const transResponse = await webpayApi.getStatistics()
    if (transResponse.data.success && transResponse.data.data) {
      transactionStats.value = transResponse.data.data
    }
    
    // Load ticket statistics for each event
    for (const event of eventsStore.events) {
      const statsResponse = await ticketsApi.getStatistics(event.id)
      if (statsResponse.data.success && statsResponse.data.data) {
        eventStats.value.set(event.id, statsResponse.data.data)
      }
    }
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
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
        <div v-for="i in 6" :key="i" class="h-32 bg-muted rounded"></div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="transactionStats" class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="text-center p-4 bg-secondary/50 rounded-lg">
              <p class="text-2xl font-bold">{{ transactionStats.total_transactions }}</p>
              <p class="text-sm text-muted-foreground">Total</p>
            </div>
            <div class="text-center p-4 bg-green-500/10 rounded-lg">
              <p class="text-2xl font-bold text-green-700">{{ transactionStats.approved }}</p>
              <p class="text-sm text-muted-foreground">Approved</p>
            </div>
            <div class="text-center p-4 bg-yellow-500/10 rounded-lg">
              <p class="text-2xl font-bold text-yellow-700">{{ transactionStats.pending }}</p>
              <p class="text-sm text-muted-foreground">Pending</p>
            </div>
            <div class="text-center p-4 bg-red-500/10 rounded-lg">
              <p class="text-2xl font-bold text-red-700">{{ transactionStats.rejected + transactionStats.failed }}</p>
              <p class="text-sm text-muted-foreground">Failed</p>
            </div>
            <div class="text-center p-4 bg-primary/10 rounded-lg">
              <p class="text-2xl font-bold text-primary">{{ formatPrice(transactionStats.total_approved_amount) }}</p>
              <p class="text-sm text-muted-foreground">Revenue</p>
            </div>
          </div>
          <div v-else class="text-center text-muted-foreground py-8">
            No transaction data available
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="eventsStore.events.length > 0" class="space-y-4">
            <div 
              v-for="event in eventsStore.events" 
              :key="event.id"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-semibold text-lg">{{ event.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ formatDate(event.event_date) }}</p>
                  <p class="text-sm text-muted-foreground">{{ event.location }}</p>
                </div>
                <Badge :variant="event.is_active ? 'default' : 'outline'">
                  {{ event.is_active ? 'Active' : 'Inactive' }}
                </Badge>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div class="text-center p-3 bg-secondary/50 rounded">
                  <p class="text-xl font-bold">{{ event.capacity }}</p>
                  <p class="text-xs text-muted-foreground">Capacity</p>
                </div>
                <div class="text-center p-3 bg-blue-500/10 rounded">
                  <p class="text-xl font-bold text-blue-700">{{ event.tickets_sold }}</p>
                  <p class="text-xs text-muted-foreground">Sold</p>
                </div>
                <div class="text-center p-3 bg-green-500/10 rounded">
                  <p class="text-xl font-bold text-green-700">{{ event.tickets_available }}</p>
                  <p class="text-xs text-muted-foreground">Available</p>
                </div>
                <div class="text-center p-3 bg-purple-500/10 rounded">
                  <p class="text-xl font-bold text-purple-700">
                    {{ event.capacity > 0 ? Math.round((event.tickets_sold / event.capacity) * 100) : 0 }}%
                  </p>
                  <p class="text-xs text-muted-foreground">Sold Rate</p>
                </div>
                <div class="text-center p-3 bg-primary/10 rounded">
                  <p class="text-xl font-bold text-primary">{{ formatPrice(event.price * event.tickets_sold) }}</p>
                  <p class="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>

              <div v-if="eventStats.get(event.id)" class="mt-4 pt-4 border-t">
                <p class="text-sm font-semibold mb-2">Ticket Status Breakdown:</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Reserved:</span>
                    <span class="font-medium">{{ eventStats.get(event.id)?.reserved || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Confirmed:</span>
                    <span class="font-medium">{{ eventStats.get(event.id)?.confirmed || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Used:</span>
                    <span class="font-medium">{{ eventStats.get(event.id)?.used || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Cancelled:</span>
                    <span class="font-medium">{{ eventStats.get(event.id)?.cancelled || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted-foreground py-8">
            No events available
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
