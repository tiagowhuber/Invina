import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/ToursList.vue'),
        },
        {
          path: '/tours/:id/booking',
          name: 'tour-booking',
          component: () => import('@/views/TourBooking.vue'),
        },
        {
          path: '/payment/success',
          name: 'payment-success',
          component: () => import('@/views/PaymentResult.vue'),
        },
        {
          path: '/payment/failure',
          name: 'payment-failure',
          component: () => import('@/views/PaymentResult.vue'),
        },
        {
          path: '/payment/cancel',
          name: 'payment-cancel',
          component: () => import('@/views/PaymentResult.vue'),
        },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLogin.vue'),
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-tours',
          component: () => import('@/views/admin/TourManagement.vue'),
        },
        {
          path: 'bookings',
          name: 'admin-bookings',
          component: () => import('@/views/admin/BookingsDashboard.vue'),
        },
        {
          path: 'validate',
          name: 'admin-validate',
          component: () => import('@/views/admin/TicketValidation.vue'),
        },
        {
          path: 'statistics',
          name: 'admin-statistics',
          component: () => import('@/views/admin/Statistics.vue'),
        },
      ],
    },
  ],
})

// Navigation guard for admin routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const adminStore = useAdminStore()
    if (!adminStore.checkAuth()) {
      next({ name: 'admin-login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
