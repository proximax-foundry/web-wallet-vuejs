import { NetworkTypes } from 'nem-library';
import { NetworkType } from 'tsjs-xpx-chain-sdk';
import { ChronoUnit } from 'js-joda';


export const environment = {
  production: false,
  routeNodesJson: 'testnet',
  itemBooksAddress: 'sw-books-testnet',
  version: '0.5.4',
  cacheVersion: '01',
  nameKeyBlockStorage: `sw-blocks`,
  nameKeyNodeSelected: `sw-selected-node-testnet`,
  nameKeyWalletStorage: `sw`,
  nameKeyNodeStorage: `sw-nodes-testnet`,
  nameKeyNamespaces: `sw-namespaces-testnet`,
  nameKeyMosaicStorage: `sw-mosaics-testnet`,
  nameKeyVersion: 'sw-version-testnet',
  nameKeyWalletTransactionsNis: 'sw-transactions-nis',
  activeModulesBox: {
    voting: {
      viewChildrenParam: true,
      createPoll: true,
      vote: true,
      viewResult: false,
      classNameParam: ''
    },
    storage: {
      viewChildrenParam: true,
      files: true,
      uploadFiles: true,
      sendShare: false,
      classNameParam: ''
    },
    notarization: {
      viewChildrenParam: true,
      attest: true,
      audit: true,
      classNameParam: ''
    },
  },
  protocol: `https`,
  protocolWs: `wss`,
  nodeExplorer: 'http://bctestnetexplorer.xpxsirius.io/#/result/hash',
  mosaicXpxInfo: {
    name: 'prx.xpx',
    coin: 'XPX',
    id: '13bfc518e40549d7',
    mosaicIdUint64: [3825551831, 331334936],
    namespaceIdUint64: [2434186742, 3220914849],
    namespaceId: 'bffb42a19116bdf6',
    divisibility: 6
  },
  deadlineTransfer: {
    deadline: 1439,
    chronoUnit: ChronoUnit.MINUTES
  },
  timeOutTransactionNis1: 20000,
  blockchainConnection: {
    host: 'bctestnet1.brimstone.xpxsirius.io',
    port: 443,
    protocol: 'https',
    useSecureMessage: false
  },
  storageConnection: {
    host: 'ipfs1-dev.xpxsirius.io',
    port: 80,
    options: {
      protocol: 'http'
    }

  },
  storageConnectionUnload: {
    host: 'ipfs1-dev.xpxsirius.io',
    port: 5001,
    options: {
      protocol: 'http'
    }

  },
  namespaceRentalFeeSink: {
    public_key: 'F3B8194C36CC55500DCB8CD3734DFA07FE8B649219BE315C8DFAE1DAC59F3595',
    address_public_test: 'VBH4NR-KUNINP-7HW6ZB-OECMIN-X3BCB4-ZDXKDM-KIWG'
  },
  mosaicRentalFeeSink: {
    public_key: '640A0DA89F6F57E43C526520AD05C59E185D19ADC95788D8611EBAEC94DEBBA1',
    address_public_test: 'VD6AXC-3QBCFT-SLKHT6-2UPGTN-V5Z63I-YZKJI3-YGMD'
  },
  pollsContent: {
    public_key: 'A32CC719A9C4524B952F8A357E8103015EB9CA12B08A31497464398D53206669',
    address_public_test: 'VDB52J-IIE4SA-CUNOOP-N44H66-47O42B-XTPWJH-LPGW'
  },
  attestation: {
    address_public_test: 'VDYN53-XXEGKK-3XHQYE-K6ZBMN-JPXN57-ZBHXA3-AW55'
  },
  nis1: {
    url: 'https://bctestnetswap.xpxsirius.io:7890',
    // url: 'http://192.168.3.217:7890',
    urlExplorer: 'http://testnet-explorer.nemtool.com/#/s_tx?hash=',
    networkType: NetworkTypes.TEST_NET,
    burnAddress: 'TBF4LAZUEJMBIOC6J24D6ZGGXE5W775TX555CTTN',
    nodes: [
      { protocol: 'https', domain: 'bctestnetswap.xpxsirius.io', port: 7890 } 
    ],
  },
  swapAccount: {
    addressAccountMultisig: 'VAWOEOWTABXR7O3ZAK2XNA5GIBNE6PZIXDAFDWBU',
    addressAccountSimple: 'VCWAHAMZRKWU4T3MSBEV7CJVYN7TGX5ZCYMVTUJW'
  },
  swapAllowedMosaics: [
    { namespaceId: 'zarcade', name: 'xar', divisibility: 4 },
    { namespaceId: 'prx', name: 'xpx', divisibility: 6 }
  ],
  typeNetwork: {
    value: NetworkType.TEST_NET,
    label: 'PUBLIC TEST'
  },
  coingecko: {
    url: 'https://api.coingecko.com/api/v3/coins/',
  },
  blockHeightMax: {
    heightMax: 172800
  },
  lockFundDuration: 11520,
  delayBetweenLockFundABT: 20000,
  transactionStatusWaitTime: 10000,
  peerHosting: {
    host: 'demo-sc-api-1.ssi.xpxsirius.io',
    port: 443,
    path: '/peerjs',
    secure: true,
    debug: 3
  }
};
