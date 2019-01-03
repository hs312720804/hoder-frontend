const ENV = process.env.NODE_ENV
const BACKEND = process.env.BACKEND || '172.20.139.182:8009'
const devHost = '172.20.139.182'
const path = require('path')
const dist = path.resolve('./dist')
const baseUrl = ENV === 'production' 
  ? ''
  : 'http://172.20.139.182:8083'

module.exports = {
  baseUrl: baseUrl,
  devServer: {
    public: 'http://172.20.139.182:8083',
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
