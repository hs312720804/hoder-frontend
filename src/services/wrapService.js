import { Message, Notification } from 'element-ui'
function wrapService (service) {
  const $service = {
    service
  }
  Object.keys(service).forEach((key) => {
    console.log('key', key)
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
          .catch((error) => {
            Notification({
              title: '操作失败',
              type: 'error',
              message: error.message
            })
            return Promise.reject(error)
          })
      }
    } else {
      $service[key] = service[key]
    }
  })
  return $service
}

export default wrapService
