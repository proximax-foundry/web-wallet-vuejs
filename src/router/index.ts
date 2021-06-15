import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { HomeRoutes } from '@/modules/home/routingHome';
import { WalletRoutes } from '@/modules/wallet/routingWallet';

const routes: Array<RouteRecordRaw> = [
  ...HomeRoutes,
  ...WalletRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
