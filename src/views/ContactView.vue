<template>
  <div class="contact-view min-h-[60vh] flex flex-col justify-center">
    <div class="container mx-auto max-w-4xl">
      <!-- Header Section -->
      <div class="mb-12 md:mb-16 text-center border-b border-primary/10 pb-10">
        <span class="text-xs font-bold tracking-[0.3em] text-primary/60 uppercase mb-4 block animate-fade-in-up">
          Comunícate con nosotros
        </span>
        <h1 class="text-5xl md:text-7xl font-serif text-primary mb-6 animate-fade-in-up delay-100">
          Contacto
        </h1>
        <p class="text-muted-foreground font-light text-lg max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Estamos disponibles para resolver sus dudas, coordinar visitas especiales o recibir sus comentarios.
        </p>
      </div>

      <!-- Contact Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 animate-fade-in-up delay-300">
        
        <!-- General Contact Card -->
        <div class="group bg-card/50 hover:bg-card/80 backdrop-blur-sm border border-border/40 hover:border-primary/30 p-8 md:p-10 rounded-xl transition-all duration-500 hover:shadow-lg hover:shadow-primary/5">
          <div class="mb-6">
            <h2 class="text-2xl font-serif text-primary mb-2">Información General</h2>
            <p class="text-sm text-muted-foreground/80 font-light">Consultas sobre tours, reservas y eventos.</p>
          </div>
          
          <div class="space-y-6">
            <a href="tel:+56957083058" class="flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors group/link p-2 -ml-2 rounded-lg hover:bg-primary/5">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <span class="text-lg font-medium tracking-wide font-sans">+56 9 5708 3058</span>
            </a>
            
            <a href="mailto:info@invina.net" class="flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors group/link p-2 -ml-2 rounded-lg hover:bg-primary/5">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <span class="text-lg font-medium tracking-wide font-sans">info@invina.net</span>
            </a>
          </div>
        </div>

        <!-- Tech Support Card -->
        <div class="group bg-card/50 hover:bg-card/80 backdrop-blur-sm border border-border/40 hover:border-primary/30 p-8 md:p-10 rounded-xl transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 delay-100">
          <div class="mb-6">
             <h2 class="text-2xl font-serif text-primary mb-2">Soporte Digital</h2>
            <p class="text-sm text-muted-foreground/80 font-light">Ayuda técnica, problemas con el sitio web o sugerencias.</p>
          </div>
          
          <div class="space-y-6">
            <a href="mailto:tiagohuber@invina.net" class="flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors group/link p-2 -ml-2 rounded-lg hover:bg-primary/5">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
              </div>
              <span class="text-lg font-medium tracking-wide font-sans text-balance break-all">tiagohuber@invina.net</span>
            </a>

             <a href="tel:+56994723547" class="flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors group/link p-2 -ml-2 rounded-lg hover:bg-primary/5">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <span class="text-lg font-medium tracking-wide font-sans">+56 9 9472 3547</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Simple CSS animation for entry */
.animate-fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>