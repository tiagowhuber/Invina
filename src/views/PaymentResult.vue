<template>
  <div class="booking-result min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
    <div class="w-full max-w-lg text-center">
      
      <!-- Loading State -->
      <div v-if="loading" class="py-12 space-y-6">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
         <div>
            <h2 class="text-2xl font-serif text-foreground">Verificando Pago</h2>
            <p class="text-muted-foreground font-light mt-2">Un momento, por favor...</p>
         </div>
      </div>

      <!-- Success State -->
      <div v-else-if="finalStatus === 'success'" class="space-y-8 bg-white border border-border p-12 shadow-sm">
        <div class="flex justify-center">
            <div class="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>
        
        <div>
            <span class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-3">Confirmación</span>
            <h1 class="text-4xl font-serif text-foreground mb-4">¡Reserva Exitosa!</h1>
            <p class="text-foreground/80 font-light leading-relaxed">
                Tu experiencia ha sido confirmada. Hemos enviado los detalles a tu correo electrónico.
            </p>
        </div>

        <div class="bg-secondary/30 p-6 border border-border/50">
           <span class="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Número de Orden</span>
           <span class="font-serif text-2xl text-primary">#{{ orderNumber }}</span>
        </div>
        
        <router-link :to="{ name: 'home' }" class="inline-block w-full bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-300 transition-colors">
            Volver al Inicio
        </router-link>
      </div>

      <!-- Failure/Cancel State -->
      <div v-else-if="finalStatus === 'failure' || finalStatus === 'cancel'" class="space-y-8 bg-white border border-border p-12 shadow-sm">
         <div class="flex justify-center">
            <div class="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>

        <div>
             <span class="text-xs font-bold uppercase tracking-[0.2em] text-destructive block mb-3">
                 {{ finalStatus === 'cancel' ? 'Cancelado' : 'Error' }}
             </span>
            <h1 class="text-3xl font-serif text-foreground mb-4">
                {{ finalStatus === 'cancel' ? 'Pago Cancelado' : 'Pago Fallido' }}
            </h1>
            <p class="text-foreground/80 font-light leading-relaxed">
                 {{ finalStatus === 'cancel' 
                    ? 'Has cancelado el proceso de compra. No se ha realizado ningún cobro.' 
                    : 'No pudimos procesar tu pago. Por favor intenta nuevamente.' }}
            </p>
        </div>
        
         <div v-if="orderNumber !== 'Unknown'" class="bg-secondary/30 p-4 border border-border/50">
           <span class="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Referencia</span>
           <span class="font-mono text-sm text-foreground">#{{ orderNumber }}</span>
        </div>

         <div class="space-y-3">
             <router-link :to="{ name: 'home' }" class="block w-full bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-300 transition-colors">
                Volver a Intentar
             </router-link>
              <router-link :to="{ name: 'home' }" class="block w-full py-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                Cancelar
             </router-link>
         </div>
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
