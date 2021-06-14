export const DashboardRoutes = [
  {
    path: '/dashboard',
    name: 'ViewDashboard',
    component: () => import('@/modules/dashboard/views/ViewDashboard.vue'),
    meta: {
      title: "Dashboard",
    }
  },
];