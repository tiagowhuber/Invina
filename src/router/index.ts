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
          component: () => import('@/views/EventsList.vue'),
        },
        {
          path: '/events/:id',
          name: 'event-detail',
          component: () => import('@/views/EventDetail.vue'),
        },
        {
          path: '/checkout',
          name: 'checkout',
          component: () => import('@/views/Checkout.vue'),
        },
        {
          path: '/payment',
          name: 'payment',
          component: () => import('@/views/PaymentRedirect.vue'),
        },
        {
          path: '/payment/return',
          name: 'payment-return',
          component: () => import('@/views/PaymentReturn.vue'),
        },
        {
          path: '/orders/:orderNumber',
          name: 'order-confirmation',
          component: () => import('@/views/OrderConfirmation.vue'),
        },
        {
          path: '/orders/lookup',
          name: 'order-lookup',
          component: () => import('@/views/OrderLookup.vue'),
        },
        {
          path: '/tickets/:ticketNumber',
          name: 'ticket-detail',
          component: () => import('@/views/TicketDetail.vue'),
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
          name: 'admin-events',
          component: () => import('@/views/admin/EventManagement.vue'),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/views/admin/OrdersDashboard.vue'),
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
