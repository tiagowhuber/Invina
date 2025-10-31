<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import Card from '@/components/ui/Card.vue'
// import CardHeader from '@/components/ui/CardHeader.vue'
// import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Badge from '@/components/ui/Badge.vue'
import type { OrderWithDetails } from '@/types'

const router = useRouter()
const ordersStore = useOrdersStore()

const searchType = ref<'orderNumber' | 'email'>('orderNumber')
const orderNumber = ref('')
const email = ref('')
const searchResults = ref<OrderWithDetails[]>([])
const isSearching = ref(false)

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

const getStatusVariant = (status: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    paid: 'default',
    cancelled: 'destructive',
    expired: 'outline',
  }
  return variants[status] || 'secondary'
}

const searchByOrderNumber = async () => {
  if (!orderNumber.value.trim()) return

  isSearching.value = true
  try {
    await ordersStore.fetchOrderByNumber(orderNumber.value.trim())
    if (ordersStore.currentOrder) {
      router.push(`/orders/${ordersStore.currentOrder.order_number}`)
    }
  } catch (error) {
    console.error('Order not found:', error)
  } finally {
    isSearching.value = false
  }
}

const searchByEmail = async () => {
  if (!email.value.trim()) return

  isSearching.value = true
  try {
    const orders = await ordersStore.fetchOrdersByEmail(email.value.trim())
    searchResults.value = orders
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    isSearching.value = false
  }
}

const viewOrder = (orderNumber: string) => {
  router.push(`/orders/${orderNumber}`)
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <h1 class="text-3xl md:text-4xl font-bold mb-6">Find Your Order</h1>

    <Card class="mb-6">
      <CardContent class="pt-6">
        <div class="flex gap-4 mb-6 border-b">
          <button
            @click="searchType = 'orderNumber'; searchResults = []"
            :class="[
              'pb-2 px-1 font-medium transition-colors',
              searchType === 'orderNumber' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            Order Number
          </button>
          <button
            @click="searchType = 'email'; searchResults = []; ordersStore.error = null"
            :class="[
              'pb-2 px-1 font-medium transition-colors',
              searchType === 'email' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            Email Address
          </button>
        </div>

        <div v-if="searchType === 'orderNumber'" class="space-y-4">
          <div>
            <Label for="orderNumber">Order Number</Label>
            <Input 
              id="orderNumber"
              v-model="orderNumber"
              placeholder="ORD-20251031-XXXXXX"
              class="mt-1"
              @keyup.enter="searchByOrderNumber"
            />
          </div>
          <Button 
            @click="searchByOrderNumber"
            :disabled="!orderNumber.trim() || isSearching"
            class="w-full"
          >
            {{ isSearching ? 'Searching...' : 'Find Order' }}
          </Button>
          <div v-if="ordersStore.error" class="p-3 bg-destructive/10 text-destructive text-sm rounded">
            {{ ordersStore.error }}
          </div>
        </div>

        <div v-else class="space-y-4">
          <div>
            <Label for="email">Email Address</Label>
            <Input 
              id="email"
              v-model="email"
              type="email"
              placeholder="john@example.com"
              class="mt-1"
              @keyup.enter="searchByEmail"
            />
          </div>
          <Button 
            @click="searchByEmail"
            :disabled="!email.trim() || isSearching"
            class="w-full"
          >
            {{ isSearching ? 'Searching...' : 'Search Orders' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <div v-if="searchResults.length > 0" class="space-y-4">
      <h2 class="text-xl font-semibold">Your Orders ({{ searchResults.length }})</h2>
      
      <Card 
        v-for="order in searchResults" 
        :key="order.id"
        class="cursor-pointer hover:shadow-lg transition-shadow"
        @click="viewOrder(order.order_number)"
      >
        <CardContent class="pt-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="font-mono font-semibold">{{ order.order_number }}</p>
              <p class="text-sm text-muted-foreground">
                {{ formatDate(order.created_at) }}
              </p>
            </div>
            <Badge :variant="getStatusVariant(order.status)">
              {{ order.status.toUpperCase() }}
            </Badge>
          </div>

          <div class="space-y-2 text-sm">
            <p><strong>{{ order.tickets.length }}</strong> ticket(s)</p>
            <div v-if="order.tickets.length > 0" class="text-muted-foreground">
              {{ order.tickets.map(t => t.event_name).join(', ') }}
            </div>
          </div>

          <div class="flex justify-between items-center mt-4 pt-4 border-t">
            <span class="text-xl font-bold text-primary">
              {{ formatPrice(order.total_amount) }}
            </span>
            <Button size="sm" variant="outline">
              View Details →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="searchType === 'email' && !isSearching && email && !ordersStore.error" class="text-center py-12">
      <p class="text-muted-foreground">No orders found for this email address.</p>
    </div>
  </div>
</template>
