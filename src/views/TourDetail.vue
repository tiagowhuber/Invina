<template>
  <div class="tour-detail min-h-screen bg-gray-50 pb-12">
    <!-- Header / Banner -->
    <div class="bg-indigo-900 text-white py-12">
      <div class="container mx-auto px-4">
        <router-link :to="{ name: 'home' }" class="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition-colors">
          &larr; Volver a Tours
        </router-link>
        
        <div v-if="loading" class="text-center py-4">
           Cargando detalles...
        </div>
        <div v-else-if="!tour" class="text-center py-4 text-red-300">
           Tour no encontrado.
        </div>
        <div v-else>
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 class="text-3xl md:text-5xl font-bold">{{ tour.name }}</h1> 
                <Badge :variant="tour.tourType === 'Special' ? 'default' : 'secondary'" class="text-lg px-4 py-1">
                    {{ tour.tourType }}
                </Badge>
            </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="tour" class="container mx-auto px-4 -mt-8">
      <div class="bg-white rounded-lg shadow-xl overflow-hidden">
         <div class="p-8">
            <!-- Key Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-b border-gray-100">
                <div class="flex items-center gap-3">
                    <div class="bg-indigo-50 p-3 rounded-full text-indigo-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 11 18 0"/></svg>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Duración</p>
                        <p class="font-semibold text-lg">{{ tour.durationMinutes }} Minutos</p>
                    </div>
                </div>
                 <div class="flex items-center gap-3">
                     <div class="bg-green-50 p-3 rounded-full text-green-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 11 18 0"/></svg>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Precio</p>
                        <p class="font-semibold text-lg">${{ tour.basePrice }} <span class="text-sm font-normal text-gray-400">/ persona</span></p>
                    </div>
                </div>
                 <div class="flex items-center gap-3">
                     <div class="bg-purple-50 p-3 rounded-full text-purple-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Capacidad</p>
                        <p class="font-semibold text-lg">Mín {{ tour.minAttendants }} - Máx {{ tour.maxAttendants }}</p>
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="py-8">
                <h2 class="text-2xl font-bold mb-4 text-gray-800">Acerca de esta experiencia</h2>
                
                <!-- Tour Images Carousel -->
                <div v-if="tour.images && tour.images.length > 0" class="w-full mb-8">
                    <Carousel 
                        class="w-full" 
                        :opts="{ align: 'center', loop: true }"
                        :plugins="[plugin]"
                        @init-api="(val) => emblaApi = val"
                    >
                        <CarouselContent>
                            <CarouselItem v-for="(img, index) in tour.images" :key="index">
                                <div class="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-md">
                                    <div 
                                        class="w-full h-full bg-cover bg-center"
                                        :style="{ backgroundImage: `url(${img.imageUrl})` }"
                                    ></div>
                                    <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-60"></div>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious class="hidden md:flex left-4 bg-white/30 hover:bg-white/80 text-white hover:text-indigo-900 border-none" />
                        <CarouselNext class="hidden md:flex right-4 bg-white/30 hover:bg-white/80 text-white hover:text-indigo-900 border-none" />
                    </Carousel>

                    <!-- Indicators -->
                    <div v-if="tour.images.length > 1" class="flex justify-center gap-2 mt-4">
                        <button 
                            v-for="(_, index) in tour.images" 
                            :key="index"
                            @click="emblaApi?.scrollTo(index)"
                            class="w-2.5 h-2.5 rounded-full transition-colors"
                            :class="currentImageIndex === index ? 'bg-indigo-900' : 'bg-gray-300 hover:bg-indigo-400'"
                        ></button>
                    </div>
                </div>

                <p class="text-gray-600 leading-relaxed text-lg">{{ tour.description }}</p>
                <div class="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-md inline-block">
                    <span class="font-bold">Horarios de inicio:</span> {{ tour.earliestHour.substring(0,5) }} a {{ tour.latestHour.substring(0,5) }}
                </div>
            </div>

            <!-- Tour Wines (If No Menus) -->
            <div v-if="(!tour.menus || tour.menus.length === 0) && tour.wines && tour.wines.length > 0" class="py-8 border-t border-gray-100">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">Vinos Incluidos</h2>
                 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div v-for="wine in tour.wines" :key="wine.id" class="border rounded-xl p-4 bg-white flex items-center gap-4 hover:shadow-md transition">
                         <div class="bg-purple-50 p-3 rounded-full text-purple-600 shrink-0">
                           <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900">{{ wine.name }}</h3>
                            <p v-if="wine.varietal" class="text-sm text-gray-600">{{ wine.varietal }} <span v-if="wine.vintage" class="ml-1 text-gray-400">({{ wine.vintage }})</span></p>
                        </div>
                     </div>
                 </div>
            </div>

            <!-- Menus Section (If Available) -->
            <div v-if="tour.menus && tour.menus.length > 0" class="py-8 border-t border-gray-100">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">Elige tu Desgustación</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                        v-for="menu in tour.menus" 
                        :key="menu.id" 
                        class="border rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col h-full"
                    >
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-bold text-xl text-gray-900">{{ menu.name }}</h3>
                                <p class="text-green-700 font-bold text-lg mt-1">${{ Math.floor(menu.price) }}</p>
                            </div>
                            <span v-if="menu.isActive" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Disponible</span>
                        </div>
                        
                        <p class="text-gray-600 mb-6 grow">{{ menu.description || 'Una experiencia exclusiva.' }}</p>

                        <!-- Included Wines Preview -->
                        <div v-if="menu.wines && menu.wines.length > 0" class="mb-6 bg-gray-50 p-3 rounded-lg">
                             <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Vinos</p>
                             <ul class="space-y-1">
                                 <li v-for="wine in menu.wines" :key="wine.id" class="text-sm text-gray-700 flex items-center">
                                     <svg class="w-3 h-3 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                                     {{ wine.name }}
                                 </li>
                             </ul>
                        </div>

                        <router-link 
                            :to="{ name: 'tour-booking', params: { id: tour.id }, query: { menuId: menu.id }}"
                            class="w-full text-center py-2 px-4 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                        >
                            Reservar esta Opción
                        </router-link>
                    </div>
                </div>
            </div>
         </div>

         <!-- CTA Footer -->
         <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="mb-2 md:mb-0">
                <p class="text-sm text-gray-500">¿Listo para reservar?</p>
                <p class="text-gray-900 font-bold">Reserva tu cupo hoy mismo.</p>
            </div>
            <router-link 
                :to="{ name: 'tour-booking', params: { id: tour.id }}"
                class="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg transform hover:-translate-y-0.5"
            >
                Reservar Ahora
            </router-link>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToursStore } from '@/stores/tours'
import { storeToRefs } from 'pinia'
import Badge from '@/components/ui/Badge.vue'
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

onMounted(async () => {
    if (tours.value.length === 0) {
        await toursStore.fetchTours()
    }
})
</script>
