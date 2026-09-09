import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/overview' },
  { path: '/overview', name: 'overview', component: () => import('../view/overview/index.vue') }, //园区总览
  { path: '/safety', name: 'safety', component: () => import('../view/safety/index.vue') },   //安全防控
  { path: '/access', name: 'access', component: () => import('../view/access/index.vue') },   //通行管理
  { path: '/energy', name: 'energy', component: () => import('../view/energy/index.vue') },   //能源管理
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router