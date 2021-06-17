import { RouteRecordRaw } from 'vue-router'
export const HomeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    props: true,
    component: () => import('@/modules/home/views/ViewHome.vue'),
    meta: {
      title: "Welcome to Sirius Web Wallet",
    }
  },
];