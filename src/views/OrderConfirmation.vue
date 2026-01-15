<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Qrcode from 'qrcode.vue'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()

const timeRemaining = ref<number | null>(null)
const timerInterval = ref<number | null>(null)

onMounted(async () => {
  const orderNumber = route.params.orderNumber as string
  
  if (orderNumber) {
    await ordersStore.fetchOrderByNumber(orderNumber)
    startExpirationTimer()
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
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

const getStatusVariant = (status: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    paid: 'default',
    cancelled: 'destructive',
    expired: 'outline',
  }
  return variants[status] || 'secondary'
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

const startExpirationTimer = () => {
  if (!ordersStore.currentOrder || ordersStore.currentOrder.status !== 'pending') return

  const updateTimer = () => {
    if (!ordersStore.currentOrder) return

    const createdAt = new Date(ordersStore.currentOrder.created_at).getTime()
    const expirationTime = createdAt + (15 * 60 * 1000) // 15 minutes
    const now = Date.now()
    const remaining = Math.max(0, expirationTime - now)

    timeRemaining.value = remaining

    if (remaining === 0) {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }
      ordersStore.fetchOrderByNumber(ordersStore.currentOrder.order_number)
    }
  }

  updateTimer()
  timerInterval.value = window.setInterval(updateTimer, 1000)
}

const formatTimeRemaining = computed(() => {
  if (timeRemaining.value === null) return ''
  
  const minutes = Math.floor(timeRemaining.value / 60000)
  const seconds = Math.floor((timeRemaining.value % 60000) / 1000)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <div class="w-full max-w-4xl mx-auto">
    <Button 
      variant="ghost" 
      @click="router.push('/orders/lookup')"
      class="mb-4"
    >
      ← Volver a Búsqueda de Pedidos
    </Button>

    <div v-if="ordersStore.loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-muted rounded w-1/2"></div>
      <div class="h-64 bg-muted rounded"></div>
    </div>

    <div v-else-if="ordersStore.error" class="text-center py-12">
      <p class="text-destructive mb-4">{{ ordersStore.error }}</p>
      <Button @click="router.push('/orders/lookup')">
        Ir a Búsqueda de Pedidos
      </Button>
    </div>

    <div v-else-if="ordersStore.currentOrder" class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2">Pedido {{ ordersStore.currentOrder.order_number }}</h1>
          <Badge :variant="getStatusVariant(ordersStore.currentOrder.status)">
            {{ ordersStore.currentOrder.status.toUpperCase() }}
          </Badge>
        </div>

        <div v-if="ordersStore.currentOrder.status === 'pending' && timeRemaining !== null" 
             class="text-right">
          <p class="text-sm text-muted-foreground">El pedido expira en</p>
          <p class="text-2xl font-bold text-destructive">{{ formatTimeRemaining }}</p>
        </div>
      </div>

      <Card v-if="ordersStore.currentOrder.status === 'pending'">
        <CardContent class="pt-6">
          <div class="bg-secondary/50 p-4 rounded-lg text-center">
            <p class="font-semibold mb-2">⏱️ Pago Pendiente</p>
            <p class="text-sm text-muted-foreground mb-4">
              Por favor completa tu pago dentro de {{ formatTimeRemaining }} para asegurar tus entradas.
            </p>
            <Button size="lg" @click="router.push(`/payment?orderId=${ordersStore.currentOrder.id}`)">
              Continuar al Pago
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card v-else-if="ordersStore.currentOrder.status === 'paid'">
        <CardContent class="pt-6">
          <div class="bg-primary/10 p-4 rounded-lg text-center">
            <p class="text-2xl mb-2">✅</p>
            <p class="font-semibold text-lg">¡Pago Exitoso!</p>
            <p class="text-sm text-muted-foreground">
              Tus entradas han sido confirmadas. Revisa tu correo electrónico para más detalles.
            </p>
          </div>
        </CardContent>
      </Card>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <dl class="space-y-2 text-sm">
              <div>
                <dt class="text-muted-foreground">Nombre</dt>
                <dd class="font-medium">{{ ordersStore.currentOrder.customer_name }}</dd>
              </div>
              <div>
                <dt class="text-muted-foreground">Correo Electrónico</dt>
                <dd class="font-medium">{{ ordersStore.currentOrder.customer_email }}</dd>
              </div>
              <div v-if="ordersStore.currentOrder.customer_phone">
                <dt class="text-muted-foreground">Teléfono</dt>
                <dd class="font-medium">{{ ordersStore.currentOrder.customer_phone }}</dd>
              </div>
              <div>
                <dt class="text-muted-foreground">Fecha del Pedido</dt>
                <dd class="font-medium">{{ formatDate(ordersStore.currentOrder.created_at) }}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen del Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Total de Entradas</span>
                <span class="font-medium">{{ ordersStore.currentOrder.tickets.length }}</span>
              </div>
              <div class="flex justify-between text-xl font-bold border-t pt-4">
                <span>Monto Total</span>
                <span class="text-primary">{{ formatPrice(ordersStore.currentOrder.total_amount) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entradas ({{ ordersStore.currentOrder.tickets.length }})</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div 
              v-for="ticket in ordersStore.currentOrder.tickets" 
              :key="ticket.id"
              class="border rounded-lg p-4 space-y-3"
            >
              <div class="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 class="font-semibold">{{ ticket.event_name }}</h4>
                  <p class="text-sm text-muted-foreground">{{ ticket.ticket_number }}</p>
                  <p v-if="ticket.attendee_name" class="text-sm">
                    Asistente: {{ ticket.attendee_name }}
                  </p>
                </div>
                <Badge :variant="getTicketStatusVariant(ticket.status)">
                  {{ ticket.status.toUpperCase() }}
                </Badge>
              </div>

              <div class="text-sm text-muted-foreground">
                <p>📅 {{ formatDate(ticket.event_date) }}</p>
                <p>📍 {{ ticket.location }}</p>
                <p v-if="ticket.address" class="text-xs">{{ ticket.address }}</p>
              </div>

              <div v-if="ticket.status === 'confirmed'" class="border-t pt-3 flex justify-center">
                <Qrcode 
                  :value="ticket.ticket_number" 
                  :size="150"
                  level="M"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
