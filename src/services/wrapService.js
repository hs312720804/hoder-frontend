import { Message, Notification, MessageBox } from 'element-ui'
import router from '@/router'
import Vue from 'vue'
import onMessage from './utils'

function wrapService (service) {
  const $service = {
    service
  }
  Object.keys(service).forEach((key) => {
    if (typeof service[key] === 'function') {
      $service[key] = async (args, message) => {
        return service[key](args)
          .then((result) => {
            if (message) {
              Message({
                title: '操作成功',
                type: 'success',
                message
              })
            }
            return result
          })
          .catch((error) => { // 错误处理
            if (error && error.code && error.code === '2000') { // 业务错误
              Message({
                type: 'error',
                message: error.message
              })

              // const msg = 'NullPointException##################'
              // const msg = '操作失败'
              // const msg = '操作失败操作失失失败操作失败操作失败操作失败操作失败操作失败操作失败操作失败操作失败操操作失败操作失败操作失败操作失败操作失失失败操作失败操作失败操作失败操作失败操作失败操作失败操作失败操作失败操操作失败操作失败操作失败操作失败操作失失失败操作失败操作失败操作失败操作失败操作失败操作失败操作失败操作失败操操作失败操作失败操作失败操作失败操作失失失败操作失败操作失败操作失败操作失败操作失败操作失败操作失败操作失败操操作失败操作失败操作失败'
              // onMessage({
              //   message: error.message,
              //   apiUrl: `${key}`
              // })

              return Promise.reject(error)
            } else { // 网络错误
              let message = error.message
              // 是否为 token 失效
              const tokenFailure = typeof error.message === 'string' && error.message.indexOf('401') > -1

              console.log('tokenFailure--->', tokenFailure)
              console.log('errormessage--->', message)

              if (tokenFailure) {
                // 此处不需要提醒，因为在路由守卫中会提示
                // message = '登录超时，请重新登录'
                message = null
              }
              if (message) {
                Notification.error({
                  message: message
                })
              }
              if (tokenFailure) { // token 失效退出登录
                router.push({ name: 'login' })
              }
              // // location.href = location.origin + location.pathname + '#/login'
              // // router.push({ name: '/login', query: { redirect: location.pathname } })
              // console.log('location.pathname123141241----', JSON.parse(JSON.stringify(location)))
              // console.log('location.pathname123141241----', JSON.parse(JSON.stringify(location)))
              // console.log('this----', this)
              // const hash = location.hash.split('#')
              // // router.push({ name: 'login', query: { redirect: hash && hash[1] ? hash[1] : '/' } })
            }
          })
      }
    } else {
      $service[key] = service[key]
    }
  })
  return $service
}

export default wrapService
