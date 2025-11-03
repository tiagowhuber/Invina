import { defineStore } from 'pinia'
import { ref } from 'vue'
import { webpayApi } from '@/services/api/webpay'
import type { InitiatePaymentResponse, WebPayTransaction } from '@/types'

export const usePaymentStore = defineStore('payment', () => {
  const paymentUrl = ref<string | null>(null)
  const paymentToken = ref<string | null>(null)
  const transaction = ref<WebPayTransaction | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function initiatePayment(orderId: number) {
    loading.value = true
    error.value = null
    paymentUrl.value = null
    paymentToken.value = null
    
    console.log('PaymentStore - initiatePayment called with orderId:', orderId, 'type:', typeof orderId)
    
    try {
      const requestData = { order_id: orderId }
      console.log('PaymentStore - sending request:', requestData)
      const response = await webpayApi.initiate(requestData)
      console.log('PaymentStore - response:', response.data)
      if (response.data.success && response.data.data) {
        const data: InitiatePaymentResponse = response.data.data
        paymentUrl.value = data.url
        paymentToken.value = data.token
        return data
      }
    } catch (err: any) {
      console.error('PaymentStore - error:', err)
      error.value = err.response?.data?.message || 'Failed to initiate payment'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkTransactionStatus(token: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await webpayApi.getTransaction(token)
      if (response.data.success && response.data.data) {
        transaction.value = response.data.data
        return response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to check transaction status'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearPaymentData() {
    paymentUrl.value = null
    paymentToken.value = null
    transaction.value = null
    error.value = null
  }

  return {
    paymentUrl,
    paymentToken,
    transaction,
    loading,
    error,
    initiatePayment,
    checkTransactionStatus,
    clearPaymentData,
  }
})
