import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('@/views/Welcome.vue'),
    meta: {
      title: "Welcome to Sirius Web Wallet",
    }
  },
  {
    path: '/create',
    name: 'CreateWalletSelection',
    component: () => import('@/views/CreateWalletSelection.vue'),
    meta: {
      title: "Select Wallet Creation Type",
    }
  },
  {
    path: '/wallets',
    name: 'ViewWallets',
    component: () => import('@/views/ViewWallets.vue'),
    meta: {
      title: "View all wallets stored on device",
    }
  },
  {
    path: '/create-wallet',
    name: 'ViewCreateNewWallet',
    component: () => import('@/views/ViewCreateNewWallet.vue'),
    meta: {
      title: "Create wallet",
    }
  },
  {
    path: '/import-wallet',
    name: 'ViewCreatePrivateKeyWallet',
    component: () => import('@/views/ViewCreatePrivateKeyWallet.vue'),
    meta: {
      title: "Create wallet from private key",
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
