<template>
  <div class="orders-view p-6">
    <div class="flex justify-between items-center mb-6">
       <h1 class="text-2xl font-bold">Pedidos (Orders)</h1>
       <button @click="loadData" class="text-sm text-blue-600 hover:underline">Refrescar</button>
    </div>
    
    <div v-if="adminStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
    </div>
    
    <div v-else-if="adminStore.error" class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
      {{ adminStore.error }}
    </div>
    
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-for="order in adminStore.orders" :key="order.id">
            <!-- Main Order Row -->
            <tr class="hover:bg-gray-50 border-t border-gray-200">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-top">
                <div class="text-base">#{{ order.orderNumber }}</div>
                <div class="text-xs text-gray-400 mt-1">ID: {{ order.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap align-top">
                <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
                <div class="text-sm text-gray-500">{{ order.customerEmail }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ order.customerPhone }}</div>
                <div class="text-xs text-gray-400">{{ order.customerRut }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-top">
                 <div class="font-bold mb-1">
                    ${{ order.totalAmount?.toLocaleString() }}
                 </div>
                 <div class="text-xs text-gray-500">
                    {{ order.attendeesCount }} personas
                 </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap align-top">
                 <span :class="{
                   'px-2 py-1 text-xs rounded-full inline-block': true,
                   'bg-green-100 text-green-800': order.status === 'Confirmed',
                   'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                   'bg-red-100 text-red-800': order.status === 'Cancelled'
                 }">
                   {{ order.status }}
                 </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                {{ new Date(order.createdAt).toLocaleDateString() }}
                <div class="text-xs">{{ new Date(order.createdAt).toLocaleTimeString() }}</div>
              </td>
            </tr>
            <!-- Detail Row (Tour Instance Info) -->
            <tr class="bg-gray-50 border-b border-gray-200">
                <td colspan="5" class="px-6 py-2 pb-4">
                    <div class="flex items-center text-sm text-gray-600 bg-white border border-gray-200 rounded p-3 gap-6">
                        <div class="flex flex-col">
                            <span class="text-xs uppercase font-bold text-gray-400">Tour</span>
                            <span class="font-medium text-gray-900">
                                {{ order.tourInstance?.tour?.name || 'Unknown Tour' }}
                                <span class="text-xs text-gray-400 font-normal ml-1">(Instance #{{ order.tourInstanceId }})</span>
                            </span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs uppercase font-bold text-gray-400">Fecha</span>
                            <span class="font-medium">{{ order.tourInstance?.instanceDate }}</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs uppercase font-bold text-gray-400">Hora</span>
                            <span class="font-medium">{{ order.tourInstance?.startTime }}</span>
                        </div>
                        <div class="flex flex-col">
                             <span class="text-xs uppercase font-bold text-gray-400">Capacidad Instancia</span>
                             <span>{{ order.tourInstance?.currentAttendants }} / {{ order.tourInstance?.tour?.maxAttendants }}</span>
                        </div>
                        <div class="flex flex-col ml-auto">
                            <span class="text-xs uppercase font-bold text-gray-400">Payment ID</span>
                            <span class="text-xs font-mono">{{ order.payments?.[0]?.id || '-' }}</span>
                        </div>
                    </div>
                </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

function loadData() {
  adminStore.fetchOrders()
}

onMounted(() => {
  loadData()
})
</script>