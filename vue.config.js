const ENV = process.env.NODE_ENV
// const BACKEND = process.env.BACKEND || '172.20.151.205:8011'
// const BACKEND = process.env.BACKEND || '172.20.148.34:8011'
// const BACKEND = process.env.BACKEND || '172.20.150.209:8011'
// const BACKEND = process.env.BACKEND || 'beta-mgr-hoder.skysrt.com/api'
const BACKEND = process.env.BACKEND || 'mgr-hoder.skysrt.com/api'
// const BACKEND = process.env.BACKEND || 'demo-api-hoder.skysrt.com'
// const BACKEND = process.env.BACKEND || '172.20.135.121:8011' // 动态人群 3 期
// const BACKEND = process.env.BACKEND || '172.20.148.31:8011' // 许成卿 - 运营分析
// const BACKEND = process.env.BACKEND || ' 172.20.148.16:8011' // 光建

// const BACKEND = process.env.BACKEND || '172.20.135.124:8011'
// const BACKEND = process.env.BACKEND || 'localhost:9999'

// const devHost = '127.0.0.1'
// const path = require('path')
// const dist = path.resolve('./dist')

const baseUrl = ENV === 'production'
  ? '/'
  : '/'

const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
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
      },
      '/dev_cms': {
        // target: 'http://172.20.151.197:9080'
        target: 'https://api.cloud.coocaa.com'
        // pathRewrite: { '^/dev_cms': '/' }
      }
    },
    historyApiFallback: true
  },
  runtimeCompiler: true, // 配置 支持编译 template 模板
  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'zh',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@antvGraph', resolve('src/components/antvGraph/src'))
  },
  productionSourceMap: false, // 关闭生产环境的sourceMap 文件
  transpileDependencies: [
    '@ccms/cms-engine'
  ]
  // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ]

  // "analyzer": "use_analyzer=true npm run serve",

}
