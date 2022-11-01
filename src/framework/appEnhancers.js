import CSeedFrameSSO from 'cseed-frame/plugins/_sso'
import Service from '@/services'
import 'echarts'
import 'echarts/map/js/china'
export default ({
  Vue, //  Vue 构造函数
  options, // 附加到 Vue 根实例的一些选项
  router, // 当前应用的路由实例
  store, // 当前应用的vuex实例
  i18n, // 当前应用的 i18n 实例
  qiankunProps // 乾坤
}) => {
  Vue.use(Service)
  Vue.use(CSeedFrameSSO)
}
