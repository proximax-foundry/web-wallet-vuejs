export const ExchangeRoutes = [
    {
      path: '/exchange/create',
      name: 'ViewExchangeCreate',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeCreate.vue'),
      meta: {
        title: "Create SDA-SDA Exchange",
      }
    },
    {
      path: '/exchange/listing',
      name: 'ViewExchangeListing',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeListing.vue'),
      meta: {
        title: "SDA-SDA Exchange: Listing",
      }
    },
    {
      path: '/exchange/account/:address',
      props:true,
      name: 'ViewExchangeAccountListing',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeAccountListing.vue'),
      meta: {
        title: "SDA-SDA Exchange:Account Listing",
      }
    },
    {
      path: '/exchange/sell',
      name: 'ViewExchangeSell',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeSell.vue'),
      props: route => ({ pair: route.query.p, owner: route.query.o,})
    },
    {
      path: '/exchange/buy',
      name: 'ViewExchangeBuy',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeBuy.vue'),
      props: route => ({ pair: route.query.p, owner: route.query.o,})
    },
    {
      path: '/exchange/remove',
      name: 'ViewExchangeRemove',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeRemove.vue'),
      props: route => ({ pair: route.query.p, owner: route.query.o,})
    },
  ];
  
  