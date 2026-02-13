<template>
  <div class="payments-view p-6">
    <div class="flex justify-between items-center mb-6">
       <h1 class="text-2xl font-bold">Pagos (Payments)</h1>
       <button @click="loadData" class="text-sm text-blue-600 hover:underline">Refrescar</button>
    </div>
    
    <div v-if="adminStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
    </div>
    
    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
      {{ adminStore.error }}
    </div>
    
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="payment in adminStore.payments" :key="payment.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ payment.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ payment.order?.orderNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ payment.provider }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${{ payment.amount?.toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
               <span :class="{
                 'px-2 py-1 text-xs rounded-full': true,
                 'bg-green-100 text-green-800': payment.status === 'Completed',
                 'bg-yellow-100 text-yellow-800': payment.status === 'Pending',
                 'bg-red-100 text-red-800': payment.status === 'Failed'
               }">
                 {{ payment.status }}
               </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ new Date(payment.createdAt).toLocaleString() }}
            </td>
          </tr>
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
  adminStore.fetchPayments()
}

onMounted(() => {
  loadData()
})
</script>