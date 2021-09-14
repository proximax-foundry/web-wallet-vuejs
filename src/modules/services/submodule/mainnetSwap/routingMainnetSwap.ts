import { RouteRecordRaw } from 'vue-router'
export const MainnetSwapRoutes: RouteRecordRaw[] = [
  {
    path: '/swap-nis1',
    name: 'ViewServicesMainnetSwapNIS1ToSirius',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/nis1/views/ViewServicesMainnetSwapNIS1ToSirius.vue'),
    meta: {
      title: "NIS1",
    }
  },
  {
    path: '/swap-eth',
    name: 'ViewServicesMainnetSwapEthOptions',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/eth/views/ViewServicesMainnetSwapEthOptions.vue'),
    meta: {
      title: "Swap ETH",
    }
  },
  {
    path: '/swap-sirius-eth',
    name: 'ViewServicesMainnetSwapSiriusToETH',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/eth/views/ViewServicesMainnetSwapSiriusToETH.vue'),
    meta: {
      title: "Swap Sirius to ETH",
    }
  },
  {
    path: '/swap-eth-sirius',
    name: 'ViewServicesMainnetSwapETHToSirius',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/eth/views/ViewServicesMainnetSwapETHToSirius.vue'),
    meta: {
      title: "Swap ETH to Sirius",
    }
  },
  {
    path: '/swap-bsc',
    name: 'ViewServicesMainnetSwapBscOptions',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/bsc/views/ViewServicesMainnetSwapBscOptions.vue'),
    meta: {
      title: "Swap BSC",
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
    path: '/check-swap-eth-sirius',
    name: 'ViewServicesMainnetSwapCheckETHToSirius',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/eth/views/ViewServicesMainnetSwapCheckETHToSirius.vue'),
    meta: {
      title: "Check Swap ETH to Sirius",
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
    path: '/check-swap-sirius-eth',
    name: 'ViewServicesMainnetSwapCheckSiriusToETH',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/eth/views/ViewServicesMainnetSwapCheckSiriusToETH.vue'),
    meta: {
      title: "Check Swap Sirius to ETH",
    }
  },
];


