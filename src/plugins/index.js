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
