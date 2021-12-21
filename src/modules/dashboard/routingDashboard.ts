import { RouteRecordRaw } from 'vue-router'
export const DashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard/:type?',
    name: 'ViewDashboard',
    props: true,
    component: () => import('@/modules/dashboard/views/ViewDashboard.vue'),
    meta: {
      title: "Dashboard",
    }
  },
];