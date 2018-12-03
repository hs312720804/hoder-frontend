import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './bus'

import AppState from '@william17/vue-app-state'  

import 'admin-toolkit/dist/admin-toolkit.css'
import { GateSchemaForm } from 'admin-toolkit'

import '@/assets/icon/iconfont.css'

import './auth'

Vue.prototype.$ELEMENT = { size: "small", zIndex: 3000 };

Vue.use(ElementUI)
Vue.use(AppState)
Vue.component('GateSchemaForm', GateSchemaForm)