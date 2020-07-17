const ENV = process.env.NODE_ENV
const BACKEND = process.env.BACKEND || '127.0.0.1:8009'
//const devHost = '127.0.0.1'
//const path = require('path')
//const dist = path.resolve('./dist')
const baseUrl = ENV === 'production' 
  ? ''
  : 'http://127.0.0.1:8083'

module.exports = {
  publicPath: baseUrl,
  devServer: {
    public: '127.0.0.1:8083',
    port:"8083",
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    proxy: {
      '/api': {
        target: 'http://' + BACKEND,
        pathRewrite: {'^/api': '/'},
      }
    }
  }
}