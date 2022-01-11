// vue.config.js

let publicPath = '/';

switch(process.env.NODE_ENV){
    case 'staging':
        publicPath = '/web-wallet-vuejs'
        break;
    case 'production':
        publicPath = '/'
        break;
    case 'development':
        publicPath = '/'
        break;
}


module.exports = {
    publicPath: publicPath,
    assetsDir: './assets/',
    devServer: {
      host: 'localhost',
      proxy: 'https://bctestnetswap.xpxsirius.io/',
    },
    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: '/assets/locales',
        enableLegacy: false,
        runtimeOnly: false,
        compositionOnly: false,
        fullInstall: true
      }
    },
    chainWebpack: config => {
      config
          .plugin('html')
          .tap(args => {
              args[0].title = "ProximaX Web Wallet";
              return args;
          })
    }
}
