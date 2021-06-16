import { RouteRecordRaw } from 'vue-router'
export const DashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'ViewDashboard',
    component: () => import('@/modules/dashboard/views/ViewDashboard.vue'),
    meta: {
      title: "Dashboard",
    }
  },
];