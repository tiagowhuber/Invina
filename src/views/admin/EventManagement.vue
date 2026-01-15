<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useEventsStore } from '@/stores/events'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Badge from '@/components/ui/Badge.vue'
import type { Event, CreateEventRequest, UpdateEventRequest } from '@/types'

const eventsStore = useEventsStore()

const showDialog = ref(false)
const editingEvent = ref<Event | null>(null)
const form = ref<CreateEventRequest>({
  name: '',
  description: '',
  event_date: '',
  location: '',
  address: '',
  capacity: 100,
  price: 0,
})

onMounted(() => {
  eventsStore.fetchEvents()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
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

const openCreateDialog = () => {
  editingEvent.value = null
  form.value = {
    name: '',
    description: '',
    event_date: '',
    location: '',
    address: '',
    capacity: 100,
    price: 0,
  }
  showDialog.value = true
}

const openEditDialog = (event: Event) => {
  editingEvent.value = event
  form.value = {
    name: event.name,
    description: event.description || '',
    event_date: event.event_date.substring(0, 16), // Format for datetime-local input
    location: event.location,
    address: event.address || '',
    capacity: event.capacity,
    price: event.price,
  }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  editingEvent.value = null
}

const handleSubmit = async () => {
  try {
    if (editingEvent.value) {
      await eventsStore.updateEvent(editingEvent.value.id, form.value as UpdateEventRequest)
    } else {
      await eventsStore.createEvent(form.value)
    }
    closeDialog()
  } catch (error) {
    console.error('Failed to save event:', error)
  }
}

const handleDelete = async (event: Event) => {
  if (confirm(`Are you sure you want to deactivate "${event.name}"?`)) {
    try {
      await eventsStore.deleteEvent(event.id)
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }
}

const toggleActive = async (event: Event) => {
  try {
    await eventsStore.updateEvent(event.id, { is_active: !event.is_active })
  } catch (error) {
    console.error('Failed to toggle event status:', error)
  }
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Gestión de Eventos</h1>
      <Button @click="openCreateDialog">
        + Crear Evento
      </Button>
    </div>

    <div v-if="eventsStore.loading" class="grid grid-cols-1 gap-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <Card>
          <CardContent class="pt-6">
            <div class="h-20 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div v-else-if="eventsStore.error" class="text-center py-12">
      <p class="text-destructive">{{ eventsStore.error }}</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <Card v-for="event in eventsStore.events" :key="event.id">
        <CardContent class="pt-6">
          <div class="flex justify-between items-start gap-4 flex-wrap">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-xl font-semibold">{{ event.name }}</h3>
                <Badge v-if="!event.is_active" variant="outline">Inactivo</Badge>
                <Badge v-else-if="event.tickets_available === 0" variant="destructive">Agotado</Badge>
                <Badge v-else variant="secondary">
                  {{ event.tickets_available }} disponibles
                </Badge>
              </div>
              <p v-if="event.description" class="text-sm text-muted-foreground mb-2">
                {{ event.description }}
              </p>
              <div class="text-sm text-muted-foreground space-y-1">
                <p>📅 {{ formatDate(event.event_date) }}</p>
                <p>📍 {{ event.location }}</p>
                <p>💵 {{ formatPrice(event.price) }} | Capacidad: {{ event.capacity }}</p>
                <p>Vendidas: {{ event.tickets_sold }} / {{ event.capacity }}</p>
              </div>
            </div>

            <div class="flex gap-2 shrink-0">
              <Button 
                @click="toggleActive(event)"
                :variant="event.is_active ? 'outline' : 'default'"
                size="sm"
              >
                {{ event.is_active ? 'Desactivar' : 'Activar' }}
              </Button>
              <Button @click="openEditDialog(event)" variant="outline" size="sm">
                Editar
              </Button>
              <Button @click="handleDelete(event)" variant="destructive" size="sm">
                Eliminar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Dialog Modal -->
    <div 
      v-if="showDialog" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeDialog"
    >
      <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{{ editingEvent ? 'Editar Evento' : 'Crear Evento' }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <Label for="name">Nombre del Evento *</Label>
              <Input 
                id="name"
                v-model="form.name"
                required
                class="mt-1"
              />
            </div>

            <div>
              <Label for="description">Descripción</Label>
              <Textarea 
                id="description"
                v-model="form.description"
                class="mt-1"
                :rows="3"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="event_date">Fecha y Hora del Evento *</Label>
                <Input 
                  id="event_date"
                  v-model="form.event_date"
                  type="datetime-local"
                  required
                  class="mt-1"
                />
              </div>

              <div>
                <Label for="location">Ubicación *</Label>
                <Input 
                  id="location"
                  v-model="form.location"
                  required
                  class="mt-1"
                />
              </div>
            </div>

            <div>
              <Label for="address">Dirección Completa</Label>
              <Input 
                id="address"
                v-model="form.address"
                class="mt-1"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="capacity">Capacidad *</Label>
                <Input 
                  id="capacity"
                  v-model.number="form.capacity"
                  type="number"
                  min="1"
                  required
                  class="mt-1"
                />
              </div>

              <div>
                <Label for="price">Precio (USD) *</Label>
                <Input 
                  id="price"
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="mt-1"
                />
              </div>
            </div>

            <div v-if="eventsStore.error" class="p-3 bg-destructive/10 text-destructive text-sm rounded">
              {{ eventsStore.error }}
            </div>

            <div class="flex gap-2 justify-end pt-4">
              <Button type="button" @click="closeDialog" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" :disabled="eventsStore.loading">
                {{ eventsStore.loading ? 'Guardando...' : (editingEvent ? 'Actualizar' : 'Crear') }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
