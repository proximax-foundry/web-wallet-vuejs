export const SiriusGiftRoutes = [
  {
    path: '/create-gift',
    name: 'ViewServicesSiriusGiftCreateGift',
    component: () => import('@/modules/services/submodule/siriusGift/views/ViewServicesSiriusGiftCreateGift.vue'),
    meta: {
      title: "Generate Gift Card",
    }
  },
  {
    path: '/redeem-gift-card',
    name: 'ViewServicesSiriusGiftRedeem',
    component: () => import('@/modules/services/submodule/siriusGift/views/ViewServicesSiriusGiftRedeem.vue'),
    meta: {
      title: "Redeem Gift Card",
    }
  },
];