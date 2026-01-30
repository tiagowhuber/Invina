<template>
  <div class="tour-booking min-h-screen bg-background text-foreground py-12 md:py-10">
    <div class="container mx-auto px-6 max-w-6xl">
        <!-- Back Link -->
        <router-link 
            :to="currentTour ? { name: 'tour-detail', params: { id: currentTour.id } } : { name: 'home' }" 
            class="inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-12"
        >
            &larr; Volver
        </router-link>

        <div v-if="!currentTour" class="text-center py-24">
            <span class="font-serif italic text-xl text-muted-foreground">Cargando experiencia...</span>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            <!-- Left Column: Form -->
            <div class="lg:col-span-7">
                <header class="mb-16">
                    <span class="text-xs uppercase tracking-[0.2em] text-primary mb-4 block">Confirmación</span>
                    <h1 class="text-4xl md:text-5xl font-serif text-foreground mb-4">Reserva tu Visita</h1>
                    <p class="text-muted-foreground font-light">{{ currentTour.name }}</p>
                </header>

                <div v-if="localError" class="bg-destructive/10 border border-destructive/20 p-6 mb-8">
                    <p class="text-destructive text-sm">{{ localError }}</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-16">
                    
                    <!-- Step 1: When -->
                    <section class="space-y-8">
                        <h3 class="text-xl font-serif border-b border-border pb-4">01. Fecha y Hora</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Date -->
                            <div class="space-y-4">
                                <label class="text-xs uppercase tracking-widest text-muted-foreground">Fecha</label>
                                <input
                                    v-model="form.date"
                                    type="date"
                                    :min="minDate"
                                    required
                                    class="w-full bg-transparent border-b border-border py-2 font-serif text-lg focus:outline-none focus:border-primary transition-colors"
                                    @change="handleDateChange"
                                />
                            </div>

                            <!-- Time -->
                            <div v-if="form.date" class="space-y-4">
                                <label class="text-xs uppercase tracking-widest text-muted-foreground">Hora</label>
                                <div v-if="loading" class="text-sm italic text-muted-foreground animate-pulse">Buscando horarios...</div>
                                <div v-else-if="currentSlots.length === 0" class="text-sm text-destructive">Sin disponibilidad para esta fecha.</div>
                                <div v-else class="grid grid-cols-2 gap-2">
                                     <button
                                        v-for="timeStr in currentSlots"
                                        :key="timeStr"
                                        type="button"
                                        @click="form.time = timeStr"
                                        :class="[
                                            'px-4 py-2 text-sm transition-all border',
                                            form.time === timeStr
                                            ? 'bg-primary border-primary text-primary-foreground'
                                            : 'border-border hover:border-primary/50 text-muted-foreground'
                                        ]"
                                    >
                                        {{ timeStr.substring(0, 5) }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Step 2: Details -->
                    <section class="space-y-8">
                         <h3 class="text-xl font-serif border-b border-border pb-4">02. Datos de Cliente</h3>
                         
                         <!-- Attendees -->
                        <div class="space-y-4">
                            <label class="text-xs uppercase tracking-widest text-muted-foreground">Número de Invitados (Mín: {{ currentTour.minAttendants || 1 }})</label>
                            <input
                                v-model.number="form.attendeesCount"
                                type="number"
                                :min="currentTour.minAttendants || 1"
                                :max="currentTour.maxAttendants"
                                required
                                class="w-full bg-transparent border-b border-border py-2 font-serif text-lg focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                         <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="space-y-4">
                                <label class="text-xs uppercase tracking-widest text-muted-foreground">Nombre Completo</label>
                                <input
                                    v-model="form.customerName"
                                    type="text"
                                    required
                                    class="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                             <div class="space-y-4">
                                <label class="text-xs uppercase tracking-widest text-muted-foreground">RUT</label>
                                <input
                                    v-model="form.customerRut"
                                    type="text"
                                    required
                                    class="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                                    placeholder="12.345.678-9"
                                />
                            </div>
                             <div class="space-y-4">
                                <label class="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                                <input
                                    v-model="form.customerEmail"
                                    type="email"
                                    required
                                    class="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                             <div class="space-y-4">
                                <label class="text-xs uppercase tracking-widest text-muted-foreground">Teléfono</label>
                                <input
                                    v-model="form.customerPhone"
                                    type="tel"
                                    class="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                         </div>
                    </section>
                </form>
            </div>

            <!-- Right Column: Summary Sticky -->
            <div class="lg:col-span-5 relative">
                <div class="lg:sticky lg:top-32 bg-secondary/30 border border-border p-8 md:p-12 backdrop-blur-sm">
                    <h3 class="font-serif text-2xl mb-8">Resumen</h3>
                    
                    <div class="space-y-6 text-sm">
                        <div class="flex justify-between border-b border-border/50 pb-4">
                            <span class="text-muted-foreground">Experiencia</span>
                            <span class="font-medium text-right max-w-[50%]">{{ currentTour.name }}</span>
                        </div>
                        <div v-if="selectedMenu" class="border-b border-border/50 pb-4">
                            <!-- Toggle Header -->
                            <div 
                                @click="isMenuExpanded = !isMenuExpanded" 
                                class="flex justify-between items-start cursor-pointer group py-2 -mx-2 px-2 hover:bg-black/5 rounded transition-colors select-none"
                                title="Ver detalle"
                            >
                                <div class="flex flex-col">
                                     <span class="text-muted-foreground text-xs uppercase tracking-widest mb-1">Menú Seleccionado</span>
                                     <span class="font-serif text-lg text-primary group-hover:text-foreground transition-colors loading-tight">
                                        {{ selectedMenu.name }}
                                    </span>
                                </div>
                                <span class="text-[10px] text-muted-foreground mt-1 transition-transform duration-300" :class="{ 'rotate-180': isMenuExpanded }">
                                    ▼
                                </span>
                            </div>
                            
                            <!-- Expanded Content -->
                            <transition
                                enter-active-class="transition duration-300 ease-out"
                                enter-from-class="opacity-0 -translate-y-2"
                                enter-to-class="opacity-100 translate-y-0"
                                leave-active-class="transition duration-200 ease-in"
                                leave-from-class="opacity-100 translate-y-0"
                                leave-to-class="opacity-0 -translate-y-2"
                            >
                                <div v-show="isMenuExpanded" class="mt-2 pt-4 border-t border-border/30 pl-1">
                                    <p v-if="selectedMenu.description" class="text-sm font-light text-foreground/80 mb-6 leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                                        "{{ selectedMenu.description }}"
                                    </p>
                                    
                                    <div v-if="selectedMenu.wines && selectedMenu.wines.length > 0">
                                        <span class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4 block">Maridaje & Vinos</span>
                                        <ul class="space-y-4">
                                            <li v-for="wine in selectedMenu.wines" :key="wine.id" class="group/wine flex items-baseline gap-3">
                                                <span class="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/wine:bg-primary transition-colors shrink-0 translate-y-1"></span>
                                                <div class="flex flex-col">
                                                    <span class="font-serif text-base text-foreground group-hover/wine:text-primary transition-colors leading-none">{{ wine.name }}</span>
                                                    <span v-if="wine.varietal" class="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1">{{ wine.varietal }}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <p v-else class="text-xs text-muted-foreground italic pl-4">Detalle de vinos no disponible.</p>
                                </div>
                            </transition>
                        </div>
                         <div class="flex justify-between border-b border-border/50 pb-4">
                            <span class="text-muted-foreground">Fecha</span>
                            <span class="font-medium">{{ form.date || '—' }}</span>
                        </div>
                         <div class="flex justify-between border-b border-border/50 pb-4">
                            <span class="text-muted-foreground">Hora</span>
                            <span class="font-medium">{{ form.time || '—' }}</span>
                        </div>
                        <div class="flex justify-between border-b border-border/50 pb-4">
                            <span class="text-muted-foreground">Invitados</span>
                            <span class="font-medium">{{ form.attendeesCount }}</span>
                        </div>
                         <div class="flex justify-between items-center pt-4">
                            <span class="font-serif text-lg">Total Estimado</span>
                            <span class="font-serif text-3xl text-primary">${{ totalApprox.toLocaleString() }}</span>
                        </div>
                    </div>

                    <button
                        @click="handleSubmit"
                        :disabled="!isFormValid || submitting"
                        class="w-full mt-12 bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ submitting ? 'Procesando...' : 'Confirmar Reserva' }}
                    </button>
                    <p class="text-[10px] text-muted-foreground text-center mt-4 uppercase tracking-wider">Pago seguro vía WebPay</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToursStore } from '@/stores/tours'
