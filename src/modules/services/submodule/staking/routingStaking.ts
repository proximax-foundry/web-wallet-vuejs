export const stakingRoutes = [
  {
    path: '/stack-option',
    name: 'ViewServicesStakingOption',
    component: () => import('@/modules/services/submodule/staking/views/ViewServicesStakingOption.vue'),
    meta: {
      title: "Choose staking Option",
    }
  },
 /*  {
    path: '/buy',
    name: 'ViewServicesStakingBuy',
    component: () => import('@/modules/services/submodule/staking/views/ViewServicesStakingBuy.vue'),
    meta: {
      title: "Buy",
    }
  }, */
];

