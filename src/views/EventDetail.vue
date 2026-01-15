<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { useCartStore } from '@/stores/cart'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const cartStore = useCartStore()

const quantity = ref(1)

onMounted(() => {
  const eventId = Number(route.params.id)
  eventsStore.fetchEventById(eventId)
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
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

const addToCart = () => {
  if (eventsStore.currentEvent && quantity.value > 0) {
    cartStore.addToCart(eventsStore.currentEvent, quantity.value)
    router.push('/checkout')
  }
}

const canAddToCart = () => {
  return eventsStore.currentEvent && 
         quantity.value > 0 && 
         quantity.value <= eventsStore.currentEvent.tickets_available
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto">
    <Button 
      variant="ghost" 
      @click="router.push('/')"
      class="mb-4"
    >
      ← Volver a Eventos
    </Button>

    <div v-if="eventsStore.loading" class="animate-pulse">
      <div class="h-8 bg-muted rounded w-3/4 mb-4"></div>
      <div class="h-64 bg-muted rounded"></div>
    </div>

    <div v-else-if="eventsStore.error" class="text-center py-12">
      <p class="text-destructive">{{ eventsStore.error }}</p>
    </div>

    <div v-else-if="eventsStore.currentEvent">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        {{ eventsStore.currentEvent.name }}
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div v-if="eventsStore.currentEvent.description">
                  <h3 class="font-semibold mb-2">Descripción</h3>
                  <p class="text-muted-foreground">{{ eventsStore.currentEvent.description }}</p>
                </div>

                <div>
                  <h3 class="font-semibold mb-2">Fecha y Hora</h3>
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDate(eventsStore.currentEvent.event_date) }}</span>
                  </div>
                </div>

                <div>
                  <h3 class="font-semibold mb-2">Ubicación</h3>
                  <div class="flex items-start gap-2 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p>{{ eventsStore.currentEvent.location }}</p>
                      <p v-if="eventsStore.currentEvent.address" class="text-sm">
                        {{ eventsStore.currentEvent.address }}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="font-semibold mb-2">Disponibilidad</h3>
                  <div class="flex gap-2">
                    <Badge variant="secondary">
                      {{ eventsStore.currentEvent.tickets_available }} de {{ eventsStore.currentEvent.capacity }} disponibles
                    </Badge>
                    <Badge v-if="eventsStore.currentEvent.tickets_available < 10" variant="destructive">
                      ¡Casi agotado!
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="lg:col-span-1">
          <Card class="sticky top-4">
            <CardHeader>
              <CardTitle class="text-3xl text-primary">
                {{ formatPrice(eventsStore.currentEvent.price) }}
              </CardTitle>
              <p class="text-sm text-muted-foreground">por entrada</p>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div>
                  <Label for="quantity">Cantidad de Entradas</Label>
                  <Input 
                    id="quantity"
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    :max="eventsStore.currentEvent.tickets_available"
                    class="mt-1"
                  />
                  <p class="text-sm text-muted-foreground mt-1">
                    Máximo: {{ eventsStore.currentEvent.tickets_available }}
                  </p>
                </div>

                <div class="border-t pt-4">
                  <div class="flex justify-between mb-4">
                    <span class="font-semibold">Total:</span>
                    <span class="text-2xl font-bold text-primary">
                      {{ formatPrice(eventsStore.currentEvent.price * quantity) }}
                    </span>
                  </div>

                  <Button 
                    @click="addToCart"
                    :disabled="!canAddToCart()"
                    class="w-full"
                    size="lg"
                  >
                    {{ canAddToCart() ? 'Continuar al Pago' : 'No Disponible' }}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
