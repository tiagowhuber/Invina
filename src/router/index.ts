import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ top: 0 })
      }, 500)
    })
  },
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
          path: '/tours/upcoming',
          name: 'upcoming-tours',
          component: () => import('@/views/UpcomingTourInstances.vue'),
        },
        {
          path: '/contact',
          name: 'contact',
          component: () => import('@/views/ContactView.vue'),
        },
        {
          path: '/tours/:id',
          name: 'tour-detail',
          component: () => import('@/views/TourDetail.vue'),
        },
        {
          path: '/tours/:id/booking',
          name: 'tour-booking',
          component: () => import('@/views/TourBooking.vue'),
        },
        {
          path: '/payment/confirmation',
          name: 'payment-confirmation',
          component: () => import('@/views/PaymentResult.vue'),
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
          redirect: 'orders'
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/views/admin/OrdersView.vue'),
        },
        {
          path: 'payments',
          name: 'admin-payments',
          component: () => import('@/views/admin/PaymentsView.vue'),
        },
        {
          path: 'instances',
          name: 'admin-instances',
          component: () => import('@/views/admin/TourInstancesView.vue'),
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
