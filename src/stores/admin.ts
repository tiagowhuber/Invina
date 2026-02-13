import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminApi } from '@/services/api'

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(false)
  const adminPassword = 'admin123' // Simple hardcoded password
  
  const orders = ref<any[]>([])
  const payments = ref<any[]>([])
  const instances = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function login(password: string): boolean {
    if (password === adminPassword) {
      isAuthenticated.value = true
      sessionStorage.setItem('adminAuth', 'true')
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    sessionStorage.removeItem('adminAuth')
  }

  function checkAuth(): boolean {
    const stored = sessionStorage.getItem('adminAuth')
    if (stored === 'true') {
      isAuthenticated.value = true
      return true
    }
    return false
  }

  async function fetchOrders() {
    loading.value = true
    error.value = null
    try {
      orders.value = await adminApi.getAllOrders()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  async function fetchPayments() {
    loading.value = true
    error.value = null
    try {
      payments.value = await adminApi.getAllPayments()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch payments'
    } finally {
      loading.value = false
    }
  }

  async function fetchInstances() {
    loading.value = true
    error.value = null
    try {
      instances.value = await adminApi.getAllInstances()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch instances'
    } finally {
      loading.value = false
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth,
    orders,
    payments,
    instances,
    loading,
    error,
    fetchOrders,
    fetchPayments,
    fetchInstances,
  }
})
