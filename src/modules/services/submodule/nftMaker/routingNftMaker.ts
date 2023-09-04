import { RouteRecordRaw } from 'vue-router'

export const NftMakerRoutes: Array<RouteRecordRaw> = [
  {
    path: '/view-nft',
    component: () => import('@/modules/services/submodule/nftMaker/views/ViewDisplayNft.vue'),
  },
]