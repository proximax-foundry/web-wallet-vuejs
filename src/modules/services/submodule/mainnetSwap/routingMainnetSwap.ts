import { RouteRecordRaw } from 'vue-router'
export const MainnetSwapRoutes: RouteRecordRaw[] = [
  {
    path: '/swap-nis1-sirius',
    name: 'ViewServicesMainnetSwapNIS1ToSirius',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/nis1toSirius/views/ViewServicesMainnetSwapNIS1ToSirius.vue'),
    meta: {
      title: "Swap NIS1 to Sirius",
    }
  },
  {
    path: '/swap-sirius-eth',
    name: 'ViewServicesMainnetSwapSiriusToETH',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/siriustoETH/views/ViewServicesMainnetSwapSiriusToETH.vue'),
    meta: {
      title: "Swap Sirius to ETH",
    }
  },
  {
    path: '/swap-sirius-bsc',
    name: 'ViewServicesMainnetSwapSiriusToBSC',
    component: () => import('@/modules/services/submodule/mainnetSwap/submodule2/siriustoBSC/views/ViewServicesMainnetSwapSiriusToBSC.vue'),
    meta: {
      title: "Swap Sirius to BSC",
    }
  },
];


