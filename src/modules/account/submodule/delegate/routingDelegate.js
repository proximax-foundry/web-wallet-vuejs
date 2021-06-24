export const DelegateRoutes = [
  {
    path: '/delegate',
    name: 'ViewAccountDelegate',
    component: () => import('@/modules/account/submodule/delegate/views/ViewAccountDelegate.vue'),
    meta: {
      title: "Delegate",
    }
  },
];