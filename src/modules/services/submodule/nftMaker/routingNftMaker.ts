import { RouteRecordRaw } from 'vue-router'

export const NftMakerRoutes: Array<RouteRecordRaw> = [
  {
    path: '/create-nft',
    component: () => import('@/modules/services/submodule/nftMaker/views/ViewCreateNft.vue'),
  },
  {
    path: '/view-nft',
    component: () => import('@/modules/services/submodule/nftMaker/views/ViewDisplayNft.vue'),
  },
  {
    path: '/nft-details/:assetId',
    props: true,
    component: () => import('@/modules/services/submodule/nftMaker/views/ViewNftDetails.vue'),
  },
  {
    path: '/edit-nft/:assetId',
    props: true,
    component: () => import('@/modules/services/submodule/nftMaker/views/ViewEditNft.vue'),
  },
  {
    path: '/transfer-nft/:assetId',
    props: true,
    component: () => import('@/modules/services/submodule/nftMaker/views/ViewTransferNft.vue'),
  },
]