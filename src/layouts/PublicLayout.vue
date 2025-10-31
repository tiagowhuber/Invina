<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <router-link to="/" class="text-2xl font-bold text-primary">
            Invina
          </router-link>
          <div class="flex gap-4">
            <router-link 
              to="/" 
              class="text-foreground hover:text-primary transition-colors"
            >
              Events
            </router-link>
            <router-link 
              to="/orders/lookup" 
              class="text-foreground hover:text-primary transition-colors"
            >
              My Orders
            </router-link>
            <router-link 
              to="/admin" 
              class="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Admin
            </router-link>
          </div>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <footer class="border-t mt-12">
      <div class="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; 2025 Invina. Event Ticketing Platform.</p>
      </div>
    </footer>
  </div>
</template>
