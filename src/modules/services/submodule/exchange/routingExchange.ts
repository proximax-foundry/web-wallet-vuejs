export const ExchangeRoutes = [
    {
      path: '/exchange/sell',
      name: 'ViewServicesExchangeSell',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeSell.vue'),
      meta: {
        title: "SDA-SDA Exchange: Sell",
      }
    },
  
  ];
  
  