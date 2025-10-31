<script setup lang="ts">
import { ref } from 'vue'
import { ticketsApi } from '@/services/api/tickets'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Badge from '@/components/ui/Badge.vue'
import type { TicketWithDetails } from '@/types'

const ticketNumber = ref('')
const ticket = ref<TicketWithDetails | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

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

const searchTicket = async () => {
  if (!ticketNumber.value.trim()) return

  loading.value = true
  error.value = null
  successMessage.value = null
  ticket.value = null

  try {
    const response = await ticketsApi.getByTicketNumber(ticketNumber.value.trim())
    if (response.data.success && response.data.data) {
      ticket.value = response.data.data
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ticket not found'
  } finally {
    loading.value = false
  }
}

const markAsUsed = async () => {
  if (!ticket.value) return

  loading.value = true
  error.value = null
  successMessage.value = null

  try {
    const response = await ticketsApi.markAsUsedByNumber(ticket.value.ticket_number)
    if (response.data.success) {
      successMessage.value = 'Ticket marked as used successfully!'
      // Refresh ticket data
      await searchTicket()
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to mark ticket as used'
  } finally {
    loading.value = false
  }
}

const reset = () => {
  ticket.value = null
  ticketNumber.value = ''
  error.value = null
  successMessage.value = null
}

const canMarkAsUsed = () => {
  return ticket.value && ticket.value.status === 'confirmed'
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Ticket Validation</h1>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Scan or Enter Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="searchTicket" class="space-y-4">
          <div>
            <Label for="ticketNumber">Ticket Number</Label>
            <Input 
              id="ticketNumber"
              v-model="ticketNumber"
              placeholder="TKT-20251031-XXXXXX"
              class="mt-1"
              autofocus
            />
            <p class="text-xs text-muted-foreground mt-1">
              Scan the QR code or enter the ticket number manually
            </p>
          </div>

          <div class="flex gap-2">
            <Button 
              type="submit"
              :disabled="!ticketNumber.trim() || loading"
              class="flex-1"
            >
              {{ loading ? 'Searching...' : 'Validate Ticket' }}
            </Button>
            <Button 
              type="button"
              @click="reset"
              variant="outline"
            >
              Clear
            </Button>
          </div>

          <div v-if="error" class="p-3 bg-destructive/10 text-destructive text-sm rounded">
            {{ error }}
          </div>

          <div v-if="successMessage" class="p-3 bg-green-500/10 text-green-700 text-sm rounded">
            {{ successMessage }}
          </div>
        </form>
      </CardContent>
    </Card>

    <Card v-if="ticket" class="border-2" :class="{
      'border-green-500': ticket.status === 'confirmed',
      'border-red-500': ticket.status === 'cancelled',
      'border-gray-400': ticket.status === 'used',
    }">
      <CardHeader>
        <div class="flex justify-between items-start">
          <CardTitle class="text-xl">{{ ticket.event_name }}</CardTitle>
          <Badge :variant="getTicketStatusVariant(ticket.status)" class="text-sm">
            {{ ticket.status.toUpperCase() }}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted-foreground">Ticket Number</p>
              <p class="font-mono font-semibold">{{ ticket.ticket_number }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Order Number</p>
              <p class="font-mono font-semibold">{{ ticket.order_number }}</p>
            </div>
          </div>

          <div>
            <p class="text-sm text-muted-foreground">Event Date & Time</p>
            <p class="font-medium">{{ formatDate(ticket.event_date) }}</p>
          </div>

          <div>
            <p class="text-sm text-muted-foreground">Location</p>
            <p class="font-medium">{{ ticket.location }}</p>
            <p v-if="ticket.address" class="text-xs text-muted-foreground mt-1">
              {{ ticket.address }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted-foreground">Customer</p>
              <p class="font-medium">{{ ticket.customer_name }}</p>
              <p class="text-xs text-muted-foreground">{{ ticket.customer_email }}</p>
            </div>
            <div v-if="ticket.attendee_name">
              <p class="text-sm text-muted-foreground">Attendee</p>
              <p class="font-medium">{{ ticket.attendee_name }}</p>
            </div>
          </div>

          <div v-if="ticket.status === 'confirmed'" class="bg-green-500/10 p-4 rounded-lg border-2 border-green-500">
            <div class="flex items-center justify-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-2xl font-bold text-green-700">VALID TICKET</span>
            </div>
            <Button 
              @click="markAsUsed"
              :disabled="loading"
              class="w-full"
              size="lg"
            >
              {{ loading ? 'Processing...' : 'Mark as Used & Allow Entry' }}
            </Button>
          </div>

          <div v-else-if="ticket.status === 'used'" class="bg-gray-100 p-4 rounded-lg border-2 border-gray-400 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-bold text-gray-700">ALREADY USED</p>
            <p class="text-sm text-gray-600 mt-2">This ticket has already been validated</p>
          </div>

          <div v-else class="bg-red-500/10 p-4 rounded-lg border-2 border-red-500 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-bold text-red-700">INVALID TICKET</p>
            <p class="text-sm text-red-600 mt-2">This ticket cannot be used ({{ ticket.status }})</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
