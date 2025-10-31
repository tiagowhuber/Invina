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

const isRedirecting = ref(false)

onMounted(async () => {
  const orderId = route.query.orderId

  if (!orderId) {
    router.push('/')
    return
  }

  try {
    isRedirecting.value = true
    const data = await paymentStore.initiatePayment(Number(orderId))
    
    if (data && data.url) {
      // Redirect to WebPay
      setTimeout(() => {
        window.location.href = data.url
      }, 2000)
    }
  } catch (error) {
    console.error('Payment initiation failed:', error)
    isRedirecting.value = false
  }
})
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <Card>
      <CardHeader>
        <CardTitle>Redirecting to Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="paymentStore.loading || isRedirecting" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
          <p class="text-lg mb-2">Preparing your payment...</p>
          <p class="text-sm text-muted-foreground">
            You will be redirected to WebPay to complete your purchase.
          </p>
        </div>

        <div v-else-if="paymentStore.error" class="text-center py-8">
          <div class="text-destructive mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-semibold mb-2">Payment Initiation Failed</p>
            <p class="text-sm">{{ paymentStore.error }}</p>
          </div>
          <div class="flex gap-4 justify-center mt-6">
            <Button @click="router.push('/orders/lookup')" variant="outline">
              View My Orders
            </Button>
            <Button @click="router.push('/')">
              Back to Events
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
