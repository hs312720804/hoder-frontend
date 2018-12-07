const ENV = process.env.NODE_ENV
const BACKEND = process.env.BACKEND || '127.0.0.1:8009'
const devHost = '127.0.0.1'
const path = require('path')
const dist = path.resolve('./dist')
const baseUrl = ENV === 'production' 
  ? ''
  : 'http://127.0.0.1:8080'

module.exports = {
  baseUrl: baseUrl,
  devServer: {
    public: '127.0.0.1:8080',
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
