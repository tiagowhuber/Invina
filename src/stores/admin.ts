import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(false)
  const adminPassword = 'admin123' // Simple hardcoded password

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

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
})
