import { Message, Notification, MessageBox } from 'element-ui'
import router from '@/router'
import Vue from 'vue'

function filterContentFromMessage (message) {
  let returnmessage = false
  // your code
  const keyValue = {
    NullPointException: '空指针异常',
    ArrayIndexOutOfBoundsException: '数组越界异常',
    ClassCastException: '强制类型转换异常',
    NumberFormatException: '数字格式化异常',
    InputMismatchException: '输入类型不匹配异常',
    ArithmeticException: '算数运算符异常',
    IndexOutOfBoundsException: '索引越界异常',
    SQLException: 'SQL异常',
    OutOfMemoryError: '内存溢出异常',
    IOException: 'IO异常',
    FileNotFoundException: '找不到文件异常',
    Other: '其他异常信息'
  }
  // 根据【筛选规则】匹配得出的
  for (const key in keyValue) {
    if (message.includes(key)) {
      returnmessage = keyValue[key]
      break
    }
  }
  // 能匹配，就返回匹配结果，否则返回 false
  return returnmessage
}
const a = filterContentFromMessage(',,,SQLException,,,NullPointException')
console.log('aaa--->', a)

function onMessage (options) {
  const { message } = options

  // 正文，匹配【筛选规则】
  // filterContentFromMessage() 方法待完善
  let content = filterContentFromMessage(message)

  // 【查看】按钮是否展示
  let hasOpen = false

  // 无法匹配【筛选规则】
  if (!content) {
    if (message.length > 100) {
      content = '/xxx 异常'
      // 【查看】按钮
      // 显示条件: 无法匹配规则 并且 超过100字
      hasOpen = true
    } else {
      content = message
    }
  }

  const filterMessage = `
    <p class='message-div' style="max-height:300px; overflow: auto; transform: all 0.5s">
      ${content}
      ${hasOpen ? '<span style="color:#0066ff; cursor:pointer"> 查看</span>' : ''}
    </p>`

  const notify = Notification({
    title: '服务异常', // 默认
    dangerouslyUseHTMLString: true,
    message: filterMessage,
    type: 'error'
  })
  // 是否有【查看】按钮
  if (hasOpen) {
    notify.$el.querySelector('span').onclick = () => {
      // 点击后关闭notify 不需要的话可删掉
      notify.close()
      // notify.$el.querySelector('.message-div').innerHTML = '所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息'
      // onmessage({
      //   ...options,
      //   hasOpen: false,
      //   message: '所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息'
      // })
      MessageBox({
        ...options,
        title: content,
        // message: '所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息所有的报错信息'
        message: `
        <p class='message-div' style="max-height:500px; overflow: auto;">
          ${message}
        </p>`,
        dangerouslyUseHTMLString: true,
        confirmButtonText: '知道了'
      })
    }
  }
}

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
              // onMessage({
              //   message: error.message
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
