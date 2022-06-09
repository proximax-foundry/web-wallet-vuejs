dynamic_configuration = {
    backupOldWallet: true,
    chainProfile: {
        "Sirius Mainnet": {
          "version": "0.7.1",
          "apiNodes":[
              "betelgeuse.xpxsirius.io"
          ],
          "httpPort": 3000,
          "generationHash": "10540AD3A1BF46B1A05D8B1CF0252BC9FB2E0B53CFD748262B0CE341CEAFEB6B",
          "network":{
            "type": 184,
            "currency":{
                "name": "XPX",
                "namespace": "prx.xpx",
                "assetId": "",
                "namespaceId": "bffb42a19116bdf6",
                "divisibility": 6
            }
          },
          "secured": false,
          "chainExplorer": {
            "url": "https://explorer.xpxsirius.io",
            "blockRoute": "#/block",
            "publicKeyRoute": "#/account",
            "addressRoute": "#/account",
            "hashRoute": "#/tx",
            "namespaceInfoRoute": "#/namespace",
            "assetInfoRoute": "#/asset"
          }
        },
        "Sirius Testnet 1": {
          "version": "0.0.6",
          "apiNodes":[
              "bctestnet3.brimstone.xpxsirius.io"
          ],
          "httpPort": 3000,
          "generationHash": "56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9",
          "network":{
            "type": 168,
            "currency":{
                "name": "XPX",
                "namespace": "prx.xpx",
                "assetId": "",
                "namespaceId": "bffb42a19116bdf6",
                "divisibility": 6
            }
          },
          "secured": false,
          "chainExplorer": {
            "url": "https://proximax-foundry.github.io/web-explorer-vuejs",
            "blockRoute": "#/block",
            "publicKeyRoute": "#/account",
            "addressRoute": "#/account",
            "hashRoute": "#/tx",
            "namespaceInfoRoute": "#/namespace",
            "assetInfoRoute": "#/asset"
          }
        },
        "Sirius Testnet 2": {
          "version": "0.0.6",
          "apiNodes":[
              "api-2.testnet2.xpxsirius.io"
          ],
          "httpPort": 3000,
          "generationHash": "56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9",
          "network":{
            "type": 168,
            "currency":{
                "name": "XPX",
                "namespace": "prx.xpx",
                "assetId": "",
                "namespaceId": "bffb42a19116bdf6",
                "divisibility": 6
            }
          },
          "secured": false,
          "chainExplorer": {
            "url": "https://proximax-foundry.github.io/web-explorer-vuejs",
            "blockRoute": "#/block",
            "publicKeyRoute": "#/account",
            "addressRoute": "#/account",
            "hashRoute": "#/tx",
            "namespaceInfoRoute": "#/namespace",
            "assetInfoRoute": "#/asset"
          }
        }
    },
    chainSwap:{
        "Sirius Mainnet": {
          "swapData":{
            "swap_XPX_ETH_URL": "https://swap-gateway.xpxsirius.io/eth",
            "swap_XPX_BSC_URL": "https://swap-gateway.xpxsirius.io/bsc",
            "swap_IN_SERVICE_URL": "https://swap-gateway.xpxsirius.io",
            "swap_SERVICE_URL": "https://swap-gateway.xpxsirius.io",
            "gasPriceConsultURL": "https://swap-gateway.xpxsirius.io/gas",
            "priceConsultURL": "https://swap-gateway.xpxsirius.io",
            "BSCChainId": 56,
            "ETHChainId": 1,
            "BSCScanUrl": "https://bscscan.com/tx/",
            "ETHScanUrl": "https://etherscan.io/tx/",
            "BSCNetworkName": "BSC",
            "ETHNetworkName": "Ethereum",
            "nis1SwapData": {
              "timeOutTransactionNis1": 20000,
              "url": "https://swap.brimstone.xpxsirius.io:7890",
              "urlExplorer": "http://explorer.nemtool.com/#/s_tx?hash=",
              "networkType": 104,
              "burnAddress": "ND7WVWPWNTJR75CYC3D73LSVP7WIL7BL77QNT7NZ",
              "nodes":[
                { "protocol": "https", "domain": "swap.brimstone.xpxsirius.io", "port": 7890 }
              ],
              "swapAllowedMosaics": [
                { "namespaceId": "xarcade", "name": "xar", "divisibility": 4 },
                { "namespaceId": "prx", "name": "xpx", "divisibility": 6 }
              ]
            }
          }
        },
        "Sirius Testnet 1": {
        },
        "Sirius Testnet 2": {
          "swapData":{
            "swap_XPX_ETH_URL": "https://bctestnet-swap-gateway.xpxsirius.io/eth",
            "swap_XPX_BSC_URL": "https://bctestnet-swap-gateway.xpxsirius.io/bsc",
            "swap_IN_SERVICE_URL": "https://bctestnet-swap-gateway.xpxsirius.io",
            "swap_SERVICE_URL": "https://bctestnet-swap-gateway.xpxsirius.io",
            "gasPriceConsultURL": "https://bctestnet-swap-gateway.xpxsirius.io/gas",
            "priceConsultURL": "https://bctestnet-swap-gateway.xpxsirius.io",
            "BSCChainId": 97,
            "ETHChainId": 3,
            "BSCScanUrl": "https://testnet.bscscan.com/tx/",
            "ETHScanUrl": "https://ropsten.etherscan.io/tx/",
            "BSCNetworkName": "BSC Testnet",
            "ETHNetworkName": "Ropsten",
            "nis1SwapData": {
              "timeOutTransactionNis1": 20000,
              "url": "https://bctestnetswap.xpxsirius.io:7890",
              "urlExplorer": "http://testnet-explorer.nemtool.com/#/s_tx?hash=",
              "networkType": 152,
              "burnAddress": "TBF4LAZUEJMBIOC6J24D6ZGGXE5W775TX555CTTN",
              "nodes":[
                { "protocol": "https", "domain": "bctestnetswap.xpxsirius.io", "port": 7890 }
              ],
              "swapAllowedMosaics": [
                { "namespaceId": "xarcade", "name": "xar", "divisibility": 4 },
                { "namespaceId": "prx", "name": "xpx", "divisibility": 6 }
              ]
            }
          }
        }
    },
    theme: {
        "jdenticonConfig": {
             "hues": [211],
             "lightness": {
               "color": [0.32, 0.80],
               "grayscale": [0.17, 0.82]
             },
             "saturation": {
               "color": 1.00,
               "grayscale": 0.00
             },
             "backColor": "#fff"
           }
     }
}
