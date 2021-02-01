import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './bus'

import AppState from '@william17/vue-app-state'

import 'admin-toolkit/dist/admin-toolkit.css'
import { GateSchemaForm } from 'admin-toolkit'

import '@/assets/icon/iconfont.css'
import './auth'
import pagination from './../components/pagination.vue'
import moment from 'moment'
import VCharts from 'v-charts'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
Vue.use(VCharts)
Vue.use(ElementUI,{ size: 'small', zIndex: 3000 })
Vue.use(AppState)
Vue.component('GateSchemaForm', GateSchemaForm)
Vue.component('pagination', pagination)
Vue.prototype.$moment = moment
Vue.directive('permission', function (el, binding,vNode) {
    if(vNode.context.$appState.permissions[binding.value]===undefined) {
        el.style.display = 'none'
    }
  })
Vue.prototype.cc_format_number = function(n) {
    // 如果不是字符或者数字，则直接返回
    if (typeof n !== 'string' && typeof n !== 'number') {
        return n
    }
    if(typeof n !== 'string') {
        n = n.toString()
    }
    var len = n.length
    if (len <= 3) { return n }
    var r = len % 3
    const start = n.slice(0, r)
    const end = n.slice(r).match(/\d{3}/g).join(',')
    return r > 0 ? start + ',' + end : end
}
