import type { RouteRecordRaw } from 'vue-router'
export const MainnetSwapRoutes: RouteRecordRaw[] = [
  {
    path: '/swap',
    name: 'ViewServicesMainnetSwap',
    component: () => import('@/modules/services/submodule/mainnetSwap/views/ViewServicesMainnetSwap.vue'),
    meta: {
      title: "Swap",
    }
  },
  {
    path: '/swap-sirius-bsc',
    name: 'ViewServicesMainnetSwapSiriusToBSC',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapSiriusToBSC.vue'),
    meta: {
      title: "Swap Sirius to BSC",
    }
  },
  {
    path: '/swap-bsc-sirius',
    name: 'ViewServicesMainnetSwapBSCToSirius',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBSCToSirius.vue'),
    meta: {
      title: "Swap BSC to Sirius",
    }
  },
  {
    path: '/check-swap-bsc-sirius',
    name: 'ViewServicesMainnetSwapCheckBSCToSirius',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapCheckBSCToSirius.vue'),
    meta: {
      title: "Check Swap BSC to Sirius",
    }
  },
  {
    path: '/check-swap-sirius-bsc',
    name: 'ViewServicesMainnetSwapCheckSiriusToBSC',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapCheckSiriusToBSC.vue'),
    meta: {
      title: "Check Swap Sirius to BSC",
    }
  },
  
];


