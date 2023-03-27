export const StackingRoutes = [
  {
    path: '/stack-option',
    name: 'ViewServicesStackingOption',
    component: () => import('@/modules/services/submodule/stacking/views/ViewServicesStackingOption.vue'),
    meta: {
      title: "Choose Stacking Option",
    }
  },
  // {
  //   path: '/buy',
  //   name: 'ViewServicesStackingBuy',
  //   component: () => import('@/modules/services/submodule/stacking/views/ViewServicesStackingBuy.vue'),
  //   meta: {
  //     title: "Buy",
  //   }
  // },
];

