import Vue from 'vue'
import './plugins'
import App from './App.vue'
import router from './router/index'
import store from './store' // vuex引入
import './services'
import '@/assets/global.styl'
import 'echarts'
import 'echarts/map/js/china'
// import i18n from './i18n'
import i18n from './lang/index'
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
  i18n,
  store,
  appState: {prefix: 'HODER/'}
}).$mount('#app')
