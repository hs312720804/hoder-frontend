import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './bus'

import AppState from '@william17/vue-app-state'
import AdminToolkit from '@ccprivate/admin-toolkit'
import '@/assets/icon/iconfont.css'
import './auth'
import pagination from './../components/pagination.vue'
import moment from 'moment'
import VCharts from 'v-charts'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
Vue.use(VCharts)
Vue.use(AdminToolkit)
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(AppState)
// Vue.component('GateSchemaForm', GateSchemaForm)
Vue.component('pagination', pagination)
Vue.prototype.$moment = moment
Vue.directive('permission', function (el, binding, vNode) {
  if (vNode.context.$appState.permissions[binding.value] === undefined) {
    el.style.display = 'none'
  }
})

Vue.directive('loadmore', {
  bind (el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      const CONDITION = this.scrollHeight - this.scrollTop - 20 <= this.clientHeight
      if (CONDITION) {
        binding.value.methord(binding.value.params)
      }
    })
  }
})

// Vue.prototype.cc_format_number = function (n) {
//   // 如果不是字符或者数字，则直接返回
//   if (typeof n !== 'string' && typeof n !== 'number') {
//     return n
//   }
//   if (typeof n !== 'string') {
//     n = n.toString()
//   }
//   var len = n.length
//   if (len <= 3) { return n }
//   var r = len % 3
//   const start = n.slice(0, r)
//   const end = n.slice(r).match(/\d{3}/g).join(',')
//   return r > 0 ? start + ',' + end : end
// }

Vue.prototype.cc_format_number = function (number) {
  // 如果不是字符或者数字，则直接返回
  if (typeof number !== 'string' && typeof number !== 'number') {
    return number
  }
  if (typeof number !== 'string') {
    number = number.toString()
  }
  // 将number转为String类型
  // let num = number + ''
  //  将一个浮点数分为一个数组，第一个元素是整数部分，第二个元素是小数部分
  let numArr = number.split('.')
  // 使用结构赋值
  let [int, dotNum] = numArr
  // [...int]相当于int.split('')
  let revint = [...int].reverse()
  let len = revint.length
  let res = []
  for (let i = 0; i < len; i++) {
  // 从个位开始遍历
    if ((i + 1) % 3 === 0 && i !== len - 1) {
      res.push(`,${revint[i]}`)
    } else {
      res.push(revint[i])
    }
  }
  // console.log('res------------>', res)
  // 判断是否有小数
  if (dotNum) {
    res.reverse().push('.', ...dotNum)
    // 将结果转为Number类型
    // console.log('小数的------------>',res)
    return res.join('')
  } else {
    // console.log('整数的------------>',res)
    return res.reverse().join('')
  }
}
