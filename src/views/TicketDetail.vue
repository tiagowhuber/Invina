<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ticketsApi } from '@/services/api/tickets'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Qrcode from 'qrcode.vue'
import type { TicketWithDetails } from '@/types'

const route = useRoute()
const router = useRouter()

const ticket = ref<TicketWithDetails | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  const ticketNumber = route.params.ticketNumber as string
  
  if (ticketNumber) {
    loading.value = true
    try {
      const response = await ticketsApi.getByTicketNumber(ticketNumber)
      if (response.data.success && response.data.data) {
        ticket.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ticket not found'
    } finally {
      loading.value = false
    }
  }
})

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

const getTicketStatusVariant = (status: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    reserved: 'secondary',
    confirmed: 'default',
    used: 'outline',
    cancelled: 'destructive',
  }
  return variants[status] || 'secondary'
}

const viewOrder = () => {
  if (ticket.value) {
    router.push(`/orders/${ticket.value.order_number}`)
  }
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <Button 
      variant="ghost" 
      @click="router.push('/orders/lookup')"
      class="mb-4"
    >
      ← Back
    </Button>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-muted rounded w-1/2"></div>
      <div class="h-64 bg-muted rounded"></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-destructive mb-4">{{ error }}</p>
      <Button @click="router.push('/orders/lookup')">
        Go to Order Lookup
      </Button>
    </div>

    <div v-else-if="ticket" class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-2xl font-bold mb-2">{{ ticket.event_name }}</h1>
          <p class="text-muted-foreground font-mono">{{ ticket.ticket_number }}</p>
        </div>
        <Badge :variant="getTicketStatusVariant(ticket.status)" class="text-sm px-3 py-1">
          {{ ticket.status.toUpperCase() }}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-muted-foreground">Event</dt>
              <dd class="font-medium text-lg">{{ ticket.event_name }}</dd>
            </div>
            <div>
              <dt class="text-muted-foreground">Date & Time</dt>
              <dd class="font-medium">{{ formatDate(ticket.event_date) }}</dd>
            </div>
            <div>
              <dt class="text-muted-foreground">Location</dt>
              <dd class="font-medium">{{ ticket.location }}</dd>
              <dd v-if="ticket.address" class="text-xs text-muted-foreground mt-1">
                {{ ticket.address }}
              </dd>
            </div>
            <div v-if="ticket.attendee_name">
              <dt class="text-muted-foreground">Attendee</dt>
              <dd class="font-medium">{{ ticket.attendee_name }}</dd>
            </div>
            <div>
              <dt class="text-muted-foreground">Customer</dt>
              <dd class="font-medium">{{ ticket.customer_name }}</dd>
              <dd class="text-xs text-muted-foreground">{{ ticket.customer_email }}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card v-if="ticket.status === 'confirmed'">
        <CardHeader>
          <CardTitle class="text-center">Entry QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex justify-center py-4">
            <Qrcode 
              :value="ticket.ticket_number" 
              :size="250"
              level="M"
            />
          </div>
          <p class="text-center text-sm text-muted-foreground mt-4">
            Show this QR code at the venue entrance
          </p>
        </CardContent>
      </Card>

      <div class="flex gap-4">
        <Button @click="viewOrder" variant="outline" class="flex-1">
          View Full Order
        </Button>
      </div>
    </div>
  </div>
</template>
