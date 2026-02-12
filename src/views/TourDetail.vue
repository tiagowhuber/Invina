<template>
  <div class="tour-detail min-h-screen bg-background text-foreground pb-24">
    <!-- Header / Banner -->
    <div class="relative w-full h-[60vh] bg-stone-900 overflow-hidden mt-4">
        <!-- Hero Carousel -->
        <Carousel 
          v-if="tour && tour.images && tour.images.length > 0"
          :opts="{ align: 'start', loop: true }"
          :plugins="[plugin]"
          @init-api="(val) => emblaApi = val"
          class="absolute inset-0 h-full w-full"
        >
           <CarouselContent class="h-full ml-0">
               <CarouselItem v-for="(img, index) in tour.images" :key="index" class="pl-0 h-full w-full basis-full">
                    <div class="relative w-full h-full">
                        <img 
                            :src="encodeURI(img.imageUrl)"
                            class="absolute inset-0 w-full h-full object-cover"
                            alt=""
                            @error="(e) => console.error('Image load failed:', img.imageUrl, e)"
                        />
                        <div class="absolute inset-0"></div>
                    </div>
               </CarouselItem>
           </CarouselContent>
        </Carousel>
        <div v-else class="absolute inset-0 bg-stone-900"></div>

        <div class="absolute inset-0 flex flex-col justify-between container mx-auto px-6 py-8 pointer-events-none">
            <!-- Back Link -->
            <router-link :to="{ name: 'home' }" class="inline-flex items-center text-white/80 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-medium mt-20 pointer-events-auto w-fit bg-stone-600 rounded-full px-3 py-1">
              &larr; Volver
            </router-link>

             <!-- Title Section -->
            <div v-if="tour" class="max-w-4xl mb-12 pointer-events-auto">
                <div class="flex items-center gap-4 mb-4">
                  <!-- <span v-if="tour.tourType === 'Special'" class="bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-3 py-1 font-medium">
                      Exclusivo
                  </span> -->
                </div>
                <h1 class="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">{{ tour.name }}</h1>
                
                <!-- Nav Dots -->
                <div v-if="tour.images && tour.images.length > 1" class="flex gap-3">
                     <button 
                        v-for="(_, index) in tour.images" 
                        :key="index"
                        @click="emblaApi?.scrollTo(index)"
                         class="w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white/40"
                        :class="currentImageIndex === index ? 'bg-white scale-110' : 'bg-transparent hover:bg-white/20'"
                    ></button>
                </div>
            </div>
             <!-- Loading State -->
            <div v-if="loading" class="text-white/50 italic font-serif text-xl self-center">
               Cargando detalles...
            </div>
        </div>
    </div>

    <!-- Content -->
    <div v-if="tour" class="container mx-auto px-6 pt-16">
       <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <!-- Left Column: Details -->
          <div class="lg:col-span-7 space-y-16">
              
              <!-- Description -->
               <div>
                  <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">La Experiencia</h2>
                  <div class="text-xl leading-relaxed font-light text-foreground/90 font-serif space-y-6">
                    <template v-for="(block, beat) in parsedDescription" :key="beat">
                      <p v-if="block.type === 'paragraph'">
                        {{ block.content }}
                      </p>
                      <ul v-else-if="block.type === 'list'" class="list-disc pl-6 space-y-2 marker:text-primary/60">
                        <li v-for="(item, i) in block.content" :key="i" class="pl-2">
                          {{ item }}
                        </li>
                      </ul>
                    </template>
                  </div>
                   <div class="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                      <span class="w-2 h-2 rounded-full bg-primary/40"></span>
                      <span>Horarios: {{ tour.earliestHour.substring(0,5) }} &mdash; {{ tour.latestHour.substring(0,5) }}</span>
                  </div>
               </div>
               
               <!-- Wines Included -->
               <div v-if="(!tour.menus || tour.menus.length === 0) && tour.wines && tour.wines.length > 0" class="border-t border-border pt-16">
                  <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Selección de Vinos</h2>
                   <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div v-for="wine in tour.wines" :key="wine.id" class="flex items-start gap-4">
                          <template v-if="wine.imageUrl">
                            <img
                              :src="encodeURI(wine.imageUrl)"
                              :alt="wine.name"
                              class="w-28 h-28 rounded-md object-cover cursor-pointer hover:scale-105 transition-transform"
                              @click="openWineImage(wine.imageUrl)"
                              @error="(e) => (e.target as HTMLImageElement).src = '/images/wines/default.png'"
                            />
                          </template>
                          <div v-else class="w-28 h-28 rounded-md bg-muted-foreground/10 flex items-center justify-center text-xs text-muted-foreground">
                            Sin imagen
                          </div>

                          <div>
                              <h3 class="font-serif text-lg text-foreground mb-1">{{ wine.name }}</h3>
                              <p class="text-sm text-muted-foreground uppercase tracking-wider">{{ wine.varietal }} {{ wine.vintage }}</p>
                          </div>
                      </div> 
                   </div>
               </div>

               <!-- Lightbox modal for wine images -->
               <transition name="fade">
                 <div v-if="selectedWineImage" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70" @click.self="closeWineImage">
                   <button @click="closeWineImage" class="absolute top-6 right-6 text-white text-2xl leading-none" aria-label="Cerrar imagen">×</button>
                   <img :src="encodeURI(selectedWineImage)" :alt="'Detalle de vino'" class="max-w-full max-h-[80vh] rounded-md shadow-lg" />
                 </div>
               </transition>

          </div>

          <!-- Right Column: Booking Sidebar -->
          <div class="lg:col-span-5 relative">
              <div class="lg:sticky lg:top-32 bg-secondary/30 border border-border p-8 md:p-12 backdrop-blur-sm">
                  <div class="flex justify-between items-baseline mb-8 border-b border-border pb-8">
                     <span class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Precio</span>
                     <span class="text-3xl font-serif text-primary">${{ Math.floor(tour.basePrice).toLocaleString() }}/pp</span>
                  </div>

                  <div class="space-y-6 mb-12">
                      <div class="flex justify-between">
                         <span class="text-sm uppercase tracking-wider text-muted-foreground">Duración</span>
                         <span class="font-medium">{{ Math.floor(tour.durationMinutes / 60) }} horas <span v-if="tour.durationMinutes % 60 !== 0"> {{ tour.durationMinutes % 60 }} minutos</span></span>
                      </div>
                       <div class="flex justify-between">
                         <span class="text-sm uppercase tracking-wider text-muted-foreground">Capacidad</span>
                         <span class="font-medium">{{ tour.minAttendants }} - {{ tour.maxAttendants }} Personas</span>
                      </div>
                  </div>

                  <!-- Menus/Options -->
                  <div v-if="tour.menus && tour.menus.length > 0" class="space-y-6">
                      <p class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Elige tu desgustación</p>

                      <div 
                        v-for="menu in tour.menus.slice().sort((a, b) => a.price - b.price)" 
                        :key="menu.id" 
                        class="group border border-border p-6 hover:border-primary/50 transition-colors bg-white hover:bg-stone-50 cursor-pointer"
                        @click="$router.push({ name: 'tour-booking', params: { id: tour.id }, query: { menuId: menu.id }})"
                      >
                         <div class="flex justify-between items-center mb-2">
                             <h4 class="font-serif text-lg font-medium group-hover:text-primary transition-colors">{{ menu.name }}</h4>
                             <span class="text-sm font-semibold">${{ Math.floor(menu.price).toLocaleString() }}/pp</span>
                         </div>
                         <p class="text-sm text-muted-foreground font-light mb-4">{{ menu.description || 'Degustación exclusiva.' }}</p>
                         <span class="text-[10px] uppercase tracking-widest font-bold text-primary group-hover:underline">Reservar &rarr;</span>
                      </div>
                  </div>

                  <!-- General Booking CTA (if no menus) -->
                  <router-link 
                    v-else
                    :to="{ name: 'tour-booking', params: { id: tour.id }}"
                    class="block w-full bg-primary text-primary-foreground text-center py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-300 transition-colors"
                >
                    Reservar Ahora
                </router-link>

              </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, watch } from 'vue' 
