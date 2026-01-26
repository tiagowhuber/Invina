<template>
  <div class="booking-confirmation min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full text-center space-y-6">
      
      <!-- Loading State -->
      <div v-if="loading" class="py-12">
         <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
         <h2 class="text-xl font-bold text-gray-700">Verificando Pago...</h2>
         <p class="text-gray-500">Por favor espera un momento.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="finalStatus === 'success'" class="text-green-600">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 11 18 0" />
        </svg>
        <h1 class="text-3xl font-bold mb-2">¡Reserva Confirmada!</h1>
        <p class="text-gray-600">Tu pedido ha sido procesado exitosamente.</p>
        <div class="mt-4 p-4 bg-green-50 rounded text-green-800 font-mono text-lg">
          Pedido #{{ orderNumber }}
        </div>
        <p class="text-sm text-gray-500 mt-2">Se ha enviado un correo de confirmación.</p>
      </div>

      <!-- Failure State -->
      <div v-else-if="finalStatus === 'failure'" class="text-red-600">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 11 18 0" />
        </svg>
        <h1 class="text-3xl font-bold mb-2">Pago Fallido</h1>
        <p class="text-gray-600">No pudimos procesar tu pago. Por favor inténtalo de nuevo.</p>
         <div class="mt-4 p-4 bg-red-50 rounded text-red-800 font-mono text-lg">
          Pedido #{{ orderNumber }}
        </div>
      </div>
      
      <!-- Cancel State -->
       <div v-else-if="finalStatus === 'cancel'" class="text-amber-600">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 11 18 0z" />
        </svg>
        <h1 class="text-3xl font-bold mb-2">Pago Cancelado</h1>
        <p class="text-gray-600">Cancelaste el proceso de pago.</p>
      </div>
      
      <div v-if="!loading" class="pt-6 border-t border-gray-100">
         <router-link :to="{ name: 'home' }" class="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            Volver al Inicio
         </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { webpayApi } from '@/services/api/webpay'

const route = useRoute()
const orderNumber = ref(route.query.order as string || 'Unknown')
const loading = ref(false)
const verificationResult = ref<'success' | 'failure' | null>(null)

const currentPathStatus = computed(() => {
  if (route.path.includes('payment/success')) return 'success'
  if (route.path.includes('payment/failure')) return 'failure'
  if (route.path.includes('payment/cancel')) return 'cancel'
  return null
})

const finalStatus = computed(() => {
    if (verificationResult.value) return verificationResult.value
    return currentPathStatus.value
})

onMounted(async () => {
    // If we are on the confirmation page with a token, we must verify
    if (route.path.includes('payment/confirmation')) {
        const token = route.query.token as string
        if (token) {
            loading.value = true
            try {
                // Verify against backend
                // Backend returns: { status: 'Completed' | 'Failed', order: {...} }
                const response = await webpayApi.verify(token)
                const data = response.data as any
                
                if (data.status === 'Completed' || data.status === 'Confirmed') {
                    verificationResult.value = 'success'
                    if (data.order && data.order.orderNumber) {
                        orderNumber.value = data.order.orderNumber
                    }
                } else {
                    verificationResult.value = 'failure'
                     if (data.order && data.order.orderNumber) {
                        orderNumber.value = data.order.orderNumber
                    }
                }
            } catch (e) {
                console.error("Verification error", e)
                verificationResult.value = 'failure'
            } finally {
                loading.value = false
            }
        } else {
            // No token provided on confirmation page? validation error
             verificationResult.value = 'failure'
        }
    }
})
</script>
