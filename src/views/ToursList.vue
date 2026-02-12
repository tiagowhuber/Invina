<template>
  <div class="tours-list min-h-[60vh]">
    <div class="container mx-auto">
      <div class="mb-8 md:mb-12 mt-4 text-center md:text-left border-b border-primary/20 pb-6">
        <!-- <span class="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-4 block">Descubre Nuestra Esencia</span> -->
        <h1 class="text-5xl md:text-7xl font-serif text-primary mb-6 mt-6">Experiencias</h1>
        <p class="text-muted-foreground font-light text-lg max-w-2xl leading-relaxed">
          Sumérgete en el mundo de Invina. Desde recorridos guiados por nuestros viñedos y bodega a experiencias gastronómicas en entornos inolvidables.
        </p>
      </div>

      <div v-if="loading" class="text-center py-24">
        <div class="inline-block animate-pulse">
           <span class="font-serif text-2xl text-primary italic">Cargando experiencias...</span>
        </div>
      </div>

      <div v-else-if="error" class="bg-destructive/5 border border-destructive/20 p-8 text-center max-w-md mx-auto">
        <p class="text-destructive font-medium">{{ error }}</p>
      </div>

      <div v-else>
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            <TourCard
              v-for="tour in activeTours"
              :key="tour.id"
              :tour="tour"
            />
         </div>

        <div v-if="activeTours.length === 0" class="text-center py-24 border border-dashed border-border mt-12">
          <p class="text-muted-foreground font-serif italic text-xl">No hay experiencias disponibles en este momento.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToursStore } from '@/stores/tours'
import TourCard from '@/components/TourCard.vue'

const toursStore = useToursStore()

const { loading, error, activeTours, toursByType } = storeToRefs(toursStore)

onMounted(() => {
  toursStore.fetchTours()
})
</script>
