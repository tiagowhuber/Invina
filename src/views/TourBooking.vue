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
                                <label class="text-xs uppercase tracking-widest text-muted-foreground">
                                    Fecha <span v-if="currentTour?.tourType === 'Standard'" class="text-[10px] normal-case tracking-normal">(Lun-Sáb)</span>
                                </label>
                                <div class="relative grid">
                                    <span 
                                        class="col-start-1 row-start-1 py-2 font-serif text-lg pointer-events-none truncate pr-8"
                                        :class="form.date ? 'text-foreground' : 'text-muted-foreground/50'"
                                    >
                                        {{ formattedDate || 'dd/mm/yyyy' }}
                                    </span>
                                    <input
                                        v-model="form.date"
                                        type="date"
                                        :min="minDate"
                                        required
                                        class="col-start-1 row-start-1 w-full bg-transparent border-b border-border py-2 font-serif text-lg focus:outline-none focus:border-primary transition-colors text-transparent z-10 cursor-pointer placeholder-transparent"
                                        @change="handleDateChange"
                                    />
                                </div>
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
                                            ? 'bg-primary border-primary text-primary-foreground ring-2 ring-black ring-offset-1'
                                            : 'border-border hover:border-primary/50 text-muted-foreground'
                                        ]"
                                    >
                                        {{ timeStr.substring(0, 5) }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Step 2: Additionals (Optional) -->
                    <section v-if="availableAdditionals.length > 0" class="space-y-8">
                         <h3 class="text-xl font-serif border-b border-border pb-4">02. Complementos</h3>
                         <div class="space-y-4">
                             <div v-for="add in availableAdditionals" :key="add.id" class="flex items-start space-x-4 border border-border p-4 hover:border-primary/50 transition-colors">
                                 <input 
                                    type="checkbox" 
                                    :id="`add-${add.id}`"
                                    :value="add.id"
                                    v-model="form.additionalIds"
                                    class="mt-1 w-5 h-5 text-primary border-border focus:ring-primary rounded cursor-pointer accent-primary"
                                 />
                                 <label :for="`add-${add.id}`" class="flex-1 cursor-pointer select-none">
                                     <div class="flex justify-between items-baseline">
                                         <span class="font-serif font-medium text-foreground">{{ add.name }}</span>
                                         <span class="text-sm font-semibold text-primary">+${{ Number(add.price).toLocaleString() }}</span>
                                     </div>
                                     <p class="text-sm text-muted-foreground mt-1">{{ add.description }}</p>
                                 </label>
                             </div>
                         </div>
                    </section>

                    <!-- Step 3: Details -->
                    <section class="space-y-8">
                         <h3 class="text-xl font-serif border-b border-border pb-4">03. Datos de Cliente</h3>
                         
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
                                        <span class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4 block">Elegir 4 en tu visita</span>
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
                            <span class="font-medium">{{ formattedDate || '—' }}</span>
                        </div>
                         <div class="flex justify-between border-b border-border/50 pb-4">
                            <span class="text-muted-foreground">Hora</span>
                            <span class="font-medium">{{ form.time ? form.time.substring(0, 5) : '—' }}</span>
                        </div>
                        <div class="flex justify-between border-b border-border/50 pb-4">
                            <span class="text-muted-foreground">Invitados</span>
                            <div class="text-right">
                                <span class="font-medium block">{{ form.attendeesCount }}</span>
                                <span v-if="form.attendeesCount >= DISCOUNT_THRESHOLD" class="text-xs text-primary font-medium">
                                    ¡{{ DISCOUNT_RATE * 100 }}% Dcto aplicado!
                                </span>
                            </div>
                        </div>

                        <div v-if="selectedAdditionals.length > 0" class="border-b border-border/50 pb-4">
                             <span class="block text-muted-foreground mb-2">Complementos</span>
                             <ul class="space-y-2">
                                 <li v-for="add in selectedAdditionals" :key="add.id" class="flex justify-between text-sm">
                                     <span class="text-foreground/80">{{ add.name }}</span>
                                     <span class="font-medium">+${{ Number(add.price).toLocaleString() }}</span>
                                 </li>
                             </ul>
                        </div>

                         <div class="flex justify-between items-center pt-4">
                            <span class="font-serif text-lg">Total</span>
                            <span class="font-serif text-3xl text-primary">${{ totalApprox.toLocaleString() }}</span>
                        </div>
                    </div>

                    <div v-if="validationError" class="mt-8 p-4 bg-destructive/5 border-l-2 border-destructive animate-in fade-in slide-in-from-bottom-1 duration-300">
                        <div class="flex gap-3">
                            <span class="text-destructive text-lg">!</span>
                            <p class="text-sm font-medium text-destructive/90 leading-relaxed self-center">
                                {{ validationError }}
                            </p>
                        </div>
                    </div>

                    <button
                        @click="handleSubmit"
                        :disabled="submitting"
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
const validationError = ref<string | null>(null)
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
  additionalIds: [] as number[],
})