import { storeToRefs } from 'pinia'
import { ordersApi } from '@/services/api' 

const route = useRoute()
const toursStore = useToursStore()
const { currentTour, currentSlots, loading } = storeToRefs(toursStore)

const tourId = parseInt(route.params.id as string)

const submitting = ref(false)
const localError = ref<string | null>(null)
const isMenuExpanded = ref(false)

const form = ref({
  date: '',
  time: '',
  attendeesCount: 1,
  customerName: '',
  customerRut: '',
  customerEmail: '',
  customerPhone: '',
  menuId: null as number | null,
})

const hasMenus = computed(() => {
    return currentTour.value?.menus && currentTour.value.menus.length > 0;
});

const pricePerPerson = computed(() => {
    if (!currentTour.value) return 0;
    if (form.value.menuId) {
        const menu = currentTour.value.menus?.find(m => m.id === form.value.menuId);
        return menu ? Number(menu.price) : currentTour.value.basePrice;
    }
    return currentTour.value.basePrice;
});

// Validation
const isFormValid = computed(() => {
  const basicValid = (
    form.value.date &&
    form.value.time &&
    form.value.attendeesCount > 0 &&
    form.value.customerName.length > 2 &&
    form.value.customerRut.length > 6 &&
    form.value.customerEmail.includes('@')
  );

  if (hasMenus.value && !form.value.menuId) return false;

  return basicValid;
})

