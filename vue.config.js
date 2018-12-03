const ENV = process.env.NODE_ENV
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
    }
  },
  chainWebpack: config => {
    if(config.plugins.has('extract-css')) {
      const extractCSSPlugin = config.plugin('extract-css')
      extractCSSPlugin && extractCSSPlugin.tap(() => [{
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css'
      }])
    }
    config.plugins.delete('prefetch')
  },
  configureWebpack: {
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js'
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    }
  }
}
