export const MainnetSwapRoutes = [
  {
    path: '/swap-account-list',
    name: 'ViewServicesMainnetSwapAccountList',
    component: () => import('@/modules/services/submodule/mainnetSwap/views/ViewServicesMainnetSwapAccountList.vue'),
    meta: {
      title: "Mainnet Swap",
    }
  },
];