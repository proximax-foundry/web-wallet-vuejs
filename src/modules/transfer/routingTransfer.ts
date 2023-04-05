import type { RouteRecordRaw } from 'vue-router'
export const TransferRoutes: RouteRecordRaw[] = [
  {
    path: '/create-transfer',
    name: 'ViewTransferCreate',
    component: () => import('@/modules/transfer/views/ViewTransferCreate.vue'),
    meta: {
      title: "Create Transfer",
    }
  },
];