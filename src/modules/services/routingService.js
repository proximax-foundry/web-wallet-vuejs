export const ServiceRoutes = [
  {
    path: '/services',
    name: 'ViewServices',
    component: () => import('@/modules/services/views/ViewServices.vue'),
    meta: {
      title: "Services",
    }
  },
];