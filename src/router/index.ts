import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/servers'
    },
    {
      path: '/servers',
      name: 'servers',
      component: () => import('../views/ServerManageView.vue')
    }
  ]
})

export default router