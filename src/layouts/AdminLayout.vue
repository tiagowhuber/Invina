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
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-gray-800">Invina Admin</h1>
            <nav class="flex space-x-6">
                <router-link to="/admin/orders" class="text-gray-600 hover:text-green-600 font-medium transition-colors" active-class="text-green-600">
                  Pedidos
                </router-link>
                <router-link to="/admin/payments" class="text-gray-600 hover:text-green-600 font-medium transition-colors" active-class="text-green-600">
                  Pagos
                </router-link>
                <router-link to="/admin/instances" class="text-gray-600 hover:text-green-600 font-medium transition-colors" active-class="text-green-600">
                  Instancias
                </router-link>
            </nav>
        </div>
        <button @click="handleLogout" class="text-sm text-red-600 hover:text-red-800 font-medium">
            Cerrar Sesión
        </button>
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
        <router-view />
    </main>
  </div>
</template>