import { useRoute } from 'vue-router'
import { useToursStore } from '@/stores/tours'
import { storeToRefs } from 'pinia'
import Badge from '@/components/ui/Badge.vue'
import { parseDescription } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
// @ts-ignore
import Autoplay from 'embla-carousel-autoplay'

const route = useRoute()
const toursStore = useToursStore()
const { tours, loading } = storeToRefs(toursStore)

const tourId = parseInt(route.params.id as string)
const tour = computed(() => toursStore.getTourById(tourId))

const parsedDescription = computed(() => {
  if (!tour.value?.description) return []
  return parseDescription(tour.value.description)
})

const emblaApi = ref<CarouselApi>()
const currentImageIndex = ref(0)

const plugin = Autoplay({
  delay: 4000,
  stopOnInteraction: true,
})

watch(emblaApi, (api) => {
  if (!api) return
  
  api.on('select', () => {
    currentImageIndex.value = api.selectedScrollSnap()
  })
})

// Lightbox state & handlers
const selectedWineImage = ref<string | null>(null)

const openWineImage = (url: string) => {
  selectedWineImage.value = url
}

const closeWineImage = () => {
  selectedWineImage.value = null
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeWineImage()
} 

onMounted(async () => {
    if (tours.value.length === 0) {
        await toursStore.fetchTours()
    }
    console.log('Tour Detail Mounted', {
        tourId,
        tour: tour.value,
        images: tour.value?.images
    })
    window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

watch(tour, (newTour) => {
    console.log('Tour Data Updated:', {
        name: newTour?.name,
        images: newTour?.images
    })
})

</script>
