import { Message, Notification } from 'element-ui'
import router from '@/router'

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
              return Promise.reject(error)
            } else { // 网络错误
              Notification.error({
                // title: '操作失败',
                message: error.message
              })
              // location.href = location.origin + location.pathname + '#/login'
              // router.push({ name: '/login', query: { redirect: location.pathname } })
              console.log('location.pathname123141241----', JSON.parse(JSON.stringify(location)))
              console.log('location.pathname123141241----', JSON.parse(JSON.stringify(location)))
              console.log('this----', this)
              const hash = location.hash.split('#')

              // router.push({ name: 'login', query: { redirect: hash && hash[1] ? hash[1] : '/' } })
              router.push({ name: 'login' })
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