const availableAdditionals = computed(() => {
    return currentTour.value?.additionals?.filter(a => a.isActive) || []
})

const formattedDate = computed(() => {
  if (!form.value.date) return ''
  const [year, month, day] = form.value.date.split('-')
  return `${day}/${month}/${year}`
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

const DISCOUNT_THRESHOLD = 5
const DISCOUNT_RATE = 0.10

const totalApprox = computed(() => {
   if (!currentTour.value) return 0
   
   let ticketsTotal = pricePerPerson.value * form.value.attendeesCount
   
   // Apply discount for larger groups (mirrors backend logic)
   if (form.value.attendeesCount >= DISCOUNT_THRESHOLD) {
       ticketsTotal = ticketsTotal * (1 - DISCOUNT_RATE)
   }
   
   let total = ticketsTotal

   // Add additionals
   if (form.value.additionalIds && form.value.additionalIds.length > 0) {
       const adds = currentTour.value.additionals?.filter(a => form.value.additionalIds.includes(a.id))
       if (adds) {
           total += adds.reduce((sum, a) => sum + Number(a.price), 0)
       }
   }
   return Math.round(total)
})

const selectedMenu = computed(() => {
    if (!currentTour.value || !form.value.menuId) return null;
    return currentTour.value.menus?.find(m => m.id === form.value.menuId);
})

const selectedAdditionals = computed(() => {
    if (!currentTour.value || !form.value.additionalIds.length) return [];
    return currentTour.value.additionals?.filter(a => form.value.additionalIds.includes(a.id)) || [];
})

const minDate = computed(() => {
  if (!currentTour.value) {
    const d = new Date() 
    d.setDate(d.getDate() + 1) 
    return d.toISOString().split('T')[0]
  }
  
  // Anticipation logic
  const now = new Date()
  const daysToAdd = currentTour.value.tourType === 'Special' ? 3 : 1
  now.setDate(now.getDate() + daysToAdd)
  return now.toISOString().split('T')[0]
})

// Actions
async function handleDateChange() {
  validationError.value = null
  
  if (form.value.date && tourId) {
    // Validate Sundays for Standard tours
    if (currentTour.value?.tourType === 'Standard') {
        const [y, m, d] = form.value.date.split('-').map(Number)
        const dateObj = new Date(y, m - 1, d)
        
        if (dateObj.getDay() === 0) { // Sunday
            form.value.date = ''
            validationError.value = 'Las visitas estándar están disponibles solo de Lunes a Sábado.'
            return
        }
    }

    form.value.time = ''
    await toursStore.fetchSlots(tourId, form.value.date)
  }
}

async function handleSubmit() {
  validationError.value = null
  
  if (!isFormValid.value) {
      // Granular validation messages
      if (!form.value.date) validationError.value = 'Por favor, selecciona una fecha para tu visita.'
      else if (!form.value.time) validationError.value = 'Debes seleccionar un horario disponible.'
      else if (hasMenus.value && !form.value.menuId) validationError.value = 'Esta experiencia requiere seleccionar un menú.'
      else if (form.value.attendeesCount < 1) validationError.value = 'El número de invitados debe ser al menos 1.'
      else if (!form.value.customerName || form.value.customerName.length <= 2) validationError.value = 'Por favor ingresa tu nombre completo.'
      else if (!form.value.customerRut || form.value.customerRut.length <= 6) validationError.value = 'Ingresa un RUT válido para la facturación.'
      else if (!form.value.customerEmail || !form.value.customerEmail.includes('@')) validationError.value = 'Necesitamos un email válido para enviarte la confirmación.'
      else validationError.value = 'Por favor completa todos los campos requeridos.'
      return
  }

  if (!currentTour.value) return
  
  submitting.value = true
  localError.value = null

  try {
     const response = await ordersApi.create({
       tourId,
       date: form.value.date,
       time: form.value.time,
       attendeesCount: form.value.attendeesCount,
       menuId: form.value.menuId || undefined,
       additionalIds: form.value.additionalIds,
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
     
     // Handle structured API errors
     if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
         // Join multiple errors or take the first one
         validationError.value = err.response.data.errors.map((e: any) => e.msg).join('. ')
     } else if (err.response?.data?.error) {
         validationError.value = err.response.data.error
     } else {
         validationError.value = 'Ocurrió un error al procesar tu reserva. Por favor intenta nuevamente.'
     }
     
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
