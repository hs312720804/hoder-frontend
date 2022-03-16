const ENV = process.env.NODE_ENV
const BACKEND = process.env.BACKEND || '172.20.151.205:8011'
// const BACKEND = process.env.BACKEND || '172.20.135.121:8011' // 圈人群二期数据
// const BACKEND = process.env.BACKEND || '172.20.135.124:8011'
// const BACKEND = process.env.BACKEND || 'localhost:9999'

// const devHost = '127.0.0.1'
// const path = require('path')
// const dist = path.resolve('./dist')
const baseUrl = ENV === 'production'
  ? ''
  : 'http://127.0.0.1:8083'

module.exports = {
  publicPath: baseUrl,

  devServer: {
    public: '127.0.0.1:8083',
    port: '8083',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: 'http://' + BACKEND,
        pathRewrite: { '^/api': '/' }
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'zh',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
