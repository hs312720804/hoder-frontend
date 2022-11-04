import CSeedFrameSSO from 'cseed-frame/plugins/_sso'
import Service from '@/services'
import plugins from '@/plugins'
import 'echarts'
import 'echarts/map/js/china'
import adminToolkit from '@cseed/admin-toolkit'
import adminToolkitLang from '@cseed/admin-toolkit/lib/lang/index'
import '@/assets/global.styl'
import { createOperationRender } from '@/utils/component'
function addSaasTemplateLang (i18n) {
  // Object.keys(loadSaasTemplateMessages).forEach(key => {
  //   console.log(key, loadSaasTemplateMessages[key])
  //   i18n.mergeLocaleMessage(key, loadSaasTemplateMessages[key])
  // })
  const adminToolkitMessages = adminToolkitLang?.messages
  Object.keys(adminToolkitMessages).forEach(key => {
    i18n.mergeLocaleMessage(key, adminToolkitMessages[key])
  })
}
export default ({
  Vue, //  Vue 构造函数
  options, // 附加到 Vue 根实例的一些选项
  router, // 当前应用的路由实例
  store, // 当前应用的vuex实例
  i18n, // 当前应用的 i18n 实例
  qiankunProps // 乾坤
}) => {
  Vue.use(Service)
  Vue.use(plugins)
  Vue.use(CSeedFrameSSO)
  Vue.use(adminToolkit)
  Vue.prototype.$createOperationRender = createOperationRender
  // 做一些应用级别的优化
  addSaasTemplateLang(i18n)
}
