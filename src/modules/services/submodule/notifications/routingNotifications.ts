export const NotificationsRoutes = [
  {
    path: '/notifications',
    name: 'ViewServicesNotifications',
    component: () => import('@/modules/services/submodule/notifications/views/ViewServicesNotifications.vue'),
    meta: {
      title: "Notifications",
    }
  },
];