<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { useCartStore } from '@/stores/cart'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const router = useRouter()
const eventsStore = useEventsStore()
const cartStore = useCartStore()

onMounted(() => {
  eventsStore.fetchEvents()
})

// Debug: log events
watch(() => eventsStore.events, (newEvents) => {
  console.log('Events loaded:', newEvents)
  console.log('Active events:', eventsStore.activeEvents)
  console.log('Available events:', eventsStore.availableEvents)
}, { immediate: true })

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const viewEventDetail = (eventId: number) => {
  router.push(`/events/${eventId}`)
}
</script>

<template>
  <div class="w-full">
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">Upcoming Events</h1>
      <p class="text-muted-foreground">
        Browse and purchase tickets for exciting events
      </p>
    </div>

    <div v-if="eventsStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <Card>
          <CardHeader>
            <div class="h-6 bg-muted rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div class="h-4 bg-muted rounded"></div>
              <div class="h-4 bg-muted rounded w-5/6"></div>
              <div class="h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div v-else-if="eventsStore.error" class="text-center py-12">
      <p class="text-destructive">{{ eventsStore.error }}</p>
      <Button @click="eventsStore.fetchEvents()" class="mt-4">
        Try Again
      </Button>
    </div>

    <div v-else-if="eventsStore.availableEvents.length === 0" class="text-center py-12">
      <p class="text-muted-foreground text-lg">
        No events available at the moment. Check back soon!
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        v-for="event in eventsStore.availableEvents" 
        :key="event.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="viewEventDetail(event.id)"
      >
        <CardHeader>
          <CardTitle class="text-xl">{{ event.name }}</CardTitle>
          <div class="flex gap-2 mt-2">
            <Badge variant="secondary">
              {{ event.tickets_available }} tickets left
            </Badge>
            <Badge v-if="event.tickets_available < 10" variant="destructive">
              Almost sold out!
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div class="flex items-start gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-foreground">{{ formatDate(event.event_date) }}</span>
            </div>
            <div class="flex items-start gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-foreground">{{ event.location }}</span>
            </div>
            <div class="flex items-center justify-between pt-4 border-t">
              <span class="text-2xl font-bold text-primary">
                {{ formatPrice(event.price) }}
              </span>
              <Button size="sm">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
