export const ExchangeRoutes = [
    {
      path: '/exchange/create',
      name: 'ViewServicesExchangeCreatel',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeCreate.vue'),
      meta: {
        title: "Create SDA-SDA Exchange",
      }
    },
    {
      path: '/exchange/listing',
      name: 'ViewServicesExchangeListing',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeListing.vue'),
      meta: {
        title: "SDA-SDA Exchange: Listing",
      }
    },
  
  ];
  
  