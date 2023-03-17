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

Vue.$httpRequestList = new Map() // 在 main.js文件中挂载：请求中的接口

Vue.use(VueI18n)
Vue.use(VCharts)
Vue.use(AdminToolkit)
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(AppState)
// Vue.component('GateSchemaForm', GateSchemaForm)
Vue.component('pagination', pagination)
Vue.prototype.$moment = moment
Vue.directive('permission', function (el, binding, vNode) {
  // if (vNode.context.$appState.permissions[binding.value] === undefined || vNode.context.$appState.$get('permissions')[binding.value] === undefined) {
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
  const numArr = number.split('.')
  // 使用结构赋值
  const [int, dotNum] = numArr
  // [...int]相当于int.split('')
  const revint = [...int].reverse()
  const len = revint.length
  const res = []
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
    const decimalPoint = dotNum.slice(0, 2) // 只取两位小数点
    // const decimalPoint = dotNum
    res.reverse().push('.', ...decimalPoint)
    // 将结果转为Number类型
    // console.log('小数的------------>',res)
    return res.join('')
  } else {
    // console.log('整数的------------>',res)
    res.reverse()
    return res.join('')
  }
}

// Vue.prototype.cc_format_number = function (str) {
//   // 如果不是字符或者数字，则直接返回
//   if (typeof str !== 'string' && typeof str !== 'number') {
//     return str
//   }
//   if (typeof str !== 'string') {
//     str = str.toString()
//   }
//   var newStr = "";
//   var count = 0;
//   // 当数字是整数
//   if (str.indexOf(".") == -1) {
//       for (var i = str.length - 1; i >= 0; i--) {
//           if (count % 3 == 0 && count != 0) {
//               newStr = str.charAt(i) + "," + newStr;
//           } else {
//               newStr = str.charAt(i) + newStr;
//           }
//           count++;
//       }
//       str = newStr ; //自动补小数点后两位
//       return str;
//   }
//   // 当数字带有小数
//   else {
//       for (var i = str.indexOf(".") - 1; i >= 0; i--) {
//           if (count % 3 == 0 && count != 0) {
//               newStr = str.charAt(i) + "," + newStr;
//           } else {
//               newStr = str.charAt(i) + newStr; //逐个字符相接起来
//           }
//           count++;
//       }
//       str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
//       return str;
//   }
// }

Vue.directive('dragscroll', function (el) {
  el.onmousedown = function (ev) {
    console.log(el)
    const disX = ev.clientX
    const disY = ev.clientY
    const originalScrollLeft = el.scrollLeft
    const originalScrollTop = el.scrollTop
    const originalScrollBehavior = el.style['scroll-behavior']
    const originalPointerEvents = el.style['pointer-events']
    // auto: 默认值，表示滚动框立即滚动到指定位置。
    el.style['scroll-behavior'] = 'auto'
    el.style.cursor = 'grabbing'
    // 鼠标移动事件是监听的整个document，这样可以使鼠标能够在元素外部移动的时候也能实现拖动
    document.onmousemove = function (ev) {
      ev.preventDefault()
      // 计算拖拽的偏移距离
      const distanceX = ev.clientX - disX
      const distanceY = ev.clientY - disY

      el.scrollTo(originalScrollLeft - distanceX, originalScrollTop - distanceY)
      console.log(originalScrollLeft - distanceX, originalScrollTop - distanceY)
      // 在鼠标拖动的时候将点击事件屏蔽掉
      el.style['pointer-events'] = 'none'
      document.body.style.cursor = 'grabbing'
    }
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null
      el.style['scroll-behavior'] = originalScrollBehavior
      el.style['pointer-events'] = originalPointerEvents
      el.style.cursor = 'grab'
    }
  }
})
