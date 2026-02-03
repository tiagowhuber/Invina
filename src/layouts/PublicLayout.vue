<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
    <header class="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-sm border-b border-border/40 transition-all duration-300">
      <div class="container mx-auto px-6 py-6 transition-all duration-300">
        <nav class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Left Nav -->
          <div class="hidden md:flex gap-8 items-center flex-1">
            <router-link 
              to="/" 
              class="uppercase tracking-widest text-xs font-medium hover:text-primary transition-colors"
            >
              Enoturismo
            </router-link>
            <!-- <router-link 
              to="/private" 
              class="uppercase tracking-widest text-xs font-medium hover:text-primary transition-colors"
            >
              Privado
            </router-link> -->
          </div>

          <!-- Logo -->
          <router-link to="/" class="text-3xl md:text-4xl font-normal tracking-tight text-primary hover:opacity-80 transition-opacity font-serif mx-8">
            INVINA
          </router-link>
          
          <!-- Right Nav -->
          <div class="flex gap-8 items-center flex-1 justify-end">
            <router-link 
              to="/orders/lookup" 
              class="uppercase tracking-widest text-xs font-medium hover:text-primary transition-colors"
            >
              <!-- Mis Pedidos -->
            </router-link>
          </div>
        </nav>
      </div>
    </header>

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
            <a href="#" class="hover:text-primary transition-colors">Instagram</a>
            <a href="#" class="hover:text-primary transition-colors">Contacto</a>
            <a href="#" class="hover:text-primary transition-colors">Términos</a>
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
</style>
