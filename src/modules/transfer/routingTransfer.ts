import { RouteRecordRaw } from 'vue-router'
export const TransferRoutes: RouteRecordRaw[] = [
  {
    path: '/transfer',
    name: 'ViewTransferCreate',
    component: () => import('@/modules/transfer/views/ViewTransfer.vue'),
    meta: {
      title: "Create Transfer",
    }
  },
];