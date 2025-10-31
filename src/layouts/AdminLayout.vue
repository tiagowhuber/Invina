<script setup lang="ts">
import { useAdminStore } from '@/stores/admin'
import { useRouter } from 'vue-router'

const adminStore = useAdminStore()
const router = useRouter()

function handleLogout() {
  adminStore.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b bg-primary text-primary-foreground">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <router-link to="/admin" class="text-2xl font-bold">
            Invina Admin
          </router-link>
          <div class="flex gap-4 items-center">
            <router-link 
              to="/admin" 
              class="hover:underline"
            >
              Events
            </router-link>
            <router-link 
              to="/admin/orders" 
              class="hover:underline"
            >
              Orders
            </router-link>
            <router-link 
              to="/admin/validate" 
              class="hover:underline"
            >
              Validate
            </router-link>
            <router-link 
              to="/admin/statistics" 
              class="hover:underline"
            >
              Stats
            </router-link>
            <button 
              @click="handleLogout"
              class="ml-4 px-3 py-1 bg-primary-foreground text-primary rounded hover:opacity-90 transition-opacity text-sm"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>
