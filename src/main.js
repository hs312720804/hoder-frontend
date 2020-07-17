import Vue from 'vue'
import './plugins'
import App from './App.vue'
import router from './router/index'
import './services'
import '@/assets/global.styl'
import 'echarts'
import 'echarts/map/js/china'
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
  appState: {prefix: 'HODER/'}
}).$mount('#app')
