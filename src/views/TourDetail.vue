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
                <h1 class="text-3xl md:text-5xl font-bold">{{ tour.description }}</h1> <!-- Using description as Title -->
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
                <div v-if="tour.images && tour.images.length > 0" class="relative group w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6 shadow-md">
                    <!-- Main Image -->
                    <div 
                        class="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
                        :style="{ backgroundImage: `url(${tour.images[currentImageIndex].imageUrl})` }"
                    ></div>
                    
                    <!-- Gradient Overlay -->
                    <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-60"></div>

                    <!-- Navigation Arrows -->
                    <button 
                         v-if="tour.images.length > 1"
                        @click.prevent="prevImage" 
                        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/80 text-white hover:text-indigo-900 rounded-full p-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button 
                        v-if="tour.images.length > 1"
                        @click.prevent="nextImage" 
                        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/80 text-white hover:text-indigo-900 rounded-full p-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </button>

                    <!-- Indicators -->
                    <div v-if="tour.images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        <button 
                            v-for="(_, index) in tour.images" 
                            :key="index"
                            @click="currentImageIndex = index"
                            class="w-2.5 h-2.5 rounded-full transition-colors"
                            :class="currentImageIndex === index ? 'bg-white' : 'bg-white/40 hover:bg-white/60'"
                        ></button>
                    </div>
                </div>

                <p class="text-gray-600 leading-relaxed text-lg">{{ tour.description }}</p>
                <div class="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-md inline-block">
                    <span class="font-bold">Horario:</span> {{ tour.earliestHour.substring(0,5) }} - {{ tour.latestHour.substring(0,5) }}
                </div>
            </div>

            <!-- Wines Included -->
            <div v-if="tour.wines && tour.wines.length > 0" class="py-8 border-t border-gray-100">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">Vinos Incluidos</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="wine in tour.wines" :key="wine.id" class="border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors bg-gray-50 overflow-hidden group">
                        <!-- Wine Image or Fallback -->
                        <div class="h-48 w-full bg-gray-200 relative overflow-hidden">
                             <img 
                                v-if="wine.imageUrl" 
                                :src="wine.imageUrl" 
                                :alt="wine.name" 
                                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                            </div>
                        </div>
                        
                        <div class="p-6">
                            <h3 class="font-bold text-lg text-gray-900">{{ wine.name }}</h3>
                            <p class="text-gray-600 mt-1">{{ wine.varietal }} <span v-if="wine.vintage" class="text-gray-400">| {{ wine.vintage }}</span></p>
                        </div>
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
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToursStore } from '@/stores/tours'
import { storeToRefs } from 'pinia'
import Badge from '@/components/ui/Badge.vue'

const route = useRoute()
const toursStore = useToursStore()
const { tours, loading } = storeToRefs(toursStore)

const tourId = parseInt(route.params.id as string)
const tour = computed(() => toursStore.getTourById(tourId))

const currentImageIndex = ref(0)

const nextImage = () => {
  if (tour.value?.images?.length) {
    currentImageIndex.value = (currentImageIndex.value + 1) % tour.value.images.length
  }
}

const prevImage = () => {
  if (tour.value?.images?.length) {
    currentImageIndex.value = (currentImageIndex.value - 1 + tour.value.images.length) % tour.value.images.length
  }
}

onMounted(async () => {
    if (tours.value.length === 0) {
        await toursStore.fetchTours()
    }
})
</script>