const totalApprox = computed(() => {
   if (!currentTour.value) return 0
   return pricePerPerson.value * form.value.attendeesCount
})

const selectedMenu = computed(() => {
    if (!currentTour.value || !form.value.menuId) return null;
    return currentTour.value.menus?.find(m => m.id === form.value.menuId);
})

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Actions
async function handleDateChange() {
  if (form.value.date && tourId) {
    form.value.time = ''
    await toursStore.fetchSlots(tourId, form.value.date)
  }
}

async function handleSubmit() {
  if (!isFormValid.value || !currentTour.value) return
  
  submitting.value = true
  localError.value = null

  try {
     const response = await ordersApi.create({
       tourId,
       date: form.value.date,
       time: form.value.time,
       attendeesCount: form.value.attendeesCount,
       menuId: form.value.menuId || undefined,
       customerRut: form.value.customerRut,
       customerName: form.value.customerName,
       customerEmail: form.value.customerEmail,
       customerPhone: form.value.customerPhone
     })

     console.log('Order create response', response)
     if (response.paymentUrl && response.token) {
        // Redirection to VirtualPOS
        // The URL provided by the backend is the Web Checkout URL
        window.location.href = response.paymentUrl;
        return;
     }

     localError.value = 'No se recibió URL de pago. Intenta nuevamente.'
     submitting.value = false

  } catch (err: any) {
     console.error(err)
     localError.value = err.response?.data?.error || 'Error al iniciar la reserva.'
     submitting.value = false
  }
}

// Init
onMounted(async () => {
   // Ensure tours are loaded to find current
   if (toursStore.tours.length === 0) {
      await toursStore.fetchTours()
   }
   const tour = toursStore.getTourById(tourId)
   if (tour) {
     form.value.attendeesCount = tour.minAttendants
   }

   // Handle pre-selected menu from query params
   const preSelectedMenuId = route.query.menuId
   if (preSelectedMenuId) {
      const menuIdNum = parseInt(preSelectedMenuId as string)
      // Verify validity
      if (tour?.menus?.some(m => m.id === menuIdNum)) {
          form.value.menuId = menuIdNum
      }
   }
})
</script>
