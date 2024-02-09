import { networkState } from '@/state/networkState';
import { computed } from 'vue';
import { TransactionType } from 'tsjs-xpx-chain-sdk';

const findEntity = computed(()=>networkState.currentNetworkProfileConfig?.supportedEntities.find(entity=>entity.type==TransactionType.PLACE_SDA_EXCHANGE_OFFER))
export const ExchangeRoutes = !findEntity? [] :[
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
      path: '/exchange',
      name: 'ViewExchange',
      component: () => import('@/modules/services/submodule/exchange/ViewExchange.vue'),
      props: route => ({ pair: route.query.p, owner: route.query.o,type: route.query.t})
    },
    {
      path: '/exchange/remove',
      name: 'ViewExchangeRemove',
      component: () => import('@/modules/services/submodule/exchange/ViewExchangeRemove.vue'),
      props: route => ({ pair: route.query.p, owner: route.query.o,})
    },
  ];
  
  