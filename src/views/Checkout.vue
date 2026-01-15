<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import type { CreateOrderRequest } from '@/types'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()

const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const isSubmitting = ref(false)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const updateAttendeeName = (eventId: number, index: number, name: string) => {
  cartStore.updateAttendeeName(eventId, index, name)
}

const canSubmit = computed(() => {
  return customerName.value.trim() !== '' && 
         customerEmail.value.trim() !== '' &&
         cartStore.items.length > 0
})

const submitOrder = async () => {
  if (!canSubmit.value || isSubmitting.value) return

  isSubmitting.value = true
  ordersStore.error = null

  try {
    const tickets = cartStore.items.flatMap(item => 
      item.attendeeNames.map(attendeeName => ({
        event_id: item.event.id,
        attendee_name: attendeeName.trim() || undefined,
      }))
    )

    const orderData: CreateOrderRequest = {
      customer_name: customerName.value.trim(),
      customer_email: customerEmail.value.trim(),
      customer_phone: customerPhone.value.trim() || undefined,
      tickets,
    }

    console.log('Checkout - Creating order with data:', orderData)
    const order = await ordersStore.createOrder(orderData)
    console.log('Checkout - Order created:', order)
    
    if (order && order.id) {
      console.log('Checkout - Redirecting to payment with orderId:', order.id)
      cartStore.clearCart()
      router.push(`/payment?orderId=${order.id}`)
    } else {
      console.error('Checkout - Order created but no ID returned:', order)
      ordersStore.error = 'Order was created but ID is missing'
    }
  } catch (error: any) {
    console.error('Failed to create order:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-6xl mx-auto">
    <h1 class="text-3xl md:text-4xl font-bold mb-6">Pago</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-12">
      <p class="text-muted-foreground text-lg mb-4">Tu carrito está vacío</p>
      <Button @click="router.push('/')">
        Explorar Eventos
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <Label for="name">Nombre Completo *</Label>
                <Input 
                  id="name"
                  v-model="customerName"
                  placeholder="Juan Pérez"
                  class="mt-1"
                />
              </div>
              <div>
                <Label for="email">Correo Electrónico *</Label>
                <Input 
                  id="email"
                  v-model="customerEmail"
                  type="email"
                  placeholder="juan@ejemplo.com"
                  class="mt-1"
                />
              </div>
              <div>
                <Label for="phone">Teléfono (opcional)</Label>
                <Input 
                  id="phone"
                  v-model="customerPhone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  class="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card v-for="item in cartStore.items" :key="item.event.id">
          <CardHeader>
            <CardTitle class="text-xl">{{ item.event.name }}</CardTitle>
            <p class="text-sm text-muted-foreground">
              {{ item.quantity }} entrada(s) × {{ formatPrice(item.event.price) }}
            </p>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <p class="text-sm font-semibold">Nombres de Asistentes (opcional)</p>
              <div 
                v-for="(name, index) in item.attendeeNames" 
                :key="index"
                class="flex gap-2 items-center"
              >
                <span class="text-sm text-muted-foreground w-20">Entrada {{ index + 1 }}</span>
                <Input 
                  :value="name"
                  @update:modelValue="(value) => updateAttendeeName(item.event.id, index, value as string)"
                  placeholder="Nombre del asistente"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="lg:col-span-1">
        <Card class="sticky top-4">
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="space-y-2">
                <div v-for="item in cartStore.items" :key="item.event.id" class="flex justify-between text-sm">
                  <span>{{ item.event.name }} (×{{ item.quantity }})</span>
                  <span>{{ formatPrice(item.event.price * item.quantity) }}</span>
                </div>
              </div>

              <div class="border-t pt-4">
                <div class="flex justify-between mb-4">
                  <span class="font-semibold">Total de Entradas:</span>
                  <span class="font-semibold">{{ cartStore.totalItems }}</span>
                </div>
                <div class="flex justify-between mb-4">
                  <span class="text-xl font-bold">Total:</span>
                  <span class="text-2xl font-bold text-primary">
                    {{ formatPrice(cartStore.totalAmount) }}
                  </span>
                </div>

                <div v-if="ordersStore.error" class="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded">
                  {{ ordersStore.error }}
                </div>

                <Button 
                  @click="submitOrder"
                  :disabled="!canSubmit || isSubmitting"
                  class="w-full"
                  size="lg"
                >
                  {{ isSubmitting ? 'Procesando...' : 'Proceder al Pago' }}
                </Button>

                <p class="text-xs text-muted-foreground text-center mt-4">
                  Serás redirigido a WebPay para completar tu pago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
