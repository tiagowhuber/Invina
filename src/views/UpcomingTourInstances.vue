<template>
  <div class="upcoming-tours min-h-screen bg-background text-foreground py-24">
    <div class="container mx-auto px-6 max-w-6xl">
      <header class="mb-16 text-center">
        <span class="text-xs uppercase tracking-[0.2em] text-primary mb-4 block">Calendario</span>
        <h1 class="text-4xl md:text-5xl font-serif text-foreground mb-4">Visitas Programadas</h1>
        <p class="text-muted-foreground font-light max-w-xl mx-auto">
          Únete a grupos de visita ya confirmados. Ideal para comprar entradas individuales sin restricciones de mínimo de asistentes.
        </p>
      </header>

      <div v-if="loading" class="text-center py-24">
         <span class="font-serif italic text-xl text-muted-foreground animate-pulse">Buscando visitas...</span>
      </div>

      <div v-else-if="instances.length === 0" class="text-center py-24 border border-dashed border-border rounded-lg">
         <p class="text-muted-foreground mb-4">No hay visitas programadas con cupos disponibles por el momento.</p>
         <router-link :to="{ name: 'home' }" class="text-primary hover:underline">Ver todas las experiencias</router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
            v-for="instance in instances" 
            :key="instance.id"
            class="group border border-border bg-card hover:border-primary/50 transition-all duration-300 flex flex-col cursor-pointer"
            @click="joinInstance(instance)"
        >
            <!-- Image / Header -->
             <div class="relative h-48 overflow-hidden bg-secondary/20">
                 <!-- Use first image of tour if available -->
                 <img 
                    v-if="instance.tour?.images && instance.tour.images.length > 0"
                    :src="instance.tour.images[0].imageUrl" 
                    alt="Tour Image"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 />
                 <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                 <div class="absolute top-4 right-4 bg-background/90 backdrop-blur text-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider">
                     {{ instance.startTime.substring(0,5) }} hrs
                 </div>
             </div>

             <div class="p-6 flex-1 flex flex-col">
                 <div class="mb-4">
                     <span class="text-xs text-primary uppercase tracking-widest block mb-2">{{ formatDateStr(instance.instanceDate) }}</span>
                     <h3 class="font-serif text-xl text-foreground mb-2">{{ instance.tour?.name }}</h3>
                     <p class="text-xs text-muted-foreground line-clamp-2">{{ instance.tour?.description }}</p>
                 </div>

                 <div class="mt-auto border-t border-border pt-4 flex justify-between items-center">
                     <div>
                         <span class="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Cupos Disp.</span>
                         <span class="font-bold text-lg" :class="{ 'text-destructive': (instance.tour?.maxAttendants - instance.currentAttendants) < 5 }">
                             {{ instance.tour ? (instance.tour.maxAttendants - instance.currentAttendants) : '-' }}
                         </span>
                     </div>
                     <button 
                        class="bg-primary text-primary-foreground px-6 py-2 text-xs uppercase tracking-widest hover:bg-stone-300 transition-colors"
                     >
                         Unirse
                     </button>
                 </div>
             </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toursApi } from '@/services/api'

const router = useRouter()
const instances = ref<any[]>([])
const loading = ref(true)

function formatDateStr(dateStr: string) {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    const date = new Date(parseInt(year), parseInt(month)-1, parseInt(day))
    return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
}

async function fetchUpcoming() {
    loading.value = true
    try {
        const data = await toursApi.getAllUpcoming()
        instances.value = data
    } catch (err) {
        console.error('Failed to fetch upcoming instances', err)
    } finally {
        loading.value = false
    }
}

function joinInstance(instance: any) {
    // Navigate to booking page with pre-filled date/time
    // We assume the TourBooking view handles logic for "joining" automatically 
    // if the date/time matches an existing instance (which it will).
    router.push({
        name: 'tour-booking',
        params: { id: instance.tourId },
        query: { // Passing as query just in case we wan't to read it later, but mainly we rely on store sync or manual user select logic?
                 // Actually TourBooking doesn't auto-read query for date.
                 // But wait, the previous code I wrote: if user CLICKS, it selects.
                 // We don't have deep-linking to pre-select date yet. 
                 // Let's add that swiftly or rely on user selecting it.
                 // Better: Add logic in TourBooking to read query params.
        }
    })

    // To make it seamless, let's pass state or modify TourBooking to read query params.
    // Since I cannot modify TourBooking again in this turn easily without risk, 
    // I will pass query params and hope to handle it or just rely on user picking it again?
    // User asked to "view and join".
    // I'll add logic to TourBooking to read query params 'date' and 'time' in onMounted.
    
    // Actually, looking at TourBooking.vue (I have it), I can edit it to read query params.
    // Let's pass them.
    router.push({
        name: 'tour-booking',
        params: { id: instance.tourId },
        query: { 
            preDate: instance.instanceDate,
            preTime: instance.startTime
        }
    })
}

onMounted(() => {
    fetchUpcoming()
})
</script>