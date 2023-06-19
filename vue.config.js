const ENV = process.env.NODE_ENV

const BACKEND = process.env.BACKEND || '172.20.151.197:9080'
// const BACKEND = process.env.BACKEND || '172.20.151.205:8011'
const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || '8686'
const isDev = ENV === 'development'
const apiPrefix = process.env.VUE_APP_API_PREFIX
const baseUrl = isDev ? '/' : `/${apiPrefix}/hoder_web/`

const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  publicPath: baseUrl,
  devServer: {
    host: HOST,
    port: PORT,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    client: {
      overlay: {
        errors: false,
        warnings: false,
        runtimeErrors: false
      }
    },
    proxy: {
      // '/api': {
      //   target: 'http://' + BACKEND,
      //   pathRewrite: { '^/api': '/' }
      // },
      '/violet-api': {
        target: 'http://' + BACKEND,
        pathRewrite: { '^/violet-api': '/' }
      },
      '/dev_cms': {
        // target: 'http://172.20.151.197:9080'
        target: 'https://api.cloud.coocaa.com'
        // pathRewrite: { '^/dev_cms': '/' }
      }
    },
    historyApiFallback: true
  },

  transpileDependencies: [
    '@cseed/ui-lowcode-engine',
    '@cseed/ui-menu-designer',
    '@ccms/cms-engine'
  ],

  runtimeCompiler: true, // 配置 支持编译 template 模板
  pluginOptions: {
    cseedFrame: {
      frame: '@ccprivate/framework-saas-mirco',
      temp: path.resolve('./.temp')
    },
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
  productionSourceMap: false // 关闭生产环境的sourceMap 文件
  // transpileDependencies: [
  //   '@ccms/cms-engine'
  // ]
  // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ]

  // "analyzer": "use_analyzer=true npm run serve",

}
