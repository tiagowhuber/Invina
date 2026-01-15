<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentStore } from '@/stores/payment'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()

const isProcessing = ref(true)
const paymentStatus = ref<'success' | 'failed' | 'error'>('error')
const orderNumber = ref<string>('')
const errorMessage = ref<string>('')

onMounted(async () => {
  // Get token from query params (WebPay sends it as token_ws)
  const token = route.query.token_ws as string

  console.log('PaymentReturn - received token:', token)

  if (!token) {
    console.error('No token provided from WebPay')
    errorMessage.value = 'No payment token provided'
    paymentStatus.value = 'error'
    isProcessing.value = false
    return
  }

  try {
    // Check transaction status with backend
    console.log('PaymentReturn - checking transaction status')
    const transaction = await paymentStore.checkTransactionStatus(token)
    
    console.log('PaymentReturn - transaction status:', transaction)
    console.log('PaymentReturn - transaction.status:', transaction?.status)

    if (transaction) {
      // Transaction object now includes order_number from the API
      const transactionWithOrder = transaction as any
      orderNumber.value = transactionWithOrder.order_number || ''
      
      console.log('PaymentReturn - order_number:', orderNumber.value)
      console.log('PaymentReturn - comparing status:', transaction.status, '===', 'approved', '?', transaction.status === 'approved')
      
      if (transaction.status === 'approved') {
        paymentStatus.value = 'success'
      } else if (transaction.status === 'rejected') {
        paymentStatus.value = 'failed'
        errorMessage.value = 'Payment was rejected by the bank'
      } else {
        paymentStatus.value = 'error'
        errorMessage.value = `Payment status: ${transaction.status || 'undefined'}`
      }
    } else {
      paymentStatus.value = 'error'
      errorMessage.value = 'Could not retrieve transaction status'
    }
  } catch (error: any) {
    console.error('PaymentReturn - error:', error)
    paymentStatus.value = 'error'
    errorMessage.value = error.response?.data?.message || 'Failed to process payment'
  } finally {
    isProcessing.value = false
  }
})

const handleViewOrder = () => {
  if (orderNumber.value) {
    router.push(`/orders/${orderNumber.value}`)
  }
}

const handleBackToEvents = () => {
  router.push('/')
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <Card>
      <CardHeader>
        <CardTitle>Procesando Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Processing State -->
        <div v-if="isProcessing" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
          <p class="text-lg mb-2">Procesando tu pago...</p>
          <p class="text-sm text-muted-foreground">
            Por favor espera mientras confirmamos tu transacción.
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="paymentStatus === 'success'" class="text-center py-8">
          <div class="text-green-600 dark:text-green-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-2xl font-bold mb-2">¡Pago Exitoso!</p>
            <p class="text-sm">Tu pedido ha sido confirmado.</p>
          </div>
          <div v-if="orderNumber" class="mb-6 p-4 bg-muted rounded-lg">
            <p class="text-sm text-muted-foreground mb-1">Número de Pedido</p>
            <p class="text-lg font-mono font-semibold">{{ orderNumber }}</p>
          </div>
          <div class="flex gap-4 justify-center">
            <Button @click="handleViewOrder" v-if="orderNumber">
              Ver Detalles del Pedido
            </Button>
            <Button @click="handleBackToEvents" variant="outline">
              Volver a Eventos
            </Button>
          </div>
          <p class="text-xs text-muted-foreground mt-6">
            Se ha enviado un correo de confirmación a tu dirección de correo electrónico.
          </p>
        </div>

        <!-- Failed State -->
        <div v-else-if="paymentStatus === 'failed'" class="text-center py-8">
          <div class="text-orange-600 dark:text-orange-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-2xl font-bold mb-2">Pago Fallido</p>
            <p class="text-sm">{{ errorMessage }}</p>
          </div>
          <div class="flex gap-4 justify-center mt-6">
            <Button @click="router.push('/checkout')" v-if="orderNumber">
              Intentar de Nuevo
            </Button>
            <Button @click="handleBackToEvents" variant="outline">
              Volver a Eventos
            </Button>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-8">
          <div class="text-destructive mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-2xl font-bold mb-2">Error de Pago</p>
            <p class="text-sm">{{ errorMessage || 'Ocurrió un error al procesar tu pago' }}</p>
          </div>
          <div class="flex gap-4 justify-center mt-6">
            <Button @click="router.push('/orders/lookup')" variant="outline">
              Revisar Mis Pedidos
            </Button>
            <Button @click="handleBackToEvents" variant="outline">
              Volver a Eventos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
