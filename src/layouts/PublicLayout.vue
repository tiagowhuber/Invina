<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
    <header class="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-sm border-b border-border/40 transition-all duration-300">
      <div class="container mx-auto px-6 py-4 md:py-6 transition-all duration-300">
        <nav class="flex items-center justify-between">
          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMenu"
            class="md:hidden p-2 text-primary hover:text-primary/80 transition-colors z-50 relative"
            aria-label="Menu"
          >
            <transition name="rotate" mode="out-in">
              <Menu v-if="!isMenuOpen" class="w-6 h-6" />
              <X v-else class="w-6 h-6" />
            </transition>
          </button>

          <!-- Left Nav (Desktop) -->
          <div class="hidden md:flex gap-8 items-center flex-1">
            <router-link 
              to="/" 
              class="uppercase tracking-widest text-xs font-medium hover:text-primary transition-colors"
            >
              Enoturismo
            </router-link>
            <router-link 
              to="/tours/upcoming" 
              class="uppercase tracking-widest text-xs font-medium hover:text-primary transition-colors"
            >
              Tours programados
            </router-link>
          </div>

          <!-- Logo -->
          <div class="flex-1 md:flex-none flex justify-center md:items-center">
            <router-link to="/" class="text-3xl md:text-4xl font-normal tracking-tight text-primary hover:opacity-80 transition-opacity font-serif mx-8" @click="closeMenu">
              <img src="/invina_negro.png" alt="INVINA Logo" class="h-8 md:h-12" />
            </router-link>
          </div>
          
          <!-- Right Nav (Desktop) -->
          <div class="hidden md:flex gap-8 items-center flex-1 justify-end">
            <router-link 
              to="/contact" 
              class="uppercase tracking-widest text-xs font-medium hover:text-primary transition-colors"
            >
              Contacto
            </router-link>
            <router-link 
              to="/orders/lookup" 
              class="uppercase tracking-widest text-xs font-medium hover:text-primary transition-colors"
            >
              <!-- Mis Pedidos -->
            </router-link>
          </div>

          <!-- Mobile Right Spacer (to balance menu button if needed, or maybe a cart icon later) -->
          <div class="w-10 md:hidden"></div> 
        </nav>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <transition name="fade">
      <div 
        v-if="isMenuOpen" 
        class="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden flex flex-col justify-center items-center"
      >
        <div class="flex flex-col items-center gap-8 p-8 text-center">
          <router-link 
            to="/" 
            @click="closeMenu"
            class="bg-white font-serif text-3xl text-primary hover:opacity-70 transition-opacity rounded-full bg-opacity-90 px-6 py-3 border border-black"
          >
            Enoturismo
          </router-link>
          <router-link 
            to="/tours/upcoming" 
            @click="closeMenu"
            class="bg-white font-serif text-3xl text-primary hover:opacity-70 transition-opacity rounded-full bg-opacity-90 px-6 py-3 border border-black"
          >
            Tours Programados
          </router-link>
          <router-link 
            to="/contact" 
            @click="closeMenu"
            class="bg-white font-serif text-3xl text-primary hover:opacity-70 transition-opacity rounded-full bg-opacity-90 px-6 py-3 border border-black"
          >
            Contacto
          </router-link>

          <div class="h-px w-12 bg-border my-4"></div>

          <a href="https://www.instagram.com/invina_cl/" target="_blank" class="uppercase tracking-widest text-xs text-muted-foreground hover:text-primary transition-colors">
            Instagram
          </a>
        </div>
      </div>
    </transition>

    <main class="pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto min-h-[80vh]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="border-t border-border/40 bg-secondary/20 mt-auto">
      <div class="container mx-auto px-6 py-12">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="text-center md:text-left">
            <h4 class="text-primary font-serif text-lg mb-2">INVINA</h4>
            <p class="text-sm text-muted-foreground font-light max-w-xs">
              Experiencias enoturísticas inolvidables.
              Conectando con la esencia del vino.
            </p>
          </div>
          <div class="flex gap-8 text-xs uppercase tracking-widest text-muted-foreground">
            <a href="https://www.instagram.com/invina_cl/" class="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Instagram</a>
            <router-link to="/contact" class="hover:text-primary transition-colors">Contacto</router-link>
          </div>
        </div>
        <div class="text-center mt-12 text-[10px] text-muted-foreground uppercase tracking-wider">
          &copy; 2025 Invina. Reservados todos los derechos.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.3s ease;
}

.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}
</style>
