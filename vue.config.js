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
  assetsDir: './assets/'
}