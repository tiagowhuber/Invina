<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const router = useRouter()
const ordersStore = useOrdersStore()

onMounted(() => {
  ordersStore.fetchAllOrders()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
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

const viewOrder = (orderNumber: string) => {
  router.push(`/orders/${orderNumber}`)
}

const totalRevenue = () => {
  return ordersStore.orders
    .filter(order => order.status === 'paid')
    .reduce((sum, order) => sum + order.total_amount, 0)
}

const ordersByStatus = (status: string) => {
  return ordersStore.orders.filter(order => order.status === status).length
}
</script>

<template>
  <div class="w-full">
    <h1 class="text-3xl font-bold mb-6">Orders Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent class="pt-6">
          <p class="text-sm text-muted-foreground">Total Orders</p>
          <p class="text-3xl font-bold">{{ ordersStore.orders.length }}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <p class="text-sm text-muted-foreground">Paid</p>
          <p class="text-3xl font-bold text-green-600">{{ ordersByStatus('paid') }}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <p class="text-sm text-muted-foreground">Pending</p>
          <p class="text-3xl font-bold text-yellow-600">{{ ordersByStatus('pending') }}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <p class="text-sm text-muted-foreground">Revenue</p>
          <p class="text-3xl font-bold text-primary">{{ formatPrice(totalRevenue()) }}</p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <div class="flex justify-between items-center">
          <CardTitle>All Orders</CardTitle>
          <Button @click="ordersStore.fetchAllOrders()" variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="ordersStore.loading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="h-20 bg-muted rounded"></div>
          </div>
        </div>

        <div v-else-if="ordersStore.error" class="text-center py-12 text-destructive">
          {{ ordersStore.error }}
        </div>

        <div v-else-if="ordersStore.orders.length === 0" class="text-center py-12 text-muted-foreground">
          No orders found
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b">
              <tr class="text-left">
                <th class="pb-3 font-semibold">Order Number</th>
                <th class="pb-3 font-semibold">Customer</th>
                <th class="pb-3 font-semibold">Date</th>
                <th class="pb-3 font-semibold">Amount</th>
                <th class="pb-3 font-semibold">Status</th>
                <th class="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="order in ordersStore.orders" 
                :key="order.id"
                class="border-b hover:bg-muted/50 transition-colors"
              >
                <td class="py-3 font-mono text-xs">{{ order.order_number }}</td>
                <td class="py-3">
                  <div>{{ order.customer_name }}</div>
                  <div class="text-xs text-muted-foreground">{{ order.customer_email }}</div>
                </td>
                <td class="py-3 text-muted-foreground">{{ formatDate(order.created_at) }}</td>
                <td class="py-3 font-semibold">{{ formatPrice(order.total_amount) }}</td>
                <td class="py-3">
                  <Badge :variant="getStatusVariant(order.status)">
                    {{ order.status.toUpperCase() }}
                  </Badge>
                </td>
                <td class="py-3">
                  <Button @click="viewOrder(order.order_number)" variant="ghost" size="sm">
                    View →
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
