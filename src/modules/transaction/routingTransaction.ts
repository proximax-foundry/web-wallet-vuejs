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

  {
    path: '/sign/:txnHash',
    name: 'ViewTransactionSign',
    props: true,
    component: () => import('@/modules/transaction/views/ViewTransactionSign.vue'),
    meta: {
      title: "Sign Transaction",
    }
  },
];