import { RouteRecordRaw } from 'vue-router';
export const TransactionRoutes: RouteRecordRaw[] = [
  {
    path: '/status/:transactionType?',
    name: 'ViewTransactionStatus',
    props: true,
    component: () => import('@/modules/transaction/views/ViewTransactionStatus.vue'),
    meta: {
      title: "Transaction Status",
    }
  },
];