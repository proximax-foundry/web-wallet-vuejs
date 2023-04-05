import type { RouteRecordRaw } from 'vue-router'
export const WalletRoutes: RouteRecordRaw[] = [
  {
    path: '/create',
    name: 'ViewWalletCreateSelection',
    component: () => import('@/modules/wallet/views/ViewWalletCreateSelection.vue'),
    meta: {
      title: "Select Wallet Creation Type",
    }
  },
  {
    path: '/wallets',
    name: 'ViewWallets',
    props: true,
    component: () => import('@/modules/wallet/views/ViewWallets.vue'),
    meta: {
      title: "View all wallets stored on device",
    }
  },
  {
    path: '/create-wallet',
    name: 'ViewWalletCreate',
    component: () => import('@/modules/wallet/views/ViewWalletCreate.vue'),
    meta: {
      title: "Create wallet",
    }
  },
  {
    path: '/import-wallet',
    name: 'ViewWalletCreatePrivateKey',
    component: () => import('@/modules/wallet/views/ViewWalletCreatePrivateKey.vue'),
    meta: {
      title: "Create wallet from private key",
    }
  },
  {
    path: '/backup-wallet',
    name: 'ViewWalletImport',
    component: () => import('@/modules/wallet/views/ViewWalletImport.vue'),
    meta: {
      title: "Import from wallet backup",
    }
  },
];