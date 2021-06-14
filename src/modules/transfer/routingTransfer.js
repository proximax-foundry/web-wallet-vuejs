export const TransferRoutes = [
  {
    path: '/create-transfer',
    name: 'ViewTransferCreate',
    component: () => import('@/modules/transfer/views/ViewTransferCreate.vue'),
    meta: {
      title: "Create Transfer",
    }
  },
];