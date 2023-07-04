export const SiriusGiftRoutes = [
  
  {
    path: '/redeem-gift-card',
    name: 'ViewServicesSiriusGiftRedeem',
    component: () => import('@/modules/services/submodule/siriusGift/views/ViewServicesSiriusGiftRedeem.vue'),
    meta: {
      title: "Redeem Gift Card",
    }
  },
];