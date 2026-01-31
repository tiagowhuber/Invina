<template>
  <div
    class="group relative flex flex-col h-full bg-white/50 hover:bg-white transition-colors duration-500 rounded-none border border-border/60 hover:border-primary/30 cursor-pointer"
    role="link"
    tabindex="0"
    :aria-label="'Open ' + tour.name + ' details'"
    @click="goToDetail"
    @keydown.enter="goToDetail"
    @keydown.space.prevent="goToDetail"
  >
    <!-- Image Area -->
    <div class="aspect-4/3 w-full overflow-hidden bg-secondary relative">
       <!-- Use a computed property or logic for image path if needed, assuming absolute or relative path works -->
       <img 
         v-if="tour.images && tour.images.length > 0" 
         :src="tour.images[0].imageUrl" 
         :alt="tour.name"
         class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 saturate-[0.8] group-hover:saturate-100"
       />
       <div v-else class="h-full w-full flex items-center justify-center bg-stone-100/50 text-stone-300">
          <span class="font-serif italic text-3xl opacity-30">Invina</span>
       </div>
       
       <!-- Badge -->
       <div class="absolute top-0 right-0 p-4">
          <span v-if="tour.tourType === 'Special'" class="bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-3 py-1 font-medium shadow-sm">
            Exclusivo
          </span>
       </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-6 md:p-8">
      <h3 class="font-serif text-2xl text-primary mb-3 leading-tight group-hover:translate-x-1 transition-transform duration-300">
        {{ tour.name }}
      </h3>
      
      <p class="text-muted-foreground text-sm font-light leading-relaxed mb-8 line-clamp-3 flex-1">
        {{ tour.description }}
      </p>
      
      <!-- Meta -->
      <div class="flex items-center justify-between border-t border-border/40 pt-6 mt-auto">
        <div class="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-foreground/70 font-medium">
          <div class="flex items-center gap-2">
            <span>{{ Math.floor(tour.durationMinutes / 60) }}H {{ tour.durationMinutes % 60 ? (tour.durationMinutes % 60) + 'M' : '' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>${{ Math.floor(tour.basePrice).toLocaleString() }}</span>/ pp
          </div>
        </div>
        
        <router-link 
          @click.stop
          :to="{ name: 'tour-detail', params: { id: tour.id }}"
          class="text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:text-foreground transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300"
        >
          Reservar <span>&rarr;</span>
        </router-link> 
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types'
import { toRef } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  tour: Tour
}>()

const tour = toRef(props, 'tour')

const router = useRouter()
const goToDetail = () => {
  router.push({ name: 'tour-detail', params: { id: tour.value.id } })
}
</script>
